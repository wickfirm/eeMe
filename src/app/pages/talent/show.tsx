import React, {Fragment, FC, useState, useEffect} from 'react';
import Header from '../../../app/components/header';
import {useTranslation} from "react-i18next";
import {
    getInTheSpotData,
    getInTheSpotFirstItem,
    getTalentData, getTalentsArticles,verifyTalent ,
    notify
} from "../../core/talent/requests";
import {Article} from "../../models/article/Article";
import {Category} from "../../models/misc/Category";
import {Link, useParams} from "react-router-dom";
import {
    COLLABS,
    FILMOGRAPHY, IN_THE_MEDIA,
    IN_THE_SPOT, INSIGHTS,
    INSTAGRAM_SOCIAL_MEDIA_ID,
    STORAGE_LINK,
    TALENT_PAGE_ID, TALENT_SOCIAL, TALENT_VIDEOS,
    TIKTOK_SOCIAL_MEDIA_ID, YOUTUBE_PLATFORM_EMBED_ID, YOUTUBE_PLATFORM_ID, YOUTUBE_SOCIAL_MEDIA_ID
} from "../../helpers/crud-helper/consts";
import {Player} from "video-react";
import Cookies from "js-cookie";
import Footer from "../../components/footer";
import PlatformIndex from "../../components/includes/talent/platforms";
import Charity from "../../components/includes/talent/charity";
import SocialStats from "../../components/includes/talent/social-stats";
import NotifyForm from "../../components/includes/talent/notify-form";
import Articles from "../../components/includes/talent/articles";
import * as Yup from "yup";
import {useFormik} from "formik";
import {Modal} from "react-bootstrap";
import clsx from "clsx";
import {SocialMeta} from "../../components/includes/social-meta/social-meta";

import Loader from "../../components/includes/loader/loader";
import Page404 from "../404";


const TalentPage: FC = () => {
    const [articles, setArticles] = useState<Array<Article> | undefined>([])
    const [talent, setTalent] = useState<any>()
    const [mainVideo, setMainVideo] = useState<any>();
    const currentLanguageCode = Cookies.get('i18next') || 'en'
    const [articlesTotal , setArticlesTotal ] = useState(0)
    const [navItems , setNavItems] = useState<any>([]);
    const [firstItem, setFirstItem] = useState<any | null>()
    const [items, setItems] = useState<any>()
    const [spot, setSpotItems] = useState<any>()
    const [filmography, setFilmographyItems] = useState<any>()
    const [media, setMediaItems] = useState<any>()
    const [socialFeed, setSocialFeedItems] = useState<any>()
    const [videos, setVideosItems] = useState<any>()
    const [collabs, setCollabsItems] = useState<any>()
    const [insights, setInsightsItems] = useState<any>()
    const [socialData, setSocialData] = useState<any>()

    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [showLoader, setShowLoader] = useState(true);
    const {t} = useTranslation()
    const [error, setError] = useState(false);

    const initialValues = {
        email: "",
        phone_number: "",
    }
    const verifySchema = Yup.object().shape({
        email: Yup.string()
            .email("Wrong email format")
            .min(3, "Minimum 3 symbols")
            .max(50, "Maximum 50 symbols")
            .required("Email is required"),
        phone_number: Yup.number().required("Phone number is required")

    });


    const params = useParams()
    function openModal() {
        setIsModalOpen(true);
    }

    const formik = useFormik({
        initialValues,
        validationSchema: verifySchema,
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true);
            try {
                setLoading(true);

                const { data } = await verifyTalent(values , talent.id);
                if (data.data.status === 1) {
                    setLoading(false);
                    setIsActive(true);

                    setTimeout(function () {
                        setIsModalOpen(false)
                        formik.resetForm();
                    }, 1500);


                }
            } catch (ex) {
                console.error(ex);
            } finally {
                setSubmitting(true);
                setLoading(false);
            }
        },
    });

    useEffect(() => {

        getTalentData(params.talent, currentLanguageCode).then(response => {
            if (response.status === 200 ) {
                setError(false);
                setTalent(response.data.data.talent)
                setArticles(response.data.data.articles.data)
                setArticlesTotal(response.data.data.articles.total)
                setMainVideo(response.data.data.talent_main_video)
                setShowLoader(false);

                 setTimeout(() => {
                     getInTheSpotFirstItem (params.talent, currentLanguageCode, 1).then(response => {
                        setNavItems(response.data.data.nav_items)
                         setFirstItem(response.data.data.first_item)
                         setItems(response.data.data.items)
                         setSocialData(response.data.data.talent?.talent_social)

                          firstItem === IN_THE_SPOT ? setSpotItems(response.data.data.items)
                             : firstItem === FILMOGRAPHY ? setFilmographyItems(response.data.data.items)
                             : firstItem === IN_THE_MEDIA ? setMediaItems(response.data.data.items)
                                 : firstItem === TALENT_SOCIAL ? setSocialFeedItems(response.data.data.items)
                                     : firstItem === TALENT_VIDEOS ? setVideosItems(response.data.data.items)
                                         : firstItem === INSIGHTS ? setInsightsItems(response.data.data.items)
                                             : firstItem === COLLABS ? setCollabsItems(response.data.data.items)
                                                 : setItems(response.data.data.items)




                    })
                }, 1000);
            }else{setError(true)}


        })





    }, [ t , params.talent , showLoader])

    if(error){
        return (<Page404 />)
    }

    return (
        <Fragment >

            <SocialMeta title ={currentLanguageCode === 'en' && talent && talent.user && talent.user.name  ? talent.user.name.en + " | " + t('webName') : currentLanguageCode === 'ar' && talent && talent.user && talent.user.name  ? talent.user.name.ar + " | " + t('webName')  : t('socialMeta.home.title')}
                        description ={t('socialMeta.talent.description' , {talent: currentLanguageCode === 'en' && talent && talent.user && talent.user.name ? talent.user.name.en : currentLanguageCode === 'ar' && talent && talent.user && talent.user.name ? talent.user.name.ar : ""})}
                        image={talent && talent.image ? talent.image : 'https://eeme.io/assets/img/logo_social.png'}
                        name={t('socialMeta.talent.title' , {talent: currentLanguageCode === 'en' && talent && talent.user && talent.user.name ? talent.user.name.en : currentLanguageCode === 'ar' && talent && talent.user && talent.user.name ? talent.user.name.ar : ""})}
                        link={ `/${currentLanguageCode}/talent/${params.talent}`}
                        index={true}

            />

            <Header  page={TALENT_PAGE_ID} href={currentLanguageCode === 'en' && talent ? '/ar/talent/' + talent?.slug.ar : talent ? '/en/talent/'+ talent?.slug.en : ""} />

            <section className="" >
                {showLoader && <Loader />}
                <div className="header-block pt-100 pb-50 bdr-btm secondary-bg">
                    <div className="container pt-30">
                        <div className="row justify-content-between">
                            <div className="col-xxl-4 col-lg-4 col-md-6 col-sm-6 col-12">

                                {talent && talent.talent_order_types.length > 0 ? (
                                    mainVideo !== null ?
                                        <Player playsInline poster={`${STORAGE_LINK}/${mainVideo?.video?.poster}`} src={`${STORAGE_LINK}/${mainVideo?.video?.link}`}/>
                                        :  talent?.image && <img className="bdr-bl bdr-br bdr-tl bdr-tr w-100 " src={`${talent?.image}`}/>
                                ) : (talent?.image && <img className="bdr-bl bdr-br bdr-tl bdr-tr w-100 " src={`${talent?.image}`}/>)}


                            </div>
                            <div className="col-xxl-8 col-lg-8 col-md-12 col-sm-12 col-12 col-centered pt-20 ">
                                {talent && talent?.is_available === 0 ? (
                                    <div className="mb-3">
                                        <span className="badge badge-pill badge-om-lo">{t('talentNotAvailable')}</span>
                                    </div>
                                ) : (null)}


                                <div className="">
                                    <div className="d-lg-flex  justify-content-between">
                                        <h1 className="title-font-bold title-color">  {talent && currentLanguageCode === 'en' ? talent?.user?.name.en : talent?.user?.name.ar}
                                            <span>
               {talent && talent.is_verified ? (
                   <i className="far fa-check-circle bg-primary text-white bdr-50 me-2 ms-2"></i>) : (null)}

            </span>
                                        </h1>
                                        {talent && talent.charities && talent.charities.slice(0, 1).map((charity: any) => (charity ? (

                                            <Charity key={charity.id} talent={talent}/>


                                        ) : null))}


                                    </div>

                                    <div className="category-talent pt-10">
                                        <ul>
                                            {talent?.categories.length > 0 && talent.categories.map((category: any) => (
                                                <li key={category?.id}>{currentLanguageCode === 'en' ? category?.name.en : category?.name.ar}</li>
                                            ))}
                                            {talent?.country ?
                                                <li>{talent.country}</li> : null}
                                        </ul>
                                    </div>
                                    <div className="talent-social-links pt-20">
                                        <ul>
                                            {socialData?.length > 0 && socialData.map((talent_social: any) => (
                                                <li key={talent_social?.id}>
                                                    <a target="_blank" href={talent_social.social_handle}
                                                       title={talent_social?.social?.name}><i

                                                        className={talent_social?.social?.icon}></i></a>
                                                </li>
                                            ))}
                                            {talent && talent.is_active_email === 1 &&

                                                < li className=""><a target="_blank" href = {`mailto:${talent.user.email}`} title="Email"><i
                                                className="fas fa-envelope" ></i></a></li>
                                            }

                                        </ul>
                                    </div>


                                    <div className="profile-description pt-20 ">
                                        {talent && talent.description.en && currentLanguageCode === 'en' ? (
                                            <p dangerouslySetInnerHTML={{__html: talent.description.en as string}}/>
                                        ) : talent && talent.description.ar  && currentLanguageCode === 'ar' ? <p dangerouslySetInnerHTML={{__html: talent.description.ar as string}}/> : null}
                                        {talent?.is_verified === 0 ? (
                                                <a href="#" data-toggle="modal" data-target="#verify-identity" onClick={openModal}
                                                   className="pointer-event text-main pl-2">  {t('talentVerify')} </a>)
                                            : (null)}


                                    </div>

                                    {talent?.is_available && talent?.is_verified && talent?.talent_order_types.length > 0 ? (
                                        <div className="pt-25 pb-25">
                                            <div className="">
                                                <Link to={`${currentLanguageCode === 'en' ? `/en/talent/${talent.slug.en}/book` :  `/ar/talent/${talent.slug.ar}/book`}`}
                                                    className="btn btn-primary w-lg-25 w-md-50 w-sm-100">{t('book')}
                                                </Link>
                                            </div>
                                        </div>
                                    ) : !talent?.is_available && talent?.is_verified && talent?.talent_order_types.length > 0 ?

                                        (

                                            <NotifyForm talent={talent} />

                                        ) : null
                                    }
                                </div>

                                {socialData &&  <SocialStats socialData={socialData}/>}



                            </div>
                        </div>
                    </div>
                </div>


                {navItems && navItems.length > 0 ? (
                    <PlatformIndex navItems={navItems} firstItem={firstItem} items={items} talent={talent} />

                ) : null}

                <Articles articles={articles} total={articlesTotal} talent={talent}  link={'talent'} />


            </section>

            {talent &&
                <Modal className="modal" show={isModalOpen} onHide={() => setIsModalOpen(false)} centered>
                <Modal.Header className="border-bottom-0" closeButton>
                      <Modal.Title className=" ">
                          <h6 className="modal-title title-font-bold text-dark">{t('talent.verifyIdentityTitle' , {talent: currentLanguageCode === 'en' ? talent.user.name.en : talent.user.name.ar} )}</h6>
                      </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="">
                        {isActive ?

                            <div
                                className={` ${
                                    isActive ? " alert-box d-block" : "alert-box d-none"
                                }`}
                            >
                                <div
                                    className="alert alert-success alert-dismissible fade show"
                                    role="alert"
                                >
                                    Successfully Done
                                </div>
                            </div>
                            :
                            <div>


                                <form className="form w-100 pt-10"  onSubmit={formik.handleSubmit} noValidate>

                                    <div className="row mb-3">

                                        <div className="col-md-12 mb-4">
                                            <div className="md-form form-group">
                                                <label className="label-book-bold text-dark">{t(
                                                    'form.email')}</label>
                                                <input type="email"
                                                       {...formik.getFieldProps("email")}
                                                       className={clsx(
                                                           "form-control book-top-fields unique-placeholder brief-field",
                                                           {"is-invalid": formik.touched.email && formik.errors.email,},
                                                           {"is-valid": formik.touched.email && !formik.errors.email,})}

                                                       required name="email" placeholder="example@omneeyat.com"
                                                       aria-label="example@omneeyat.com"
                                                />

                                                {formik.touched.email && formik.errors.email && (
                                                    <div className="fv-plugins-message-container">
                                                        <span role="alert">{formik.errors.email}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12 mb-5">
                                        <div className="md-form form-group">
                                            <label className="label-book-bold text-dark">{t('form.phoneNumber')}</label>
                                            <input type="tel"
                                                   {...formik.getFieldProps("phone_number")}
                                                   className={clsx(
                                                       "form-control book-top-fields unique-placeholder brief-field",
                                                       {"is-invalid": formik.touched.email && formik.errors.email,},
                                                       {"is-valid": formik.touched.email && !formik.errors.email,})}
                                                   required name="phone_number" id="phone_number"
                                                   placeholder={t('form.phoneNumberPlaceholder') || ""}
                                                   aria-label=""
                                            />

                                            {formik.touched.phone_number && formik.errors.phone_number && (
                                                <div className="fv-plugins-message-container">
                                                    <span role="alert">{formik.errors.phone_number}</span>
                                                </div>
                                            )}

                                        </div>
                                    </div>


                                    <div className="form-group row mt-4 mb-4 justify-content-center">
                                        <div className="col-md-12">
                                            <button
                                                type="submit"
                                                className="btn btn-primary w-100"
                                                disabled={formik.isSubmitting || !formik.isValid}
                                            >
                                                {!loading && (
                                                    <span className="">{t("button.submit")}</span>
                                                )}
                                                {loading && (
                                                    <span
                                                        className="indicator-progress"
                                                        style={{ display: "block" }}
                                                    >
                              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                            </span>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        }

                    </div>

                </Modal.Body>
                <Modal.Footer className="border-top-0">

                </Modal.Footer>
            </Modal>
            }

            <Footer/>
        </Fragment>
    );
}

export default TalentPage;




