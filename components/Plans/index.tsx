import React, { useState } from 'react';

import { Box } from '@mui/material';
import Link from 'next/link';

import Text from '@components/Text';
import PlanCardComponent from '@components/PlanCardComponent';
import RadioButton from '@components/RadioButton/RadioButton';

import styles from './plan.module.scss';
import { useAuth } from '@context/AuthContext';

// svgIcons
const DATA_RADIO = [
  { value: 'monthly', label: 'Billed monthly' },
  { value: 'annually', label: '20% off paid annually' },
];

interface IPlansComponent {
  showBottomLinks?: boolean;
}

const PlansComponent: React.FC<IPlansComponent> = ({ showBottomLinks = true }) => {
  const { userPlan } = useAuth();

  const [value, setValue] = useState<string>('monthly');

  const handleChange = (event: string): void => {
    setValue(event);
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.textContainer}>
        <Text text={!userPlan ? 'Earn more with Merge today.' : 'Merged Pricing'} className={styles.title} />
        <Text
          text={
            !userPlan
              ? `Choose your plan and start your free trial now. You can cancel the plan at any time.`
              : 'Pick your plan today or get your free account. You can change plans at any time.'
          }
          className={styles.secondaryText}
        />
        {!userPlan && <Text text={`After the trial period expires, you will be charged.`} className={styles.secondaryText1} />}
        <div className={styles.radioContainer}>
          <RadioButton value={value} data={DATA_RADIO} onChange={handleChange} />
        </div>
      </Box>
      <PlanCardComponent choosePlan={value} />
      {showBottomLinks && (
        <Box className={styles.bottomLinks}>
          <Link href='#' className={styles.firstLink}>
            {'See all features and benefits '}
          </Link>
          <Link href={{ pathname: '/settings', query: { tab: 'Payments' } }} className={styles.secondLink}>
            {'Link to invoices & billing settings '}
          </Link>
        </Box>
      )}
    </Box>
  );
};
export default PlansComponent;
