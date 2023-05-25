// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';
// import 'mdb-react-ui-kit/dist/css/mdb.min.css'
// import { Provider } from 'react-redux';
// import { persistor, store } from './config/redux/persistConfig'
// import { PersistGate } from 'redux-persist/integration/react';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <Provider store={store}>
//   {/* <PersistGate persistor={persistor}> */}
//     <App />
//   {/* </PersistGate> */}
// </Provider>,
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import './index.css';
import rootReducer from '../src/config/redux/reducers/index';
import App from './App';
// import * as serviceWorker from './serviceWorker';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { store } from './config/redux/persistConfig';

// use applyMiddleware to add the thunk middleware to the store
// const store = createStore(rootReducer, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
