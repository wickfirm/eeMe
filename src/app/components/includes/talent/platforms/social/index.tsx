import React, {FC} from 'react';
import {nbFormatter} from "../../../../../helpers/crud-helper/functions";
import {t} from "i18next";
import {INSTAGRAM_SOCIAL_MEDIA_ID, YOUTUBE_SOCIAL_MEDIA_ID} from "../../../../../helpers/crud-helper/consts";
import {LineChart} from "../../../../apexchart/line";
import {PieChart} from "../../../../apexchart/pie";
import {BarChart} from "../../../../apexchart/bar";


type Props  = {
    insights?: any;
    currentLanguageCode ? :any
    charts ?:any

}

const SocialInsights: FC<Props> = ({insights ,currentLanguageCode , charts} ) => {

    return(
        <div className="row">
            <div className="col-md-12">
                <div className="row">
                    <div className="col-md-4">
                        <div className="  border border-bottom-light br-p">
                            <div className="row">
                                <div className="fs-16 title-font-bold">
                                                <span>
                                                    <span
                                                        className="fs-16  title-font-bold">{nbFormatter(insights.talent_social.followers, 0)}</span>
                                                </span>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="font-size-sm text-muted title-font-bold">
                                    {t('followers')}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="  border border-bottom-light br-p">
                            <div className="row">
                                <div className="fs-16 title-font-bold">
                                                <span>
                                                    <span
                                                        className=" fs-16 title-font-bold ">{nbFormatter(insights.talent_social?.avg_views, 0)}</span>
                                                </span>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="font-size-sm text-muted title-font-bold">
                                    {t('avgViews')}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="  border border-bottom-light br-p ">
                            <div className="row">
                                <div className="fs-16 title-font-bold">
                                                <span>
                                                    <span
                                                        className=" fs-16 title-font-bold ">{(insights.talent_social.engagement_rate * 100).toLocaleString(undefined, {maximumFractionDigits: 2})}%</span>
                                                </span>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="font-size-sm text-muted title-font-bold">
                                    {t('engagementRate')}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 pt-10">
                        <div className="  border border-bottom-light br-p ">
                            <div className="row">
                                <div className="fs-16 title-font-bold">
                                                <span>
                                                    <span
                                                        className="fs-16 title-font-bold ">{nbFormatter(insights.talent_social.avg_comments, 0)}</span>
                                                </span>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="font-size-sm text-muted title-font-bold">
                                    {t('avgComments')}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 pt-10">
                        <div className="border border-bottom-light br-p">
                            <div className="row">
                                <div className="fs-16 title-font-bold">
                                                <span>
                                                    <span
                                                        className="label-inline fs-16 title-font-bold ">{nbFormatter(insights.talent_social?.avg_likes, 0)}</span>
                                                </span>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="font-size-sm text-muted title-font-bold">
                                    {t('avgLikes')}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 pt-10">
                        <div className="  border border-bottom-light br-p">
                            <div className="row">
                                <div className="fs-16 title-font-bold">
                                                <span>
                                                    <span
                                                        className="fs-16 title-font-bold ">{nbFormatter(insights.talent_social.posts_count, 0)}</span>
                                                </span>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="font-size-sm text-muted title-font-bold">
                                    {t('mediaCount')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {JSON.parse(insights.user_profile)?.similar_users &&
                    JSON.parse(insights.user_profile)?.similar_users.length > 0 ?
                        <div className="col-md-12 pt-10">
                            <div className=" border border-bottom-light p-10 br-15">
                                <div className="row mt-5">
                                    <div
                                        className={`title-font-bold fs-20 ${currentLanguageCode === 'en' ? " ms-4" : "me-4"}`}>
                                        {t('lookalikesSimilarTopics')}
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <div className="row  pt-5 block-p-35">
                                        {JSON.parse(insights.user_profile)?.similar_users.map((user: any) => (
                                            <div className="col-md-4" key={user?.username ? user?.username : user.fullname}>
                                                <div className="d-flex align-items-center mb-2">
                                                    <div
                                                        className="symbol symbol-40 symbol-xxl-50 me-3 align-self-start align-self-xxl-center">
                                                        <div className="symbol-label"
                                                             style={{backgroundImage: `url('${user?.picture}')`}}></div>
                                                    </div>
                                                    <div
                                                        className="d-flex justify-content-start flex-column">
                                                        {user.username &&
                                                            <a href={user.url}
                                                               className="title-color text-primary-hover font-text-bold fs-6">{user.username}</a>
                                                        }
                                                        {user.fullname &&
                                                            <span
                                                                className="text-muted font-text-bold text-muted d-block fs-7">{user.fullname}</span>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                    </div>
                                </div>
                            </div>
                        </div>
                        : null}

                </div>
                {insights?.talent_social.social.id === INSTAGRAM_SOCIAL_MEDIA_ID || insights?.talent_social.social.id === YOUTUBE_SOCIAL_MEDIA_ID ?
                    <div className="row  mt-5">
                        {charts && charts?.followers_stat && charts?.followers_stat.values[0].length > 0 ?

                            <div className=" col-md-4 ">
                                <div
                                    className="card card-custom gutter-b example example-compact card-stretch">
                                    <div className="card-body font-chart-color">
                                        <div className="">
                                            <LineChart className='card-xl-stretch mb-xl-8'
                                                       name='Chart'
                                                       data={charts.followers_stat}/>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            : null}
                        {charts && charts?.likes_stat && charts?.likes_stat.values[0].length > 0 ?

                            <div className=" col-md-4  ">
                                <div
                                    className="card card-custom gutter-b example example-compact card-stretch">
                                    <div className="card-body font-chart-color">
                                        <div className="">
                                            <LineChart className='card-xl-stretch mb-xl-8'
                                                       name='Chart'
                                                       data={charts.likes_stat}/>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            : null}
                        {charts.following_stat.values[0].length > 0 ?

                            <div className=" col-md-4  ">
                                <div
                                    className="card card-custom gutter-b example example-compact card-stretch">
                                    <div className="card-body font-chart-color">
                                        <div className="">
                                            <LineChart className='card-xl-stretch mb-xl-8'
                                                       name='CHART'
                                                       data={charts.following_stat}/>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            : null}


                        {charts.views_stat.values[0].length > 0 ?

                            <div className=" col-md-4  ">
                                <div
                                    className="card card-custom gutter-b example example-compact card-stretch">
                                    <div className="card-body font-chart-color">
                                        <div className="">
                                            <LineChart className='card-xl-stretch mb-xl-8'
                                                       name='Chart'
                                                       data={charts.views_stat}/>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            : null}


                    </div> :  null }

                {insights?.talent_social.social_media_id === INSTAGRAM_SOCIAL_MEDIA_ID ?
                    <div className="row">
                        {JSON.parse(insights.user_profile).top_hashtags.length > 0 &&
                            <div className="col-md-6 pt-10">
                                <div className=" border border-bottom-light br-15">
                                    <div className="row mt-5">
                                        <div
                                            className={`title-font-bold fs-20 ${currentLanguageCode === 'en' ? " ms-4" : "me-4"}`}>
                                            {t('popular')} #
                                        </div>
                                    </div>
                                    <div className="row pt-5 block-p-35">
                                        {JSON.parse(insights.user_profile).top_hashtags.map((hashtag: any) => (

                                            <div key={hashtag?.tag}
                                                className="font-size-sm mb-2 me-2 title-font-bold label label-xl label-light-info label-inline"
                                                data-toggle="tooltip" data-placement="bottom"
                                                title={`${hashtag?.weight * 100}%`}># {hashtag?.tag}
                                            </div>

                                        ))}
                                    </div>
                                </div>
                            </div>
                        }

                        {JSON.parse(insights.user_profile).top_mentions.length > 0 &&
                            <div className="col-md-6 pt-10">
                                <div className=" border border-bottom-light p-10 br-15">
                                    <div className="row mt-5">
                                        <div
                                            className={`title-font-bold fs-20 ${currentLanguageCode === 'en' ? " ms-4" : "me-4"}`}>
                                            {t('popular')} @
                                        </div>
                                    </div>
                                    <div className="row pt-5 block-p-35">
                                        {JSON.parse(insights.user_profile).top_mentions.map((mention: any) => (


                                            <div key={mention?.tag}
                                                className="font-size-sm mb-2 me-2 title-font-bold label label-xl label-light-warning label-inline"
                                                data-toggle="tooltip" data-placement="bottom"
                                                title={`${mention?.weight * 100}%`}>@ {mention.tag}
                                            </div>

                                        ))}


                                    </div>
                                </div>
                            </div>
                        }

                    </div>

                    : null}

                <div className="row">
                    <div className="col-md-12 pt-pb-15">
                        <h6 className={`title-font-bold fs-20 mt-4`}>{t('audienceDataFollower')} </h6>
                    </div>
                    <div className="col-md-12">
                        <div className="">
                            <div className="row">
                                {charts.gender_stat.values.length > 0 &&

                                    <div className="col-md-6">
                                        <div
                                            className="card card-custom gutter-b  example example-compact card-stretch">
                                            <div className="card-body font-chart-color ">
                                                <div className="">
                                                    <PieChart className='card-xl-stretch mb-xl-8'
                                                              name='CHART'
                                                              data={charts.gender_stat}/>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                                {charts.languages_stat.values.length > 0 && insights.talent_social.social.id === YOUTUBE_SOCIAL_MEDIA_ID &&

                                    <div className="col-md-6 pt-10">
                                        <div
                                            className="card card-custom gutter-b example example-compact card-stretch">
                                            <div className="card-body font-chart-color">
                                                <div className="">
                                                    <BarChart data={charts.languages_stat}
                                                              name='CHART' horizontal={true}/>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                                {charts && charts.reachability_stat !== null  && charts.reachability_stat.values.length > 0 &&

                                    <div className="col-md-6 pt-10">
                                        <div
                                            className="card card-custom gutter-b example example-compact card-stretch">
                                            <div className="card-body font-chart-color">
                                                <div className="">
                                                    <BarChart data={charts.reachability_stat}
                                                              name='CHART'/>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }


                                <div className="row">
                                    {charts && charts.male_stat_age !== null  && charts.male_stat_age.values.length > 0 &&

                                        <div className="col-md-6 pt-10">
                                            <div
                                                className="card card-custom gutter-b example example-compact card-stretch">
                                                <div className="card-body font-chart-color">
                                                    <div className="">
                                                        <BarChart data={charts.male_stat_age}
                                                                  name='CHART'/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {charts && charts.female_stat_age !== null  && charts.female_stat_age.values[0].length > 0 &&

                                        <div className="col-md-6 pt-10">
                                            <div
                                                className="card card-custom gutter-b example example-compact card-stretch">
                                                <div className="card-body font-chart-color">
                                                    <div className="">
                                                        <BarChart data={charts.female_stat_age}
                                                                  name='CHART'/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {charts && charts.city_stat !== null  && charts.city_stat.values[0].length > 0 &&

                                        <div className="col-md-6 pt-10">
                                            <div
                                                className="card card-custom gutter-b example example-compact card-stretch">
                                                <div className="card-body font-chart-color">
                                                    <div className="">
                                                        <BarChart data={charts.city_stat}
                                                                  name='CHART'/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {charts && charts.country_stat !== null  && charts.country_stat.values[0].length > 0 &&
                                        <div className="col-md-6 pt-10">
                                            <div
                                                className="card card-custom gutter-b example example-compact card-stretch">
                                                <div className="card-body font-chart-color">
                                                    <div className="">
                                                        <BarChart data={charts.country_stat}
                                                                  name='CHART' horizontal={true}/>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {charts && charts.ethnicity_stat !== null  && charts.ethnicity_stat.values[0].length > 0 &&
                                        <div className="col-md-6 pt-10">
                                            <div
                                                className="card card-custom gutter-b example example-compact card-stretch">
                                                <div className="card-body font-chart-color">
                                                    <div className="">
                                                        <BarChart data={charts.ethnicity_stat}
                                                                  name='CHART' horizontal={true}/>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }

                                    {charts && charts.languages_stat !== null && charts.languages_stat.values[0].length > 0 && insights.talent_social.social.id !== YOUTUBE_SOCIAL_MEDIA_ID &&
                                        <div className="col-md-6 pt-10">
                                            <div
                                                className="card card-custom gutter-b example example-compact card-stretch">
                                                <div className="card-body font-chart-color">
                                                    <BarChart data={charts.languages_stat}
                                                              name='CHART' horizontal={true}/>

                                                </div>
                                            </div>
                                        </div>
                                    }

                                </div>

                                {JSON.parse(insights.audience_followers) && JSON.parse(insights.audience_followers).success === true &&
                                    <div className="row">

                                        {insights.talent_social.social_media_id === INSTAGRAM_SOCIAL_MEDIA_ID  && JSON.parse(insights.audience_followers).data.audience_brand_affinity.length > 0 &&

                                            <div className="col-md-6 pt-10">
                                                <div
                                                    className=" border border-bottom-light p-10 br-15">
                                                    <div className="row mt-5">
                                                        <div
                                                            className={`title-font-bold fs-20 ${currentLanguageCode === 'en' ? " ms-4" : "me-4"}`}>

                                                        {t('brandAffinity')}
                                                        </div>
                                                    </div>
                                                    <div className="row pt-5 block-p-35">
                                                        {JSON.parse(insights.audience_followers).data.audience_brand_affinity.map((brand: any) => (

                                                            <div key={brand.name}
                                                                className="font-size-h6 ms-2 mb-1 title-font-bold label label-xl label-light-secondary label-inline bg-brand"
                                                                data-toggle="tooltip"
                                                                data-placement="bottom"
                                                                title={`${brand.weight * 100} %`}>{brand.name}
                                                            </div>

                                                        ))}

                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {JSON.parse(insights.audience_followers) && JSON.parse(insights.audience_followers).success === true && JSON.parse(insights.audience_followers).data.audience_interests && JSON.parse(insights.audience_followers).data.audience_interests.length &&
                                            <div className="col-md-6 pt-10">
                                                <div
                                                    className=" border border-bottom-light p-10 br-15">
                                                    <div className="row mt-5">
                                                        <div
                                                            className={`title-font-bold fs-20 ${currentLanguageCode === 'en' ? " ms-4" : "me-4"}`}>
                                                            {t('interestAffinity')}
                                                        </div>
                                                    </div>
                                                    <div className="row pt-5 block-p-35">
                                                        {JSON.parse(insights.audience_followers).data.audience_interests.map((interest: any) => (

                                                            <div key={interest?.name}
                                                                className="font-size-h6 mb-1 ms-2 title-font-bold label label-xl label-light-warning label-inline interests"
                                                                data-toggle="tooltip"
                                                                data-placement="bottom"
                                                                title={`${interest.weight * 100} %`}>{interest.name}
                                                            </div>

                                                        ))}

                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>

                                }


                                {JSON.parse(insights.audience_followers) && JSON.parse(insights.audience_followers).success === true && JSON.parse(insights.audience_followers).data.audience_lookalikes && JSON.parse(insights.audience_followers).data.audience_lookalikes.length &&

                                    <div className="col-md-12 pt-10">
                                        <div className=" border border-bottom-light p-10 br-15">
                                            <div className="row mt-5">
                                                <div
                                                    className={`title-font-bold fs-20 ${currentLanguageCode === 'en' ? " ms-4" : "me-4"}`}>
                                                    {t('audienceLookalikes')}
                                                </div>
                                            </div>
                                            <div className="mt-2">
                                                <div className="row  pt-5 block-p-35">
                                                    {JSON.parse(insights.audience_followers).data.audience_lookalikes.map((audience: any) => (
                                                        <div className="col-md-4" key={audience?.username ? audience?.username : audience?.fullname}>
                                                            <div
                                                                className="d-flex align-items-center mb-2">
                                                                <div
                                                                    className="symbol symbol-40 symbol-xxl-50 me-3 align-self-start align-self-xxl-center">
                                                                    <div className="symbol-label"
                                                                         style={{backgroundImage: `url('${audience?.picture}')`}}></div>
                                                                </div>
                                                                <div
                                                                    className="d-flex justify-content-start flex-column">
                                                                    {audience.username &&
                                                                        <a href={audience.url}
                                                                           className="link-primary fw-bolder text-hover-dark fs-6">{audience.username}</a>}
                                                                    {audience.fullname &&

                                                                        <span
                                                                            className="text-muted fw-bold text-muted d-block fs-7">{audience.fullname}</span>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }

                                {JSON.parse(insights.audience_followers) && JSON.parse(insights.audience_followers).success === true && JSON.parse(insights.audience_followers).data.notable_users && JSON.parse(insights.audience_followers).data.notable_users.length &&

                                    <div className="col-md-12 pt-10">
                                        <div className=" border border-bottom-light p-10 br-15">
                                            <div className="row mt-5">
                                                <div
                                                    className={`title-font-bold fs-20 ${currentLanguageCode === 'en' ? " ms-4" : "me-4"}`}>
                                                    {t('notableFollowers')}
                                                </div>
                                            </div>
                                            <div className="row pt-5 block-p-35">
                                                {JSON.parse(insights.audience_followers).data.notable_users.map((notable_user: any) => (
                                                    <div className="col-md-4" key={notable_user.username ? notable_user.username : notable_user.fullname}>
                                                        <div
                                                            className="d-flex align-items-center mb-2">
                                                            <div
                                                                className="symbol symbol-40 symbol-xxl-50 me-3 align-self-start align-self-xxl-center">
                                                                <div className="symbol-label"
                                                                     style={{backgroundImage: `url('${notable_user?.picture}')`}}></div>
                                                            </div>
                                                            <div
                                                                className="d-flex justify-content-start flex-column">
                                                                {notable_user.username &&
                                                                    <a href={notable_user.url}
                                                                       className="link-primary fw-bolder text-hover-dark fs-6">{notable_user.username}</a>}

                                                                {notable_user.fullname &&
                                                                    <span
                                                                        className="text-muted fw-bold text-muted d-block fs-7">{notable_user.fullname}</span>}

                                                            </div>
                                                        </div>


                                                    </div>
                                                ))}

                                            </div>
                                        </div>
                                    </div>
                                }

                            </div>
                        </div>
                    </div>
                </div>

                {insights?.talent_social.social_media_id === INSTAGRAM_SOCIAL_MEDIA_ID && JSON.parse(insights?.audience_likers) && JSON.parse(insights?.audience_likers).success === true ?
                    <div className="row ">
                        <div className="col-md-12 pb-15 pt-15">
                            <h6 className={`title-font-bold fs-20  mt-4`}>{t('audienceDataLikes')} </h6>
                        </div>
                        <div className="col-md-12">
                            <div className="">
                                <div className="row">
                                    {charts.reachability_aud_stat.values[0].length > 0 ?

                                        <div className=" col-md-6  ">
                                            <div
                                                className="card card-custom gutter-b example example-compact card-stretch">
                                                <div className="card-body font-chart-color">
                                                    <div className="">
                                                        <BarChart
                                                            className='card-xl-stretch mb-xl-8'
                                                            name='Chart'
                                                            data={charts.reachability_aud_stat}/>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        : null}

                                    {charts.gender_aud_stat.values.length > 0 ?

                                        <div className=" col-md-6  ">
                                            <div
                                                className="card card-custom gutter-b example example-compact card-stretch">
                                                <div className="card-body font-chart-color">
                                                    <div className="">
                                                        <PieChart
                                                            className='card-xl-stretch mb-xl-8'
                                                            name='Chart'
                                                            data={charts.gender_aud_stat}/>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        : null}

                                    {charts.male_aud_stat_age.values[0].length > 0 ?

                                        <div className=" col-md-6  ">
                                            <div
                                                className="card card-custom gutter-b example example-compact card-stretch">
                                                <div className="card-body font-chart-color">
                                                    <div className="">
                                                        <BarChart className=''
                                                                  name='Chart'
                                                                  data={charts.male_aud_stat_age}/>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        : null}
                                    {charts.female_aud_stat_age.values[0].length > 0 ?

                                        <div className=" col-md-6  ">
                                            <div
                                                className="card card-custom gutter-b example example-compact card-stretch">
                                                <div className="card-body font-chart-color">
                                                    <div className="">
                                                        <BarChart className=''
                                                                  name='Chart'
                                                                  data={charts.female_aud_stat_age}/>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        : null}

                                    {charts.city_aud_stat.values[0].length > 0 ?

                                        <div className=" col-md-6  ">
                                            <div
                                                className="card card-custom gutter-b example example-compact card-stretch">
                                                <div className="card-body font-chart-color">
                                                    <div className="">
                                                        <BarChart className=''
                                                                  name='Chart'
                                                                  data={charts.city_aud_stat}/>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        : null}

                                    {charts.country_aud_stat.values[0].length > 0 ?

                                        <div className=" col-md-6  ">
                                            <div
                                                className="card card-custom gutter-b example example-compact card-stretch">
                                                <div className="card-body font-chart-color">
                                                    <div className="">
                                                        <BarChart horizontal={true}
                                                                  name='Chart'
                                                                  data={charts.country_aud_stat}/>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        : null}
                                    {charts.ethnicity_aud_stat.values[0].length > 0 ?

                                        <div className=" col-md-6  ">
                                            <div
                                                className="card card-custom gutter-b example example-compact card-stretch">
                                                <div className="card-body font-chart-color">
                                                    <div className="">
                                                        <BarChart horizontal={true}
                                                                  name='CHART'
                                                                  data={charts.ethnicity_aud_stat}/>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        : null}
                                    {charts.languages_aud_stat.values[0].length > 0 ?

                                        <div className=" col-md-6  ">
                                            <div
                                                className="card card-custom gutter-b example example-compact card-stretch">
                                                <div className="card-body font-chart-color">
                                                    <div className="">
                                                        <BarChart horizontal={true}
                                                                  name='CHART'
                                                                  data={charts.languages_aud_stat}/>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        : null}
                                </div>
                                <div className="row">
                                    {insights?.audience_likers && JSON.parse(insights?.audience_likers).success === true && JSON.parse(insights?.audience_likers).data.audience_brand_affinity ?
                                        <div className="col-md-6 pt-10">
                                            <div className=" border border-bottom-light p-10 br-15">
                                                <div className="row mt-5">
                                                    <div
                                                        className={`title-font-bold fs-20 ${currentLanguageCode === 'en' ? " ms-4" : "me-4"}`}>
                                                        {t('brandAffinity')}
                                                    </div>
                                                </div>
                                                <div className="row pt-5 block-p-35">
                                                    {JSON.parse(insights?.audience_likers).data.audience_brand_affinity.map((brand: any) => (
                                                        <div key={brand.name}
                                                            className="font-size-sm  mb-2 me-2  title-font-bold label label-xl label-light-secondary label-inline brand-likers"
                                                            data-toggle="tooltip"
                                                            data-placement="bottom"
                                                            title={`${brand.weight * 100}%`}>{brand.name}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div> : null}
                                    {insights?.audience_likers && JSON.parse(insights?.audience_likers).success === true && JSON.parse(insights?.audience_likers).data.audience_interests ?
                                        <div className="col-md-6 pt-10">
                                            <div className=" border border-bottom-light p-10 br-15">
                                                <div className="row mt-5">
                                                    <div
                                                        className={`title-font-bold fs-20 ${currentLanguageCode === 'en' ? " ms-4" : "me-4"}`}>
                                                        {t('interestAffinity')}
                                                    </div>
                                                </div>
                                                <div className="row pt-5 block-p-35">
                                                    {JSON.parse(insights?.audience_likers).data.audience_interests.map((interest: any) => (
                                                        <div key={interest.name}
                                                            className="font-size-sm  mb-2 me-2  title-font-bold label label-xl label-light-warning label-inline interest-likers"
                                                            data-toggle="tooltip"
                                                            data-placement="bottom"
                                                            title={`${interest.weight * 100}%`}>{interest.name}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div> : null}

                                </div>

                                {JSON.parse(insights.audience_likers) && JSON.parse(insights.audience_likers).success === true && JSON.parse(insights.audience_likers).data.notable_users && JSON.parse(insights.audience_likers).data.notable_users.length &&

                                    <div className="row">
                                        <div className="col-md-12 pt-10">
                                            <div className=" border border-bottom-light p-10 br-15">
                                                <div className="row mt-5">
                                                    <div
                                                        className={`title-font-bold fs-20 ${currentLanguageCode === 'en' ? " ms-4" : "me-4"}`}>
                                                        {t('notableFollowers')}
                                                    </div>
                                                </div>
                                                <div className="row pt-5 block-p-35">
                                                    {JSON.parse(insights.audience_likers).data.notable_users.map((notable_user: any) => (
                                                        <div className="col-md-4" key={notable_user.username ? notable_user.username : notable_user.fullname}>
                                                            <div
                                                                className="d-flex align-items-center mb-2">
                                                                <div
                                                                    className="symbol symbol-40 symbol-xxl-50 me-3 align-self-start align-self-xxl-center">
                                                                    <div className="symbol-label"
                                                                         style={{backgroundImage: `url('${notable_user?.picture}')`}}></div>
                                                                </div>
                                                                <div
                                                                    className="d-flex justify-content-start flex-column">
                                                                    {notable_user.username &&
                                                                        <a href={notable_user.url}
                                                                           className="link-primary fw-bolder text-hover-dark fs-6">{notable_user.username}</a>}

                                                                    {notable_user.fullname &&
                                                                        <span
                                                                            className="text-muted fw-bold text-muted d-block fs-7">{notable_user.fullname}</span>}

                                                                </div>
                                                            </div>


                                                        </div>
                                                    ))}

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }


                            </div>
                        </div>
                    </div> : null}

                {insights?.talent_social.social_media_id === YOUTUBE_SOCIAL_MEDIA_ID && JSON.parse(insights?.audience_commenters).success === true ?
                    <div className="row">
                        <div className="col-md-12 pb-15 pt-15">
                            <h6 className={`title-font-bold fs-20 mt-4`}>{t('audienceDataComments')} </h6>
                        </div>
                        <div className="col-md-12">
                            <div className="">
                                <div className="row">
                                    {charts && charts?.gender_comment_stat.values.length > 0 ?

                                        <div className=" col-md-6  ">
                                            <div
                                                className="card card-custom gutter-b example example-compact card-stretch">
                                                <div className="card-body font-chart-color">
                                                    <div className="">
                                                        <PieChart
                                                            name='CHART'
                                                            data={charts.gender_comment_stat}
                                                            className="card"/>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        : null}
                                    {charts && charts?.languages_comment_stat.values.length > 0 ?

                                        <div className=" col-md-6  ">
                                            <div
                                                className="card card-custom gutter-b example example-compact card-stretch">
                                                <div className="card-body font-chart-color">
                                                    <div className="">
                                                        <BarChart horizontal={true}
                                                                  name='CHART'
                                                                  data={charts.languages_comment_stat}
                                                                  className="card"/>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        : null}
                                    {charts && charts?.female_comment_stat_age.values.length > 0 ?

                                        <div className=" col-md-6  ">
                                            <div
                                                className="card card-custom gutter-b example example-compact card-stretch">
                                                <div className="card-body font-chart-color">
                                                    <div className="">
                                                        <BarChart
                                                            name='CHART'
                                                            data={charts.female_comment_stat_age}
                                                            className="card"/>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        : null}
                                    {charts && charts?.male_comment_stat_age.values.length > 0 ?

                                        <div className=" col-md-6  ">
                                            <div
                                                className="card card-custom gutter-b example example-compact card-stretch">
                                                <div className="card-body font-chart-color">
                                                    <div className="">
                                                        <BarChart
                                                            name='CHART'
                                                            data={charts.male_comment_stat_age}
                                                            className="card"/>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        : null}
                                </div>
                            </div>
                        </div>
                    </div>

                    : null}

                {insights?.talent_social.social_media_id === YOUTUBE_SOCIAL_MEDIA_ID && JSON.parse(insights?.audience_commenters).success === true && JSON.parse(insights?.audience_commenters).data.notable_users && JSON.parse(insights?.audience_commenters).data.notable_users.length > 0 ?
                    <div className="row">
                        <div className="col-md-12 pt-10">
                            <div className=" border border-bottom-light p-10 br-15">
                                <div className="row mt-5">
                                    <div
                                        className={`title-font-bold fs-20 ${currentLanguageCode === 'en' ? " ms-4" : "me-4"}`}>
                                        {t('notableFollowers')}
                                    </div>
                                </div>
                                <div className="row pt-5 block-p-35">
                                    {JSON.parse(insights.audience_commenters).data.notable_users.map((notable_user: any) => (
                                        <div className="col-md-4" key={notable_user.username ? notable_user.username : notable_user.fullname}>
                                            <div
                                                className="d-flex align-items-center mb-2">
                                                <div
                                                    className="symbol symbol-40 symbol-xxl-50 me-3 align-self-start align-self-xxl-center">
                                                    <div className="symbol-label"
                                                         style={{backgroundImage: `url('${notable_user?.picture}')`}}></div>
                                                </div>
                                                <div
                                                    className="d-flex justify-content-start flex-column">
                                                    {notable_user.username &&
                                                        <a href={notable_user.url}
                                                           className="link-primary fw-bolder text-hover-dark fs-6">{notable_user.username}</a>}

                                                    {notable_user.fullname &&
                                                        <span
                                                            className="text-muted fw-bold text-muted d-block fs-7">{notable_user.fullname}</span>}

                                                </div>
                                            </div>


                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    : null}
            </div>
        </div>

    );
}
export default SocialInsights;