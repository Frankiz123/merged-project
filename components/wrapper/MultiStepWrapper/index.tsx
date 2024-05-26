import React from 'react';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { Grid } from '@mui/material';

import styles from './multistepwrapper.module.scss';
import Text from '@components/Text';

interface MultiStepWrapperProps {
  steps: string[];
  activeStep?: number | undefined;
  handleStepsIndex: (e: number | undefined) => void;
  children: React.ReactNode;
}

const MultiStepWrapper: React.FC<MultiStepWrapperProps> = ({ steps, activeStep = 1, handleStepsIndex = _e => {}, children }) => {
  const setupHandler = (index: number): void => {
    if (index < activeStep) {
      handleStepsIndex(index - 1 < 1 ? 1 : index - 1);
    }
  };

  return (
    <div className={styles.payment_wrapper}>
      <Grid className={styles.paymentForm} container>
        <Grid item xs={12} md={12} className={styles.col}>
          <Stepper activeStep={activeStep} alternativeLabel={true}>
            {steps.map((label, index) => {
              const stepProps: { completed?: boolean } = {};
              const labelProps: {
                optional?: React.ReactNode;
              } = {};
              labelProps.optional = <Text variant={'subtitle1'} text={label} className={styles.labelText} />;
              return (
                <Step key={label} {...stepProps} className={styles.step}>
                  <StepLabel
                    onClick={() => {
                      setupHandler(index);
                    }}
                    StepIconComponent={activeStep - 1 === index ? RadioButtonCheckedIcon : RadioButtonUncheckedIcon}
                    {...labelProps}>
                    0{index + 1}
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {children}
        </Grid>
      </Grid>
    </div>
  );
};

export default MultiStepWrapper;
