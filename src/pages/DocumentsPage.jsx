import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DocumentsPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/documents/upload', { replace: true });
  }, [navigate]);
  return null;
};

export default DocumentsPage; 