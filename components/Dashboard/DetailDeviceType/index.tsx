import React, { useMemo, useState } from 'react';

import { Box } from '@mui/material';

import Text from '@components/Text';
import { DetailDeviceType as DetailDeviceTypeData } from 'services/dashboard';

import styles from './detailDeviceType.module.scss';

const BarChartIcon = '/images/bar-chart-2.svg';

const OPTIONS = ['iOS', 'Google', 'Huawei', 'Web'];

interface IDetailDeviceType {
  heading: string;
  data: DetailDeviceTypeData[];
}

interface ICheckBox {
  activeIndex: number[];
  onSelect: (indexes: number[]) => void;
}

const CheckBox: React.FC<ICheckBox> = ({ activeIndex, onSelect }) => (
  <div className={styles.filterContainer}>
    {OPTIONS.map((entry: string, index: number) => (
      <div key={entry} className={styles.checkBoxWrapper}>
        <input
          key={`${entry}-device`}
          id={`${entry}-device`}
          multiple
          type='checkbox'
          value={index}
          checked={activeIndex.includes(index)}
          onChange={() => {
            if (activeIndex.includes(index)) {
              onSelect(activeIndex.filter((i: number) => i !== index));
            } else {
              onSelect([...activeIndex, index]);
            }
          }}
        />
        <label className={styles.label} htmlFor={`${entry}-device`}>
          {entry}
        </label>
      </div>
    ))}
  </div>
);

const DetailDeviceType: React.FC<IDetailDeviceType> = ({ heading, data }) => {
  const [showLess, setShowLess] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number[]>([0, 1, 2, 3]);

  const handleIndexUpdate = (indexes: number[]): void => {
    setActiveIndex(indexes);
  };

  const onToggle = (): void => {
    setShowLess(s => !s);
  };

  const totalClicks = useMemo(() => {
    const sumOfClicks = data.reduce((total, obj: DetailDeviceTypeData) => {
      if (activeIndex.includes(0) && obj.type.toLowerCase() === 'iphone') {
        return total + obj.count;
      }
      if (activeIndex.includes(1) && obj.type.toLowerCase() === 'android') {
        return total + obj.count;
      }
      if (activeIndex.includes(2) && obj.type.toLowerCase() === 'huawei') {
        return total + obj.count;
      }
      if (activeIndex.includes(3) && obj.type.toLowerCase() === 'web') {
        return total + obj.count;
      }
      return total;
    }, 0);
    return sumOfClicks;
  }, [data, activeIndex]);

  const deviceDetails = useMemo(() => {
    const result = data.filter((obj: DetailDeviceTypeData) => {
      if (activeIndex.includes(0) && obj.type.toLowerCase() === 'iphone') {
        return true;
      }
      if (activeIndex.includes(1) && obj.type.toLowerCase() === 'android') {
        return true;
      }
      if (activeIndex.includes(2) && obj.type.toLowerCase() === 'huawei') {
        return true;
      }
      if (activeIndex.includes(3) && obj.type.toLowerCase() === 'web') {
        return true;
      }
      return false;
    });
    return result;
  }, [data, activeIndex]);

  return (
    <Box className={styles.boxWrapper}>
      <Text text={heading} className={styles.heading} />
      <CheckBox activeIndex={activeIndex} onSelect={handleIndexUpdate} />
      <Box className={[styles.singleDevice, styles.card].join(' ')}>
        <Box className={styles.singleDeviceHeading}>
          <Text variant='subtitle1' text={'Device'} className={styles.hashText} />
        </Box>
        <Box className={styles.singleDeviceDetail}>
          <img src={BarChartIcon} />
          <Text variant='subtitle1' text={totalClicks.toFixed(0)} className={styles.value} />
          <Text variant='subtitle1' text={' total clicks'} className={styles.totalClicks} />
        </Box>
      </Box>
      <Box className={!showLess ? styles.WrapperShowMore : styles.WrapperShowLess}>
        {deviceDetails.map((item: DetailDeviceTypeData, index: number) => (
          <Box className={[styles.singleDevice, styles.border].join(' ')} key={index}>
            <Box className={styles.singleDeviceHeading}>
              <Text variant='subtitle1' text={item.name} className={styles.name} />
            </Box>
            <Box className={styles.singleDeviceDetail}>
              <img src={BarChartIcon} />
              <Text variant='subtitle1' text={item.count.toFixed(0)} className={styles.innerValue} />
              <Text
                variant='subtitle1'
                text={` clicks (${((item.count / totalClicks) * 100).toFixed(0)} %)`}
                className={styles.innerTotalClicks}
              />
            </Box>
          </Box>
        ))}
      </Box>

      {deviceDetails && deviceDetails?.length > 4 && !showLess && (
        <Text text='... see more' className={styles.footerLink} onClick={onToggle} />
      )}
      {showLess && <Text text='... see less' className={styles.footerLink} onClick={onToggle} />}
    </Box>
  );
};

export default DetailDeviceType;
