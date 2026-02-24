import React, {FC, useEffect, useState} from 'react';
import Cookies from "js-cookie";
import HTMLReactParser from "html-react-parser";
import {useTranslation} from "react-i18next";
import {BUSINESS_ORDER_TYPE, CAMPAIGN_ORDER_TYPE, VIDEO_ORDER_TYPE} from "../../../../../helpers/crud-helper/consts";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import * as Yup from "yup";
import {bookStore, promoCodeValidity} from "../../../../../core/book/requests";
import {useFormik} from "formik";
import clsx from "clsx";
import {Modal} from "react-bootstrap";
type Props = {
    talent ?: any
    businessAddons ?:any

}
const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Wrong email format')
        .min(3, 'Minimum 3 symbols')
        .max(50, 'Maximum 50 symbols')
        .required('Email is required'),

    phone_number: Yup.number()
        .required('Phone number is required'),

    message : Yup.string()
        .required('Instruction is required'),

    other_sender: Yup.string()
        .required('This field is required'),

})

const initialValues = {
    email: '',
    other_sender: "" ,
    phone_number : "",
    message : "",
    payment_method: "",
    promoCode: "",
    addons: [],
    price: "",
    order_type: BUSINESS_ORDER_TYPE
}
interface FormData {
    promoCode: string;
    addons: { id: number; name: string; price: number }[];
}

const initialFormData: FormData = {
    promoCode: "",
    addons: [],
}

interface PromoData {
    promo_code_number: number;
    promo_type: number;
}

const initialPromoData: PromoData = {
    promo_code_number: 0,
    promo_type: 0,
};

interface ModalState {
    title: string;
    description: string;
}

const BusinessForm: FC<Props> = ({talent, businessAddons}) => {
    const currentLanguageCode = Cookies.get('i18next') || 'en'
    const {t} = useTranslation()
    const [orderPrice, setOrderPrice] = useState<number>(0);
    const [orderBasePrice, setOrderBasePrice] = useState<number>(0);
    const [loading, setLoading] = useState(false)
    const [isPromoCodeValid, setIsPromoCodeValid] = useState<boolean | null>(null);
    const [discountPrice, setDiscountPrice] = useState(0);
    const [formData, setFormData] = useState(initialFormData);
    const [promoData, setPromoData] = useState(initialPromoData);
    const [promoCodeData, setPromoCodeData] = useState<any>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalState, setModalState] = useState<ModalState>({
        title: "",
        description: "",
    });

    const handlePromoCodeChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const promoCode = event.target.value;
        setFormData({ ...formData, promoCode });
        const { value } = event.target;
        formik.setFieldValue("promoCode", value);

        try {
            const response = await promoCodeValidity(talent.id , promoCode )
            const data = response.data.data
            setPromoCodeData(data)
            if (data.is_valid === true) {
                setIsPromoCodeValid(true)
                if (data.promo_type === 1) {
                    const value = Number(orderBasePrice * ((100 - data.promo_code_number) / 100))
                    setOrderPrice(orderPrice - orderBasePrice + value)
                    setDiscountPrice(orderBasePrice * data.promo_code_number / 100);
                } else if (data.promo_type === 2) {
                    if (data.addons && data.addons.length > 0 && formData &&  formData.addons && formData.addons.length > 0) {
                        formData.addons.forEach((addon: any, index: any) => {
                            if (data.addons.includes(Number(addon.id))) {
                                const newPrice = Number(addon.price * ((100 - data.promo_code_number) / 100))
                                const discount = addon.price - newPrice
                                setDiscountPrice((prevTotal) => prevTotal + discount);
                                setOrderPrice((prevTotal) => prevTotal - addon.price + newPrice);
                            }
                        })
                    }
                } else {
                    const value = Number(orderBasePrice * ((100 - data.promo_code_number) / 100))
                    setOrderPrice(orderPrice - orderBasePrice + value)
                    setDiscountPrice(orderBasePrice * data.promo_code_number / 100);
                    if (data.addons && data.addons.length > 0 && formData &&  formData.addons && formData.addons.length > 0) {
                        formData.addons.forEach((addon: any, index: any) => {
                            if (data.addons.includes(Number(addon.id))) {
                                const newPrice = Number(addon.price * ((100 - data.promo_code_number) / 100))
                                const discount = addon.price - newPrice
                                setDiscountPrice((prevTotal) => prevTotal + discount);
                                setOrderPrice((prevTotal) => prevTotal - addon.price + newPrice);
                            }
                        })
                    }
                }

            }else{
                setOrderPrice((prevTotal) => prevTotal + discountPrice);
                setDiscountPrice(0);
                setPromoData(initialPromoData);
                setIsPromoCodeValid(false)

            }

            formik.setFieldValue("price", orderPrice);



        } catch (error) {
            setDiscountPrice(0);
            setPromoData(initialPromoData);

        }
    };
    const handleAddonCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const addonId = parseInt(event.target.value, 10);
        const addonPrice = event.target.dataset.price ? parseInt(event.target.dataset.price, 10) : 0;
        const { checked, value } = event.target;
        if (checked) {
            formik.setFieldValue("addons", [...formik.values.addons, value]);
        } else {
            const newAddons = formik.values.addons.filter(
                (addon: string) => addon !== value
            );
            formik.setFieldValue("addons", newAddons);
        }
        if (event.target.checked) {
            if(isPromoCodeValid === true){
                if (promoCodeData.promo_type === 2  || (promoCodeData.promo_type === 3) ){
                    if (promoCodeData.addons && promoCodeData.addons.length > 0) {
                        if (promoCodeData.addons.includes(Number(addonId))) {
                            const newPrice = Number(addonPrice * ((100 - promoCodeData.promo_code_number) / 100))
                            const discount = addonPrice - newPrice
                            setDiscountPrice((prevTotal) => prevTotal + discount);
                            setOrderPrice((prevTotal) => prevTotal  + newPrice);
                        }else{
                            setOrderPrice(orderPrice + addonPrice);
                        }
                    }
                }else{
                    setOrderPrice(orderPrice + addonPrice);
                }
            }else{
                setOrderPrice(orderPrice + addonPrice);

            }

            setFormData({
                ...formData,
                addons: [...formData.addons, { id: addonId, name: event.target.name, price: addonPrice }],
            });

        } else {

            if(isPromoCodeValid === true){
                if (promoCodeData.promo_type === 2  || (promoCodeData.promo_type === 3) ){
                    if (promoCodeData.addons && promoCodeData.addons.length > 0) {
                        if (promoCodeData.addons.includes(Number(addonId))) {
                            const newPrice = Number(addonPrice * ((100 - promoCodeData.promo_code_number) / 100))
                            const discount = addonPrice - newPrice
                            setDiscountPrice((prevTotal) => prevTotal + discount);
                            setOrderPrice((prevTotal) => prevTotal  - newPrice);
                        }
                    }
                }else{
                    setOrderPrice(orderPrice - addonPrice);

                }
            }else{
                setOrderPrice(orderPrice - addonPrice);

            }
            setFormData({
                ...formData,
                addons: formData.addons.filter((addon) => addon.id !== addonId),
            });


        }

        formik.setFieldValue("price", orderPrice);


    };
    function openModalWithData(title: string, description: string) {
        setModalState({ title, description });
        setIsModalOpen(true)
    }
    const formik = useFormik({
        initialValues,
        validationSchema: validationSchema,
        validateOnChange: true,
        onSubmit: async (values, {setSubmitting}) => {

            setSubmitting(true)
            try {
                setLoading(true)
                const { data }  =   await bookStore(values, talent.id)
                localStorage.removeItem('order_request_id');
                sessionStorage.setItem('order_request_id', data.data.order_request_id);

                window.location.href = data.data.url ;
            } catch (ex) {
                console.error(ex)
            } finally {
                setSubmitting(true)
                setLoading(false)
            }
        },
    })
    useEffect(() => {
        formik.setFieldValue("price", orderPrice);
    }, [t, discountPrice,formData])

    const { values} = formik;

    return(
        <div className="business-form mt-3" id="business_form">
            <form className='form w-100 pt-10' onSubmit={formik.handleSubmit} noValidate>
            <div className="form-group row">
                <div className="col-md-12">
                    <label className="label-book-bold color-muted">{t('form.name')}</label>
                    <input type="text"
                           placeholder={t('form.fromPlaceholder') || ""}
                           {...formik.getFieldProps('other_sender')}
                           className={clsx(
                               'form-control book-top-fields',
                               {'is-invalid': formik.touched.other_sender && formik.errors.other_sender},
                               {
                                   'is-valid': formik.touched.other_sender && !formik.errors.other_sender,
                               }
                           )}

                           name="other_sender"
                    />
                    {formik.touched.other_sender && formik.errors.other_sender && (
                        <div className='fv-plugins-message-container'>
                            <span role='alert'>{formik.errors.other_sender}</span>
                        </div>
                    )}
                </div>
            </div>
            {businessAddons && businessAddons.length > 0 &&
                <div className="form-group mt-4">
                    <span className="addons-title font-text-bold s-title fs-20">{t('form.pleaseSelect')}:</span>
                    <div className="mt-2">
                        {businessAddons && businessAddons.length > 0 && businessAddons.map((categoryAddon: any) => (
                            <div key={categoryAddon[0].id}>
                                {businessAddons.length > 1 &&
                                    <div className="pt-10 pb-10">
                                        <span className="addons-title  font-text-bold s-title fs-20">{categoryAddon[0].category_addon.name.en}</span>
                                    </div>
                                }

                                {categoryAddon.map((addon: any) => ( addon &&
                                    <div className="form-check form-check-custom form-check-solid" key={addon.id}>
                                        <input className="form-check-input btn-addons" type="checkbox"
                                               value={addon.id}
                                               onChange={handleAddonCheckboxChange}
                                               data-price={addon.talent_addon[0].price}

                                        />
                                        <label className="form-check-label addon-name color-muted  pt-lg-2">{currentLanguageCode === 'en' && addon.name && addon.name.en ? addon.name.en : currentLanguageCode === 'ar' && addon.name && addon.name.ar ? addon.name.ar : ""}:
                                            ${addon.talent_addon[0].price}


                                            <button type="button"
                                                    data-name={`${addon.name.en}`}
                                                    data-description={`${addon.description.en}`}
                                                    className="btn text-primary info"
                                                    onClick={() => openModalWithData(
                                                        currentLanguageCode === 'en' && addon &&  addon.name.en ? addon.name.en : currentLanguageCode === 'ar' && addon && addon.name && addon.name.ar ? addon.name.ar : "" ,
                                                        currentLanguageCode === 'en' && addon &&  addon.description.en ? addon.description.en : currentLanguageCode === 'ar' && addon && addon.description && addon.description.ar ? addon.description.ar : "")}><i className="far fa-question-circle"></i>
                                            </button>
                                        </label>
                                    </div>
                                ))}
                            </div>

                        ))}
                    </div>




                </div>
            }

            <div className="form-group mt-3 pb-10">

                <label className="instruction font-text-bold s-title mb-2 ">
                    { t('form.message')}

                  </label>
                <textarea
                    required  {...formik.getFieldProps('message')}
                    id="instruction-textarea"
                    name="message"
                    className={clsx(
                        'form-control instruction-text-height book-btm-fields',
                        {'is-invalid': formik.touched.message && formik.errors.message},
                        {
                            'is-valid': formik.touched.message && !formik.errors.message,
                        }
                    )}
                    placeholder={t('form.messagePlaceholder') || ""}/>

                {formik.touched.message && formik.errors.message && (
                    <div className='fv-plugins-message-container'>
                        <span role='alert'>{formik.errors.message}</span>
                    </div>
                )}

            </div>

                <div className="form-group">
                    <div className="row">
                        <div className="col-md-4 mt-3">
                            <label className="label-book-bold font-text-bold s-title  mb-3">{t('form.email')}</label>
                            <input type="email"  {...formik.getFieldProps('email')}
                                   className={clsx(
                                       'form-control book-btm-fields',
                                       {'is-invalid': formik.touched.email && formik.errors.email},
                                       {
                                           'is-valid': formik.touched.email && !formik.errors.email,
                                       }
                                   )}
                                   required name="email"
                                   placeholder="example@omneeyat.com"/>

                            {formik.touched.email && formik.errors.email && (
                                <div className='fv-plugins-message-container'>
                                    <span role='alert'>{formik.errors.email}</span>
                                </div>
                            )}
                        </div>
                        <div className="col-md-4 mt-3">
                            <label
                                className="label-book-bold font-text-bold s-title  mb-3">{t('form.phoneNumber')}</label>
                            <input type="tel" required
                                   id="phone_number"
                                   {...formik.getFieldProps('phone_number')}
                                   placeholder={t('form.phoneNumberPlaceholder') || ""}
                                   name="phone_number"
                                   className={clsx(
                                       'form-control book-btm-fields',
                                       {'is-invalid': formik.touched.phone_number && formik.errors.phone_number},
                                       {
                                           'is-valid': formik.touched.phone_number && !formik.errors.phone_number,
                                       }
                                   )}

                            />

                            {formik.touched.phone_number && formik.errors.phone_number && (
                                <div className='fv-plugins-message-container'>
                                    <span role='alert'>{formik.errors.phone_number}</span>
                                </div>
                            )}
                            {/*<label className="custom-error">Please make sure you enter a correct phone number</label>*/}
                        </div>
                        <div className="col-md-4 mt-3">

                            <label
                                className="label-book-bold font-text-bold s-title  mb-3">{t('form.promoCode')}</label>

                            <div className={'position-relative'}>
                                <input
                                    className={clsx('form-control book-btm-fields promo_code_validity mb-20',)}
                                    type="text"
                                    id="promoCode"
                                    name="promoCode"
                                    onChange={handlePromoCodeChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.promoCode}
                                    placeholder={t('form.promoCode') || ""}
                                    style={{backgroundColor: isPromoCodeValid === false ? 'rgba(151,38,43,.4)' : ''}}


                                />
                                {isPromoCodeValid === true &&
                                    <div className="check-promo-code">
                                        <span>✓</span>
                                    </div>
                                }

                            </div>


                        </div>
                    </div>

                </div>

                {orderPrice > 0 &&
                    <div className="form-group mt-2">
                <span className="">
                    <span className=" font-text-bold s-title fs-16">{t('form.bookNowFor')}: </span>
                    <span className=" text-primary text-font-bold fw-bold fs-19">
                        {currentLanguageCode === 'en' && '$ '}
                        <span className="talent_price text-font-bold fw-bold">
                            {orderPrice}
                        </span>
                        {currentLanguageCode === 'ar' && '$'}
                    </span>
                </span>
                    </div>
                }



                <input type={'hidden'} value={orderPrice} name={`price`} />

                <div className="form-group row mt-2">
                    <div className={`col-md-4 mt-2 ${currentLanguageCode === 'en' ? 'ps-lg-0 pe-lg-1' : 'pe-lg-0 ps-lg-1'}`}>
                        <button type="submit" id="credit-card-btn" className=" btn btn-primary w-100 cc-btn-personal"
                                name="payment-method" value="1"
                                disabled={formik.isSubmitting || !formik.isValid}
                                onClick={() => {
                                    formik.setFieldValue("payment_method", "1");
                                    formik.submitForm();
                                }}
                        >
                            {!loading && <span className='indicator-label'> Credit Card</span>}
                            {loading && (
                                <span className='indicator-progress' style={{display: 'block'}}>
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
                            )}

                        </button>
                    </div>
                    <div className={`col-md-4 mt-2 ${currentLanguageCode === 'en' ? 'ps-lg-1 pe-lg-1' : 'pe-lg-1 ps-lg-1'}`}>
                        <button type="submit" className=" btn btn-primary  w-100 pp-btn-personal" id="paypal-btn"
                                name="payment-method" value="2"
                                disabled={formik.isSubmitting || !formik.isValid}
                                onClick={() => {
                                    formik.setFieldValue("payment_method", "2");
                                    formik.submitForm();
                                }}>
                            {!loading && <span className='indicator-label'> PAYPAL</span>}
                            {loading && (
                                <span className='indicator-progress' style={{display: 'block'}}>
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
                            )}


                        </button>

                    </div>
                    <div className={`col-md-4 mt-2 ${currentLanguageCode === 'en' ? 'ps-lg-1 pe-lg-1' : 'pe-lg-1 ps-lg-1'}`}>
                        <button type="submit" className=" btn btn-primary w-100 wu-btn-personal" name="payment-method"
                                id="western-union-btn" value="0"
                                disabled={formik.isSubmitting || !formik.isValid}
                                onClick={() => {
                                    formik.setFieldValue("payment_method", "0");
                                    formik.submitForm();
                                }}>  {!loading && <span className='indicator-label'> WESTERN UNION</span>}
                            {loading && (
                                <span className='indicator-progress' style={{display: 'block'}}>
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
                            )}</button>
                    </div>

            {/*        <div className="col-md-6 mt-2">*/}
            {/*            <button type="submit" className=" btn btn-primary  w-100" id="whats-btn" name="payment-method"*/}
            {/*                    value="4"*/}
            {/*                    disabled={orderPrice <= 0 || formik.isSubmitting || !formik.isValid}*/}
            {/*                    onClick={() => {*/}
            {/*                        formik.setFieldValue("payment_method", "4");*/}
            {/*                        formik.submitForm();*/}
            {/*                    }}>*/}

            {/*                {!loading && <span className='indicator-label'>  Chat With Us</span>}*/}
            {/*                {loading && (*/}
            {/*                    <span className='indicator-progress' style={{display: 'block'}}>*/}
            {/*  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>*/}
            {/*</span>*/}
            {/*                )}*/}

            {/*            </button>*/}
            {/*        </div>*/}
                </div>
            </form>

            <Modal className="modal" show={isModalOpen} onHide={() => setIsModalOpen(false)} centered>
                <Modal.Header className="" closeButton>
                    <Modal.Title className="text-primary ">
                        <div className=""
                             dangerouslySetInnerHTML={{__html: modalState.title}} />
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="">
                        <div className=""
                             dangerouslySetInnerHTML={{__html: modalState.description}} />
                    </div>

                </Modal.Body>
                <Modal.Footer className="border-top-0">
                </Modal.Footer>
            </Modal>
        </div>




    );
}

export default BusinessForm;