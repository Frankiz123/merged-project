import React, { useRef } from 'react';
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';

import MultiStepWrapper from '@components/wrapper/MultiStepWrapper';

import { StepOnePayment, StepTwoComponent } from '@components/Payment';
import StepThreeComponent from '@components/Payment/StepThree/StepThree';

import 'swiper/css';

interface PaymentProps {
  id?: string;
}

const Payment: React.FC<PaymentProps> = () => {
  const swiperRef = useRef<SwiperRef>(null);

  const [activeStep, setActiveStep] = React.useState(1);

  const steps = ['Create an account', 'Enter payment information', 'Create your first link'];

  const handleStepsIndex = (e: number | undefined): void => {
    if (e) {
      if (swiperRef.current) {
        swiperRef.current.swiper.slideTo(e - 1);
      }
      setActiveStep(e);
    }
  };

  return (
    <MultiStepWrapper steps={steps} handleStepsIndex={handleStepsIndex} activeStep={activeStep}>
      <Swiper ref={swiperRef} preventInteractionOnTransition={false} slidesPerView={1} allowTouchMove={false}>
        <SwiperSlide>
          <StepOnePayment handleStepsIndex={handleStepsIndex} />
        </SwiperSlide>
        <SwiperSlide>
          <StepTwoComponent handleStepsIndex={handleStepsIndex} />
        </SwiperSlide>
        <SwiperSlide>
          <StepThreeComponent />
        </SwiperSlide>
      </Swiper>
    </MultiStepWrapper>
  );
};

export default Payment;
