import * as actionTypes from '../actionTypes'

export const saveDailyData = (data) => {
     return {
          type: actionTypes.SAVE_DAILY_DATA,
          payload: data
     }
}
