import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { Button, Grid, Input, Slider, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DefaultButtonStyle, DefaultInputStyle, DefaultSliderStyle } from '../../../const/StyleConstants';
import { Timeline } from '@mui/icons-material';
import ModalBase from '../../../components/modal/ModalBase';
import '../styles/GraphView.css';
import ImageDownloadButton, { ImageDownloadSourceType } from '../../../components/ImageDownloadButton';

export default function GraphView({ data, keyword }) {

  const defaultSliderValue = 30;
  const defaultCircleRadius = 8;

  const { t } = useTranslation();
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [sliderValue, setSliderValue] = useState(data.length > defaultSliderValue ? defaultSliderValue : data.length);
  const [svgState, setSvgState] = useState(null);

  const svgHeight = 475;
  const svgWidth = 1275;
  const svgEdgePadding = 20;
  const minRadiusRange = 5;
  const maxRadiusRange = 20;
  const mainCircleRadius = 10;

  useEffect(() => {
    if (modalOpen && svgState && data) {
      // Select the SVG and clear it before (re-)rendering
      const svg = d3.select(svgState);
      svg.selectAll('*').remove();

      // Slice the data based on the slider's value
      const dataCopy = JSON.parse(JSON.stringify(data));
      dataCopy.sort((a, b) => b.score - a.score);
      const slicedData = dataCopy.slice(0, sliderValue);

      // Normalize scores to the range [0, 1]
      const maxScore = d3.max(slicedData, d => d.score);
      const minScore = d3.min(slicedData, d => d.score);
      const normalizedData = slicedData.map(d => ({
        ...d,
        normalizedScore: (d.score - minScore) / (maxScore - minScore)
      }));

      normalizedData.forEach((d, i) => {
        const { x, y, radius } = getCoordinatesAndRadius(slicedData, maxScore === minScore, d, i);
        addCirclesAndLines(svg, radius, x, y);
      });

      // Doing a second loop is necessary to avoid text from being drawn over by subsequent circles
      normalizedData.forEach((d, i) => {
        const { x, y, radius } = getCoordinatesAndRadius(slicedData, maxScore === minScore, d, i);
        addLabelsAndAdjustPositions(svg, radius, x, y, d);
      });

      addMainCircleData(svg);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOpen, data, keyword, svgState, svgHeight, svgWidth, sliderValue]);

  // Calculate radius for each data point using normalized scores
  const normalizedRadius = d3.scaleLinear()
    .domain([0, 1]) // Normalized score range
    .range([minRadiusRange, maxRadiusRange]); // Output radius range

  const getCoordinatesAndRadius = (slicedData, allScoresAreEqual, d, i) => {
    // Calculate the maximum dominance value (leftOccurrences or rightOccurrences)
    const maxDominance = d3.max(slicedData, d => Math.max(d.leftOccurrences, d.rightOccurrences));

    // Set up scales for x and y axes with padding
    const xScale = d3.scaleLinear().domain([0, maxDominance]).range([svgEdgePadding, svgWidth - svgEdgePadding]);
    const yScale = d3.scaleLinear().domain([0, slicedData.length - 1]).range([svgEdgePadding, svgHeight - svgEdgePadding]);

    const leftRatio = d.leftOccurrences / (d.leftOccurrences + d.rightOccurrences);

    // Calculate the position based on the ratio of leftOccurrences to rightOccurrences
    const x = xScale(maxDominance * (1 - leftRatio)); // Adjusted calculation to mirror the coordinates to the correct side (left or right)

    // Calculate y-coordinate to evenly space points along the y-axis
    const y = yScale(i);

    let radius;
    if (allScoresAreEqual) {
      // Set a default radius, otherwise the circles would not have a radius
      radius = defaultCircleRadius;
    } else {
      radius = normalizedRadius(d.normalizedScore);
    }

    return { x, y, radius };
  };

  const addCirclesAndLines = (svg, radius, x, y) => {
    // Add lines connecting each circle to the main circle
    // Drawing lines before circles is important, otherwise they would be drawn on top of the circles
    svg.append('line')
      .attr('x1', svgWidth / 2)
      .attr('y1', svgHeight / 2)
      .attr('x2', x)
      .attr('y2', y)
      .attr('stroke', 'rgba(128, 128, 128, 0.5)')
      .attr('stroke-width', 1);

    // Draw circles for each data point
    svg.append('circle')
      .attr('cx', x)
      .attr('cy', y)
      .attr('r', radius)
      .attr('fill', 'rgb(255, 208, 253)');
  };

  const addLabelsAndAdjustPositions = (svg, radius, x, y, d) => {
    // Add labels for each data point
    const label = svg.append('text')
      .attr('x', x)
      .attr('y', y)
      .text(d.collocate);

    // Adjust label position based on circle position
    if (x === svgWidth / 2) { // If circle is in the center of the canvas
      if (y < svgHeight / 2) { // If circle is in the upper half, place the text below it at the center
        label.attr('text-anchor', 'middle')
          .attr('dy', radius * 2);
      } else { // If circle is in the lower half, place the text above it at the center
        label.attr('text-anchor', 'middle')
          .attr('dy', -radius * 2);
      }
    } else if (y < svgHeight / 2) {
      if (x < svgWidth / 2) { // Top left quadrant
        label.attr('dx', radius)
          .attr('dy', radius);
      } else { // Top right quadrant
        label.attr('text-anchor', 'end')
          .attr('dx', -radius)
          .attr('dy', radius);
      }
    } else {
      if (x < svgWidth / 2) { // Bottom left quadrant
        label.attr('dx', radius)
          .attr('dy', -radius);
      } else { // Bottom right quadrant
        label.attr('text-anchor', 'end')
          .attr('dx', -radius)
          .attr('dy', -radius);
      }
    }
  };

  const addMainCircleData = (svg) => {
    // Add main circle at the center
    svg.append('circle')
      .attr('cx', svgWidth / 2)
      .attr('cy', svgHeight / 2)
      .attr('r', mainCircleRadius)
      .attr('fill', 'rgb(156, 39, 176)');

    // Add label for the main circle
    svg.append('text')
      .attr('x', svgWidth / 2)
      .attr('y', svgHeight / 2 - 30)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'central')
      .attr('font-weight', 'bold')
      .attr('font-size', '25px')
      .text(keyword);
  };

  const handleOpenButtonClick = () => {
    setTooltipOpen(false);
    setModalOpen(true);
  };

  const handleSliderChange = (e, value) => {
    setSliderValue(value);
  };

  const handleInputChange = (e) => {
    setSliderValue(e.target.value === '' ? 0 : Number(e.target.value));
  };

  return (
    <Tooltip
      title={t('collocates_graph_modal_tooltip')}
      open={tooltipOpen}
      placement="top"
    >
      <Button
        style={DefaultButtonStyle}
        variant="contained"
        onClick={handleOpenButtonClick}
        onMouseEnter={() => setTooltipOpen(true)}
        onMouseLeave={() => setTooltipOpen(false)}
      >
        <Timeline fontSize="large" />
      </Button>
      <ModalBase
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        innerClassName="graph-modal"
        title="collocates_graph"
        titleTooltip="collocates_graph_tooltip"
      >
        <ImageDownloadButton
          element={svgState}
          sourceType={ImageDownloadSourceType.SVG}
          fileName="collocates_graph_filename"
        />
        <Typography>
          {t('collocates_graph_slider_title')}
        </Typography>
        <Grid
          container
          spacing={2}
          alignItems="center"
        >
          <Grid size="grow">
            <Slider
              sx={DefaultSliderStyle}
              value={sliderValue}
              onChange={handleSliderChange}
              min={1}
              max={data.length}
              valueLabelDisplay="auto"
              marks
            />
          </Grid>
          <Grid
            size="auto"
            className="input-grid-item"
          >
            <Input
              sx={DefaultInputStyle}
              disableUnderline
              value={sliderValue}
              onChange={handleInputChange}
              inputProps={{
                step: 1,
                min: 1,
                max: data.length,
                type: 'number'
              }}
            />
          </Grid>
        </Grid>
        <svg
          ref={setSvgState}
          height={svgHeight}
          width={svgWidth}
        />
      </ModalBase>
    </Tooltip>
  );
}
