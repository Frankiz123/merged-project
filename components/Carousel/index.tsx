import * as React from 'react';

import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import SwipeableViews from 'react-swipeable-views';

const AutoPlaySwipeableViews = SwipeableViews;

interface CarouselProps {
  Component: React.ReactNode;
  count: number;
}

const Carousel: React.FC<CarouselProps> = ({ Component, count }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = count;

  const handleStepChange = (step: number): void => {
    setActiveStep(step);
  };

  return (
    <>
      <AutoPlaySwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents>
        {Component}
      </AutoPlaySwipeableViews>
      <MobileStepper steps={maxSteps} position='static' activeStep={activeStep} nextButton={null} backButton={null} />
    </>
  );
};

export default Carousel;
