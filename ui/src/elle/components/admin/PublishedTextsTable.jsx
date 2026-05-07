import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { formatDate } from '../../util/DateUtils';
import GenericTable from '../table/GenericTable';

export default function PublishedTextsTable({ rows }) {
  const { t } = useTranslation();

  const columns = useMemo(() => [
    {
      id: 'createdAt',
      header: t('query_results_added_at'),
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
