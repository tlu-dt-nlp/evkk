import { Button, ButtonGroup, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import LastPageIcon from '@mui/icons-material/LastPage';
import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../translations/i18n';
import '../styles/TablePagination.css';
import { DefaultButtonStyle } from '../../const/StyleConstants';

export default function TablePagination({
                                          gotoPage,
                                          previousPage,
                                          canPreviousPage,
                                          nextPage,
                                          canNextPage,
                                          pageIndex,
                                          pageOptions,
                                          pageSize,
                                          setPageSize,
                                          pageCount
                                        }) {
  const { t } = useTranslation();

  return (
    <div className="pagination">
      <div className="buttongroup">
        <ButtonGroup
          className="pagination-button-group"
          size="medium"
          fullWidth
          variant="contained"
          aria-label="outlined primary button group"
        >
          <Button
            sx={DefaultButtonStyle}
            className="table-pagination-button"
            variant="contained"
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
          >
            {<FirstPageIcon />}
          </Button>
          <Button
            sx={DefaultButtonStyle}
            className="table-pagination-button"
            variant="contained"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            {<NavigateBeforeIcon />}
          </Button>
          <Button
            sx={DefaultButtonStyle}
            className="table-pagination-button"
            variant="contained"
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            {<NavigateNextIcon />}
          </Button>
          <Button
            sx={DefaultButtonStyle}
            variant="contained"
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {<LastPageIcon />}
          </Button>
          {' '}
        </ButtonGroup>
      </div>
      <span className="fontStyle">
        {t('pagination_page')}{' '}
        <strong>{pageIndex + 1} / {pageOptions.length}</strong>
      </span>
      <TextField
        size="small"
        id="outlined-number"
        label={t('pagination_go_to_page')}
        type="number"
        defaultValue={pageIndex + 1}
        className="pagination-textarea"
        onChange={e => {
          gotoPage(e.target.value ? Number(e.target.value) - 1 : 0);
        }}
        slotProps={{
          inputLabel: {
            shrink: true
          },
          htmlInput: {
            inputMode: 'numeric',
            pattern: '[0-9]*',
            min: '1',
            max: pageOptions.length
          }
        }}
      />
      <FormControl>
        <InputLabel>{t('pagination_rows_on_page')}</InputLabel>
        <Select
          size="small"
          value={pageSize}
          variant="outlined"
          className="pagination-textarea"
          onChange={e => {
            setPageSize(Number(e.target.value));
          }}
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
