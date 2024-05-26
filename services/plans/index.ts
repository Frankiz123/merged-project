// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const valuesFilter = (arr: any[] | unknown[]): any[] => {
  const trueFeaturesSet = new Set<string>();
  return arr.map(plan => {
    const filteredFeature = plan.feature.filter(item => {
      if (item.value && trueFeaturesSet.has(item.key)) {
        return false;
      }

      if (item.value) {
        trueFeaturesSet.add(item.key);
      }
      return item.value;
    });

    return { ...plan, feature: filteredFeature };
  });
};
