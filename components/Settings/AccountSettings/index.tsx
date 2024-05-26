import React, {
  useState,
  useEffect,
  // useRef, ChangeEvent
} from 'react';

import { FormikValues, useFormik } from 'formik';
import {
  Grid,
  // Divider,
  Box,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

import {
  Title,
  HeadingSection,
  // TextFieldSectionHeading,
  accountStyles as styles,
} from '@components/Settings';
// import Text from '@components/Text';
import ActionButton from '@components/ActionButton';
import TextFieldBox from '@components/TextFieldBox';
import DropDownComponent from '@components/DropDown/DropDown';
import {
  LANGUAGE_DROPDOWN,
  // COUNTRY, CITY
} from '@utils/settings';
import FieldInputAdornment from '@components/TextFieldBox/fieldInputAdornment';

import { db, auth } from '@config/firebase';
import { User as FirebaseUser } from 'firebase/auth';
import { MergeUser } from '@utils/firebase-interfaces';
import { COLLECTION_NAME } from '@utils/FirebaseConstants';
import {
  updateRecord,
  // singleImageUpload,
} from '@utils/firebase-methods/database';
import { fetchSingleCollection } from '@utils/firebase-methods/fetchData';
import { ACCOUNT_SETTING_SCHEMA } from '@utils/yup-validations/validations';

interface AccountSettingsProps {
  foo?: string;
}

interface DropdownValues {
  id: number;
  label: string;
  value: string;
}
const AccountSettings: React.FC<AccountSettingsProps> = () => {
  // const fileInputRef = useRef<HTMLInputElement>(null);
  // const [imageUrl, setImageUrl] = useState('');
  // const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<MergeUser | undefined>(undefined);

  const handleChangeAccountLanguage = (e: DropdownValues): void => {
    void setFieldValue('accountLanguage', e.value);
  };

  // const handleChangeCountry = (e: DropdownValues): void => {
  //   void setFieldValue('country', e.value);
  // };

  // const handleChangeCity = (e: DropdownValues): void => {
  //   void setFieldValue('city', e.value);
  // };

  // const handleUpload = (event: ChangeEvent<HTMLInputElement>): void => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     reader.onload = async (e: any) => {
  //       setImage(e?.target?.result);
  //       const res = await singleImageUpload(
  //         COLLECTION_NAME.user,
  //         e?.target?.result,
  //       );
  //       setImageUrl(res);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  useEffect(() => {
    auth.onAuthStateChanged((user: FirebaseUser) => {
      fetchSingleCollection(db, COLLECTION_NAME.user, user?.uid)
        .then(currentUser => {
          setUser(currentUser);
          // setImage(currentUser?.imageUrl);
          // setImageUrl(currentUser?.imageUrl);
        })
        .catch(error => {
          console.log(error);
        });
    });
  }, []);

  const onSubmit = async (values: FormikValues): Promise<void> => {
    setLoading(true);
    await updateRecord(db, COLLECTION_NAME.user, user?.id ?? '', {
      ...user,
      ...values,
      // imageUrl,
    })
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const { handleSubmit, handleChange, errors, values, setFieldValue } = useFormik({
    initialValues: {
      email: user?.email,
      fullName: user?.fullName,
      accountLanguage: user?.accountLanguage,
    },
    validationSchema: ACCOUNT_SETTING_SCHEMA,
    onSubmit,
    enableReinitialize: true,
  });

  return (
    <form onSubmit={handleSubmit}>
      <Title className={styles.title} text='Account Settings' />
      <HeadingSection primary='Personal Information' secondary='Update your personal Information' className={styles.heading} />
      <Grid container>
        <Grid item xs={12} md={12} lg={5} className={styles.gridMargin}>
          <TextFieldBox
            name='fullName'
            label='Full Name'
            placeholder='e.g. Mary Parker'
            value={values.fullName}
            onChange={handleChange}
            error={errors.fullName !== undefined}
            helperText={errors.fullName}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} md={12} lg={5} className={styles.gridMargin}>
          <TextFieldBox
            name='email'
            label='Email'
            placeholder='you@company.com'
            InputProps={{
              endAdornment: <FieldInputAdornment error={errors.email} />,
            }}
            value={values.email}
            onChange={handleChange}
            error={Boolean(errors.email)}
            helperText={errors.email}
            disabled={loading}
          />
        </Grid>
        <Grid item xs={12} md={12} lg={5} className={styles.gridMargin}>
          <DropDownComponent
            selectedValue={values.accountLanguage}
            fullWidth={true}
            data={LANGUAGE_DROPDOWN}
            helperText={errors.accountLanguage}
            label={'Account Language'}
            placeHolder={values.accountLanguage ? '' : 'Set your account language'}
            handleChangeValue={handleChangeAccountLanguage}
            className='accountSettingDropDown'
          />
        </Grid>

        {/* <Grid item xs={12} className={styles.divider}>
          <Divider />
        </Grid>

        <Grid item xs={12} md={12}>
          <HeadingSection
            primary="Billing information"
            secondary="This infirmation is used for your invoice"
            className={styles.heading}
          />
        </Grid>
        <Grid item xs={12} md={12} lg={5} className={styles.gridMargin}>
          <TextFieldSectionHeading
            className="adressHeading"
            primary="Adress line"
            secondary="Street name and bulding number"
          />
          <TextFieldBox
            name="adress"
            label=""
            placeholder="e.g. parker street 1"
            value={values.adress}
            onChange={handleChange}
            error={Boolean(errors.adress)}
            helperText={errors.adress}
            disabled={loading}
          />
        </Grid>
        <Grid item xs={12} md={12} lg={5} className={styles.gridMargin}>
          <TextFieldSectionHeading
            className="adressHeading"
            primary="Additional adress details (optional)"
            secondary="Floor, space number or room number"
          />
          <TextFieldBox
            name="additionalAdress"
            placeholder="e.g. room 4"
            label=""
            value={values.additionalAdress}
            onChange={handleChange}
            error={Boolean(errors.additionalAdress)}
            helperText={errors.additionalAdress}
            disabled={loading}
          />
        </Grid>
        <Grid item xs={12} md={12} lg={5} className={styles.gridMargin}>
          <DropDownComponent
            selectedValue={values.country}
            fullWidth={true}
            data={COUNTRY}
            placeHolder={values.country ? '' : 'Select country'}
            helperText={errors.country}
            label={'Country'}
            handleChangeValue={handleChangeCountry}
            className="accountSettingDropDown"
          />
        </Grid>

        <Grid item xs={12} md={12} lg={5} className={styles.gridMargin}>
          <DropDownComponent
            selectedValue={values.city}
            fullWidth={true}
            placeHolder={values.city ? '' : 'Select city'}
            data={CITY}
            helperText={errors.city}
            label={'City'}
            handleChangeValue={handleChangeCity}
            className="accountSettingDropDown"
          />
        </Grid>

        <Grid item xs={12} md={12} lg={5} className={styles.gridMargin}>
          <TextFieldBox
            name="zip"
            label="Zip/Postal code"
            placeholder="Postal code"
            value={values.zip}
            onChange={handleChange}
            error={Boolean(errors.zip)}
            helperText={errors.zip}
            disabled={loading}
          />
        </Grid>
        <Grid item xs={12} md={12} lg={5} className={styles.gridMargin}>
          <TextFieldBox
            name="organizationName"
            label="Organization name"
            placeholder="e.g. Apple Inc."
            value={values.organizationName}
            onChange={handleChange}
            error={Boolean(errors.organizationName)}
            helperText={errors.organizationName}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} md={12} lg={5} className={styles.gridMargin}>
          <TextFieldBox
            name="vat"
            label="VAT (optional)"
            placeholder="Street"
            value={values.vat}
            onChange={handleChange}
            error={Boolean(errors.vat)}
            helperText={errors.vat}
            disabled={loading}
          />
        </Grid> */}

        {/*  <Grid item xs={12} className={styles.divider}>
          <Divider />
        </Grid>

          <Grid item xs={12} md={12}>
          <HeadingSection
            primary="Fallback Info"
            secondary="Upload your company logo for our fallback page"
          />
          <Text text="Upload company logo" className={styles.textStyling} />
        </Grid> 
        <Grid container>
          <Grid xs={12} md={8} lg={8} item className={styles.gridMarginImage}>
            {image && (
              <img src={image ?? ''} className={styles.imageLeftSide} />
            )}
            <Box className={styles.imageBox}>
              <img
                src={'/images/setting/imgIcon.svg'}
                className={styles.image}
              />
              <Box className={styles.inputFile}>
                <p className={styles.firstText}>
                  Drop your logo here, or{' '}
                  <Link
                    className={styles.browse}
                    onClick={() => fileInputRef.current?.click()}>
                    browse
                  </Link>
                </p>
              </Box>
              <Text
                text="Supports: JPG, PNG, SVG"
                className={styles.secondText}
              />
            </Box>
          </Grid>
        </Grid> */}
      </Grid>
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
      {/* <input
        type="file"
        ref={fileInputRef}
        className={styles.file}
        onChange={handleUpload}
      /> */}
    </form>
  );
};

export default AccountSettings;
