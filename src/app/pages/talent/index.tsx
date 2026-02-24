import React, {Fragment, FC,  useState, useEffect} from 'react';
import Header from '../../../app/components/header';
import AsideArticle from "../../../app/components/includes/articles/aside";
import HorizontalArticle from "../../../app/components/includes/articles/horizontal";
import VerticalArticle from "../../../app/components/includes/articles/vertical";
import TalentCard from "../../../app/components/includes/talent/card";
import {useTranslation} from "react-i18next";
import Cookies from "js-cookie";
import {Article} from "../../models/article/Article";
import {Talent} from "../../models/talent/Talent";
import {Category} from "../../models/misc/Category";
import {STORAGE_LINK} from "../../helpers/crud-helper/consts";
import {AgencyPage} from "../../models/agency/AgencyPage";
import {Link} from "react-router-dom";
import {getMoreFeatured, getTalentIndexData} from "../../core/talent/requests";
import {TALENT_INDEX_PAGE_ID} from "../../helpers/crud-helper/consts";
import Footer from "../../components/footer";
import {SocialMeta} from "../../components/includes/social-meta/social-meta";
import Loader from "../../components/includes/loader/loader";

const TalentIndexPage: FC = () => {
    const currentLanguageCode = Cookies.get('i18next') || 'en'
    const [currPagePriority, setCurrPagePriority] = useState(1);
    const [prevPagePriority, setPrevPagePriority] = useState(0);
    const [lastPagePriority, setLastPagePriority] = useState(0);

    const [currPageBothTypes, setCurrPageBothTypes] = useState(1);
    const [prevPageBothTypes, setPrevPageBothTypes] = useState(0);
    const [lastPageBothTypes, setLastPageBothTypes] = useState(0);



    const [loading , setLoading] = useState(false)
    const [loadingBothTypes , setLoadingBothTypes] = useState(false)

    const [articles , setArticles] = useState<Array<Article> | undefined>([])
    const [talents , setTalents] = useState<Array<Talent> | any>([])
    const [talentsPriority , setTalentsPriority ] = useState<Array<Talent> | any>([])
    const [talentsPriorityTotal , setTalentsPriorityTotal ] = useState(0)
    const [talentsBothTypesTotal , setTalentsBothTypesTotal ] = useState(0)
    const [showLoader, setShowLoader] = useState(true);
    const [talentsBothTypes , setTalentsBothTypes] = useState<Array<Talent> | any>([])
    const [talentsPriorityPageNumber , setTalentsPriorityPageNumber] = useState(2)
    const [talentsBothTypesPageNumber , setTalentsBothTypesPageNumber] = useState(2)
    const [categories , setCategories] = useState<Array<Category> | undefined>([])
    const [page , setPage] = useState<AgencyPage | null >()

    const [renderedTalentsPriority , setRenderedTalentsPriority] = useState([])
    const [renderedTalentsBothTypes , setRenderedTalentsBothTypes] = useState([])

    const { t } = useTranslation()

    const getMoreFeaturedData = async () => {
        try {
            setLoading(true)
            const response = await getMoreFeatured(talentsPriorityPageNumber, 1)
            setLastPagePriority(response.data.last_page);

            if (!response.data.data.length) {
                return;
            }
            setPrevPagePriority(currPagePriority);
            setCurrPagePriority(currPagePriority + 1 )

            // @ts-ignore
            setRenderedTalentsPriority([...renderedTalentsPriority, ...response.data.data]);

            setTalentsPriorityPageNumber(talentsPriorityPageNumber + 1)
            setTalentsPriorityTotal(talentsPriorityTotal - 12 )
        }

        catch (ex) {
            console.error(ex)
        } finally {

            setLoading(false)
        }

    }

    const getMoreBothTypesData = async () => {
        try {
            setLoadingBothTypes(true)
            const response = await getMoreFeatured(talentsBothTypesPageNumber, 2)

            setLastPageBothTypes(response.data.last_page);

            if (!response.data.data.length) {
                return;
            }

            setPrevPageBothTypes(currPageBothTypes);
            setCurrPageBothTypes(currPageBothTypes + 1 )

            // @ts-ignore
            setRenderedTalentsBothTypes([...renderedTalentsBothTypes, ...response.data.data]);

            setTalentsBothTypesPageNumber(talentsBothTypesPageNumber + 1)
            setTalentsBothTypesTotal(response.data.total - 12 )
        }

        catch (ex) {
            console.error(ex)
        } finally {

            setLoadingBothTypes(false)
        }

    }
    useEffect(() => {

        getTalentIndexData().then(response => {
            setPage(response.data.page_a)
            setArticles(response.data.articles.data)
            setTalentsPriority(response.data.talents_priority.data)
            setTalents(response.data.talents.data)
            setTalentsBothTypes(response.data.both_types.data)
            setShowLoader(false)

        })



    }, [ t , renderedTalentsPriority , talentsPriorityPageNumber , talentsPriorityTotal , prevPagePriority, currPagePriority,
        renderedTalentsBothTypes , talentsBothTypesPageNumber , talentsBothTypesTotal , prevPageBothTypes, currPageBothTypes ,
        lastPageBothTypes , lastPagePriority , showLoader])






    return (
        <Fragment>
            <SocialMeta title ={t('socialMeta.talent.titleIndex' )}
                        description ={''}
                        image={ 'https://eeme.io/assets/img/logo_social.png'}
                        name={t('socialMeta.talent.descriptionIndex' )}
                        link={ `/${currentLanguageCode}/talent`}
                        index={true}

            />
            <Header  page={TALENT_INDEX_PAGE_ID} href={currentLanguageCode === 'en' ? '/ar/talent' : "/en/talent"}/>


            <section className="">
                {showLoader && <Loader />}
                <div className="header-block pt-100 pb-50 bdr-btm secondary-bg">
                    <div className="container">
                        <div className="row justify-content-between">
                            <div className="col-lg-6 col-centered pt-20">
                                <h1 className="text-primary title-font-bold fs-31 text-uppercase">
                                    {t('talentIndexMainTitle')}

                                </h1>
                            </div>
                            <div className="col-lg-6 pt-20">
                                <div className='video-container padding-btm-82'>
                                    <div className="video-wrapper">
                                        <video
                                            src={`${STORAGE_LINK}/pages_videos/5-video-20221128142746.mp4`}
                                            autoPlay loop controls muted
                                            poster={`${STORAGE_LINK}/pages_videos/5-video-20221128142746.png`}/>

                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
                <div className="articles bg-main">
                    <div className="pt-75 pb-50 bdr-btm">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-4 pb-30">
                                    {articles && articles?.slice(0, 2).map((article: any) => (
                                        <AsideArticle article={article} key={article.id}  link={'talent'}/>
                                    ))}

                                </div>
                                <div className="col-md-8">
                                    <div className="articles">
                                        <div className="container">
                                            {articles && articles?.slice(2, 3).map((article: any) => (
                                               <HorizontalArticle article={article}  key={article.id}  link={'talent'}/>
                                                ))}
                                            <div className='row pt-20'>
                                            {articles && articles?.slice(3, 6).map((article: any) => (
                                            <VerticalArticle article={article}  key={article.id}  link={'talent'}/>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4 pb-30">
                                    {articles && articles?.slice(6, 8).map((article: any) => (
                                        <AsideArticle article={article}  key={article.id}  link={'talent'}/>
                                    ))}
                                </div>
                                <div className="col-md-8">
                                    <div className="articles">
                                        <div className="container">
                                            {articles && articles?.slice(8, 9).map((article: any) => (
                                                <HorizontalArticle article={article}  key={article.id}  link={'talent'}/>
                                            ))}
                                            <div className='row pt-20'>
                                            {articles && articles?.slice(9, 12).map((article: any) => (
                                                <VerticalArticle article={article}  key={article.id}  link={'talent'}/>
                                            ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4 pb-30">
                                    {articles && articles?.slice(12, 14).map((article: any) => (
                                        <AsideArticle article={article}  key={article.id}  link={'talent'}/>
                                    ))}

                                </div>
                                <div className="col-md-8">
                                    <div className="articles">
                                        <div className="container">
                                            {articles && articles?.slice(14, 15).map((article: any) => (
                                                <HorizontalArticle article={article}  key={article.id}  link={'talent'}/>
                                            ))}
                                            <div className='row pt-20'>
                                            {articles && articles?.slice(15, 18).map((article: any) => (
                                                <VerticalArticle article={article}  key={article.id }  link={'talent'}/>
                                            ))}
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="bdr-btm pt-30 pb-25">
                    <div className="">
                        <div className="container">
                            <div className="">
                                <h3 className="title-color title-font-bold">{t('featured')} </h3>
                                <div className="row justify-content-center pt-25">
                                    {talentsPriority?.length > 0 &&
                                        talentsPriority.map((talent: any) => (
                                            <TalentCard  talent={talent} key={talent.id} />
                                        ))}

                                    {renderedTalentsPriority && renderedTalentsPriority?.length > 0 &&
                                        renderedTalentsPriority.map((talent: any , index) => (
                                            <TalentCard  talent={talent} key={talent.id  } />
                                        ))}

                                </div>




                                {lastPagePriority !== currPagePriority  ? (
                                    <div className="row pt-30 pb-20">
                                        <div className="col-md-3 col-centered">
                                            <button  className="btn btn-primary w-100" onClick={getMoreFeaturedData}>
                                                {!loading && <span className='indicator-label'>  {t('seeMore')}</span>}
                                                {loading && (
                                                    <span className='indicator-progress' style={{display: 'block'}}>
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
                                                )}

                                            </button>

                                        </div>
                                    </div>
                                ) : ( null )}



                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-75 pb-50 bdr-btm">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-8">
                                <div className="articles">
                                    <div className="container">
                                        {talentsPriority && talentsPriority?.slice(0,1).map((talent: any) => (

                                            <HorizontalArticle  link={'talent'} article={talent.talent_latest_article.article} key={talent.talent_latest_article.id}/>
                                        ))}
                                        <div className="row pt-20">
                                            {talentsPriority && talentsPriority?.slice(1,4).map((talent: any) => (

                                                <VerticalArticle  link={'talent'} article={talent.talent_latest_article.article} key={talent.talent_latest_article.id}/>
                                            ))}
                                        </div>



                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                {talentsPriority && talentsPriority?.slice(4,6).map((talent: any) => (
                                    <AsideArticle  link={'talent'} article={talent.talent_latest_article.article} key={talent.talent_latest_article.id}/>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bdr-btm pt-30 pb-25">
                    <div className="">
                        <div className="container">
                            <div className="">
                                <h3 className="title-color title-font-bold">{t('newOnEeme')} </h3>
                                <div className="row justify-content-center pt-25">
                                    {talents?.length > 0 &&
                                        talents.map((talent: any) => (
                                            <TalentCard  talent={talent} key={talent.id} />
                                        ))}

                                </div>



                            </div>
                        </div>
                    </div>
                </div>

                <div className="bdr-btm pt-30 pb-25">
                    <div className="">
                        <div className="container">
                            <div className="">
                                <h3 className="title-color title-font-bold">{t('businessShoutout')} </h3>
                                <div className="row justify-content-center pt-25">
                                    {talentsBothTypes?.length > 0 &&
                                        talentsBothTypes.map((talent: any) => (
                                            <TalentCard  talent={talent} key={talent.id} />
                                        ))}

                                    {renderedTalentsBothTypes && renderedTalentsBothTypes?.length > 0 &&
                                        renderedTalentsBothTypes.map((talent: any ) => (
                                            <TalentCard  talent={talent} key={talent.id  } />
                                        ))}

                                </div>


                                {lastPageBothTypes !== currPageBothTypes  ? (
                                    <div className="row pt-30 pb-20">
                                        <div className="col-md-3 col-centered">
                                            <button  className="btn btn-primary w-100" onClick={getMoreBothTypesData}>
                                                {!loadingBothTypes && <span className='indicator-label'>  {t('seeMore')}</span>}
                                                {loadingBothTypes && (
                                                    <span className='indicator-progress' style={{display: 'block'}}>
                                                          <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                                     </span>
                                                )}

                                            </button>

                                        </div>
                                    </div>
                                ) : ( null )}


                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-75 pb-50 bdr-btm">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-8">
                                <div className="articles">
                                    <div className="container">
                                        {talentsBothTypes && talentsBothTypes?.slice(0,1).map((talent: any) => (

                                            <HorizontalArticle  link={'talent'} article={talent.talent_latest_article.article} key={talent.talent_latest_article.id}/>
                                        ))}
                                        <div className="row pt-20">
                                            {talentsBothTypes && talentsBothTypes?.slice(1,4).map((talent: any) => (

                                                <VerticalArticle  link={'talent'} article={talent.talent_latest_article.article} key={talent.talent_latest_article.id}/>
                                            ))}
                                        </div>



                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                {talentsBothTypes && talentsBothTypes?.slice(4,6).map((talent: any) => (
                                    <AsideArticle  link={'talent'} article={talent.talent_latest_article.article} key={talent.talent_latest_article.id}/>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>





            </section>
            <Footer/>
        </Fragment>
    )
        ;
}

export default TalentIndexPage;




