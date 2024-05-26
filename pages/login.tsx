import React, { useState } from 'react';
import { useRouter } from 'next/router';

import { FormikValues, useFormik } from 'formik';
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import { toast } from 'react-toastify';

import TextFieldBox from '@components/TextFieldBox';
import AuthWrapper from '@components/wrapper/AuthWrapper';
import { SGIN_IN_INIT_VALUES } from '@utils/formik/InitialValues';
import { SGIN_IN_INIT_VALUES_VALIDATION_SCHEMA } from '@utils/yup-validations/validations';
import { useAuth } from '@context/AuthContext';
import { AUTH_FAILURE_CASES } from '@config/firebase';
import FieldInputAdornment from '@components/TextFieldBox/fieldInputAdornment';
import { AUTH_ROUTES } from '@utils/routes';

const Login: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(true);

  const { logIn, googleSignIn } = useAuth();

  const router = useRouter();

  const handleClickShowPassword = (): void => {
    setShowPassword((show: boolean) => !show);
  };

  const handleSignup = (): void => {
    void router.push(AUTH_ROUTES.signup);
  };

  const onSubmit = async (values: FormikValues): Promise<void> => {
    setLoading(true);
    const toastId = toast.loading('Login');
    try {
      await logIn(values.email, values.password);
      toast.update(toastId, {
        render: `Login successfull`,
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      let message = '';
      if (error.message && error.message.includes('/')) {
        message = error.message?.split('/');
      }
      if (message && message.length > 0) {
        message = message[1];
      }
      if (message.includes(')')) {
        message = message.split(')')[0];
      }
      switch (message.trim().toLowerCase()) {
        case AUTH_FAILURE_CASES.user_not_found: {
          toast.update(toastId, {
            render: `${values.email} doesn't have an account`,
            type: 'error',
            isLoading: false,
            autoClose: 3000,
          });
          break;
        }
        case AUTH_FAILURE_CASES.wrong_password: {
          toast.update(toastId, {
            render: `Your email or password is wrong`,
            type: 'error',
            isLoading: false,
            autoClose: 3000,
          });
          break;
        }
        default: {
          toast.update(toastId, {
            render: `Something went wrong. Please try again`,
            type: 'error',
            isLoading: false,
            autoClose: 3000,
          });

          break;
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const { handleSubmit, handleChange, errors, values } = useFormik({
    initialValues: SGIN_IN_INIT_VALUES,
    validationSchema: SGIN_IN_INIT_VALUES_VALIDATION_SCHEMA,
    onSubmit,
  });

  const handleGoogleLogin = async (): Promise<number> => {
    setGoogleLoading(true);
    const toastId = toast.loading('Google Login');
    try {
      await googleSignIn();
      toast.update(toastId, {
        render: `Google login successful`,
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
      return 0;
    } catch (_e) {
      toast.update(toastId, {
        render: `Something went wrong. Please try again`,
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
      return 0;
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <AuthWrapper
      heading={'Log in to merged'}
      link
      loginSection
      buttonLabel='Login'
      isLoading={loading}
      isGoogleLoading={googleLoading}
      onPrimaryTextClick={handleSignup}
      onSubmitForm={handleSubmit}
      onGoogleLogin={handleGoogleLogin}
      secondaryText={`Don't have an account?`}
      primaryText={' Sign up now.'}>
      <div className='mainInnerContainer'>
        <TextFieldBox
          className='textField'
          name='email'
          label='Email Address'
          type='email'
          placeholder='Enter your email'
          InputProps={{
            endAdornment: <FieldInputAdornment error={errors.email} />,
          }}
          value={values.email}
          onChange={handleChange}
          error={errors.email !== undefined}
          helperText={errors.email}
          disabled={loading}
        />
        <TextFieldBox
          className='textField'
          name='password'
          label='Password'
          placeholder='Enter your password'
          type={showPassword ? 'password' : 'text'}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton aria-label='toggle password visibility' onClick={handleClickShowPassword} edge='end'>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          value={values.password}
          onChange={handleChange}
          error={errors.password !== undefined}
          helperText={errors.password}
          disabled={loading}
        />
      </div>
    </AuthWrapper>
  );
};

export default Login;
