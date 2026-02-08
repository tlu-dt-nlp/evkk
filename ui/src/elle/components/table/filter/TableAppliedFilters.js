import { Box, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import '../styles/TableAppliedFilters.css';

export default function TableAppliedFilters({ appliedFilters }) {
  const { t } = useTranslation();

  const getAppliedFilters = () => {
    if (appliedFilters !== []) {
      return appliedFilters.map(value =>
        <Chip
          className="table-filter-chip"
          key={value}
          label={value}
        />
      );
    }
  };

  return appliedFilters !== []
    ? (
      <Box>
        {t('applied_filters')}: {getAppliedFilters()}
      </Box>
    )
    : null;
}
