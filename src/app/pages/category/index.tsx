import React, {Fragment, FC,  useState, useEffect} from 'react';
import Header from '../../../app/components/header';
import AsideArticle from "../../../app/components/includes/articles/aside";
import HorizontalArticle from "../../../app/components/includes/articles/horizontal";
import VerticalArticle from "../../../app/components/includes/articles/vertical";
import TalentCard from "../../../app/components/includes/talent/card";
import {useTranslation} from "react-i18next";
import Cookies from "js-cookie";
import {Talent} from "../../models/talent/Talent";
import {Category} from "../../models/misc/Category";
import {CATEGORY_INDEX_PAGE, STORAGE_LINK} from "../../helpers/crud-helper/consts";
import {AgencyPage} from "../../models/agency/AgencyPage";
import { useParams} from "react-router-dom";
import {getCategoryIndexData, getMoreTalentsData} from "../../core/category/requests";
import {getMoreFeatured} from "../../core/talent/requests";

import HTMLReactParser from 'html-react-parser'
import Footer from "../../components/footer";
import {SocialMeta} from "../../components/includes/social-meta/social-meta";
import Loader from "../../components/includes/loader/loader";
import Page404 from "../404";

const CategoryIndexPage: FC = () => {
    const [articles , setArticles] = useState<any | undefined>()
    const [category , setCategory] = useState<any | undefined>()
    const [talents , setTalents] = useState<Array<Talent> | any>([])
    const [page , setPage] = useState<AgencyPage | null >()
    const currentLanguageCode = Cookies.get('i18next') || 'en'

    const [currPagePriority, setCurrPagePriority] = useState(1);
    const [prevPagePriority, setPrevPagePriority] = useState(0);
    const [lastPagePriority, setLastPagePriority] = useState(0);
    const [talentsPriorityTotal , setTalentsPriorityTotal ] = useState(0)
    const [talentsPriorityPageNumber , setTalentsPriorityPageNumber] = useState(2)
    const [renderedTalentsPriority , setRenderedTalentsPriority] = useState([])


    const [currPageArticles, setCurrPageArticles] = useState(1);
    const [prevPageArticles, setPrevPageArticles] = useState(0);
    const [lastPageArticles, setLastPageArticles] = useState(0);
    const [renderedArticles , setRenderedTalentsArticles] = useState([])
    const [articlesTotal , setArticlesTotal ] = useState(0)
    const [articlesPageNumber , setArticlesPageNumber] = useState(2)
    const [showLoader, setShowLoader] = useState(true);
    const [loadingArticles , setLoadingArticles] = useState(false)
    const [loading , setLoading] = useState(false)
    const { t } = useTranslation()
    const [error, setError] = useState(false);
    const getMoreData = async () => {
        try {
            setLoading(true)
            const response = await getMoreTalentsData(category?.slug, talentsPriorityPageNumber , 1)
            setLastPagePriority(response.data.last_page);

            if (!response.data.data.length) {
                return;
            }
            setPrevPagePriority(currPagePriority);
            setCurrPagePriority(currPagePriority + 1 )

            // @ts-ignore
            setRenderedTalentsPriority([...renderedTalentsPriority, ...response.data.data]);

            setTalentsPriorityPageNumber(talentsPriorityPageNumber + 1)
        }

        catch (ex) {
            console.error(ex)
        } finally {

            setLoading(false)
        }

    }

    const getMoreArticles = async () => {
        try {
            setLoadingArticles(true)
            const response = await getMoreTalentsData(category?.slug, articlesPageNumber , 2)
            setLastPageArticles(response.data.last_page);

            if (!response.data.data.length) {
                return;
            }
            setPrevPageArticles(currPageArticles);
            setCurrPageArticles(currPageArticles + 1 )

            // @ts-ignore
            setRenderedTalentsArticles([...renderedArticles, ...response.data.data]);

            setArticlesPageNumber(articlesPageNumber + 1)

        }

        catch (ex) {
            console.error(ex)
        } finally {

            setLoadingArticles(false)
        }

    }


    const params = useParams()
    useEffect(() => {

        getCategoryIndexData(params.category).then(response => {
            if(response.status === 200 ){
                setError(false)
                setCategory(response.data.category)
                setPage(response.data.page_a)

                setTalents(response.data.talents.data)
                setTalentsPriorityTotal(response.data.talents.total )
                setShowLoader(false)
                // setArticles(response.data.articles.data)
                // setArticlesTotal(response.data.articles.total )
            }else{
                setError(true)
            }


        })


    }, [ t ,params.category,lastPagePriority,currPagePriority,prevPagePriority,renderedTalentsPriority,talentsPriorityPageNumber ,
                  lastPageArticles,currPageArticles,prevPageArticles,renderedArticles,articlesPageNumber , showLoader])

    if(error){
        return (<Page404 />)
    }

    return (
        <Fragment>
            <SocialMeta title={currentLanguageCode === 'en' && category && category.name ? category.name.en + " | " + t('socialMeta.home.title') : category && category.name ? category.name.ar + " | " + t('socialMeta.home.title') : t('socialMeta.home.title')}
                        description={page && page?.meta && page?.meta.description && currentLanguageCode === 'en' ? HTMLReactParser(page?.meta.description.en.replace(/(<([^>]+)>)/ig, '').substring(0, 200)) : page && page?.meta && page?.meta.description && currentLanguageCode === 'ar' ? HTMLReactParser(page?.meta.description.ar.replace(/(<([^>]+)>)/ig, '').substring(0, 200)) : currentLanguageCode === 'en' && category && category.name ? category.name.en + " | " + t('socialMeta.home.title') : currentLanguageCode === 'ar' &&   category && category.name ? category.name.ar + " | " + t('socialMeta.home.title') : t('socialMeta.home.title')}
                        image={'https://eeme.io/assets/img/logo_social.png'} name={t('webName')}
                        link={`/${currentLanguageCode}/category/${params.category}`}
                        index={true} />

            <Header  page={CATEGORY_INDEX_PAGE} category={category?.slug} href={currentLanguageCode === 'en' ? '/ar/category/' + params.category : '/en/category/'+ params.category}/>

            <section className="">
                {showLoader && <Loader />}
                <div className="header-block pt-100 pb-50 bdr-btm secondary-bg">
                    <div className="container">
                        <div className="row justify-content-between">

                            <div className={`${page?.video?.link ? 'col-lg-6 col-centered pt-40' : 'col-lg-12 col-centered pt-40 pb-20'}`}>
                                    {category && currentLanguageCode === 'en'  ? (
                                        <h1 className="text-primary title-font-bold fs-31 text-uppercase">


                                            {t('categoryWelcomeStatement'  )}
                                            { HTMLReactParser(category?.name?.en) }
                                        </h1>
                                    ) : (
                                        <h1 className="text-primary title-font-bold fs-31 text-uppercase">
                                          {t('categoryWelcomeStatement' )}
                                            {category?.name?.ar }
                                        </h1>) }

                            </div>
                            {page?.video?.link ? (
                            <div className="col-lg-6 pt-20">
                                <div className='video-container padding-btm-82'>
                                    <div className="video-wrapper">
                                        <video
                                            src={`${STORAGE_LINK}/${page?.video?.link}`}
                                            autoPlay loop controls muted
                                            poster={`${STORAGE_LINK}/${page?.video?.poster}`}/>

                                    </div>
                                </div>
                            </div>
                                ) : null }


                        </div>
                    </div>
                </div>
                {talents && talents.length > 0 ? (
                    <div className="articles bg-main">
                        <div className="pt-75 pb-50 bdr-btm">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-4 pb-30">
                                        {talents && talents?.slice(0,2).map((talent: any) => (
                                         talent.talent_latest_article.article != null ? (
                                            <AsideArticle article={ talent.talent_latest_article.article} talent={talent} key={talent.talent_latest_article.id} link={'talent'}/>
                                            ) : null
                                        ))}

                                    </div>
                                    <div className="col-md-8">
                                        <div className="articles">
                                            <div className="container">
                                                {talents && talents?.slice(2,3).map((talent: any) => (
                                                    talent.talent_latest_article.article != null ? (
                                                    <HorizontalArticle article={talent.talent_latest_article.article} talent={talent} key={talent.talent_latest_article.id} link={'talent'}/>
                                                    ) : null
                                                ))}
                                                <div className='row pt-20'>
                                                    {talents && talents?.slice(3,6).map((talent: any) => (
                                                        talent.talent_latest_article.article != null ? (
                                                        <VerticalArticle article={talent.talent_latest_article.article} talent={talent} key={talent.talent_latest_article.id} link={'talent'}/>
                                                        ) : null
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4 pb-30">
                                        {talents && talents?.slice(6,8).map((talent: any) => (
                                            talent.talent_latest_article.article != null ? (
                                            <AsideArticle article={talent.talent_latest_article.article} talent={talent} key={talent.talent_latest_article.id} link={'talent'}/>
                                            ) : null
                                        ))}
                                    </div>
                                    <div className="col-md-8">
                                        <div className="articles">
                                            <div className="container">
                                                {talents && talents?.slice(8,9).map((talent: any) => (
                                                    talent.talent_latest_article.article != null ? (
                                                    <HorizontalArticle article={talent.talent_latest_article.article} talent={talent} key={ talent.talent_latest_article.id} link={'talent'}/>
                                                    ) : null
                                                ))}
                                                <div className='row pt-20'>
                                                    {talents && talents?.slice(9,12).map((talent: any) => (
                                                        talent.talent_latest_article.article != null ? (
                                                        <VerticalArticle article={ talent.talent_latest_article.article} talent={talent} key={ talent.talent_latest_article.id} link={'talent'}/>
                                                        ) : null
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4 pb-30">
                                        {talents && talents?.slice(12,14).map((talent: any) => (
                                            talent.talent_latest_article.article != null ? (
                                            <AsideArticle article={ talent.talent_latest_article.article} talent={talent} key={ talent.talent_latest_article.id} link={'talent'}/>

                                            ) : null

                                        ))}

                                    </div>
                                    <div className="col-md-8">
                                        <div className="articles">
                                            <div className="container">
                                                {talents && talents?.slice(14,15).map((talent: any) => (
                                                    talent.talent_latest_article.article != null ? (
                                                    <HorizontalArticle article={ talent.talent_latest_article.article} talent={ talent} key={ talent.talent_latest_article.id} link={'talent'}/>
                                                    ) : null

                                                ))}
                                                <div className='row pt-20'>
                                                    {talents && talents?.slice(15,18).map((talent: any) => (
                                                        talent.talent_latest_article.article != null ? (
                                                        <VerticalArticle article={ talent.talent_latest_article.article} talent={talent}  key={ talent.talent_latest_article.id} link={'talent'}/>
                                                        ): null

                                                    ))}
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null }


                {talents && talents.length > 0 ? (
                <div className="bdr-btm pt-30 pb-25">
                    <div className="">
                        <div className="container">
                            <div className="">
                                <h3 className="title-color title-font-bold">{t('featured')} </h3>
                                <div className="row justify-content-center pt-25">
                                    {talents && talents?.length > 0 &&
                                        talents.slice(0,12).map((talent: any) => (
                                            <TalentCard  talent={talent} key={talent.id} />
                                        ))}

                                    {renderedTalentsPriority && renderedTalentsPriority?.length > 0 &&
                                        renderedTalentsPriority.map((talent: any , index) => (
                                            <TalentCard  talent={talent} key={talent.id  } />
                                        ))}
                                </div>




                                {talentsPriorityTotal > 12  && lastPagePriority !== currPagePriority ? (
                                    <div className="row pt-30 pb-20">
                                        <div className="col-md-3 col-centered">
                                            <button  className="btn btn-primary w-100" onClick={getMoreData}>
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
                    ) : null }

                {talents && talents.length > 18 ? (
                <div className="pt-75 pb-50 bdr-btm">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-8">
                                <div className="articles">
                                    <div className="container">
                                        {talents && talents?.slice(18,19).map((talent: any) => (
                                            talent.talent_latest_article.article != null ? (
                                            <HorizontalArticle article={talent.talent_latest_article.article} talent={talent} key={talent.talent_latest_article.id} link={'talent'}/>

                                            ) : null
                                        ))}
                                        <div className="row pt-20">
                                            {talents && talents?.slice(19,22).map((talent: any) => (
                                                talent.talent_latest_article.article!= null ? (
                                                <VerticalArticle article={talent.talent_latest_article.article} talent={talent} key={talent.talent_latest_article.id} link={'talent'}/>

                                                ) : null
                                            ))}
                                        </div>



                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                {talents && talents?.slice(22,24).map((talent: any) => (
                                    talent.talent_latest_article.article != null ? (
                                    <AsideArticle article={talent.talent_latest_article.article} talent={talent} key={talent.talent_latest_article.id} link={'talent'}/>

                                    ) : null ))}
                            </div>



                        </div>
                        <div className="row">

                            {renderedTalentsPriority && renderedTalentsPriority?.length > 0 &&
                                renderedTalentsPriority.map((talent: any , index) => (
                                    talent.talent_latest_article.article ?
                                    <VerticalArticle
                                        article={talent.talent_latest_article.article}
                                        link={'talent'}
                                        talent={talent}
                                        key={ index }
                                        colMd3={true}/> : null

                                )) }

                        </div>

                        {talentsPriorityTotal > 12  && lastPagePriority !== currPagePriority ? (
                            <div className="row pt-30 pb-20">
                                <div className="col-md-3 col-centered">
                                    <button  className="btn btn-primary w-100" onClick={getMoreData}>
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
                    ) : null }

            </section>
            <Footer/>
        </Fragment>
    )
        ;
}

export default CategoryIndexPage;




