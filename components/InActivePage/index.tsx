import React from 'react';
import Link from 'next/link';
import { Box, Typography } from '@mui/material';

import Text from '@components/Text';

import styles from './InActivePage.module.scss';

const InActivePage: React.FC = () => (
  <>
    <Box className={styles.wraperBox}>
      <Link href='/' className={styles.link}>
        <img src='/images/mainLogo.svg' className={styles.logo} />
      </Link>
      <Box className={styles.textBox}>
        <Text text={'Inactive link'} className={styles.heading} />
        <Text className={styles.subText} text={'The link you requested exist, but the owner is still getting things up and running.'} />
      </Box>
      <Box className={styles.secondtextBox}>
        <Text text={'Are you the publisher?'} className={styles.heading} />
        <Typography className={styles.subText}>
          If you are the owner of this link and wish to enable it now, just visit your{' '}
          <Link href='/' className={styles.linkSubText}>
            account
          </Link>{' '}
          and complete your account activation.
        </Typography>
      </Box>
    </Box>
  </>
);

export default InActivePage;
