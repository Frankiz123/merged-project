import React from 'react';

import styles from './emailVerification.module.scss';
import ActionButton from '@components/ActionButton';
import Text from '@components/Text';

interface IEmailVerification {
  email: string;
  sendConfirmationEmail: () => Promise<void>;
}

const EmailVerification: React.FC<IEmailVerification> = ({ email, sendConfirmationEmail }) => {
  const onPress = (): void => {
    void sendConfirmationEmail();
  };

  return (
    <div className={styles.wrapper}>
      <Text variant={'h2'} className={styles.headingText} text='Verification' />
      <Text
        variant={'subtitle1'}
        className={styles.subtitleText}
        text={`A verification email has been sent to your email address, ${email}, please verify your email to use the features.`}
      />
      <ActionButton onClick={onPress} buttonLabel='Re-send verification email' className={styles.resend} />
    </div>
  );
};

export default EmailVerification;
