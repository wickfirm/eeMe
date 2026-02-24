import React, {FC, useEffect, useState} from 'react';
import Cookies from "js-cookie";
import HorizontalArticle from "../articles/horizontal";
import VerticalArticle from "../articles/vertical";
import AsideArticle from "../articles/aside";
import {useTranslation} from "react-i18next";
import {getTalentsArticles} from "../../../core/talent/requests";
import {useParams} from "react-router-dom";



type Props = {
    articles ?: any
    total ?: any
    talent ?:any
    link ?:any

}

const Articles: FC<Props> = ({articles , total , talent , link}) => {

    const currentLanguageCode = Cookies.get('i18next') || 'en'
    const [currPagePriority, setCurrPagePriority] = useState(1);
    const [prevPagePriority, setPrevPagePriority] = useState(0);
    const [lastPagePriority, setLastPagePriority] = useState(0);
    const [talentsPriorityPageNumber , setTalentsPriorityPageNumber] = useState(2)
    const [renderedTalentsPriority , setRenderedTalentsPriority] = useState([])
    const {t} = useTranslation()

    const [loading, setLoading] = useState(false)

    const params = useParams()


    const getMoreArticles = async () => {
        try {
            setLoading(true)
            const response = await getTalentsArticles(params?.talent ,currentLanguageCode  , talentsPriorityPageNumber )



            setLastPagePriority(response.data.last_page);

            if (!response.data.data.length) {
                return;
            }
            setPrevPagePriority(currPagePriority);
            setCurrPagePriority(currPagePriority + 1 )

            // @ts-ignore
            setRenderedTalentsPriority([...renderedTalentsPriority, ...response.data.data]);



            setTalentsPriorityPageNumber(talentsPriorityPageNumber + 1)


        }

        catch (ex) {
            console.error(ex)
        } finally {

            setLoading(false)
        }

    }
    return(
        <div>
            {articles  && articles?.length > 0 ? (
                <div className="articles pt-50 pb-50 bg-main">
                    <div className="container">
                        <div className="row pb-20">
                            <div className="col-md-12 ">
                                <div className="">
                                    <h3 className="title-font-bold title-color">{t('moreOn')} <span
                                        className="text-capitalize">{currentLanguageCode === 'en' ? talent?.user.name.en :  talent?.user.name.ar}</span></h3>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-lg-8 col-md-12">
                                <div className="articles">
                                    <div className="container">
                                        {articles && articles?.slice(0, 1).map((article: any) => (
                                            <HorizontalArticle article={article}  key={article.id} talent={talent}  link={link}/>
                                        ))}
                                        <div className='row pt-20'>
                                            {articles && articles?.slice(1, 4).map((article: any) => (
                                                <VerticalArticle article={article}  key={article.id} talent={talent} link={link}/>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-12">
                                {articles && articles?.slice(4, 6).map((article: any) => (
                                    <AsideArticle article={article}  key={article.id}  talent={talent} link={link}/>
                                ))}

                            </div>

                        </div>

                        {renderedTalentsPriority  &&  renderedTalentsPriority?.length > 0 ? (
                            <div className="row">
                                {
                                    renderedTalentsPriority?.map((article: any  ) => (
                                        article != null ? (
                                            <VerticalArticle
                                                article={article}
                                                link={link}
                                                key={article.id}
                                                colMd3={true}
                                                talent={talent}/>
                                        ) : null
                                    ))}
                            </div>
                        ) : null }

                    </div>
                </div>



            ) : null }

            {total > 6  && lastPagePriority !== currPagePriority ? (
                <div className="container">
                    <div className="row pt-10 pb-50">
                        <div className="col-md-3 col-centered">
                            <button  className="btn btn-primary w-100" onClick={getMoreArticles}>
                                {!loading && <span className='indicator-label'>  {t('seeMore')}</span>}
                                {loading && (
                                    <span className='indicator-progress' style={{display: 'block'}}>
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
                                )}

                            </button>

                        </div>
                    </div>
                </div>
            ) : ( null )}
        </div>


    );
}

export default Articles;