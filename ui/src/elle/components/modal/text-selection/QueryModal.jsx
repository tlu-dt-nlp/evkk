import { useRef, useState } from 'react';
import { useGetQueryResults } from '../../../hooks/service/TextService';
import ModalBase from '../ModalBase';
import PublishedTextSearchForm from './PublishedTextSearchForm';
import QueryResultsModal from './QueryResultsModal';

export default function QueryModal({ isQueryOpen, setIsQueryOpen }) {

  const mainModalRef = useRef();
  const [results, setResults] = useState([]);
  const [isQueryResponsePage, setIsQueryResponsePage] = useState(false);
  const [previousSelectedIds, setPreviousSelectedIds] = useState({});
  const { getQueryResults } = useGetQueryResults();

  const handleResults = (response) => {
    setResults(response);
    setIsQueryResponsePage(response.length > 0);
  }

  return (
    <ModalBase
      isOpen={isQueryOpen}
      setIsOpen={setIsQueryOpen}
      title="query_choose_texts"
      modalRef={mainModalRef}
    >
      {isQueryResponsePage ? (
        <QueryResultsModal
          results={results}
          setIsQueryResponsePage={setIsQueryResponsePage}
          setPreviousSelectedIds={setPreviousSelectedIds}
          previousSelectedIds={previousSelectedIds}
          setIsQueryOpen={setIsQueryOpen}
        />
      ) : (
        <PublishedTextSearchForm
          fetchTexts={getQueryResults}
          onResults={handleResults}
          scrollRef={mainModalRef}
        />
      )}
    </ModalBase>
  );
}
