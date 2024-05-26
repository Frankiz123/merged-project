import React from 'react';

import { Grid, Box, Divider, Link } from '@mui/material';

import Text from '@components/Text';

import styles from './detailcard.module.scss';

interface DetailCardProps {
  className?: string;
  title: string;
  subTitle?: string;
  headerData?: {
    text: string;
    value: string;
    count: string;
    startIcon?: string;
  };
  data?: Array<{
    logo?: string;
    text: string;
    value: string;
    count: string;
    startIcon?: string;
  }>;
  onPrimaryTextClick?: () => void;
}

const DetailCard: React.FC<DetailCardProps> = ({
  // className,
  title,
  subTitle,
  data,
  onPrimaryTextClick = () => {},
  headerData,
}) => (
  <div className={styles.acountDetail}>
    <Box className={styles.upperContainer}>
      <Text text={title} variant={'h1'} className={styles.heading} />
      {subTitle && <Text text={subTitle} variant={'subtitle1'} className={styles.subtitle} />}
      {headerData && (
        <Box className={styles.header}>
          <Grid className={styles.column}>
            <Text text={headerData.text} variant={'subtitle1'} className={styles.textBold} />
          </Grid>
          <Box className={styles.column}>
            {headerData.startIcon && <img src={headerData.startIcon} />}
            <Text text={headerData.count} variant={'subtitle1'} className={styles.textStart} />
            <Text text={headerData.value} variant={'subtitle1'} className={styles.textEnd} />
          </Box>
        </Box>
      )}
      {data?.map((item, index) => (
        <div key={index}>
          <Box className={styles.row}>
            <Grid className={styles.column}>
              {item.logo && <img src={item.logo} className={styles.logo} />}
              <Text text={item.text} variant={'subtitle1'} className={item.logo ? styles.textStart : styles.textBold} />
            </Grid>
            <Box className={styles.column}>
              {item.startIcon && <img src={item.startIcon} />}
              <Text text={item.count} variant={'subtitle1'} className={styles.textStart} />
              <Text text={item.value} variant={'subtitle1'} className={styles.textEnd} />
            </Box>
          </Box>
          <Divider light />
        </div>
      ))}
    </Box>
    {data && (
      <Box className={styles.link}>
        <Link onClick={onPrimaryTextClick}>...see more</Link>
      </Box>
    )}
  </div>
);

export default DetailCard;
