import React, { useState } from 'react';

import { FormikValues, useFormik } from 'formik';

import ActionButton from '@components/ActionButton';
import TextFieldBox from '@components/TextFieldBox';

import { InputAdornment } from '@mui/material';

import { USER_DETAILS_INFORMATION_PAYMENT } from '@utils/formik/InitialValues';
import { USER_DETAILS_INFORMATION_PAYMENT_SCHEMA } from '@utils/yup-validations/validations';

import styles from './StepOneStrip.module.scss';

// svgIcons
const CheckCircleOutlineIcon = '/images/checked.svg';
const ErrorCheckCircleOutlineIcon = '/images/errorchecked.svg';

interface StepOneStripComponentProps {
  foo?: string;
}

const StepOneStripComponent: React.FC<StepOneStripComponentProps> = () => {
  const [loading, setLoading] = useState(false);

  const onSubmit = (_values: FormikValues): void => {
    setLoading(false);
  };

  const { handleSubmit, handleChange, errors, values } = useFormik({
    initialValues: USER_DETAILS_INFORMATION_PAYMENT,
    validationSchema: USER_DETAILS_INFORMATION_PAYMENT_SCHEMA,
    onSubmit,
  });

  return (
    <div className={styles.card}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <TextFieldBox
          name='addressLine'
          label='Adress line'
          autoComplete='off'
          InputProps={{
            endAdornment: (
              <InputAdornment position='start'>
                {errors.addressLine !== undefined ? (
                  <img src={ErrorCheckCircleOutlineIcon} className={'textFieldIcons'} />
                ) : (
                  <img src={CheckCircleOutlineIcon} className={'textFieldIcons'} />
                )}
              </InputAdornment>
            ),
          }}
          value={values.addressLine}
          onChange={handleChange}
          error={errors.addressLine !== undefined}
          helperText={errors.addressLine}
          disabled={loading}
        />

        <TextFieldBox
          name='address'
          label='Additional address details (optional)'
          autoComplete='off'
          InputProps={{
            endAdornment: (
              <InputAdornment position='start'>
                {errors.address !== undefined ? (
                  <img src={ErrorCheckCircleOutlineIcon} className={'textFieldIcons'} />
                ) : (
                  <img src={CheckCircleOutlineIcon} className={'textFieldIcons'} />
                )}
              </InputAdornment>
            ),
          }}
          value={values.address}
          onChange={handleChange}
          error={errors.address !== undefined}
          helperText={errors.address}
          disabled={loading}
        />
        <TextFieldBox
          name='country'
          label='Country'
          autoComplete='off'
          InputProps={{
            endAdornment: (
              <InputAdornment position='start'>
                {errors.country !== undefined ? (
                  <img src={ErrorCheckCircleOutlineIcon} className={'textFieldIcons'} />
                ) : (
                  <img src={CheckCircleOutlineIcon} className={'textFieldIcons'} />
                )}
              </InputAdornment>
            ),
          }}
          value={values.country}
          onChange={handleChange}
          error={errors.country !== undefined}
          helperText={errors.country}
          disabled={loading}
        />

        <TextFieldBox
          name='city'
          label='City'
          autoComplete='off'
          InputProps={{
            endAdornment: (
              <InputAdornment position='start'>
                {errors.city !== undefined ? (
                  <img src={ErrorCheckCircleOutlineIcon} className={'textFieldIcons'} />
                ) : (
                  <img src={CheckCircleOutlineIcon} className={'textFieldIcons'} />
                )}
              </InputAdornment>
            ),
          }}
          value={values.city}
          onChange={handleChange}
          error={errors.city !== undefined}
          helperText={errors.city}
          disabled={loading}
        />

        <TextFieldBox
          name='postalCode'
          label='Zip/Postal code'
          autoComplete='off'
          InputProps={{
            endAdornment: (
              <InputAdornment position='start'>
                {errors.postalCode !== undefined ? (
                  <img src={ErrorCheckCircleOutlineIcon} className={'textFieldIcons'} />
                ) : (
                  <img src={CheckCircleOutlineIcon} className={'textFieldIcons'} />
                )}
              </InputAdornment>
            ),
          }}
          value={values.postalCode}
          onChange={handleChange}
          error={errors.postalCode !== undefined}
          helperText={errors.postalCode}
          disabled={loading}
        />

        <TextFieldBox
          name='organizationName'
          label='Organization name'
          autoComplete='off'
          InputProps={{
            endAdornment: (
              <InputAdornment position='start'>
                {errors.organizationName !== undefined ? (
                  <img src={ErrorCheckCircleOutlineIcon} className={'textFieldIcons'} />
                ) : (
                  <img src={CheckCircleOutlineIcon} className={'textFieldIcons'} />
                )}
              </InputAdornment>
            ),
          }}
          value={values.organizationName}
          onChange={handleChange}
          error={errors.organizationName !== undefined}
          helperText={errors.organizationName}
          disabled={loading}
        />

        <TextFieldBox
          name='vat'
          label='VAT (optional)'
          autoComplete='off'
          InputProps={{
            endAdornment: (
              <InputAdornment position='start'>
                {errors.vat !== undefined ? (
                  <img src={ErrorCheckCircleOutlineIcon} className={'textFieldIcons'} />
                ) : (
                  <img src={CheckCircleOutlineIcon} className={'textFieldIcons'} />
                )}
              </InputAdornment>
            ),
          }}
          value={values.vat}
          onChange={handleChange}
          error={errors.vat !== undefined}
          helperText={errors.vat}
          disabled={loading}
        />
        <ActionButton loading={loading} type={'submit'} buttonLabel={'Next Step'} className={styles.submitButton} />
      </form>
    </div>
  );
};

export default StepOneStripComponent;
