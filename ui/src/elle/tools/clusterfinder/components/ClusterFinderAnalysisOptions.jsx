import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Grid,
  MenuItem,
  Select,
} from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import LabelWithTooltip from '../../../components/tooltip/LabelWithTooltip';
import {
  ClusterFinderSortingType,
  ClusterFinderTreeType,
  ordinalSortingValues,
} from '../../../const/ClusterFinderConstants';

const analysisTypeCheckboxes = [
  { labelKey: 'cluster_finder_word_type', value: ClusterFinderTreeType.WORD_TYPE },
  { labelKey: 'cluster_finder_syntactic', value: ClusterFinderTreeType.SYNTACTIC },
  { labelKey: 'cluster_finder_morphological', value: ClusterFinderTreeType.MORPHOLOGICAL },
];

// 1..n, where n is how many word positions ClusterFinderSortingType can address. Derived
// so that adding or removing an ordinal sorting value keeps this dropdown in step.
const wordSequenceLengthOptions = Array.from(
  { length: ordinalSortingValues.length },
  (_, index) => index + 1
);

const GRID_ITEM_SIZE = { xs: 12, sm: 6, md: 4 };

/**
 * The three top-row option panels: analysis type, word-sequence length + order,
 * and the punctuation toggle. Presentational — all state lives in useClusterFinderForm.
 */
export default function ClusterFinderAnalysisOptions({
  typeValue,
  typeError,
  onTypeChange,
  wordSequenceLength,
  onWordSequenceLengthChange,
  orderBy,
  onOrderByChange,
  isPunctuationSensitiveChecked,
  onPunctuationChange,
}) {
  const { t } = useTranslation();

  // Sorting by the nth word only makes sense up to the sequence length.
  const orderByOptions = useMemo(() => [
    {
      value: ClusterFinderSortingType.BY_FREQUENCY,
      label: t('cluster_finder_order_by_frequency'),
    },
    ...ordinalSortingValues.slice(0, wordSequenceLength).map((value, index) => ({
      value,
      label: t('cluster_finder_order_by_nth_word', {
        ordinal: t('ordinal', { count: index + 1, ordinal: true }),
      }),
    })),
  ], [t, wordSequenceLength]);

  return (
    <Grid className="analysis-options" container spacing={2}>
      <Grid size={GRID_ITEM_SIZE}>
        <FormControl component="fieldset" error={typeError}>
          <FormLabel component="legend">{t('cluster_finder_analysis')}</FormLabel>

          <FormGroup>
            {analysisTypeCheckboxes.map((type) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={typeValue[type.value]}
                    onChange={(event) => onTypeChange(type.value, event.target.checked)}
                  />
                }
                key={type.value}
                label={<LabelWithTooltip labelKey={type.labelKey} />}
              />
            ))}
          </FormGroup>

          {typeError && <FormHelperText>{t('error_mandatory_field')}</FormHelperText>}
        </FormControl>
      </Grid>

      <Grid size={GRID_ITEM_SIZE}>
        <FormControl>
          <FormLabel>{t('cluster_finder_word_sequence_length')}</FormLabel>

          <Select
            className="sequence-length-select"
            onChange={(event) => onWordSequenceLengthChange(event.target.value)}
            size="small"
            value={wordSequenceLength}
          >
            {wordSequenceLengthOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>{t('cluster_finder_search_and_order')}</FormLabel>

          <Select
            className="order-by-select"
            onChange={(event) => onOrderByChange(event.target.value)}
            size="small"
            value={orderBy}
          >
            {orderByOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid size={GRID_ITEM_SIZE}>
        <FormControl>
          <FormLabel>{t('common_other_options')}</FormLabel>

          <FormControlLabel
            control={
              <Checkbox
                checked={isPunctuationSensitiveChecked}
                onChange={(event) => onPunctuationChange(event.target.checked)}
              />
            }
            label={<LabelWithTooltip labelKey="cluster_finder_punctuation_sensitive" />}
          />
        </FormControl>
      </Grid>
    </Grid>
  );
}
