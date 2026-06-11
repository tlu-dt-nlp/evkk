import { FormLabel, Grid, Stack } from '@mui/material';

export default function ReadOnlyField({ label, value, multiline }) {
  let paragraphCount = 0;

  const getParagraphKey = (item) => {
    if (item) {
      return item;
    }

    paragraphCount++;
    return `empty_paragraph_${paragraphCount}`;
  };

  if (!value) {
    return null;
  }

  return (
    <Grid item size={{ xs: 12 }}>
      <Stack>
        <FormLabel>{label}</FormLabel>
        {multiline ? (
          <span>
            {value.split(/\\n|\n/g).map(item => (
              <span key={getParagraphKey(item)}>
                {item}
                <br />
              </span>
            ))}
          </span>
        ) : (
          <span style={{ whiteSpace: 'pre-line' }}>{value}</span>
        )}
      </Stack>
    </Grid>
  );
}
