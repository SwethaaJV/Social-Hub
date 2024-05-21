import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'; 
import { composeWithDevTools } from 'redux-devtools-extension';
import { DELETE_POST, PUBLISH_POST } from './actions';


const SET_POST_ID = 'SET_POST_ID';

export const setPostId = (postId) => ({
  type: SET_POST_ID,
  payload: postId,
});

const initialState = {
  postId: null,
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_POST_ID:
      return {
        ...state,
        postId: action.payload,
      };
    case DELETE_POST:
      return{
        ...state,
      };
    case PUBLISH_POST:
      return{
        ...state,
      };
    default:
      return state;
  }
};

const store = createStore(rootReducer,composeWithDevTools(applyMiddleware(thunk)));

export default store;
