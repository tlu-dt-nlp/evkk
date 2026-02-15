import TablePagination from './TablePagination';
import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel
} from '@mui/material';
import { useMemo, useRef, useState } from 'react';
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
                                       showRowNumbers = false,
                                       enableRowSelection = false,
                                       rowSelection,
                                       onRowSelectionChange,
                                       getRowId
                                     }) {
  const { t } = useTranslation();

  const [sorting, setSorting] = useState([{ id: sortByColumnId, desc: sortByDesc }]);
  const [columnVisibility, setColumnVisibility] = useState(() => (hiddenColumn ? { [hiddenColumn]: false } : {}));
  const tableContainerRef = useRef(null);

  const rowNumberColumn = useMemo(() => ({
    id: '_rowNumber',
    header: t('common_header_number'),
    accessorKey: '_rowNumber',
    enableSorting: false,
    cell: ({ row, table }) => {
      const allRows = table.getPrePaginationRowModel().rows;
      return allRows.findIndex(r => r.id === row.id) + 1;
    },
    meta: { maxWidth: '20px' }
  }), [t]);

  const selectionColumn = useMemo(() => ({
    id: '_select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
    enableSorting: false,
    meta: { className: 'checkbox-column' }
  }), []);

  const tableColumns = useMemo(() => {
    let cols = columns;
    if (showRowNumbers) {
      cols = [rowNumberColumn, ...cols];
    }
    if (enableRowSelection) {
      cols = [selectionColumn, ...cols];
    }
    return cols;
  }, [showRowNumbers, rowNumberColumn, enableRowSelection, selectionColumn, columns]);

  const table = useReactTable({
    columns: tableColumns,
    data,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      ...(enableRowSelection && { rowSelection })
    },
    defaultColumn: {
      sortDescFirst: false,
      sortingFn: sortTableColumn,
      filterFn: multiSelectFilter
    },
    enableRowSelection,
    onRowSelectionChange,
    getRowId,
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
      <TableContainer ref={tableContainerRef}>
        <Table className="generic-table">
          <TableHead>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableCell
                    key={header.id}
                    colSpan={header.colSpan}
                    className={`
                      ${header.column.columnDef.meta?.className ?? ''}
                      ${header.column.columnDef.meta?.classNameTh ?? ''}
                    `}
                    sx={{
                      minWidth: header.column.columnDef.meta?.minWidth,
                      maxWidth: header.column.columnDef.meta?.maxWidth
                    }}
                  >
                    {(() => {
                      const headerContent = header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext());

                      return header.column.getCanSort() ? (
                        <TableSortLabel
                          active={header.column.getIsSorted() !== false}
                          direction={header.column.getIsSorted() || 'asc'}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {headerContent}
                        </TableSortLabel>
                      ) : (
                        headerContent
                      );
                    })()}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <TableRow
                key={row.id}
                className="content-row"
              >
                {row.getVisibleCells().map(cell => (
                  <TableCell
                    key={cell.id}
                    className={`
                      ${cell.column.columnDef.meta?.className ?? ''}
                      ${cell.column.columnDef.meta?.classNameTd ?? ''}
                    `}
                    sx={{
                      minWidth: cell.column.columnDef.meta?.minWidth,
                      maxWidth: cell.column.columnDef.meta?.maxWidth
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        table={table}
        tableContainerRef={tableContainerRef}
      />
    </>
  );
}
