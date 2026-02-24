import React, {FC, useEffect, useState} from 'react';
import {t} from "i18next";
import {useTranslation} from "react-i18next";
import {YOUTUBE_PLATFORM_EMBED_ID, YOUTUBE_PLATFORM_ID} from "../../../../helpers/crud-helper/consts";
import {formatPlatform} from "../../../../helpers/crud-helper/functions";


type Props  = {
    spot?: any;

}

const Spot: FC<Props> = ({spot } ) => {
    return(
        <div className="platforms align-items-center">
            <div className="container">
                <div className="platform-container">
                    <div className="row pb-5 d-flex align-items-center">

                        {spot && spot.total > 0 && spot?.data.map((platform: any) => (
                            platform.platform_embed_id === YOUTUBE_PLATFORM_EMBED_ID && platform.platform_id === YOUTUBE_PLATFORM_ID ? (
                                <div className="col-md-6"  key={platform.id}>
                                    <div className='iframe' dangerouslySetInnerHTML={{__html: "<div class='pt-20 pb-20 text-center'><div id='___ytsubscribe_0'><iframe  frameBorder='0' id='I0_1612457237700' name='I0_1612457237700' src='https://www.youtube.com/subscribe_embed?usegapi=1&amp;channelid="+platform?.link+"&amp;layout=full&amp;theme=dark&amp;count=hidden&amp;origin=http%3A%2F%2Fomneeyat-website.test&amp;gsrc=3p&amp;ic=1&amp;jsh=m%3B%2F_%2Fscs%2Fapps-static%2F_%2Fjs%2Fk%3Doz.gapi.en_US.3k1wIje1lec.O%2Fam%3DwQE%2Fd%3D1%2Fct%3Dzgms%2Frs%3DAGLTcCNT4ir0QEJ6sXXAMZvqjav9vQSaLw%2Fm%3D__features__#_methods=onPlusOne%2C_ready%2C_close%2C_open%2C_resizeMe%2C_renderstart%2Concircled%2Cdrefresh%2Cerefresh%2Conload&amp;id=I0_1612457237700&amp;_gfid=I0_1612457237700&amp;parent=http%3A%2F%2Fomneeyat-website.test&amp;pfname=&amp;rpctoken=30542906'></iframe></div></div>    <script src = 'https://apis.google.com/js/platform.js'></script>"}}/>
                                </div>
                            ) : (
                                <div className="col-md-6"  key={platform.id}>
                                    <div className="pt-20 pb-20 w-100">
                                        <div className='iframe' dangerouslySetInnerHTML={{__html: formatPlatform(platform)}}/>
                                    </div>
                                </div>
                            ))
                        )}


                    </div>
                </div>
            </div>
        </div>
    );
}
export default Spot;