import React from 'react';
import Router from 'next/router';

import { Container, CircularProgress, Grid, Typography, Link } from '@mui/material';

import ActionButton from 'components/ActionButton';

interface FormWrapperProps {
  onSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void;
  heading?: string;
  children: React.ReactNode;
  isLoading: boolean;
  buttonLabel: string;
  dataLoading?: boolean;
  forgotPasswordLink?: string;
}

const FormWrapper: React.FC<FormWrapperProps> = ({
  onSubmit,
  heading,
  children,
  isLoading,
  buttonLabel,
  dataLoading = false,
  forgotPasswordLink = '',
}) => {
  const handleForgotPassword = (forgotPasswordLink): void => {
    void Router.push(forgotPasswordLink);
  };

  return (
    <Container className='main-form-wrapper-container'>
      {dataLoading ? (
        <CircularProgress />
      ) : (
        <form onSubmit={onSubmit}>
          <Grid container>
            <Grid item xs={12} className='form-grid-container'>
              <Typography variant='h4'>{heading}</Typography>
            </Grid>
          </Grid>
          <Grid container>{children}</Grid>
          <Grid container>
            <Grid item xs={12} md={12} lg={12} className='form-grid-action-button'>
              <ActionButton loading={isLoading} buttonLabel={buttonLabel} />
            </Grid>
          </Grid>
          {forgotPasswordLink !== '' && (
            <div className='form-forgot-password-main-container'>
              <Link
                onClick={() => {
                  handleForgotPassword(forgotPasswordLink);
                }}
                className='form-forgot-password-link-text'>
                Forgot Password?
              </Link>
            </div>
          )}
        </form>
      )}
    </Container>
  );
};

export default React.memo(FormWrapper);
