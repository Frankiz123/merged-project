import React, { useRef, useEffect } from 'react';

import { Box, Grid } from '@mui/material';
import * as d3 from 'd3';

import { DeviceData } from 'services/dashboard';
import Text from '@components/Text';
import { toCapitalize } from '@utils/index';
import styles from './vennChart.module.scss';

const BASE_COLORS = ['rgba(252, 89, 74, 1)', 'rgba(128, 221, 171, 1)', 'rgba(203, 203, 203, 1)', 'rgba(35, 35, 35, 1)'];

const COLORS = ['rgba(252, 89, 74, 0.8)', 'rgba(128, 221, 171, 0.8)', 'rgba(203, 203, 203, 0.8)', 'rgba(35, 35, 35, 0.8)'];

interface IVennChart {
  text: string;
  totalClicks: number;
  deviceData: DeviceData[];
}

const VennChart: React.FC<IVennChart> = ({ text, totalClicks, deviceData }) => {
  const chartWrapperRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create the Venn chart here
    // Use D3.js to draw the Venn diagram based on the data provided
    const drawChart = (): void => {
      if (chartWrapperRef?.current && chartRef?.current) {
        // Remove existing chart before redrawing
        d3.select(chartRef.current).selectAll('*').remove();

        // Your D3.js code to draw the Venn diagram based on the data
        // Use the chartRef.current to access the DOM element where the chart will be rendered
        const svg = d3
          .select(chartRef.current)
          .append('svg')
          .attr('width', 240)
          .attr('height', deviceData.length === 2 ? 160 : 240)
          .attr('id', 'chartRef');

        deviceData.forEach((item: DeviceData, index: number) => {
          const percentage = item.clicks > 0 && totalClicks > 0 ? (item.clicks / totalClicks) * 100 : 0;
          const size = 47 + (percentage > 45 ? percentage / 6 : percentage / 2);
          let x = size;
          let y = size;
          if (index === 1) {
            x = 2 * (x + 15);
          } else if (index === 2) {
            y = 2 * (y + 15);
          } else if (index === 3) {
            x = 2 * (x + 15);
            y = 2 * (y + 15);
          }
          svg.append('circle').attr('cx', x).attr('cy', y).attr('r', size).style('fill', COLORS[index]);
          const text = svg
            .append('text')
            .attr('x', x)
            .attr('y', y)
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .text(`${percentage.toFixed(0)} %`);
          text.style('fill', '#FFFFFF').style('font-weight', 700).style('font-size', '21px').style('font-family', 'Poppins-Regular');
        });
      }
    };

    // Initial draw
    drawChart();

    // Handle window resize for responsiveness
    const handleResize = (): void => {
      drawChart();
    };

    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [chartWrapperRef, chartRef, totalClicks, deviceData]);

  return (
    <Box className={styles.parentWrapper}>
      <Text variant='subtitle1' text={text} className={styles.text} />
      <div className={styles.graphWrapper}>
        <div ref={chartWrapperRef} className={styles.graph}>
          <div ref={chartRef} className={[styles.graphMain].join(' ')}></div>
        </div>
      </div>
      <Grid className={styles.deviceList}>
        {deviceData.map((data: DeviceData, index: number) => {
          const color = BASE_COLORS[index];
          return (
            <div className={styles.device} key={index}>
              <div className={styles.deviceColor} style={{ backgroundColor: color }}></div>
              <Text text={toCapitalize(data.key)} className={styles.textDevice} />
            </div>
          );
        })}
      </Grid>
    </Box>
  );
};

export default VennChart;
