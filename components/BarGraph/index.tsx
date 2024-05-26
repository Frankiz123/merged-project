/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from 'react';

import { BarChart, Bar, XAxis, Legend, ResponsiveContainer, Tooltip } from 'recharts';

import Text from '@components/Text';
import { GraphStat } from '@utils/firebase-interfaces';
import styles from './BarGraph.module.scss';

interface IBarGraph {
  stats: GraphStat[];
}

interface ICheckBox {
  activeIndex: number[];
  onSelect: (indexes: number[]) => void;
}

interface ICustomTick {
  x: any;
  y: any;
  payload: any;
}

const OPTIONS = ['iOS', 'Google', 'Huawei', 'Web'];

const CheckBox: React.FC<ICheckBox> = ({ activeIndex, onSelect }) => (
  <div className={styles.filterContainer}>
    <Text text='Filter' className={styles.textFilter} />
    {OPTIONS.map((entry: string, index: number) => (
      <div key={entry} className={styles.checkBoxWrapper}>
        <input
          key={entry}
          id={entry}
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
        <label className={styles.label} htmlFor={entry}>
          {entry}
        </label>
      </div>
    ))}
  </div>
);

const BarGraph: React.FC<IBarGraph> = ({ stats }) => {
  const [activeIndex, setActiveIndex] = useState<number[]>([0, 1, 2, 3]);

  const handleIndexUpdate = (indexes: number[]): void => {
    setActiveIndex(indexes);
  };

  const data = useMemo(() => {
    if (activeIndex.length === 4) {
      return stats;
    }

    return stats.map(stat => {
      const updatedStat = { ...stat };

      updatedStat.clicks = 0;
      if (activeIndex.includes(0)) {
        updatedStat.clicks += stat.iOSClicks;
      }
      if (activeIndex.includes(1)) {
        updatedStat.clicks += stat.androidClicks;
      }
      if (activeIndex.includes(2)) {
        updatedStat.clicks += stat.huaweiClicks;
      }
      if (activeIndex.includes(3)) {
        updatedStat.clicks += stat.webClicks;
      }

      return updatedStat;
    });
  }, [activeIndex, stats]);

  const CustomXAxisTick = ({ x, y, payload }: ICustomTick): any => {
    if (![0, 6, 13, 20, 27].includes(payload.index)) {
      return null;
    }

    return (
      <>
        <circle cx={x} cy={y - 8} r={5} fill='#D9D9D9' />
        <text x={x} y={y} dy={16} fontSize={12} textAnchor='middle' fill='#666'>
          {payload.value}
        </text>
      </>
    );
  };

  return (
    <ResponsiveContainer width='100%' height='100%'>
      <BarChart width={850} height={300} data={data} barSize={8}>
        <Legend
          verticalAlign='top'
          align='center'
          layout='vertical'
          wrapperStyle={{
            position: 'absolute',
            top: '0',
            left: '0',
          }}
          content={<CheckBox activeIndex={activeIndex} onSelect={handleIndexUpdate} />}
        />
        <XAxis tickLine={false} dataKey='name' interval={0} tick={CustomXAxisTick} padding={{ left: 30, right: 0 }} />
        <Tooltip />
        <Bar dataKey='clicks' fill='#FC594A' />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default React.memo(BarGraph);
