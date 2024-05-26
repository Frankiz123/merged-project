import { GraphStat } from '@utils/firebase-interfaces';
import { GetUserCampaignsResult } from '@utils/firebase-interfaces/campaign';
import { axiosGet } from 'services/axios_get';

interface StatDateRange {
  stats: GraphStat[];
}

export const getCampaignStatsByDateRange = async (id: string, startDate: string, endDate: string): Promise<GraphStat[]> => {
  const result = await axiosGet('/user/stats/campaign', {
    campaignId: id,
    startDate,
    endDate,
  });

  if (result) {
    const data = result as unknown as StatDateRange;
    return data?.stats ?? [];
  }

  return [];
};

export const getUserCampaignsApi = async (userId: string): Promise<GetUserCampaignsResult | null> => {
  const results = await axiosGet(`/user/campaigns/${userId}`, {});

  if (results) {
    const data = results as unknown as GetUserCampaignsResult;
    return data;
  }
  return null;
};
