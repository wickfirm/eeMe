import React, {Fragment, FC, useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import { useParams} from "react-router-dom";
import Cookies from "js-cookie";
import {Category} from "../../models/misc/Category";
import {AgencyPage} from "../../models/agency/AgencyPage";
import Header from "../../components/header";
import {
    BOOK_PAGE_ID,
    BUSINESS_ORDER_TYPE,
    CAMPAIGN_ORDER_TYPE,
    VIDEO_ORDER_TYPE
} from "../../helpers/crud-helper/consts";
import HTMLReactParser from "html-react-parser";
import BookHeader from "../../components/includes/talent/book/header";
import Footer from "../../components/footer";
import {Occasion} from "../../models/misc/Occasion";
import {Nav, Tab} from 'react-bootstrap';
import PersonalizedForm from "../../components/includes/talent/book/form/personalized";
import BusinessForm from "../../components/includes/talent/book/form/business";
import BriefForm from "../../components/includes/talent/book/form/brief";
import {bookTalent, bookTempTalent} from "../../core/book/requests";
import {SocialMeta} from "../../components/includes/social-meta/social-meta";



const BookTempPage: FC = () => {


    const {t} = useTranslation()
    const params = useParams()

    const [talent , setTalent] = useState<any>()

    const [page , setPage] = useState<AgencyPage | null >()
    const [occasions , setOccasions] = useState<Occasion | null >()
    const [personalizedAddons , setPersonalizedAddons] = useState<any >()
    const[businessAddons , setBusinessAddons] = useState<any >([])
    const currentLanguageCode = Cookies.get('i18next') || 'en'
    const [stateTab, setStateTab] = useState<any>( "");
    useEffect(() => {
        bookTempTalent(params.talent, currentLanguageCode).then(response => {
            setTalent(response.data.data.talent)

            setPage(response.data.data.page_a)
            setOccasions(response.data.data.occasion)
            setPersonalizedAddons(response.data.data.personalized_addons)
            const dataArray = Object.keys(response.data.data.business_addons).map((key: string | number) => response.data.data.business_addons[key]);
            setBusinessAddons(dataArray)
            setStateTab(response.data.data.type)
        })


    }, [ t ,params.talent])


    return (
        <Fragment >
            <SocialMeta title ={currentLanguageCode === 'en' && talent && talent.user && talent.user.name  ? talent.user.name.en + " | " + t('webName') : currentLanguageCode === 'ar' && talent && talent.user && talent.user.name  ? talent.user.name.ar + " | " + t('webName')  : t('socialMeta.home.title')}
                        description ={t('socialMeta.talent.description' , {talent: currentLanguageCode === 'en' && talent && talent.user && talent.user.name ? talent.user.name.en : currentLanguageCode === 'ar' && talent && talent.user && talent.user.name ? talent.user.name.ar : ""})}
                        image={talent && talent.image ? talent.image : 'https://eeme.io/assets/img/logo_social.png'}
                        name={t('socialMeta.talent.title' , {talent: currentLanguageCode === 'en' && talent && talent.user && talent.user.name ? talent.user.name.en : currentLanguageCode === 'ar' && talent && talent.user && talent.user.name ? talent.user.name.ar : ""})}
                        link={ `/${currentLanguageCode}/talent/${params.talent}`}
                        index={false}

            />
            <Header  page={BOOK_PAGE_ID} href={currentLanguageCode === 'en' ? '/ar/talent-temp/' + talent?.slug.ar + '/book' : '/en/talent-temp/' + talent?.slug.en + '/book'}  talent={currentLanguageCode === 'en' ? talent?.slug.ar : talent?.slug.en}/>
            <section className="">
                <div className="header-block pt-100 pb-50 secondary-bg">
                    <div className="container">
                        <div className="row">
                            <BookHeader talent={talent} stateTab={stateTab} />
                        </div>

                        <div className="row">
                            <div className="col-lg-4  mt-3">
                                <div className="">

                                    <img className="w-100 bdr-tl bdr-tr bdr-br bdr-bl" src={`${talent?.image ? talent?.image : '/assets/images/logo_social.png'}`}
                                         alt="Name" />

                                </div>
                            </div>
                            <div className="col-lg-8 mt-3">
                                {talent && talent?.talent_order_types?.length > 1 ?
                                <Tab.Container id="left-tabs-example" defaultActiveKey={talent && talent?.talent_order_types?.length > 0 && talent?.talent_order_types[0].order_type === 1 ?  'personalized' : talent && talent?.talent_order_types?.length > 0 && talent?.talent_order_types[0].order_type === null ? 'business' : talent && talent?.talent_order_types?.length > 0 && talent?.talent_order_types[0].order_type === 3 ? 'request-brief' : ''}>
                                    <Nav variant="pills" className="flex-row order-btn justify-content-sm-center">
                                        <div className="row w-100">
                                            {talent && talent?.talent_order_types?.length > 1 && talent?.talent_order_types.map((orderType: any) => (
                                                orderType.order_type === VIDEO_ORDER_TYPE ? personalizedAddons && personalizedAddons.length > 0 &&

                                                    <div className={`col-md-4 mb-2 ${currentLanguageCode === 'en' ? 'ps-lg-0 pe-lg-1' : 'pe-lg-0 ps-lg-1'}`} key={`personalized`}>
                                                        <Nav.Item className=""  onClick={() => setStateTab('personalized')}>
                                                            <Nav.Link className="btn btn-primary  w-100" eventKey={'personalized'}>
                                                                {t('form.personalizedShoutout')}
                                                            </Nav.Link>
                                                        </Nav.Item>
                                                    </div>
                                                    : orderType.order_type === null && orderType.business_order_type_id !== null && businessAddons && businessAddons.length > 0 ?
                                                        <div className={`col-md-4 mb-2 ${currentLanguageCode === 'en' ? 'ps-lg-1 pe-lg-1' : 'pe-lg-1 ps-lg-1'}`} key={`business`}>
                                                            <Nav.Item className=" " onClick={() => setStateTab('business')}>
                                                                    <Nav.Link className="btn btn btn-primary  w-100" eventKey={'business'}>
                                                                        {talent.talent_order_types.map((type: any) => (
                                                                            type.business_order_type !== null && type.business_order_type.name && currentLanguageCode === 'en' && type.business_order_type.name.en ?
                                                                                HTMLReactParser(type.business_order_type.name.en)
                                                                                : type.business_order_type !== null && type.business_order_type.name && currentLanguageCode === 'ar' && type.business_order_type.name.ar ?
                                                                                    HTMLReactParser(type.business_order_type.name.ar) :
                                                                                    null

                                                                        ))}
                                                                    </Nav.Link>
                                                                </Nav.Item>
                                                        </div>
                                                        : orderType.order_type === CAMPAIGN_ORDER_TYPE ?
                                                            <div className={`col-md-4 mb-2 ${currentLanguageCode === 'en' ? 'ps-lg-1 pe-lg-1' : 'pe-lg-1 ps-lg-1'}`} key={`request-brief`}>
                                                                <Nav.Item className=" "  onClick={() => setStateTab('request-brief')}>
                                                                    <Nav.Link className="btn btn-primary  w-100" eventKey={'request-brief'}>
                                                                        {t('form.requestBrief')}
                                                                    </Nav.Link>
                                                                </Nav.Item>
                                                            </div>
                                                            : null
                                                    ) )}

                                                    </div>
                                     </Nav>

                                        <div className="row mt-4 mb-4">
                                            <Tab.Content>
                                                <Tab.Pane eventKey={'personalized'} key={'personalized'}>
                                                    {talent && talent.id && talent.price && talent.price.price &&
                                                        <PersonalizedForm talent={talent} occasions={occasions} personalizedAddons={personalizedAddons} price={talent.price.price}/>

                                                    }
                                                </Tab.Pane>
                                                <Tab.Pane eventKey={'business'} key={'business'}>
                                                    {businessAddons && businessAddons.length > 0 &&
                                                        <BusinessForm businessAddons={businessAddons} talent={talent}/>
                                                    }
                                                </Tab.Pane>
                                                <Tab.Pane eventKey={'request-brief'} key={'request-brief'}>
                                                    <BriefForm talent={talent}/>
                                                </Tab.Pane>
                                            </Tab.Content>

                                        </div>
                                </Tab.Container>
                               :  talent && talent.id && talent?.talent_order_types?.length  === 1 && talent && talent.price && talent.price.price && talent.talent_order_types[0].order_type === VIDEO_ORDER_TYPE ?
                                        <PersonalizedForm talent={talent} occasions={occasions} personalizedAddons={personalizedAddons} price={talent.price.price}/>
                                        : talent && talent?.talent_order_types?.length  === 1 && businessAddons && businessAddons.length > 0 && talent.talent_order_types[0].order_type === null  ?
                                                <BusinessForm businessAddons={businessAddons} talent={talent}/>
                                                :  talent && talent?.talent_order_types?.length  === 1 &&  talent.talent_order_types[0].order_type === CAMPAIGN_ORDER_TYPE ?
                                                    <BriefForm talent={talent}/> : ""  }

                                <div className="talent-book-conditions">
                                    <span dangerouslySetInnerHTML={{ __html:  t("form.bookCondition") }} />
                                </div>
                            </div>


                        </div>

                    </div>
                </div>
            </section>
            <Footer/>
        </Fragment>
    );
}

export default BookTempPage;




