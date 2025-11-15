export const migrateDeprecatedSettings = (state: any): any => {
  // The "last180Days" interval had a typo, with a lowercase d
  if (state.settings?.visits?.defaultInterval === 'last180days') {
    state.settings.visits.defaultInterval = 'last180Days';
  }

  return state;
};
