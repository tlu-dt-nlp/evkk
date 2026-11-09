import { Paper, Typography } from '@mui/material';

const MetricCard = ({ value, label }) => (
  <Paper elevation={0} className="stats-metric-card">
    <Typography className="stats-metric-value">{value}</Typography>
    <Typography variant="body2" className="stats-metric-label">{label}</Typography>
  </Paper>
);

export default MetricCard;

