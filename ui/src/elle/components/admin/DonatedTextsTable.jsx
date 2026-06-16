import { Link } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { formatDate } from '../../util/DateUtils';
import GenericTable from '../table/GenericTable';

export default function DonatedTextsTable({ onOpenDetails, rows }) {
  const { t } = useTranslation();

  const renderTitleButton = (textId, title) => (
    <Link
      component="button"
      onClick={() => onOpenDetails(textId)}
      underline="hover"
    >
      {title}
    </Link>
  );

  const columns = useMemo(() => [
    {
      id: 'createdAt',
      header: t('query_results_created_at'),
      accessorKey: 'createdAt',
      cell: info => formatDate(info.row.original.createdAt),
      sortingFn: 'datetime',
      meta: {
        className: 'text-nowrap'
      }
    },
    {
      id: 'title',
      header: t('query_results_text_title'),
      accessorKey: 'title',
      cell: info => renderTitleButton(info.row.original.textId, info.getValue()),
      enableSorting: false,
      meta: {
        className: 'w-100'
      }
    }
  ], [t]);

  return (
    <GenericTable
      columns={columns}
      data={rows}
      getRowId={(row) => row.textId}
      sortByColumnId="createdAt"
    />
  );
}
