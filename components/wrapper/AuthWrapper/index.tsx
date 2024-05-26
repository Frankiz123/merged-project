import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import Link from 'next/link';

import { Avatar, Divider, Grid } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

import ActionButton from '@components/ActionButton';
import Text from '@components/Text';
import BottomLinkComponent from '@components/BottomLink';
import { useAuth } from '@context/AuthContext';
import { MERGE_LINKS } from '@utils/mergeLinks';
import styles from './authwrapper.module.scss';

interface AuthWrapperProps {
  rightBlock?: boolean;
  icon?: string;
  heading?: string;
  link?: boolean;
  twoFA?: boolean;
  verticalLink?: boolean;
  secondaryText?: string;
  primaryText?: string;
  isLoading?: boolean;
  isGoogleLoading?: boolean;
  loginSection?: boolean;
  buttonLabel?: string;
  rightHeading?: string;
  rightPrimaryText?: string;
  rightSecondaryText?: string;
  onPrimaryTextClick?: () => void;
  onSubmitForm?: (e?: React.FormEvent<HTMLFormElement> | undefined) => void;
  onGoogleLogin?: () => Promise<number>;
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({
  rightBlock = false,
  icon = null,
  loginSection = false,
  heading,
  link = false,
  verticalLink = false,
  secondaryText = null,
  primaryText = null,
  isLoading = false,
  isGoogleLoading = false,
  buttonLabel = '',
  rightHeading = '',
  rightPrimaryText = '',
  rightSecondaryText = '',
  onGoogleLogin = () => {},
  onPrimaryTextClick = () => {},
  onSubmitForm = () => {},
  children,
}) => {
  const { isMobile } = useAuth();
  const [isiPhone, setIsiPhone] = useState(false);

  const handleForgotPassword = (): void => {
    void Router.push('forgot-password');
  };

  useEffect(() => {
    setIsiPhone(/iPhone|ipad/i.test(window.navigator.userAgent));
  }, []);

  return (
    <div className={styles.auth_wrapper}>
      <Grid container className={[styles.container, rightBlock ? styles.signUpContainer : ''].join(' ')}>
        <Grid item xs={12} sm={12} md={rightBlock ? 6 : 12} className={styles.authForm}>
          <Grid item xs={12} sm={12} className={styles.mergeLogoContainer}>
            <Link href='/'>
              <img src='/images/mainLogo.svg' className={styles.main_logo} />
            </Link>
          </Grid>
          <form onSubmit={onSubmitForm} className={styles.formStyle}>
            {icon && <img className={styles.iconImage} src={icon} />}
            {heading && <Text text={heading} className={styles.heading} align={rightBlock ? 'left' : 'center'} />}
            {children}
            {buttonLabel && (
              <ActionButton
                loading={isLoading}
                type={'submit'}
                buttonLabel={buttonLabel}
                className={rightBlock ? styles.fixwidth : ''}
                buttonClass={styles.loginButton}
              />
            )}
            {loginSection && (
              <>
                <Text variant='h1' text='Forgot Password?' className={styles.forgetPassword} onClick={handleForgotPassword} />
                <br />
                <Divider>
                  <Text variant='h1' text='or' className={styles.dividerText} />
                </Divider>
                <ActionButton
                  loading={isGoogleLoading}
                  type='button'
                  buttonLabel='Log in with Google'
                  variant='outlined'
                  color='secondary'
                  buttonClass={styles.googleButton}
                  onClick={onGoogleLogin}
                  startIcon={<GoogleIcon />}
                />
              </>
            )}
            {link && (
              <BottomLinkComponent
                secondaryText={secondaryText}
                rightBlock={rightBlock}
                verticalLink={verticalLink}
                primaryText={primaryText}
                onPrimaryTextClick={onPrimaryTextClick}
              />
            )}
          </form>
          <Grid item xs={12} sm={12} className={isiPhone ? styles.mergeFooterIphone : styles.mergeFooterContainer}>
            <div className={styles.allRightsWrapper}>
              <p className={styles.allRights}>© All right reserved.</p>
              <div>
                <a href={MERGE_LINKS.terms} target='_blank' rel='noopener noreferrer'>
                  TAC
                </a>
                <a href={MERGE_LINKS.imprint} target='_blank' rel='noopener noreferrer'>
                  Imprint
                </a>
                <a href={MERGE_LINKS.privacy} target='_blank' rel='noopener noreferrer'>
                  Privacy Policy
                </a>
              </div>
            </div>
          </Grid>
        </Grid>
        {!isMobile && rightBlock && (
          <Grid item xs={12} sm={12} md={6} className={styles.rightBlock}>
            <div className={styles.rightMainContainer}>
              <Avatar alt='person img' className={styles.secondaryImage} src='/images/auth_img.png' />
              <Text text={rightHeading} className={styles.rightHeading} />
              <div className={styles.textDiv}>
                <Text text={rightPrimaryText} className={styles.primaryText} />
                <Text text={rightSecondaryText} className={styles.secondayTextStyle} />
              </div>
            </div>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default AuthWrapper;
