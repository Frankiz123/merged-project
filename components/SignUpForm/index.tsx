import React, { useState } from 'react';

import { FormikErrors, FormikTouched, FormikValues } from 'formik';
import GoogleIcon from '@mui/icons-material/Google';
import { IconButton, InputAdornment, Divider } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import CircleIcon from '@mui/icons-material/Circle';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

import TextFieldBox from '@components/TextFieldBox';
import Text from '@components/Text';
import ActionButton from '@components/ActionButton';
import BottomLinkComponent from '@components/BottomLink';
import TermsAndPolicyComponent from '@components/TermsAndPolicyComponent';
import FieldInputAdornment from '@components/TextFieldBox/fieldInputAdornment';

import styles from './signupform.module.scss';

interface SignUpFormProps {
  headerText?: string;
  buttonLabel?: string;
  primaryText?: string;
  secondaryText?: string;
  loading?: boolean;
  isGoogleLoading?: boolean;
  errors: FormikErrors<FormikValues>;
  values: FormikValues;
  touched?: FormikTouched<FormikValues>;
  onPrimaryTextClick?: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onGoogleLogin?: () => Promise<number>;
}

const SignUpForm: React.FC<SignUpFormProps> = ({
  headerText = '',
  buttonLabel = '',
  primaryText = null,
  secondaryText = '',
  loading = false,
  isGoogleLoading = false,
  errors,
  values,
  onPrimaryTextClick = () => {},
  handleChange = () => {},
  onGoogleLogin = () => {},
}) => {
  const [showPassword, setShowPassword] = useState(true);

  const handleClickShowPassword = (): void => {
    setShowPassword(show => !show);
  };

  const colorSelection = (): number => {
    switch (errors.password) {
      case 'Password must be at least 7 characters':
        return 1;
      case 'One number or special Character':
        return 1;
      case 'Password is required':
        return 1;
      case undefined:
        if (values.password.length < 1) {
          return 0;
        }
        return 2;
      default:
        return 0;
    }
  };

  return (
    <div className={styles.signupWrapper}>
      <Text text={headerText} className={styles.heading} />
      <div className={styles.signUpContainer}>
        <TermsAndPolicyComponent className={styles.termsConditions} textClassName={styles.termsText} linkClassName={styles.termsLink} />
        <div className={styles.formSignUp}>
          <ActionButton
            loading={isGoogleLoading}
            variant='outlined'
            type='button'
            color='secondary'
            buttonClass={styles.googleButton}
            startIcon={<GoogleIcon />}
            buttonLabel='Sign up with Google'
            className='margin'
            onClick={onGoogleLogin}
          />
          <Divider className={styles.divider}>
            <Text variant='h1' text='or' className={styles.dividerText} />
          </Divider>
          <div className='textFieldWrapperSignUp'>
            <TextFieldBox
              name='name'
              label='Full Name'
              className='textField'
              placeholder='e.g. Mary Jackson'
              InputProps={{
                endAdornment: <FieldInputAdornment error={errors.name} />,
              }}
              value={values.name}
              onChange={handleChange}
              error={Boolean(errors.name)}
              helperText={errors.name}
              disabled={loading}
            />
            <TextFieldBox
              type='email'
              name='email'
              label='Email'
              className='textField'
              placeholder='e.g. you@company.com'
              InputProps={{
                endAdornment: <FieldInputAdornment error={errors.email} />,
              }}
              value={values.email}
              onChange={handleChange}
              error={Boolean(errors.email)}
              helperText={errors.email}
              disabled={loading}
            />
            <TextFieldBox
              name='password'
              label='Password'
              className='textField'
              placeholder='Enter a strong password'
              type={showPassword ? 'password' : 'text'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end' disablePointerEvents={loading}>
                    <IconButton aria-label='toggle password visibility' onClick={handleClickShowPassword} edge='end'>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              value={values.password}
              onChange={handleChange}
              error={Boolean(errors.password)}
              helperText={errors.password}
              disabled={loading}
            />
          </div>
          <div className={styles.bottomErrorMainContainer}>
            <div className={styles.errorContainer}>
              {(() => {
                if (colorSelection() === 1) {
                  return <CloseIcon className={styles.closeIconStyle} />;
                } else if (colorSelection() === 2) {
                  return <CheckIcon className={styles.checkIconStyle} />;
                }
                return <CircleIcon className={styles.circleIconStyle} />;
              })()}

              <p
                className={[
                  styles.errorText,
                  colorSelection() === 1 ? styles.errorColor : colorSelection() === 2 ? styles.successColor : styles.baseColor,
                ].join(' ')}>
                Your password must be at least 7 characters
              </p>
            </div>
            <div className={styles.errorContainer}>
              {(() => {
                if (colorSelection() === 1) {
                  return <CloseIcon className={styles.closeIconStyle} />;
                } else if (colorSelection() === 2) {
                  return <CheckIcon className={styles.checkIconStyle} />;
                }
                return <CircleIcon className={styles.circleIconStyle} />;
              })()}
              <p
                className={[
                  styles.errorText,
                  colorSelection() === 1 ? styles.errorColor : colorSelection() === 2 ? styles.successColor : styles.baseColor,
                ].join(' ')}>
                One number or special Character
              </p>
            </div>
          </div>
          {buttonLabel && <ActionButton loading={loading} buttonLabel={buttonLabel} buttonClass={styles.signUpButton} />}
        </div>
        <div className={styles.BottomLink}>
          <BottomLinkComponent secondaryText={secondaryText} primaryText={primaryText} onPrimaryTextClick={onPrimaryTextClick} />
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
