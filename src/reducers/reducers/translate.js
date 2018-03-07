import { LOAD } from 'redux-storage';

const initialState = {
  locale: 'ru'
};

export default function Intl(state = initialState, action) {
  switch (action.type) {
    case 'SET_LOCALE':
      return {
        ...state,
        locale: action.locale
      };
    case LOAD:
      if(action.payload.Intl) {
        return {
          locale: action.payload.Intl.locale
        };
      }
      return state;  
    default:
      return state;
  }
}