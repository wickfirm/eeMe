import React, {FC, useEffect, useState} from 'react';
import Cookies from "js-cookie";
import {useTranslation} from "react-i18next";
import Select from "react-select";
import makeAnimated from 'react-select/animated';
import * as Yup from "yup";
import {useFormik} from "formik";
import clsx from "clsx";
import {Modal} from "react-bootstrap";
import {VIDEO_ORDER_TYPE} from "../../../../../helpers/crud-helper/consts";
import {useNavigate} from "react-router-dom";
import { bookStore , promoCodeValidity} from '../../../../../core/book/requests';

type Props = {
    talent?: any
    occasions ?: any
    personalizedAddons ?:any
    price ?:any

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

    occasion_id : Yup.number()
        .required('This field is required'),


    other_sender: Yup.string()
        .required('This field is required'),

    other_recipient: Yup.string().when('videoTargetType', {
        is: '2',
        then: Yup.string().required('This field is required'),
    }),

})

const initialValues = {
    email: '',
    other_sender: "" ,
    other_recipient: "" ,
    phone_number : "",
    message : "",
    occasion_id : "" ,
    payment_method: "",
    promoCode: "",
    addons: [],
    video_target_option: '2',
    price: "",
    is_public: true,
    order_type: VIDEO_ORDER_TYPE
}

interface FormData {
    promoCode: string;
    addons: { id: number; name: string; price: number }[];
    videoTargetType: "1" | "2";
}

const initialFormData: FormData = {
    promoCode: "",
    addons: [],
    videoTargetType: "2"
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
const PersonalizedForm: FC<Props> = ({talent ,occasions,personalizedAddons , price}) => {
    const [videoTarget, setVideoTarget] = useState('2');
    const [orderPrice, setOrderPrice] = useState<number>(price);
    const [orderBasePrice, setOrderBasePrice] = useState<number>(price);
    const [loading, setLoading] = useState(false)
    const [isPromoCodeValid, setIsPromoCodeValid] = useState<boolean | null>(null);
    const [discountPrice, setDiscountPrice] = useState(0);
    const [formData, setFormData] = useState(initialFormData);
    const [promoData, setPromoData] = useState(initialPromoData);
    const [promoCodeData, setPromoCodeData] = useState<any>();
    const [isPublic, setIsPublic] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalState, setModalState] = useState<ModalState>({
        title: "",
        description: "",
    });
    const currentLanguageCode = Cookies.get('i18next') || 'en'
    const {t} = useTranslation()

    const handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsPublic(event.target.checked);
        formik.setFieldValue("is_public", event.target.checked);
    }

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

    const handleRadioChange = (event: any) => {
        setVideoTarget(event.target.value);
        formik.setFieldValue("video_target_option", event.target.value);
    };


    function openModalWithData(title: string, description: string) {
        setModalState({ title, description });
        setIsModalOpen(true)
    }

    useEffect(() => {
        formik.setFieldValue("price", orderPrice);
    }, [t, discountPrice,formData])
    const { values} = formik;

    return (
        <div className="personalized-form mt-3" id="personal_form">
            {talent && talent.is_published === 1 ?
                <form className='form w-100 pt-10' onSubmit={formik.handleSubmit} noValidate>
                    <div className="form-group">
                        <div className="form group row pb-10">
                            <div className=" col-md-3 ">
                                <div className="font-text-bold s-title">{t('form.thisVideoIs')}</div>
                            </div>
                            <div className="col-md-4 col target-video">
                                <div className="form-check">
                                    <input  {...formik.getFieldProps('videoTargetType')}
                                            checked={values.video_target_option === '2'} onChange={handleRadioChange}

                                            className="form-check-input video-target-option"
                                            id="video_target_option_other"
                                            type="radio" name="video_target_option" value="2"/>
                                    <label
                                        className="form-check-label col-dark radio-label color-muted">{t('form.videoTargetOther')}</label>

                                </div>
                            </div>
                            <div className="col-md-4 col target-video">
                                <div className="form-check">
                                    <input  {...formik.getFieldProps('videoTargetType')}
                                            checked={values.video_target_option === '1'} onChange={handleRadioChange}

                                            className="form-check-input video-target-option "
                                            id="video_target_option_self" type="radio"
                                            name="video_target_option" value="1"
                                            placeholder={t('form.videoTargetSelf') || ""}/>
                                    <label
                                        className="form-check-label col-dark radio-label color-muted">{t('form.videoTargetSelf')}</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-md-7">
                            <div className="form-group collapse multi-collapse no-transition show"
                                 id="video_target_other">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="row">
                                            <div
                                                className={`${values.video_target_option === '2' ? `col-md-6 col-6` : `col-md-12`}`}>
                                                <label
                                                    className="label-book-bold color-muted">  {values.video_target_option === '2' ? t('form.from') : t('form.name')}</label>
                                                <input type="text"
                                                       placeholder={values.video_target_option === '2' ? t('form.fromPlaceholder') || "" : t('form.name') || ""}
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
                                            {values.video_target_option === '2' &&
                                                <div className={`col-md-6 col-6`}>
                                                    <label
                                                        className="label-book-bold color-muted">{t('form.to')}</label>
                                                    <input type="text"
                                                           {...formik.getFieldProps('other_recipient')}
                                                           className={clsx(
                                                               'form-control book-top-fields',
                                                               {'is-invalid': formik.touched.other_recipient && formik.errors.other_recipient},
                                                               {
                                                                   'is-valid': formik.touched.other_recipient && !formik.errors.other_recipient,
                                                               }
                                                           )}
                                                           name="other_recipient"
                                                           placeholder={t('form.toPlaceholder') || ""}/>
                                                    {formik.values.video_target_option === "2" && formik.touched.other_recipient && formik.errors.other_recipient ? (
                                                        <div className='fv-plugins-message-container'>
                                                            <span role='alert'>{formik.errors.other_recipient}</span>
                                                        </div>
                                                    ) : null}

                                                </div>
                                            }

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {occasions && occasions.length > 0 &&
                            <div className="col-md-5 col">
                                <label className="occasion">Occasion</label>
                                <div className="select-omneeyat">
                                    <Select

                                        closeMenuOnSelect={false}
                                        placeholder={`${t('form.occasionPlaceHolder') || ""}`}
                                        components={makeAnimated()}
                                        options={occasions.map((e: {
                                            name: any;
                                            id: any
                                        }) => ({label: e.name.en, value: e.id}))}
                                        isSearchable={true}
                                        onChange={(newValue: any) =>
                                            formik.setFieldValue('occasion_id', newValue.value)
                                        }
                                    />
                                    {formik.touched.occasion_id && formik.errors.occasion_id && (
                                        <div className='fv-plugins-message-container'>
                                            <span role='alert'>{formik.errors.occasion_id}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        }


                    </div>
                    {personalizedAddons && personalizedAddons.length > 0 &&
                        <div className="form-group mt-4">
                            <span
                                className="addons-title font-text-bold s-title fs-20">{t('form.additionalRequest')}</span>
                            <div className="mt-2">
                                {personalizedAddons.length > 0 && personalizedAddons.map((talentAddon: any) => (
                                    <div className="form-check form-check-custom form-check-solid "
                                         key={talentAddon.id}>

                                        <input className="form-check-input btn-addons " type="checkbox"
                                               value={talentAddon.addons.id}
                                               onChange={handleAddonCheckboxChange}
                                               data-price={talentAddon.price}
                                        />

                                        <label className="form-check-label addon-name color-muted pt-lg-2">
                                            {currentLanguageCode === 'en' && talentAddon.addons.name && talentAddon.addons.name.en ? talentAddon.addons.name.en : currentLanguageCode === 'ar' && talentAddon.addons.name && talentAddon.addons.name.ar ? talentAddon.addons.name.ar : ""}:
                                            ${talentAddon.price}

                                            <button type="button"
                                                    data-name={`${talentAddon.addons.name.en}`}
                                                    data-description={`${talentAddon.addons.description.en}`}
                                                    className="btn text-primary  info"
                                                    onClick={() => openModalWithData(
                                                        currentLanguageCode === 'en' && talentAddon.addons && talentAddon.addons.name && talentAddon.addons.name.en ? talentAddon.addons.name.en : currentLanguageCode === 'ar' && talentAddon.addons && talentAddon.addons.name && talentAddon.addons.name.ar ? talentAddon.addons.name.ar : "",
                                                        currentLanguageCode === 'en' && talentAddon.addons && talentAddon.addons.description && talentAddon.addons.description.en ? talentAddon.addons.description.en : currentLanguageCode === 'ar' && talentAddon.addons && talentAddon.addons.description && talentAddon.addons.description.ar ? talentAddon.addons.description.ar : "")}>
                                                <i className="far fa-question-circle"></i>
                                            </button>
                                        </label>
                                    </div>

                                ))}


                            </div>

                        </div>
                    }

                    <div className="form-group mt-3 pb-10">
                        <label className="instruction font-text-bold s-title mb-2 ">
                            {talent && talent.user && talent.user.name && talent.user.name.en && currentLanguageCode === 'en' ? t('form.instructions', {talent: talent.user.name.en}) : talent && talent.user && talent.user.name && talent.user.name.ar && currentLanguageCode === 'ar' ? t('form.instructions', {talent: talent.user.name.ar}) : ""}
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
                            placeholder={t('form.instructionPlaceholder') || ""}/>

                        {formik.touched.message && formik.errors.message && (
                            <div className='fv-plugins-message-container'>
                                <span role='alert'>{formik.errors.message}</span>
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-md-4 mt-3">
                                <label
                                    className="label-book-bold font-text-bold s-title  mb-3">{t('form.email')}</label>
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

                    <div className="form-group">
                        <div className="form-check form-check-custom form-check-solid">
                            <input type="checkbox" name="subscribe" className={'form-check-input'}
                                   onChange={handleCheckbox} checked={isPublic}/>

                            <label className="mt-2 form-check-label label-book-bold public-statement font-text-bold s-title"
                                   htmlFor="gridCheck">
                                {t('form.makePublic')}
                            </label>
                        </div>
                    </div>

                    <div className="form-group mt-2">
                <span className="">
                    <span className=" font-text-bold s-title fs-16">{t('form.bookPersonalizedVideo')}: </span>
                    <span className=" text-primary text-font-bold fw-bold fs-19">
                        {currentLanguageCode === 'en' && '$ '}
                        <span className="talent_price text-font-bold fw-bold">
                            {orderPrice}
                        </span>
                        {currentLanguageCode === 'ar' && '$'}
                    </span>
                </span>
                    </div>
                    <input type={'hidden'} value={orderPrice} name={`price`}/>

                    {talent && talent.is_published === 1 ?

                        <div className="form-group row mt-2">
                            <div
                                className={`col-md-4 mt-2 ${currentLanguageCode === 'en' ? 'ps-lg-0 pe-lg-1' : 'pe-lg-0 ps-lg-1'}`}>
                                <button type="submit" id="credit-card-btn"
                                        className=" btn btn-primary w-100 cc-btn-personal"
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
                            <div
                                className={`col-md-4 mt-2 ${currentLanguageCode === 'en' ? 'ps-lg-1 pe-lg-1' : 'pe-lg-1 ps-lg-1'}`}>
                                <button type="submit" className=" btn btn-primary  w-100 pp-btn-personal"
                                        id="paypal-btn"
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
                            <div
                                className={`col-md-4 mt-2 ${currentLanguageCode === 'en' ? 'ps-lg-1 pe-lg-1' : 'pe-lg-1 ps-lg-1'}`}>
                                <button type="submit" className=" btn btn-primary w-100 wu-btn-personal"
                                        name="payment-method"
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

                            {/*                    disabled={formik.isSubmitting || !formik.isValid}*/}
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

                        :
                        <div className="form-group row mt-2">
                            <div
                                className={`col-md-4 mt-2 ${currentLanguageCode === 'en' ? 'ps-lg-0 pe-lg-1' : 'pe-lg-0 ps-lg-1'}`}>
                                <button type="submit" id="credit-card-btn"
                                        className=" btn btn-primary w-100 cc-btn-personal"
                                        name="payment-method" value="1">
                                    <span className='indicator-label'> Credit Card</span>

                                </button>
                            </div>
                            <div
                                className={`col-md-4 mt-2 ${currentLanguageCode === 'en' ? 'ps-lg-1 pe-lg-1' : 'pe-lg-1 ps-lg-1'}`}>
                                <button type="submit" className=" btn btn-primary  w-100 pp-btn-personal"
                                        id="paypal-btn"
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
                            <div
                                className={`col-md-4 mt-2 ${currentLanguageCode === 'en' ? 'ps-lg-1 pe-lg-1' : 'pe-lg-1 ps-lg-1'}`}>
                                <button type="submit" className=" btn btn-primary w-100 wu-btn-personal"
                                        name="payment-method"
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


                        </div>}


                </form>

                :

            <div>
                    <div className="form-group">
                        <div className="form group row pb-10">
                            <div className=" col-md-3 ">
                                <div className="font-text-bold s-title">{t('form.thisVideoIs')}</div>
                            </div>
                            <div className="col-md-4 col target-video">
                                <div className="form-check">
                                    <input  {...formik.getFieldProps('videoTargetType')}
                                            checked={values.video_target_option === '2'} onChange={handleRadioChange}

                                            className="form-check-input video-target-option"
                                            id="video_target_option_other"
                                            type="radio" name="video_target_option" value="2"/>
                                    <label
                                        className="form-check-label col-dark radio-label color-muted">{t('form.videoTargetOther')}</label>

                                </div>
                            </div>
                            <div className="col-md-4 col target-video">
                                <div className="form-check">
                                    <input  {...formik.getFieldProps('videoTargetType')}
                                            checked={values.video_target_option === '1'} onChange={handleRadioChange}

                                            className="form-check-input video-target-option "
                                            id="video_target_option_self" type="radio"
                                            name="video_target_option" value="1"
                                            placeholder={t('form.videoTargetSelf') || ""}/>
                                    <label
                                        className="form-check-label col-dark radio-label color-muted">{t('form.videoTargetSelf')}</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-md-7">
                            <div className="form-group collapse multi-collapse no-transition show"
                                 id="video_target_other">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="row">
                                            <div
                                                className={`${values.video_target_option === '2' ? `col-md-6 col-6` : `col-md-12`}`}>
                                                <label
                                                    className="label-book-bold color-muted">  {values.video_target_option === '2' ? t('form.from') : t('form.name')}</label>
                                                <input type="text"
                                                       placeholder={values.video_target_option === '2' ? t('form.fromPlaceholder') || "" : t('form.name') || ""}
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
                                            {values.video_target_option === '2' &&
                                                <div className={`col-md-6 col-6`}>
                                                    <label
                                                        className="label-book-bold color-muted">{t('form.to')}</label>
                                                    <input type="text"
                                                           {...formik.getFieldProps('other_recipient')}
                                                           className={clsx(
                                                               'form-control book-top-fields',
                                                               {'is-invalid': formik.touched.other_recipient && formik.errors.other_recipient},
                                                               {
                                                                   'is-valid': formik.touched.other_recipient && !formik.errors.other_recipient,
                                                               }
                                                           )}
                                                           name="other_recipient"
                                                           placeholder={t('form.toPlaceholder') || ""}/>
                                                    {formik.values.video_target_option === "2" && formik.touched.other_recipient && formik.errors.other_recipient ? (
                                                        <div className='fv-plugins-message-container'>
                                                            <span role='alert'>{formik.errors.other_recipient}</span>
                                                        </div>
                                                    ) : null}

                                                </div>
                                            }

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {occasions && occasions.length > 0 &&
                            <div className="col-md-5 col">
                                <label className="occasion">Occasion</label>
                                <div className="select-omneeyat">
                                    <Select

                                        closeMenuOnSelect={false}
                                        placeholder={`${t('form.occasionPlaceHolder') || ""}`}
                                        components={makeAnimated()}
                                        options={occasions.map((e: {
                                            name: any;
                                            id: any
                                        }) => ({label: e.name.en, value: e.id}))}
                                        isSearchable={true}
                                        onChange={(newValue: any) =>
                                            formik.setFieldValue('occasion_id', newValue.value)
                                        }
                                    />
                                    {formik.touched.occasion_id && formik.errors.occasion_id && (
                                        <div className='fv-plugins-message-container'>
                                            <span role='alert'>{formik.errors.occasion_id}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        }


                    </div>
                    {personalizedAddons && personalizedAddons.length > 0 &&
                        <div className="form-group mt-4">
                            <span
                                className="addons-title font-text-bold s-title fs-20">{t('form.additionalRequest')}</span>
                            <div className="mt-2">
                                {personalizedAddons.length > 0 && personalizedAddons.map((talentAddon: any) => (
                                    <div className="form-check form-check-custom form-check-solid "
                                         key={talentAddon.id}>

                                        <input className="form-check-input btn-addons " type="checkbox"
                                               value={talentAddon.addons.id}
                                               onChange={handleAddonCheckboxChange}
                                               data-price={talentAddon.price}
                                        />

                                        <label className="form-check-label addon-name color-muted pt-lg-2">
                                            {currentLanguageCode === 'en' && talentAddon.addons.name && talentAddon.addons.name.en ? talentAddon.addons.name.en : currentLanguageCode === 'ar' && talentAddon.addons.name && talentAddon.addons.name.ar ? talentAddon.addons.name.ar : ""}:
                                            ${talentAddon.price}

                                            <button type="button"
                                                    data-name={`${talentAddon.addons.name.en}`}
                                                    data-description={`${talentAddon.addons.description.en}`}
                                                    className="btn text-primary  info"
                                                    onClick={() => openModalWithData(
                                                        currentLanguageCode === 'en' && talentAddon.addons && talentAddon.addons.name && talentAddon.addons.name.en ? talentAddon.addons.name.en : currentLanguageCode === 'ar' && talentAddon.addons && talentAddon.addons.name && talentAddon.addons.name.ar ? talentAddon.addons.name.ar : "",
                                                        currentLanguageCode === 'en' && talentAddon.addons && talentAddon.addons.description && talentAddon.addons.description.en ? talentAddon.addons.description.en : currentLanguageCode === 'ar' && talentAddon.addons && talentAddon.addons.description && talentAddon.addons.description.ar ? talentAddon.addons.description.ar : "")}>
                                                <i className="far fa-question-circle"></i>
                                            </button>
                                        </label>
                                    </div>

                                ))}


                            </div>

                        </div>
                    }

                    <div className="form-group mt-3 pb-10">
                        <label className="instruction font-text-bold s-title mb-2 ">
                            {talent && talent.user && talent.user.name && talent.user.name.en && currentLanguageCode === 'en' ? t('form.instructions', {talent: talent.user.name.en}) : talent && talent.user && talent.user.name && talent.user.name.ar && currentLanguageCode === 'ar' ? t('form.instructions', {talent: talent.user.name.ar}) : ""}
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
                            placeholder={t('form.instructionPlaceholder') || ""}/>

                        {formik.touched.message && formik.errors.message && (
                            <div className='fv-plugins-message-container'>
                                <span role='alert'>{formik.errors.message}</span>
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-md-4 mt-3">
                                <label
                                    className="label-book-bold font-text-bold s-title  mb-3">{t('form.email')}</label>
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

                    <div className="form-group">
                        <div className="form-check form-check-custom form-check-solid">
                            <input type="checkbox" name="subscribe" className={'form-check-input'}
                                   onChange={handleCheckbox} checked={isPublic}/>

                            <label className="form-check-label label-book-bold public-statement font-text-bold s-title"
                                   htmlFor="gridCheck">
                                {t('form.makePublic')}
                            </label>
                        </div>
                    </div>

                    <div className="form-group mt-2">
                <span className="">
                    <span className=" font-text-bold s-title fs-16">{t('form.bookPersonalizedVideo')}: </span>
                    <span className=" text-primary text-font-bold fw-bold fs-19">
                        {currentLanguageCode === 'en' && '$ '}
                        <span className="talent_price text-font-bold fw-bold">
                            {orderPrice}
                        </span>
                        {currentLanguageCode === 'ar' && '$'}
                    </span>
                </span>
                    </div>
                    <input type={'hidden'} value={orderPrice} name={`price`}/>

                    {talent && talent.is_published === 1 ?

                        <div className="form-group row mt-2">
                            <div
                                className={`col-md-4 mt-2 ${currentLanguageCode === 'en' ? 'ps-lg-0 pe-lg-1' : 'pe-lg-0 ps-lg-1'}`}>
                                <button type="submit" id="credit-card-btn"
                                        className=" btn btn-primary w-100 cc-btn-personal"
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
                            <div
                                className={`col-md-4 mt-2 ${currentLanguageCode === 'en' ? 'ps-lg-1 pe-lg-1' : 'pe-lg-1 ps-lg-1'}`}>
                                <button type="submit" className=" btn btn-primary  w-100 pp-btn-personal"
                                        id="paypal-btn"
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
                            <div
                                className={`col-md-4 mt-2 ${currentLanguageCode === 'en' ? 'ps-lg-1 pe-lg-1' : 'pe-lg-1 ps-lg-1'}`}>
                                <button type="submit" className=" btn btn-primary w-100 wu-btn-personal"
                                        name="payment-method"
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

                            {/*                    disabled={formik.isSubmitting || !formik.isValid}*/}
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

                        :
                        <div className="form-group row mt-2">
                            <div
                                className={`col-md-4 mt-2 ${currentLanguageCode === 'en' ? 'ps-lg-0 pe-lg-1' : 'pe-lg-0 ps-lg-1'}`}>
                                <button type="submit" id="credit-card-btn"
                                        className=" btn btn-primary w-100 cc-btn-personal"
                                        name="payment-method" value="1">
                                    <span className='indicator-label'> Credit Card</span>

                                </button>
                            </div>
                            <div
                                className={`col-md-4 mt-2 ${currentLanguageCode === 'en' ? 'ps-lg-1 pe-lg-1' : 'pe-lg-1 ps-lg-1'}`}>
                                <button type="submit" className=" btn btn-primary  w-100 pp-btn-personal"
                                        id="paypal-btn"
                                        name="payment-method" value="2"
                                       >
                                     <span className='indicator-label'> PAYPAL</span>


                                </button>

                            </div>
                            <div
                                className={`col-md-4 mt-2 ${currentLanguageCode === 'en' ? 'ps-lg-1 pe-lg-1' : 'pe-lg-1 ps-lg-1'}`}>
                                <button type="submit" className=" btn btn-primary w-100 wu-btn-personal"
                                        name="payment-method"
                                        id="western-union-btn" value="0"
                                       >  <span className='indicator-label'> WESTERN UNION</span>
                                  </button>
                            </div>


                        </div>}


                </div>
            }

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
    )
}



export default PersonalizedForm;