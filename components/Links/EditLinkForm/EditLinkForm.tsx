import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';

import { FormikValues, useFormik } from 'formik';
import CloseIcon from '@mui/icons-material/Close';
import { Grid } from '@mui/material';
import Router from 'next/router';
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { debounce } from 'lodash';
import { Id, toast } from 'react-toastify';

import DropDownComponent from '@components/DropDown/DropDown';
import TextFieldBox from '@components/TextFieldBox';
import Text from '@components/Text';
import SwitchButtonComponent from '@components/SwitchButton/SwitchButton';
import BottomLinkComponent from '@components/BottomLink';
import RadioButton from '@components/RadioButton/RadioButton';
import ActionButton from '@components/ActionButton';
import { CREATE_LINK_FORM_SCHEMA } from '@utils/yup-validations/validations';
import { MergeLink } from '@utils/firebase-interfaces';
import { updateLink } from '@utils/firebase-methods/database';
import { db } from '@config/firebase';
import { PROTECTED_ROUTES } from '@utils/routes';
import { useProtected } from '@context/ProtectedContext';

import styles from './EditLinkForm.module.scss';
import { verfifyLink } from 'services';

const ArrowRight = '/images/arrowRight.svg';

interface CreateLinkFormProps {
  link: MergeLink | undefined;
  onEditClick: () => void;
}

const DATA_DOMAINN_DROPDOWN = [
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

const EditLinkFormComponent: React.FC<CreateLinkFormProps> = ({ link, onEditClick = (_id = '') => {} }) => {
  const { reloadLinks } = useProtected();

  const [isVerified, setVerfifed] = useState<boolean>(false);
  const [title, isTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isUtm, setUtm] = useState<boolean>(false);
  const [isTabLink, setTabLink] = useState<boolean>(false);
  const [selectedRadioValue, setSelectedRadioValue] = useState<string>('landingPage');

  useEffect(() => {
    if (link) {
      if (link.source || link.medium || link.campaign || link.term || link.content || link.utmTagPreview) {
        setUtm(true);
      }
      if (link.webUrl) {
        if (link.triggerWebUrlInBrowser) {
          setSelectedRadioValue('browser');
        } else {
          setSelectedRadioValue('appStore');
        }
      } else {
        if (link.triggerWebUrlInBrowser) {
          setSelectedRadioValue('landingPage');
        } else {
          setSelectedRadioValue('customUrl');
        }
        // if (link.customUrl) {
        //   setSelectedRadioValue('customUrl');
        // } else {
        //   setSelectedRadioValue('landingPage');
        // }
      }
      if (link.androidTablet || link.iOSTablet || link.huaweiTablet) {
        setTabLink(true);
      }
    }
  }, [link]);

  const isWebUrl = useMemo(() => {
    if (link?.webUrl) {
      return true;
    }
    return false;
  }, [link]);

  const handleChangeDomainValue = (value: string): void => {
    void setFieldValue('domain', value);
    if (value === 'customDomain') void Router.replace(PROTECTED_ROUTES.domains);
  };

  const onUtmHandleChange = (event: boolean): void => {
    setUtm(event);
    if (!event) {
      void setFieldValue('source', '');
      void setFieldValue('medium', '');
      void setFieldValue('campaign', '');
      void setFieldValue('term', '');
      void setFieldValue('content', '');
      void setFieldValue('utmTagPreview', '');
    }
  };

  const onTabletLinkChange = (event: boolean): void => {
    setTabLink(event);
    if (!event) {
      void setFieldValue('androidTablet', '');
      void setFieldValue('iOSTablet', '');
      void setFieldValue('huaweiTablet', '');
    }
  };

  const onHelpCenterClick = (): void => {
    void Router.replace(PROTECTED_ROUTES.helpCenter);
  };

  const showError = (toastId: Id): void => {
    toast.update(toastId, {
      render: 'Something went wrong. Please try again later',
      type: 'error',
      isLoading: false,
    });
  };

  const handleClose = (): void => {
    onEditClick('cancel');
  };

  const onSubmit = async (values: FormikValues): Promise<void> => {
    const toastId = toast.loading('Updating link');
    try {
      setLoading(true);
      const data: MergeLink = values as MergeLink;
      if (link) {
        const result = await updateLink(db, link?.id, data);
        if (result === '1') {
          toast.update(toastId, {
            render: 'Link updated successfully',
            type: 'success',
            isLoading: false,
          });
          void reloadLinks();
          onEditClick();
        } else if (result === '-1') {
          showError(toastId);
        } else if (result === '-2') {
          setFieldError('shortHandle', 'Short handle is already taken. Please change your short handle.');
          toast.update(toastId, {
            render: 'Short handle is already taken',
            type: 'error',
            isLoading: false,
          });
        } else {
          showError(toastId);
        }
      }
    } catch (error) {
      showError(toastId);
    } finally {
      setLoading(false);
      setTimeout(() => {
        toast.dismiss(toastId);
      }, 2000);
    }
  };

  const radioButtonHandler = (event: string): void => {
    setSelectedRadioValue(event);
    if (event && (event === 'appStore' || event === 'customUrl')) {
      void setFieldValue('triggerWebUrlInBrowser', false);
    } else if (event && (event === 'browser' || event === 'landingPage')) {
      void setFieldValue('triggerWebUrlInBrowser', true);
    }
  };

  const UPDATE_LINK_FORM = {
    id: link?.id,
    title: link?.title,
    webUrl: link?.webUrl,
    triggerWebUrlInBrowser: link?.triggerWebUrlInBrowser,
    domain: link?.domain,
    shortHandle: link?.shortHandle,
    source: link?.source,
    medium: link?.medium,
    campaign: link?.campaign,
    term: link?.term,
    content: link?.content,
    utmTagPreview: link?.utmTagPreview,
    iOSMobile: link?.iOSMobile,
    iOSTablet: link?.iOSTablet,
    androidMobile: link?.androidMobile,
    androidTablet: link?.androidTablet,
    huaweiMobile: link?.huaweiMobile,
    huaweiTablet: link?.huaweiTablet,
    customUrl: link?.customUrl,
  };

  const { handleSubmit, handleChange, errors, values, setFieldValue, setFieldError } = useFormik({
    initialValues: UPDATE_LINK_FORM,
    validationSchema: CREATE_LINK_FORM_SCHEMA,
    onSubmit,
  });

  useEffect(() => {
    if (values.iOSMobile || values.iOSTablet || values.androidMobile || values.androidTablet) {
      void setFieldValue('title', title);
    }
  }, [values.iOSMobile, values.iOSTablet, values.androidMobile, values.androidTablet, setFieldValue]);

  useEffect(() => {
    if (values.iOSMobile || values.iOSTablet || values.androidMobile || values.androidTablet) {
      const { title } = values;
      void setFieldValue('title', title);
    }
  }, [values.iOSMobile, values.iOSTablet, values.androidMobile, values.androidTablet, setFieldValue]);

  useEffect(() => {
    if (values.iOSMobile || values.iOSTablet || values.androidMobile || values.androidTablet) {
      void setFieldValue('title', values.title);
    }
  }, [values.iOSMobile, values.iOSTablet, values.androidMobile, values.androidTablet, setFieldValue]);

  const onWebUrlChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setVerfifed(false);
    void setFieldValue('webUrl', event?.currentTarget?.value);
    if (!event?.currentTarget?.value) {
      void setFieldValue('androidMobile', '');
      void setFieldValue('androidTablet', '');
      void setFieldValue('iOSMobile', '');
      void setFieldValue('iOSTablet', '');
      void setFieldValue('huaweiMobile', '');
      void setFieldValue('huaweiTablet', '');
      void setFieldValue('huaweiTablet', '');
      void setFieldValue('title', '');
      return;
    }
    const httpsReg = /^$|^(https:\/\/)?([\w]+\.)?\w+\.\w{2,3}(?:\.\w{2})?(\/.*)?$/;
    if (httpsReg.test(event?.currentTarget?.value)) {
      debouncedUpdate(event?.currentTarget?.value);
    }
  };

  const debouncedUpdate = useCallback(
    debounce((inputValue: string) => {
      webUrlVerification(inputValue);
    }, 500),
    []
  );

  const webUrlVerification = (url: string): void => {
    setLoading(true);
    verfifyLink(url)
      .then(data => {
        if (data && data.isLive) {
          setVerfifed(true);
          isTitle(data?.titles);
          if (data.redirectUrl) {
            void setFieldValue('webUrl', data.redirectUrl);
            url = data.redirectUrl;
          }
          if (url.includes('amzn.') || url.includes('amazon.')) {
            void setFieldValue('iOSMobile', 'https://apps.apple.com/us/app/amazon-shopping/id297606951');
            void setFieldValue('iOSTablet', 'https://apps.apple.com/us/app/amazon-shopping/id297606951');
            void setFieldValue('androidMobile', 'https://play.google.com/store/apps/details?id=com.amazon.mShop.android.shopping');
            void setFieldValue('androidTablet', 'https://play.google.com/store/apps/details?id=com.amazon.mShop.android.shopping');
          }
        } else {
          setFieldError('webUrl', 'error');
        }
      })
      .catch(_err => {
        setFieldError('webUrl', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
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
                    onChange={onWebUrlChange}
                    error={!!errors.iOSMobile || !!errors.webUrl}
                    helperText={errors.iOSMobile ? 'Please fill in the field' : ''}
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
                  {errors.webUrl && (
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
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={12} className={styles.rowContainer}>
            <DropDownComponent
              loading={loading}
              selectedValue={values.domain}
              data={DATA_DOMAINN_DROPDOWN}
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
                <Grid item xs={6} className={styles.inputCol}>
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
                <Grid item xs={6} className={styles.inputCol}>
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
                <Grid item xs={6} className={styles.inputCol}>
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
                <Grid item xs={6} className={styles.inputCol}>
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
                <Grid item xs={6} className={styles.inputCol}>
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
            <>
              <Grid item xs={12} sm={12} className={styles.row}>
                <Grid item xs={12} sm={12} className={styles.inputCol}>
                  <Text text='App Links' variant={'subtitle1'} className={styles.largeLabel} />
                  <SwitchButtonComponent
                    checked={isTabLink}
                    className={styles.toogleButton}
                    onChange={onTabletLinkChange}
                    labelName='Activate Tablet Links'
                  />
                </Grid>
              </Grid>

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

              <Grid item xs={12} className={styles.row}>
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
                <Grid item xs={6} className={styles.inputCol}></Grid>
              </Grid>
            </>
          )}
          {isWebUrl && (
            <>
              <Text text={'If app is not installed send users to:'} variant={'subtitle1'} className={styles.normalLabel} />
              <Grid item xs={12} className={styles.inputCol}>
                <RadioButton value={selectedRadioValue} onChange={radioButtonHandler} data={WEB_RADIO_DATA} />
              </Grid>
            </>
          )}
          <Grid item xs={12} sm={12} className={styles.footerCotainer}>
            <ActionButton
              type='button'
              onClick={handleClose}
              buttonLabel={'Cancel'}
              variant={'text'}
              startIcon={<CloseIcon />}
              loading={loading}
              showLoader={false}
            />
            <ActionButton loading={loading} type='submit' buttonLabel={'Save'} />
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default EditLinkFormComponent;
