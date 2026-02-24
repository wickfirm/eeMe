import React, {Fragment, FC,  useState, useEffect} from 'react';
import Header from '../../app/components/header';
import AsideArticle from "../../app/components/includes/articles/aside";
import HorizontalArticle from "../../app/components/includes/articles/horizontal";
import VerticalArticle from "../../app/components/includes/articles/vertical";
import TalentCard from "../../app/components/includes/talent/card";
import {useTranslation} from "react-i18next";
import Cookies from "js-cookie";
import clsx from 'clsx'
import * as Yup from 'yup';
import {useFormik} from "formik";
import {subscribe} from "../core/subscribe/requests";
import {getData, getMoreData} from "../core/home/requests";
import {Article} from "../models/article/Article";
import {Talent} from "../models/talent/Talent";
import {STORAGE_LINK,} from "../helpers/crud-helper/consts";
import {AgencyPage} from "../models/agency/AgencyPage";
import {Link} from "react-router-dom";
import {HOME_PAGE_ID} from "../helpers/crud-helper/consts";
import Footer from "../components/footer";
import {SocialMeta} from "../components/includes/social-meta/social-meta";
import Loader from "../components/includes/loader/loader";
const subscribeSchema = Yup.object().shape({
    email: Yup.string()
        .email('Wrong email format')
        .min(3, 'Minimum 3 symbols')
        .max(50, 'Maximum 50 symbols')
        .required('Email is required'),
})

const initialValues = {
    email: '',
    form_id: 5 ,
}


const Homepage: FC = () => {
    const [loading, setLoading] = useState(false)
    const [isActive, setIsActive] = useState(false);
    const [articles , setArticles] = useState<Array<Article> | any>([])
    const [moreArticles , setMoreArticles] = useState<Array<Article> | any>([])
    const [showLoader, setShowLoader] = useState(true);
    const [talents , setTalents] = useState<Array<Talent> | any>([])

    const [page , setPage] = useState<AgencyPage | null >()

    const currentLanguageCode = Cookies.get('i18next') || 'en'
    const { t } = useTranslation()

    useEffect(() => {


        getData().then(response => {
            console.log(response)
            setArticles(response.data.articles)
            setShowLoader(false);
        })

        setTimeout(() => {
            getMoreData().then(response => {
                setTalents(response.data.talents)
                setMoreArticles(response.data.articles)
        })
    }, 1000);


    }, [ t, showLoader])



    const formik = useFormik({
        initialValues,
        validationSchema: subscribeSchema,
        onSubmit: async (values, {setSubmitting}) => {

            setSubmitting(true)
            try {


                setLoading(true)

                const { data }  =   await subscribe(values)
                if(data === 1 ){
                    setLoading(false)
                    setIsActive(true)

                    setTimeout(function () {
                        setIsActive(false)
                        // resetForm()
                    }, 3500)

                }


            } catch (ex) {
                console.error(ex)
            } finally {
                setSubmitting(true)
                setLoading(false)
            }
        },
    })

    return (
        <Fragment>
            <SocialMeta title={page && page?.meta && page?.meta.title && currentLanguageCode === 'en' ? page?.meta.title.en : page && page?.meta && page?.meta.title && currentLanguageCode === 'ar' ? page?.meta.title.ar : t('socialMeta.home.title')} description={t('socialMeta.home.title')} image={'https://eeme.io/assets/img/logo_social.png'} name={t('webName')} link={`/${currentLanguageCode}`} index={true} />
            <Header page={HOME_PAGE_ID} href={currentLanguageCode === 'en' ? '/ar' : '/en'}/>


            <section className="">

                <div className="header-block pt-100 pb-50 bdr-btm secondary-bg">
                    <div className="container">
                        <div className="row justify-content-between">
                            <div className="col-lg-6 pt-20">
                                <div className='video-container padding-btm-82'>
                                    <div className="video-wrapper">
                                        <video
                                            src={`${STORAGE_LINK}/pages_videos/5-video-20221128142746.mp4`}
                                            autoPlay loop controls muted
                                            poster={`${STORAGE_LINK}/pages_videos/5-video-20221128142746.png`}

                                        />

                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-5 pt-20">
                                <div className="row">
                                    <div className="col-md-12">
                                        <h1 className="inverse-color title-font-bold">
                                            {/*{page?.title && currentLanguageCode === 'en' ?*/}
                                            {/*    page.title.en*/}
                                            {/*    :*/}
                                            {/*    page?.title && currentLanguageCode === 'ar' ?*/}
                                            {/*        page.title.ar*/}
                                            {/*        :*/}
                                            {  ( t('digitalHome') ) }


                                        </h1>
                                        <div className="pt-10">
                                            <p className="inverse-color text-font fs-16">
                                                {t('homeDescription')}

                                            </p>
                                        </div>

                                    </div>
                                </div>
                                <form
                                    className='form w-100 pt-10'
                                    onSubmit={formik.handleSubmit}
                                    noValidate

                                >

                                    <div className="newsletter-form-container pt-4">
                                        <div className={` ${ isActive ? " alert-box d-block" : "alert-box"}`} >
                                            <div className="alert alert-success alert-dismissible fade show"
                                                 role="alert">
                                                {t('newsletterSuccess')}

                                            </div>
                                        </div>

                                        <div className="pl-0">
                                            <div className="col-md-9 pl-0">
                                                <input type="hidden"  {...formik.getFieldProps('form_id')}/>
                                                <div className="pt-20">

                                                    <input type="email"
                                                           placeholder={t('emailAddress') || ""}
                                                           {...formik.getFieldProps('email')}

                                                           className={clsx(
                                                               'form-control email-input',
                                                               {'is-invalid': formik.touched.email && formik.errors.email},
                                                               {
                                                                   'is-valid': formik.touched.email && !formik.errors.email,
                                                               }
                                                           )}
                                                    />
                                                    {formik.touched.email && formik.errors.email && (
                                                        <div className='fv-plugins-message-container'>
                                                            <span role='alert'>{formik.errors.email}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="pt-10 pb-10">
                                                    <button type="submit" className="btn btn-primary w-100"
                                                            disabled={formik.isSubmitting || !formik.isValid}>


                                                        {!loading && <span className='indicator-label'>{t('continue')}</span>}
                                                        {loading && (
                                                            <span className='indicator-progress' style={{display: 'block'}}>
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
                                                        )}
                                                    </button>


                                                </div>
                                            </div>
                                            <div className="form-group pt-10">
                                                <div className="form-check">
                                                    <input className="form-check-input" name="keep_up_to_date"
                                                           type="checkbox"
                                                           id="gridCheck"/>
                                                    {currentLanguageCode === 'ar' ? (
                                                        <label className="form-check-label  ms-1 me-1 pr-25 inverse-color fs-sm"
                                                               htmlFor="gridCheck">
                                                            {t('KeepMeUptoDate')}
                                                        </label>
                                                    ) : (
                                                        <label className="form-check-label  ms-1 me-1  inverse-color fs-sm"
                                                               htmlFor="gridCheck">
                                                            {t('KeepMeUptoDate')}
                                                        </label>
                                                    )}

                                                </div>
                                            </div>
                                        </div>


                                        <div>
                                            <p className="fs-sm inverse-color">
                                                {t('link')}

                                            </p>
                                        </div>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>
                </div>
                {showLoader && <Loader />}


                <div className="articles bg-main">
                    <div className="pt-75 pb-50 bdr-btm">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-4 col-md-12 pb-30">

                                    {articles && articles.length > 0 &&  articles?.slice(0, 2).map((article: any) => ( article &&
                                        <AsideArticle article={article}  key={article.id} link={'talent'} talent={article.talent}/>
                                    )) }


                                </div>
                                <div className="col-lg-8 col-md-12">
                                    <div className="articles">
                                        <div className="container">
                                            {articles && articles.length > 0 &&  articles?.slice(2, 3).map((article: any) => ( article  &&
                                                <HorizontalArticle article={article}  key={article.id}  link={'talent'}  talent={article.talent}/>
                                            ))}
                                            <div className='row pt-20'>
                                                {articles && articles.length > 0 &&  articles?.slice(3, 6).map((article: any) => ( article &&
                                                    <VerticalArticle article={article}  key={article.id}  link={'talent'}  talent={article.talent}/>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-4 col-md-12 pb-30">
                                    {moreArticles && moreArticles.length > 0 &&  moreArticles?.slice(0, 2).map((article: any) => ( article &&
                                        <AsideArticle article={article}  key={article.id}  link={'talent'}  talent={article.talent}/>
                                    ))}
                                </div>
                                <div className="col-lg-8 col-md-12">
                                    <div className="articles">
                                        <div className="container">
                                            {moreArticles && moreArticles.length > 0 &&  moreArticles?.slice(2, 3).map((article: any) => ( article &&
                                                <HorizontalArticle article={article}  key={article.id}  link={'talent'}  talent={article.talent}/>
                                            ))}
                                            <div className='row pt-20'>
                                                {moreArticles && moreArticles.length > 0 &&  moreArticles?.slice(3, 6).map((article: any) => ( article &&
                                                    <VerticalArticle article={article}  key={article.id}  link={'talent'}  talent={article.talent}/>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-4 col-md-12 pb-30">
                                    {moreArticles && moreArticles.length > 0 &&  moreArticles?.slice(6, 8).map((article: any) => ( article &&
                                        <AsideArticle article={article}  key={article.id}  link={'talent'}  talent={article.talent}/>
                                    ))}

                                </div>
                                <div className="col-lg-8 col-md-12">
                                    <div className="articles">
                                        <div className="container">
                                            {moreArticles && moreArticles.length > 0 &&  moreArticles?.slice(8, 9).map((article: any) => ( article &&
                                                <HorizontalArticle article={article}  key={article.id}  link={'talent'}  talent={article.talent}/>
                                            ))}
                                            <div className='row pt-20'>
                                                {moreArticles && moreArticles.length > 0 &&  moreArticles?.slice(9, 12).map((article: any) => ( article &&
                                                    <VerticalArticle article={article}  key={article.id}  link={'talent'}  talent={article.talent}/>
                                                ))}
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-purple">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 text-center quote-block">
                                <h2 className="title-font-bold text-white">{t('qoute1')}</h2>
                                <p className="text-white">- EEME -</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bdr-btm pt-30 pb-25">
                    <div className="">
                        <div className="container">
                            <div className="">
                                <h3 className="title-color title-font-bold">{t('checkProfiles')} </h3>
                                <div className="row justify-content-center pt-25">
                                    {talents && talents.data && talents?.data.length > 0 &&
                                        talents.data.map((talent: any) => (
                                            <TalentCard  talent={talent} key={talent.id} />
                                        ))}


                                </div>

                                <div className="row pt-30 pb-20">
                                    <div className="col-xxl-2 col-lg-2 col-md-3 col-sm-4 col-12 col-centered">
                                        <Link  className="btn btn-primary w-100" to={`/${currentLanguageCode}/talent`}>  {t('seeMore')}</Link>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-75 pb-50 bdr-btm">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8 col-md-12">
                                <div className="articles">
                                    <div className="container">
                                        {moreArticles && moreArticles.length > 0 &&  moreArticles?.slice(12, 13).map((article: any) => ( article &&
                                            <HorizontalArticle article={article}  key={article.id}  link={'talent'}  talent={article.talent}/>
                                        ))}
                                        <div className='row pt-20'>
                                            {moreArticles && moreArticles.length > 0 &&  moreArticles?.slice(13, 16).map((article: any) => ( article &&

                                                <VerticalArticle article={article}  key={article.id}  link={'talent'}  talent={article.talent}/>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-12">
                                {moreArticles && moreArticles.length > 0 &&  moreArticles?.slice(16, 18).map((article: any) => ( article &&
                                    <AsideArticle article={article}  key={article.id}  link={'talent'}  talent={article.talent}/>
                                ))}

                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-primary">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 quote-block ">
                                <h2 className="title-font-bold text-white">{t('readyConnect')}</h2>
                                <div className="pt-20">
                                    <Link  className="btn btn-dark" to={`/${currentLanguageCode}/talent`}>  {t('browseProfiles')}</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/*<div className="articles bg-main">*/}
                {/*    <div className="pt-75 pb-50 bdr-btm">*/}
                {/*        <div className="container">*/}
                {/*            <div className="row">*/}
                {/*                <div className="col-lg-4 col-md-12 pb-30">*/}

                {/*                    {talents && talents.length > 0 &&  talents?.slice(0, 2).map((talent: any) => ( talent && talent.talent_latest_article &&*/}
                {/*                        <AsideArticle article={talent.talent_latest_article.article}  key={talent.talent_latest_article.id} link={'talent'} talent={talent}/>*/}
                {/*                    )) }*/}


                {/*                </div>*/}
                {/*                <div className="col-lg-8 col-md-12">*/}
                {/*                    <div className="articles">*/}
                {/*                        <div className="container">*/}
                {/*                            {talents && talents.length > 0 &&  talents?.slice(2, 3).map((talent: any) => ( talent && talent.talent_latest_article &&*/}
                {/*                                <HorizontalArticle article={talent.talent_latest_article.article}  key={talent.talent_latest_article.id}  link={'talent'}  talent={talent}/>*/}
                {/*                            ))}*/}
                {/*                            <div className='row pt-20'>*/}
                {/*                                {talents && talents.length > 0 &&  talents?.slice(3, 6).map((talent: any) => ( talent && talent.talent_latest_article &&*/}
                {/*                                <VerticalArticle article={talent.talent_latest_article.article}  key={talent.talent_latest_article.id}  link={'talent'}  talent={talent}/>*/}
                {/*                            ))}*/}
                {/*                            </div>*/}
                {/*                        </div>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*            <div className="row">*/}
                {/*                <div className="col-lg-4 col-md-12 pb-30">*/}
                {/*                    {moreTalents && moreTalents.length > 0 &&  moreTalents?.slice(0, 2).map((talent: any) => ( talent && talent.talent_latest_article &&*/}
                {/*                        <AsideArticle article={talent.talent_latest_article.article}  key={talent.talent_latest_article.id}  link={'talent'}  talent={talent}/>*/}
                {/*                    ))}*/}
                {/*                </div>*/}
                {/*                <div className="col-lg-8 col-md-12">*/}
                {/*                    <div className="articles">*/}
                {/*                        <div className="container">*/}
                {/*                            {moreTalents && moreTalents.length > 0 &&  moreTalents?.slice(2, 3).map((talent: any) => ( talent && talent.talent_latest_article &&*/}
                {/*                                <HorizontalArticle article={talent.talent_latest_article.article}  key={talent.talent_latest_article.id}  link={'talent'}  talent={talent}/>*/}
                {/*                            ))}*/}
                {/*                            <div className='row pt-20'>*/}
                {/*                                {moreTalents && moreTalents.length > 0 &&  moreTalents?.slice(3, 6).map((talent: any) => ( talent && talent.talent_latest_article &&*/}
                {/*                                    <VerticalArticle article={talent.talent_latest_article.article}  key={talent.talent_latest_article.id}  link={'talent'}  talent={talent}/>*/}
                {/*                            ))}*/}
                {/*                            </div>*/}
                {/*                        </div>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*            <div className="row">*/}
                {/*                <div className="col-lg-4 col-md-12 pb-30">*/}
                {/*                    {moreTalents && moreTalents.length > 0 &&  moreTalents?.slice(6, 8).map((talent: any) => ( talent && talent.talent_latest_article &&*/}
                {/*                        <AsideArticle article={talent.talent_latest_article.article}  key={talent.talent_latest_article.id}  link={'talent'}  talent={talent}/>*/}
                {/*                    ))}*/}

                {/*                </div>*/}
                {/*                <div className="col-lg-8 col-md-12">*/}
                {/*                    <div className="articles">*/}
                {/*                        <div className="container">*/}
                {/*                            {moreTalents && moreTalents.length > 0 &&  moreTalents?.slice(8, 9).map((talent: any) => ( talent && talent.talent_latest_article &&*/}
                {/*                                <HorizontalArticle article={talent.talent_latest_article.article}  key={talent.talent_latest_article.id}  link={'talent'}  talent={talent}/>*/}
                {/*                            ))}*/}
                {/*                            <div className='row pt-20'>*/}
                {/*                                {moreTalents && moreTalents.length > 0 &&  moreTalents?.slice(9, 12).map((talent: any) => ( talent && talent.talent_latest_article &&*/}
                {/*                                <VerticalArticle article={talent.talent_latest_article.article}  key={talent.talent_latest_article.id}  link={'talent'}  talent={talent}/>*/}
                {/*                            ))}*/}
                {/*                            </div>*/}

                {/*                        </div>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
                {/*<div className="bg-purple">*/}
                {/*    <div className="container">*/}
                {/*        <div className="row">*/}
                {/*            <div className="col-md-12 text-center quote-block">*/}
                {/*                <h2 className="title-font-bold text-white">{t('qoute1')}</h2>*/}
                {/*                <p className="text-white">- EEME -</p>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/*<div className="bdr-btm pt-30 pb-25">*/}
                {/*    <div className="">*/}
                {/*        <div className="container">*/}
                {/*            <div className="">*/}
                {/*                <h3 className="title-color title-font-bold">{t('checkProfiles')} </h3>*/}
                {/*                <div className="row justify-content-center pt-25">*/}
                {/*                    {talents?.length > 0 &&*/}
                {/*                        talents.map((talent: any) => (*/}
                {/*                            <TalentCard  talent={talent} key={talent.id} />*/}
                {/*                        ))}*/}

                {/*                    {moreTalents && moreTalents?.length > 0 &&*/}
                {/*                        moreTalents.slice(0,12).map((talent: any) => (*/}
                {/*                            <TalentCard  talent={talent} key={talent.id} />*/}
                {/*                        ))}*/}

                {/*                </div>*/}

                {/*                <div className="row pt-30 pb-20">*/}
                {/*                    <div className="col-xxl-2 col-lg-2 col-md-3 col-sm-4 col-12 col-centered">*/}
                {/*                        <Link  className="btn btn-primary w-100" to={`/${currentLanguageCode}/talent`}>  {t('seeMore')}</Link>*/}

                {/*                    </div>*/}
                {/*                </div>*/}

                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/*<div className="pt-75 pb-50 bdr-btm">*/}
                {/*    <div className="container">*/}
                {/*        <div className="row">*/}
                {/*            <div className="col-lg-8 col-md-12">*/}
                {/*                <div className="articles">*/}
                {/*                    <div className="container">*/}
                {/*                        {moreTalents && moreTalents.length > 0 &&  moreTalents?.slice(12, 13).map((talent: any) => ( talent && talent.talent_latest_article &&*/}
                {/*                            <HorizontalArticle article={talent.talent_latest_article.article}  key={talent.talent_latest_article.id}  link={'talent'}  talent={talent}/>*/}
                {/*                        ))}*/}
                {/*                        <div className='row pt-20'>*/}
                {/*                            {moreTalents && moreTalents.length > 0 &&  moreTalents?.slice(13, 16).map((talent: any) => ( talent && talent.talent_latest_article &&*/}

                {/*                                <VerticalArticle article={talent.talent_latest_article.article}  key={talent.talent_latest_article.id}  link={'talent'}  talent={talent}/>*/}
                {/*                        ))}*/}
                {/*                        </div>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*            <div className="col-lg-4 col-md-12">*/}
                {/*                {moreTalents && moreTalents.length > 0 &&  moreTalents?.slice(16, 18).map((talent: any) => ( talent && talent.talent_latest_article &&*/}
                {/*                    <AsideArticle article={talent.talent_latest_article.article}  key={talent.talent_latest_article.id}  link={'talent'}  talent={talent}/>*/}
                {/*                ))}*/}

                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/*<div className="bg-primary">*/}
                {/*    <div className="container">*/}
                {/*        <div className="row">*/}
                {/*            <div className="col-md-12 quote-block ">*/}
                {/*                <h2 className="title-font-bold text-white">{t('readyConnect')}</h2>*/}
                {/*                <div className="pt-20">*/}
                {/*                    <Link  className="btn btn-dark" to={`/${currentLanguageCode}/talent`}>  {t('browseProfiles')}</Link>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}

            </section>
            <Footer/>

        </Fragment>
)
    ;
}

export default Homepage;




