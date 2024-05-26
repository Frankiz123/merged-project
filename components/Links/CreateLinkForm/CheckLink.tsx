import React from 'react';

import { Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { FormikErrors, FormikValues } from 'formik';

import Text from '@components/Text';
import TextFieldBox from '@components/TextFieldBox';
import Loading from '@components/Loading';
import ActionButton from '@components/ActionButton';

import styles from './CreateLinkForm.module.scss';

interface CheckLinkProps {
  isVerified: boolean;
  loading: boolean;
  values: FormikValues;
  errors: FormikErrors<FormikValues>;
  handleChange: (event: unknown) => void;
  handleClose: () => void;
}

const CheckLink: React.FC<CheckLinkProps> = ({ isVerified, loading, values, errors, handleClose, handleChange }) => (
  <Grid container className={styles.formContainer}>
    <Text text='Paste in your URL to get started' variant={'subtitle1'} className={styles.labelText} />
    <Grid item xs={12} className={styles.checkRow}>
      <Grid item className={styles.inputWrapper}>
        <TextFieldBox
          textFieldLarge
          name='url'
          label='Add a Website URL or App-Store-URL'
          className={styles.textField}
          placeholder='apple.com/xxx'
          value={values.url}
          onChange={handleChange}
          error={errors.url !== undefined}
          disabled={loading}
        />
        {isVerified && (
          <Grid className={styles.fieldMessageWrapper}>
            <div>
              <CheckIcon className={styles.checkIconStyle} />
              <p>Your URL is matching our rules. We can Create a link.</p>
            </div>
            <CheckCircleOutlineIcon className={styles.checkIconStyle} />
          </Grid>
        )}
        {errors.url && (
          <Grid className={styles.fieldMessageWrapper}>
            <div>
              <CloseIcon className={styles.closeIconStyle} />
              <p className={styles.closeIconStyle}>
                Seems like your URL is not matching one of our rules. You can create a shortlink and add manual the app links.
              </p>
            </div>
            <ErrorOutlineIcon className={styles.closeIconStyle} />
          </Grid>
        )}

        <Grid item xs={12} sm={12} className={styles.checkFooterCotainer}>
          <ActionButton
            type='button'
            onClick={handleClose}
            buttonLabel={'Cancel'}
            variant={'text'}
            loading={loading}
            showLoader={false}
            startIcon={<CloseIcon />}
          />
          <ActionButton loading={loading} type='submit' buttonLabel={isVerified ? 'Create' : 'Verify'} />
        </Grid>
      </Grid>
      <Grid item className={styles.loadingWrapper}>
        {loading && <Loading size={33} />}
      </Grid>
    </Grid>
  </Grid>
);

export default React.memo(CheckLink);
