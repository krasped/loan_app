import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/app';
import store from './store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider} from 'notistack'; //component to send failer or sucsess message to user
import "../src/i18next";

ReactDOM.createRoot(document.getElementById('root')).render(
        <React.StrictMode>
          <Provider store={store}>
            <BrowserRouter>
              <SnackbarProvider maxSnack={3}>
                <Suspense fallback={<div>Loading...</div>}>
                  <App />
                </Suspense>
              </SnackbarProvider>
            </BrowserRouter>
          </Provider>
        </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

