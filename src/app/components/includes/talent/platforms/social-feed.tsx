import React, {FC, useEffect, useState} from 'react';
import {t} from "i18next";
import {useTranslation} from "react-i18next";
import {YOUTUBE_PLATFORM_EMBED_ID, YOUTUBE_PLATFORM_ID} from "../../../../helpers/crud-helper/consts";
import {formatPlatform} from "../../../../helpers/crud-helper/functions";
import Cookies from "js-cookie";
import {InstagramEmbed, TikTokEmbed} from "react-social-media-embed";


type Props  = {
    socialFeed?: any;

}

const SocialFeed: FC<Props> = ({socialFeed } ) => {
    const currentLanguageCode = Cookies.get('i18next') || 'en'
    const {t} = useTranslation()

    return(
        <div className="container pl-0 align-items-end pb-50 pt-30">
            <div className="row">
                {socialFeed && socialFeed[0]  && socialFeed[0]?.total > 0 ? (
                    <div className="col-md-12">
                        <div className="pb-10 ">
                            <h4 className="title-font title-color font-weight-bold">{t('instagram')}</h4>
                        </div>
                    </div>
                ) : ( null ) }

                { socialFeed && socialFeed[0] &&  socialFeed[0]?.data.map ((post: any) => (
                    <div className="col-md-4 pb-10" key={post?.id}>
                        <div style={{ position: 'relative', width: "100%" }} >
                            <div style={{ display: 'flex', justifyContent: 'center', width: "100%" }}>
                                <InstagramEmbed url={`https://www.instagram.com/p/${post.p_id}`}   captioned   key={post.p_id}/>
                            </div>
                        </div>

                    </div>
                ))}


            </div>
            <div className="row">
                {socialFeed && socialFeed[1] && socialFeed[1]?.total > 0 ? (
                    <div className="col-md-12">
                        <div className="pb-10 pt-20">
                            <h4 className="title-font title-color font-weight-bold">{t('tikTok')}</h4>
                        </div>
                    </div>
                ) : ( null ) }

                { socialFeed && socialFeed[1] && socialFeed[1].total > 0 &&  socialFeed[1]?.data.map ((post: any) => (
                    <div className="col-md-4 pb-10" key={post?.id}>
                        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }} >
                            <TikTokEmbed url={`https://www.tiktok.com/@${post?.talent_social?.user_name}/video/${post.p_id}`} key={post.p_id}  />
                            <div dangerouslySetInnerHTML={{__html: "<script async src ='https://www.tiktok.com/embed.js'></script>"}}/>
                        </div>


                    </div>
                ))}


            </div>
            <div className="row">
                {socialFeed && socialFeed[2] &&  socialFeed[2]?.total > 0 ? (
                    <div className="col-md-12">
                        <div className="pb-10 pt-20">
                            <h4 className="title-font title-color font-weight-bold">{t('youTube')}</h4>
                        </div>
                    </div>
                ) : ( null ) }

                {socialFeed && socialFeed[2] &&  socialFeed[2]?.data.map ((post: any) => (
                    <div className="col-md-4 pb-10 pt-10"  key={post?.id}>

                        <div className=''>
                            <div dangerouslySetInnerHTML={{__html:'<div style = "left: 0; width: 100%;height: 290px;  position: relative;"><iframe src = "https://www.youtube.com/embed/'+post.p_id +'" style = "border: 0; top: 0; left: 0; width: 100%; height: 100%; " allowfullscreen scrolling = "no" allow = "encrypted-media"></iframe>' }} />
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}
export default SocialFeed;