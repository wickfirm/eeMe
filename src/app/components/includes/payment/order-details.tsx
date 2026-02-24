import React, {FC} from 'react';
import Cookies from "js-cookie";
import {useTranslation} from "react-i18next";
import {PAYMENT_METHODS} from "../../../helpers/crud-helper/consts";


type Props = {
    orderRequest?: any
    talent?: any
}

const OrderDetails: FC<Props> = ({orderRequest, talent}) => {

    const currentLanguageCode = Cookies.get('i18next') || 'en'
    const {t} = useTranslation()
    function isNumeric(value: any): boolean {
        return /^-?\d+$/.test(value);
    }
    return (
        <div className="">
            {orderRequest &&
                <div className="payment-details">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <h2 className="order-title mb-30 title-font-bold title-color fs-20"> {t('payment.yourOrderDetails')}</h2>


                                <div className="form-group " id="video_target_self">

                                    <div className="row">
                                        <div className="col">
                                            <label
                                                className="font-text-bold s-title"><strong>{t('payment.orderNumber')}:</strong></label>
                                            <input type="text" className="form-control book-btm-fields"
                                                   value={ orderRequest.id }
                                                   disabled/>
                                        </div>
                                        {orderRequest.type === 2 && orderRequest.recipient &&
                                            <div className="col">
                                                <label
                                                    className="font-text-bold s-title"><strong>{t('form.to')}:</strong></label>
                                                <input type="text" className="form-control book-btm-fields"
                                                       name="recipient"
                                                       value={orderRequest.recipient }
                                                       disabled/>

                                            </div>
                                        }
                                        {orderRequest.type === 1 && orderRequest.sender &&
                                            <div className="col">
                                                <label
                                                    className="font-text-bold s-title"><strong>{t('form.to')}:</strong></label>
                                                <input type="text" className="form-control book-btm-fields"
                                                       name="recipient"
                                                       value={orderRequest.sender }
                                                       disabled/>

                                            </div>
                                        }
                                    </div>
                                </div>

                                {orderRequest && orderRequest.occasion_id &&

                                    <div className="form-group mt-4">
                                        <div className="row">
                                            <div className="col-12">
                                                <label
                                                    className="font-text-bold s-title "><strong>{t('form.occasionTitle')}:</strong></label>
                                                <input type="text" className="form-control book-btm-fields " name={'occasion'}
                                                       value={orderRequest.occasion.name.en} disabled/>

                                            </div>
                                        </div>

                                    </div>
                                }


                                <div className="form-group mt-2">
                                    <label className="font-text-bold s-title"><strong>
                                        {talent && talent.user && talent.user.name && talent.user.name.en && currentLanguageCode === 'en' ? t('form.instructions', {talent: talent.user.name.en}) : talent && talent.user && talent.user.name && talent.user.name.ar && currentLanguageCode === 'ar' ? t('form.instructions', {talent: talent.user.name.ar}) : ""}
                                    </strong></label>
                                    {orderRequest.message &&
                                        <textarea className="form-control autoExpand book-btm-fields" required
                                                  name="message"

                                                  value={orderRequest.message}
                                                  disabled  />
                                    }

                                </div>
                                <div className="form-group mt-2">
                                    <label
                                        className="font-text-bold s-title"><strong>{t('payment.paymentMethod')}:</strong></label>
                                    <span className={'pe-2 ps-2'}>
                                        {typeof isNumeric(orderRequest.payment_method)
                                            ? PAYMENT_METHODS[orderRequest.payment_method]
                                            : orderRequest.payment_method}

                                    </span>

                                </div>


                                <div className="form-group mt-2">
                                    <label
                                        className="font-text-bold s-title"><strong>{t('form.email')}: </strong></label><span className={'pe-2 ps-2'}>{orderRequest.email}</span>
                                </div>

                                <div className="form-group mt-2">
                                    <div className="form-check">
                                        <input className="form-check-input"

                                               name="make_public" type="checkbox"
                                               id="gridCheck"

                                               checked={orderRequest.is_public}
                                               disabled   />
                                        <label className="form-check-label font-text-bold s-title ms-1">
                                            <strong>{t('form.makePublic')}</strong>
                                        </label>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>

            }



        </div>
    );
}

export default OrderDetails;