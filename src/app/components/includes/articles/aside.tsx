import React, { FC } from 'react';
import Cookies from "js-cookie";
import HTMLReactParser from "html-react-parser";
import {Link} from "react-router-dom";


type Props = {
  article ?: any
    talent ?: any
  link ?:any
}

const AsideArticle: FC<Props> = ({article , talent,link}) => {
  const currentLanguageCode = Cookies.get('i18next') || 'en'

  return(
      <div className="">
        <div className="row ">
          <div className="col-md-12 pb-25" key={article.id}>
            <div className="">
              <Link
                  to={`${currentLanguageCode === 'en' && talent ? '/en/' + link + '/' + talent?.slug?.en + '/' + article?.slug?.en
                      : currentLanguageCode === 'ar' && talent ?
                          '/ar/' + link + '/' + article?.slug?.ar + '/' + talent?.slug?.ar :
                          currentLanguageCode === 'en' ?
                              '/en/' + link + '/' + article?.talent?.slug?.en + '/' + article?.slug?.en
                              : currentLanguageCode === 'ar' ?
                                  '/ar/' + link + '/' + article?.slug?.ar + '/' + article?.talent?.slug?.ar : null
                  }`} className="">
                <img
                    className="bdr-tl bdr-tr aside-img w-100"
                    src={`${article?.image}`} alt={article?.talent?.user?.name.en}/>
              </Link>
              <div className="data-bg data-p bdr-br bdr-bl">
                <Link
                    to={`${currentLanguageCode === 'en' && talent ? '/en/' + link + '/' + talent?.slug?.en + '/' + article?.slug?.en
                        : currentLanguageCode === 'ar' && talent ?
                            '/ar/' + link + '/' + article?.slug?.ar + '/' + talent?.slug?.ar :
                            currentLanguageCode === 'en' ?
                                '/en/' + link + '/' + article?.talent?.slug?.en + '/' + article?.slug?.en
                                : currentLanguageCode === 'ar' ?
                                    '/ar/' + link + '/' + article?.slug?.ar + '/' + article?.talent?.slug?.ar : null
                    }`} className="title-color title-font-bold text-primary-hover fs-17 mb-2">
                  {article?.title && currentLanguageCode === 'en' ?

                      HTMLReactParser(article.title.en.replace(/(<([^>]+)>)/ig, '').substring(0, 40))+ '...'
                      :
                      article?.title && currentLanguageCode === 'ar' ?
                          HTMLReactParser(article.title.ar.replace(/(<([^>]+)>)/ig, '').substring(0, 40))+ '...'
                          :
                          null}
                </Link>
                <p className="text-color fs-14 mb-0 mt-3">
                  {article?.description && currentLanguageCode === 'en' ?
                      HTMLReactParser(article.description.en.replace(/(<([^>]+)>)/ig, '').substring(0, 200))+ '...'
                      :
                      article?.description && currentLanguageCode === 'ar' ?
                          HTMLReactParser(article.description.ar.replace(/(<([^>]+)>)/ig, '').substring(0, 200))+ '...'
                          :
                          null}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default AsideArticle;