import { Box } from '@mui/material';
import TableDownloadButton from './TableDownloadButton';
import '../styles/TableHeaderButtons.css';

export default function TableHeaderButtons({
                                             leftComponent,
                                             rightComponent,
                                             downloadData,
                                             downloadHeaders,
                                             downloadTableType,
                                             downloadAccessors,
                                             downloadSortByColumnAccessor
                                           }) {

  return (
    <Box
      className="table-header-button-row"
      style={{
        justifyContent: leftComponent === undefined
          ? 'flex-end'
          : 'space-between'
      }}
    >
      {leftComponent}
      <Box
        style={
          rightComponent !== undefined
            ? { display: 'flex', gap: '10px' }
            : {}
        }
      >
        {rightComponent}
        <TableDownloadButton
          data={downloadData}
          tableType={downloadTableType}
          headers={downloadHeaders}
          accessors={downloadAccessors}
          sortByColumnAccessor={downloadSortByColumnAccessor}
        />
      </Box>
    </Box>
  );
}
