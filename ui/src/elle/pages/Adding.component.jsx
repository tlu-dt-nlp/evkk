import { Component, createRef } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Grid,
  TextField
} from '@mui/material';
import TextUpload from '../components/TextUpload';
import './styles/Adding.css';
import { withTranslation } from 'react-i18next';
import { DonatedTextDetailsFormMode } from '../const/Constants';
import DonatedTextDetailsForm from '../components/form/DonatedTextDetailsForm';
import ModalBase from '../components/modal/ModalBase';
import { DefaultButtonStyle, SecondaryButtonStyle } from '../const/StyleConstants';
import AddTextFetch from '../hooks/service/util/AddTextFetch';

class Adding extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pealkiri: '',
      kirjeldus: '',
      sisu: '',
      liik: 'mitteakadeemiline',
      oppematerjal: null,
      akadOppematerjal: [],
      akadOppematerjalMuu: '',
      mitteakadAlamliik: '',
      akadKategooria: '',
      akadAlamliik: '',
      artikkelValjaanne: '',
      artikkelAasta: '',
      artikkelNumber: '',
      artikkelLehekyljed: '',
      autoriVanus: '',
      autoriSugu: '',
      autoriOppeaste: '',
      autoriTeaduskraad: '',
      autoriHaridus: '',
      autoriValdkond: '',
      autoriEmakeel: '',
      autorKakskeelne: false,
      autoriMuudKeeled: '',
      muukeel: '',
      autoriElukohariik: 'Eesti',
      elukohariikMuu: '',
      nousOlek: false,
      ennistusNupp: false,
      modalOpen: false,
      isSubmitting: false,
      lastSubmitSuccessful: null
    };
    this.startingstate = { ...this.state };
    this.previous = { ...this.state };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.sendTextFromFile = this.sendTextFromFile.bind(this);
    this.formDataElement = createRef();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.lastSubmitSuccessful !== this.state.lastSubmitSuccessful && this.state.lastSubmitSuccessful === true) {
      this.setState(this.startingstate);
      this.setState({ ennistusnupp: true });
    }
  }

  handleChange(event) {
    if (event.target.type === 'checkbox') {
      this.setState({ [event.target.name]: event.target.checked });
    } else {
      this.setState({ [event.target.name]: event.target.value });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    this.previous = { ...this.state };
    this.setState(({ request: this.state }));
    this.setState({ isSubmitting: true });
  }

  taastaVormiSisu() {
    this.setState(this.previous, () => this.setState({
      pealkiri: '',
      kirjeldus: '',
      sisu: '',
      ennistusnupp: false
    }));
  }

  sendTextFromFile(tekst) {
    this.setState({ sisu: tekst });
  }

  handleModalClose = (value) => {
    this.setState({ modalOpen: value });
  };

  render() {
    const { t } = this.props;
    return (
      <Box className="global-page-content-container">
        <div className="global-page-content-container-inner adding-container-inner">
          <h5 className="title">{t('common_publish_your_text')}</h5>
          <form
            onSubmit={this.handleSubmit}
            ref={this.formDataElement}
          >
            <Grid
              container
              spacing={{ xs: 6, sm: 3 }}
              sx={{
                flexDirection: { xs: 'column', sm: 'row' }
              }}
            >
              <Grid
                item
                size={{ xs: 12, sm: 12, md: 6 }}
                className="first-column"
              >
                <TextField
                  required
                  multiline
                  size="small"
                  label={t('publish_your_text_title')}
                  name="pealkiri"
                  value={this.state.pealkiri}
                  onChange={this.handleChange}
                />
                <TextField
                  multiline
                  rows={2}
                  label={t('publish_your_text_exercise_description')}
                  name="kirjeldus"
                  value={this.state.kirjeldus}
                  onChange={this.handleChange}
                />
                <TextField
                  required
                  multiline
                  rows={8}
                  helperText={t('publish_your_text_content_helper_text')}
                  label={t('publish_your_text_content')}
                  name="sisu"
                  value={this.state.sisu}
                  onChange={this.handleChange}
                  slotProps={{
                    input: {
                      endAdornment: <TextUpload sendTextFromFile={this.sendTextFromFile} />
                    }
                  }}
                />
              </Grid>
              <DonatedTextDetailsForm
                formData={this.state}
                mode={DonatedTextDetailsFormMode.PUBLISH}
                onChange={this.handleChange}
                onMultiValueChange={(fieldName, value) => this.setState({ [fieldName]: value })}
              />
            </Grid>
            <Alert
              severity="info"
              className="terms-of-service"
            >
              <div>
                <Checkbox
                  required
                  name="nousOlek"
                  checked={this.state.nousOlek}
                  onChange={this.handleChange}
                />
                <label>
                  {t('publish_your_text_terms_of_service_infobox_1')}
                  <u
                    style={{ cursor: 'pointer' }}
                    onClick={() => this.setState({ modalOpen: true })}
                  >
                    {t('publish_your_text_terms_of_service_infobox_2')}
                  </u>.
                </label>
              </div>
            </Alert>
            <div className="button-container">
              <Button
                type="submit"
                variant="contained"
                sx={DefaultButtonStyle}
              >
                {t('publish_your_text_submit_button')}
              </Button>
              {this.state.ennistusnupp &&
                <Button
                  type="button"
                  onClick={() => this.taastaVormiSisu()}
                  variant="outlined"
                  sx={SecondaryButtonStyle}
                >
                  {t('restore_data_button')}
                </Button>
              }
            </div>
          </form>
          <ModalBase
            isOpen={this.state.modalOpen}
            setIsOpen={this.handleModalClose}
            innerClassName="terms-of-service-modal"
            title="publish_your_text_terms_of_service_title"
          >
            <b>{t('publish_your_text_terms_of_service_1')}</b>
            <br /><br />
            {t('publish_your_text_terms_of_service_2')}
            <br /><br />
            {t('publish_your_text_terms_of_service_3')}
            <br /><br />
            {t('publish_your_text_terms_of_service_4')}
            <br /><br /><br />
            <b>{t('publish_your_text_terms_of_service_5')}</b>
            <br /><br />
            {t('publish_your_text_terms_of_service_6')}
            <br /><br />
            {t('publish_your_text_terms_of_service_7')}
            <br /><br />
            {t('publish_your_text_terms_of_service_8')}
            <br /><br /><br />
            <b>{t('publish_your_text_terms_of_service_9')}</b>
            <br /><br />
            {t('publish_your_text_terms_of_service_10')}
            <br /><br />
            {t('publish_your_text_terms_of_service_11')}
            <br /><br />
            {t('publish_your_text_terms_of_service_12')}
          </ModalBase>
          {this.state.isSubmitting && (
            <AddTextFetch
              request={JSON.stringify(this.state.request)}
              onComplete={() => this.setState({ isSubmitting: false })}
              onSuccess={() => this.setState({ lastSubmitSuccessful: true })}
              onFailure={() => this.setState({ lastSubmitSuccessful: false })}
            />
          )}
        </div>
      </Box>
    );
  }
}

export default withTranslation()(Adding);
