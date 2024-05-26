import React from 'react';

import { Grid } from '@mui/material';

import Text from '@components/Text';

import styles from './countcard.module.scss';

interface TextProps {
  text: string;
  count: string;
  className?: string;
}

const CountCard: React.FC<TextProps> = ({ text, count }) => (
  <Grid item xs={12} sm={6} md={6} lg={4} key={text}>
    <div className={styles.card}>
      <Text text={text} className={styles.heading} />
      <Text text={count} className={styles.heading} />
    </div>
  </Grid>
);

export default React.memo(CountCard);
