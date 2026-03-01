import ToggleCell from '../tools/wordanalyser/ToggleCell';

export const sortTableDataByColumn = (data, sortByColumnAccessor) => {
  const dataCopy = [...data];
  return dataCopy.sort(function (a, b) {
    const propA = a[sortByColumnAccessor];
    const propB = b[sortByColumnAccessor];
    if (propA === propB) return dataCopy.indexOf(b) - dataCopy.indexOf(a);
    return propB - propA;
  });
};

export const sortTableColumn = (rowA, rowB, columnId) => {
  const valueA = rowA.getValue(columnId) ?? '';
  const valueB = rowB.getValue(columnId) ?? '';

  const numA = typeof valueA === 'number' ? valueA : parseFloat(valueA);
  const numB = typeof valueB === 'number' ? valueB : parseFloat(valueB);

  if (!isNaN(numA) && !isNaN(numB)) {
    return numA - numB;
  }

  return String(valueA).localeCompare(String(valueB), 'et', { sensitivity: 'case' });
};

export const sortColumnByLastWord = (rowA, rowB, columnId) => {
  const valueA = String(rowA.getValue(columnId)).split(' ').at(-1) ?? '';
  const valueB = String(rowB.getValue(columnId)).split(' ').at(-1) ?? '';
  return valueA.localeCompare(valueB, 'et', { sensitivity: 'case' });
};

export const multiSelectFilter = (row, columnId, filterValues) => {
  if (!filterValues || filterValues.length === 0) return true;

  const cellValue = row.getValue(columnId);
  return filterValues.some(value => cellValue.includes(value));
};

export const generateWordExampleCell = (items, setWord) => {
  const cellContent = [];
  for (let i = 0; i < items[0].length; i++) {
    const word = items[0][i];
    const count = items[1][i];
    const id = items[3][i];

    cellContent.push(
      <span key={id}>
        <span
          className="word"
          onClick={() => setWord(id)}
        >
          {word}
        </span>
        &nbsp;
        {count}
      </span>
    );
  }
  return <ToggleCell onCellContent={cellContent} />;
};
