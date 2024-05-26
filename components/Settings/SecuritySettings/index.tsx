import React, { useState, useEffect } from 'react';

import { updatePassword, EmailAuthProvider, reauthenticateWithCredential, User } from 'firebase/auth';
import * as yup from 'yup';
import { Visibility, VisibilityOff, Close as CloseIcon } from '@mui/icons-material';
import Swal from 'sweetalert2';
import { FormikValues, useFormik } from 'formik';
import { Box, Grid, IconButton, InputAdornment } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import CheckIcon from '@mui/icons-material/Check';
// import CloseIcon from '@mui/icons-material/Close';

import { Title, HeadingSection, securityStyles as styles } from '@components/Settings';
import { auth, db } from '@config/firebase';
import ActionButton from '@components/ActionButton';
import TextFieldBox from '@components/TextFieldBox';
import { COLLECTION_NAME } from '@utils/FirebaseConstants';
import { fetchSingleCollection } from '@utils/firebase-methods/fetchData';
import { useAuth } from '@context/AuthContext';

interface SecuritySettingsProps {
  foo?: string;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = () => {
  const user: User | null = auth?.currentUser;

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });
  const [activeLinksBool, setActiveLinksBool] = useState(false);
  const { logIn } = useAuth();

  const handleShowCurrentPassword = (): void => {
    setShowPassword({
      ...showPassword,
      currentPassword: !showPassword.currentPassword,
    });
  };

  const handleShowNewPassword = (): void => {
    setShowPassword({
      ...showPassword,
      newPassword: !showPassword.newPassword,
    });
  };

  const handleShowConfirmPassword = (): void => {
    setShowPassword({
      ...showPassword,
      confirmNewPassword: !showPassword.confirmNewPassword,
    });
  };

  // const twoFactorEmail = (event: boolean): void => {
  //   setActiveLinksBool(event);
  //   updateRecord(db, COLLECTION_NAME.user, user?.uid ?? '', {
  //     twoFactorEmail: event,
  //   })
  //     .then(() => {
  //     })
  //     .catch(() => {
  //     });
  // };

  useEffect(() => {
    fetchSingleCollection(db, COLLECTION_NAME.user, user?.uid ?? '')
      .then(currentUser => {
        setActiveLinksBool(currentUser?.twoFactorEmail);
      })
      .catch(error => {
        console.log(error);
      });
  }, [activeLinksBool]);

  const onSubmit = async (values: FormikValues): Promise<void> => {
    setLoading(true);
    if (user && user.email) {
      reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, values.password))
        .then(() => {
          updatePassword(user, values.newPassword)
            .then(async () => {
              setLoading(false);
              await Swal.fire({
                icon: 'success',
                title: 'Password has been changed successfuly',
                showConfirmButton: false,
                timer: 3000,
              });
              if (user && user.email) {
                await logIn(user.email, values.newPassword).then(() => {});
              }
            })
            .catch(() => {
              setLoading(false);
            });
        })
        .catch(async () => {
          setLoading(false);
          await Swal.fire({
            icon: 'error',
            title: 'Current Password Is Wrong, Please Enter Correct Password.',
            showConfirmButton: false,
            timer: 3000,
          });
        });
    } else {
      setLoading(false);
      await Swal.fire({
        icon: 'error',
        title: 'Something went wrong. Please try again later.',
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  const { handleSubmit, handleChange, errors, values } = useFormik({
    initialValues: {
      password: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    validationSchema: yup.object({
      password: yup
        .string()
        .min(7, 'Password must be at least 7 characters')
        .matches(/(.*[0-9].*)|([!@#$%^&*])/, 'One number or special Character')
        .required('Password is required'),
      newPassword: yup
        .string()
        .min(7, 'Password must be at least 7 characters')
        .matches(/(.*[0-9].*)|([!@#$%^&*])/, 'One number or special Character')
        .required('new Password is required'),
      confirmNewPassword: yup.string().oneOf([yup.ref('newPassword'), null], 'Must match "new password" field value'),
    }),
    onSubmit,
  });

  const colorSelection = (): number => {
    switch (errors.newPassword) {
      case 'Password must be at least 7 characters':
        return 1;
      case 'One number or special Character':
        return 1;
      case 'Password is required':
        return 1;
      case undefined:
        if (values.newPassword.length < 1) {
          return 0;
        }
        return 2;
      default:
        return 0;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Title text='Security' />
      <Grid container className={styles.outerContainer}>
        <Grid item xs={12}>
          <HeadingSection primary='Change Password' secondary='Update your personal Information' className={styles.heading} />
        </Grid>
        <Box className={styles.container}>
          <Grid xs={12} md={12} lg={5} item className={styles.gridMargin}>
            <TextFieldBox
              name='password'
              label='Current password'
              placeholder='Enter the old password'
              type={!showPassword.currentPassword ? 'password' : 'text'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end' disablePointerEvents={loading}>
                    <IconButton aria-label='toggle password visibility' onClick={handleShowCurrentPassword} edge='end'>
                      {showPassword.currentPassword ? <Visibility /> : <VisibilityOff />}
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
          </Grid>

          <Grid container>
            <Grid xs={12} item className={styles.gridMargin}>
              <TextFieldBox
                name='newPassword'
                label='New password'
                placeholder='Enter a strong password'
                type={!showPassword.newPassword ? 'password' : 'text'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end' disablePointerEvents={loading}>
                      <IconButton aria-label='toggle password visibility' onClick={handleShowNewPassword} edge='end'>
                        {showPassword.newPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                value={values.newPassword}
                onChange={handleChange}
                error={errors.newPassword !== undefined}
                helperText={errors.newPassword}
                disabled={loading}
              />
            </Grid>
            <Grid xs={12} item className={styles.gridText}>
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
            </Grid>
          </Grid>

          <Grid xs={12} item className={styles.gridMargin}>
            <TextFieldBox
              name='confirmNewPassword'
              label='Confirm new password'
              placeholder='Enter the new strong password'
              type={!showPassword.confirmNewPassword ? 'password' : 'text'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end' disablePointerEvents={loading}>
                    <IconButton aria-label='toggle password visibility' onClick={handleShowConfirmPassword} edge='end'>
                      {showPassword.confirmNewPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              value={values.confirmNewPassword}
              onChange={handleChange}
              error={errors.confirmNewPassword !== undefined}
              helperText={errors.confirmNewPassword}
              disabled={loading}
            />
          </Grid>

          {/* <Grid item xs={12} className={styles.divider}>
          <Divider />
        </Grid> */}

          {/* <Grid xs={9}>
          <HeadingSection
            primary="2-Facor Authentification"
            secondary="Choose type of notifications you want to recieve. Each Time you sign in to your merged account, you´ll need your password and a verification code."
          />
          <Text text="Options" className={styles.OptionsText} />
        </Grid> */}
          {/* <Grid className={styles.switchButtons}> */}
          {/* <SwitchButtonComponent
            checked={activeLinksBool}
            className={styles.toogleAppLinksButton}
            onChange={twoFactorEmail}
            labelName="E-Mail"
          /> */}
          {/* <SwitchButtonComponent
            checked={false}
            className={styles.toogleAppLinksButton}
            onChange={() => {
            }}
            labelName="SMS"
          /> */}
          {/* </Grid> */}
          {/* <Grid xs={12} item className={styles.mobileGrid}>
          <TextFieldBox
            name="password"
            label="Mobile Number"
            placeholder="Mobile number"
            type={showPassword ? 'password' : 'text'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" disablePointerEvents={loading}>
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => {
                    }}
                    edge="end">
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            value={values.password}
            onChange={handleChange}
            error={Boolean(errors.password)}
            helperText={
              !touched.password && errors.password ? errors.password : ''
            }
            disabled={loading}
          />
        </Grid> */}
          {/* <Grid container spacing={1} className={styles.buttonGroup}>
            <Grid item xs={12} md={3} lg={3}>
              <ActionButton
                buttonLabel={'Save changes'}
                onClick={handleSubmit}
                loading={loading}
              />
            </Grid>
            <Grid item xs={12} md={3} lg={3}>
              <ActionButton
                buttonLabel={'Cancel'}
                variant={'text'}
                startIcon={<CloseIcon />}
              />
            </Grid>
          </Grid> */}
          <Box className={styles.buttonGroup}>
            <ActionButton
              className={styles.buttons}
              buttonClass={styles.saveChanges}
              buttonLabel={'Save changes'}
              onClick={handleSubmit}
              loading={loading}
            />
            <ActionButton
              className={styles.buttons}
              buttonClass={styles.cancelChanges}
              buttonLabel={'Cancle'}
              variant={'text'}
              startIcon={<CloseIcon />}
            />
          </Box>
        </Box>
      </Grid>
    </form>
  );
};

export default SecuritySettings;
