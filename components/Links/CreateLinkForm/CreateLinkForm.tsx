import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import { FormikValues, useFormik } from 'formik';
import Router, { useRouter } from 'next/router';
import { Timestamp, serverTimestamp } from 'firebase/firestore';
import { Id, toast } from 'react-toastify';

import ModalScreen from '@components/Modal/Modal';
import { ADD_LINK, CREATE_LINK_FORM } from '@utils/formik/InitialValues';
import { ADD_LINK_SCHEMA, CREATE_LINK_FORM_SCHEMA } from '@utils/yup-validations/validations';
import { MergeLink } from '@utils/firebase-interfaces';
import { saveLink } from '@utils/firebase-methods/database';
import { db } from '@config/firebase';
import { PROTECTED_ROUTES } from '@utils/routes';
import { useAuth } from '@context/AuthContext';
import { useProtected } from '@context/ProtectedContext';
import { verfifyLink } from 'services';

import CheckLink from './CheckLink';

const CreateLink = dynamic(async () => await import('./CreateLink'));

interface CreateLinkFormProps {
  open?: boolean;
  handleClose?: () => void;
}

const CreateLinkFormComponent: React.FC<CreateLinkFormProps> = ({ open = false, handleClose = () => {} }) => {
  const { user } = useAuth();
  const { reloadLinks } = useProtected();

  const router = useRouter();

  const [isVerified, setVerfifed] = useState<boolean>(false);
  const [title, isTitle] = useState<string>('');
  const [shouldGoNext, setShouldGoNext] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isWebUrl, setIsWebUrl] = useState<boolean>(false);
  const [isUtm, setUtm] = useState<boolean>(false);
  const [isTabLink, setTabLink] = useState<boolean>(false);
  const [webUrl, setWebUrl] = useState<string>('');
  const [selectedRadioValue, setSelectedRadioValue] = useState<string>('landingPage');

  const onCreateLink = async (values: FormikValues): Promise<void> => {
    const toastId = toast.loading('Creating link');
    try {
      setLoading(true);
      const data: MergeLink = values as MergeLink;
      data.userId = user?.id || '';
      data.id = '';
      data.totalClicks = 0;
      data.androidClicks = 0;
      data.iOSClicks = 0;
      data.huaweiClicks = 0;
      data.createdAt = serverTimestamp() as Timestamp;
      const result = await saveLink(db, data);
      if (result === '1') {
        toast.update(toastId, {
          render: 'Link created successfully',
          type: 'success',
          isLoading: false,
        });
        closeModal();
        void reloadLinks();
        void router.replace(PROTECTED_ROUTES.links);
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
    } catch (error) {
      showError(toastId);
    } finally {
      setLoading(false);
      setTimeout(() => {
        toast.dismiss(toastId);
      }, 2000);
    }
  };

  const onUrlVerify = async (values: FormikValues): Promise<void> => {
    if (isVerified) {
      setShouldGoNext(true);
      return;
    }
    setLoading(true);
    verfifyLink(values.url)
      .then(data => {
        if (data && data.isLive) {
          setVerfifed(true);
          isTitle(data?.titles);
          if (values.url.includes('google.com') || values.url.includes('apple.com')) {
            setIsWebUrl(false);
            setSelectedRadioValue('landingPage');
          } else {
            setIsWebUrl(true);
          }
          if (data.redirectUrl) {
            setWebUrl(data.redirectUrl);
          } else {
            setWebUrl(values.url);
          }
          setShouldGoNext(true);
        } else {
          setFieldError('url', 'error');
        }
      })
      .catch(_err => {
        setFieldError('url', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onSubmit = async (formValues: FormikValues): Promise<void> => {
    if (shouldGoNext) {
      void onCreateLink(formValues);
    } else {
      void onUrlVerify(formValues);
    }
  };

  const { handleSubmit, handleChange, errors, values, setFieldValue, setFieldError, resetForm } = useFormik({
    enableReinitialize: true,
    initialValues: shouldGoNext ? CREATE_LINK_FORM : ADD_LINK,
    validationSchema: shouldGoNext ? CREATE_LINK_FORM_SCHEMA : ADD_LINK_SCHEMA,
    onSubmit,
  });

  useEffect(() => {
    if (shouldGoNext) {
      if (webUrl) {
        setTimeout(() => {
          if (isWebUrl) {
            let inputUrl: string = webUrl;
            if (inputUrl.includes('/-/')) {
              inputUrl = inputUrl.replace('/-/', '/');
            }
            void setFieldValue('webUrl', inputUrl);
            // void setFieldValue('title', getTitleFromWebUrl(webUrl));
            void setFieldValue('title', title);
            setSelectedRadioValue('browser');
            if (webUrl.includes('amzn.') || webUrl.includes('amazon.')) {
              void setFieldValue('iOSMobile', 'https://apps.apple.com/us/app/amazon-shopping/id297606951');
              void setFieldValue('iOSTablet', 'https://apps.apple.com/us/app/amazon-shopping/id297606951');
              void setFieldValue('androidMobile', 'https://play.google.com/store/apps/details?id=com.amazon.mShop.android.shopping');
              void setFieldValue('androidTablet', 'https://play.google.com/store/apps/details?id=com.amazon.mShop.android.shopping');
            }
          } else {
            if (webUrl.includes('google')) {
              void setFieldValue('androidMobile', webUrl);
            } else {
              void setFieldValue('iOSMobile', webUrl);
            }
          }
        }, 300);
      }
    }
  }, [shouldGoNext, isWebUrl, webUrl, setFieldValue]);

  useEffect(() => {
    if (shouldGoNext && (values.iOSMobile || values.iOSTablet || values.androidMobile || values.androidTablet)) {
      void setFieldValue('title', title);
    }
    if (values.title) {
      void setFieldValue('title', values.title);
    }
  }, [shouldGoNext, values.title, values.iOSMobile, values.iOSTablet, values.androidMobile, values.androidTablet, setFieldValue]);

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

  const radioButtonHandler = (event: string): void => {
    setSelectedRadioValue(event);
    if (event && (event === 'appStore' || event === 'customUrl')) {
      void setFieldValue('triggerWebUrlInBrowser', false);
    } else if (event && (event === 'browser' || event === 'landingPage')) {
      void setFieldValue('triggerWebUrlInBrowser', true);
    }
  };

  const closeModal = (): void => {
    resetForm();
    setLoading(false);
    setVerfifed(false);
    setShouldGoNext(false);
    setIsWebUrl(false);
    setUtm(false);
    setWebUrl('');
    handleClose();
  };

  const onLinkChange = (event: React.FormEvent<HTMLInputElement>): void => {
    void setFieldValue('url', event?.currentTarget?.value);
    setShouldGoNext(false);
    setVerfifed(false);
  };

  return (
    <ModalScreen
      height={shouldGoNext ? (isWebUrl ? '750px' : '850px') : '455px'}
      open={open}
      headingText={'Create Link'}
      onSubmitForm={handleSubmit}
      handleClose={closeModal}>
      {shouldGoNext ? (
        <CreateLink
          isWebUrl={isWebUrl}
          isUtm={isUtm}
          isTabLink={isTabLink}
          loading={loading}
          selectedRadioValue={selectedRadioValue}
          values={values}
          errors={errors}
          handleChange={handleChange}
          handleClose={closeModal}
          handleChangeDomainValue={handleChangeDomainValue}
          onUtmHandleChange={onUtmHandleChange}
          onTabletLinkChange={onTabletLinkChange}
          onHelpCenterClick={onHelpCenterClick}
          radioButtonHandler={radioButtonHandler}
        />
      ) : (
        <CheckLink
          isVerified={isVerified}
          loading={loading}
          values={values}
          errors={errors}
          handleChange={onLinkChange}
          handleClose={closeModal}
        />
      )}
    </ModalScreen>
  );
};

export default CreateLinkFormComponent;
