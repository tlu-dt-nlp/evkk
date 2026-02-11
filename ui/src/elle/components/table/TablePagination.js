import { Button, ButtonGroup, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import LastPageIcon from '@mui/icons-material/LastPage';
import { useTranslation } from 'react-i18next';
import '../../translations/i18n';
import './styles/TablePagination.css';
import { DefaultButtonStyle } from '../../const/StyleConstants';

export default function TablePagination({ table }) {
  const { t } = useTranslation();

  const {
    pageIndex,
    pageSize
  } = table.getState().pagination;

  const pageCount = table.getPageCount();

  return (
    <div className="table-pagination">
      <div className="button-group-wrapper">
        <ButtonGroup
          className="pagination-button-group"
          size="medium"
          fullWidth
          variant="contained"
        >
          <Button
            sx={DefaultButtonStyle}
            className="table-pagination-button"
            variant="contained"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {<FirstPageIcon />}
          </Button>
          <Button
            sx={DefaultButtonStyle}
            className="table-pagination-button"
            variant="contained"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {<NavigateBeforeIcon />}
          </Button>
          <Button
            sx={DefaultButtonStyle}
            className="table-pagination-button"
            variant="contained"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {<NavigateNextIcon />}
          </Button>
          <Button
            sx={DefaultButtonStyle}
            variant="contained"
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
          >
            {<LastPageIcon />}
          </Button>
          {' '}
        </ButtonGroup>
      </div>
      <span className="page-info">
        {t('pagination_page')}{' '}
        <strong>{pageIndex + 1} / {pageCount}</strong>
      </span>
      <TextField
        size="small"
        id="outlined-number"
        label={t('pagination_go_to_page')}
        type="number"
        defaultValue={pageIndex + 1}
        className="pagination-input"
        onChange={e => table.setPageIndex(e.target.value ? Number(e.target.value) - 1 : 0)}
        slotProps={{
          inputLabel: {
            shrink: true
          },
          htmlInput: {
            inputMode: 'numeric',
            pattern: '[0-9]*',
            min: '1',
            max: pageCount
          }
        }}
      />
      <FormControl>
        <InputLabel>{t('pagination_rows_on_page')}</InputLabel>
        <Select
          size="small"
          value={pageSize}
          className="pagination-input"
          onChange={e => table.setPageSize(Number(e.target.value))}
        >
          {[5, 10, 20, 30, 40, 50, 100].map(pageSizeNo => (
            <MenuItem key={pageSizeNo} value={pageSizeNo}>
              {pageSizeNo}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
