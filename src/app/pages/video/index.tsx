import React, {Fragment, FC,  useState, useEffect} from 'react';
import {useTranslation} from "react-i18next";
import Cookies from "js-cookie";
import {Link, useParams} from "react-router-dom";
import {getVideoIndexData} from "../../core/video/requests";
import {Category} from "../../models/misc/Category";
import {AgencyPage} from "../../models/agency/AgencyPage";
import Header from "../../components/header";
import Footer from "../../components/footer";
import {Article} from "../../models/article/Article";
import {Player} from "video-react";
import {STORAGE_LINK} from "../../helpers/crud-helper/consts";
import Articles from "../../components/includes/talent/articles";
import {SocialMeta} from "../../components/includes/social-meta/social-meta";
import Loader from "../../components/includes/loader/loader";


const VideShowPage: FC = () => {
    const [articlesTotal , setArticlesTotal ] = useState(0)

    const [page , setPage] = useState<AgencyPage | null >()
    const [orderRequest , setOrderRequest] = useState<any>()
    const [talent , setTalent] = useState<any>()
    const [articles , setArticles] = useState<Array<Article> | undefined>([])
    const currentLanguageCode = Cookies.get('i18next') || 'en'
    const { t } = useTranslation()
    const params = useParams()
    const [showLoader, setShowLoader] = useState(true);

    useEffect(() => {

        getVideoIndexData(params.code).then(response => {

            setPage(response.data.data.page_a)

            setOrderRequest(response.data.data.order_request)
            setTalent(response.data.data.talent)
            setArticles(response.data.data.articles.data)

        })


        const timeoutId = setTimeout(() => {
            setShowLoader(false);
        }, 3000); //

        return () => {
            clearTimeout(timeoutId);
        };
    }, [ t, showLoader])



    return (
        <Fragment>
            <SocialMeta title ={t('socialMeta.home.title' )}
                        description ={t('socialMeta.video.description')}
                        image={ talent && talent.image ? talent.image : 'https://eeme.io/assets/img/logo_social.png'}
                        name={t('socialMeta.talent.title' , {talent: currentLanguageCode === 'en' && talent && talent.user && talent.user.name ? talent.user.name.en : currentLanguageCode === 'ar' && talent && talent.user && talent.user.name ? talent.user.name.ar : ""})}
                        link={ `/${currentLanguageCode}/on-boarding`}
                        index={true}

            />


            <Header   href={currentLanguageCode === 'en' ? '/ar/preview/' + params.code + '/video' : '/en/preview/' + params.code + '/video'}/>

            <section>
                {showLoader && <Loader />}
                <div className="header-block pt-100 pb-50 secondary-bg bdr-btm">
                    {orderRequest && orderRequest.order_response && talent && orderRequest.order_response.talent_order && orderRequest.order_response.talent_order.talent_videos &&

                        <div className="container">
                            <div className="row  pb-50 pt-10">
                                <div className="col-md-5">
                                    <h1 className="title-font-bold title-color fs-35">
                                        {t('video.title')}

                                    </h1>
                                    <div className="pt-80">
                                        <h3 className="text-font text-color font-weight-bold">
                                            {t('video.hello',{name: orderRequest.recipient ? orderRequest.recipient : orderRequest.sender})}


                                        </h3>
                                        <div className="text-font text-color font-weight-bold fs-20">
                                            {t('video.readyVideo', {'talent' : currentLanguageCode === 'en' ? talent.user.name.en : talent.user.name.ar})}
                                        </div>

                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="mt-100 mb-3">
                                                    <div className="font-text-bold text-color">
                                                        {t('form.from')}:<Link className="text-primary"
                                                        to={currentLanguageCode === 'en' ? '/en/talent/' + talent.slug.en : '/ar/talent/' + talent.slug.ar}
                                                        > <span
                                                        className="text-capitalize">{currentLanguageCode === 'en' ? talent.user.name.en : talent.user.name.ar}</span>
                                                    </Link>
                                                </div>
                                            </div>
                                            <div>
                                                <Link className=""  to={currentLanguageCode === 'en' ? '/en/talent/' + talent.slug.en : '/ar/talent/' + talent.slug.ar}>
                                                <div className="row bg-main">
                                                    <div className={`col-md-4  ${currentLanguageCode === 'en' ? 'ps-lg-0' : 'pe-lg-0'}`}>
                                                        {articles && articles.length > 0 ?
                                                        <div className="">
                                                            <img className="bdr-br bdr-bl bdr-tl bdr-tr w-100" src={articles[0].image} alt={talent.user.name.en} />
                                                        </div>
                                                       :
                                                        <div className="">
                                                            <img className="bdr-br bdr-bl bdr-tl bdr-tr w-100" src={talent.image} alt={talent.user.name.en} />
                                                        </div>
                                                       }
                                                    </div>
                                                    <div className="col-md-5 data-bg ">
                                                        <div className="data-p">
                                                            <p className="title-color title-font" >{currentLanguageCode === 'en' ? talent.user.name.en : talent.user.name.ar}<span className=""><i className="far fa-check-circle bg-primary text-white bdr-50 me-2 ms-2 "></i></span></p>
                                                            <div className="talent-categories">
                                                                <ul className="p-0 m-0">
                                                                    {talent && talent.categories && talent.categories.length > 0 && talent.categories.slice(0,1).map((category:any) => (
                                                                        category && currentLanguageCode === 'en' ?
                                                                            <li className="" key={category.id}>  {category.name.en}</li>
                                                                            :
                                                                            category  && currentLanguageCode === 'ar' ?
                                                                                <li className="" key={category.id}>  {category.name.ar}</li>
                                                                                :
                                                                                null

                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div></Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 col-9 pt-30 ">
                                    <div className="font-text-bold text-color fs-31">
                                        {orderRequest.recipient ?
                                            <span>  {t('form.to')}: {orderRequest.recipient}</span>
                                            :
                                            <span> {t('form.to')}: {orderRequest.sender}</span>
                                        }
                                    </div>
                                    <div className='mt-3'>
                                        <div className="video-container bdr-tl bdr-tr">

                                            {orderRequest.order_response.talent_order.talent_videos[0] &&
                                                <Player playsInline poster={`${STORAGE_LINK}/${orderRequest.order_response.talent_order.talent_videos[0]?.video?.poster}`}
                                                        src={`${STORAGE_LINK}/${orderRequest.order_response.talent_order.talent_videos[0]?.video?.link}`}/>
                                            }
                                        </div>

                                        <div className="pt-20">
                                            <a href={`${STORAGE_LINK}/${orderRequest.order_response.talent_order.talent_videos[0]?.video?.link}`}
                                               title="Download video" className="btn btn-primary p-10 w-100">{t('button.downloadVideo')}</a>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-1 col-3  pt-80">
                                    <div className="social-container ">
                                        <a
                                            target="_blank"
                                            href={`https://fb.com/sharer.php?u=https://eeme.io/en/preview/${orderRequest.code}/video`}
                                            rel="noreferrer"
                                        >
                                       <i className="fab fa-facebook-f"></i></a>
                                        <a className="bg-purple"  target="_blank" href={`https://twitter.com/intent/tweet?url==https://eeme.io/en/preview/${orderRequest.code}/video`} title="Share on twitter"><i className="fab fa-twitter"></i></a>

                                    </div>
                                </div>

                            </div>
                        </div>
                    }

                </div>

                {articles &&
                    <Articles articles={articles} total={articlesTotal} talent={talent}  link={'talent'}/>

                }

            </section>

            <Footer/>

        </Fragment>
    )
        ;
}

export default VideShowPage;




