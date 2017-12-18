const actionTypes = {
  GetGigRequested: 'GET_GIGS_REQUESTED',
  GetGigRejected: 'GET_GIGS_REJECTED',
  GetGigFulfilled: 'GET_GIGS_FULFILLED',

  CreateGigRequested: 'CREATE_GIGS_REQUESTED',
  CreateGigRejected: 'CREATE_GIGS_REJECTED',
  CreateGigFulfilled: 'CREATE_GIGS_FULFILLED',

  DeleteGigRequested: 'DELETE_GIGS_REQUESTED',
  DeleteGigRejected: 'DELETE_GIGS_REJECTED',
  DeleteGigFulfilled: 'DELETE_GIGS_FULFILLED',

  RestoreGigRequested: 'RESTORE_GIGS_REQUESTED',
  RestoreGigRejected: 'RESTORE_GIGS_REJECTED',
  RestoreGigFulfilled: 'RESTORE_GIGS_FULFILLED',

  DismissNotification: 'DISMISS_NOTIFICATION',

};

export default actionTypes;