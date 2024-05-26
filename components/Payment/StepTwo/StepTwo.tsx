import React from 'react';

import Text from '@components/Text';
import AccordianComponent from '@components/Accordian/Accordian';

import { StepOneStripComponent, StepThreeStripComponent, StepTwoStripComponent } from './PaymenntSteps';

import styles from './StepTwo.module.scss';

interface StepTwoComponentProps {
  handleStepsIndex?: (e: number | undefined) => void;
}

const StepTwoComponent: React.FC<StepTwoComponentProps> = ({ handleStepsIndex }) => (
  <div className={styles.mainContainer}>
    <Text text='Enter payment information' variant={'h1'} className={styles.headerText} />
    <Text text='Second, please choose and confirm your payment.' variant={'subtitle1'} className={styles.secondaryText} />
    <div className={styles.acccordianContainer}>
      <AccordianComponent ariaControls='panel1bh-content' id='panel1bh-header' labelText={'Step 1:  Billing address (Invoice)'}>
        <StepOneStripComponent />
      </AccordianComponent>

      <AccordianComponent ariaControls='panel2bh-content' id='panel2bh-header' labelText={'Step 2:  Choose payment method'}>
        <StepTwoStripComponent />
      </AccordianComponent>

      <AccordianComponent ariaControls='panel3bh-content' id='panel3bh-header' labelText={'Step 3: Payment schedule'}>
        <StepThreeStripComponent handleStepsIndex={handleStepsIndex} />
      </AccordianComponent>
    </div>
  </div>
);

export default StepTwoComponent;
