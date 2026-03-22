import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  MenuItem,
  Select,
  Typography
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import TooltipButton from "../../components/tooltip/TooltipButton";
import {
  ClusterFinderType,
  morphologicalWordTypeOptions,
  syntacticClauseTypeOptions,
  wordTypeOptions
} from "../../const/ClusterFinderConstants";
import { AccordionStyle, DefaultButtonStyle } from "../../const/StyleConstants";
import ClusterFinderTreeView from "./components/ClusterFinderTreeView";

export default function ClusterFinder() {
  const {t, i18n} = useTranslation();

  const [paramsExpanded, setParamsExpanded] = useState(true);
  const [typeError, setTypeError] = useState(false);
  const [typeValue, setTypeValue] = useState({
    [ClusterFinderType.MORPHOLOGICAL]: false,
    [ClusterFinderType.SYNTACTIC]: false,
    [ClusterFinderType.WORD_TYPE]: false
  });
  const [wordSequenceLength, setWordSequenceLength] = useState(1);
  const [orderByNthWord, setOrderByNthWord] = useState(1);
  const [isPunctuationSensitiveChecked, setIsPunctuationSensitiveChecked] = useState(false);
  const [selectedClauseTypeItems, setSelectedClauseTypeItems] = useState([]);
  const [selectedWordTypeItems, setSelectedWordTypeItems] = useState([]);

  const clusterFinderOptions = [
    {key: "word_type", translationKey: "cluster_finder_word_type", value: ClusterFinderType.WORD_TYPE},
    {key: "syntactic", translationKey: "cluster_finder_syntactic", value: ClusterFinderType.SYNTACTIC},
    {key: "morphological", translationKey: "cluster_finder_morphological", value: ClusterFinderType.MORPHOLOGICAL}
  ];

  /** @type {number[]} */
  const wordSequenceLengthOptions = Array.from({length: 5}, (_, i) => i + 1);

  const handleSubmit = (event) => {
    event.preventDefault();
    setTypeError(!Object.values(typeValue).some(Boolean));

    // TODO: Implement POST request
    console.log(event);
  }

  const handleTypeChange = (event) => {
    const {value, checked} = event.target;
    const newValue = {...typeValue, [value]: checked};

    if (value === ClusterFinderType.WORD_TYPE && checked) {
      newValue[ClusterFinderType.MORPHOLOGICAL] = false;
      newValue[ClusterFinderType.SYNTACTIC] = false;
    } else if ((value === ClusterFinderType.MORPHOLOGICAL || value === ClusterFinderType.SYNTACTIC) && checked) {
      newValue[ClusterFinderType.WORD_TYPE] = false;
    }

    setTypeValue(newValue);
    setTypeError(false);
  };

  const handleWordSequenceLengthChange = (event) => {
    const newLength = event.target.value;

    if (orderByNthWord > newLength) {
      setOrderByNthWord(1);
    }

    setWordSequenceLength(newLength);
  }

  const handleOrderByNthWordChange = (event) =>
    setOrderByNthWord(event.target.value);

  const getOrderByNthWordOptions = (maxOptions) =>
    /** @type {number[]} */
    Array.from({length: maxOptions}, (_, i) => i + 1);

  const handlePunctuationSensitiveChange = (event) =>
    setIsPunctuationSensitiveChecked(event.target.checked);

  return (
    <>
      <h2 className="tool-title">
        {t("common_clusters")}
      </h2>

      <Accordion
        expanded={paramsExpanded}
        onChange={() => setParamsExpanded(!paramsExpanded)}
        sx={AccordionStyle}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>
            {t("common_analysis_options")}
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <form onSubmit={handleSubmit}>
            <Grid container
                  spacing={2}
                  sx={{
                    flexDirection: {xs: "column", sm: "row"}
                  }}
            >
              <Grid item size={{xs: 12, sm: 6, md: 4}}>
                <FormControl error={typeError}>
                  <FormLabel>{t("cluster_finder_analysis")}</FormLabel>

                  {clusterFinderOptions.map((option) => {
                    const tooltipKey = option.tooltipTranslationKey ?? `${option.translationKey}_tooltip`;
                    const showTooltip = i18n.exists(tooltipKey);

                    return (
                      <FormControlLabel
                        control={<Checkbox checked={typeValue[option.value]} />}
                        key={option.key}
                        label={
                          <>
                            {t(option.translationKey)}
                            {showTooltip && (<TooltipButton>{t(tooltipKey)}</TooltipButton>)}
                          </>
                        }
                        onChange={handleTypeChange}
                        value={option.value}
                      />
                    );
                  })}

                  {typeError && (
                    <FormHelperText>{t("error_mandatory_field")}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item size={{xs: 12, sm: 6, md: 4}}>
                <FormControl>
                  <FormLabel>{t("cluster_finder_word_sequence_length")}</FormLabel>

                  <Select
                    name="wordSequenceLength"
                    onChange={handleWordSequenceLengthChange}
                    size="small"
                    sx={{width: "100px"}}
                    value={wordSequenceLength}
                    variant="outlined"
                  >
                    {wordSequenceLengthOptions.map((option) => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>{t("cluster_finder_search_and_order")}</FormLabel>

                  <Grid container
                        spacing={1}
                        alignItems="flex-start"
                  >
                    <Grid item>
                      <Select
                        name="orderByNthWord"
                        onChange={handleOrderByNthWordChange}
                        size="small"
                        sx={{width: "100px"}}
                        value={orderByNthWord}
                        variant="outlined"
                      >
                        {getOrderByNthWordOptions(wordSequenceLength).map((option) => (
                          <MenuItem key={option} value={option}>
                            {t("ordinal", {count: option, ordinal: true})}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>

                    <Grid item sx={{pt: 1}}>
                      {t("cluster_finder_order_by_nth_word")}
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>

              <Grid item size={{xs: 12, sm: 6, md: 4}}>
                <FormControl>
                  <FormLabel>{t("common_other_options")}</FormLabel>

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isPunctuationSensitiveChecked}
                        onChange={handlePunctuationSensitiveChange}
                      />
                    }
                    label={
                      <>
                        {t("cluster_finder_punctuation_sensitive")}

                        <TooltipButton>
                          {t("cluster_finder_punctuation_sensitive_tooltip")}
                        </TooltipButton>
                      </>
                    }
                  />
                </FormControl>
              </Grid>
            </Grid>

            <Grid container
                  spacing={2}
                  sx={{
                    flexDirection: {xs: "column", sm: "row"},
                    py: 2
                  }}
            >
              <Grid item size={{xs: 12, sm: 6, md: 6}}>
                <FormControl>
                  <ClusterFinderTreeView
                    disabled={!typeValue[ClusterFinderType.SYNTACTIC]}
                    items={syntacticClauseTypeOptions}
                    selectedItems={selectedClauseTypeItems}
                    setSelectedItems={setSelectedClauseTypeItems}
                  />
                </FormControl>
              </Grid>

              <Grid item size={{xs: 12, sm: 6, md: 6}}>
                <FormControl>
                  <ClusterFinderTreeView
                    disabled={!typeValue[ClusterFinderType.MORPHOLOGICAL] && !typeValue[ClusterFinderType.WORD_TYPE]}
                    items={typeValue[ClusterFinderType.MORPHOLOGICAL] ? morphologicalWordTypeOptions : wordTypeOptions}
                    selectedItems={selectedWordTypeItems}
                    setSelectedItems={setSelectedWordTypeItems}
                  />
                </FormControl>
              </Grid>
            </Grid>

            <Button
              sx={DefaultButtonStyle}
              type="submit"
              variant="contained"
            >
              {t("analyse_button")}
            </Button>
          </form>
        </AccordionDetails>
      </Accordion>
    </>
  );
};
