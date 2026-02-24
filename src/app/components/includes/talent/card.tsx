import React, { FC } from 'react';
import Cookies from "js-cookie";
import {Link} from "react-router-dom";



type Props = {
    talent ?: any

}

const TalentCard: FC<Props> = ({talent}) => {

    const currentLanguageCode = Cookies.get('i18next') || 'en'

    return(
        <div className="col-xxl-2 col-lg-2 col-md-3 col-sm-4 col-6 pt-5 pb-5 p-5" >
                <Link  to={currentLanguageCode === 'en' ? `/en/talent/${talent?.slug?.en}` :  `/ar/talent/${talent?.slug?.ar}` } className="img-container">
                    <div className="">
                        <div className="">
                            {talent && talent.image &&
                                <img className="w-100 bdr-tl bdr-tr" src={`${talent?.image}`}  alt={`${talent?.user.name.en}`} />

                            }
                        </div>
                        <div className="data-bg p-2 bdr-bl bdr-br">

                            <div className="text-font title-color  mb-0">

                                {talent && talent?.user && currentLanguageCode === 'en' ?
                                    talent.user.name.en.substring(0, 13)
                                    :
                                    talent && talent?.user && currentLanguageCode === 'ar' ?
                                        talent.user.name.ar.substring(0, 13)
                                        :
                                        null }

                                {/*{talent.is_verified ? (*/}
                                <span
                                className={`${currentLanguageCode === 'en' ? 'ms-2' : 'me-2'}`}>
                                   <i className="far fa-check-circle   bg-primary text-white bdr-50"></i></span>
                                 {/*) : null }*/}
                                </div>
                            <div className="talent-categories">
                                <ul className="p-0 m-0">

                                    {talent && talent.categories && talent.categories.length > 0 && talent.categories.slice(0,1).map((category:any) => (
                                        category && currentLanguageCode === 'en' ?
                                            <li className="" key={category.id}>  {category.name.en}</li>
                                            :
                                            category  && currentLanguageCode === 'ar' ?
                                                <li className="" key={category.id}>  {category.name.ar}</li>
                                                :
                                                null

                                    ))}



                                </ul>
                            </div>
                        </div>
                    </div>
                </Link>

            </div>

    );
}

export default TalentCard;