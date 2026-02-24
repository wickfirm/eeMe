import React, { FC } from 'react';
import Cookies from "js-cookie";
import HTMLReactParser from "html-react-parser";
import {Link} from "react-router-dom";



type Props = {
    article ?: any
    colMd3 ?: boolean
    talent ?: any
    link ?:any
}

const VerticalArticle: FC<Props> = ({article , colMd3,talent , link}) => {

    const currentLanguageCode = Cookies.get('i18next') || 'en'
    return (

        <div className={`${colMd3 ? 'col-lg-3  p-5' : 'col-lg-4 col-md-12  p-5'}`} key={article.id}>

                    <div className={''}>
                        <Link to={`${currentLanguageCode === 'en' && talent ? '/en/'+link+'/' + talent?.slug?.en + '/' + article?.slug?.en
                            : currentLanguageCode === 'ar' && talent ?
                                '/ar/'+link+'/' + article?.slug?.ar + '/' + talent?.slug?.ar :
                                currentLanguageCode === 'en' ?
                                    '/en/'+link+'/' + article?.talent?.slug?.en + '/' + article?.slug?.en
                                    :   currentLanguageCode === 'ar' ?
                                        '/ar/'+link+'/' + article?.slug?.ar + '/' + article?.talent?.slug?.ar : null}`}><img
                            className="bdr-tl bdr-tr  w-100"
                            src={`${article?.image}`} alt={article?.talent?.user?.name.en} /></Link>
                    </div>

                    <div className="data-bg data-p bdr-br bdr-bl">
                        <Link to={`${currentLanguageCode === 'en' && talent ? '/en/'+link+'/' + talent?.slug?.en + '/' + article?.slug?.en
                            : currentLanguageCode === 'ar' && talent ?
                                '/ar/'+link+'/' + article?.slug?.ar + '/' + talent?.slug?.ar :
                                currentLanguageCode === 'en' ?
                                    '/en/'+link+'/' + article?.talent?.slug?.en + '/' + article?.slug?.en
                                    :   currentLanguageCode === 'ar' ?
                                        '/ar/'+link+'/' + article?.slug?.ar + '/' + article?.talent?.slug?.ar : null
                        }`} className="title-color title-font-bold text-primary-hover fs-17 mb-2"

                        >
                            {article?.title && currentLanguageCode === 'en' ?
                                HTMLReactParser(article.title.en.replace(/(<([^>]+)>)/ig, '').substring(0, 40))+ '...'
                                :
                                article?.title && currentLanguageCode === 'ar' ?
                                    HTMLReactParser(article.title.ar.replace(/(<([^>]+)>)/ig, '').substring(0, 40))+ '...'
                                    :
                                    null}       </Link>

                        <p className="text-color fs-14 mb-0 mt-3">
                            {article?.description && currentLanguageCode === 'en' ?
                                HTMLReactParser(article.description.en.replace(/(<([^>]+)>)/ig, '').substring(0, 280))+ '...'
                                :
                                article?.description && currentLanguageCode === 'ar' ?
                                    HTMLReactParser(article.description.ar.replace(/(<([^>]+)>)/ig, '').substring(0, 280))+ '...'
                                    :
                                    null}
                        </p>
                    </div>
                </div>


    );
}

export default VerticalArticle;