import TablePagination from './TablePagination';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import './styles/GenericTable.css';
import { multiSelectFilter, sortTableColumn } from '../../util/TableUtils';

export default function GenericTable({
                                       columns,
                                       data,
                                       hiddenColumn,
                                       sortByColumnId,
                                       sortByDesc = true,
                                       columnFilters,
                                       onColumnFiltersChange,
                                       showRowNumbers = false
                                     }) {
  const { t } = useTranslation();

  const [sorting, setSorting] = useState([{ id: sortByColumnId, desc: sortByDesc }]);
  const [columnVisibility, setColumnVisibility] = useState(() => (hiddenColumn ? { [hiddenColumn]: false } : {}));

  const rowNumberColumn = useMemo(() => ({
    id: '_rowNumber',
    header: t('common_header_number'),
    accessorKey: '_rowNumber',
    enableSorting: false,
    cell: ({ row, table }) => {
      const allRows = table.getPrePaginationRowModel().rows;
      return allRows.findIndex(r => r.id === row.id) + 1;
    }
  }), [t]);

  const tableColumns = useMemo(
    () => (showRowNumbers ? [rowNumberColumn, ...columns] : columns),
    [showRowNumbers, rowNumberColumn, columns]
  );

  const table = useReactTable({
    columns: tableColumns,
    data,
    state: {
      sorting,
      columnVisibility,
      columnFilters
    },
    defaultColumn: {
      sortDescFirst: false,
      sortingFn: sortTableColumn,
      filterFn: multiSelectFilter
    },
    onColumnFiltersChange,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  return (
    <>
      <table className="generic-table">
        <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th
                key={header.id}
                colSpan={header.colSpan}
                className={`
                  ${header.column.columnDef.meta?.className ?? ''}
                  ${header.column.columnDef.meta?.classNameTh ?? ''}
                `}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}

                {header.column.getCanSort() &&
                  <span
                    onClick={header.column.getToggleSortingHandler()}
                    role="button"
                    className="sorting-handler"
                  >
                    {(() => {
                      const sorted = header.column.getIsSorted();
                      if (!sorted) return ' ▼▲';
                      return sorted === 'desc' ? ' ▼' : ' ▲';
                    })()}
                  </span>
                }
              </th>
            ))}
          </tr>
        ))}
        </thead>
        <tbody>
        {table.getRowModel().rows.map(row => (
          <tr
            key={row.id}
            className="content-row"
          >
            {row.getVisibleCells().map(cell => (
              <td
                key={cell.id}
                className={`
                  ${cell.column.columnDef.meta?.className ?? ''}
                  ${cell.column.columnDef.meta?.classNameTd ?? ''}
                `}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
        </tbody>
      </table>
      <br />
      <TablePagination table={table} />
    </>
  );
}
