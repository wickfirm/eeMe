import React, {Fragment, FC,  useState, useEffect} from 'react';
import Header from '../../../app/components/header';
import {useTranslation} from "react-i18next";
import {getArticleIndexData, getMoreTalentsArticles} from "../../core/talent/requests";
import {Category} from "../../models/misc/Category";
import {AgencyPage} from "../../models/agency/AgencyPage";
import {Article} from "../../models/article/Article";
import {useParams} from "react-router-dom";
import Cookies from "js-cookie";
import {ARTICLE_PAGE_ID, STORAGE_LINK} from "../../helpers/crud-helper/consts";
import moment from 'moment';
import { Player } from 'video-react';
import HorizontalArticle from "../../components/includes/articles/horizontal";
import VerticalArticle from "../../components/includes/articles/vertical";
import AsideArticle from "../../components/includes/articles/aside";
import Footer from "../../components/footer";
import HTMLReactParser from "html-react-parser";
import {Talent} from "../../models/talent/Talent";
import {getMoreTalentsData} from "../../core/category/requests";
import {Link} from "react-router-dom";
import {SocialMeta} from "../../components/includes/social-meta/social-meta";
import Loader from "../../components/includes/loader/loader";
import Page404 from "../404";


const TalentArticlePage: FC = () => {

    const [page , setPage] = useState<AgencyPage | null >()
    const [article , setArticle] = useState<any> ()
    const [talent , setTalent] = useState<any> ()
    const [showLoader, setShowLoader] = useState(true);
    const [video , setVideo] = useState<any> ()

    const [articles , setArticles] = useState<Array<any> | undefined>([])
    const [loading , setLoading] = useState(false)
    const [talentsPriority , setTalentsPriority ] = useState<Array<Talent> | any>([])
    const [articlesTotal , setArticlesTotal ] = useState(0)
    const [currPagePriority, setCurrPagePriority] = useState(1);
    const [prevPagePriority, setPrevPagePriority] = useState(0);
    const [lastPagePriority, setLastPagePriority] = useState(0);
    const [talentsPriorityPageNumber , setTalentsPriorityPageNumber] = useState(2)
    const [renderedTalentsPriority , setRenderedTalentsPriority] = useState([])
    const [error, setError] = useState(false);
    const { t } = useTranslation()
    const currentLanguageCode = Cookies.get('i18next') || 'en'
    const params = useParams()
    const getMoreArticles = async () => {
        try {
            setLoading(true)
            const response = await getMoreTalentsArticles(params?.talent ,currentLanguageCode, params?.article , talentsPriorityPageNumber )


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



    useEffect(() => {

        getArticleIndexData(params.talent , params.article ,currentLanguageCode).then(response => {
            if(response.status === 200 ) {
                setError(false)
                setPage(response.data.page_a)
                setArticle(response.data.article)
                setArticles(response.data.articles.data)
                setArticlesTotal(response.data.articles.total)

                setVideo(response.data.video)
                setTalent(response.data.talent)
                setShowLoader(false)
            }else{
                setError(true)
            }
        })

    }, [ t , showLoader , params.talent , params.article , renderedTalentsPriority , talentsPriorityPageNumber , articlesTotal , prevPagePriority, currPagePriority, lastPagePriority])


    if(error){
        return (<Page404 />)
    }


    return (
        <Fragment>

            <SocialMeta title ={currentLanguageCode === 'en' && talent && talent.user && talent.user.name && article && article.title ? talent.user.name.en + " | " + HTMLReactParser(article.title.en.replace(/(<([^>]+)>)/ig, '')) + " | " + t('webName') : currentLanguageCode === 'ar' && talent && talent.user && talent.user.name && article && article.title ? talent.user.name.ar + " | " + HTMLReactParser(article.title.ar.replace(/(<([^>]+)>)/ig, '')) + " | " + t('webName')  : t('socialMeta.home.title')}
                        description ={currentLanguageCode === 'en' && talent && talent.user && talent.user.name && article &&  article.description ? talent.user.name.en + " | " + HTMLReactParser( article.description.en.replace(/(<([^>]+)>)/ig, '')) + " | " + t('webName') : currentLanguageCode === 'ar' && talent && talent.user && talent.user.name && article && article.description ? talent.user.name.ar + " | " + HTMLReactParser( article.description.ar.replace(/(<([^>]+)>)/ig, '')) + " | " + t('webName')  : t('socialMeta.home.title')}
                        image={article && article.image ? article.image : 'https://eeme.io/assets/img/logo_social.png'} name={t('webName')}
                        link={currentLanguageCode === 'en' ? `/${currentLanguageCode}/talent/${params.talent}/${params.article}` : currentLanguageCode === 'ar' ? `/${currentLanguageCode}/talent/${params.article}/${params.talent}` : ""}
                        index={true} />

            <Header page={ARTICLE_PAGE_ID} href={currentLanguageCode === 'en' && talent && article ? '/ar/talent/' + article?.slug.ar + '/' + talent?.slug.ar  : currentLanguageCode === 'ar' && talent && article ? '/en/talent/' + talent?.slug.en + '/' + article?.slug.en : ""} article={currentLanguageCode === 'en' ? article?.slug.ar : article?.slug.en} talent={currentLanguageCode === 'en' ? talent?.slug.ar : talent?.slug.en}/>



            <section className="">
                {showLoader && <Loader />}
                <div className="header-block pt-100 pb-50 bdr-btm secondary-bg">
                    <div className="container">
                        <div className="row justify-content-between pt-20">
                            <div className={`${talent?.talent_order_types.length > 0 ? 'col-md-7' : 'col-md-10'}`}>
                                <div>
                                    <div>
                                        {article?.title?.en && currentLanguageCode === 'en' ?
                                            <h1 className="title-font-bold title-color fs-31"
                                                dangerouslySetInnerHTML={{__html: article.title.en as string}}></h1>
                                         :
                                            article?.title?.ar && currentLanguageCode === 'ar' ?
                                            <h1 className="title-font-bold title-color fs-31"
                                                dangerouslySetInnerHTML={{__html: article.title.ar as string}}></h1>
                                                : null

                                        }
                                    </div>
                                    <div >
                                        <div className="category-talent">
                                            <ul >
                                                <li >

                                                    <Link className="text-color text-capitalize"
                                                       to={currentLanguageCode === 'en' ? `/en/talent/${talent?.slug?.en}` :  `/ar/talent/${talent?.slug?.ar}` }>

                                                        {talent && currentLanguageCode === 'en' ?
                                                            talent?.user?.name.en
                                                            :   talent?.user?.name.ar }
                                                            </Link>


                                                </li>
                                                {talent?.categories.length > 0 && talent.categories.map((category: any) => (
                                                    <li key={category?.id}>{ currentLanguageCode === 'en' ? category?.name.en :   category?.name.ar}</li>
                                                ))}
                                                {talent?.country ?
                                                <li>{talent.country}</li> : null }
                                            </ul>
                                        </div>
                                        <p>{moment(article?.created_at).format('MMMM Do YYYY')
                                        }</p>

                                    </div>
                                </div>

                                    <div className="mt-40">
                                        <div className="">
                                            {article && article?.image &&    <img className="w-100 bdr-tl bdr-tr bdr-bl bdr-br" src={`${article?.image}`} /> }
                                        </div>

                                        <div className="article-description pt-20">
                                            <p dangerouslySetInnerHTML={{__html: currentLanguageCode === 'en' ? article?.description?.en : article?.description?.ar}} />
                                        </div>
                                    </div>


                                    <div className="share-block pt-20 mb-3">
                                        <div className="talent-social-links">
                                            <p className="pb-10 font-text-bold inverse-color fs-20">{t('articleShare')}</p>
                                            <ul className="pl-0 ">
                                                <li className="fs-20">
                                                    <a
                                                       target="_blank"
                                                       href={`https://fb.com/sharer.php?u=https://eeme.io/en/talent/${params.talent}/${params.article}`}
                                                       rel="noreferrer">
                                                        <i className="fab fa-facebook-f"></i>
                                                    </a>
                                                </li>
                                                <li className="fs-20">
                                                    <a  target="_blank"
                                                        href={`https://twitter.com/intent/tweet?url=https://eeme.io/en/talent/${params.talent}/${params.article}`}
                                                        rel="noreferrer">
                                                        <i className="fab fa-twitter"></i>
                                                    </a>
                                                </li>
                                                <li className="fs-20">
                                                    <a href={`https://www.linkedin.com/shareArticle?mini=true&url=https://eeme.io/en/talent/${params.talent}/${params.article}`}
                                                    target="_blank">
                                                        <i className="fab fa-linkedin-in"></i>
                                                    </a>
                                                </li>
                                                <li className="fs-20">
                                                    <a href={`whatsapp://send?text=https://eeme.io/en/talent/${params.talent}/${params.article}`}>
                                                        <i className="fab fa-whatsapp"></i>
                                                    </a>

                                                </li>


                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                    { talent?.talent_order_types.length > 0   ?

                                        (
                                    <div className="col-md-4 ">
                                        <div >
                                            <div className="title-font-bold title-color fs-20">
                                                {t('requestVideo')}
                                                <span
                                                    className="text-capitalize">{currentLanguageCode === 'en' ? talent?.user?.name.en : talent?.user?.name.ar}! </span>

                                            </div>
                                        </div>
                                        <div className=" pt-30">
                                            {video !== null ? (
                                                <Player

                                                        playsInline
                                                        poster={`${STORAGE_LINK}/${video?.video?.poster}`}
                                                        src={`${STORAGE_LINK}/${video?.video?.link}`}
                                                    />

                                            ) : (<img className="bdr-bl bdr-br bdr-tl bdr-tr w-100 " src={`${talent?.image}`} />)}


                                        </div>

                                        <div className="pt-20">
                                            {talent?.is_available && talent?.is_verified === 1}

                                            <Link to={currentLanguageCode === 'en' ? '/en/talent/' + talent.slug.en + '/book' : '/ar/talent/' + talent.slug.ar + '/book'} className="btn btn-primary w-100">{t('book')}</Link>
                                        </div>
                                    </div>
                                        ) : (null )}

                            </div>
                        </div>
                    </div>
                {articles  && articles?.length > 0 ? (
                <div className="articles pt-50 pb-50 bg-main">
                    <div className="container">
                        <div className="row pb-10">
                            <div className="col-md-12 ">
                                <div className="">
                                    <h3 className="title-font-bold title-color">{t('moreOn')} <span
                                        className="text-capitalize">{currentLanguageCode === 'en' ? talent?.user.name.en :  talent?.user.name.ar}</span></h3>
                                </div>
                            </div>
                        </div>

                            <div className="row">
                                <div className="col-lg-8 col-md-12">
                                    <div className="articles">
                                        <div className="container">
                                            {articles && articles?.slice(0, 1).map((article: any) => (
                                                <HorizontalArticle article={article}  key={article.id} talent={talent}  link={'talent'}/>
                                            ))}
                                            <div className='row pt-20'>
                                                {articles && articles?.slice(1, 4).map((article: any) => (
                                                    <VerticalArticle article={article}  key={article.id} talent={talent}  link={'talent'}/>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-12">
                                    {articles && articles?.slice(4, 6).map((article: any) => (
                                        <AsideArticle article={article}  key={article.id}  talent={talent}  link={'talent'}/>
                                    ))}

                                </div>

                            </div>

                        {renderedTalentsPriority  &&  renderedTalentsPriority?.length > 0 ? (
                        <div className="row">
                            {
                                renderedTalentsPriority?.map((article: any  ) => (
                                    article != null ? (
                                        <VerticalArticle
                                            article={article}
                                            link={'talent'}
                                            key={article.id}
                                            colMd3={true}
                                            talent={talent}/>
                                    ) : null
                                ))}
                        </div>
                            ) : null }

                    </div>
                </div>
                ) : null }
                {articlesTotal > 6  && lastPagePriority !== currPagePriority ? (
                    <div className="row pt-10 pb-50">
                        <div className="col-md-3 col-centered">
                            <button  className="btn btn-primary w-100" onClick={getMoreArticles}>
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

            </section>
            <Footer/>
        </Fragment>
    );
}

export default TalentArticlePage;




