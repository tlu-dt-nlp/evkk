import { Button, TextField } from '@mui/material';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import GenericTable from '../../../components/table/GenericTable';
import { TableType } from '../../../components/table/TableDownloadButton';
import TableHeaderButtons from '../../../components/table/TableHeaderButtons';
import { ClusterFinderConfig } from '../../../const/ClusterFinderConstants';

const MAX_USAGES = ClusterFinderConfig.MAX_USAGES_DISPLAY;

/** Markups arrive underscore-padded and HTML-escaped. */
const decodeMarkups = (value) =>
  value
    ? String(value).replaceAll('_', '').replaceAll('&lt;', '<').replaceAll('&gt;', '>')
    : '';

const percentageOfTotal = (frequency, total) =>
  total === 0 ? '0.00%' : `${((frequency * 100) / total).toFixed(2)}%`;

/**
 * A row's usages, truncated until expanded.
 *
 * Owns its expanded flag rather than taking it from the table: holding it above would put
 * it in the column definitions' dependencies, so every expand click would rebuild all the
 * columns and re-render the whole table instead of this one cell.
 */
function UsagesCell({ usages }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!usages?.length) {
    return null;
  }

  const shown = isExpanded ? usages : usages.slice(0, MAX_USAGES);

  return (
    <div>
      {shown.map((usage, index) => (
        <div key={`${usage}-${index}`}>
          {usage}

          {index === shown.length - 1 && usages.length > MAX_USAGES && (
            <Button
              className="usages-toggle"
              onClick={() => setIsExpanded((expanded) => !expanded)}
            >
              {isExpanded ? '<' : '>'}
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * One definition per column, feeding both the table and the download so the two cannot
 * drift. `value` is the column's text; `downloadValue` overrides it where the export
 * needs a different form, and `cell` where the table needs more than text.
 */
const columnSpecs = [
  {
    id: 'markups',
    labelKey: 'cluster_finder_header_markups',
    value: (cluster) => cluster.markups?.map(decodeMarkups).join(' + ') ?? '',
  },
  {
    id: 'description',
    labelKey: 'cluster_finder_header_description',
    value: (cluster) => cluster.descriptions?.join(' + ') ?? '',
  },
  {
    id: 'frequency',
    labelKey: 'common_header_frequency',
    value: (cluster) => cluster.frequency,
  },
  {
    id: 'percentage',
    labelKey: 'common_header_percentage',
    value: (cluster, total) => percentageOfTotal(cluster.frequency, total),
  },
  {
    id: 'usages',
    labelKey: 'cluster_finder_header_usages',
    value: (cluster) => cluster.usages?.join('\n') ?? '',
    downloadValue: (cluster) => cluster.usages?.join(',') ?? '',
    cell: ({ row }) => <UsagesCell usages={row.original.usages} />,
  },
];

const downloadAccessors = columnSpecs.map((spec) => spec.id);

/** Rendered only for a non-empty result; the caller owns the empty and error states. */
export default function ClusterFinderTable({ clusters }) {
  const { t } = useTranslation();
  const [globalFilter, setGlobalFilter] = useState('');

  const totalFrequency = useMemo(
    () => clusters.reduce((total, cluster) => total + cluster.frequency, 0),
    [clusters]
  );

  const columns = useMemo(
    () => columnSpecs.map(({ id, labelKey, value, cell }) => ({
      id,
      header: t(labelKey),
      accessorFn: (cluster) => value(cluster, totalFrequency),
      // Spread, not `cell`: an explicit `cell: undefined` would override the table's own
      // default renderer and blank the column out.
      ...(cell && { cell }),
    })),
    [t, totalFrequency]
  );

  const downloadHeaders = useMemo(
    () => columnSpecs.map((spec) => t(spec.labelKey)),
    [t]
  );

  const downloadData = useMemo(
    () => clusters.map((cluster) => Object.fromEntries(
      columnSpecs.map(({ id, value, downloadValue }) =>
        [id, (downloadValue ?? value)(cluster, totalFrequency)]
      )
    )),
    [clusters, totalFrequency]
  );

  return (
    <>
      <TableHeaderButtons
        downloadAccessors={downloadAccessors}
        downloadData={downloadData}
        downloadHeaders={downloadHeaders}
        downloadTableType={TableType.CLUSTER_FINDER}
        rightComponent={
          <TextField
            className="table-search"
            onChange={(event) => setGlobalFilter(event.target.value)}
            placeholder={t('common_search')}
            size="small"
            type="search"
            value={globalFilter}
          />
        }
      />

      <GenericTable
        columns={columns}
        data={clusters}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        sortByColumnId="frequency"
        sortByDesc
      />
    </>
  );
}
