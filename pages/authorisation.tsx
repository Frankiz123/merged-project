import React, { useState } from 'react';
import AuthCode from 'react-auth-code-input';

import Text from '@components/Text';
import { Link } from '@mui/material';
import ActionButton from '@components/ActionButton';
import AuthWrapper from '@components/wrapper/AuthWrapper';

// svgIcons
const LockedIcon = '/images/lockIcon.png';

const Authorisation: React.FC = () => {
  const [otp, setOTP] = useState<string>('');
  const [maxLength] = useState<number>(6);
  const [errorBool, setErrorBool] = useState<boolean>(false);
  const [onFocus] = useState<boolean>(true);

  const onChangeOpt = (e: string): void => {
    setOTP(e);
    if (otp.length === 6 || otp.length === 0) setErrorBool(false);
  };

  const handleSubmit = (e): void => {
    e.preventDefault();
    if (otp.length < 6) setErrorBool(true);
  };

  return (
    <AuthWrapper
      icon={LockedIcon}
      verticalLink
      twoFA
      onSubmitForm={handleSubmit}
      link={false}
      secondaryText={`It may take a minute to receive your code. Haven't received it?`}
      primaryText={`Resend a new code.`}>
      <div className='otp-wrapper'>
        <Text className='authenticationHeading' text={`Authenticate Your Account`} />
        <Text
          className='authenticationTitle'
          text={`Protecting your data is our top priority. Please confirm your account by entering the authorisation code sent to *****ibele@gmx.de`}
        />
        <div className='optContainer'>
          <AuthCode
            autoFocus={onFocus}
            allowedCharacters='numeric'
            length={6}
            containerClassName={errorBool ? 'optMainContainerBoolFalse' : 'optMainContainer'}
            inputClassName={'optCodeInput'}
            onChange={onChangeOpt}
          />
        </div>
        <div className='errorText'>
          {errorBool && <Text className='otpErrorText' variant={'subtitle1'} text='Please Enter 6 digits code' />}
        </div>
        <div className='buttonWrapper'>
          <ActionButton loading={false} type={'submit'} buttonLabel={`${maxLength - otp.length} numbers left`} buttonClass='twoFaButton' />
        </div>
        <div className='bottomLink'>
          <Text text="It may take a minute to receive your code. Haven't received it?" className='primaryText' />
          <Link className='link'>{'Resend a new code.'}</Link>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default Authorisation;
