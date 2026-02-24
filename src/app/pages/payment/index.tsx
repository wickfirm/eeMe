import React, {Fragment, FC,  useState, useEffect} from 'react';
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
import {SocialMeta} from "../../components/includes/social-meta/social-meta";
import Loader from "../../components/includes/loader/loader";



const PaymentIndex: FC = () => {
    const [orderRequest, setOrderRequest] = useState<any>();
    const [talent , setTalent] = useState<any>()
    const [paymentStatus , setPaymentStatus] = useState<any>()
    const [showLoader, setShowLoader] = useState(true);

    const [page , setPage] = useState<Page | null >()
    const currentLanguageCode = Cookies.get('i18next') || 'en'
    const { t } = useTranslation()
    const params = useParams()

    const order_request_id = sessionStorage.getItem("order_request_id");

    useEffect(() => {
        bookPayment(params.status, order_request_id).then(response => {

            setTalent(response.data.data.talent)

            setPage(response.data.data.page_a)
            setPaymentStatus(response.data.data.status)
            setOrderRequest(response.data.data.order_request)

        })
        const timeoutId = setTimeout(() => {
            setShowLoader(false);
        }, 3000); //

        return () => {
            clearTimeout(timeoutId);
        };



    }, [ t, showLoader ])

    return (
        <Fragment>
            <SocialMeta title={  t('socialMeta.home.title')} description={t('socialMeta.home.title')} image={'https://eeme.io/assets/img/logo_social.png'} name={t('webName')} link={`/${currentLanguageCode}/${params.status}`} index={true} />

            <Header href={`${currentLanguageCode === 'en' ? '/ar/payment/'+ params.status : '/en/payment/'+ params.status }` }/>

            <section className="">
                {showLoader && <Loader />}
                <div className="header-block pt-100 pb-50 secondary-bg">
                    <div className="container ">
                        <div className="row">
                            {orderRequest && orderRequest.order_type === VIDEO_ORDER_TYPE ?
                                paymentStatus && paymentStatus === SUCCESS_PAYMENT ?
                                    <div className="col-12 ">
                                        <div className="text-center">
                                            <h2 className="title-font-bold title-color">{t('payment.paymentThanksStatement')}<span>&#10084;&#65039;</span></h2>
                                        </div>
                                        <div className="text-center">
                                            <h3 className="text-font text-color fs-16">{t('payment.orderReceivedStatement')}</h3>
                                        </div>
                                        <div className="text-center">
                                            <h3 className="text-font text-color fs-16">{t('payment.donationStatement')}<span>&#10084;&#65039;</span></h3>
                                        </div>
                                        <div className="text-center">
                                            <h3 className="text-font text-color fs-16">{t('payment.paymentSuccessContactStatement')}</h3>
                                        </div>
                                    </div>
                                    :paymentStatus && paymentStatus === PENDING_PAYMENT ?
                                        <div className="col-12 ">
                                            <div className="text-center">
                                                <h2 className="title-font-bold title-color">{t('payment.paymentThanksStatement')}<span>&#10084;&#65039;</span>
                                                </h2>
                                            </div>
                                            <div className="text-center">
                                                <h3 className="text-font text-color fs-16">{t('payment.orderReceivedStatement')} </h3>
                                            </div>
                                            <div className="text-center">
                                                <h3 className="text-font text-color fs-16">{t('payment.paymentWuStatement')}</h3>
                                            </div>
                                        </div>
                                        : paymentStatus  ?
                                            <div className="col-12">
                                                <div className="text-center">
                                                    <h2 className="title-font-bold title-color">{t('payment.paymentDeclinedDescription')}</h2>
                                                </div>
                                                <div className="text-center">
                                                    <h3 className="text-font text-color fs-16">{t('payment.paymentCancelledDescription')}</h3>
                                                </div>
                                            </div>

                                            : ""


                                :  paymentStatus && paymentStatus === SUCCESS_PAYMENT ?
                                    <div className="col-12 ">
                                        <div className="text-center">
                                            <h2 className="title-font-bold title-color">{t('payment.successBsnOrder')}<span>&#10084;&#65039;</span></h2>
                                        </div>

                                    </div>
                                    :paymentStatus && paymentStatus === PENDING_PAYMENT ?
                                        <div className="col-12 ">
                                            <div className="text-center">
                                                <div className="title-font-bold title-color" dangerouslySetInnerHTML={{__html : t('payment.pendingBsnOrder')}}>
                                                </div>
                                            </div>
                                        </div>
                                        : paymentStatus  ?
                                            <div className="col-12">
                                                <div className="text-center">
                                                    <h2 className="title-font-bold title-color">{t('payment.paymentDeclinedDescription')}</h2>
                                                </div>
                                                <div className="text-center">
                                                    <div className="" dangerouslySetInnerHTML={{__html : t('payment.cancelledBsnOrder')}} />
                                                </div>
                                            </div>

                                            : ""}



                        </div>

                        <div className="row pt-20 justify-content-center">
                            <div className="col-md-4">
                                {talent && talent.image &&
                                <div className="profile-image mt-3">
                                    <img className="bdr-tl bdr-tr bdr-bl bdr-br w-100" src={ talent.image}
                                         alt="" />
                                </div>
                                }
                            </div>
                            {talent && orderRequest && orderRequest.order_type === VIDEO_ORDER_TYPE &&
                                <div className="col-md-8 mt-50">
                                    <OrderDetails talent={talent} orderRequest={orderRequest} />
                                </div>
                            }

                        </div>

                    </div>
                </div>

            </section>

            <Footer/>

        </Fragment>
    )
        ;
}

export default PaymentIndex;




