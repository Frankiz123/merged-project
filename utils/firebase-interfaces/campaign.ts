import { Timestamp } from 'firebase/firestore';

export interface CampaignLink {
  id: string;
  title: string;
}

export interface MergedCampaign {
  id: string;
  folderName: string;
  links: string[] | CampaignLink[];
  userId: string;
  createdAt: Timestamp; // | string;
  urls: string[];
  androidClicks: number;
  huaweiClicks: number;
  totalClicks: number;
  webClicks: number;
  iosClicks: number;
  flagCode: string;
  topCountry: string;
  webPercentage: string;
  iosPercentage: string;
  huaweiPercentage: string;
  androidPercentage: string;
}

export interface FirebaseDate {
  nanoseconds: number;
  seconds: number;
}

export interface StatsData {
  totalClicks: number;
  topCountry: string;
  androidPercentage?: string;
  iosPercentage?: string;
  flagCode?: string;
}

export interface GetUserCampaignsResult {
  campaigns: MergedCampaign[];
  statsData: StatsData;
}
