import React, {FC, useEffect, useState} from 'react';
import {t} from "i18next";
import {useTranslation} from "react-i18next";


type Props  = {
    onSearchSubmit?: any;
    clearResults ?: any

}

const SearchBar: FC<Props> = ({onSearchSubmit , clearResults} ) => {
    const { t } = useTranslation()
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);



    // update 'term' value after 1 second from the last update of 'debouncedTerm'
    useEffect(() => {
        const timer = setTimeout(() => {

            setSearchTerm(debouncedTerm)
        }    , 1000);
        return () => {

            clearTimeout(timer)
        };
    }, [debouncedTerm])


    // submit a new search
    useEffect(() => {
        if(searchTerm !== ''){

            onSearchSubmit(searchTerm);
        }
        else{

            clearResults();
        }
    }, [searchTerm]);
    return(
        <div>
            <div className="search__container">
                <input className="form-control mr-sm-2 search_new__input search-input" id="search"

                       placeholder={t('searchPlaceHolder') || ""}
                       name="search"
                       type="text"
                       aria-label="Search"
                       onChange={e => setDebouncedTerm(e.target.value)}
                       value={debouncedTerm}/>
                <span >
                       <i className="fas fa-search"></i>
                      </span>

        </div>
        </div>

    );
}

export default SearchBar;