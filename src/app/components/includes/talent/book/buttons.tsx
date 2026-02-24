import React, { FC } from 'react';
import Cookies from "js-cookie";
import HTMLReactParser from "html-react-parser";
import {BUSINESS_ORDER_TYPE, CAMPAIGN_ORDER_TYPE, VIDEO_ORDER_TYPE} from "../../../../helpers/crud-helper/consts";
import {useTranslation} from "react-i18next";



type Props = {
    talent ?: any

}

const BookButtons: FC<Props> = ({talent}) => {

    const currentLanguageCode = Cookies.get('i18next') || 'en'
    const {t} = useTranslation()
    return(
        <div>
            {talent && talent?.talent_order_types?.length === 3 ?
                <div className="row ">
                    <div className="col-md-4">
                        <button type="submit"
                                id="personal-order"
                                className="btn  clicked-btn disabled-btn w-100 "
                                value="">{t('form.personalizedShoutout')}
                        </button>
                    </div>
                    <div className="col-md-4">
                        <button type="submit"
                                className="btn btn-primary w-100 "
                                id="business-order" name="business-order"
                                value={`${talent.talent_order_types.map((type: any) => (type.business_order_type !== null && type.business_order_type.id ? type.business_order_type.id : null))}`}>
                            {talent.talent_order_types.map((type: any) => (
                                type.business_order_type !== null && type.business_order_type.name && currentLanguageCode === 'en' && type.business_order_type.name.en ?
                                    HTMLReactParser(type.business_order_type.name.en)
                                    : type.business_order_type !== null && type.business_order_type.name && currentLanguageCode === 'ar' && type.business_order_type.name.ar ?
                                        HTMLReactParser(type.business_order_type.name.ar) :
                                        null

                            ))}
                        </button>
                    </div>
                    <div className="col-md-4">
                        <button type="submit"
                                className="btn btn-primary w-100"
                                id="request-brief" name="request-brief"
                                value="">{t('form.requestBrief')}
                        </button>
                    </div>
                </div>
                : (
                    <div className="row ">
                        {talent && talent?.talent_order_types?.length === 2 && talent?.talent_order_types?.map((orderType: any) => (
                            orderType.order_type === VIDEO_ORDER_TYPE ?
                                <div className="col-md-4">
                                    <button type="submit"
                                            id="personal-order"
                                            className="btn  clicked-btn disabled-btn w-100 "
                                            value="">{t('form.personalizedShoutout')}
                                    </button>
                                </div>
                                : orderType.order_type === null && orderType.business_order_type_id !== null ?
                                    <div className="col-md-4">
                                        <button type="submit"
                                                className="btn btn-primary w-100 "
                                                id="business-order" name="business-order"
                                                value={`${talent.talent_order_types.map((type: any) => (type.business_order_type !== null && type.business_order_type.id ? type.business_order_type.id : null))}`}>
                                            {talent.talent_order_types.map((type: any) => (
                                                type.business_order_type !== null && type.business_order_type.name && currentLanguageCode === 'en' && type.business_order_type.name.en ?
                                                    HTMLReactParser(type.business_order_type.name.en)
                                                    : type.business_order_type !== null && type.business_order_type.name && currentLanguageCode === 'ar' && type.business_order_type.name.ar ?
                                                        HTMLReactParser(type.business_order_type.name.ar) :
                                                        null

                                            ))}
                                        </button>
                                    </div>
                                    : orderType.order_type === CAMPAIGN_ORDER_TYPE ?
                                        <div className="col-md-4">
                                            <button type="submit"
                                                    className="btn btn-primary w-100"
                                                    id="request-brief" name="request-brief"
                                                    value="">{t('form.requestBrief')}
                                            </button>
                                        </div>
                                        : null
                        ))}
                    </div>
                )}
        </div>


    );
}

export default BookButtons;