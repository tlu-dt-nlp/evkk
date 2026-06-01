import { FormLabel, Grid, Stack } from '@mui/material';

export default function ReadOnlyField({ label, value }) {
  if (!value) {
    return null;
  }

  return (
    <Grid item size={{ xs: 12 }}>
      <Stack>
        <FormLabel>{label}</FormLabel>
        <span style={{ whiteSpace: 'pre-line' }}>{value}</span>
      </Stack>
    </Grid>
  );
}
