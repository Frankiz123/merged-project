import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import { Box, Grid } from '@mui/material';
import moment from 'moment';
import { capitalize } from 'lodash';

import { useProtected } from '@context/ProtectedContext';
import { GraphStat, MergeLink } from '@utils/firebase-interfaces';
import { getDashboardData, DashboardResponse, DeviceData } from 'services/dashboard';
import { useAuth } from '@context/AuthContext';
import Text from '@components/Text';
import AccountDetailCard from '@components/Dashboard/AccountDetail';
import CountCard from '../CountCard';
import ListButton from '../ListButton';
import { DefaultLinkScreen } from '@components/Links';

import styles from './dashboardMain.module.scss';

const Link2Icon = '/images/link-2.svg';
const MousePointerIcon = '/images/mouse-pointer-click.svg';
// const ShrinkIcon = '/images/shrink.svg';
// const SmartPhoneIcon = '/images/smartphone.svg';

const DashBoardHeader = dynamic(async () => await import('../Header/index'));
const BarGrpah = dynamic(async () => await import('../../BarGraph/index'));
const DashBoardTopStats = dynamic(async () => await import('../DashBoardTopStats/index'));
const DetailDeviceType = dynamic(async () => await import('../DetailDeviceType/index'));
const VennChart = dynamic(async () => await import('../../VennChart/index'));

interface DateSelection {
  id: number;
  value: string;
  label: string;
  startOfMonth: string;
  endOfMonth: string;
}

interface IDashboardStat {
  text: string;
  value: string;
}

const DashboardMain: React.FC = () => {
  const router = useRouter();

  const linkId = router?.query?.linkId || '';

  const { user, userActivePlan } = useAuth();
  const { links, campaigns, linksCount, CardDetail, linksClicksCount } = useProtected();
  const [topLinks, setTopLinks] = useState<Array<{ name: string; count: number }>>();
  const [topCampaigns, setTopCampaigns] = useState<Array<{ name: string; count: number }>>();
  const [dates, setDates] = useState<DateSelection[]>([]);
  const [selectedClicks, setSelectedClicks] = useState<string>('statGraph');
  const [dashboardData, setDashboardData] = useState<DashboardResponse>();
  const [currentLink, setCurrentLink] = useState<MergeLink | null>(null);
  const [userLinks, setUserLinks] = useState<MergeLink[]>([]);
  const [clicksStat, setClicksStats] = useState<GraphStat[]>([]);
  const [selectedValue, setSelectedValue] = useState<string>('This month');
  const [dashboardStat, setDashboardStat] = useState<IDashboardStat[]>([
    { text: 'Clicks total', value: '-' },
    { text: 'Uniques', value: '-' },
    { text: 'Top Devices', value: '-' },
    // { text: 'Top Channels', value: '-' },
  ]);

  const ClicksData = [
    {
      text: 'Link Clicks',
      value: linksClicksCount,
      total: userActivePlan?.unlimitedClicks ? Infinity : userActivePlan?.numberOfClicks ?? 0,
    },
    {
      text: 'Link Counts',
      value: linksCount,
      total: userActivePlan?.unlimitedLinks ? Infinity : userActivePlan?.numberOfLinks ?? 0,
    },
    { text: 'User Count', value: 1, total: 1 },
  ];

  useEffect(() => {
    if (links.length < 1) {
      return;
    }
    const linkData: Array<{ name: string; count: number }> = [];
    const campaignData: Array<{ name: string; count: number }> = [];
    if (links && links.length > 0) {
      setUserLinks(links);
    }
    links?.forEach(v => {
      linkData.push({ name: v?.title, count: v?.totalClicks });
    });
    campaigns?.forEach(v => {
      campaignData.push({ name: v?.folderName, count: v?.totalClicks });
    });
    linkData.sort((a, b) => b.count - a.count);
    campaignData.sort((a, b) => b.count - a.count);

    setTopCampaigns(campaignData.slice(0, 10));
    setTopLinks(linkData.slice(0, 10));

    if (linkId) {
      const link = links.find((l: MergeLink) => l.id === linkId);
      if (link) {
        setCurrentLink(link);
      } else {
        setCurrentLink(null);
      }
    } else {
      setCurrentLink(null);
    }
  }, [links, campaigns, linkId]);

  useEffect(() => {
    if (links.length < 1) {
      return;
    }
    const currentMonth = moment();
    const startOfMonth = currentMonth.startOf('month').format('YYYY-MM-DD');
    const endOfMonth = currentMonth.endOf('month').format('YYYY-MM-DD');
    const months: DateSelection[] = [
      {
        id: 0,
        value: 'This month',
        label: 'This month',
        startOfMonth,
        endOfMonth,
      },
    ];
    if (userLinks && userLinks.length > 0) {
      const linkCreationDate = moment(userLinks[0].createdAt.toDate()).format('MM/DD/yyyy');
      let index = 0;
      let activeMonth = '';
      activeMonth = moment(currentMonth).subtract(index, 'month').format('MM/yyyy');
      while (moment(activeMonth, 'MM/yyyy').format('MM/yyyy') > moment(linkCreationDate.toString()).format('MM/yyyy')) {
        index++;
        activeMonth = moment(currentMonth).subtract(index, 'month').format('MM/yyyy');

        const month = moment(currentMonth).subtract(index, 'month');
        const startOfMonth = month.startOf('month').format('YYYY-MM-DD');
        const endOfMonth = month.endOf('month').format('YYYY-MM-DD');
        months.push({
          id: index,
          value: month.format('MMMM, yyyy'),
          label: month.format('MMMM, yyyy'),
          startOfMonth,
          endOfMonth,
        });
      }
    }

    setDates(months);
    setSelectedValue('This month');
  }, [links, userLinks, user]);

  useEffect(() => {
    if (links.length < 1) {
      return;
    }
    const item = dates.find(date => date.value === selectedValue);
    if (item) {
      loadData(item?.startOfMonth, item?.endOfMonth);
    }
  }, [links, selectedValue, dates]);

  useEffect(() => {
    if (dashboardData && selectedClicks) {
      setClicksStats(dashboardData[selectedClicks] ?? dashboardData.statGraph);
    }
  }, [selectedClicks, dashboardData]);

  const loadData = (start: string, end: string): void => {
    if (user) {
      setDashboardStat([
        { text: 'Clicks total', value: '-' },
        { text: 'Uniques', value: '-' },
        { text: 'Top Devices', value: '-' },
        // { text: 'Top Channels', value: '-' },
      ]);
      setClicksStats([]);
      getDashboardData(user.id, start, end, linkId.toString())
        .then((data: DashboardResponse | null) => {
          if (data && data.success) {
            setDashboardStat([
              { text: 'Clicks total', value: data.totalClicks.toString() },
              { text: 'Uniques', value: data.uniqueClicks.toString() },
              { text: 'Top Devices', value: data.topDevice },
              // { text: 'Top Channels', value: data.topChannel },
            ]);
            setDashboardData(data);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  const handleSelectChange = (event: DateSelection): void => {
    setSelectedValue(event.value);
  };

  const qrData = useMemo(() => {
    if (dashboardData) {
      const result: DeviceData[] = [];
      result.push({ key: 'Direct Scan', clicks: dashboardData?.qrCodes || 0 });
      result.push({
        key: 'From Custom Fallback Page',
        clicks: (dashboardData?.totalClicks || 0) - (dashboardData?.qrCodes || 0),
      });
      return result;
    }
    return [];
  }, [dashboardData]);

  if (links.length === 0) {
    return (
      <DefaultLinkScreen
        heading='Dashboard'
        descriptionHeading='Create your first link to get data'
        description="A hearty welcome to you! Your journey begins here. Let's fill this space with potential - add and optimize your first link now!"
      />
    );
  }

  return (
    <div className={styles.dashBoard}>
      <Box className={styles.dashboardMain}>
        <DashBoardHeader
          text='Dashboard'
          dates={dates}
          selectedValue={selectedValue}
          shortHandle={currentLink ? currentLink.shortHandle : null}
          handleSelectChange={handleSelectChange}
        />
        <Grid container marginTop={2} columnSpacing={{ xs: 1, sm: 2, md: 6 }} rowSpacing={1}>
          {dashboardStat.map((entry: IDashboardStat, index: number) => (
            <CountCard key={index} text={entry.text} count={entry.value} />
          ))}
        </Grid>
        <Grid container marginTop={1} rowSpacing={2} columnSpacing={3}>
          <Grid item md={8} sm={12} xs={12}>
            <Box className={styles.borderBox}>
              <Text text='Link Click Breakdown' className={styles.text} />
              <Box className={styles.chartBox}>
                <BarGrpah stats={clicksStat} />
              </Box>
              <ListButton
                setSelectedClicks={setSelectedClicks}
                data={[
                  { label: 'Clicks', icon: Link2Icon, value: 'statGraph' },
                  {
                    label: 'Unique Clicks',
                    icon: MousePointerIcon,
                    value: 'uniqueStatGraph',
                  },
                  // {
                  //   label: 'Devices',
                  //   icon: SmartPhoneIcon,
                  //   value: 'uniqueStatGraph',
                  // },
                  // { label: 'Channels', icon: ShrinkIcon, value: '' },
                ]}
              />
            </Box>
          </Grid>
          <Grid item md={4} sm={12} xs={12}>
            <VennChart
              text='Device / Channel'
              totalClicks={dashboardData?.totalClicks || 0}
              deviceData={dashboardData?.devicesData || []}
            />
          </Grid>
        </Grid>
        <Grid container marginTop={1} rowSpacing={2} columnSpacing={3}>
          <Grid item md={8} lg={8} sm={12} xs={12}>
            <DetailDeviceType heading='Detailed Device Type' data={dashboardData?.detailedDeviceType || []} />
          </Grid>
          <Grid item md={4} lg={4} sm={12} xs={12}>
            <VennChart text='QR Code Scans' totalClicks={dashboardData?.totalClicks || 0} deviceData={qrData} />
          </Grid>
        </Grid>
        <Grid container marginTop={1} rowSpacing={2} columnSpacing={3}>
          <Grid item md={6} lg={4} sm={12} xs={12}>
            <DashBoardTopStats heading='Top Groups' data={topCampaigns} />
          </Grid>
          <Grid item md={6} lg={4} sm={12} xs={12}>
            <DashBoardTopStats heading='Top Links' data={topLinks} />
          </Grid>
          <Grid item md={6} lg={4} sm={12} xs={12}>
            <DashBoardTopStats heading='Top Location' data={dashboardData?.topLocations.slice(0, 10)} />
          </Grid>
          <Grid item md={6} lg={4} sm={12} xs={12}>
            <AccountDetailCard
              title={'Account Details'}
              subTitle={'Germany'}
              clicksData={ClicksData}
              plan={`Current Plan: ${userActivePlan?.planName} (€ ${userActivePlan?.price} / ${userActivePlan?.planPeriod})`}
              paymentMethod={`Current Payment Method: ${capitalize(CardDetail?.card_type)} Card`}
              email={`Invoice goes to: ${user?.email}`}
            />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default DashboardMain;
