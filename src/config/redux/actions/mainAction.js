import * as actionTypes from '../actionTypes'

export const saveDailyData = (data) => {
     return {
          type: actionTypes.SAVE_DAILY_DATA,
          payload: data
     }
}

export const savePhoneNumber = (data) => {
     return {
          type: actionTypes.SAVE_PHONE_NUMBER,
          payload: data
     }
}