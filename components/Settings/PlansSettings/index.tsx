import React, { useEffect, useState } from 'react';

import { Grid, Box, Card } from '@mui/material';
import Link from 'next/link';

import Text from '@components/Text';
import { Title, HeadingSection } from '@components/Settings';
import PlanCardComponent from '@components/PlanCardComponent';
import ActionButton from '@components/ActionButton';
import RadioButton from '@components/RadioButton/RadioButton';

import styles from './plansSetting.module.scss';
import AccountDetailCard from '@components/Dashboard/AccountDetail';
import { useAuth } from '@context/AuthContext';
import { useProtected } from '@context/ProtectedContext';
import { capitalize } from 'lodash';
import moment from 'moment';

// svgIcons
const CalendarIcon = '/images/setting/calendar.svg';
const CheckCircle2Icon = '/images/setting/check-circle-2.svg';

interface PlansSettingsProps {
  foo?: string;
}

const DATA_RADIO = [
  { value: 'monthly', label: 'Billed monthly' },
  { value: 'annually', label: '20% off paid annually' },
];

const PlansSettings: React.FC<PlansSettingsProps> = () => {
  const { userActivePlan, trialDays, userPlan } = useAuth();
  const { CardDetail, linksCount, linksClicksCount } = useProtected();

  const [value, setValue] = useState<string>('monthly');
  const [paymentDate, setPaymentDate] = useState<string>('-');
  const [dueDate, setDueDate] = useState<string>('-');

  const ClicksData = [
    {
      text: 'Link Clicks',
      value: linksClicksCount,
      total: userActivePlan?.numberOfClicks ?? 0,
    },
    {
      text: 'Link Counts',
      value: linksCount,
      total: userActivePlan?.numberOfLinks ?? 0,
    },
    { text: 'User Count', value: 1, total: 1 },
  ];

  const handleChange = (event: string): void => {
    setValue(event);
  };

  useEffect(() => {
    if (userPlan?.endedAt) {
      const milliseconds = userPlan?.endedAt?.seconds * 1000 + userPlan?.endedAt?.nanoseconds / 1000000;

      const date = moment(milliseconds);
      const formattedDate = date.format('DD.MM.YYYY');
      setPaymentDate(formattedDate);
    }
  }, [userPlan?.endedAt]);

  useEffect(() => {
    if (userPlan?.nextBilledAt) {
      const milliseconds = userPlan?.nextBilledAt?.seconds * 1000 + userPlan?.nextBilledAt?.nanoseconds / 1000000;

      const date = moment(milliseconds);
      const formattedDate = date.format('MMMM DD, YYYY');
      setDueDate(formattedDate);
    }
  }, [userPlan?.nextBilledAt]);

  return (
    <Box className={styles.mainContainer}>
      <Title text='Plans' />
      <HeadingSection primary='Invoice Mail' className={styles.heading} />
      <Box className={styles.radioCard}>
        <Text text={'Pick an account plan that fits your business'} className={styles.textSecondary} />
        <RadioButton value={value} data={DATA_RADIO} onChange={handleChange} />
      </Box>
      <Grid container className={styles.cardContainer}>
        <Grid item xs={8} sm={12} md={12}>
          <PlanCardComponent choosePlan={value} />
        </Grid>
      </Grid>
      <Box className={styles.benefits}>
        <Link href='#'>{'See all features and benefits '}</Link>
      </Box>
      <Grid container className={styles.boxCards} spacing={2}>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <Card variant='outlined' className={styles.latestPayment}>
            <Box className={styles.boxTB}>
              <Text text='Latest Payment' variant='subtitle1' className={styles.title} />
              <ActionButton className={styles.detailBtn} buttonLabel='See Details' variant='outlined' />
            </Box>
            <Box className={styles.umtBottomBox}>
              <Box className={styles.box01}>
                <Text text='Payment Date' variant='subtitle1' className={styles.textQa} />
                <Text text={paymentDate} variant='subtitle1' className={styles.textAns} />
              </Box>
              <Box className={styles.box01}>
                <Text text='Type of Plan' variant='subtitle1' className={styles.textQa} />
                <Text text={`${userActivePlan?.planName}`} variant='subtitle1' className={styles.textAns} />
              </Box>
              <Box className={styles.box01}>
                <Text text='Card use to pay' variant='subtitle1' className={styles.textQa} />
                <Text
                  text={`${capitalize(CardDetail?.card_type)} **** ${CardDetail?.last_four_digits || ''}`}
                  variant='subtitle1'
                  className={styles.textAns}
                />
              </Box>
              <Box className={styles.box01}>
                <Text text='Total Payment' variant='subtitle1' className={styles.textQa} />
                <Text text={`€${trialDays === 0 ? userActivePlan?.price : 0}`} variant='subtitle1' className={styles.textAns} />
              </Box>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <Card variant='outlined' className={styles.nextPayment}>
            <Box>
              <Text text='Next Payment' variant='subtitle1' className={styles.title} />
              <Text text='Update or change your payment method.' variant='subtitle1' className={styles.nextPaymentDisc} />
              <Box className={styles.boxDueDate}>
                <img src={CalendarIcon} className={styles.calendar} />
                <Box>
                  <Text text='Due date' variant='subtitle1' className={styles.dueDate} />
                  <Text text={`on ${dueDate}`} variant='subtitle1' className={styles.date} />
                </Box>
                <img src={CheckCircle2Icon} className={styles.checkciircle2} />
              </Box>
              <Link href={{ pathname: '/settings', query: { tab: 'Payments' } }}>
                <ActionButton className={styles.dueDateBtn} buttonLabel='Manage Payment' variant='contained' />
              </Link>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <AccountDetailCard title={'Account Details'} subTitle={'Monthly Usage'} clicksData={ClicksData} link={'#'} />
        </Grid>
      </Grid>
    </Box>
  );
};
export default PlansSettings;
