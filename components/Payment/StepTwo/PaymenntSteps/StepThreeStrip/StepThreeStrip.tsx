import React, { useState } from 'react';

import { FormikValues, useFormik } from 'formik';
import { FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

import Text from '@components/Text';
import ActionButton from '@components/ActionButton';
import TermsAndPolicyComponent from '@components/TermsAndPolicyComponent';

import { USER_PAYMENNT_SCHEDULE_INFORMATION } from '@utils/formik/InitialValues';
import { USER_PAYMENNT_SCHEDULE_INFORMATION_SCHEMA } from '@utils/yup-validations/validations';

import styles from './StepThreeStrip.module.scss';

interface StepThreeStripComponentProps {
  handleStepsIndex?: (e: number | undefined) => void;
}

const StepThreeStripComponent: React.FC<StepThreeStripComponentProps> = ({ handleStepsIndex }) => {
  const [paymentSelection, setPaymentSelection] = useState(false);

  const updateSelection = (event, value): void => {
    if (value === 'annually') {
      void setFieldValue('annually', value);
      void setFieldValue('monthly', '');
      setPaymentSelection(false);
    } else {
      void setFieldValue('monthly', value);
      void setFieldValue('annually', '');
      setPaymentSelection(true);
    }
  };

  const onSubmit = (_values: FormikValues): void => {
    if (handleStepsIndex) {
      handleStepsIndex(3);
    }
  };

  const { handleSubmit, setFieldValue } = useFormik({
    initialValues: USER_PAYMENNT_SCHEDULE_INFORMATION,
    validationSchema: USER_PAYMENNT_SCHEDULE_INFORMATION_SCHEMA,
    onSubmit,
  });

  return (
    <div className={styles.card}>
      <form onSubmit={handleSubmit}>
        <FormControl>
          <RadioGroup
            row
            defaultValue={'annually'}
            aria-labelledby='demo-row-radio-buttons-group-label'
            onChange={updateSelection}
            name='row-radio-buttons-group'>
            <FormControlLabel value={'annually'} className={styles.radioText} control={<Radio />} label='20% off paid annually' />
            <FormControlLabel value={'monthly'} className={styles.radioText} control={<Radio />} label='Billed monthly' />
          </RadioGroup>
        </FormControl>
        {!paymentSelection && (
          <div className={styles.bottomContainer}>
            <div>
              <Text text={'Next billing'} variant={'subtitle1'} className={styles.billingLabel} />
              <Text text={'Nov 27, 2022'} variant={'h2'} className={styles.billingValues} />
            </div>
            <div>
              <Text text={'Gross price per month'} variant={'subtitle1'} className={styles.billingLabel} />
              <Text text={'$108.00 USD'} variant={'h2'} className={styles.billingValues} />
            </div>
            <div>
              <Text text={'20% off paid annually'} variant={'subtitle1'} className={styles.billingLabel} />
              <Text text={'-$21.60 USD'} variant={'h2'} className={styles.billingValues} />
            </div>
            <div className={styles.totalContainer}>
              <Text text={'Total (incl. 19% VAT)'} variant={'h2'} className={styles.billingValues} />
              <Text text={'$86.40 USD'} variant={'h2'} className={styles.billingValues} />
            </div>
            <div className={styles.iconContainer}>
              <Text text={'VAT: $ 13.30 USD'} variant={'subtitle1'} className={styles.billingLabel} />
              <InfoIcon className={styles.svgInfo} />
            </div>
            <div className={styles.bottomContainer}>
              <Text text={'To be paid (incl. VAT)'} variant={'h2'} className={styles.billingValues} />
              <Text text={'$86.40 USD'} variant={'h2'} className={styles.billingValues} />
            </div>
          </div>
        )}
        <ActionButton
          type={'submit'}
          startIcon={<img src='/images/lock.png' />}
          buttonLabel={'Confirm and Pay'}
          className={styles.submitButton}
        />
        <TermsAndPolicyComponent
          label='By confirming, I agree to mergers’s'
          className={styles.termsandPolicyContainer}
          textClassName={styles.termsandPolicyText}
          linkClassName={styles.termsandPolicyLinks}
        />
      </form>
    </div>
  );
};

export default StepThreeStripComponent;
