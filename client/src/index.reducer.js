import { combineReducers } from 'redux';



const indexReducer = combineReducers({

});


const rootReducer = (state, action) => {
  if (action.type === 'USER_LOGOUT') {
    state = undefined
  }
  return indexReducer(state, action)
}

export default rootReducer;



