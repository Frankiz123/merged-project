import { GraphStat } from '@utils/firebase-interfaces';
import { AxiosResponse } from 'axios';
import { axiosGet } from 'services/axios_get';

export interface DeviceData {
  key: string;
  clicks: number;
}

export interface TopLocation {
  name: string;
  count: number;
  flagCode: string;
}

export interface DetailDeviceType {
  name: string;
  count: number;
  percentage: string;
  type: string;
}

export interface DashboardResponse {
  success: boolean;
  topChannel: string;
  topDevice: string;
  totalClicks: number;
  qrCodes: number;
  uniqueClicks: number;
  devicesData: DeviceData[];
  statGraph: GraphStat[];
  uniqueStatGraph: GraphStat[];
  topLocations: TopLocation[];
  detailedDeviceType: DetailDeviceType[];
}

export const getDashboardData = async (
  userId: string,
  startDate: string,
  endDate: string,
  linkId?: string
): Promise<DashboardResponse | null> => {
  let result: AxiosResponse<unknown, unknown> | null = null;
  if (linkId) {
    result = await axiosGet(`/user/dashboard/${userId}`, {
      startDate,
      endDate,
      linkId,
    });
  } else {
    result = await axiosGet(`/user/dashboard/${userId}`, {
      startDate,
      endDate,
    });
  }

  if (result) {
    const data = result as unknown as DashboardResponse;
    return data;
  }

  return null;
};
