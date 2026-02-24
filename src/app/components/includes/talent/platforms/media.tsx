import React, {FC, useEffect, useState} from 'react';
import {t} from "i18next";
import {useTranslation} from "react-i18next";
import {YOUTUBE_PLATFORM_EMBED_ID, YOUTUBE_PLATFORM_ID} from "../../../../helpers/crud-helper/consts";
import {formatPlatform} from "../../../../helpers/crud-helper/functions";
import Cookies from "js-cookie";


type Props  = {
    media?: any;

}

const Media: FC<Props> = ({media } ) => {
    const currentLanguageCode = Cookies.get('i18next') || 'en'
    const {t} = useTranslation()

    return(
        <div className="platforms pt-50 pb-50">
            <div className="container">
                <div className="row justify-content-center">
                    {media && media.total > 0 && media.data.map((platform: any) => (
                        platform.image !== null  ?
                            <div className="col-md-4 pb-15" key={platform?.id}>
                                <div className=" bdr-tlr bdr-tl bdr-tr">
                                    <div className="">
                                        <img className="w-100 bdr-tl bdr-tr"
                                             src={`${platform?.image}`} alt=""/>
                                    </div>
                                </div>
                                <div className="data-bg data-p bdr-bl bdr-br">
                                    <div
                                        className="title-font title-color mb-0 text-center">
                                        <div className='iframe'
                                             dangerouslySetInnerHTML={{__html: formatPlatform(platform)}}/>
                                    </div>
                                    <div className=" text-center">
                                        <p className="text-font text-color">
                                            <bdi>{currentLanguageCode === 'en' ? platform?.subtitle?.en : platform?.subtitle?.ar} </bdi>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            : <div className="col-md-4 pb-15"  key={platform?.id}>
                                <div className="">
                                    <div className='iframe'
                                         dangerouslySetInnerHTML={{__html: formatPlatform(platform)}}/> </div>
                                <div className="data-bg data-p bdr-bl bdr-br"
                                >
                                    <div className="">
                                        <p className="title-font title-color mb-0 text-center">
                                            <bdi>{currentLanguageCode === 'en' ? platform?.subtitle?.en : platform?.subtitle?.ar}</bdi>
                                        </p>

                                    </div>
                                </div>
                            </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
export default Media;