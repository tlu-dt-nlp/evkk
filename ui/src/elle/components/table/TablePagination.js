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

export default function TablePagination(props) {
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
            onClick={() => props.gotoPage(0)}
            disabled={!props.canPreviousPage}
          >
            {<FirstPageIcon />}
          </Button>
          <Button
            sx={DefaultButtonStyle}
            className="table-pagination-button"
            variant="contained"
            onClick={() => props.previousPage()}
            disabled={!props.canPreviousPage}
          >
            {<NavigateBeforeIcon />}
          </Button>
          <Button
            sx={DefaultButtonStyle}
            className="table-pagination-button"
            variant="contained"
            onClick={() => props.nextPage()}
            disabled={!props.canNextPage}
          >
            {<NavigateNextIcon />}
          </Button>
          <Button
            sx={DefaultButtonStyle}
            variant="contained"
            onClick={() => props.gotoPage(props.pageCount - 1)}
            disabled={!props.canNextPage}
          >
            {<LastPageIcon />}
          </Button>
          {' '}
        </ButtonGroup>
      </div>
      <span className="fontStyle">
        {t('pagination_page')}{' '}
        <strong>{props.pageIndex + 1} / {props.pageOptions.length}</strong>
      </span>
      <TextField
        size="small"
        id="outlined-number"
        label={t('pagination_go_to_page')}
        type="number"
        defaultValue={props.pageIndex + 1}
        className="pagination-textarea"
        onChange={e => {
          props.gotoPage(e.target.value ? Number(e.target.value) - 1 : 0);
        }}
        InputLabelProps={{
          shrink: true
        }}
      />
      <FormControl>
        <InputLabel>{t('pagination_rows_on_page')}</InputLabel>
        <Select
          size="small"
          value={props.pageSize}
          variant="outlined"
          className="pagination-textarea"
          onChange={e => {
            props.setPageSize(Number(e.target.value));
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
