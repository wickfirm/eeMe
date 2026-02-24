import React, {Fragment, FC,  useState, useEffect} from 'react';
import Header from '../../app/components/header';
import {useTranslation} from "react-i18next";
import Cookies from "js-cookie";
import {Category} from "../models/misc/Category";
import {AgencyPage} from "../models/agency/AgencyPage";
import {Link, useParams} from "react-router-dom";
import {getPageIndexData} from "../core/page/requests";
import {ABOUT_PAGE_ID} from "../helpers/crud-helper/consts";
import Footer from "../components/footer";
import {SocialMeta} from "../components/includes/social-meta/social-meta";
import HTMLReactParser from "html-react-parser";
import Loader from "../components/includes/loader/loader";


const IndexPage: FC = () => {
    const [showLoader, setShowLoader] = useState(true);
    const [page , setPage] = useState<AgencyPage | null >()
    const currentLanguageCode = Cookies.get('i18next') || 'en'
    const { t } = useTranslation()
    const params = useParams()

    useEffect(() => {

        getPageIndexData(params.page).then(response => {
            setPage(response.data.page_a)

        })
        const timeoutId = setTimeout(() => {
            setShowLoader(false);
        }, 1000); //

        return () => {
            clearTimeout(timeoutId);
        };
    }, [ t , params.page, showLoader])


    return (
        <Fragment>
            <SocialMeta title={page && page?.meta && page?.meta.title && currentLanguageCode === 'en' ? page?.meta.title.en : page && page?.meta && page?.meta.title && currentLanguageCode === 'ar' ? page?.meta.title.ar : t('socialMeta.home.title')} description={page && page?.meta && page?.meta.description && currentLanguageCode === 'en' ?   HTMLReactParser(page?.meta.description.en.replace(/(<([^>]+)>)/ig, '').substring(0, 200)) : page && page?.meta && page?.meta.description && currentLanguageCode === 'ar' ? HTMLReactParser(page?.meta.description.ar.replace(/(<([^>]+)>)/ig, '').substring(0, 200)) : t('socialMeta.home.title')}  image={'https://eeme.io/assets/img/logo_social.png'} name={t('webName')} link={`/${currentLanguageCode}/${params.page}`} index={true} />

            <Header  page={page?.page_id} href={currentLanguageCode === 'en' ? '/ar/' + params.page : '/en/' + params.page}/>

            <section>
                {showLoader && <Loader />}
                <div className="header-block pt-100 pb-50">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="title-font-bold title-color">
                                    {page && currentLanguageCode === 'en' ? (
                                        <h1>{page?.page?.title?.en}</h1>
                                    ) : (  <h1>{page?.page?.title?.ar}</h1>)
                                    }
                                </div>
                                {page && currentLanguageCode === 'en' ? (
                                <div className="text-font text-color" dangerouslySetInnerHTML={{__html: page?.page?.content?.en as string}} />
                                  ) : (
                                    <div className="text-font text-color" dangerouslySetInnerHTML={{__html: page?.page?.content?.ar as string}} />

                                ) }

                            </div>
                        </div>
                        {page && page.page_id === ABOUT_PAGE_ID  ? (
                            <div className="row pt-30 pb-30">
                                <div className="col-md-4">
                                    <Link to={`/${currentLanguageCode}/on-boarding`}
                                       className="btn btn-primary w-100">{t('signUpFree')}</Link>
                                </div>
                            </div>
                        ) : (null) }

                    </div>

                </div>
            </section>

            <Footer/>

        </Fragment>
    )
        ;
}

export default IndexPage;




