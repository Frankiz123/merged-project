import React from 'react';

import Text from '@components/Text';
import CloseIcon from '@mui/icons-material/Close';
import { FormikValues, useFormik } from 'formik';

import { StepTwoTable } from './DomainSteps';

import { Grid, Box } from '@mui/material';

import styles from './StepTwo.module.scss';
import ActionButton from '@components/ActionButton';
import { ADD_DOMAIN } from '@utils/formik/InitialValues';
import { ADD_DOMAIN_SCHEMA } from '@utils/yup-validations/validations';

interface StepOneComponentProps {
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

const StepTwoVerifyDomain: React.FC<StepOneComponentProps> = ({ handleStepsIndex }) => {
  const onSubmit = (_values: FormikValues): void => {
    if (handleStepsIndex) {
      handleStepsIndex(3);
    }
  };

  const handleClick = (): void => {
    if (handleStepsIndex) {
      handleStepsIndex(3);
    }
  };

  // const { handleSubmit, handleChange, errors, values, touched } = useFormik({
  const { handleSubmit } = useFormik({
    initialValues: ADD_DOMAIN,
    validationSchema: ADD_DOMAIN_SCHEMA,
    onSubmit,
  });

  return (
    <div className={styles.mainContainer}>
      <Text text='Add Domain' variant={'h1'} className={styles.headerText} />

      <form onSubmit={handleSubmit}>
        <Grid container spacing={4}>
          <Grid item md={7} lg={8} className={styles.acccordianContainer}>
            <Text text='Nearly done. Your Domain is being verified now.' variant={'h1'} className={styles.secondaryText} />
            <Text
              text='Depending on the hosting provider, this can be done in a few seconds or several hours.'
              variant={'h1'}
              className={styles.primaryText}
            />
            <Box className={styles.domainStatusContainer}>
              <Text text='yourdomain.com' variant={'h1'} className={styles.badge} />
              <Box className={styles.status}>
                <Text text='Status: ' variant={'h1'} className={styles.title} />
                <Text text='Pending' variant={'subtitle1'} className={styles.statusText} />
              </Box>
            </Box>
            <StepTwoTable data={rows} />
          </Grid>
          <Grid item md={5} lg={4} className={styles.rightContainer}>
            <Text text='Refresh the page to check the status of your verification.' variant={'subtitle1'} className={styles.headerText} />
            <Box className={styles.btnContainer}>
              <ActionButton buttonLabel={'Refresh'} variant={'text'} startIcon={''} className={styles.refreshBtn} />
              <ActionButton buttonLabel={'Finish'} variant={'text'} startIcon={''} className={styles.finishBtn} onClick={handleClick} />
            </Box>
            <ActionButton buttonLabel={'Delete'} variant={'text'} startIcon={<CloseIcon />} className={styles.deleteBtn} isFull={false} />
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default StepTwoVerifyDomain;
