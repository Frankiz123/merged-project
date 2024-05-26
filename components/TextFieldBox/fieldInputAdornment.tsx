import React from 'react';

import { InputAdornment } from '@mui/material';
import { FormikErrors } from 'formik/dist/types';

// svgIcons
const CheckCircleOutlineIcon = '/images/checked.svg';
const ErrorCheckCircleOutlineIcon = '/images/errorchecked.svg';

interface FieldInputAdornmentProps {
  error: string | string[] | FormikErrors<unknown> | Array<FormikErrors<unknown>> | undefined;
}

const FieldInputAdornment: React.FC<FieldInputAdornmentProps> = ({ error }) => (
  <InputAdornment position='start'>
    {error ? (
      <img src={ErrorCheckCircleOutlineIcon} className={'textFieldIcons'} />
    ) : (
      <img src={CheckCircleOutlineIcon} className={'textFieldIcons'} />
    )}
  </InputAdornment>
);

export default FieldInputAdornment;
