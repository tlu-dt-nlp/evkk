import { Box, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import './styles/TableAppliedFilters.css';

export default function TableAppliedFilters({ appliedFilters }) {
  const { t } = useTranslation();

  const getAppliedFilters = () => {
    if (appliedFilters.length > 0) {
      return appliedFilters.map(value =>
        <Chip
          className="table-filter-chip"
          key={value}
          label={value}
        />
      );
    }
  };

  return appliedFilters.length > 0
    ? (
      <Box className="table-applied-filters-container">
        <span className="label">
          {t('applied_filters')}:
        </span>
        {getAppliedFilters()}
      </Box>
    )
    : null;
}
