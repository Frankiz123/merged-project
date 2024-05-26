import React from 'react';

import { LinearProgress, Box, Divider, Link } from '@mui/material';

import Text from '@components/Text';

import styles from './acountdetailcard.module.scss';

interface AccountDetailCardProps {
  title: string;
  subTitle?: string;
  plan?: string;
  paymentMethod?: string;
  email?: string;
  clicksData?: Array<{ text: string; value: number; total: number }>;
  onPrimaryTextClick?: () => void;
  link?: string;
}

const AccountDetailCard: React.FC<AccountDetailCardProps> = ({
  title,
  subTitle,
  clicksData,
  plan = '',
  paymentMethod = '',
  email = '',
  link = '',
}) => (
  <Box className={styles.acountDetail}>
    <Text text={title} variant={'h1'} className={styles.heading} />
    {subTitle && <Text text={subTitle} variant={'subtitle1'} className={styles.subtitle} />}
    {clicksData?.map((item, index) => (
      <div key={index}>
        <Box className={styles.linearContainer}>
          <Text text={item.text} variant={'subtitle1'} className={styles.textStart} />
          <Box width='100%' mr={1}>
            <LinearProgress variant='determinate' value={(item.value / item.total) * 100} valueBuffer={item.total} />
          </Box>
          <Text
            text={item.total === Infinity ? `${item.value}/unlimited` : `${item.value}/${item.total}`}
            variant={'subtitle1'}
            className={styles.textEnd}
          />
        </Box>
        <Divider light className={styles.hr} />
      </div>
    ))}
    {clicksData && plan && (
      <>
        <Text text={plan} variant={'subtitle1'} className={styles.textStart} />
        <Divider light className={styles.hr} />
        <Text text={paymentMethod} variant={'subtitle1'} className={styles.textStart} />
        <Divider light className={styles.hr} />

        <Text text={email} variant={'subtitle1'} className={styles.textStart} />
      </>
    )}
    {link && (
      <Link href={link} className={styles.link}>
        {'Need More? Upgrade now! '}
      </Link>
    )}
  </Box>
);

export default AccountDetailCard;
