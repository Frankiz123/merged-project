import React, { useState } from 'react';

import Text from '@components/Text';
import AccordianComponent from '@components/Accordian/Accordian';
import CloseIcon from '@mui/icons-material/Close';
import { FormikValues, useFormik } from 'formik';

import { StepOneDomain, StepTwoTable } from './AddDomainSteps';

import { Grid, Box } from '@mui/material';

import styles from './StepOne.module.scss';
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

const StepOneAddDomain: React.FC<StepOneComponentProps> = ({ handleStepsIndex }) => {
  const [loading, setLoading] = useState(false);

  const onSubmit = (_values: FormikValues): void => {
    setLoading(false);
    if (handleStepsIndex) {
      handleStepsIndex(2);
    }
  };

  const { handleSubmit, handleChange, errors, values, touched } = useFormik({
    initialValues: ADD_DOMAIN,
    validationSchema: ADD_DOMAIN_SCHEMA,
    onSubmit,
  });

  return (
    <div className={styles.mainContainer}>
      <Text text='Add Domain' variant={'h1'} className={styles.headerText} />
      <form onSubmit={handleSubmit}>
        <Grid container>
          <Grid item md={6} lg={6} className={styles.acccordianContainer}>
            <AccordianComponent
              ariaControls='panel1bh-content'
              id='panel1bh-header'
              labelText={'Step 1:  Enter your domain'}
              className={styles.accordian}>
              <StepOneDomain touched={touched} handleChange={handleChange} loading={loading} errors={errors} values={values} />
            </AccordianComponent>

            <AccordianComponent
              ariaControls='panel1bh-content'
              id='panel1bh-header'
              labelText={'Step 2:  Copy and add the two records to your DNS Settings at your hosting provider'}
              className={styles.accordian}>
              <StepTwoTable data={rows} />
            </AccordianComponent>
          </Grid>
          <Grid item md={6} lg={6} className={styles.rightContainer}>
            <Text text='All done? Then verify your Domain!' variant={'subtitle1'} className={styles.headerText} />
            <Box className={styles.btnContainer}>
              <ActionButton buttonLabel={'Cancle'} variant={'text'} className={styles.cancelBtn} startIcon={<CloseIcon />} />
              <ActionButton buttonLabel={'Verify Now'} variant={'text'} startIcon={''} className={styles.verifyDomainBtn} />
            </Box>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default StepOneAddDomain;
