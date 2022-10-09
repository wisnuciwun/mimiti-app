import * as actionTypes from '../actionTypes'

const initState = {
     orderListData: [],
     phoneNumber: ''
}

const mainReducer = (state = initState, action) => {
     switch (action.type) {
          case actionTypes.SAVE_DAILY_DATA:
               return {
                    ...state,
                    orderListData: action.payload
               }
          case actionTypes.SAVE_PHONE_NUMBER:
               return {
                    ...state,
                    phoneNumber: action.payload
               }
          default:
               return state;
     }
}

export default mainReducer