import React, {FC, useEffect, useState} from 'react';
import {BrowserRouter,Routes,  Route, useLocation, Router} from 'react-router-dom';
import  '../src/assets/sass/style.scss';
import Page404 from './app/pages/404';
import TalentIndexPage from './app/pages/talent/index';
import TalentPage from './app/pages/talent/show';
import TalentArticlePage from './app/pages/talent/article';
import CategoryIndexPage from './app/pages/category/index';
import {useSelector} from "react-redux";
import {RootState} from "./store";
import IndexPage from "./app/pages";
import OnBoardingPage from "./app/pages/onboarding";
import Homepage from "./app/pages/Homepage";
import BookPage from "./app/pages/talent/book";
import PaymentIndex from "./app/pages/payment";
import SubscriptionIndex from "./app/pages/payment/subscription";
import FilmographyShow from "./app/pages/talent/filmography";
import VideShowPage from "./app/pages/video";
import TalentTempPage from "./app/pages/talent/temp";
import BookTempPage from "./app/pages/talent/book-temp";
import TalentArticleTempPage from "./app/pages/talent/article-temp";
import ScrollToTop from "./app/helpers/crud-helper/scrollTop";


const App: FC = () => {
    const { theme } = useSelector((state: RootState) => state.theme);

    useEffect(() => {
        document.body.classList.remove('light','dark');
        document.body.classList.add(theme);

    }, [theme ])


    return (

      <div className={`body ${theme}`} data-theme={theme}>
          <BrowserRouter>
              <ScrollToTop />
              <Routes>

                  <Route path='/' element={<Homepage />} />
                  <Route path='/en' element={<Homepage />} />
                  <Route path='/ar' element={<Homepage />} />

                  <Route path='/payment/:status' element={<PaymentIndex />} />
                  <Route path='/en/payment/:status' element={<PaymentIndex />} />
                  <Route path='/ar/payment/:status' element={<PaymentIndex />} />

                  <Route path='/subscription/:status' element={<SubscriptionIndex />} />
                  <Route path='/en/subscription/:status' element={<SubscriptionIndex />} />
                  <Route path='/ar/subscription/:status' element={<SubscriptionIndex />} />

                  <Route path='/filmography/title/:slug' element={<FilmographyShow />} />
                  <Route path='/en/filmography/title/:slug' element={<FilmographyShow />} />
                  <Route path='/ar/filmography/title/:slug' element={<FilmographyShow />} />

                  <Route path='/:language/on-boarding' element={<OnBoardingPage />} />
                  <Route path='/on-boarding' element={<OnBoardingPage />} />

                  <Route path='/:language/preview/:code/video' element={<VideShowPage />} />
                  <Route path='/preview/:code/video' element={<VideShowPage />} />


                  <Route path='/:language/talent' element={<TalentIndexPage />} />
                  <Route path='/talent' element={<TalentIndexPage />} />

                  <Route path='/:language/talent/:talent' element={<TalentPage />} />
                  <Route path='/talent/:talent' element={<TalentPage />} />

                  <Route path='/:language/talent/:talent/book' element={<BookPage />} />
                  <Route path='/talent/:talent/book' element={<BookPage />} />

                  <Route path='/:language/talent/:talent/:article' element={<TalentArticlePage />} />
                  <Route path='/talent/:talent/:article' element={<TalentArticlePage />} />

                  <Route path='/:language/category/:category' element={<CategoryIndexPage />} />
                  <Route path='/category/:category' element={<CategoryIndexPage />} />

                  <Route path='/:language/talent-temp/:talent' element={<TalentTempPage />} />
                  <Route path='/talent-temp/:talent' element={<TalentTempPage />} />

                  <Route path='/:language/talent-temp/:talent/book' element={<BookTempPage/>} />
                  <Route path='/talent/:talent-temp/book' element={<BookTempPage />} />

                  <Route path='/:language/talent-temp/:talent/:article' element={<TalentArticleTempPage />} />
                  <Route path='/talent-temp/:talent/:article' element={<TalentArticleTempPage />} />


                  <Route path='/:language/:page' element={<IndexPage />} />
                  <Route path='/:page' element={<IndexPage />} />

                  <Route path='*' element={<Page404 />} />

              </Routes>
          </BrowserRouter>
      </div>


  );
}

export default App;
