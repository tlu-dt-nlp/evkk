import React, { Component } from 'react';
import { Alert, Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import TextUpload from '../components/TextUpload';
import './styles/Adding.css';
import { withTranslation } from 'react-i18next';
import {
  countryOptionsForAddingText,
  degreeOptions,
  domainSaveOptions,
  educationOptions,
  genderOptions,
  studyLevelOptions,
  textPublishAcademicCategoryOptions,
  textPublishAcademicResearchSubtypeOptions,
  textPublishAcademicStudiesSubtypeOptions,
  textPublishMainTextTypesOptions,
  textPublishSubTextTypesOptions,
  textPublishUsedMaterialsOptions,
  usedMaterialsSaveOptions
} from '../const/Constants';
import ModalBase from '../components/modal/ModalBase';
import { DefaultButtonStyle, SecondaryButtonStyle } from '../const/StyleConstants';
import AddTextFetch from '../hooks/service/util/AddTextFetch';
import TooltipButton from '../components/tooltip/TooltipButton';

class Adding extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pealkiri: '',
      kirjeldus: '',
      sisu: '',
      liik: 'akadeemiline',
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
      isSubmitting: false
    };
    this.startingstate = { ...this.state };
    this.previous = { ...this.state };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.sendTextFromFile = this.sendTextFromFile.bind(this);
    this.formDataElement = React.createRef();
  }

  componentDidMount() {
    window.scrollTo(0, 0);
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
    this.setState(this.startingstate);
    this.setState({ ennistusnupp: true, isSubmitting: true });
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

  getAkadOppematerjalRenderValue = (value) => {
    return value.length > 1
      ? this.props.t('publish_your_text_supporting_material_selected_plural', { amount: value.length })
      : this.props.t(textPublishUsedMaterialsOptions[value[0]]);
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
              spacing={3}
              direction={{ xs: 'column', sm: 'row' }}
            >
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                className="first-column"
              >
                <TextField
                  required
                  multiline
                  size="small"
                  label={t('publish_your_text_title')}
                  variant="outlined"
                  name="pealkiri"
                  value={this.state.pealkiri}
                  onChange={this.handleChange}
                />
                <TextField
                  multiline
                  rows={2}
                  label={t('publish_your_text_exercise_description')}
                  variant="outlined"
                  name="kirjeldus"
                  value={this.state.kirjeldus}
                  onChange={this.handleChange}
                  InputLabelProps={{ className: 'no-center-label' }}
                />
                <TextField
                  required
                  multiline
                  rows={8}
                  helperText={t('publish_your_text_content_helper_text')}
                  label={t('publish_your_text_content')}
                  variant="outlined"
                  name="sisu"
                  value={this.state.sisu}
                  onChange={this.handleChange}
                  InputProps={{
                    endAdornment: <TextUpload
                      sendTextFromFile={this.sendTextFromFile}
                      outerClassName="adding-text-upload-component" />
                  }}
                  InputLabelProps={{ className: 'no-center-label' }}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >
                <h5>{t('common_text_data')}</h5>
                <FormControl size="small">
                  <InputLabel>
                    {`${t('publish_your_text_text_data_main_text_type')} *`}
                  </InputLabel>
                  <Select
                    name="liik"
                    value={this.state.liik}
                    required
                    onChange={this.handleChange}
                  >
                    {Object.keys(textPublishMainTextTypesOptions).map((type) => (
                      <MenuItem
                        key={type}
                        value={type}
                      >
                        {t(textPublishMainTextTypesOptions[type])}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {this.state.liik === 'akadeemiline' &&
                  <FormControl size="small">
                    <InputLabel
                      id="valdkond-select-label"
                    >
                      {`${t('common_text_data_field_of_research')} *`}
                    </InputLabel>
                    <Select
                      labelId="valdkond-select-label"
                      name="autoriValdkond"
                      value={this.state.autoriValdkond}
                      required
                      onChange={this.handleChange}
                    >
                      {Object.keys(domainSaveOptions).map((domain) => (
                        <MenuItem
                          key={domain}
                          value={domain}
                        >
                          {t(domainSaveOptions[domain])}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                }
                {this.state.liik === 'mitteakadeemiline' &&
                  <FormControl size="small">
                    <InputLabel
                      id="mitteakad-alamliik-select-label"
                    >
                      {t('publish_your_text_text_data_sub_text_type')}
                    </InputLabel>
                    <Select
                      labelId="mitteakad-alamliik-select-label"
                      name="mitteakadAlamliik"
                      value={this.state.mitteakadAlamliik}
                      onChange={this.handleChange}
                    >
                      {Object.keys(textPublishSubTextTypesOptions).map((type) => (
                        <MenuItem
                          key={type}
                          value={type}
                          disabled={type.includes('_disabled')}
                        >
                          {t(textPublishSubTextTypesOptions[type])}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                }
                {this.state.liik === 'akadeemiline' &&
                  <FormControl size="small">
                    <InputLabel
                      id="akad-kategooria-select-label"
                    >
                      {`${t('publish_your_text_text_data_academic_category')} *`}
                    </InputLabel>
                    <Select
                      labelId="akad-kategooria-select-label"
                      name="akadKategooria"
                      value={this.state.akadKategooria}
                      required
                      onChange={this.handleChange}
                    >
                      {Object.keys(textPublishAcademicCategoryOptions).map((category) => (
                        <MenuItem
                          key={category}
                          value={category}
                        >
                          {t(textPublishAcademicCategoryOptions[category])}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                }
                {this.state.liik === 'akadeemiline' && this.state.akadKategooria !== '' &&
                  <FormControl size="small">
                    <InputLabel
                      id="akad-alamliik-select-label"
                    >
                      {t('publish_your_text_text_data_sub_text_type')}
                    </InputLabel>
                    <Select
                      labelId="akad-alamliik-select-label"
                      name="akadAlamliik"
                      value={this.state.akadAlamliik}
                      onChange={this.handleChange}
                    >
                      {this.state.akadKategooria === 'ak_erialaopingud' &&
                        Object.keys(textPublishAcademicStudiesSubtypeOptions).map((type) => (
                          <MenuItem
                            key={type}
                            value={type}
                          >
                            {t(textPublishAcademicStudiesSubtypeOptions[type])}
                          </MenuItem>
                        ))}
                      {this.state.akadKategooria === 'ak_uurimused' &&
                        Object.keys(textPublishAcademicResearchSubtypeOptions).map((type) => (
                          <MenuItem
                            key={type}
                            value={type}
                          >
                            {t(textPublishAcademicResearchSubtypeOptions[type])}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                }
                {this.state.liik === 'akadeemiline' && this.state.akadKategooria === 'ak_uurimused' && this.state.akadAlamliik === 'ak_uurimus_artikkel' &&
                  <>
                    <TextField
                      required
                      size="small"
                      label={t('publish_your_text_text_data_publication')}
                      variant="outlined"
                      name="artikkelValjaanne"
                      value={this.state.artikkelValjaanne}
                      onChange={this.handleChange}
                    />
                    <TextField
                      required
                      size="small"
                      type="number"
                      label={t('publish_your_text_text_data_year')}
                      variant="outlined"
                      name="artikkelAasta"
                      value={this.state.artikkelAasta}
                      onChange={this.handleChange}
                    />
                    <TextField
                      size="small"
                      label={t('publish_your_text_text_data_number')}
                      variant="outlined"
                      name="artikkelNumber"
                      value={this.state.artikkelNumber}
                      onChange={this.handleChange}
                    />
                    <TextField
                      size="small"
                      label={t('publish_your_text_text_data_pages')}
                      variant="outlined"
                      name="artikkelLehekyljed"
                      value={this.state.artikkelLehekyljed}
                      onChange={this.handleChange}
                    />
                  </>
                }
                <FormControl size="small">
                  <InputLabel
                    id="oppematerjal-label"
                  >
                    {t('query_text_data_used_study_or_supporting_materials')}
                  </InputLabel>
                  <Select
                    labelId="oppematerjal-label"
                    name="oppematerjal"
                    value={this.state.oppematerjal}
                    onChange={this.handleChange}
                  >
                    {Object.keys(usedMaterialsSaveOptions).map((material) => (
                      <MenuItem
                        key={material}
                        value={material}
                      >
                        {t(usedMaterialsSaveOptions[material])}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {this.state.oppematerjal === 'true' &&
                  <>
                    <FormControl size="small">
                      <InputLabel>
                        {t('publish_your_text_text_data_supporting_material')}
                      </InputLabel>
                      <Select
                        multiple
                        labelId="akad-materjalid-label"
                        name="akadOppematerjal"
                        value={this.state.akadOppematerjal}
                        renderValue={this.getAkadOppematerjalRenderValue}
                        onChange={this.handleChange}
                      >
                        {Object.keys(textPublishUsedMaterialsOptions).map((material) => (
                          <MenuItem
                            key={material}
                            value={material}
                          >
                            {t(textPublishUsedMaterialsOptions[material])}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {this.state.akadOppematerjal.indexOf('muu') !== -1 &&
                      <TextField
                        label={t('publish_your_text_text_data_supporting_material_other')}
                        variant="outlined"
                        size="small"
                        name="akadOppematerjalMuu"
                        value={this.state.akadOppematerjalMuu}
                        onChange={this.handleChange}
                      />
                    }
                  </>
                }
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >
                <h5>{t('common_author_data')}</h5>
                <TextField
                  size="small"
                  type="number"
                  label={t('query_author_data_age')}
                  variant="outlined"
                  name="autoriVanus"
                  value={this.state.autoriVanus}
                  onChange={this.handleChange}
                />
                <FormControl size="small">
                  <InputLabel
                    id="sugu-select-label"
                  >
                    {t('query_author_data_gender')}
                  </InputLabel>
                  <Select
                    labelId="sugu-select-label"
                    name="autoriSugu"
                    value={this.state.autoriSugu}
                    onChange={this.handleChange}
                  >
                    {Object.keys(genderOptions).map((gender) => (
                      <MenuItem
                        key={gender}
                        value={gender}
                      >
                        {t(genderOptions[gender])}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  size="small"
                  required
                  label={<>
                    {t('query_author_data_native_language')}
                    <TooltipButton>
                      {t('publish_your_text_author_data_other_languages_tooltip')}
                    </TooltipButton>
                  </>}
                  variant="outlined"
                  name="autoriEmakeel"
                  value={this.state.autoriEmakeel}
                  onChange={this.handleChange}
                />
                <TextField
                  size="small"
                  label={<>
                    {t('query_author_data_other_languages_plural')}
                    <TooltipButton>
                      {t('publish_your_text_author_data_other_languages_tooltip')}
                    </TooltipButton>
                  </>}
                  variant="outlined"
                  name="autoriMuudKeeled"
                  value={this.state.autoriMuudKeeled}
                  onChange={this.handleChange}
                />
                <FormControl size="small">
                  <InputLabel
                    id="elukohariik"
                  >
                    {t('query_author_data_country')}
                  </InputLabel>
                  <Select
                    value={this.state.autoriElukohariik}
                    onChange={this.handleChange}
                    name="autoriElukohariik"
                    labelId="elukohariik"
                  >
                    {Object.keys(countryOptionsForAddingText).map((country) => (
                      <MenuItem
                        key={country}
                        value={country}
                      >
                        {t(countryOptionsForAddingText[country])}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {this.state.liik === 'akadeemiline' &&
                  <FormControl size="small">
                    <InputLabel
                      id="oppeaste-select-label"
                    >
                      {t('query_author_data_level_of_study')}
                    </InputLabel>
                    <Select
                      labelId="oppeaste-select-label"
                      name="autoriOppeaste"
                      value={this.state.autoriOppeaste}
                      onChange={this.handleChange}
                    >
                      {Object.keys(studyLevelOptions).map((level) => (
                        <MenuItem
                          key={level}
                          value={level}
                        >
                          {t(studyLevelOptions[level])}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                }
                {this.state.liik === 'akadeemiline' &&
                  <FormControl size="small">
                    <InputLabel
                      id="teaduskraad-select-label"
                    >
                      {t('query_author_data_degree')}
                    </InputLabel>
                    <Select
                      labelId="teaduskraad-select-label"
                      name="autoriTeaduskraad"
                      value={this.state.autoriTeaduskraad}
                      onChange={this.handleChange}
                    >
                      {Object.keys(degreeOptions).map((degree) => (
                        <MenuItem
                          key={degree}
                          value={degree}
                        >
                          {t(degreeOptions[degree])}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                }
                {this.state.liik === 'mitteakadeemiline' &&
                  <FormControl size="small">
                    <InputLabel
                      id="haridus-select-label"
                    >
                      {t('query_author_data_education')}
                    </InputLabel>
                    <Select
                      labelId="haridus-select-label"
                      name="autoriHaridus"
                      value={this.state.autoriHaridus}
                      onChange={this.handleChange}
                    >
                      {Object.keys(educationOptions).map((education) => (
                        <MenuItem
                          key={education}
                          value={education}
                        >
                          {t(educationOptions[education])}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                }
              </Grid>
            </Grid>
            <Alert
              severity="info"
              className="terms-of-service"
            >
              <div>
                {t('publish_your_text_terms_of_service_infobox_1')}
                <u
                  style={{ cursor: 'pointer' }}
                  onClick={() => this.setState({ modalOpen: true })}
                >
                  {t('publish_your_text_terms_of_service_infobox_2')}
                </u>.
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
                  variant="contained"
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
            {t('publish_your_text_terms_of_service_1')}
            <br /><br />
            {t('publish_your_text_terms_of_service_2')}
          </ModalBase>
          {this.state.isSubmitting && (
            <AddTextFetch
              request={JSON.stringify(this.state.request)}
              onComplete={() => this.setState({ isSubmitting: false })}
            />
          )}
        </div>
      </Box>
    );
  }
}

export default withTranslation()(Adding);
