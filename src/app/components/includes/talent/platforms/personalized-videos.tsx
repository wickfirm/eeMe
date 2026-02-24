import React, {FC, useEffect, useState} from 'react';
import {t} from "i18next";
import {useTranslation} from "react-i18next";
import {STORAGE_LINK, YOUTUBE_PLATFORM_EMBED_ID, YOUTUBE_PLATFORM_ID} from "../../../../helpers/crud-helper/consts";
import {formatPlatform} from "../../../../helpers/crud-helper/functions";
import {BigPlayButton, Player} from "video-react";
import Cookies from "js-cookie";
import {Link} from "react-router-dom";
import ReactPlayer from 'react-player';



type Props  = {
    videos?: any;
    talent ?: any;

}

const PersonalizedVideos: FC<Props> = ({videos , talent} ) => {
    const currentLanguageCode = Cookies.get('i18next') || 'en'
    const {t} = useTranslation()
    return(
        <div className="row pt-30">
            {videos && videos?.total > 0 && videos?.data.map((video: any) => (
                <div key={video.id}
                     className="col-xxl-2 col-lg-2 col-md-3 col-sm-4 col-6 pt-5 pb-5 p-5">
                    <div className="">
                        <div className="video-container ">
                            <div className="video-container bdr-tl bdr-tr">
                                {/*<ReactPlayer*/}
                                {/*    url={`${STORAGE_LINK}/${video?.video?.link}`}*/}
                                {/*    controls={true}*/}
                                {/*    light={`${STORAGE_LINK}/${video?.video?.poster}`}*/}
                                {/*    width="100%"*/}
                                {/*    height={'auto'}*/}

                                {/*/>*/}

                                <Player playsInline poster={`${STORAGE_LINK}/${video?.video?.poster}`} src={`${STORAGE_LINK}/${video?.video?.link}`} />
                            </div>
                        </div>
                        <div className="data-bg p-2 bdr-bl bdr-br">
                            <p className="title-color text-font font-weight-bold mb-0 ">{currentLanguageCode === 'en' ? talent?.user?.name?.en : talent?.user?.name?.ar }<span><i
                                className="far fa-check-circle  bg-primary text-white bdr-50 me-2 ms-2"></i></span>
                            </p>
                            {talent?.is_available && talent.talent_order_types.length > 0 ?
                                <Link className="text-primary font-weight-bold fs-12"
                                   to={currentLanguageCode === 'en' ? '/en/talent/'+ talent?.slug?.en + '/book' :'/ar/talent/'+ talent?.slug?.ar + '/book' }>{t('book')}</Link> : null}

                        </div>
                    </div>
                </div>
            ) )}
        </div>
    );
}
export default PersonalizedVideos;