import React, { ChangeEventHandler } from 'react';

import { Grid } from '@mui/material';
import { FormikErrors, FormikValues } from 'formik';
import CloseIcon from '@mui/icons-material/Close';

import Text from '@components/Text';
import TextFieldBox from '@components/TextFieldBox';
import DropDownComponent from '@components/DropDown/DropDown';
import SwitchButtonComponent from '@components/SwitchButton/SwitchButton';
import BottomLinkComponent from '@components/BottomLink';
import RadioButton from '@components/RadioButton/RadioButton';
import ActionButton from '@components/ActionButton';

import styles from './CreateLinkForm.module.scss';

const ArrowRight = '/images/arrowRight.svg';

const DATA_DOMAIN_DROPDOWN = [
  {
    id: 1,
    label: 'mrg.to',
    value: 'mrg.to',
  },
  // {
  //   id: 2,
  //   label: 'Add custom domain',
  //   value: 'customDomain',
  // },
];

const RADIO_DATA = [
  {
    value: 'landingPage',
    label: 'Fallback Page',
  },
  {
    value: 'customUrl',
    label: 'Enter a Custom URL as Fallback page',
  },
];

const WEB_RADIO_DATA = [
  {
    value: 'browser',
    label: 'Target URL in Browser',
  },
  {
    value: 'appStore',
    label: 'App Store to trigger download',
  },
];

interface CreateLinkProps {
  isWebUrl: boolean;
  isUtm: boolean;
  isTabLink: boolean;
  loading: boolean;
  selectedRadioValue: string;
  values: FormikValues;
  errors: FormikErrors<FormikValues>;
  handleChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  handleChangeDomainValue: (value: string) => void;
  onUtmHandleChange: (value: boolean) => void;
  onTabletLinkChange: (value: boolean) => void;
  radioButtonHandler: (value: string) => void;
  onHelpCenterClick: () => void;
  handleClose: () => void;
}

const CreateLink: React.FC<CreateLinkProps> = ({
  isWebUrl,
  isUtm,
  isTabLink,
  loading,
  selectedRadioValue,
  values,
  errors,
  handleChange,
  handleChangeDomainValue,
  onUtmHandleChange,
  onTabletLinkChange,
  radioButtonHandler,
  onHelpCenterClick,
  handleClose,
}) => (
  <Grid container className={styles.formContainer}>
    <Grid item xs={12} className={styles.row}>
      <Grid item xs={12} className={styles.inputCol}>
        {isWebUrl && (
          <>
            <TextFieldBox
              textFieldLarge
              name='webUrl'
              label='Target Web Url'
              placeholder='apple.com/xxx'
              value={values.webUrl}
              onChange={handleChange}
              error={!!errors.iOSMobile || !!errors.webUrl}
              helperText={errors.iOSMobile ? errors.iOSMobile : errors.webUrl}
              disabled={true}
            />
            <br />
          </>
        )}
        <TextFieldBox
          textFieldLarge
          name='title'
          label='Title (Optional)'
          placeholder='Application name'
          value={values.title}
          onChange={handleChange}
          error={errors.title !== undefined}
          helperText={errors.title}
          disabled={loading}
        />
        <br />
      </Grid>
    </Grid>
    <Grid item xs={12} sm={12} className={styles.rowContainer}>
      <DropDownComponent
        loading={loading}
        className={styles.dropdown}
        selectedValue={values.domain}
        data={DATA_DOMAIN_DROPDOWN}
        label={'Domain'}
        handleChangeValue={handleChangeDomainValue}
        startIcon={ArrowRight}
      />
      <Text text='/' variant={'h1'} className={styles.slashText} />
      <Grid item className={styles.fullWidth}>
        <TextFieldBox
          textFieldLarge
          name='shortHandle'
          className={styles.fullWidth}
          placeholder='mrg.to'
          label='Short handle (optional)'
          value={values.shortHandle}
          onChange={handleChange}
          error={errors.shortHandle !== undefined}
          helperText={errors.shortHandle}
          disabled={loading}
        />
      </Grid>
    </Grid>
    <Grid item xs={12} sm={12} className={styles.row}>
      <SwitchButtonComponent
        checked={isUtm}
        className={styles.toogleButton}
        onChange={onUtmHandleChange}
        labelName='Add UTMs to track web traffic in analytics tools'
      />
    </Grid>
    {isUtm && (
      <Grid container>
        <Text text='UTMs' variant={'subtitle1'} className={styles.largeLabel} />
        <Grid item xs={12} className={styles.row}>
          <Grid xs={12} sm={12} md={6} className={styles.inputCol}>
            <TextFieldBox
              textFieldLarge
              name='source'
              label='Source'
              placeholder='e.g. google, newsletter'
              value={values.source}
              onChange={handleChange}
              error={errors.source !== undefined}
              helperText={errors.source}
              disabled={loading}
            />
          </Grid>
          <Grid xs={12} sm={12} md={6} className={styles.inputCol}>
            <TextFieldBox
              textFieldLarge
              name='medium'
              label='Medium'
              placeholder='e.g. cpc, banner, email'
              value={values.medium}
              onChange={handleChange}
              error={errors.medium !== undefined}
              helperText={errors.medium}
              disabled={loading}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} className={styles.row}>
          <Grid xs={12} sm={12} md={6} className={styles.inputCol}>
            <TextFieldBox
              textFieldLarge
              name='campaign'
              label='Campaign'
              placeholder='e.g. spring_sale'
              value={values.campaign}
              onChange={handleChange}
              error={errors.campaign !== undefined}
              helperText={errors.campaign}
              disabled={loading}
            />
          </Grid>
          <Grid xs={12} sm={12} md={6} className={styles.inputCol}>
            <TextFieldBox
              textFieldLarge
              name='term'
              label='Term (Optional)'
              placeholder='e.g. something'
              value={values.term}
              onChange={handleChange}
              error={errors.term !== undefined}
              helperText={errors.term}
              disabled={loading}
            />
          </Grid>
        </Grid>

        <Grid item xs={12} className={styles.row}>
          <Grid xs={12} sm={12} md={6} className={styles.inputCol}>
            <TextFieldBox
              textFieldLarge
              name='content'
              label='Content'
              placeholder='e.g. something else'
              value={values.content}
              onChange={handleChange}
              error={errors.content !== undefined}
              helperText={errors.content}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={6} className={styles.inputCol}></Grid>
        </Grid>
        <Grid item xs={12} className={styles.row}>
          <Grid item xs={12} className={styles.inputCol}>
            <TextFieldBox
              textFieldLarge
              name='utmTagPreview'
              label='UTM tagPreview'
              placeholder='text'
              value={values.utmTagPreview}
              onChange={handleChange}
              error={errors.utmTagPreview !== undefined}
              helperText={errors.utmTagPreview}
              disabled={loading}
            />
            <BottomLinkComponent
              onPrimaryTextClick={onHelpCenterClick}
              containerClass={styles.helpCenter}
              primaryText={'Help center'}
              secondaryText={'Learn more about UTMs and tracking links in the '}
              leftAlign
            />
          </Grid>
        </Grid>
      </Grid>
    )}

    {!isWebUrl && (
      <Grid item xs={12} sm={12} className={styles.row}>
        <Grid item xs={12} sm={12} className={styles.inputCol}>
          <Text text={'App Links'} variant={'subtitle1'} className={styles.largeLabel} />
          <SwitchButtonComponent
            checked={isTabLink}
            className={styles.toogleButton}
            onChange={onTabletLinkChange}
            labelName='Activate Tablet Links'
          />
        </Grid>
      </Grid>
    )}

    {!isWebUrl && (
      <Grid item xs={12} className={styles.row}>
        <Grid item xs={6} className={styles.inputCol}>
          <TextFieldBox
            textFieldLarge
            name='iOSMobile'
            label='iPhone AppStore (iOS)'
            placeholder='apple.com/xxx'
            value={values.iOSMobile}
            onChange={handleChange}
            error={!!errors.iOSMobile}
            helperText={errors.iOSMobile}
            disabled={loading}
          />
        </Grid>
        <Grid item xs={6} className={styles.inputCol}>
          {isTabLink && (
            <TextFieldBox
              textFieldLarge
              name='iOSTablet'
              label='iPad AppStore (iOS)'
              placeholder='apple.com/xxx'
              value={values.iOSTablet}
              onChange={handleChange}
              error={!!errors.iOSMobile || !!errors.iOSTablet}
              helperText={errors.iOSMobile || errors.iOSTablet || undefined}
              disabled={loading}
            />
          )}
        </Grid>
      </Grid>
    )}
    {!isWebUrl && (
      <Grid item xs={12} className={styles.row}>
        <Grid item xs={6} className={styles.inputCol}>
          <TextFieldBox
            textFieldLarge
            name='androidMobile'
            label='Phone Google Play Store (Android)'
            placeholder='google.com/xxx'
            value={values.androidMobile}
            onChange={handleChange}
            error={!!errors.iOSMobile || !!errors.androidMobile}
            helperText={errors.iOSMobile || errors.androidMobile || undefined}
            disabled={loading}
          />
        </Grid>
        <Grid item xs={6} className={styles.inputCol}>
          {isTabLink && (
            <TextFieldBox
              textFieldLarge
              name='androidTablet'
              label='Tablet Google Play Store (Android)'
              placeholder='google.com/xxx'
              value={values.androidTablet}
              onChange={handleChange}
              error={!!errors.iOSMobile || !!errors.androidTablet}
              helperText={errors.iOSMobile || errors.androidTablet || undefined}
              disabled={loading}
            />
          )}
        </Grid>
      </Grid>
    )}
    {!isWebUrl && (
      <Grid item xs={12} className={styles.row}>
        <Grid item xs={6} className={styles.inputCol}>
          <TextFieldBox
            textFieldLarge
            name='huaweiMobile'
            label='Phone Store Huawei '
            placeholder='huawei.com/xxx'
            value={values.huaweiMobile}
            onChange={handleChange}
            error={!!errors.iOSMobile || !!errors.huaweiMobile}
            helperText={errors.iOSMobile || errors.huaweiMobile || undefined}
            disabled={loading}
          />
        </Grid>
        <Grid item xs={6} className={styles.inputCol}>
          {isTabLink && (
            <TextFieldBox
              textFieldLarge
              name='huaweiTablet'
              label='Tablet Store Huawei'
              placeholder='huawei.com/xxx'
              value={values.huaweiTablet}
              onChange={handleChange}
              error={!!errors.iOSMobile || !!errors.huaweiTablet}
              helperText={errors.iOSMobile || errors.huaweiTablet || undefined}
              disabled={loading}
            />
          )}
        </Grid>
      </Grid>
    )}
    {isWebUrl && (
      <>
        <Text text={'If app is not installed send users to:'} variant={'subtitle1'} className={styles.normalLabel} />
      </>
    )}
    <Grid item xs={12} className={styles.row}>
      {isWebUrl ? (
        <Grid item xs={12} className={styles.inputCol}>
          <RadioButton value={selectedRadioValue} onChange={radioButtonHandler} data={WEB_RADIO_DATA} />
        </Grid>
      ) : (
        <Grid item xs={6} className={styles.inputCol}>
          <RadioButton value={selectedRadioValue} onChange={radioButtonHandler} data={RADIO_DATA} />
          {selectedRadioValue === 'landingPage' && (
            <>
              <Text
                text="Redirects users to the web url if they don't have an app installed or open the link on the desktop."
                variant={'subtitle1'}
                className={styles.radioSectionText}
              />
            </>
          )}
          {selectedRadioValue === 'customUrl' && (
            <Grid item xs={12}>
              <TextFieldBox
                textFieldLarge
                name='customUrl'
                label='Custom URL'
                value={values.customUrl}
                onChange={handleChange}
                error={errors.customUrl !== undefined}
                helperText={errors.customUrl}
                disabled={loading}
              />
            </Grid>
          )}
        </Grid>
      )}

      <Grid item xs={6} className={styles.inputCol}></Grid>
    </Grid>
    <Grid item xs={12} sm={12} className={styles.footerCotainer}>
      <ActionButton
        type='button'
        onClick={handleClose}
        buttonLabel={'Cancel'}
        variant={'text'}
        loading={loading}
        showLoader={false}
        startIcon={<CloseIcon />}
      />
      <ActionButton loading={loading} type='submit' buttonLabel={'Create'} />
    </Grid>
  </Grid>
);

export default React.memo(CreateLink);
