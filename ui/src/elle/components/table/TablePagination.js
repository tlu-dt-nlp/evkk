import { Box, IconButton, InputBase, TablePagination as MuiTablePagination, Typography } from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { useTranslation } from 'react-i18next';
import '../../translations/i18n';
import './styles/TablePagination.css';

function TablePaginationActions({ count, page, rowsPerPage, onPageChange }) {
  const { t } = useTranslation();
  const pageCount = Math.ceil(count / rowsPerPage);

  const handleFirstPageButtonClick = event => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = event => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = event => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = event => {
    onPageChange(event, Math.max(0, pageCount - 1));
  };

  const handleGoToPage = event => {
    const value = event.target.value;
    if (value === '') return;
    const pageNumber = Math.max(1, Math.min(value, pageCount));
    onPageChange(event, pageNumber - 1);
  };

  return (
    <Box className="table-pagination-actions">
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= pageCount - 1}
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= pageCount - 1}
      >
        <LastPageIcon />
      </IconButton>
      <Box className="go-to-page-wrapper">
        <Typography
          variant="body2"
          component="label"
          htmlFor="go-to-page-input"
        >
          {t('pagination_go_to_page')}
        </Typography>
        <InputBase
          id="go-to-page-input"
          type="number"
          defaultValue={page + 1}
          key={page}
          onBlur={handleGoToPage}
          onKeyDown={e => e.key === 'Enter' && handleGoToPage(e)}
          inputProps={{
            inputMode: 'numeric',
            min: 1,
            max: pageCount
          }}
        />
      </Box>
    </Box>
  );
}

export default function TablePagination({ table, tableContainerRef }) {
  const { t } = useTranslation();

  const {
    pageIndex,
    pageSize
  } = table.getState().pagination;

  const totalRows = table.getPrePaginationRowModel().rows.length;
  const pageCount = table.getPageCount();

  const scrollToTop = () => {
    const modalBox = tableContainerRef.current.closest('.modal-base-root');

    if (modalBox) {
      requestAnimationFrame(() => {
        const tableRect = tableContainerRef.current.getBoundingClientRect();
        const modalRect = modalBox.getBoundingClientRect();
        const tableTopInModal = tableRect.top - modalRect.top + modalBox.scrollTop;
        modalBox.scrollTo({ top: tableTopInModal });
      });
    } else {
      const navbarHeight = window.innerWidth < 600 ? 61 : 64;
      const tableTop = tableContainerRef.current.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: Math.max(0, tableTop - navbarHeight) });
    }
  };

  const handleChangePage = (event, newPage) => {
    table.setPageIndex(newPage);
    setTimeout(scrollToTop, 50);
  };

  const handleChangeRowsPerPage = event => {
    table.setPageSize(event.target.value);
    table.setPageIndex(0);
    setTimeout(scrollToTop, 50);
  };

  return (
    <MuiTablePagination
      component="div"
      rowsPerPageOptions={[5, 10, 20, 30, 40, 50, 100]}
      count={totalRows}
      rowsPerPage={pageSize}
      page={pageIndex}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      ActionsComponent={props => <TablePaginationActions {...props} />}
      labelRowsPerPage={t('pagination_rows_per_page')}
      labelDisplayedRows={({ from, to, count: rowCount }) => (
        <>
          {t('pagination_rows')} {from}-{to} / {rowCount}
          <br />
          {t('pagination_page')} {pageIndex + 1} / {pageCount}
        </>
      )}
    />
  );
}
