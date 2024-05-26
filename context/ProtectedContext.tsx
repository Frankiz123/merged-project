import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import moment from 'moment';

import { CardDetails, MergeLink, MergedCampaign } from '@utils/firebase-interfaces';
import { useAuth } from './AuthContext';
import { getUserCampaignsApi } from 'services/campaigns';
import { getDashboardLinkClicksData, getUserLinks, whereUserId } from '@utils/firebase-methods/database';
import { db } from '@config/firebase';
import { useRouter } from 'next/router';
import { GetUserCampaignsResult, StatsData } from '@utils/firebase-interfaces/campaign';
import { getUserLinkStatsApi } from 'services/links';
import { COLLECTION_NAME } from '@utils/FirebaseConstants';

interface ProtectedContextProviderInterface {
  children: React.ReactNode;
}

interface ProtectedContextInterface {
  openModal: boolean;
  loading: boolean;
  isAllowedLinks: boolean;
  links: MergeLink[];
  campaigns: MergedCampaign[];
  allCampaignsStats: StatsData;
  allLinksStats: StatsData;
  currentTab: string;
  CardDetail: CardDetails;
  linksCount: number;
  linksClicksCount: number;
  handleModal: () => void;
  setMergeLinks: (links: MergeLink[]) => void;
  setLoading: (loading: boolean) => void;
  reloadCampaigns: () => Promise<void>;
  reloadLinks: () => Promise<void>;
  handleCurrentTab: (name: string) => void;
  reloadCardDetails: () => Promise<void>;
}

const ProtectedContext = createContext<ProtectedContextInterface>({
  openModal: false,
  loading: false,
  isAllowedLinks: false,
  links: [],
  currentTab: '',
  linksCount: 0,
  linksClicksCount: 0,
  handleModal: () => {},
  setMergeLinks: (_links: MergeLink[]) => {},
  setLoading: (_loading: boolean) => {},
  campaigns: [],
  allCampaignsStats: {
    totalClicks: 0,
    androidPercentage: '',
    iosPercentage: '',
    topCountry: '',
    flagCode: '',
  },
  allLinksStats: {
    totalClicks: 0,
    androidPercentage: '',
    iosPercentage: '',
    topCountry: '',
    flagCode: '',
  },
  CardDetail: {
    card_type: '',
    expiry_date: '',
    id: '',
    last_four_digits: '',
    payment_method: '',
    subscription_id: '',
    paddle_user_id: '',
  },
  reloadCampaigns: async () => {},
  reloadLinks: async () => {
    await Promise.reject(new Error('function implementation not found'));
  },
  handleCurrentTab: (_name: string) => {},
  reloadCardDetails: async () => {
    await Promise.reject(new Error('function implementation not found'));
  },
});

export const useProtected = (): ProtectedContextInterface => useContext<ProtectedContextInterface>(ProtectedContext);

export const ProtectedContextProvider: React.FC<ProtectedContextProviderInterface> = ({ children }) => {
  const route = useRouter();
  const { user, userPlan, userActivePlan } = useAuth();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [loading, setDataLoading] = useState<boolean>(true);
  const [linkCount, setLinkCount] = useState<number>(0);
  const [linkClicksCount, setLinksClicksCount] = useState<number>(0);
  const [links, setLinks] = useState<MergeLink[]>([]);
  const [campaigns, setCampaigns] = useState<MergedCampaign[]>([]);
  const [cardDetail, setCardDetail] = useState<CardDetails>({
    card_type: '',
    expiry_date: '',
    id: '',
    last_four_digits: '',
    payment_method: '',
    subscription_id: '',
    paddle_user_id: '',
  });
  const [allCampaignsStats, setAllCampaignsStats] = useState<StatsData>({
    totalClicks: 0,
    androidPercentage: '',
    iosPercentage: '',
    topCountry: '',
    flagCode: '',
  });
  const [allLinksStats, setAllLinksStats] = useState<StatsData>({
    totalClicks: 0,
    androidPercentage: '',
    iosPercentage: '',
    topCountry: '',
    flagCode: '',
  });
  const [currentTab, setCurrentTab] = useState('Account');

  const loadData = async (): Promise<void> => {
    try {
      setLoading(true);
      await Promise.all([loadCampaigns(), loadLinks(), loadLinkStats()]);
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (route?.pathname?.includes('dashboard')) {
      void loadData();
      void loadLinksClicks();
    }
  }, [route]);

  useEffect(() => {
    void loadData();
  }, [user]);

  useEffect(() => {
    if (!cardDetail || !cardDetail.card_type) {
      void loadCardDetail();
    }
  }, [cardDetail]);

  const loadCampaigns = async (): Promise<void> => {
    if (user) {
      try {
        const data: GetUserCampaignsResult | null = await getUserCampaignsApi(user.id);
        if (data) {
          setCampaigns(data.campaigns);
          setAllCampaignsStats(data.statsData);
        }
        setCampaigns(data?.campaigns ?? []);
      } catch (e) {}
    }
  };

  const loadLinkStats = async (): Promise<void> => {
    if (user) {
      try {
        const data: StatsData | null = await getUserLinkStatsApi(user.id);
        if (data) {
          setAllLinksStats(data);
        }
      } catch (e) {}
    }
  };

  const loadLinks = async (): Promise<void> => {
    if (user) {
      try {
        const data = await getUserLinks(db, user.id);
        setMergeLinks(data);
      } catch (e) {}
    }
  };

  const loadCardDetail = async (): Promise<void> => {
    whereUserId(db, COLLECTION_NAME.cardDetails, userPlan?.paddle_user_id ?? '', 'paddle_user_id')
      .then(res => {
        res?.forEach(v => {
          setCardDetail(v.data() as CardDetails);
        });
      })
      .catch(e => e);
  };

  const loadLinksClicks = async (): Promise<void> => {
    let startDate = '';
    let endDate = '';
    if (userPlan?.currentBillingStarts) {
      const milliseconds = userPlan?.currentBillingStarts?.seconds * 1000 + userPlan?.currentBillingStarts?.nanoseconds / 1000000;

      const date = moment(milliseconds);
      startDate = date.format('YYYY-MM-DD');
    }
    if (userPlan?.currentBillingEnds) {
      const milliseconds = userPlan?.currentBillingEnds?.seconds * 1000 + userPlan?.currentBillingEnds?.nanoseconds / 1000000;

      const date = moment(milliseconds);
      endDate = date.format('YYYY-MM-DD');
    }

    const linksCLicks = await getDashboardLinkClicksData(user?.id ?? '0', startDate, endDate);
    setLinksClicksCount(linksCLicks);
  };

  const handleModal = (): void => {
    setOpenModal(value => !value);
  };

  const setLoading = (loading: boolean): void => {
    setDataLoading(loading);
  };

  const setMergeLinks = (linksArray: MergeLink[]): void => {
    setLinks(linksArray);
  };

  const handleCurrentTab = (name: string): void => {
    setCurrentTab(name);
  };

  const isAllowedLinks = useMemo(() => {
    if (user && userPlan && userActivePlan && links && Array.isArray(links)) {
      const cycleStarts = moment(userPlan?.cycleCreatedAt.seconds * 1000);
      const cycleEnds = moment(userPlan?.cycleEndedAt.seconds * 1000);
      const thisMonthLinks: MergeLink[] = links.filter(link => {
        const linkTime = moment(link.createdAt.seconds * 1000);
        return linkTime.isBetween(cycleStarts, cycleEnds);
      });
      setLinkCount(thisMonthLinks.length);
      if (thisMonthLinks.length >= userActivePlan?.numberOfLinks) {
        return false;
      }
      return true;
    }
    return false;
  }, [links, user, userPlan, userActivePlan]);

  return (
    <ProtectedContext.Provider
      value={{
        isAllowedLinks,
        openModal,
        loading,
        links,
        campaigns,
        allCampaignsStats,
        allLinksStats,
        currentTab,
        CardDetail: cardDetail,
        linksCount: linkCount,
        linksClicksCount: linkClicksCount,
        handleModal,
        setLoading,
        setMergeLinks,
        reloadCampaigns: loadCampaigns,
        reloadLinks: loadLinks,
        handleCurrentTab,
        reloadCardDetails: loadCardDetail,
      }}>
      {children}
    </ProtectedContext.Provider>
  );
};
