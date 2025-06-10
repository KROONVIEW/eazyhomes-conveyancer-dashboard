// Custom Hook for Matter Workflow Integration
import { useState, useEffect, useCallback } from 'react';
import matterService from '../services/matterService';
import documentService from '../services/documentService';
import communicationService from '../services/communicationService';

export const useMatterWorkflow = () => {
  const [matters, setMatters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set up real-time listener on mount
  useEffect(() => {
    let unsubscribe;

    const setupRealTimeSync = () => {
      try {
        setLoading(true);
        
        // Set up real-time listener
        unsubscribe = matterService.subscribeToMatters((updatedMatters) => {console.log('📊 Updated matters data:', updatedMatters.map(m => ({ id: m.id, progress: m.progress, updatedAt: m.updatedAt })));
          setMatters(updatedMatters);
          setError(null);
          setLoading(false);
        });

      } catch (err) { // Error logging removed for production
        setError(err.message);
        // Fallback to loading matters once
        loadMattersOnce();
      }
    };

    setupRealTimeSync();

    // Cleanup listener on unmount
    return () => {
      if (unsubscribe) {unsubscribe();
      }
    };
  }, []);

  const loadMattersOnce = async () => {
    try {
      setLoading(true);
      const mattersData = await matterService.getAllMatters();
      setMatters(mattersData);
      setError(null);
    } catch (err) { // Error logging removed for production
      setError(err.message);
      // Fallback to mock data
      setMatters(matterService.getMockMatters());
    } finally {
      setLoading(false);
    }
  };

  const createMatter = async (matterData) => {
    const newMatter = await matterService.createMatter(matterData);
    
    // Real-time listener will automatically update the UI
    // But we can also update local state immediately for better UX
    setMatters(prev => {
      const exists = prev.find(m => m.id === newMatter.id || m.firebaseId === newMatter.firebaseId);
      if (exists) {
        return prev; // Avoid duplicates
      }
      return [newMatter, ...prev];
    });
    
    return newMatter;
  };

  const updateMatterStatus = async (matterId, status, stage, progress) => {
    // Don't update local state immediately - let the real-time listener handle it
    // This prevents conflicts between optimistic updates and real-time sync
    await matterService.updateMatterProgress(matterId, status, stage, progress);
    return true;
  };

  const uploadDocument = async (file, matterId, documentType, category) => {
    const document = await documentService.uploadDocument(file, matterId, documentType, category);
    
    // Update matter with new document
    await matterService.addDocumentToMatter(matterId, document);
    
    // Update local state to reflect the document upload
    setMatters(prev => prev.map(matter => 
      matter.id === matterId || matter.firebaseId === matterId
        ? { 
            ...matter, 
            documents: [...(matter.documents || []), document],
            updatedAt: new Date().toISOString()
          }
        : matter
    ));
    
    return document;
  };

  const uploadFicaDocument = async (file, matterId, party, documentType) => {
    const result = await documentService.uploadFicaDocument(file, matterId, party, documentType);
    
    // Update local FICA status
    setFicaStatus(prev => ({
      ...prev,
      [party]: result.ficaStatus
    }));

    return result;
  };

  const sendMessage = async (matterId, content, messageType = 'text') => {
    // Get or create conversation for the matter
    const conversation = await communicationService.getOrCreateConversation(matterId, {
      conveyancer: ['current-user'], // Replace with actual user ID
      buyer: ['buyer-id'],
      seller: ['seller-id']
    });
    
    const message = await communicationService.sendMessage(
      conversation.firebaseId,
      matterId,
      'current-user', // Replace with actual user ID
      'conveyancer',
      content,
      messageType
    );
    
    return message;
  };

  const getMatterDocuments = async (matterId) => {
    try {
      return await documentService.getDocumentsByMatter(matterId);
    } catch (err) { // Error logging removed for production
      return documentService.getMockDocuments(matterId);
    }
  };

  const getFicaStatus = async (matterId, party) => {
    try {
      return await documentService.checkFicaCompletion(matterId, party);
    } catch (err) { // Error logging removed for production
      return {
        completed: false,
        completedCount: 0,
        totalRequired: 3,
        missingDocuments: ['ID Copy', 'Proof of Address', 'Bank Statement']
      };
    }
  };

  return {
    // Data
    matters,
    loading,
    error,
    
    // Actions
    loadMattersOnce,
    createMatter,
    updateMatterStatus,
    uploadDocument,
    uploadFicaDocument,
    sendMessage,
    getMatterDocuments,
    getFicaStatus,
    
    // Services (for direct access if needed)
    matterService,
    documentService,
    communicationService
  };
};

// Hook for real-time matter updates
export const useMatterRealtime = (matterId) => {
  const [matter, setMatter] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!matterId) {return;}

    let unsubscribeMessages;

    const loadMatterData = async () => {
      try {
        // Load matter details
        const matterData = await matterService.getMatterById(matterId);
        setMatter(matterData);

        // Set up real-time message listener
        const conversation = await communicationService.getOrCreateConversation(matterId, {
          conveyancer: ['current-user'],
          buyer: ['buyer-id'],
          seller: ['seller-id']
        });

        unsubscribeMessages = communicationService.subscribeToMessages(
          conversation.firebaseId,
          setMessages
        );

      } catch (err) { // Error logging removed for production
        // Fallback to mock data
        setMatter(matterService.getMockMatters().find(m => m.id === matterId));
        setMessages(communicationService.getMockMessages('mock-conversation'));
      } finally {
        setLoading(false);
      }
    };

    loadMatterData();

    return () => {
      if (unsubscribeMessages) {
        unsubscribeMessages();
      }
    };
  }, [matterId]);

  return {
    matter,
    messages,
    loading
  };
};

// Hook for FICA workflow
export const useFicaWorkflow = (matterId) => {
  const [ficaStatus, setFicaStatus] = useState({
    buyer: { completed: false, documents: [] },
    seller: { completed: false, documents: [] }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!matterId) {return;}

    const loadFicaStatus = async () => {
      try {
        const [buyerStatus, sellerStatus] = await Promise.all([
          documentService.checkFicaCompletion(matterId, 'buyer'),
          documentService.checkFicaCompletion(matterId, 'seller')
        ]);

        setFicaStatus({
          buyer: buyerStatus,
          seller: sellerStatus
        });
      } catch (err) { // Error logging removed for production
      } finally {
        setLoading(false);
      }
    };

    loadFicaStatus();
  }, [matterId]);

  const uploadFicaDocument = async (file, party, documentType) => {
    const result = await documentService.uploadFicaDocument(file, matterId, party, documentType);
    
    // Update local FICA status
    setFicaStatus(prev => ({
      ...prev,
      [party]: result.ficaStatus
    }));

    return result;
  };

  const verifyDocument = async (documentId, verifiedBy) => {
    await documentService.verifyFicaDocument(documentId, verifiedBy);
    
    // Reload FICA status
    const [buyerStatus, sellerStatus] = await Promise.all([
      documentService.checkFicaCompletion(matterId, 'buyer'),
      documentService.checkFicaCompletion(matterId, 'seller')
    ]);

    setFicaStatus({
      buyer: buyerStatus,
      seller: sellerStatus
    });
  };

  return {
    ficaStatus,
    loading,
    uploadFicaDocument,
    verifyDocument
  };
}; 