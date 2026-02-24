import React, { FC } from 'react';
import Cookies from "js-cookie";
import HTMLReactParser from "html-react-parser";
import {useTranslation} from "react-i18next";
import {CAMPAIGN_ORDER_TYPE, VIDEO_ORDER_TYPE} from "../../../../../helpers/crud-helper/consts";
import PersonalizedForm from "./personalized";
import BusinessForm from "./business";
import BriefForm from "./brief";
import {Occasion} from "../../../../../models/misc/Occasion";



type Props = {
    talent ?: any
    occasions ?: any
    personalizedAddons ?: any
    businessAddons ?:any

}

const FormIndex: FC<Props> = ({talent , occasions , personalizedAddons , businessAddons}) => {

    const currentLanguageCode = Cookies.get('i18next') || 'en'
    const {t} = useTranslation()
    return(
        <div>
            {talent && talent?.talent_order_types?.length === 1 ?
                <div>
                    <PersonalizedForm talent={talent} occasions={occasions} personalizedAddons={personalizedAddons}/>
                    {/*<BusinessForm talent={talent} businessAddons={businessAddons}/>*/}
                    <BriefForm talent={talent}/>
                </div>
                : talent && talent?.talent_order_types?.length === 2 && talent?.talent_order_types?.map((orderType: any) => (
                orderType.order_type === VIDEO_ORDER_TYPE ?
                    <PersonalizedForm talent={talent}/>
                    : orderType.order_type === null && orderType.business_order_type_id !== null ?
                        <BusinessForm talent={talent}/>
                        : orderType.order_type === CAMPAIGN_ORDER_TYPE ?
                            <BriefForm talent={talent}/>
                            : null))

            }

        </div>


    );
}

export default FormIndex;