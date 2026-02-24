import React, {FC, useEffect, useState} from 'react';
import {t} from "i18next";
import {useTranslation} from "react-i18next";
import {
    COLLABS,
    FILMOGRAPHY, IN_THE_MEDIA,
    IN_THE_SPOT, INSIGHTS, TALENT_SOCIAL, TALENT_VIDEOS,
    YOUTUBE_PLATFORM_EMBED_ID,
    YOUTUBE_PLATFORM_ID
} from "../../../../helpers/crud-helper/consts";
import {formatPlatform} from "../../../../helpers/crud-helper/functions";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import Platform from "./platforms";
import Spot from "./spot";
import Filmography from "./filmography";
import Media from "./media";
import SocialFeed from "./social-feed";
import PersonalizedVideos from "./personalized-videos";
import Collabs from "./collabs";
import Cookies from "js-cookie";
import {getInTheSpotData} from "../../../../core/talent/requests";
import {useParams} from "react-router-dom";
import Insights from "./insights";


type Props  = {
    talent?: any;
    firstItem ?:  any ;
    navItems ?: any
    items ?:any
}

const PlatformIndex: FC<Props> = ({talent , firstItem ,navItems , items} ) => {

    const {t} = useTranslation()
    const currentLanguageCode = Cookies.get('i18next') || 'en'

    const [spot, setSpotItems] = useState<any>()
    const [filmography, setFilmographyItems] = useState<any>()
    const [media, setMediaItems] = useState<any>()
    const [socialFeed, setSocialFeedItems] = useState<any>()
    const [videos, setVideosItems] = useState<any>()
    const [collabs, setCollabsItems] = useState<any>()
    const [insights, setInsightsItems] = useState<any>()
    const [socialNavItems, setSocialNavItems] = useState<any>()
    const [socialFirstItem, setSocialFirstItem] = useState<any>()
    const [charts, setCharts] = useState<any>()

    const params = useParams()
    const [itemsLoading, setItemsLoading] =  useState(false)
    const HandleClickTab = async (tab: any) => {
        if (tab === IN_THE_SPOT && !spot) {
            try {
                setItemsLoading(true)
                const response = await  getInTheSpotData(params.talent, currentLanguageCode, tab)
                setSpotItems(response.data.data.items)


            } catch (ex) {
                console.error(ex)
            } finally {

                setItemsLoading(false)
            }
        } else if (tab === FILMOGRAPHY && !filmography) {
            try {
                setItemsLoading(true)
                const response = await  getInTheSpotData(params.talent, currentLanguageCode, tab)

                setFilmographyItems(response.data.data.items)

            } catch (ex) {
                console.error(ex)
            } finally {

                setItemsLoading(false)
            }
        } else if (tab === IN_THE_MEDIA && !media) {
            try {
                setItemsLoading(true)
                const response = await  getInTheSpotData(params.talent, currentLanguageCode, tab)
                setMediaItems(response.data.data.items)

            } catch (ex) {
                console.error(ex)
            } finally {

                setItemsLoading(false)
            }

        } else if (tab === TALENT_SOCIAL && !socialFeed) {
            try {
                setItemsLoading(true)
                const response = await  getInTheSpotData(params.talent, currentLanguageCode, tab)
                setSocialFeedItems(response.data.data.items)

            } catch (ex) {
                console.error(ex)
            } finally {

                setItemsLoading(false)
            }
        } else if (tab === TALENT_VIDEOS && !videos) {
            try {
                setItemsLoading(true)
                const response = await  getInTheSpotData(params.talent, currentLanguageCode, tab)
                setVideosItems(response.data.data.items)

            } catch (ex) {
                console.error(ex)
            } finally {

                setItemsLoading(false)
            }
        } else if (tab === INSIGHTS && !insights) {
            try {
                setItemsLoading(true)
                const response = await  getInTheSpotData(params.talent, currentLanguageCode, tab)
                setInsightsItems(response.data.data.items)
                setSocialNavItems(response.data.data.social_nav_items)
                setSocialFirstItem(response.data.data.first_item)
                setCharts(response.data.data?.charts)

            } catch (ex) {
                console.error(ex)
            } finally {

                setItemsLoading(false)
            }
        } else if (tab === COLLABS && !collabs) {

            try {
                setItemsLoading(true)
                const response = await  getInTheSpotData(params.talent, currentLanguageCode, tab)

                setCollabsItems(response.data.data.items)
            } catch (ex) {
                console.error(ex)
            } finally {

                setItemsLoading(false)
            }
        }

    }
    return(
        <div className="platforms pt-50 bdr-btm ">
            <div className="container pb-20">
                <div className="row">
                    <div className="col-md-12 ">
                        <div className="">
                            <h3 className="title-color title-font-bold"><span
                                className="">{talent && currentLanguageCode === 'en' ? talent?.user?.name.en : talent?.user?.name.ar}</span> {t('inTheSpotLight')}
                            </h3>
                        </div>
                    </div>
                </div>
                {/*<div className='row'>*/}
                    <Tab.Container id="left-tabs-example" defaultActiveKey={  firstItem === IN_THE_SPOT ? `findMeOn`
                        : firstItem === FILMOGRAPHY  ? `filmography`
                            : firstItem === IN_THE_MEDIA ? `media`
                                : firstItem === TALENT_SOCIAL  ? `socialFeed`
                                    : firstItem === TALENT_VIDEOS  ? `personalizedVideos`
                                        : firstItem === COLLABS  ? `collabs`
                                            // : firstItem === INSIGHTS  ? `insights`
                                                : `findMeOn` } >
                        <div className="row">
                            <div className="col-md-12 mt-3 mb-4">
                                <Nav variant="pills" className="flex-row">
                                    {navItems && navItems.length > 0 && navItems.map((item: any) => (
                                        item === IN_THE_SPOT ? (
                                            <Nav.Item key="findMeOn" onClick={() => HandleClickTab(item )}>
                                                <Nav.Link key="findMeOn" className="title-font"
                                                          eventKey="findMeOn">{t('findMeOn')}</Nav.Link>
                                            </Nav.Item>
                                        ) : item === FILMOGRAPHY ? (
                                            <Nav.Item key="filmography" onClick={() => HandleClickTab(item )}>
                                                <Nav.Link key="filmography" className="title-font"
                                                          eventKey="filmography">{t('filmography.filmography')}</Nav.Link>
                                            </Nav.Item>
                                        ) : item === IN_THE_MEDIA ? (

                                            <Nav.Item key="media" onClick={() => HandleClickTab(item )}>
                                                <Nav.Link key="media" className="title-font"
                                                          eventKey="media">{t('media')}</Nav.Link>
                                            </Nav.Item>
                                        ) : item === TALENT_SOCIAL ? (
                                            <Nav.Item  key="socialFeed" onClick={() => HandleClickTab(item )}>
                                                <Nav.Link key="socialFeed" className="title-font"
                                                          eventKey="socialFeed">{t('socialFeed')}</Nav.Link>
                                            </Nav.Item>

                                        ) : item === TALENT_VIDEOS ? (
                                            <Nav.Item key="personalizedVideos" onClick={() => HandleClickTab(item )}>
                                                <Nav.Link key="personalizedVideos" className="title-font"
                                                          eventKey="personalizedVideos">{t('personalizedVideos')}</Nav.Link>
                                            </Nav.Item>


                                        ): item === COLLABS ? (
                                            <Nav.Item key="collabs" onClick={() => HandleClickTab(item )}>
                                                <Nav.Link key="collabs" className="title-font"
                                                          eventKey="collabs">{t('collabs')}</Nav.Link>
                                            </Nav.Item>

                                        ) : null

                                    ))}
                                </Nav>

                            </div>
                        </div>
                        <div className="row">
                            <Tab.Content>

                                {itemsLoading && (<span className='indicator-progress mt-5' style={{display: 'block' , height: '300px' , textAlign : 'center' }}>
                                                 <span className='spinner-border spinner-border-sm align-middle ms-2'></span></span>) }

                                <Tab.Pane eventKey={firstItem === IN_THE_SPOT ? `findMeOn` : firstItem === FILMOGRAPHY ? `filmography` : firstItem === IN_THE_MEDIA ? `media` : firstItem === TALENT_SOCIAL ? `socialFeed` : firstItem === TALENT_VIDEOS ? `personalizedVideos` : firstItem === COLLABS ? `collabs` : `findMeOn`}>
                                    <Platform firstItem={firstItem} items={items} talent={talent}/>
                                </Tab.Pane>

                                { firstItem !== IN_THE_SPOT  && spot && spot.total > 0 ?
                                    <Tab.Pane eventKey={'findMeOn'}>
                                        <Spot spot={spot}/>

                                    </Tab.Pane> : null
                                }

                                { firstItem !== FILMOGRAPHY && filmography && filmography.total > 0 ?
                                    <Tab.Pane eventKey="filmography">

                                        <Filmography filmography={filmography} />

                                    </Tab.Pane> : null }

                                {firstItem !== IN_THE_MEDIA && media && media.total > 0 ?
                                    <Tab.Pane eventKey="media">
                                        <Media media={media} />

                                    </Tab.Pane> : null }


                                {firstItem !== TALENT_SOCIAL && socialFeed ?
                                    <Tab.Pane eventKey="socialFeed">
                                        <SocialFeed socialFeed={socialFeed} />

                                    </Tab.Pane> : null }

                                {firstItem !== TALENT_VIDEOS && videos && videos?.total ?
                                    <Tab.Pane eventKey="personalizedVideos">
                                        <PersonalizedVideos videos={videos} talent={talent} />


                                    </Tab.Pane> : null }

                                {firstItem !== INSIGHTS && insights  && talent?.activate_social_insights === 1 ?
                                    <Tab.Pane eventKey="insights">
                                        <Insights insights={insights} socialNavItems={socialNavItems} firstItem={socialFirstItem} charts={charts} talent={talent}/>
                                    </Tab.Pane> : null }


                                {  collabs && collabs.length > 0  ?
                                    <Tab.Pane eventKey="collabs">
                                        <Collabs collabs={collabs} />
                                    </Tab.Pane> : null
                                }


                            </Tab.Content>

                        </div>


                    </Tab.Container>
                {/*</div>*/}
            </div>
        </div>
    );
}
export default PlatformIndex;