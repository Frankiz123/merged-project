import React, { useRef, useState } from 'react';
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';

import MultiStepWrapper from '@components/wrapper/MultiStepWrapper';
import { MainWrapper } from '@components/wrapper';
import { StepOneAddDomain, StepTwoVerifyDomain, StepThreeVerifiedDomain } from '@components/Domain';

import 'swiper/css';

const Domains: React.FC = () => {
  const swiperRef = useRef<SwiperRef>(null);

  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = ['Verify Domain', 'Domain verification in progress', 'Your verified Domain'];

  const handleStepsIndex = (e: number | undefined): void => {
    if (e) {
      if (swiperRef.current) {
        swiperRef.current.swiper.slideTo(e - 1);
      }
      setActiveStep(e);
    }
  };

  return (
    <MainWrapper>
      <MultiStepWrapper steps={steps} handleStepsIndex={handleStepsIndex} activeStep={activeStep}>
        <Swiper ref={swiperRef} preventInteractionOnTransition={false} slidesPerView={1} allowTouchMove={false}>
          <SwiperSlide>
            <StepOneAddDomain handleStepsIndex={handleStepsIndex} />
          </SwiperSlide>
          <SwiperSlide>
            <StepTwoVerifyDomain handleStepsIndex={handleStepsIndex} />
          </SwiperSlide>
          <SwiperSlide>
            <StepThreeVerifiedDomain handleStepsIndex={handleStepsIndex} />
          </SwiperSlide>
        </Swiper>
      </MultiStepWrapper>
    </MainWrapper>
  );
};

export default Domains;
