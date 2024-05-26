import { Timestamp } from 'firebase/firestore';

export interface MergeLink {
  id: string;
  title: string;
  userId: string;
  domain: string;
  shortHandle: string;
  source: string;
  medium: string;
  campaign: string;
  term: string;
  content: string;
  utmTagPreview: string;
  iOSMobile: string;
  iOSTablet: string;
  androidMobile: string;
  androidTablet: string;
  huaweiMobile: string;
  huaweiTablet: string;
  customUrl: string;
  totalClicks: number;
  androidClicks: number;
  iOSClicks: number;
  huaweiClicks: number;
  webClicks: number;
  createdAt: Timestamp;
  webUrl: string;
  triggerWebUrlInBrowser: boolean;
  shortUrl: string;
  qrCodeUrl: string;
}

export interface VerifyLink {
  isLive: boolean;
  redirectUrl?: string;
  titles: string;
}
