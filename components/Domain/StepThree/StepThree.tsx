import React from 'react';

import Text from '@components/Text';
import CloseIcon from '@mui/icons-material/Close';
import { FormikValues, useFormik } from 'formik';

import { StepTwoTable } from './DomainSteps';

import { Grid, Box } from '@mui/material';

import styles from './StepThree.module.scss';
import ActionButton from '@components/ActionButton';
import { ADD_DOMAIN } from '@utils/formik/InitialValues';
import { ADD_DOMAIN_SCHEMA } from '@utils/yup-validations/validations';

const CheckCircleOutlineIcon = '/images/checked.svg';

interface StepThreeComponentProps {
  handleStepsIndex?: (e: number | undefined) => void;
}

function createData(type: string, name: string, value: string, ttl: string): { type: string; name: string; value: string; ttl: string } {
  return { type, name, value, ttl };
}

const rows = [
  createData('A', '@', 'xxx', 'Not needed'),
  createData('A', '@', 'xxx', 'Not needed'),
  createData('A', '@', 'xxx', 'Not needed'),
];

const StepThreeVerifiedDomain: React.FC<StepThreeComponentProps> = ({ handleStepsIndex }) => {
  const onSubmit = (_values: FormikValues): void => {
    if (handleStepsIndex) {
      handleStepsIndex(3);
    }
  };

  const { handleSubmit } = useFormik({
    initialValues: ADD_DOMAIN,
    validationSchema: ADD_DOMAIN_SCHEMA,
    onSubmit,
  });

  return (
    <div className={styles.mainContainer}>
      <Text text='Domain' variant={'h1'} className={styles.headerText} />
      <form onSubmit={handleSubmit}>
        <Grid container spacing={4}>
          <Grid item md={7} lg={8} className={styles.acccordianContainer}>
            <Text text='Manage your own domain here.' variant={'h1'} className={styles.secondaryText} />
            <Box className={styles.domainStatusContainer}>
              <Text text='yourdomain.com' variant={'h1'} className={styles.badge} />
              <Box className={styles.status}>
                <Text text='Status: ' variant={'h1'} className={styles.title} />
                <Text text='Verified' variant={'subtitle1'} className={styles.statusText} />
                <img src={CheckCircleOutlineIcon} />
              </Box>
              <ActionButton buttonLabel={'Delete'} variant={'text'} startIcon={<CloseIcon />} className={styles.deleteBtn} isFull={false} />
            </Box>
            <StepTwoTable data={rows} />
          </Grid>
          <Grid item md={5} lg={4} className={styles.rightContainer}>
            <Text text='Congratulations, your domain has been verified!' variant={'subtitle1'} className={styles.headerText} />
            <Box className={styles.btnContainer}>
              <ActionButton buttonLabel={'Done'} variant={'text'} startIcon={''} className={styles.doneBtn} />
            </Box>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default StepThreeVerifiedDomain;
