const fromDb = (db, dispatch) => {
  db.ref('/message').on('value', data => {
    if (data.val()) {
      dispatch({ type: 'SET_MESSAGE', payload: data.val() });
    }
  });
};