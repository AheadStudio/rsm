import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import translations from './translations';
import thunk from "redux-thunk";
import * as storage from "redux-storage";
import createEngine from "redux-storage-engine-localstorage";
import registerServiceWorker from "./registerServiceWorker";
import { Provider } from "react-redux";
import { IntlProvider } from 'react-redux-multilingual';
import { composeWithDevTools } from "redux-devtools-extension";
import { createStore, applyMiddleware } from "redux";
import filter from 'redux-storage-decorator-filter';
import Reducers from "./reducers";
const reducer = storage.reducer(Reducers);
const storage_key = "rsm-agrotronic";
let engine = createEngine(storage_key);
engine = filter(engine, [
  'whitelisted-key',
  ["user"],
  ["sidebar"],
  ["geoZone"]
], []);
const middleware = [thunk, storage.createMiddleware(engine)];
const store = createStore(reducer, composeWithDevTools(applyMiddleware(...middleware)));
const load = storage.createLoader(engine);
load(store);

ReactDOM.render(
  <Provider store={store}>
    <IntlProvider translations={translations} locale="ru">
      <App />
    </IntlProvider>
  </Provider>
  , document.getElementById("root")
);
registerServiceWorker();
