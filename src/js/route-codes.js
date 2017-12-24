const publicPath = '/';
export const routeCodes = {
  LANDING: `${publicPath}`,
  REGISTER: `${publicPath}register`,
  FORGOT_PASSWORD: `${publicPath}forgot-password`,
  LOGIN: `${publicPath}login`,
  USER_DASHBOARD: `${publicPath}:userId/dashboard`,
  USER_PROFILE: `${publicPath}:userId/profile`,
  BAND_LIST: `${publicPath}:userId/bands`,
  BAND_PROFILE: `${publicPath}:userId/bands/:bandId`,
  BAND_DASHBOARD: `${publicPath}:userId/bands/:bandId/dashboard`,
  BAND_EDIT: `${publicPath}:userId/bands/:bandId/edit`,
  EVENT_LIST: `${publicPath}:userId/bands/:bandId/events`,
  EVENT_DETAILS: `${publicPath}:userId/bands/:bandId/events/:eventId/details`,
  EVENT_EDIT: `${publicPath}:userId/bands/:bandId/events/:eventId/edit`,
  NOT_FOUND: '*',
};
