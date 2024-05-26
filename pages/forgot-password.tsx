import React, { useState } from 'react';

import { InputAdornment } from '@mui/material';
import { FormikValues, useFormik } from 'formik';
import Router from 'next/router';
import { toast } from 'react-toastify';

import TextFieldBox from '@components/TextFieldBox';
import AuthWrapper from '@components/wrapper/AuthWrapper';
import { FORGOT_PASSWORD_INIT_VALUES } from '@utils/formik/InitialValues';
import { FORGOT_PASSWORD_INIT_VALUES_VALIDATION_SCHEMA } from '@utils/yup-validations/validations';
import { AUTH_ROUTES } from '@utils/routes';
import { useAuth } from '@context/AuthContext';

// svgIcons
const CheckCircleOutlineIcon = '/images/checked.svg';
const ErrorCheckCircleOutlineIcon = '/images/errorchecked.svg';

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const { passwordReset } = useAuth();

  const handleLogin = (): void => {
    void Router.push(AUTH_ROUTES.login);
  };

  const onSubmit = async (values: FormikValues): Promise<void> => {
    setLoading(true);
    const toastId = toast.loading('Password Reset');
    try {
      await passwordReset(values.email);
      toast.update(toastId, {
        render: 'Password Reset Successful! Please check your Email for instructions',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
    } catch (_e) {
      toast.update(toastId, {
        render: 'Password Reset Failed. Please try again',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const { handleSubmit, handleChange, errors, values } = useFormik({
    initialValues: FORGOT_PASSWORD_INIT_VALUES,
    validationSchema: FORGOT_PASSWORD_INIT_VALUES_VALIDATION_SCHEMA,
    onSubmit,
  });

  return (
    <AuthWrapper
      link
      secondaryText={`Already have an account?`}
      primaryText={`Log in`}
      onSubmitForm={handleSubmit}
      isLoading={loading}
      onPrimaryTextClick={handleLogin}
      buttonLabel={'Next'}
      heading={'Forgot Password'}>
      <div className='mainInnerContainerForget'>
        <TextFieldBox
          className='textField'
          name='email'
          type='email'
          label='Email Address'
          placeholder='Enter your email'
          InputProps={{
            endAdornment: (
              <InputAdornment position='start'>
                {errors.email !== undefined ? <img src={ErrorCheckCircleOutlineIcon} /> : <img src={CheckCircleOutlineIcon} />}
              </InputAdornment>
            ),
          }}
          value={values.email}
          onChange={handleChange}
          error={errors.email !== undefined}
          helperText={errors.email}
          disabled={loading}
        />
        <br />
        <br />
      </div>
    </AuthWrapper>
  );
};

export default ForgotPassword;
