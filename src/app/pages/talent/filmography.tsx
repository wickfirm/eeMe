import React, {Fragment, FC, useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import { useParams} from "react-router-dom";
import Cookies from "js-cookie";
import {Category} from "../../models/misc/Category";
import {AgencyPage} from "../../models/agency/AgencyPage";
import Header from "../../components/header";
import {
    BOOK_PAGE_ID,
    BUSINESS_ORDER_TYPE,
    CAMPAIGN_ORDER_TYPE,
    VIDEO_ORDER_TYPE
} from "../../helpers/crud-helper/consts";
import HTMLReactParser from "html-react-parser";
import BookHeader from "../../components/includes/talent/book/header";
import Footer from "../../components/footer";
import {Occasion} from "../../models/misc/Occasion";
import {Nav, Tab} from 'react-bootstrap';
import PersonalizedForm from "../../components/includes/talent/book/form/personalized";
import BusinessForm from "../../components/includes/talent/book/form/business";
import BriefForm from "../../components/includes/talent/book/form/brief";
import {bookTalent} from "../../core/book/requests";
import {Page} from "../../models/page/Page";
import {showFilmography} from "../../core/talent/requests";
import Loader from "../../components/includes/loader/loader";
import Page404 from "../404";



const FilmographyShow: FC = () => {
    const [showLoader, setShowLoader] = useState(true);
    const [filmography, setFilmography] = useState<any>();
    const [casting, setCasting] = useState<any>();

    const [page, setPage] = useState<Page | null>()
    const currentLanguageCode = Cookies.get('i18next') || 'en'
    const {t} = useTranslation()
    const params = useParams()
    const [error, setError] = useState(false);

    useEffect(() => {
        showFilmography(params.slug).then(response => {
            if(response.status === 200 ){
                setError(false)
                setFilmography(response.data.data.filmography)
                setCasting(response.data.data.casting)
                setShowLoader(false)
            }else{
                setError(true)
            }

        })



    }, [ t , showLoader])

    if(error){
        return (<Page404 />)
    }
    return (
        <Fragment >
            <Header    href={currentLanguageCode === 'en' && filmography && filmography.slug.en ? '/ar/filmography/title/' + filmography.slug.ar : currentLanguageCode === 'ar' && filmography && filmography.slug.ar ? '/en/filmography/title/' + filmography.slug.en : ""}/>

            <div className="header-block pt-100 pb-50">
                {showLoader && <Loader />}
                {filmography &&
                    <div className="container">
                        <div className="row justify-content-between">
                            <div className="col-lg-3 col-centered pt-20">
                                <div className="image-container">
                                    <img className="bdr-tl bdr-tr bdr-bl bdr-br w-100" src={filmography.poster}
                                         alt={filmography.title.en}/>
                                </div>
                            </div>
                            <div className="col-sm-8 pt-20">
                                <h1 className="title-font-bold title-color">
                                    {currentLanguageCode === 'en' ? filmography.title.en : filmography.title.ar}

                                </h1>

                                <div className=" mt-2">
                                    <p dangerouslySetInnerHTML={{__html: currentLanguageCode === 'en' ? filmography.description.en : filmography.description.ar}} />
                                </div>

                                {casting && casting.length > 0 &&

                                    <div className="talent-categories pt-20">
                                        <ul className="p-0 m-0"><span className={`title-font-bold inverse-color ${currentLanguageCode === 'en' ? 'me-2' : 'ms-2'}`}>
                                        {t('filmography.cast')} :
                                    </span>

                                            {casting.map((actor:any ) => (
                                                <li key={actor.id}>
                                                    {actor.talent_id !== null && actor.talent && actor.talent.is_published === 1 ?
                                                        <a className="text-main"
                                                           href={`/${currentLanguageCode}/talent/${currentLanguageCode === 'en'  && actor.talent.slug.en ? actor.talent.slug.en : currentLanguageCode === 'ar'  && actor.talent.slug.ar ? actor.talent.slug.ar : ""}`}>
                                                            {currentLanguageCode === 'en' ? actor.talent.user.name.en : actor.talent.user.name.ar }
                                                        </a>
                                                        :
                                                        <span className="">{  currentLanguageCode === 'en' ? actor.name.en : actor.name.ar}</span>

                                                    }

                                                </li>
                                                ))}
                                        </ul>


                                    </div>
                                }

                                {filmography.link &&
                                    <div className="col-md-12 pt-30">
                                        <div className="iframe-block">
                                            <iframe className="iframe-responsive" width="100%" src={filmography.link}
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen />
                                        </div>
                                    </div>
                                }


                            </div>
                        </div>
                    </div>
                }
            </div>
            <Footer/>
        </Fragment>
    );
}

export default FilmographyShow;




