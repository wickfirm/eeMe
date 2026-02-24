import React, {FC, Fragment, useEffect, useState} from 'react';
import Header from "../../components/header";
import {ABOUT_PAGE_ID, STORAGE_LINK} from "../../helpers/crud-helper/consts";
import {Category} from "../../models/misc/Category";
import {AgencyPage} from "../../models/agency/AgencyPage";
import Cookies from "js-cookie";
import {useTranslation} from "react-i18next";
import {useParams} from "react-router-dom";
import {createEnroll, getOnBoardingIndexData} from "../../core/onboarding/requests";
import {Talent} from "../../models/talent/Talent";
import clsx from "clsx";
import {useFormik} from "formik";
import * as Yup from "yup";
import Select from 'react-select'
import TalentCard from "../../components/includes/talent/card";
import Footer from "../../components/footer";

import mb from '../../../assets/images/MB.jpg';
import {bookStore} from "../../core/book/requests";
import {SocialMeta} from "../../components/includes/social-meta/social-meta";
import Loader from "../../components/includes/loader/loader";


const signUpSchema = Yup.object().shape({
    email: Yup.string()
        .email('Wrong email format')
        .min(3, 'Minimum 3 symbols')
        .max(50, 'Maximum 50 symbols')
        .required('Email is required'),

    name: Yup.string()
        .required('Name is required'),

    phone_number: Yup.number()
        .required('Phone number is required'),

    ig_username : Yup.string()
        .required('IG username is required'),

    other_social : Yup.string()
        .required('This field is required'),

    profile_link : Yup.string()
        .required('This field is required'),

    followers : Yup.number()
        .required('This field is required'),

    package_id : Yup.string()
        .required('This field is required'),
})

const initialValues = {
    email: '',
    name: "" ,
    phone_number : "",
    ig_username : "",
    youtube_username : "" ,
    other_social : "",
    profile_link : "",
    followers : "" ,
    package_id : "",
    private_code : ""

}

const OnBoardingPage: FC = () => {

    const [page , setPage] = useState<AgencyPage | null >()
    const [talents , setTalents] = useState<Array<Talent> | null >()
    const [packages , setPackages] = useState<any >()
    const [loading, setLoading] = useState(false)
    const [showLoader, setShowLoader] = useState(true);

    const currentLanguageCode = Cookies.get('i18next') || 'en'
    const { t } = useTranslation()

    useEffect(() => {
        getOnBoardingIndexData().then(response => {
            setPage(response.data.data.page_a)
            setTalents(response.data.data.talents)
            setPackages(response.data.data.packages)

        })
        const timeoutId = setTimeout(() => {
            setShowLoader(false);
        }, 1000); //

        return () => {
            clearTimeout(timeoutId);
        };

    }, [ t , showLoader])



    const formik = useFormik({
        initialValues,
        validationSchema: signUpSchema,
        onSubmit: async (values, {setSubmitting}) => {
            setSubmitting(true)
            try {
                setLoading(true)
                const { data }  =   await createEnroll(values)

                localStorage.removeItem('public_enrollment_id');
                sessionStorage.setItem('public_enrollment_id', data.data.public_enrollment_id);

                localStorage.removeItem('stripe_session_id');
                sessionStorage.setItem('stripe_session_id', data.data.stripe_session_id);

                window.location.href = data.data.url ;


            } catch (ex) {
                console.error(ex)
            } finally {
                setSubmitting(true)
                setLoading(false)
            }
        },
    })
    return(
        <Fragment>

            <SocialMeta title ={t('socialMeta.home.title' )}
                        description ={'socialMeta.home.title'}
                        image={ 'https://eeme.io/assets/img/logo_social.png'}
                        name={t('socialMeta.home.title' )}
                        link={ `/${currentLanguageCode}/on-boarding`}
                        index={true}

            />

            <Header  href={`${currentLanguageCode === 'en' ? '/ar/on-boarding' : '/en/on-boarding'}`}/>

            <section>
                {showLoader && <Loader />}
                <div className="header-block pt-100 pb-50 bdr-btm secondary-bg">
                    <div className="container">
                        <div className="row justify-content-between">
                            <div className="col-lg-6 pb-20 pt-30">
                                <h1 className="title-font-bold text-primary fs-35">{t('onBoardingTitle')}</h1>
                                <div className="row">
                                    <div className="col-md-10 pt-20">
                                        <div className="font-text-bold text-color fs-20">
                                            {t('onBoardingDescription')}
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                    </div>
                                </div>
                                <div className="row pt-30">
                                    <div className="col-md-8">
                                        <a href="#sign-up"
                                           className="btn btn-primary w-100">{t('signUpFree')}</a>
                                    </div>
                                </div>
                            </div>
                            {page?.video?.link ? (
                                <div className="col-lg-6 pb-20 pt-20">
                                    <div className='video-container padding-btm-82'>
                                        <div className="video-wrapper">
                                            <video
                                                src={`${STORAGE_LINK}/${page?.video?.link}`}
                                                autoPlay loop controls muted
                                                poster={`${STORAGE_LINK}/${page?.video?.poster}`}

                                            />

                                        </div>
                                    </div>
                                </div>
                            ) : null }

                        </div>
                    </div>
                </div>
                <div className="form-block  pt-50 pb-50 bdr-btm" id="sign-up">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6">
                                <h2 className="title-font-bold text-primary fs-35">
                                    {t('onBoardingTitle2')}
                                </h2>
                                <div className="col-md-10">
                                    <ul className="font-text-bold text-color fs-16">
                                        <li className="pt-20">{t('onBoardingStep1')}</li>
                                        <li className="pt-20">{t('onBoardingStep2')}</li>
                                        <li className="pt-20">{t('onBoardingStep3')}</li>
                                        <li className="pt-20">{t('onBoardingStep4')}</li>
                                        <li className="pt-20">{t('onBoardingStep5')}</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-6  pt-50 align-items-center">
                                <h4 className="title-font-bold text-primary fs-31 text-center">
                                    {t('onBoardingFormTitle')}
                                </h4>

                                <div className="public-enroll-form pt-40">

                                    <form  className='form w-100 pt-10' onSubmit={formik.handleSubmit} noValidate>
                                        <div className="row justify-content-center">
                                            <div className="col-md-10">
                                                <div className=" mb-sm-4 mb-5">
                                                    <input type="text"
                                                           placeholder={t('onBoardingFormName') || ""}
                                                           {...formik.getFieldProps('name')}

                                                           className={clsx(
                                                               'form-control contact-form',
                                                               {'is-invalid': formik.touched.name && formik.errors.name},
                                                               {
                                                                   'is-valid': formik.touched.name && !formik.errors.name,
                                                               }
                                                           )}
                                                    />
                                                    {formik.touched.name && formik.errors.name && (
                                                        <div className='fv-plugins-message-container'>
                                                            <span role='alert'>{formik.errors.name}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-md-10">
                                                <div className=" mb-sm-4 mb-5">
                                                    <input type="email"
                                                           placeholder={t('emailAddress') || ""}
                                                           {...formik.getFieldProps('email')}

                                                           className={clsx(
                                                               'form-control contact-form',
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
                                            </div>
                                            <div className="col-md-10">
                                                <div className=" mb-sm-4 mb-5">

                                                    <input type="text"
                                                           placeholder={t('onBoardingFormPhoneNumber') || ""}
                                                           {...formik.getFieldProps('phone_number')}

                                                           className={clsx(
                                                               'form-control contact-form',
                                                               {'is-invalid': formik.touched.phone_number && formik.errors.phone_number},
                                                               {
                                                                   'is-valid': formik.touched.phone_number && !formik.errors.phone_number,
                                                               }
                                                           )}
                                                    />
                                                    {formik.touched.phone_number && formik.errors.phone_number && (
                                                        <div className='fv-plugins-message-container'>
                                                            <span role='alert'>{formik.errors.phone_number}</span>
                                                        </div>
                                                    )}

                                                </div>
                                            </div>
                                            <div className="col-md-10">
                                                <div className=" mb-sm-4 mb-5">

                                                    <input type="text"
                                                           placeholder={t('onBoardingFormIgUserName') || ""}
                                                           {...formik.getFieldProps('ig_username')}

                                                           className={clsx(
                                                               'form-control contact-form',
                                                               {'is-invalid': formik.touched.ig_username && formik.errors.ig_username},
                                                               {
                                                                   'is-valid': formik.touched.ig_username && !formik.errors.ig_username,
                                                               }
                                                           )}
                                                    />
                                                    {formik.touched.ig_username && formik.errors.ig_username && (
                                                        <div className='fv-plugins-message-container'>
                                                            <span role='alert'>{formik.errors.ig_username}</span>
                                                        </div>
                                                    )}

                                                </div>
                                            </div>
                                            <div className="col-md-10">
                                                <div className=" mb-sm-4 mb-5">
                                                    <input type="text"
                                                           placeholder={t('onBoardingFormYoutubeUsername') || ""}
                                                           {...formik.getFieldProps('youtube_username')}

                                                           className={clsx(
                                                               'form-control contact-form',
                                                           )}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-10">
                                                <div className=" mb-sm-4 mb-5">

                                                    <input type="text"
                                                           placeholder={t('onBoardingFormOtherSocial') || ""}
                                                           {...formik.getFieldProps('other_social')}

                                                           className={clsx(
                                                               'form-control contact-form',
                                                               {'is-invalid': formik.touched.other_social && formik.errors.other_social},
                                                               {
                                                                   'is-valid': formik.touched.other_social && !formik.errors.other_social,
                                                               }
                                                           )}
                                                    />
                                                    {formik.touched.other_social && formik.errors.other_social && (
                                                        <div className='fv-plugins-message-container'>
                                                            <span role='alert'>{formik.errors.other_social}</span>
                                                        </div>
                                                    )}

                                                </div>
                                            </div>
                                            <div className="col-md-10">
                                                <div className=" mb-sm-4 mb-5">
                                                    <input type="text"
                                                           placeholder={t('onBoardingFormProfileLink') || ""}
                                                           {...formik.getFieldProps('profile_link')}

                                                           className={clsx(
                                                               'form-control contact-form',
                                                               {'is-invalid': formik.touched.profile_link && formik.errors.profile_link},
                                                               {
                                                                   'is-valid': formik.touched.profile_link && !formik.errors.profile_link,
                                                               }
                                                           )}
                                                    />
                                                    {formik.touched.profile_link && formik.errors.profile_link && (
                                                        <div className='fv-plugins-message-container'>
                                                            <span role='alert'>{formik.errors.profile_link}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-md-10">
                                                <div className=" mb-sm-4 mb-5">
                                                    <input type="text"
                                                           placeholder={t('onBoardingFormFollowers') || ""}
                                                           {...formik.getFieldProps('followers')}

                                                           className={clsx(
                                                               'form-control contact-form',
                                                               {'is-invalid': formik.touched.followers && formik.errors.followers},
                                                               {
                                                                   'is-valid': formik.touched.followers && !formik.errors.followers,
                                                               }
                                                           )}
                                                    />
                                                    {formik.touched.followers && formik.errors.followers && (
                                                        <div className='fv-plugins-message-container'>
                                                            <span role='alert'>{formik.errors.followers}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-md-10">
                                                <div className=" mb-sm-4 mb-5">

                                                    <select
                                                        {...formik.getFieldProps('package_id')}
                                                        className='form-control select-omneeyat platform'
                                                        aria-label='Packages'
                                                        name='package_id' >
                                                        <option disabled={true} value="">
                                                            {t('onBoardingFormPackage')}
                                                        </option>
                                                        {packages && packages.length > 0 &&
                                                            packages.map((item: any ) => (
                                                                    <option key={item.id} value={item.id}>
                                                                        {item.name_package}
                                                                    </option>
                                                                )
                                                            )}

                                                    </select>

                                                    {formik.touched.package_id && formik.errors.package_id && (
                                                        <div className='fv-plugins-message-container'>
                                                            <span role='alert'>{formik.errors.package_id}</span>
                                                        </div>
                                                    )}

                                                </div>
                                            </div>
                                            <div className="col-md-10">
                                                <div className=" mb-sm-4 mb-5">

                                                    <input type="text"
                                                           placeholder={t('onBoardingFormPrivateCode') || ""}
                                                           {...formik.getFieldProps('private_code')}

                                                           className={clsx(
                                                               'form-control contact-form',

                                                           )}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-md-9">
                                                <button type="submit" className="btn btn-primary submit_btn w-100"  disabled={formik.isSubmitting || !formik.isValid}
                                                >

                                                    {!loading && <span className='indicator-label'>{t('signUpFree')}</span>}
                                                    {loading && (
                                                        <span className='indicator-progress' style={{display: 'block'}}>
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
                                                    )}</button>
                                            </div>
                                        </div>
                                    </form>



                                    <div className="row justify-content-center pt-20">
                                        <div className="col-md-10">
                                            <div className="note-form">
                                                {t('onBoardingNote')}
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white pt-50 pb-50 secondary-bg">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-md-8">

                                <h3 className="title-font-bold text-color text-center">{t('onBoardingTechnologies')}</h3>
                            </div>
                        </div>
                        <div className="row justify-content-center pt-30">

                            <div className="col-xxl-4 col-lg-4 col-md-6 mb-3 ">
                                <div className="bg-dark pb-50">
                                    <h5 className="title-font text-center text-primary font-weight-bolder pt-60 pb-20">
                                        {t('onBoardingTalentMediaKit')}
                                    </h5>

                                    <div className="row justify-content-center pt-20 pb-20">

                                        <div className="col-md-10 h-350">
                                            <ul className="text-white fs-16 title-font-bold ">
                                                <li className="pt-20">  {t('onBoardingPMedia_1')}</li>
                                                <li className="pt-20">{t('onBoardingPMedia_2')}</li>
                                                <li className="pt-20">{t('onBoardingPMedia_3')}</li>
                                                <li className="pt-20">{t('onBoardingPMedia_4')}</li>
                                                <li className="pt-20">{t('onBoardingPMedia_5')}</li>
                                                <li className="pt-20">{t('onBoardingPMedia_5')}</li>
                                            </ul>
                                        </div>
                                        <div className="col-md-10 col-10  pt-20">
                                            <div className="">
                                                <a className="btn btn-primary-inverse text-center w-100"
                                                   href="#sign-up">  {t('onBoardingFormTitle')}</a>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>
                            <div className="col-xxl-4 col-lg-4 col-md-6 mb-3 ">
                                <div className="bg-dark pb-50">
                                    <h5 className="title-font text-center  text-primary font-weight-bolder pt-60 pb-20">
                                        {t('onBoardingTalentBooking')}
                                    </h5>

                                    <div className="row justify-content-center pt-20 pb-20">

                                        <div className="col-md-10 h-350">
                                            <ul className="text-white fs-16 title-font-bold   ">
                                                <li className="pt-20">{t('onBoardingPBooking_1')}</li>
                                                <li className="pt-20">{t('onBoardingPBooking_2')}</li>
                                                <li className="pt-20">{t('onBoardingPBooking_3')}</li>


                                            </ul>
                                        </div>
                                        <div className="col-md-8 col-10 pt-20">
                                            <div className="">
                                                <a className="btn btn-primary-inverse text-center w-100"
                                                   href="#sign-up">{t('onBoardingPrice')}</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xxl-4 col-lg-4 col-md-6 mb-3 ">
                                <div className="bg-dark pb-50 h-600">
                                    <h5 className="title-font text-center  text-primary font-weight-bolder  pt-60 pb-20">
                                        {t('onBoardingInsights')}
                                    </h5>

                                    <div className="row justify-content-center pt-20 pb-20">

                                        <div className="col-md-10 h-350">
                                            <ul className="text-white fs-16 title-font-bold ">
                                                <li className="pt-20">{t('onBoardingPInsight_1')}</li>
                                                <li className="pt-20">{t('onBoardingPInsight_2')}</li>
                                                <li className="pt-20">{t('onBoardingPInsight_3')}</li>

                                            </ul>
                                        </div>
                                        <div className="col-md-8 col-10 pt-20">
                                            <div className="">
                                                <a className="btn btn-primary-inverse text-center w-100"
                                                   href="#sign-up">{t('onBoardingInsightPrice')}</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="talent pt-50 pb-50">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-md-8 text-center">
                                <h3 className="title-font-bold title-color ">
                                    {t('onBoardingTalent')}
                                </h3>
                            </div>


                        </div>
                        <div className="row pl-10 pr-10 pt-25">
                            {talents && talents?.length > 0 && talents.map((talent: any) => ( talent &&
                                    <TalentCard  talent={talent} key={talent.id} />
                                ))}
                        </div>
                    </div>
                </div>


            </section>

            <footer className="bg-black">
                <div className="container">
                    <div className="row pt-30 pb-50">
                        <div className="col-md-4 ">
                            <div className="">
                                <img className="bdr-50 w-50" src={mb} />
                            </div>
                        </div>
                        <div className="col-md-8">
                            <div className="pt-30">

                                <div className=" text-white title-font-bold fs-16 line-height-24">{t('onBoardingTalentQuote')}</div>

                                <br />
                                    <div className="text-white title-font-bold fs-16 line-height-24">{t('onBoardingCeoName')}</div>
                                    <div className="text-white title-font-bold fs-16 line-height-24">{t('onBoardingeeMe')}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="copyright" >
                    <div className="container">
                        <div className="row pt-20 pb-20">
                            <div className="col-12">
                                {t('copyRight' )}
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

        </Fragment>
    );
}

export default OnBoardingPage;