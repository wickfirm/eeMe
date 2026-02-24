import React, {FC, useState} from 'react';
import Cookies from "js-cookie";
import Modal from "react-bootstrap/Modal";
import {
    INSTAGRAM_SOCIAL_MEDIA_ID,
    TIKTOK_SOCIAL_MEDIA_ID,
    YOUTUBE_SOCIAL_MEDIA_ID
} from "../../../helpers/crud-helper/consts";
import {nbFormatter} from "../../../helpers/crud-helper/functions";
import {useTranslation} from "react-i18next";



type Props = {
    socialData ?: any

}

const SocialStats: FC<Props> = ({socialData}) => {

    const currentLanguageCode = Cookies.get('i18next') || 'en'
    const {t} = useTranslation()
    return(
        <div className="row pt-30">
            {socialData?.length > 0 && socialData.map((talent_social: any) => (
                talent_social.social.id === INSTAGRAM_SOCIAL_MEDIA_ID ? (
                    <div className="col-md-4 pb-10" key={talent_social.id}>
                        <div key={talent_social.id} className="border-block h-200 ">
                            <div className="">
                                <label
                                    className="title-font-bold s-title pb-10">
                                    {t('instagram')}
                                </label>
                            </div>

                            <div className="d-flex justify-content-between">

                                <div className="">
                                    <div
                                        className="title-font-bold label label-xl label-light-info label-inline">
                                        {nbFormatter(talent_social.followers, 0)}</div>
                                    <div className="text-muted title-font-bold text-center fs-10">
                                        {t('followers')}
                                    </div>
                                </div>
                                <div className=" text-end">
                                    <div
                                        className="title-font-bold label label-xl label-light-danger label-inline">
                                        {nbFormatter(talent_social.avg_views, 0)}
                                    </div>
                                    <div className="text-muted title-font-bold text-center fs-10">
                                        {t('avgViews')}
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between pt-20">
                                <div className=" ">
                                    <div
                                        className="title-font-bold label label-xl label-light-warning label-inline">
                                        {talent_social.posts_count}
                                    </div>
                                    <div className="title-font-bold text-muted  text-center fs-10">
                                        {t('mediaCount')}
                                    </div>
                                </div>
                                {JSON.parse(talent_social?.talent_social_info?.info_response)?.edge_follow?.count &&
                                    <div className=" text-end">
                                        <div
                                            className="title-font-bold label label-xl label-light-success label-inline">
                                            {nbFormatter(JSON.parse(talent_social?.talent_social_info?.info_response)?.edge_follow?.count, 0)}

                                        </div>
                                        <div className="text-muted title-font-bold text-center fs-10">
                                            {t('following')}

                                        </div>
                                    </div>
                                }

                            </div>

                        </div>
                    </div>
                ) : talent_social.social.id === TIKTOK_SOCIAL_MEDIA_ID && talent_social.talent_social_info ? (
                    <div className="col-md-4 pb-10" key={talent_social.id}>
                        <div key={talent_social.id} className="border-block h-200">
                            <div className=" pb-10">
                                <label
                                    className="title-font-bold s-title font-weight-bolder">{t('tikTok')}</label>
                            </div>
                            <div className="d-flex justify-content-between">
                                <div className="">
                                    <div
                                        className="title-font-bold label label-xl label-light-info label-inline">
                                        {nbFormatter(JSON.parse(talent_social?.followers), 0)}</div>
                                    <div className="text-muted title-font-bold text-center fs-10">
                                        {t('followers')}
                                    </div>
                                </div>
                                {JSON.parse(talent_social?.talent_social_info?.info_response)?.user?.following &&
                                    <div className="text-end">
                                        <div
                                            className="title-font-bold label label-xl label-light-danger label-inline">
                                            {nbFormatter(JSON.parse(talent_social?.talent_social_info?.info_response)?.user?.following, 0)}
                                        </div>
                                        <div className="text-muted title-font-bold text-center fs-10">
                                            {t('following')}
                                        </div>
                                    </div>
                                }

                            </div>
                            <div className="d-flex justify-content-between pt-20">
                                <div className="">
                                    <div
                                        className="title-font-bold label label-xl label-light-warning label-inline">
                                        {nbFormatter(talent_social?.avg_likes, 0)}
                                    </div>
                                    <div className="text-muted title-font-bold text-center fs-10">
                                        {t('likes')}
                                    </div>
                                </div>
                                <div className="text-end">
                                    <div
                                        className="title-font-bold label label-xl label-light-success label-inline">
                                        {talent_social?.posts_count}
                                    </div>
                                    <div className="text-muted title-font-bold text-center fs-10">
                                        {t('videoCount')}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                ) : talent_social.social.id === YOUTUBE_SOCIAL_MEDIA_ID && talent_social.talent_social_info ? (
                        <div className="col-md-4 pb-10" key={talent_social.id}>
                            <div className="border-block h-200">
                                <div className="pb-10">
                                    <label
                                        className="title-font-bold s-title font-weight-bolder">{t('youTube')}</label>
                                </div>
                                <div className="d-flex justify-content-between">
                                    {talent_social?.talent_social_info?.info_response && JSON.parse(talent_social?.talent_social_info?.info_response)?.channel_info?.followers !== null ? (

                                        <div className="">
                                            <div
                                                className="title-font-bold label label-xl label-light-info label-inline">
                                                {nbFormatter(JSON.parse(talent_social?.talent_social_info?.info_response)?.channel_info?.followers, 0)}</div>
                                            <div
                                                className="text-muted title-font-bold text-center fs-10">
                                                {t('Followers')}
                                            </div>
                                        </div>
                                    ) : null}

                                    {talent_social?.talent_social_info?.info_response && JSON.parse(talent_social?.talent_social_info?.info_response)?.channel_info?.total_views !== null ? (
                                        <div className="text-end">
                                            <div
                                                className="title-font-bold label label-xl label-light-danger label-inline">
                                                {nbFormatter(JSON.parse(talent_social?.talent_social_info?.info_response)?.channel_info?.total_views, 0)}</div>

                                            <div
                                                className="text-muted title-font-bold text-center fs-10">
                                                {t('totalViews')}
                                            </div>
                                        </div>
                                    ) : null
                                    }
                                </div>

                            </div>
                        </div>
                    )
                    : null))}
        </div>

    );
}

export default SocialStats;