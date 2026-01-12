import React from 'react';
import { Box, Chip, Grid, Typography } from '@mui/material';
import './styles/SingleLink.css';
import NewTabHyperlink from './NewTabHyperlink';

export default function SingleLink({ name, siteLink, text, image, tags }) {

  return (
    <Box className="single-link-container">
      <Grid container spacing={2}>
        <Grid item size={12} container alignItems="center" spacing={1}>
          <Grid item>
            <img src={image} className="link-image" alt={`${name} logo`} />
          </Grid>
          <Grid item>
            <NewTabHyperlink
              path={siteLink}
              content={name}
              className="site-link"
            />
          </Grid>
        </Grid>

        <Grid item size={12}>
          <Typography>{text}</Typography>
        </Grid>

        <Grid item size={12}>
          {tags.map(tag => (
            <Chip key={tag} label={tag} className="link-tab-chip" />
          ))}
        </Grid>
      </Grid>
    </Box>
  );
}
