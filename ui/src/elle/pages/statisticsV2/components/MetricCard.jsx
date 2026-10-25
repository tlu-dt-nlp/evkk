import { Paper, Typography } from '@mui/material';

const MetricCard = ({ value, label }) => (
  <Paper elevation={0} className="sv2-metric-card">
    <Typography className="sv2-metric-value">{value}</Typography>
    <Typography variant="body2" className="sv2-metric-label">{label}</Typography>
  </Paper>
);

export default MetricCard;

