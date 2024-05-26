export const toCapitalize = (str: string): string => {
  if (!str) {
    return '';
  }
  if (str.trim().toLowerCase() === 'iphone') {
    return 'iPhone';
  }
  if (str.trim().toLowerCase() === 'ios') {
    return 'iOS';
  }
  return str.replace(/\b\w/g, match => match.toUpperCase());
};
