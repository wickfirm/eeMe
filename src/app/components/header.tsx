import React, {useEffect, FC, useState} from 'react';
import {Link,  useLocation} from 'react-router-dom';
import logo from '../../assets/images/eeme-logo.svg';
import {useNavigate} from 'react-router-dom'
import {useTranslation} from "react-i18next";

import Cookies from "js-cookie";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import { setTheme } from '../../store/actions/themeAction';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import i18next from "i18next";
import SearchBar from "./search";
import axios from "axios";
import {search} from "../core/subscribe/requests";
import {
  ABOUT_PAGE_ID, ARTICLE_PAGE_ID, BOOK_PAGE_ID,
  CATEGORY_INDEX_PAGE,
  CONTACT_PAGE_ID,
  HOME_PAGE_ID, ONBOARDING_ID, PRIVACY_PAGE_ID,
  TALENT_INDEX_PAGE_ID, TALENT_PAGE_ID,
  TERMS_PAGE_ID
} from "../helpers/crud-helper/consts";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {Category} from "../models/misc/Category";
import {bookPayment} from "../core/book/requests";
import {getCategories} from "../core/category/requests";



const languages = [
  {
    code : "ar",
    name: "العربية",
    dir: "rtl"

  },
  {
    code : "en",
    name: "English",
    dir: "ltr"

  }
]

type Props = {
  page ?: any
  category ?: any
  talent ?: any
  article ?: any
  href ?: any
}

const Header: FC<Props> = ({ href}) => {
  const [talents, setTalents] = useState([]);
  const { theme } = useSelector((state: RootState) => state.theme);
  const dispatch = useDispatch();
  const currentLanguageCode = Cookies.get('i18next') || 'en'
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
  const { t } = useTranslation()
  const [categories , setCategories] = useState<Array<Category> | undefined>([])

  useEffect(() => {
    document.body.dir = currentLanguage?.dir || 'ltr'
    document.body.classList.remove('en','ar');
    document.body.classList.add(currentLanguage?.code as string);

    getCategories().then(response => {
      setCategories(response.data.data.categories)

    })
  }, [currentLanguage, t])

  const chooseThemeHandler = (value: string) => {
    dispatch(setTheme(value));
  }
  const searchTalents = (e: any) => {

    const { value } = e.target.value;

    if (e.target.value.length > 0) {
      search(e.target.value).then((response) => {
        setTalents(response.data.data.talents);
      });
    } else {
      setTalents([]);
    }
  };


  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  return (
      <header>
        <div className="navigation bdr-btm">
          <Navbar className={' bdr-btm d-lg-none'} bg={""} fixed="top" expand="lg">
            <Container className={currentLanguageCode === 'en' ? 'pe-0' : ''}>
              <div className={'row w-100'}>
                <div className={'col-10'}>
                  <Link className="navbar-brand" to={'/'}>
                    <img className="logo-eeme" src={logo}
                         title="eeMe" alt="eeMe" id="eeMe_logo"/>
                  </Link>
                </div>
                <div className={'col-2'}>
                  <div className={`d-flex d-lg-none d-lg-none ${currentLanguageCode === 'en' ? 'text-end justify-content-end' : 'text-start justify-content-start'} `}>


                    <div className={`text-primary fs-14 font-text-bold pt-2 lang ${currentLanguageCode === 'en' ? 'ms-2' : 'me-2'}`}>
                      {currentLanguageCode === 'en' ? (
                          <a href={href && href}> العربية </a>
                      ) : (<a href={href && href}> English </a>)}
                    </div>
                  </div>
                </div>
              </div>
              <div className={'row w-100 justify-content-between'}>
                <div className="col-10 ">
                  <div className='position-relative '>
                    <div className="search__container">
                      <input className="form-control mr-sm-2 search_new__input search-input" id="search"

                             placeholder={t('searchPlaceHolder') || ""}
                             name="search"
                             type="text"
                             aria-label="Search"
                             onChange={searchTalents}
                            />
                      <span >
                       <i className="fas fa-search"></i>
                      </span>

                    </div>
                    {talents && talents.length > 0 ? (
                        <div className="search-result d-block">
                          <ul className='d-block'
                          >
                            {talents.length > 0 &&
                                talents.map((item: any) => (
                                        <li key={item.id}>
                                          <a href={`/${currentLanguageCode}/talent/${item?.slug.en}`}>{item.user.name.en}</a>
                                        </li>
                                    )
                                )}
                          </ul>
                        </div>
                    ) : null}
                  </div>
                </div>
                <div className="col-2 ">
                  <div className={`d-flex ${currentLanguageCode === 'en' ? 'justify-content-end' : 'justify-content-start'}`}>
                    {theme === 'dark' ? (
                        <div className="text-white pointer-event mode mode-dark me-2 mt-2" data-mode="light"
                             onClick={() => chooseThemeHandler('light')}>
                          <i className="fas fa-sun"></i>
                        </div>
                    ) : (
                        <div className="text-white pointer-event mode mode-light  me-2 mt-2" data-mode="dark"
                             onClick={() => chooseThemeHandler('dark')}>
                          <i className="fas fa-moon"></i>
                        </div>
                    )}
                    <Navbar.Toggle  aria-controls="navbarScroll" />
                  </div>


                </div>
                <Navbar.Collapse id="navbarScroll">
                  <Nav className="text-center mt-2 mb-2" style={{maxHeight: '200px'}} navbarScroll>

                    {categories && categories?.length > 0 &&
                        categories.map((category: any) => (
                            category &&
                            <Link className={'title-font text-white mt-1 mb-1'} key={category.id}
                                      to={`/${currentLanguageCode}/category/${category.slug}`}>{currentLanguageCode === 'en' ? category.name.en : category.name.ar}</Link>
                        ))}


                  </Nav>

                </Navbar.Collapse>
              </div>


            </Container>
          </Navbar>

          <div className="container d-lg-block d-none">
            <div className="row">
              <nav className="navbar navbar-expand-lg navbar-dark fixed-top  bdr-btm d-lg-block d-none" id="mainNav">
                <div className="container">
                  <div className="col-1 p-0">
                    <Link className="navbar-brand" to={'/'}>
                      <img className="logo-eeme" src={logo}
                           title="eeMe" alt="eeMe" id="eeMe_logo"/>
                    </Link>
                  </div>
                  <div className="col-6 d-lg-block d-none" id="list">

                    <ul className="navbar-nav ls-1 justify-content-between title-font pl-20 pr-20">

                      <li className="nav-item p-nav">
                        <div className="menu-bar-list">
                          <DropdownButton id="dropdown-basic-button" className='title-font-bold' title={t('talents')}>
                            {categories && categories?.length > 0 &&
                                categories.map((category: any) => (
                                    category && currentLanguageCode === 'en' ?
                                        <Dropdown.Item key={category.id} href={`/en/category/${category.slug}`}>{category.name.en}</Dropdown.Item>
                                        :
                                        category  && currentLanguageCode === 'ar' ?
                                            <Dropdown.Item key={category.id}  href={`/ar/category/${category.slug}`}>  {category.name.ar}</Dropdown.Item>
                                            :
                                            null

                                ))}
                          </DropdownButton>

                        </div>
                      </li>

                      <li className="nav-item mt-2">
                        <Link className="nav-link" to={`/${currentLanguageCode}/about`}>{t('about')}</Link>
                      </li>
                    </ul>
                  </div>
                  <div className="col-4 p-0 d-lg-block d-none">
                    <div className='position-relative'>
                      {/*<SearchBar onSearchSubmit={onSearchSubmit} clearResults={clearResults}/>*/}

                      <div className="search__container">
                        <input className="form-control mr-sm-2 search_new__input search-input" id="search"

                               placeholder={t('searchPlaceHolder') || ""}
                               name="search"
                               type="text"
                               aria-label="Search"
                               onChange={searchTalents}
                        />
                        <span >
                       <i className="fas fa-search"></i>
                      </span>

                      </div>
                      {talents && talents.length > 0 ? (
                          <div className="search-result d-block">
                            <ul className='d-block'
                            >
                              {talents.length > 0 &&
                                  talents.map((item: any) => (
                                      <li key={item.id}>
                                        <a href={`${currentLanguageCode === 'en' ? '/en/talent/' + item?.slug.en : '/ar/talent/' + item?.slug.ar}`}>
                                          <div className="d-flex align-items-center mb-2">
                                            <div
                                                className="symbol symbol-40 symbol-xxl-50 me-3 align-self-start align-self-xxl-center">
                                              <div className="symbol-label"
                                                   style={{backgroundImage: `url('${item?.image}')`}}></div>
                                            </div>
                                            <div
                                                className="d-flex justify-content-start flex-column">
                                             <span
                                                 className="text-white ">{currentLanguageCode === 'en' ? item.user.name.en : item.user.name.ar}</span>

                                              <div className="category-talent">
                                                <ul>
                                                  {item?.categories.length > 0 && item.categories.map((category: any) => (
                                                      <li className="fs-7" key={category?.id}>{currentLanguageCode === 'en' ? category?.name.en : category?.name.ar}</li>
                                                  ))}

                                                </ul>
                                              </div>




                                            </div>
                                          </div>
                                        </a>
                                      </li>
                                      )
                                  )}
                            </ul>
                          </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-1 justify-content-between lang-mode-pl d-flex">

                    {theme === 'dark' ? (
                        <div className="text-white pointer-event mode mode-dark d-lg-block d-none" data-mode="light"
                             onClick={() => chooseThemeHandler('light')}>
                          <i className="fas fa-sun"></i>
                        </div>
                    ) : (
                        <div className="text-white pointer-event mode mode-light d-lg-block d-none" data-mode="dark"
                             onClick={() => chooseThemeHandler('dark')}>
                          <i className="fas fa-moon"></i>
                        </div>
                    )}


                    <div className="text-primary fs-14 font-text-bold pt-2 lang">
                      {currentLanguageCode === 'en' ? (
                          <a href={href && href}> العربية </a>
                      ) : (<a href={href && href}> English </a>)}


                    </div>


                  </div>

                </div>

              </nav>
            </div>
          </div>
        </div>



      </header>
  )

}

export default Header;