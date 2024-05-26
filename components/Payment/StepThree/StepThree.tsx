import React from 'react';

import Text from '@components/Text';
import ActionButton from '@components/ActionButton';

import styles from './StepThree.module.scss';

// svgIcons
const CheckCircleOutlineIcon = '/images/checked.svg';

interface StepThreeComponentProps {
  foo?: string;
}

const StepThreeComponent: React.FC<StepThreeComponentProps> = () => {
  const handleFinalStep = (): void => {};

  return (
    <div className={styles.mainContainer}>
      <div>
        <img src={CheckCircleOutlineIcon} />
        <Text text='Thank you for your order!' variant={'h1'} className={styles.headerText} />
      </div>
      <Text
        text='Thank you for your trust in my company. I wish you a lot of fun and success in your company and in your campaigns. If you have any questions or suggestions, please feel free to contact me.'
        variant={'subtitle1'}
        className={styles.secondaryText}
      />
      <Text text={`Many greetings`} variant={'h3'} className={styles.greetingText} />
      <Text text={`Raphael, Founder.`} variant={'h3'} className={styles.greetingText} />
      <ActionButton type={'submit'} onClick={handleFinalStep} buttonLabel={'Create Your Fist Link'} className={styles.submitButton} />
      <div className={styles.bottomContainer}>
        <img src='/images/download.png' />
        <Text text='Download Invoice' variant={'subtitle1'} className={styles.bottomText} />
      </div>
    </div>
  );
};

export default StepThreeComponent;
