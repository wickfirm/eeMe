import React, { Suspense } from 'react';
import "bootstrap/dist/js/bootstrap.bundle.min";
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './store';
import { createRoot } from 'react-dom/client';
import i18n from "i18next";
import 'bootstrap/dist/js/bootstrap.js'
import {  initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(HttpApi)
    .init({

        supportedLngs: ['en' , 'ar'],
        fallbackLng: "en",
        detection :{
            order: ['path', 'cookie', 'htmlTag'],
            caches: ['cookie']

        } ,
        backend : {
            loadPath: '/assets/locales/{{lng}}/translation.json',
        }
    });



const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
    <Suspense >
        <React.Fragment>
            <Provider store={store}>
                <App/>
            </Provider>
        </React.Fragment>
    </Suspense>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
