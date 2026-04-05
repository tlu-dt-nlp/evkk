import { createRef, useState } from 'react';
import './styles/TextUpload.css';
import { Button, Tooltip } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useTranslation } from 'react-i18next';
import '../translations/i18n';
import { DefaultButtonStyle } from '../const/StyleConstants';
import ModalBase from './modal/ModalBase';
import { useGetTextFromFile } from '../hooks/service/TextService';

export default function TextUpload({
                                     sendTextFromFile,
                                     disableStyles = false,
                                     className = ''
                                   }) {

  const [modalOpen, setModalOpen] = useState(false);
  const [uploadButtonDisabled, setUploadButtonDisabled] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const formDataElement = createRef();
  const fileInputRef = createRef();
  const { t } = useTranslation();
  const { getTextFromFile } = useGetTextFromFile();

  const handleFileUpload = () => {
    getTextFromFile(new FormData(formDataElement.current))
      .then(response => sendTextFromFile(response))
      .catch(() => sendTextFromFile(''));
    setUploadButtonDisabled(true);
    setSelectedFiles([]);
    setModalOpen(false);
  };

  const handleFileChange = () => {
    const files = Array.from(fileInputRef.current.files);
    setSelectedFiles(files.map(file => file.name));
    setUploadButtonDisabled(files.length === 0);
  };

  return (
    <div className={`container textfield-upload-component ${!disableStyles ? 'default-styles' : ''} ${className}`}>
      <Tooltip
        title={t('textupload_secondary_modal_tooltip')}
        placement="top"
      >
        <FileUploadIcon onClick={() => setModalOpen(true)} />
      </Tooltip>
      <ModalBase
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        innerClassName="text-upload-modal"
        title="textupload_secondary_modal_title"
      >
        <form
          encType="multipart/form-data"
          method="post"
          ref={formDataElement}
        >
          <div className="d-flex flex-column align-items-center justify-content-between">
            <div>
              <Button
                sx={DefaultButtonStyle}
                component="label"
                htmlFor="fileInput"
                variant="contained"
              >
                {t('textupload_secondary_modal_choose_files')}
              </Button>
            </div>
            <div className="file-name-container">
              {selectedFiles.length > 0 && (
                <>
                  <div className="chosen-files-title">
                    {t('textupload_secondary_modal_chosen_files')}
                  </div>
                  {selectedFiles.map((fileName, index) => (
                    <div
                      key={index}
                      className="file-name"
                    >
                      {fileName}
                    </div>
                  ))}
                </>
              )}
            </div>
            <Button
              sx={DefaultButtonStyle}
              type="button"
              variant="contained"
              onClick={() => setModalOpen(false)}
              disabled={uploadButtonDisabled}
              onMouseDown={handleFileUpload}
            >
              {t('textupload_secondary_modal_upload')}
            </Button>
            <input
              type="file"
              name="file"
              id="fileInput"
              className="text-upload-file-input"
              onChange={handleFileChange}
              multiple={true}
              accept=".txt,.pdf,.docx,.doc,.odt"
              ref={fileInputRef}
            />
          </div>
        </form>
      </ModalBase>
    </div>
  );
}
