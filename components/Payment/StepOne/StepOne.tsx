import React, { useState } from 'react';

import Router from 'next/router';

import { FormikValues, useFormik } from 'formik';

import SignUpForm from '@components/SignUpForm';

import { SGIN_UP_INIT_VALUES } from '@utils/formik/InitialValues';
import { SGIN_UP_INIT_VALUES_VALIDATION_SCHEMA } from '@utils/yup-validations/validations';
import { AUTH_ROUTES } from '@utils/routes';

interface StepOnePaymentProps {
  tepsIndex?: (e: number | undefined) => void;
  handleStepsIndex?: (e: number | undefined) => void;
}

const StepOnePayment: React.FC<StepOnePaymentProps> = ({ handleStepsIndex }) => {
  const [loading, setLoading] = useState(false);

  const handleLogin = (): void => {
    void Router.push(AUTH_ROUTES.login);
  };

  const onSubmit = (_values: FormikValues): void => {
    setLoading(false);
    if (handleStepsIndex) {
      handleStepsIndex(2);
    }
  };

  const { handleSubmit, handleChange, errors, values, touched } = useFormik({
    initialValues: SGIN_UP_INIT_VALUES,
    validationSchema: SGIN_UP_INIT_VALUES_VALIDATION_SCHEMA,
    onSubmit,
  });

  return (
    <form className='paymentWrapper' onSubmit={handleSubmit}>
      <SignUpForm
        headerText={'Create an account'}
        secondaryText={`Already have an account?`}
        primaryText={'Log in now.'}
        buttonLabel={'Sign up for free'}
        loading={loading}
        errors={errors}
        values={values}
        touched={touched}
        onPrimaryTextClick={handleLogin}
        handleChange={handleChange}
      />
    </form>
  );
};

export default StepOnePayment;
