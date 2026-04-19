import { useEffect } from 'react';
import { useAddText } from '../TextService';
import { useAnalytics } from '../../../../analytics.jsx';

const AddTextFetch = ({ request, onComplete, onSuccess, onFailure }) => {
  const { addText } = useAddText();
  const { trackTextSubmit } = useAnalytics();

  useEffect(() => {
    trackTextSubmit();
    addText(request, onComplete, onSuccess, onFailure);
  }, [addText, onComplete, onSuccess, onFailure, request, trackTextSubmit]);

  return null;
};

export default AddTextFetch;
