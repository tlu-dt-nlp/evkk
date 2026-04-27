import Accordion from '@mui/material/Accordion';
import { AccordionStyle, DefaultButtonStyle } from '../../const/StyleConstants';
import { useState } from 'react';
import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionSummary from '@mui/material/AccordionSummary';
import { useTranslation } from 'react-i18next';
import AccordionDetails from '@mui/material/AccordionDetails';
import { useGetExerciseGeneratorResult } from '../../hooks/service/ExerciseGeneratorService';
import Exercise from './Exercise';
import './styles/ExerciseGeneratorForm.css';
import { selectOnFocusIfCoarsePointer } from '../../util/InputUtils';
import { errorEmitter } from '../../../App';
import { ErrorSnackbarEventType } from '../../components/snackbar/ErrorSnackbar';
import { ExerciseFormat } from '../../enum/ExerciseFormat';

export default function ExerciseGeneratorForm() {

  const { t } = useTranslation();
  const [paramsExpanded, setParamsExpanded] = useState(true);
  const [response, setResponse] = useState(null);
  const [responseFormat, setResponseFormat] = useState(null);
  const [typeValue, setTypeValue] = useState(null);
  const [typeError, setTypeError] = useState(false);
  const [structureValue, setStructureValue] = useState(ExerciseStructureType.SENTENCE);
  const [formatValue, setFormatValue] = useState(null);
  const [formatError, setFormatError] = useState(false);
  const [targetWordCriteriaValue, setTargetWordCriteriaValue] = useState(ExerciseTargetWordCriteria.C1_OR_B2);
  const [topicValue, setTopicValue] = useState('');
  const [performQualityCheckValue, setPerformQualityCheckValue] = useState(true);
  const [sentenceCountValue, setSentenceCountValue] = useState(8);
  const { getExerciseGeneratorResult } = useGetExerciseGeneratorResult();

  const handleSubmit = event => {
    event.preventDefault();
    setTypeError(!typeValue);
    setFormatError(!formatValue);
    if (typeValue && formatValue) {
      const requestData = generateRequestData();

      getExerciseGeneratorResult(requestData)
        .then(response => {
          if (!response) return;
          setResponse(response);
          setResponseFormat(requestData.format);
          setParamsExpanded(false);
        });
    } else {
      window.scrollTo(0, 0);
      errorEmitter.emit(ErrorSnackbarEventType.MANDATORY_FIELDS_NOT_FILLED);
    }
  };

  const generateRequestData = () => {
    return {
      type: typeValue,
      structureType: structureValue,
      format: formatValue,
      targetWordCriteria: targetWordCriteriaValue,
      topic: topicValue,
      performQualityCheck: performQualityCheckValue,
      sentenceCount: sentenceCountValue
    };
  };

  const handleTypeChange = event => {
    setTypeValue(event.target.value);
    setTypeError(false);
  };

  const handleFormatChange = event => {
    setFormatValue(event.target.value);
    setFormatError(false);
  };

  const handleStructureChange = event => {
    const value = event.target.value;
    setStructureValue(value);
    setTargetWordCriteriaValue(value === ExerciseStructureType.SENTENCE
      ? ExerciseTargetWordCriteria.C1_OR_B2
      : ExerciseTargetWordCriteria.NONE
    );
    setSentenceCountValue(value === ExerciseStructureType.SENTENCE
      ? 8
      : 15
    );
  };

  return (
    <>
      <h2 className="page-title">
        {t('common_exercise_generator')}
      </h2>
      <Accordion
        sx={AccordionStyle}
        expanded={paramsExpanded}
        onChange={() => setParamsExpanded(!paramsExpanded)}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>
            {t('exercise_generator_exercise_options')}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <form onSubmit={handleSubmit}>
            <Grid
              container
              spacing={3}
              sx={{
                flexDirection: { xs: 'column', sm: 'row' }
              }}
            >
              <Grid
                item
                size={{ xs: 12, sm: 6, md: 4 }}
              >
                <FormControl error={typeError}>
                  <FormLabel>
                    {t('common_type')}
                  </FormLabel>
                  <RadioGroup
                    name="type"
                    value={typeValue}
                    onChange={handleTypeChange}
                  >
                    <FormControlLabel
                      value={ExerciseType.INFINITIVE}
                      control={<Radio />}
                      label={t('exercise_generator_exercise_type_infinitive')}
                    />
                    <FormControlLabel
                      value={ExerciseType.OBJECT}
                      control={<Radio />}
                      label={t('exercise_generator_exercise_type_object')}
                    />
                  </RadioGroup>
                  {typeError &&
                    <FormHelperText>
                      {t('error_mandatory_field')}
                    </FormHelperText>
                  }
                </FormControl>
                <br /><br />
                <FormControl error={formatError}>
                  <FormLabel>
                    {t('exercise_generator_exercise_format')}
                  </FormLabel>
                  <RadioGroup
                    name="format"
                    value={formatValue}
                    onChange={handleFormatChange}
                  >
                    <FormControlLabel
                      value={ExerciseFormat.FILL_IN_THE_BLANKS}
                      control={<Radio />}
                      label={t('exercise_generator_exercise_format_fill_in_the_blanks')}
                    />
                    <FormControlLabel
                      value={ExerciseFormat.MATCHING}
                      control={<Radio />}
                      label={t('exercise_generator_exercise_format_matching')}
                    />
                  </RadioGroup>
                  {formatError &&
                    <FormHelperText>
                      {t('error_mandatory_field')}
                    </FormHelperText>
                  }
                </FormControl>
              </Grid>
              <Grid
                item
                size={{ xs: 12, sm: 6, md: 4 }}
              >
                <FormControl>
                  <FormLabel>
                    {t('exercise_generator_exercise_structure_type')}
                  </FormLabel>
                  <RadioGroup
                    name="structure"
                    value={structureValue}
                    onChange={handleStructureChange}
                  >
                    <FormControlLabel
                      value={ExerciseStructureType.SENTENCE}
                      control={<Radio />}
                      label={t('exercise_generator_exercise_structure_type_sentence')}
                    />
                    <FormControlLabel
                      value={ExerciseStructureType.TEXT}
                      control={<Radio />}
                      label={t('exercise_generator_exercise_structure_type_text')}
                    />
                  </RadioGroup>
                </FormControl>
                <br /><br />
                <FormControl>
                  <FormLabel>
                    {t('exercise_generator_exercise_target_word_criteria')}
                  </FormLabel>
                  <RadioGroup
                    name="targetWordCriteria"
                    value={targetWordCriteriaValue}
                    onChange={e => setTargetWordCriteriaValue(e.target.value)}
                  >
                    <FormControlLabel
                      value={ExerciseTargetWordCriteria.C1}
                      control={<Radio />}
                      label={t('exercise_generator_exercise_target_word_criteria_c1')}
                    />
                    <FormControlLabel
                      value={ExerciseTargetWordCriteria.C1_OR_B2}
                      control={<Radio />}
                      label={t('exercise_generator_exercise_target_word_criteria_c1_or_b2')}
                    />
                    <FormControlLabel
                      value={ExerciseTargetWordCriteria.NONE}
                      control={<Radio />}
                      label={t('exercise_generator_exercise_target_word_criteria_none')}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid
                item
                size={{ xs: 12, sm: 6, md: 4 }}
              >
                <FormControl>
                  <FormLabel>
                    {t('exercise_generator_perform_quality_check')}
                  </FormLabel>
                  <RadioGroup
                    name="performQualityCheck"
                    value={performQualityCheckValue}
                    onChange={e => setPerformQualityCheckValue(e.target.value)}
                  >
                    <FormControlLabel
                      value={true}
                      control={<Radio />}
                      label={t('exercise_generator_perform_quality_check_yes')}
                    />
                    <FormControlLabel
                      value={false}
                      control={<Radio />}
                      label={t('exercise_generator_perform_quality_check_no')}
                    />
                  </RadioGroup>
                </FormControl>
                <br /><br />
                <FormControl size="small">
                  <InputLabel>
                    {t('exercise_generator_exercise_topic')}
                  </InputLabel>
                  <Select
                    displayEmpty
                    value={topicValue}
                    onChange={e => setTopicValue(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>{t('exercise_generator_exercise_topic_none')}</em>
                    </MenuItem>
                    <MenuItem value="history">
                      {t('exercise_generator_exercise_topic_history')}
                    </MenuItem>
                    <MenuItem value="cars">
                      {t('exercise_generator_exercise_topic_cars')}
                    </MenuItem>
                    <MenuItem value="construction & real estate">
                      {t('exercise_generator_exercise_topic_construction_and_real_estate')}
                    </MenuItem>
                    <MenuItem value="education">
                      {t('exercise_generator_exercise_topic_education')}
                    </MenuItem>
                    <MenuItem value="beauty">
                      {t('exercise_generator_exercise_topic_beauty')}
                    </MenuItem>
                    <MenuItem value="technology & IT">
                      {t('exercise_generator_exercise_topic_technology_and_it')}
                    </MenuItem>
                    <MenuItem value="home, family & children">
                      {t('exercise_generator_exercise_topic_home_family_and_children')}
                    </MenuItem>
                    <MenuItem value="culture & entertainment">
                      {t('exercise_generator_exercise_topic_culture_and_entertainment')}
                    </MenuItem>
                    <MenuItem value="nature & environment">
                      {t('exercise_generator_exercise_topic_nature_and_environment')}
                    </MenuItem>
                    <MenuItem value="pets & animals">
                      {t('exercise_generator_exercise_topic_pets_and_animals')}
                    </MenuItem>
                    <MenuItem value="economy, finance & business">
                      {t('exercise_generator_exercise_topic_economy_finance_and_business')}
                    </MenuItem>
                    <MenuItem value="politics & government">
                      {t('exercise_generator_exercise_topic_politics_and_government')}
                    </MenuItem>
                    <MenuItem value="agriculture">
                      {t('exercise_generator_exercise_topic_agriculture')}
                    </MenuItem>
                    <MenuItem value="travel & tourism">
                      {t('exercise_generator_exercise_topic_travel_and_tourism')}
                    </MenuItem>
                    <MenuItem value="sports">
                      {t('exercise_generator_exercise_topic_sports')}
                    </MenuItem>
                    <MenuItem value="science">
                      {t('exercise_generator_exercise_topic_science')}
                    </MenuItem>
                    <MenuItem value="health">
                      {t('exercise_generator_exercise_topic_health')}
                    </MenuItem>
                    <MenuItem value="food & drinks">
                      {t('exercise_generator_exercise_topic_food_and_drinks')}
                    </MenuItem>
                    <MenuItem value="video games">
                      {t('exercise_generator_exercise_topic_video_games')}
                    </MenuItem>
                  </Select>
                </FormControl>
                <br /><br />
                <FormControl>
                  <FormLabel>
                    {t('exercise_generator_exercise_sentence_count_max')}
                  </FormLabel>
                  <TextField
                    type="number"
                    slotProps={{
                      htmlInput: {
                        inputMode: 'numeric',
                        pattern: '[0-9]*',
                        min: '5',
                        max: '25'
                      }
                    }}
                    size="small"
                    required
                    value={sentenceCountValue}
                    onChange={e => setSentenceCountValue(e.target.value)}
                    onFocus={selectOnFocusIfCoarsePointer}
                    className="exercise-generator-form-inline-textfield"
                  />
                </FormControl>
              </Grid>
            </Grid>
            <br />
            <Button
              sx={DefaultButtonStyle}
              type="submit"
              variant="contained"
            >
              {t('exercise_generator_generate_exercise')}
            </Button>
          </form>
        </AccordionDetails>
      </Accordion>
      {response &&
        <Exercise
          content={response}
          exerciseFormat={responseFormat}
          setContent={setResponse}
          setParamsExpanded={setParamsExpanded}
        />
      }
    </>
  );
}

const ExerciseType = {
  INFINITIVE: 'INFINITIVE',
  OBJECT: 'OBJECT'
};

const ExerciseStructureType = {
  SENTENCE: 'SENTENCE',
  TEXT: 'TEXT'
};

const ExerciseTargetWordCriteria = {
  C1: 'C1',
  C1_OR_B2: 'C1_OR_B2',
  NONE: 'NONE'
};
