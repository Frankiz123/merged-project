import { GraphStat, StatCountry, VerifyLink } from '@utils/firebase-interfaces';
import { StatsData } from '@utils/firebase-interfaces/campaign';
import { axiosGet, axiosPost } from 'services/axios_get';

interface StatDateRange {
  stats: GraphStat[];
}

interface StatTopCountry {
  linkTopCountry: StatCountry;
}

export const getStatsByDateRange = async (id: string, startDate: string, endDate: string): Promise<GraphStat[]> => {
  const result = await axiosGet('/user/stats/link', {
    linkId: id,
    startDate,
    endDate,
  });

  if (result) {
    const data = result as unknown as StatDateRange;
    return data?.stats ?? [];
  }

  return [];
};

export const getLinkTopCountry = async (id: string): Promise<StatCountry> => {
  const result = await axiosGet(`/user/links/${id}`, {});
  if (result) {
    const data = result as unknown as StatTopCountry;
    return data?.linkTopCountry;
  }

  return { topCountry: '', flagCode: 'string' };
};

export const verfifyLink = async (url: string): Promise<VerifyLink> => {
  try {
    const result = (await axiosPost('/user/links/verify', {
      url,
    })) as unknown as VerifyLink;
    if (result) {
      return result;
    }
    return result;
  } catch (error) {
    return { isLive: false, titles: '' };
  }
};

export const getUserLinkStatsApi = async (userId: string): Promise<StatsData | null> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const results = (await axiosGet(`/user/links/stats/${userId}`, {})) as any;

  if (results && results.statsData) {
    const data = results.statsData as unknown as StatsData;
    return data;
  }
  return null;
};
