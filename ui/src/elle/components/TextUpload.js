import React, { createRef, useState } from 'react';
import './styles/TextUpload.css';
import { Button, Tooltip } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useTranslation } from 'react-i18next';
import '../translations/i18n';
import { DefaultButtonStyle } from '../const/StyleConstants';
import ModalBase from './modal/ModalBase';
import { useGetTextFromFile } from '../hooks/service/TextService';

export default function TextUpload({ sendTextFromFile, outerClassName = '' }) {

  const [modalOpen, setModalOpen] = useState(false);
  const [uploadButtonDisabled, setUploadButtonDisabled] = useState(true);
  const formDataElement = createRef();
  const fileNameElement = createRef();
  const text1Element = createRef();
  const { t } = useTranslation();
  const { getTextFromFile } = useGetTextFromFile();

  function fileUpload() {
    getTextFromFile(new FormData(formDataElement.current))
      .then(response => sendTextFromFile(response))
      .catch(() => sendTextFromFile(''));
    setUploadButtonDisabled(true);
    fileNameElement.current.textContent = '';
    setModalOpen(false);
  }

  function fileChange() {
    fileNameElement.current.textContent = '';
    const br = document.createElement('br');
    const b = document.createElement('b');
    const div = document.createElement('div');
    const fileNameDataContent = document.createTextNode(t('textupload_secondary_modal_chosen_files'));
    b.appendChild(fileNameDataContent);
    div.appendChild(b);
    div.appendChild(br);

    for (let i = 0; i < text1Element.current.files.length; i++) {
      const brElement = document.createElement('br');
      const tempName = document.createTextNode(text1Element.current.files[i].name);
      div.appendChild(tempName);
      div.appendChild(brElement);
    }

    setUploadButtonDisabled(false);
    fileNameElement.current.appendChild(div);
  }

  return (
    <>
      <div className={`container ${outerClassName}`}>
        <Tooltip
          title={t('textupload_secondary_modal_tooltip')}
          placement="top"
        >
          <FileUploadIcon
            id="upload_button"
            className="button-file"
            onClick={() => {
              setModalOpen(true);
            }}
          />
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
            id="form_data"
            ref={formDataElement}
          >
            <div className="d-flex flex-column align-items-center justify-content-between mt-5">
              <div>
                <Button
                  sx={DefaultButtonStyle}
                  component="label"
                  htmlFor="text_1"
                  variant="contained"
                >
                  {t('textupload_secondary_modal_choose_files')}
                </Button>
              </div>
              <div
                id="file_name"
                className="file-name-element"
                ref={fileNameElement}
              />
              <Button
                sx={DefaultButtonStyle}
                type="button"
                variant="contained"
                onClick={() => {
                  setModalOpen(false);
                }}
                disabled={uploadButtonDisabled}
                onMouseDown={fileUpload}>
                {t('textupload_secondary_modal_upload')}
              </Button>
              <input
                style={{ visibility: 'hidden' }}
                type="file"
                name="file"
                id="text_1"
                onChange={fileChange}
                multiple={true}
                accept=".txt,.pdf,.docx,.doc,.odt"
                ref={text1Element}
              />
            </div>
          </form>
        </ModalBase>
      </div>
    </>
  );
}
