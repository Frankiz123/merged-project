import React from 'react';

import { Box, Typography } from '@mui/material';
import Link from 'next/link';

import styles from './trialperiod.module.scss';

export interface TrialPeriodProp {
  days: number;
  open: boolean;
}

const TrialPeriod: React.FC<TrialPeriodProp> = ({ days, open }) => (
  <>
    {open ? (
      <Box className={styles.openContainer}>
        <Box className={styles.headingContainer}>
          <img src={'images/sidebar/spark.svg'} />
          <Typography className={styles.heading}>{`${days} trail ${days > 1 ? 'days' : 'day'} left`}</Typography>
        </Box>
        <Box className={styles.bottom}>
          <p className={styles.bottmText}>
            Get full access to Merge and boost your income long-term.
            <Link className={styles.upgradeBtn} href={{ pathname: '/plans' }}>
              See Plans
            </Link>
          </p>
        </Box>
      </Box>
    ) : (
      <Box className={styles.container}>
        <Box
          sx={{
            position: 'relative',
          }}>
          <img
            src={'images/sidebar/vector.svg'}
            style={{
              width: '18px',
              height: '22px',
              position: 'absolute',
              bottom: 7,
              right: 0,
            }}
          />
          <img
            src={'images/sidebar/vector.svg'}
            style={{
              width: '12px',
              height: '15px',
              top: -35,
              position: 'absolute',
            }}
          />
        </Box>
        <div
          style={{
            whiteSpace: 'pre',
            fontSize: '14px',
            textAlign: 'center',
            fontWeight: 700,
          }}>
          {`${days} \ndays left`}
        </div>
        <Link className={styles.upgradeBtn} href={{ pathname: '/plans' }}>
          upgrade
        </Link>
      </Box>
    )}
  </>
);

export default TrialPeriod;
