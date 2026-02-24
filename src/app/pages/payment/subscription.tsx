import React, {Fragment, FC, useState, useEffect} from 'react';
import {useTranslation} from "react-i18next";
import Cookies from "js-cookie";
import {useParams} from "react-router-dom";
import {Category} from "../../models/misc/Category";
import {Page} from "../../models/page/Page";
import {bookPayment} from "../../core/book/requests";
import OrderDetails from "../../components/includes/payment/order-details";
import {DECLINED_PAGE_ID, PENDING_PAYMENT, SUCCESS_PAYMENT, VIDEO_ORDER_TYPE} from "../../helpers/crud-helper/consts";
import Header from "../../components/header";
import Footer from "../../components/footer";
import {enrollPayment} from "../../core/onboarding/requests";
import {SocialMeta} from "../../components/includes/social-meta/social-meta";
import Loader from "../../components/includes/loader/loader";


const SubscriptionIndex: FC = () => {
    const [publicEnroll, setPublicEnroll] = useState<any>();
    const [paymentStatus, setPaymentStatus] = useState<any>()
    const [page, setPage] = useState<Page | null>()
    const currentLanguageCode = Cookies.get('i18next') || 'en'
    const [showLoader, setShowLoader] = useState(true);
    const {t} = useTranslation()
    const params = useParams()

    const public_enrollment_id = sessionStorage.getItem("public_enrollment_id");
    const stripe_session_id = sessionStorage.getItem("stripe_session_id");

    useEffect(() => {
        enrollPayment(params.status, public_enrollment_id, stripe_session_id).then(response => {

            setPage(response.data.data.page_a)
            setPaymentStatus(response.data.data.status)
            setPublicEnroll(response.data.data.public_talent_enrollment)
        })

        const timeoutId = setTimeout(() => {
            setShowLoader(false);
        }, 3000); //

        return () => {
            clearTimeout(timeoutId);
        };


    }, [t, showLoader])

    return (
        <Fragment>
            <SocialMeta title={  t('socialMeta.home.title')} description={t('socialMeta.home.title')} image={'https://eeme.io/assets/img/logo_social.png'} name={t('webName')} link={`/${currentLanguageCode}/${params.status}`} index={true} />

            <Header href={`${currentLanguageCode === 'en' ? '/ar/subscription/' + params.status : '/en/subscription/' + params.status}`}/>

            <section className="">
                {showLoader && <Loader />}

                    <div className="header-block pt-100 pb-50 ">
                        <div className="container ">
                            <div className="row pt-50">

                                {publicEnroll && paymentStatus === SUCCESS_PAYMENT ?
                                    <div className="col-12 ">
                                        <div className="text-center">
                                            <h2 className="title-font-bold text-primary">Congratulations and welcome to
                                                eeMe!
                                            </h2>
                                        </div>
                                        <div className="text-center pt-30">
                                            <h3 className="title-font-bold fs-17 inverse-color"> You are now part of an
                                                exclusive circle with amazing benefits! Please check your email inbox to
                                                learn more</h3>
                                        </div>
                                    </div>
                                    : <div className="col-12">
                                        <div className="text-center">
                                            <h2 className="title-font-bold text-primary">{t(
                                                'payment.paymentDeclinedDescription')}</h2>
                                        </div>
                                        <div className="text-center pt-30">
                                            <h3 className="title-font-bold fs-17 inverse-color">{t('payment.paymentCancelledDescription')}</h3>
                                        </div>
                                    </div>}


                            </div>

                            <div className="row pt-20">

                            </div>

                        </div>
                    </div>



            </section>

            <Footer/>

        </Fragment>
    )
        ;
}

export default SubscriptionIndex;




