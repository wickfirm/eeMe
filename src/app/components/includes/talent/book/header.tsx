import React, { FC } from 'react';
import Cookies from "js-cookie";
import HTMLReactParser from "html-react-parser";
import {BUSINESS_ORDER_TYPE, CAMPAIGN_ORDER_TYPE, VIDEO_ORDER_TYPE} from "../../../../helpers/crud-helper/consts";
import {useTranslation} from "react-i18next";



type Props = {
    talent ?: any
    stateTab ?:any

}

const BookHeader: FC<Props> = ({talent , stateTab}) => {

    const currentLanguageCode = Cookies.get('i18next') || 'en'
    const {t} = useTranslation()
    return(
        <div className="row">
            <div className="col-12 pt-15">
                <div className="book-header">
                    {stateTab === 'personalized' ?
                        <div className="personalized-video-heading" >
                            <div className="">
                                {talent && talent.user &&
                                    <h2 className="title-color title-font-bold">
                                        {t('bookTitle', {talent: currentLanguageCode === 'en' ? talent.user.name.en : talent.user.name.ar})}</h2>
                                }
                            </div>
                            <div className="text-color text-font">
                                {talent && talent.user &&
                                    <p>
                                        {t('bookPersonalizedVideoTitle', {
                                            price: talent?.price?.price,
                                            responseTime: talent.response_time,
                                            talent: currentLanguageCode === 'en' ? talent.user.name.en : talent.user.name.ar
                                        })}
                                    </p>
                                }
                            </div>
                        </div>
                        : stateTab === 'business' ?
                            <div className="business-heading" >
                                <div className="">
                                    <h2 className="title-color title-font-bold">
                                        {talent && talent.talent_order_types && talent.talent_order_types.length > 0 && talent.talent_order_types.map((type: any) => (
                                            <p key={type.id}>
                                                {type.business_order_type !== null && type.business_order_type.title && currentLanguageCode === 'en' && type.business_order_type.title.en ?
                                                    HTMLReactParser(type.business_order_type.title.en)
                                                    : type.business_order_type !== null && type.business_order_type.title && currentLanguageCode === 'ar' && type.business_order_type.title.ar ?
                                                        HTMLReactParser(type.business_order_type.title.ar) :
                                                        null}
                                            </p>
                                        ))}
                                    </h2>
                                </div>
                                <div className="text-color text-font">

                                        {talent && talent.talent_order_types && talent.talent_order_types.length > 0 && talent.talent_order_types.map((type: any) => (
                                            <div key={type.id}>
                                                {type.business_order_type !== null && type.business_order_type.description && currentLanguageCode === 'en' && type.business_order_type.description.en ?
                                                    HTMLReactParser(type.business_order_type.description.en)
                                                    : type.business_order_type !== null && type.business_order_type.description && currentLanguageCode === 'ar' && type.business_order_type.description.ar ?
                                                        HTMLReactParser(type.business_order_type.description.ar) :
                                                        null}
                                            </div>
                                        ))}

                                </div>
                            </div>
                            : stateTab === 'request-brief' ?
                                <div className={`request-brief-header`} key={CAMPAIGN_ORDER_TYPE} >
                                    <div className="">
                                        <h2 className="title-color title-font-bold">  {t('requestCampaignTitle')} </h2>
                                    </div>
                                    <div className="text-color text-font">
                                        <p>
                                            {t('requestCampaignDescription')}
                                        </p>
                                    </div>
                                </div>
                                : null}


                </div>
            </div>
        </div>

    );
}

export default BookHeader;