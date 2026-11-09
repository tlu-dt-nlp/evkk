import { useCallback, useMemo, useState } from 'react';

export default function useAdminTextsPage() {
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(true);
  const [results, setResults] = useState([]);
  const [selectedTextId, setSelectedTextId] = useState(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const rows = useMemo(() => (
    results.map(row => ({
      textId: row.text_id,
      createdAt: row._meta?.created_at,
      title: row.property_value
    }))
  ), [results]);

  const handleResults = useCallback((response) => {
    setResults(response);
    setIsAccordionExpanded(response.length <= 0);
  }, []);

  const handleOpenDetails = useCallback((textId) => {
    setSelectedTextId(textId);
  }, []);

  const handleTriggerRefetch = useCallback(() => {
    setRefetchTrigger(prev => prev + 1);
  }, []);

  const handleSetIsOpen = useCallback((isOpen) => {
    !isOpen && setSelectedTextId(null);
  }, []);

  return {
    isAccordionExpanded,
    setIsAccordionExpanded,
    rows,
    selectedTextId,
    refetchTrigger,
    handleResults,
    handleOpenDetails,
    handleTriggerRefetch,
    handleSetIsOpen
  };
}
