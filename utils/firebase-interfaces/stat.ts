import { Timestamp } from 'firebase/firestore';

export interface GraphStat {
  name: string;
  clicks: number;
  androidClicks: number;
  iOSClicks: number;
  huaweiClicks: number;
  webClicks: number;
}

export interface Stat {
  city: string;
  continentCode: string;
  country: string;
  countryName: string;
  countryCode: string;
  createdAt: Timestamp;
  device: string;
  ip: string;
  linkId: string;
  model: string;
  platform: string;
  region: string;
  userAgent: string;
  userId: string;
  version: string;
  source: string;
  medium: string;
  campaign: string;
  term: string;
  content: string;
  topDeviceKey: string;
  deviceClickKey: string;
  qr: boolean;
  deviceName: string;
}

export interface StatCountry {
  topCountry: string;
  flagCode: string;
}
