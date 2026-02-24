import React, {FC, useEffect, useState} from 'react';
import {t} from "i18next";
import {useTranslation} from "react-i18next";
import Cookies from "js-cookie";



type Props  = {
    filmography?: any;

}

const Filmography: FC<Props> = ({filmography } ) => {


    const currentLanguageCode = Cookies.get('i18next') || 'en'
    return(
        <div className="platforms pb-30 pt-30">
            <div className="container">
                <div className="row pb-75">
                    {filmography && filmography.total > 0 ? (
                        filmography.data.map((talent_filmography: any) => (
                            <div key={talent_filmography?.id}
                                 className="col-xxl-2 col-lg-2 col-md-3 col-sm-4 col-6 pt-5 pb-5 p-5">
                                <a
                                    href={currentLanguageCode === 'en' && talent_filmography.filmography && talent_filmography.filmography.slug && talent_filmography.filmography.slug.en ? '/en/filmography/title/' + talent_filmography.filmography?.slug.en : currentLanguageCode === 'ar' && talent_filmography.filmography.slug && talent_filmography.filmography.slug.ar ? '/ar/filmography/title/' + talent_filmography.filmography?.slug.ar : ""}
                                >
                                    <div className="img-container">
                                        <img src={`${talent_filmography?.filmography?.poster}`}
                                             className="w-100 bdr-tl bdr-tr"
                                             alt="Film Poster"
                                        />

                                        <div className="data-bg p-2 bdr-bl bdr-br">
                                            <div className="">
                                                <p className="text-font title-color mb-0">{
                                                    currentLanguageCode === 'en' ? talent_filmography?.filmography?.title?.en.replace(/(<([^>]+)>)/ig, '').substring(0, 12) :talent_filmography?.filmography?.title?.ar.replace(/(<([^>]+)>)/ig, '').substring(0, 12)}</p>
                                                <div className="fs-12">
                                                    {currentLanguageCode === 'en' ? talent_filmography?.role?.en : talent_filmography?.role?.ar }
                                                    {talent_filmography.filmography?.year ? (
                                                        '(' + talent_filmography?.filmography.year +')'
                                                    ) : null }


                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        ))
                    ) : null }


                </div>
            </div>
        </div>
    );
}
export default Filmography;