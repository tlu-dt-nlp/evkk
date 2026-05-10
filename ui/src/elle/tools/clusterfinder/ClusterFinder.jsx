import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
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
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import TooltipButton from "../../components/tooltip/TooltipButton";
import { ClauseType, syntacticClauseTypeNodes } from "../../const/ClusterFinderClauseConstants";
import {
  ClusterFinderSortingType,
  ClusterFinderTreeType,
  ClusterSearchForm,
  ClusterSearchFormInputType
} from "../../const/ClusterFinderConstants";
import { morphologicalWordTypeNodes, WordType, wordTypeNodes } from "../../const/ClusterFinderWordConstants";
import { AccordionStyle, DefaultButtonStyle } from "../../const/StyleConstants";
import { useGetSelectedTexts } from "../../hooks/service/TextService";
import { useGetClusterFinderResult } from "../../hooks/service/ToolsService";
import { queryStore } from "../../store/QueryStore";
import { changeClusterFinderResult, toolAnalysisStore } from "../../store/ToolAnalysisStore";
import ClusterFinderTable from "./components/ClusterFinderTable";
import ClusterFinderTreeView from "./components/ClusterFinderTreeView";
import { hasPartialFilters } from "./util/ClusterFinderUtils";

export default function ClusterFinder() {
  const {t, i18n} = useTranslation();
  const {getClusterFinderResult} = useGetClusterFinderResult();
  const navigate = useNavigate();

  const [isAccordionExpanded, setIsAccordionExpanded] = useState(true);
  const [typeValue, setTypeValue] = useState({
    [ClusterFinderTreeType.MORPHOLOGICAL]: false,
    [ClusterFinderTreeType.SYNTACTIC]: false,
    [ClusterFinderTreeType.WORD_TYPE]: false
  });
  const [typeError, setTypeError] = useState(false);
  const [wordSequenceLength, setWordSequenceLength] = useState(1);
  const [orderBy, setOrderBy] = useState(ClusterFinderSortingType.BY_FREQUENCY);
  const [isPunctuationSensitiveChecked, setIsPunctuationSensitiveChecked] = useState(false);
  const [selectedClauseTypeItems, setSelectedClauseTypeItems] = useState([]);
  const [selectedWordTypeItems, setSelectedWordTypeItems] = useState([]);
  const [response, setResponse] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [showNoResultsError, setShowNoResultsError] = useState(false);

  const [storeData, setStoreData] = useState("");
  const {getSelectedTexts} = useGetSelectedTexts(setStoreData);

  const ordinalSortingValues = Object.values(ClusterFinderSortingType)
    .filter((value) => value !== ClusterFinderSortingType.BY_FREQUENCY);

  const orderByOptions = useMemo(() => {
    const options = [{
      value: ClusterFinderSortingType.BY_FREQUENCY,
      label: t("cluster_finder_order_by_frequency")
    }];

    for (let i = 0; i < wordSequenceLength; i++) {
      options.push({
        value: ordinalSortingValues[i],
        label: t("cluster_finder_order_by_nth_word", {ordinal: t("ordinal", {count: i + 1, ordinal: true})})
      });
    }

    return options;
  }, [t, wordSequenceLength, ordinalSortingValues]);

  useEffect(() => {
    const clusterFinderState = toolAnalysisStore.getState().clusterFinder;
    if (clusterFinderState?.analysis?.clusters?.length > 0) {
      const params = clusterFinderState.parameters;
      setTypeValue(params.typeValue);
      setWordSequenceLength(params.wordSequenceLength);
      setOrderBy(params.orderBy);
      setIsPunctuationSensitiveChecked(params.isPunctuationSensitiveChecked);
      setSelectedClauseTypeItems(params.selectedClauseTypeItems);
      setSelectedWordTypeItems(params.selectedWordTypeItems);
      setResponse(clusterFinderState.analysis);
      setIsAccordionExpanded(false);
      setShowTable(true);
    }
  }, [navigate]);

  useEffect(() => {
    toolAnalysisStore.dispatch(changeClusterFinderResult({
      parameters: {
        typeValue: typeValue,
        wordSequenceLength: wordSequenceLength,
        orderBy: orderBy,
        isPunctuationSensitiveChecked: isPunctuationSensitiveChecked,
        selectedClauseTypeItems: selectedClauseTypeItems,
        selectedWordTypeItems: selectedWordTypeItems
      },
      analysis: response
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  useEffect(() => {
    getSelectedTexts();
  }, [getSelectedTexts]);

  useEffect(() => {
    const unsubscribe = queryStore.subscribe(() => {
      getSelectedTexts();

      toolAnalysisStore.dispatch(changeClusterFinderResult(null));
      setResponse(null);
      setIsAccordionExpanded(true);
      setShowTable(false);
    });

    return () => unsubscribe();
  }, [getSelectedTexts]);

  const clusterFinderTypes = [
    {labelKey: "cluster_finder_word_type", value: ClusterFinderTreeType.WORD_TYPE},
    {labelKey: "cluster_finder_syntactic", value: ClusterFinderTreeType.SYNTACTIC},
    {labelKey: "cluster_finder_morphological", value: ClusterFinderTreeType.MORPHOLOGICAL}
  ];

  /** @type {number[]} */
  const wordSequenceLengthOptions = Array.from({length: 5}, (_, i) => i + 1);

  const addSelectedItemsToParams = (params, selectedItems) =>
    selectedItems.forEach((item) => {
      const [key, value] = item.split(":");
      if (!key || !value) {
        return;
      }
      params.append(key, value);
    });

  const buildPayload = () => {
    const params = new URLSearchParams();

    let partialFilters = false;
    if (typeValue[ClusterFinderTreeType.MORPHOLOGICAL]) {
      partialFilters = hasPartialFilters(morphologicalWordTypeNodes, selectedWordTypeItems);
    }

    params.append(ClusterSearchForm.INPUT_TYPE, ClusterSearchFormInputType.FREE_TEXT)
    params.append(ClusterSearchForm.USER_TEXT, storeData);
    params.append(ClusterSearchForm.FORM_ID, crypto.randomUUID());
    params.append(ClusterSearchForm.FILE_NAME, "");
    params.append(ClusterSearchForm.ANALYSIS_LENGTH, wordSequenceLength.toString());
    params.append(ClusterSearchForm.MORFO_ANALYSIS, typeValue[ClusterFinderTreeType.MORPHOLOGICAL].toString());
    params.append(ClusterSearchForm.SYNTACTIC_ANALYSIS, typeValue[ClusterFinderTreeType.SYNTACTIC].toString());
    params.append(ClusterSearchForm.INCLUDE_PUNCTUATION, isPunctuationSensitiveChecked.toString());
    params.append(ClusterSearchForm.WORDTYPE_ANALYSIS, typeValue[ClusterFinderTreeType.WORD_TYPE].toString());
    params.append(ClusterSearchForm.PARTIAL_FILTERS, partialFilters.toString());
    params.append(ClusterSearchForm.SORTING_TYPE, orderBy);

    addSelectedItemsToParams(params, selectedClauseTypeItems);
    addSelectedItemsToParams(params, selectedWordTypeItems);

    if (!params.has(ClusterSearchForm.CLAUSE_TYPE)) {
      params.append(ClusterSearchForm.CLAUSE_TYPE, ClauseType.ALL);
    }
    if (!params.has(ClusterSearchForm.WORD_TYPE)) {
      params.append(ClusterSearchForm.WORD_TYPE, WordType.ALL);
    }

    return params;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const noTypeValueSelected = !Object.values(typeValue).some(Boolean);
    setTypeError(noTypeValueSelected);

    if (noTypeValueSelected || !storeData) {
      return;
    }

    setShowTable(false);

    const params = buildPayload();
    getClusterFinderResult(params).then((result) => {
      if (!result) {
        return;
      }

      const parsedResult = JSON.parse(result);
      setResponse(parsedResult);

      if (parsedResult?.clusters?.length) {
        setShowNoResultsError(false);
        setShowTable(true);
        setIsAccordionExpanded(false);
      } else {
        setShowTable(false);
        setShowNoResultsError(true);
        setIsAccordionExpanded(true);
      }
    });
  };

  const applyTypeExclusionRules = (changedKey, isChecked) => {
    const nextValues = {...typeValue, [changedKey]: isChecked};

    // Rule: WordType is mutually exclusive with Morphological and Syntactic
    if (changedKey === ClusterFinderTreeType.WORD_TYPE && isChecked) {
      nextValues[ClusterFinderTreeType.MORPHOLOGICAL] = false;
      nextValues[ClusterFinderTreeType.SYNTACTIC] = false;
      setSelectedWordTypeItems([]);
    }

    // Rule: If either Morphological or Syntactic is checked, then WordType must be unchecked
    if ((changedKey === ClusterFinderTreeType.MORPHOLOGICAL || changedKey === ClusterFinderTreeType.SYNTACTIC) && isChecked) {
      nextValues[ClusterFinderTreeType.WORD_TYPE] = false;
      if (changedKey === ClusterFinderTreeType.MORPHOLOGICAL) {
        setSelectedWordTypeItems([]);
      }
    }

    // Rule: If Syntactic is checked while Morphological is unchecked, then Punctuation must be unchecked
    if (changedKey === ClusterFinderTreeType.SYNTACTIC && isChecked && !nextValues[ClusterFinderTreeType.MORPHOLOGICAL]) {
      setIsPunctuationSensitiveChecked(false);
    }

    // Rule: If Morphological is unchecked, and both Syntactic and Punctuation are checked, then Punctuation must be unchecked
    if (changedKey === ClusterFinderTreeType.MORPHOLOGICAL && !isChecked && nextValues[ClusterFinderTreeType.SYNTACTIC]) {
      setIsPunctuationSensitiveChecked(false);
    }

    return nextValues;
  };

  const handleTypeChange = (event) => {
    const {value, checked} = event.target;

    const updatedTypeValue = applyTypeExclusionRules(value, checked);

    setTypeValue(updatedTypeValue);
    setTypeError(false);
  };

  const handleWordSequenceLengthChange = (event) => {
    const newLength = event.target.value;
    const isSelectedOrderByOutOfBounds = ordinalSortingValues.indexOf(orderBy) >= newLength;

    if (isSelectedOrderByOutOfBounds) {
      setOrderBy(ClusterFinderSortingType.BY_FREQUENCY);
    }

    setWordSequenceLength(newLength);
  }

  const handleOrderByChange = (event) =>
    setOrderBy(event.target.value);

  const applyPunctuationSensitiveExclusionRules = (isChecked) => {
    const nextValues = {...typeValue};

    // Rule: If Punctuation is checked and Morphological is unchecked, then Syntactic must be unchecked
    if (isChecked && !typeValue[ClusterFinderTreeType.MORPHOLOGICAL]) {
      nextValues[ClusterFinderTreeType.SYNTACTIC] = false;
    }

    return nextValues;
  };

  const handlePunctuationSensitiveChange = (event) => {
    const {checked} = event.target;

    const updatedTypeValue = applyPunctuationSensitiveExclusionRules(checked);

    setIsPunctuationSensitiveChecked(checked);
    setTypeValue(updatedTypeValue);
  };

  return (
    <>
      <h2 className="tool-title">
        {t("common_clusters")}
      </h2>

      <Accordion
        expanded={isAccordionExpanded}
        onChange={() => setIsAccordionExpanded(!isAccordionExpanded)}
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

                  {clusterFinderTypes.map((type) => {
                    const tooltipKey = `${type.labelKey}_tooltip`;
                    const showTooltip = i18n.exists(tooltipKey);

                    return (
                      <FormControlLabel
                        control={<Checkbox checked={typeValue[type.value]} />}
                        key={type.value}
                        label={
                          <>
                            {t(type.labelKey)}
                            {showTooltip && (<TooltipButton>{t(tooltipKey)}</TooltipButton>)}
                          </>
                        }
                        onChange={handleTypeChange}
                        value={type.value}
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

                  <Select
                    name="orderBy"
                    onChange={handleOrderByChange}
                    size="small"
                    sx={{width: "200px"}}
                    value={orderBy}
                    variant="outlined"
                  >
                    {orderByOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
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
                    disabled={
                      orderBy === ClusterFinderSortingType.BY_FREQUENCY
                      || !typeValue[ClusterFinderTreeType.SYNTACTIC]
                    }
                    items={syntacticClauseTypeNodes}
                    selectedItems={selectedClauseTypeItems}
                    setSelectedItems={setSelectedClauseTypeItems}
                  />
                </FormControl>
              </Grid>

              <Grid item size={{xs: 12, sm: 6, md: 6}}>
                <FormControl>
                  <ClusterFinderTreeView
                    disabled={
                      orderBy === ClusterFinderSortingType.BY_FREQUENCY
                      || (!typeValue[ClusterFinderTreeType.MORPHOLOGICAL] && !typeValue[ClusterFinderTreeType.WORD_TYPE])
                    }
                    items={typeValue[ClusterFinderTreeType.MORPHOLOGICAL] ? morphologicalWordTypeNodes : wordTypeNodes}
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

      {showTable && <ClusterFinderTable data={response} />}

      {showNoResultsError && (
        <Alert severity="error">
          {t("error_no_matching_keywords")}
        </Alert>
      )}
    </>
  );
};
