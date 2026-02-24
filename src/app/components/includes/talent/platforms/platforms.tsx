import React, { FC } from 'react';
import Cookies from "js-cookie";
import {
    COLLABS,
    FILMOGRAPHY, IN_THE_MEDIA,
    IN_THE_SPOT, STORAGE_LINK, TALENT_SOCIAL, TALENT_VIDEOS,
    YOUTUBE_PLATFORM_EMBED_ID,
    YOUTUBE_PLATFORM_ID
} from "../../../../helpers/crud-helper/consts";
import {Player} from "video-react";
import {useTranslation} from "react-i18next";
import {InstagramEmbed, TikTokEmbed} from "react-social-media-embed";
import Filmography from "./filmography";
import Spot from "./spot";
import Media from "./media";
import PersonalizedVideos from "./personalized-videos";
import Collabs from "./collabs";

type Props = {
    firstItem ?: any
    items ?: any
    talent ?: any

}

const Platform: FC<Props> = ({firstItem , items  , talent}) => {

    const currentLanguageCode = Cookies.get('i18next') || 'en'
    const {t} = useTranslation()
    return(
        <div>
            {firstItem === IN_THE_SPOT ? (
                <Spot spot={items} />

            ) : firstItem === FILMOGRAPHY ?
                <Filmography filmography={items} />

                : firstItem === IN_THE_MEDIA ?

                    <Media media={items} />

                    :  firstItem === TALENT_SOCIAL ?
                        <div className="container pl-0 align-items-end pb-50">
                            <div className="row">
                                {items && items[0]  && items[0]?.total > 0 ? (
                                    <div className="col-md-12">
                                        <div className="pb-10">
                                            <h4 className="title-font title-color font-weight-bold">{t('instagram')}</h4>
                                        </div>
                                    </div>
                                ) : ( null ) }

                                { items && items[0] &&  items[0]?.data.map ((post: any) => (
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
                                {items && items[1] && items[1]?.total > 0 ? (
                                    <div className="col-md-12">
                                        <div className="pb-10">
                                            <h4 className="title-font title-color font-weight-bold">{t('tikTok')}</h4>
                                        </div>
                                    </div>
                                ) : ( null ) }

                                { items && items[1] && items[1].total > 0 &&  items[1]?.data.map ((post: any) => (
                                    <div className="col-md-4 pb-10" key={post?.id}>
                                        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }} >
                                            <TikTokEmbed url={`https://www.tiktok.com/@${post?.talent_social?.user_name}/video/${post.p_id}`} key={post.p_id}  />
                                            <div dangerouslySetInnerHTML={{__html: "<script async src ='https://www.tiktok.com/embed.js'></script>"}}/>
                                        </div>


                                    </div>
                                ))}





                            </div>
                            <div className="row">
                                {items && items[2] &&  items[2]?.total > 0 ? (
                                    <div className="col-md-12">
                                        <div className="pb-10">
                                            <h4 className="title-font title-color font-weight-bold">{t('youTube')}</h4>
                                        </div>
                                    </div>
                                ) : ( null ) }

                                {items && items[2] &&  items[2]?.data.map ((post: any) => (
                                    <div className="col-md-4 pb-10 pt-10"  key={post?.id}>

                                        <div className=''>
                                            <div dangerouslySetInnerHTML={{__html:'<div style = "left: 0; width: 100%;height: 290px;  position: relative;"><iframe src = "https://www.youtube.com/embed/'+post.p_id +'" style = "border: 0; top: 0; left: 0; width: 100%; height: 100%; " allowfullscreen scrolling = "no" allow = "encrypted-media"></iframe>' }} />
                                        </div>

                                    </div>
                                ))}
                            </div>
                        </div>

                        :  firstItem === TALENT_VIDEOS ?

                            <PersonalizedVideos videos={items} talent={talent} />

                        :  firstItem === COLLABS  ?
                                <Collabs  collabs={items}/>
                                :null}

        </div>

    );
}

export default Platform;