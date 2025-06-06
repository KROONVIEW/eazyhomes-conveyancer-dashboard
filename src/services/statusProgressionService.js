// Status Progression Service - Automatic Matter Status Updates
import { MATTER_STATUS, MATTER_STAGES } from './matterService';

// Status progression rules and logic
export class StatusProgressionService {
  constructor() {
    // Define the status progression flow
    this.statusFlow = {
      [MATTER_STATUS.DRAFT]: {
        next: MATTER_STATUS.IN_PROGRESS,
        condition: 'hasBasicInfo',
        autoProgress: true
      },
      [MATTER_STATUS.IN_PROGRESS]: {
        next: MATTER_STATUS.AWAITING_SIGNATURE,
        condition: 'ficaCompleted',
        autoProgress: true
      },
      [MATTER_STATUS.AWAITING_SIGNATURE]: {
        next: MATTER_STATUS.REGISTERED,
        condition: 'documentsSignedAndVerified',
        autoProgress: true
      },
      [MATTER_STATUS.REGISTERED]: {
        next: MATTER_STATUS.COMPLETED,
        condition: 'transferCompleted',
        autoProgress: false // Manual completion
      }
    };

    // Progress percentage mapping for each status
    this.statusProgressMapping = {
      [MATTER_STATUS.DRAFT]: 10,
      [MATTER_STATUS.IN_PROGRESS]: 40,
      [MATTER_STATUS.AWAITING_SIGNATURE]: 70,
      [MATTER_STATUS.REGISTERED]: 90,
      [MATTER_STATUS.COMPLETED]: 100
    };
  }

  // Check if a matter should progress to the next status
  shouldProgressStatus(matter) {
    const currentStatus = matter.status;
    const progressRule = this.statusFlow[currentStatus];

    if (!progressRule || !progressRule.autoProgress) {
      return { shouldProgress: false, reason: 'No auto-progression rule' };
    }

    const conditionMet = this.checkCondition(matter, progressRule.condition);
    
    return {
      shouldProgress: conditionMet.met,
      nextStatus: progressRule.next,
      nextProgress: this.statusProgressMapping[progressRule.next],
      reason: conditionMet.reason,
      nextStage: this.getStageForStatus(progressRule.next)
    };
  }

  // Check specific conditions for status progression
  checkCondition(matter, conditionType) {
    switch (conditionType) {
      case 'hasBasicInfo':
        return {
          met: matter.client && matter.address && matter.type,
          reason: matter.client && matter.address && matter.type 
            ? 'Basic matter information complete' 
            : 'Missing basic matter information'
        };

      case 'ficaCompleted':
        const buyerFica = matter.ficaStatus?.buyer?.completed || false;
        const sellerFica = matter.ficaStatus?.seller?.completed || false;
        return {
          met: buyerFica && sellerFica,
          reason: buyerFica && sellerFica 
            ? 'FICA completed for both buyer and seller' 
            : `FICA pending: ${!buyerFica ? 'buyer' : ''} ${!sellerFica ? 'seller' : ''}`.trim()
        };

      case 'documentsSignedAndVerified':
        const requiredDocs = ['Offer to Purchase', 'Sale Agreement'];
        const availableDocs = matter.documents || [];
        const signedDocs = availableDocs.filter(doc => 
          requiredDocs.includes(doc.type) && doc.metadata?.signed === true
        );
        return {
          met: signedDocs.length >= requiredDocs.length,
          reason: signedDocs.length >= requiredDocs.length
            ? 'All required documents signed and verified'
            : `Missing signed documents: ${requiredDocs.filter(req => 
                !signedDocs.some(signed => signed.type === req)
              ).join(', ')}`
        };

      case 'transferCompleted':
        return {
          met: matter.stage === MATTER_STAGES.FINAL_REGISTRATION,
          reason: matter.stage === MATTER_STAGES.FINAL_REGISTRATION
            ? 'Transfer registration completed'
            : 'Transfer registration still pending'
        };

      default:
        return { met: false, reason: 'Unknown condition' };
    }
  }

  // Get the appropriate stage for a status
  getStageForStatus(status) {
    const stageMapping = {
      [MATTER_STATUS.DRAFT]: MATTER_STAGES.INITIAL_CONSULTATION,
      [MATTER_STATUS.IN_PROGRESS]: MATTER_STAGES.OFFER_TO_PURCHASE,
      [MATTER_STATUS.AWAITING_SIGNATURE]: MATTER_STAGES.AWAITING_BANK_CLEARANCE,
      [MATTER_STATUS.REGISTERED]: MATTER_STAGES.FINAL_REGISTRATION,
      [MATTER_STATUS.COMPLETED]: MATTER_STAGES.FINAL_REGISTRATION
    };
    return stageMapping[status] || MATTER_STAGES.INITIAL_CONSULTATION;
  }

  // Simulate document signing (for testing)
  simulateDocumentSigning(matter, documentType) {
    const documents = matter.documents || [];
    const docIndex = documents.findIndex(doc => doc.type === documentType);
    
    if (docIndex !== -1) {
      documents[docIndex] = {
        ...documents[docIndex],
        metadata: {
          ...documents[docIndex].metadata,
          signed: true,
          signedAt: new Date().toISOString(),
          signedBy: 'client'
        }
      };
      
      console.log(`📝 Document "${documentType}" marked as signed`);
      return { ...matter, documents };
    }
    
    return matter;
  }

  // Simulate FICA completion (for testing)
  simulateFicaCompletion(matter, party) {
    const ficaStatus = matter.ficaStatus || {
      buyer: { completed: false, documents: [] },
      seller: { completed: false, documents: [] }
    };

    ficaStatus[party] = {
      completed: true,
      documents: ['ID Copy', 'Proof of Address', 'Bank Statement'],
      completedAt: new Date().toISOString()
    };

    console.log(`✅ FICA completed for ${party}`);
    return { ...matter, ficaStatus };
  }

  // Get status color class for UI
  getStatusColorClass(status) {
    const colorMapping = {
      [MATTER_STATUS.DRAFT]: 'text-gray-600',
      [MATTER_STATUS.IN_PROGRESS]: 'text-blue-600', 
      [MATTER_STATUS.AWAITING_SIGNATURE]: 'text-orange-600',
      [MATTER_STATUS.REGISTERED]: 'text-green-600',
      [MATTER_STATUS.COMPLETED]: 'text-green-800',
      [MATTER_STATUS.DELAYED]: 'text-red-600',
      [MATTER_STATUS.CANCELLED]: 'text-gray-500'
    };
    return colorMapping[status] || 'text-gray-600';
  }

  // Get next possible actions for a matter
  getAvailableActions(matter) {
    const actions = [];
    const currentStatus = matter.status;

    // Always allow manual status updates
    actions.push({
      type: 'manual_status_update',
      label: 'Update Status',
      description: 'Manually change matter status'
    });

    // Status-specific actions
    switch (currentStatus) {
      case MATTER_STATUS.DRAFT:
        actions.push({
          type: 'complete_basic_info',
          label: 'Complete Basic Info',
          description: 'Add client, address, and matter type'
        });
        break;

      case MATTER_STATUS.IN_PROGRESS:
        if (!matter.ficaStatus?.buyer?.completed) {
          actions.push({
            type: 'complete_buyer_fica',
            label: 'Complete Buyer FICA',
            description: 'Upload and verify buyer FICA documents'
          });
        }
        if (!matter.ficaStatus?.seller?.completed) {
          actions.push({
            type: 'complete_seller_fica',
            label: 'Complete Seller FICA',
            description: 'Upload and verify seller FICA documents'
          });
        }
        break;

      case MATTER_STATUS.AWAITING_SIGNATURE:
        actions.push({
          type: 'request_signatures',
          label: 'Request Signatures',
          description: 'Send documents for client signatures'
        });
        actions.push({
          type: 'simulate_signing',
          label: '🧪 Simulate Signing',
          description: 'Test: Mark documents as signed'
        });
        break;

      case MATTER_STATUS.REGISTERED:
        actions.push({
          type: 'finalize_transfer',
          label: 'Finalize Transfer',
          description: 'Complete the property transfer process'
        });
        break;
    }

    return actions;
  }

  // Execute an action on a matter
  async executeAction(matter, actionType, matterService) {
    console.log(`🎬 Executing action: ${actionType} on matter ${matter.id}`);

    switch (actionType) {
      case 'complete_buyer_fica':
        const updatedMatterBuyer = this.simulateFicaCompletion(matter, 'buyer');
        await matterService.updateFicaStatus(matter.id, 'buyer', true, ['ID Copy', 'Proof of Address', 'Bank Statement']);
        return updatedMatterBuyer;

      case 'complete_seller_fica':
        const updatedMatterSeller = this.simulateFicaCompletion(matter, 'seller');
        await matterService.updateFicaStatus(matter.id, 'seller', true, ['ID Copy', 'Proof of Address', 'Bank Statement']);
        return updatedMatterSeller;

      case 'simulate_signing':
        let updatedMatter = this.simulateDocumentSigning(matter, 'Offer to Purchase');
        updatedMatter = this.simulateDocumentSigning(updatedMatter, 'Sale Agreement');
        // Update the matter with signed documents
        await matterService.updateMatter(matter.id, { documents: updatedMatter.documents });
        return updatedMatter;

      default:
        console.log(`⚠️ Unknown action: ${actionType}`);
        return matter;
    }
  }
}

export default new StatusProgressionService(); 