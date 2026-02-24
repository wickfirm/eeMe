import React, {FC, useState} from 'react';
import logo from '../../assets/images/eeme-logo.svg';
import {useTranslation} from "react-i18next";
import {useFormik} from "formik";
import * as Yup from "yup";
import clsx from "clsx";
import {subscribe} from "../core/subscribe/requests";
import Cookies from "js-cookie";
import {Link} from 'react-router-dom';
const subscribeSchema = Yup.object().shape({
    email: Yup.string()
        .email('Wrong email format')
        .min(3, 'Minimum 3 symbols')
        .max(50, 'Maximum 50 symbols')
        .required('Email is required'),
})

const initialValues = {
    email: '',
}
const Footer: FC = () => {
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false)
    const [isActive, setIsActive] = useState(false);
    const currentLanguageCode = Cookies.get('i18next') || 'en'
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
    return(
        <footer className="bg-black" id="scroll-to">

            <div className="container">
                <div className="row pt-50 justify-content-between">
                    <div className="col-md-5 col-centered">


                        <div className="col-9 col-centered pt-15">
                            <div className="text-center mb-20">
                                <img src={logo} title="eeMe" alt="eeMe" width="120" />

                            </div>
                            <div className="mb-15 text-center">
                                <div className="col-centered">
                                    <Link to={`/${currentLanguageCode}/on-boarding`} className="btn btn-primary text-transform-0"
                                    >
                                        {t('footerSign' )}
                                    </Link>
                                    <p className="text-white fs-sm mt-1">*  {t('privateCode' )}</p>
                                </div>
                            </div>
                            <div className="social-links mb-4 mb-md-0 text-center">
                                <ul>
                                    {/*<li>*/}
                                    {/*    <a href="https://fb.com/omneeyat" target="_blank">*/}
                                    {/*        <i className="fab fa-facebook-f"></i>*/}
                                    {/*    </a>*/}
                                    {/*</li>*/}
                                    <li>
                                        <a href="https://instagram.com/eeme.io" target="_blank">
                                            <i className="fab fa-instagram"></i>
                                        </a>
                                    </li>
                                    {/*<li>*/}
                                    {/*    <a href="https://twitter.com/omneeyat" target="_blank">*/}
                                    {/*        <i className="fab fa-twitter"></i>*/}
                                    {/*    </a>*/}
                                    {/*</li>*/}
                                </ul>
                            </div>

                        </div>

                    </div>
                    <div className="col-md-7">
                        <div className="row">
                            <div className="col-12">
                                <p className="footer-mailing">{t('footerMailingList')}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="title">
                                    <p className="subscribe-text" >{t('subscribeActivities')}</p>
                                </div>
                                <form
                                    className='form w-100 pt-10'
                                    onSubmit={formik.handleSubmit}
                                    noValidate

                                >
                                <div className="newsletter-form-container mb-3">

                                    <div className={` ${ isActive ? " alert-box d-block" : "alert-box"}`}>
                                        <div className="alert alert-success alert-dismissible fade show" role="alert">

                                            {t('newsletterSuccess')}
                                        </div>
                                    </div>
                                    <input type="hidden" name="form_id" value="3"/>
                                    <div className="input-group mt-10">
                                        <input type="email"
                                               placeholder={t('emailAddress') || ""}  {...formik.getFieldProps('email')}

                                               className={clsx(
                                                   'form-control email-input newsletter-input h-46px',
                                                   {'is-invalid': formik.touched.email && formik.errors.email},
                                                   {
                                                       'is-valid': formik.touched.email && !formik.errors.email,
                                                   }
                                               )}
                                        />


                                        <div className="input-group-append">

                                            <button className="btn btn-primary fs-sm" disabled={formik.isSubmitting || !formik.isValid}
                                                    type="submit">

                                                {!loading && <span className='indicator-label'>{t('submit')}</span>}
                                                {loading && (
                                                    <span className='indicator-progress' style={{display: 'block'}}>

              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
                                                )}</button>
                                        </div>
                                    </div>

                                    <div>

                                    </div>

                                </div>
                                </form>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="links">
                                    <ul>
                                        <li>
                                            <Link to={`/${currentLanguageCode}/about`}>{t('about')}</Link>
                                        </li>
                                        <li>
                                            <Link to={`/${currentLanguageCode}/privacy-policy`}>{t('privacy')} </Link>
                                        </li>
                                        <li>
                                            <Link to={`/${currentLanguageCode}/terms`}>{t('terms')}</Link>
                                        </li>
                                        <li>
                                            <a href="mailto:hello@omneeyat.com">{t('help')} </a>
                                        </li>
                                        <li>
                                            <Link to={`/${currentLanguageCode}/contact`}>{t('contact')} </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12">
                                <div className="accepted-payments" >
                                    <h3 >{t('acceptedPayments')} </h3>

                                    <ul className="payments-list">
                                        <li>
                                            <img src="/assets/images/visa.png"
                                                 alt=" Accepted Payment Visa" />
                                        </li>
                                        <li>
                                            <img src="/assets/images/mastercard.png"
                                                 alt="Accepted Payment MasterCard" />
                                        </li>
                                        <li>
                                            <img src="/assets/images/verified-by-visa.png"
                                                 alt="Accepted Payment Verified by Visa" />
                                        </li>
                                        <li>
                                            <img src="/assets/images/mastercard-secure-code.png"
                                                 alt=" Accepted Payment Mastercard Secure Code" />
                                        </li>
                                        <li>
                                            <img src="/assets/images/western-union.png"
                                                 alt="Accepted Payment Western Union" />
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
            <div className="copyright">
                <div className="container">
                    <div className="row pt-20 pb-20">
                        <div className="col-12">
                            {t('copyRight' )}
                            <div className="mt-1">
                                {t('reserved' )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </footer>

    );
}

export default Footer;