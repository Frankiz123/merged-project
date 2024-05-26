import React, { useEffect, useState } from 'react';

import Router, { useRouter } from 'next/router';
import { FormikValues, useFormik } from 'formik';
import { toast } from 'react-toastify';
import { UserCredential } from 'firebase/auth';

import AuthWrapper from '@components/wrapper/AuthWrapper';
import SignUpForm from '@components/SignUpForm';
import { SGIN_UP_INIT_VALUES } from '@utils/formik/InitialValues';
import { SGIN_UP_INIT_VALUES_VALIDATION_SCHEMA } from '@utils/yup-validations/validations';
import { useAuth } from '@context/AuthContext';
import { AUTH_FAILURE_CASES } from '@config/firebase';
import { AUTH_ROUTES } from '@utils/routes';
import { checkInvitedUrlExistence } from '@utils/firebase-methods/database';

const Invitation: React.FC = () => {
  const router = useRouter();
  const { rid } = router.query;

  const [urlExists, setUrlExists] = useState(false);
  const [pageLoading, isPageLoading] = useState(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);

  const { signUp, googleSignIn } = useAuth();

  const handleLogin = (): void => {
    void Router.replace(AUTH_ROUTES.login);
  };

  const handleMessage = (result: UserCredential | undefined | string | boolean | Error, toastId): void => {
    if (result && typeof result !== 'boolean') {
      if (typeof result === 'string') {
        toast.update(toastId, {
          render: `Something went wrong. Please try again`,
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = result as unknown as any;
      let message = '';
      if (error.message && error.message.includes('/')) {
        message = error.message?.split('/');
      }
      if (message && Array.isArray(message) && message.length > 0) {
        message = message[1];
      }
      if (message.includes(')')) {
        message = message.split(')')[0];
      }
      switch (message.trim().toLowerCase()) {
        case AUTH_FAILURE_CASES.email_already_in_use: {
          toast.update(toastId, {
            render: `The email ${values.email} is already in use`,
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
            autoClose: 300,
          });
          break;
        }
      }
    }
  };

  const onSubmit = async (values: FormikValues): Promise<void> => {
    setLoading(true);
    const toastId = toast.loading('Sign Up');
    try {
      const result = await signUp(values.email, values.password, values.name, rid as string);
      if (result) {
        toast.update(toastId, {
          render: `SignUp Successful`,
          type: 'success',
          isLoading: false,
          autoClose: 3000,
        });
      }
      handleMessage(result, toastId);
    } catch (error) {
      handleMessage(error, toastId);
    } finally {
      setLoading(false);
    }
  };

  const { handleSubmit, handleChange, errors, values, touched } = useFormik({
    initialValues: SGIN_UP_INIT_VALUES,
    validationSchema: SGIN_UP_INIT_VALUES_VALIDATION_SCHEMA,
    onSubmit,
  });

  const handleGoogleLogin = async (): Promise<number> => {
    setGoogleLoading(false);
    const toastId = toast.loading('Google SignIn');
    try {
      await googleSignIn(String(rid));
      toast.update(toastId, {
        render: `Google signIn successful`,
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
      return 0;
    } catch (_e) {
      toast.update(toastId, {
        render: `Something went wrong. Please try again.`,
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
      return 0;
    } finally {
      setGoogleLoading(false);
      void router.replace('/');
    }
  };

  const handleCheckInvitationLink = async (): Promise<void> => {
    const exists = await checkInvitedUrlExistence(router.query.rid as string);
    setUrlExists(exists);
    if (!exists) {
      void router.push('/404');
    }
    isPageLoading(false);
  };

  useEffect(() => {
    if (router.isReady) {
      void handleCheckInvitationLink();
    }
  }, [router.isReady]);

  return (
    <div>
      {!pageLoading && urlExists && (
        <AuthWrapper
          rightBlock
          link
          isLoading={loading}
          rightHeading={'Wer das nicht nutzt, lässt bares Geld liegen.'}
          rightPrimaryText={`Ich verwende Merge, um meine Affiliate-Links für Instagram zu optimieren. Ich habe meine Provision im ersten Monat einfach um das 7,5-fache erhöht.`}
          rightSecondaryText={`Selina @selinasknopf — Mama Bloggerin`}
          onSubmitForm={handleSubmit}>
          <SignUpForm
            headerText={'Sign up for free and get your first link in minutes'}
            secondaryText={`Already have an account?`}
            primaryText={'Log in now.'}
            buttonLabel={'Sign up'}
            loading={loading}
            isGoogleLoading={googleLoading}
            errors={errors}
            values={values}
            touched={touched}
            onPrimaryTextClick={handleLogin}
            handleChange={handleChange}
            onGoogleLogin={handleGoogleLogin}
          />
        </AuthWrapper>
      )}
    </div>
  );
};

export default Invitation;
