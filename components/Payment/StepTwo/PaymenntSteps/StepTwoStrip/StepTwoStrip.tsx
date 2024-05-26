import React, { useState } from 'react';

import { FormikValues, useFormik } from 'formik';

import { FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';

import ActionButton from '@components/ActionButton';
import TextFieldBox from '@components/TextFieldBox';

import { USER_PAYMENNT_METHOD_INFORMATION } from '@utils/formik/InitialValues';
import { USER_PAYMENNT_METHOD_INFORMATION_SCHEMA } from '@utils/yup-validations/validations';

import styles from './StepTwoStrip.module.scss';

interface StepTwoStripComponentProps {
  foo?: string;
}

const StepTwoStripComponent: React.FC<StepTwoStripComponentProps> = () => {
  const [loading, setLoading] = useState(false);

  const [paymentSelection, setPaymentSelection] = useState(false);

  const updateSelection = (event, value): void => {
    void setFieldValue('paymentMethod', value);
    setPaymentSelection(value === 'CreditCard');
  };

  const onSubmit = (_values: FormikValues): void => {
    setLoading(false);
  };

  const { handleSubmit, handleChange, errors, values, setFieldValue } = useFormik({
    initialValues: USER_PAYMENNT_METHOD_INFORMATION,
    validationSchema: USER_PAYMENNT_METHOD_INFORMATION_SCHEMA,
    onSubmit,
  });

  return (
    <div className={styles.card}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <FormControl>
          <RadioGroup
            aria-labelledby='demo-radio-buttons-group-label'
            defaultValue='CreditCard'
            onChange={updateSelection}
            name='radio-buttons-group'>
            <div className={styles.fromControlContianer}>
              <FormControlLabel value='CreditCard' className={styles.radioText} control={<Radio />} label='Credit Card' />
              <div>
                <img src={'/images/mastercard.png'} className={'textFieldIcons'} />
                <img src={'/images/visacard.png'} className={'textFieldIcons'} />
                <img src={'/images/amex.png'} className={'textFieldIcons'} />
              </div>
            </div>
            {paymentSelection && (
              <div className={styles.inputsContainer}>
                <TextFieldBox
                  name='cardNumber'
                  label='Card number'
                  autoComplete='off'
                  className={styles.textField}
                  labelCheck={false}
                  value={values.cardNumber}
                  onChange={handleChange}
                  error={errors.cardNumber !== undefined}
                  helperText={errors.cardNumber}
                  disabled={loading}
                />

                <TextFieldBox
                  name='cvcNumber'
                  label='MM / YY CVC'
                  labelCheck={false}
                  className={styles.textFieldCvc}
                  autoComplete='off'
                  value={values.cvcNumber}
                  onChange={handleChange}
                  error={errors.cvcNumber !== undefined}
                  helperText={errors.cvcNumber}
                  disabled={loading}
                />
              </div>
            )}

            <div className={styles.paypalFromControlContianer}>
              <FormControlLabel value='payPal' className={styles.radioText} control={<Radio />} label='Pay Pal' />
              <img src={'/images/paypal.png'} className={'textFieldIcons'} />
            </div>
            {!paymentSelection && (
              <div className={styles.inputsContainer}>
                <TextFieldBox
                  name='cardNumber'
                  label='Card number'
                  autoComplete='off'
                  className={styles.textField}
                  labelCheck={false}
                  value={values.cardNumber}
                  onChange={handleChange}
                  error={errors.cardNumber !== undefined}
                  helperText={errors.cardNumber}
                  disabled={loading}
                />

                <TextFieldBox
                  name='cvcNumber'
                  label='MM / YY CVC'
                  labelCheck={false}
                  className={styles.textFieldCvc}
                  autoComplete='off'
                  value={values.cvcNumber}
                  onChange={handleChange}
                  error={errors.cvcNumber !== undefined}
                  helperText={errors.cvcNumber}
                  disabled={loading}
                />
              </div>
            )}
          </RadioGroup>
        </FormControl>
        <ActionButton loading={loading} type={'submit'} buttonLabel={'Next Step'} className={styles.submitButton} />
      </form>
    </div>
  );
};

export default StepTwoStripComponent;
