const publicPath = '/';
export const routeCodes = {
  LANDING: `${publicPath}`,
  REGISTER: `${publicPath}register/`,
  FORGOT_PASSWORD: `${publicPath}forgot-password`,
  LOGIN: `${publicPath}login`,
  USER_PROFILE: `${publicPath}:userId/profile`,
  BAND_LIST: `${publicPath}:userId/bands`,
  BAND_PROFILE: `${publicPath}:userId/bands/:bandId`,
  BAND_EDIT: `${publicPath}:userId/bands/:bandId/edit`,
  GIG_LIST: `${publicPath}:userId/bands/:bandId/gigs`,
  GIG_DETAILS: `${publicPath}:userId/bands/:bandId/gigs/:gigId/details`,
  GIG_EDIT: `${publicPath}:userId/bands/:bandId/gigs/:gigId/edit`,
  NOT_FOUND: '*',
};
