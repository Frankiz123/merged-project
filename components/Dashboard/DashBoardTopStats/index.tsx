import React, { useState } from 'react';

import { Box } from '@mui/material';

import Text from '@components/Text';
import styles from './dashboardTopStats.module.scss';

const BarChartIcon = '/images/bar-chart-2.svg';

interface IDashBoardTopStats {
  data?: Array<{
    name: string;
    count: number;
    flagCode?: string;
  }>;
  heading?: string;
}

const DashBoardTopStats: React.FC<IDashBoardTopStats> = ({ heading = '', data }) => {
  const [onSeeMoreOrLess, setOnSeeMoreOrLess] = useState<boolean>(false);

  return (
    <Box className={styles.boxWrapper}>
      <Text text={heading} className={styles.heading} />
      <Box className={!onSeeMoreOrLess ? styles.WrapperShowMore : styles.WrapperShowLess}>
        {data?.map((v, i) => (
          <Box className={styles.statsWrapper} key={i}>
            <Box className={styles.textWithIcon}>
              {heading === 'Top Location' && <Text text={v.flagCode as string} className={styles.flagName} />}
              <Text text={`${v.name}`} className={styles.hashText} />
            </Box>
            <Box className={styles.iconTextBox}>
              <img src={BarChartIcon} />
              <Text text={`${v?.count} Clicks`} className={styles.iconText} />
            </Box>
          </Box>
        ))}
      </Box>
      {data && data?.length > 4 && !onSeeMoreOrLess && (
        <Text
          text='... see more'
          className={styles.footerLink}
          onClick={() => {
            setOnSeeMoreOrLess(!onSeeMoreOrLess);
          }}
        />
      )}
      {onSeeMoreOrLess && (
        <Text
          text='... see less'
          className={styles.footerLink}
          onClick={() => {
            setOnSeeMoreOrLess(!onSeeMoreOrLess);
          }}
        />
      )}
    </Box>
  );
};

export default DashBoardTopStats;
