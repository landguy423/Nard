import * as types from './actionTypes';

const initialState = {
  error: null,
  data: null,
  loading: false,
};

export default function services(state = initialState, action = {}) {
  switch (action.type) {
    /**************************/
    /* Update profile data
    /**************************/
    case types.GET_SERVICES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        data: null,
      };
    case types.GET_SERVICES_SUCCESS:
      if (action.result.data.data) {
        return {
          ...state,
          loading: false,
          data: action.result.data,
        };  
      }
      else if (action.result.data.error.code === "invalid_token") {
        return {
          ...state,
          loading: false,
          data: "token_failed",
        };
      }
    case types.GET_SERVICES_FAILED:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case types.INITIAL_STORE:
      return {
        ...state,
        data: null,
      }
    default:
      return state;
  }
}