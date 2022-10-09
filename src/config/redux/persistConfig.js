import { applyMiddleware, compose, createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import thunk from 'redux-thunk'
import rootReducer from './reducers'
 
const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['main'],
  blacklist: []
}
 
const persistedReducer = persistReducer(persistConfig, rootReducer)
export let store = createStore(persistedReducer, compose(applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__ () : f => f));
export let persistor = persistStore(store)