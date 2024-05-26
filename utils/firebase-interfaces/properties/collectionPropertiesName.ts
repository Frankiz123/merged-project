import { MergeUser } from '../user';
import { MergeLink } from '../link';

export interface CollectionPropertiesName {
  USER: MergeUser;
  CAMPAIGN: MergedCampaignPropertiesName;
  LINKS: MergeLink;
}

export interface MergedCampaignPropertiesName {
  id: string;
  folderName: string;
  firstLink: string;
  optionalLink: string;
  createdAt: string;
}

export interface Link {
  name: string;
}
