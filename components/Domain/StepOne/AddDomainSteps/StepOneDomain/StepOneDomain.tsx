import React from 'react';

import { FormikValues, FormikErrors, FormikTouched } from 'formik';

import TextFieldBox from '@components/TextFieldBox';

import { InputAdornment } from '@mui/material';

import styles from './StepOneDomain.module.scss';

// svgIcons
const CheckCircleOutlineIcon = '/images/checked.svg';
const ErrorCheckCircleOutlineIcon = '/images/errorchecked.svg';

interface StepOneDomainProps {
  className?: string;
  foo?: string;
  loading?: boolean;
  errors: FormikErrors<FormikValues>;
  values: FormikValues;
  touched: FormikTouched<FormikValues>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const StepOneStripComponent: React.FC<StepOneDomainProps> = ({
  loading = false,
  errors,
  values,
  className = '',
  handleChange = () => {},
}) => (
  <div className={[styles.card, className].join('')}>
    <TextFieldBox
      name='name'
      label='Domain'
      placeholder='yourdomain.com'
      autoComplete='off'
      fullWidth={false}
      InputProps={{
        endAdornment: (
          <InputAdornment position='start' className={styles.inputAdornment}>
            {errors.addressLine !== undefined ? (
              <img src={ErrorCheckCircleOutlineIcon} className={'textFieldIcons'} />
            ) : (
              <img src={CheckCircleOutlineIcon} className={'textFieldIcons'} />
            )}
          </InputAdornment>
        ),
      }}
      value={values.name}
      onChange={handleChange}
      error={errors.name !== undefined}
      helperText={errors.name}
      disabled={loading}
    />
  </div>
);

export default StepOneStripComponent;
