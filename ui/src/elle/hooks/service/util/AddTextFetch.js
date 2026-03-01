import { useEffect } from 'react';
import { useAddText } from '../TextService';

const AddTextFetch = ({ request, onComplete, onSuccess, onFailure }) => {
  const { addText } = useAddText();

  useEffect(() => {
    addText(request, onComplete, onSuccess, onFailure);
  }, [addText, onComplete, onSuccess, onFailure, request]);

  return null;
};

export default AddTextFetch;
