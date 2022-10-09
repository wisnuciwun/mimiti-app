import * as actionTypes from '../actionTypes'

const initState = {
     orderListData: []
}

const mainReducer = (state = initState, action) => {
     switch (action.type) {
          case actionTypes.SAVE_DAILY_DATA:
               return {
                    ...state,
                    orderListData: action.payload
               }
          default:
               return state;
     }
}

export default mainReducer