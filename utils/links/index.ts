import { MergeLink } from '@utils/firebase-interfaces';
import QRCode from 'qrcode';

export const getTitleFromLink = (iOSMobile: string, iOSTablet: string, androidMobile: string, androidTablet: string): string => {
  let title = '';
  if (iOSMobile) {
    if (iOSMobile.split('/app/').length > 1) {
      title = iOSMobile.split('/app/')[1];
      if (title.includes('/')) {
        title = title.split('/')[0].trim();
      }
    }
  }
  if (!title && iOSTablet) {
    if (iOSTablet.split('/app/').length > 1) {
      title = iOSTablet.split('/app/')[1];
      if (title.includes('/')) {
        title = title.split('/')[0].trim();
      }
    }
  }
  if (!title && androidMobile && androidMobile.includes('?id=')) {
    title = androidMobile.split('?id=')[1];
    if (title.includes('com')) {
      title = title.replace('com', '');
    }
  }
  if (!title && androidTablet && androidTablet.includes('?id=')) {
    title = androidTablet.split('?id=')[1];
    if (title.includes('com')) {
      title = title.replace('com', '');
    }
  }
  if (title && title.length > 0) {
    title = title.replace(/[^a-zA-Z ]/g, ' ').trim();
    title = title.charAt(0).toUpperCase() + title.slice(1);
  }
  return title;
};

export const getTitleFromWebUrl = (url: string): string => {
  url = url.replace(/^(https?:\/\/)?/, '');

  if (url.includes('?')) {
    url = url.split('?')[0];
  }

  // Amazon Link Case
  if (url.includes('amazon.')) {
    const urlparts = url.split('/');
    if (urlparts.length > 1) {
      return urlparts[1]?.replace(/\//g, ' ').replace(/-/g, ' ').trim();
    }
  }

  // Other Web Urls
  // Find the index of the first slash after the domain
  const slashIndex = url.indexOf('/');

  let remainingString = '';
  if (slashIndex !== -1) {
    // Return the substring starting from the first slash
    remainingString = url.substring(slashIndex);
  } else {
    // If there is no slash, return an empty string
    remainingString = '';
  }

  remainingString = remainingString.replace(/\//g, ' ').replace(/-/g, ' ').trim();
  return remainingString;
};

export const attachDomainAndUtm = (link: MergeLink): MergeLink => {
  if (process.env.NEXT_PUBLIC_WEB_ENV === 'prod') {
    if (link.domain === 'mrg.to') {
      link.shortUrl = `https://mrg.to/${link.shortHandle}`;
    }
  } else {
    link.shortUrl = `${process.env.NEXT_PUBLIC_DEV_SHORT_HANDLE}/${link.shortHandle}`;
  }
  if (link.shortUrl) {
    const utms = new Map();
    if (link.source) {
      utms.set('source', link.source);
    }
    if (link.medium) {
      utms.set('medium', link.medium);
    }
    if (link.campaign) {
      utms.set('campaign', link.campaign);
    }
    if (link.term) {
      utms.set('term', link.term);
    }
    if (link.content) {
      utms.set('content', link.content);
    }
    let count = 0;
    utms.forEach((key, value) => {
      if (count === 0) {
        link.shortUrl = `${link.shortUrl}?${value}=${key}`;
      } else {
        link.shortUrl = `${link.shortUrl}&${value}=${key}`;
      }
      count++;
    });
  }
  return link;
};

export const generateQRCode = async (url: string): Promise<string> => {
  try {
    // Generate the QR code image as a data URL
    if (url.includes('?')) {
      url = url + '&m=qr';
    } else {
      url = url + '?m=qr';
    }
    const qrCodeDataUrl = await QRCode.toDataURL(url);
    return qrCodeDataUrl;
  } catch (error) {
    return error;
  }
};

export const generateQRCodeSvg = async (url: string): Promise<string> => {
  try {
    // Generate the QR code image as a data URL
    if (url.includes('?')) {
      url = url + '&m=qr';
    } else {
      url = url + '?m=qr';
    }
    const qrCodeDataUrl = await QRCode.toString(url, { type: 'svg' });
    return qrCodeDataUrl;
  } catch (error) {
    return error;
  }
};
