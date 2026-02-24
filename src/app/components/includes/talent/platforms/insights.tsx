import React, {FC, useEffect, useState} from 'react';
import {t} from "i18next";
import {useTranslation} from "react-i18next";
import {
    COLLABS,
    FILMOGRAPHY, IN_THE_MEDIA,
    IN_THE_SPOT, INSIGHTS,
    INSTAGRAM_SOCIAL_MEDIA_ID, TALENT_SOCIAL, TALENT_VIDEOS, TIKTOK_SOCIAL_MEDIA_ID,
    YOUTUBE_PLATFORM_EMBED_ID,
    YOUTUBE_PLATFORM_ID, YOUTUBE_SOCIAL_MEDIA_ID
} from "../../../../helpers/crud-helper/consts";
import {formatPlatform, nbFormatter} from "../../../../helpers/crud-helper/functions";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";

import Cookies from "js-cookie";

import {BarChart} from "../../../apexchart/bar";
import {LineChart} from "../../../apexchart/line";
import {PieChart} from "../../../apexchart/pie";
import SocialInsights from "./social";
import {getInsightData, getInTheSpotData} from "../../../../core/talent/requests";


type Props = {
    insights?: any;
    socialNavItems?: any
    firstItem?: any
    charts?: any
    talent ?:any

}

const Insights: FC<Props> = ({insights, socialNavItems, firstItem, charts , talent}) => {


    const currentLanguageCode = Cookies.get('i18next') || 'en'
    const [loading, setLoading] =  useState(false)

    const [youtube, setYoutubeInsights] = useState<any>()
    const [youtubeCharts, setYoutubeChartsInsights] = useState<any>()

    const [instagram, setInstagramInsights] = useState<any>()
    const [instagramCharts, setInstagramChartsInsights] = useState<any>()

    const [tiktok, setTiktokInsights] = useState<any>()
    const [tiktokCharts, setTiktokChartsInsights] = useState<any>()

    const HandleClickTab = async (tab: any) => {
        if (tab === YOUTUBE_SOCIAL_MEDIA_ID && !youtube && firstItem !== YOUTUBE_SOCIAL_MEDIA_ID) {
            try {
                setLoading(true)
                const response = await  getInsightData(talent.id, currentLanguageCode, tab)
                setYoutubeInsights(response.data.data.items)

                setYoutubeChartsInsights(response.data.data.charts)

            } catch (ex) {
                console.error(ex)
            } finally {

                setLoading(false)
            }
        } else  if (tab === INSTAGRAM_SOCIAL_MEDIA_ID && !instagram && firstItem !== INSTAGRAM_SOCIAL_MEDIA_ID) {
            try {
                setLoading(true)
                const response = await  getInsightData(talent.id, currentLanguageCode, tab)
                setInstagramInsights(response.data.data.items)
                setInstagramChartsInsights(response.data.data.charts)


            } catch (ex) {
                console.error(ex)
            } finally {

                setLoading(false)
            }
        } else if (tab === TIKTOK_SOCIAL_MEDIA_ID && !tiktok && firstItem !== TIKTOK_SOCIAL_MEDIA_ID) {
            try {
                setLoading(true)
                const response = await getInsightData(talent.id, currentLanguageCode, tab)
                setTiktokInsights(response.data.data.items)
                setTiktokChartsInsights(response.data.data.charts)



            } catch (ex) {
                console.error(ex)
            } finally {

                setLoading(false)
            }
        }

    }

    return (
        <div className="row pb-10 pt-20">
            <Tab.Container id="left-tabs-insights" defaultActiveKey={firstItem === INSTAGRAM_SOCIAL_MEDIA_ID ? `instagram` : firstItem === YOUTUBE_SOCIAL_MEDIA_ID ? `youtube` : firstItem === TIKTOK_SOCIAL_MEDIA_ID ? `tiktok` : `instagram`}>
                <div className="col-md-1 flex-column  pt-30">
                    <Nav variant="pills" className="flex-row platforms_nav">
                        {socialNavItems && socialNavItems.length > 0 && socialNavItems.map((item: any) => (
                            item === INSTAGRAM_SOCIAL_MEDIA_ID ?
                                <Nav.Item key="instagram" title={t('instagram')} className="mb-20" onClick={() => HandleClickTab(item )}>
                                    <Nav.Link key="instagram" className="title-font switch_platform"
                                              eventKey="instagram">
                                        <img width="30" src="/assets/images/social-logos/instagram.svg"/>
                                    </Nav.Link>
                                </Nav.Item>
                                : item === TIKTOK_SOCIAL_MEDIA_ID ?
                                    <Nav.Item key="tiktok" title={t('tikTok')} className="mb-20" onClick={() => HandleClickTab(item )}>
                                        <Nav.Link key="tiktok" className="title-font switch_platform"
                                                  eventKey="tiktok">
                                            <img width="30" src="/assets/images/social-logos/tiktok.svg"/>
                                        </Nav.Link>
                                    </Nav.Item>
                                    : item === YOUTUBE_SOCIAL_MEDIA_ID ?

                                        <Nav.Item key="youtube" title={t('youTube')} className="mb-20" onClick={() => HandleClickTab(item )}>
                                            <Nav.Link key="youtube" className="title-font switch_platform "
                                                      eventKey="youtube">
                                                <img width="30" src="/assets/images/social-logos/youtube.svg"/>
                                            </Nav.Link>
                                        </Nav.Item> : null

                        ))}

                    </Nav>
                </div>
                <div className="col-md-11   pt-20">
                    <Tab.Content>

                        {loading && (<span className='indicator-progress mt-5' style={{display: 'block' , height: '300px' , textAlign : 'center' }}>
                                                 <span className='spinner-border spinner-border-sm align-middle ms-2'></span></span>) }

                        {(firstItem === INSTAGRAM_SOCIAL_MEDIA_ID || instagram) &&
                            <Tab.Pane eventKey="instagram">
                                <SocialInsights key={firstItem} insights={firstItem === INSTAGRAM_SOCIAL_MEDIA_ID ? insights : instagram} charts={firstItem === INSTAGRAM_SOCIAL_MEDIA_ID ? charts : instagramCharts} currentLanguageCode={currentLanguageCode} />
                            </Tab.Pane>
                        }
                        {(firstItem === YOUTUBE_SOCIAL_MEDIA_ID || youtube) &&
                            <Tab.Pane eventKey="youtube">
                                <SocialInsights key={firstItem} insights={firstItem === YOUTUBE_SOCIAL_MEDIA_ID ? insights : youtube} charts={firstItem === YOUTUBE_SOCIAL_MEDIA_ID ? charts : youtubeCharts} currentLanguageCode={currentLanguageCode}/>

                            </Tab.Pane>
                        }
                        {(firstItem === TIKTOK_SOCIAL_MEDIA_ID || tiktok) &&
                            <Tab.Pane eventKey="tiktok">
                                <SocialInsights key={firstItem} insights={firstItem === TIKTOK_SOCIAL_MEDIA_ID ? insights : tiktok} charts={TIKTOK_SOCIAL_MEDIA_ID ? charts : tiktokCharts} currentLanguageCode={currentLanguageCode}/>
                            </Tab.Pane>
                        }
                    </Tab.Content>
                </div>
            </Tab.Container>


        </div>
    );
}
export default Insights;