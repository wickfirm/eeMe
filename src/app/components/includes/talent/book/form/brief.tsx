import React, {FC, useState} from 'react';
import Cookies from "js-cookie";
import {useTranslation} from "react-i18next";
import {BUSINESS_ORDER_TYPE, CAMPAIGN_ORDER_TYPE, EXTRA_SETTINGS} from '../../../../../helpers/crud-helper/consts';
import { DatePicker } from 'rsuite';
import * as Yup from "yup";
import {useFormik} from "formik";
import clsx from "clsx";
import {bookStore} from "../../../../../core/book/requests";

type Props = {
    talent ?: any

}
const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Wrong email format')
        .min(3, 'Minimum 3 symbols')
        .max(50, 'Maximum 50 symbols')
        .required('Email is required'),


    message : Yup.string()
        .required('Instruction is required'),

    name: Yup.string()
        .required('This field is required'),

    campaign_name: Yup.string()
        .required('This field is required'),

    brand_name: Yup.string()
        .required('This field is required'),

    delivery_date: Yup.date()
        .required('This field is required'),

    custom_fee: Yup.number()
        .required('This field is required'),

    custom_number: Yup.string().when('usage_rights', {
        is: '4',
        then: Yup.string().required('This field is required'),
    }),

})

const initialValues = {
    email: '',
    campaign_name: "" ,
    name: "" ,
    message : "",
    brand_name: "",
    delivery_date: "",
    extra_settings: [],
    custom_fee: "",
    usage_rights: "",
    custom_number : "",
    order_type: CAMPAIGN_ORDER_TYPE
}

const BriefForm: FC<Props> = ({talent}) => {

    const currentLanguageCode = Cookies.get('i18next') || 'en'
    const {t} = useTranslation()
    const [showInputField, setShowInputField] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [loading, setLoading] = useState(false)
    const [selectedDate, setSelectedDate] = useState(null);



    const formik = useFormik({
        initialValues,
        validationSchema: validationSchema,
        validateOnChange: true,
        onSubmit: async (values, {setSubmitting}) => {


            setSubmitting(true)
            try {
                setLoading(true)
                const { data }  =   await bookStore(values , talent.id)

                if(data.data.status === 1 ){
                    setLoading(false)
                    setIsActive(true)

                    setTimeout(function () {
                        setIsActive(false)

                    }, 3500)

                }
            } catch (ex) {
                console.error(ex)
            } finally {
                setSubmitting(true)
                setLoading(false)
            }
        },
    })


    const handleExtraSettingsCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
        const setting = parseInt(event.target.value, 10);
        const { checked, value } = event.target;
        if (checked) {
            formik.setFieldValue("extra_settings", [...formik.values.extra_settings, value]);
        } else {
            const settings = formik.values.extra_settings.filter(
                (extra_setting: string) => extra_setting !== value
            );
            formik.setFieldValue("extra_settings", settings);
        }





    };

    const handleRadioClick = (event: any) => {
        formik.setFieldValue("usage_rights",  event.target.value);
        if (event.target.value === "4") {
            setShowInputField(true);
        } else {
            setShowInputField(false);
        }
    };

    const handleDateChange = (date:any) => {
        setSelectedDate(date);
        formik.setFieldValue("delivery_date", date);
    };
    return(
        <div>
            <div className = "request-brief-form" id = "request-brief-form"  >
                <div className={`newsletter-form-container pt-4 ${ isActive ? "  d-block" : "d-none"}`}>
                    <div className={` alert-box d-block `} >
                        <div className="alert alert-success alert-dismissible fade show"
                             role="alert">
                            {t('payment.requestBriefSuccess')}

                        </div>
                    </div>
                </div>
            <div className = "form-group pt-10" >

                {talent && talent.is_published === 1 ?
                    <form className='form w-100 pt-10' onSubmit={formik.handleSubmit} noValidate>
                        <div className="form-group row">
                            <div className="col-md-6  mb-sm-4 mb-5">
                                <label className="label-book-bold font-text-bold s-title">{t('form.brief.name')}</label>
                                <input type="text" required
                                       {...formik.getFieldProps('name')}
                                       className={clsx(
                                           'form-control book-top-fields',
                                           {'is-invalid': formik.touched.name && formik.errors.name},
                                           {
                                               'is-valid': formik.touched.name && !formik.errors.name,
                                           }
                                       )}

                                       name="name"

                                       placeholder={t('form.brief.name') || ""}/>

                                {formik.touched.name && formik.errors.name && (
                                    <div className='fv-plugins-message-container'>
                                        <span role='alert'>{formik.errors.name}</span>
                                    </div>
                                )}
                            </div>
                            <div className="col-md-6  mb-sm-4 mb-5">
                                <label
                                    className="label-book-bold font-text-bold s-title">{t('form.brief.campaignName')}</label>
                                <input type="text" required
                                       {...formik.getFieldProps('campaign_name')}
                                       className={clsx(
                                           'form-control book-top-fields',
                                           {'is-invalid': formik.touched.campaign_name && formik.errors.campaign_name},
                                           {
                                               'is-valid': formik.touched.campaign_name && !formik.errors.campaign_name,
                                           }
                                       )}
                                       name="campaign_name"
                                       placeholder={t('form.brief.campaignName') || ""}/>

                                {formik.touched.campaign_name && formik.errors.campaign_name && (
                                    <div className='fv-plugins-message-container'>
                                        <span role='alert'>{formik.errors.campaign_name}</span>
                                    </div>
                                )}
                            </div>
                            <div className="col-md-12">
                                <label
                                    className="label-book-bold font-text-bold s-title">{t('form.brief.brandName')} </label>
                                <input type="text" required
                                       {...formik.getFieldProps('brand_name')}
                                       className={clsx(
                                           'form-control book-top-fields',
                                           {'is-invalid': formik.touched.brand_name && formik.errors.brand_name},
                                           {
                                               'is-valid': formik.touched.brand_name && !formik.errors.brand_name,
                                           }
                                       )}
                                       name="brand_name"
                                       placeholder={t('form.brief.brandName') || ""}/>

                                {formik.touched.brand_name && formik.errors.brand_name && (
                                    <div className='fv-plugins-message-container'>
                                        <span role='alert'>{formik.errors.brand_name}</span>
                                    </div>
                                )}
                            </div>

                        </div>
                        <div className="form-group mb-sm-4 mb-5 mt-4">
                            <label className="instruction font-text-bold s-title">{t('form.brief.brief')}</label>
                            <textarea
                                required  {...formik.getFieldProps('message')}
                                className={clsx(
                                    'form-control instruction-text-height book-btm-fields',
                                    {'is-invalid': formik.touched.message && formik.errors.message},
                                    {
                                        'is-valid': formik.touched.message && !formik.errors.message,
                                    }
                                )}
                                name="message"
                                placeholder={t('form.brief.message') || ""}  />

                            {formik.touched.message && formik.errors.message && (
                                <div className='fv-plugins-message-container'>
                                    <span role='alert'>{formik.errors.message}</span>
                                </div>
                            )}
                        </div>
                        <div className="form-group">
                            <div className="row">
                                <div className="col-md-4 mb-sm-4 mb-5">
                                    <label className="label-book-bold font-text-bold s-title">{t('form.email')}</label>
                                    <input type="email" required
                                           {...formik.getFieldProps('email')}
                                           className={clsx(
                                               'form-control book-btm-fields',
                                               {'is-invalid': formik.touched.email && formik.errors.email},
                                               {
                                                   'is-valid': formik.touched.email && !formik.errors.email,
                                               }
                                           )}
                                           name="email"
                                           placeholder="example@omneeyat.com"

                                    />

                                    {formik.touched.email && formik.errors.email && (
                                        <div className='fv-plugins-message-container'>
                                            <span role='alert'>{formik.errors.email}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="col-md-4 mb-sm-4 mb-5">
                                    <label
                                        className="label-book-bold font-text-bold s-title">{t('form.brief.deliveryDate')}</label>

                                    <DatePicker
                                        oneTap
                                        className={clsx(
                                            'datepicker w-100',
                                            {'is-invalid': formik.touched.delivery_date && formik.errors.delivery_date},
                                            {
                                                'is-valid': formik.touched.delivery_date && !formik.errors.delivery_date,
                                            }
                                        )}

                                        placeholder={t('form.brief.deliveryDate')}
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                        format="dd-MM-yyyy"
                                        placement="auto"
                                        showWeekNumbers
                                        isoWeek
                                    />

                                    {formik.touched.delivery_date && formik.errors.delivery_date && (
                                        <div className='fv-plugins-message-container'>
                                            <span role='alert'>{formik.errors.delivery_date}</span>
                                        </div>
                                    )}
                                    {/*<input type = "text" className = "form-control book-btm-fields datepicker" required name = "date" />*/}
                                </div>
                                <div className="col-md-4  mb-sm-4 mb-5">
                                    <label
                                        className="label-book-bold font-text-bold s-title">{t('form.brief.customFee')}</label>
                                    <input type="text" required
                                           {...formik.getFieldProps('custom_fee')}
                                           className={clsx(
                                               'form-control book-btm-fields',
                                               {'is-invalid': formik.touched.custom_fee && formik.errors.custom_fee},
                                               {
                                                   'is-valid': formik.touched.custom_fee && !formik.errors.custom_fee,
                                               }
                                           )}
                                           name="custom_fee"/>

                                    {formik.touched.custom_fee && formik.errors.custom_fee && (
                                        <div className='fv-plugins-message-container'>
                                            <span role='alert'>{formik.errors.custom_fee}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="form-group  mb-sm-4 mb-5">
                            <div className="row">
                                <div className="col-md-12">
                                    <label
                                        className="label-book-bold font-text-bold s-title">{t('form.brief.extraSettings')}</label>
                                </div>
                                {EXTRA_SETTINGS.length > 0 && EXTRA_SETTINGS.map((setting: any, index) => (
                                    <div className="col-md-12" key={index}>
                                        <div className="form-check checkbox">
                                            <input className="form-check-input" name="keep_up_to_date"
                                                   type="checkbox"
                                                   value={index + 1}
                                                   onChange={handleExtraSettingsCheckbox}
                                                   id={`gridCheck${index}`}/>

                                            <label className="form-check-label  ms-1 me-1 pr-25  color-muted"
                                                   htmlFor={`gridCheck${index}`}>
                                                {currentLanguageCode === 'en' ? setting[index + 1].en : setting[index + 1].ar}
                                            </label>


                                        </div>

                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="form-group mb-sm-4 mb-5">
                            <div className="row ">
                                <div className="col-md-12 pb-10">
                                    <label
                                        className="label-book-bold font-text-bold s-title">{t('form.brief.usageRights')}</label>
                                </div>
                                <div className="col-md-12">
                                    <label className="radio ">
                                        <input id="custom_usage_right" className=" custom_usage_right color-muted"
                                               type="radio" name="usage_rights" value="1" onClick={handleRadioClick}
                                        />
                                        <span className="usage-right color-muted">&nbsp; {t('form.brief.fullRights')}</span>
                                    </label>
                                </div>
                                <div className="col-md-12">
                                    <label className="radio">
                                        <input id="custom_usage_right" className=" custom_usage_right " type="radio"
                                               name="usage_rights" value="2" onClick={handleRadioClick}
                                        />
                                        <span className="usage-right  color-muted">&nbsp;{t('form.brief.twoRights')}</span>
                                    </label>
                                </div>
                                <div className="col-md-12">
                                    <label className="radio">
                                        <input id="custom_usage_right" className="custom_usage_right " type="radio"
                                               name="usage_rights" value="3" onClick={handleRadioClick}
                                        />
                                        <span
                                            className="usage-right color-muted">&nbsp;{t('form.brief.noRights')} </span></label>
                                </div>
                                <div className="col-md-12 d-flex">
                                    <label className="radio">
                                        <input id="custom_usage_right" className=" custom_usage_right" type="radio"
                                               name="usage_rights" value="4" onClick={handleRadioClick}
                                        />
                                        <span
                                            className="usage-right  color-muted">&nbsp; {t('form.brief.customRights')}</span>
                                    </label>
                                    {showInputField && (
                                        <span id="custom_usage_right_nb " className={'me-2 ms-2'}>
                                        <input type="number"
                                               className={clsx(
                                                   'form-control book-btm-fields',
                                                   {'is-invalid': formik.touched.custom_number && formik.errors.custom_number},
                                                   {
                                                       'is-valid': formik.touched.custom_number && !formik.errors.custom_number,
                                                   }
                                               )}
                                               {...formik.getFieldProps('custom_number')}
                                               id="custom_usage_right_nb_input" name="custom_number"
                                               placeholder="Please enter the number"/>
                                            {formik.touched.custom_number && formik.errors.custom_number && (
                                                <div className='fv-plugins-message-container'>
                                                    <span role='alert'>{formik.errors.custom_number}</span>
                                                </div>
                                            )}
                                    </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="container">
                            <div className="row">
                                <button type="submit"
                                        id="request-btn"
                                        className=" btn btn-primary submit_btn my-auto btn continue-btn bk-btn w-100"
                                        name="submit_request"
                                        disabled={formik.isSubmitting || !formik.isValid}
                                        value="1">
                                    {!loading && <span className='indicator-label'>  {t('button.submit')}</span>}
                                    {loading && (
                                        <span className='indicator-progress' style={{display: 'block'}}>
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
                                    )}

                                </button>
                            </div>
                        </div>
                    </form>

                    :

                  <div>
                      <div className="form-group row">
                          <div className="col-md-6  mb-sm-4 mb-5">
                              <label className="label-book-bold font-text-bold s-title">{t('form.brief.name')}</label>
                              <input type="text" required
                                     {...formik.getFieldProps('name')}
                                     className={clsx(
                                         'form-control book-top-fields',
                                         {'is-invalid': formik.touched.name && formik.errors.name},
                                         {
                                             'is-valid': formik.touched.name && !formik.errors.name,
                                         }
                                     )}

                                     name="name"

                                     placeholder={t('form.brief.name') || ""}/>

                              {formik.touched.name && formik.errors.name && (
                                  <div className='fv-plugins-message-container'>
                                      <span role='alert'>{formik.errors.name}</span>
                                  </div>
                              )}
                          </div>
                          <div className="col-md-6  mb-sm-4 mb-5">
                              <label
                                  className="label-book-bold font-text-bold s-title">{t('form.brief.campaignName')}</label>
                              <input type="text" required
                                     {...formik.getFieldProps('campaign_name')}
                                     className={clsx(
                                         'form-control book-top-fields',
                                         {'is-invalid': formik.touched.campaign_name && formik.errors.campaign_name},
                                         {
                                             'is-valid': formik.touched.campaign_name && !formik.errors.campaign_name,
                                         }
                                     )}
                                     name="campaign_name"
                                     placeholder={t('form.brief.campaignName') || ""}/>

                              {formik.touched.campaign_name && formik.errors.campaign_name && (
                                  <div className='fv-plugins-message-container'>
                                      <span role='alert'>{formik.errors.campaign_name}</span>
                                  </div>
                              )}
                          </div>
                          <div className="col-md-12">
                              <label
                                  className="label-book-bold font-text-bold s-title">{t('form.brief.brandName')} </label>
                              <input type="text" required
                                     {...formik.getFieldProps('brand_name')}
                                     className={clsx(
                                         'form-control book-top-fields',
                                         {'is-invalid': formik.touched.brand_name && formik.errors.brand_name},
                                         {
                                             'is-valid': formik.touched.brand_name && !formik.errors.brand_name,
                                         }
                                     )}
                                     name="brand_name"
                                     placeholder={t('form.brief.brandName') || ""}/>

                              {formik.touched.brand_name && formik.errors.brand_name && (
                                  <div className='fv-plugins-message-container'>
                                      <span role='alert'>{formik.errors.brand_name}</span>
                                  </div>
                              )}
                          </div>

                      </div>
                      <div className="form-group mb-sm-4 mb-5 mt-4">
                          <label className="instruction font-text-bold s-title">{t('form.brief.brief')}</label>
                          <textarea
                              required  {...formik.getFieldProps('message')}
                              className={clsx(
                                  'form-control instruction-text-height book-btm-fields',
                                  {'is-invalid': formik.touched.message && formik.errors.message},
                                  {
                                      'is-valid': formik.touched.message && !formik.errors.message,
                                  }
                              )}
                              name="message"
                              placeholder={t('form.brief.message') || ""}  />

                          {formik.touched.message && formik.errors.message && (
                              <div className='fv-plugins-message-container'>
                                  <span role='alert'>{formik.errors.message}</span>
                              </div>
                          )}
                      </div>
                      <div className="form-group">
                          <div className="row">
                              <div className="col-md-4 mb-sm-4 mb-5">
                                  <label className="label-book-bold font-text-bold s-title">{t('form.email')}</label>
                                  <input type="email" required
                                         {...formik.getFieldProps('email')}
                                         className={clsx(
                                             'form-control book-btm-fields',
                                             {'is-invalid': formik.touched.email && formik.errors.email},
                                             {
                                                 'is-valid': formik.touched.email && !formik.errors.email,
                                             }
                                         )}
                                         name="email"
                                         placeholder="example@omneeyat.com"

                                  />

                                  {formik.touched.email && formik.errors.email && (
                                      <div className='fv-plugins-message-container'>
                                          <span role='alert'>{formik.errors.email}</span>
                                      </div>
                                  )}
                              </div>
                              <div className="col-md-4 mb-sm-4 mb-5">
                                  <label
                                      className="label-book-bold font-text-bold s-title">{t('form.brief.deliveryDate')}</label>

                                  <DatePicker
                                      oneTap
                                      className={clsx(
                                          'datepicker w-100',
                                          {'is-invalid': formik.touched.delivery_date && formik.errors.delivery_date},
                                          {
                                              'is-valid': formik.touched.delivery_date && !formik.errors.delivery_date,
                                          }
                                      )}

                                      placeholder={t('form.brief.deliveryDate')}
                                      value={selectedDate}
                                      onChange={handleDateChange}
                                      format="dd-MM-yyyy"
                                      placement="auto"
                                      showWeekNumbers
                                      isoWeek
                                  />

                                  {formik.touched.delivery_date && formik.errors.delivery_date && (
                                      <div className='fv-plugins-message-container'>
                                          <span role='alert'>{formik.errors.delivery_date}</span>
                                      </div>
                                  )}
                                  {/*<input type = "text" className = "form-control book-btm-fields datepicker" required name = "date" />*/}
                              </div>
                              <div className="col-md-4  mb-sm-4 mb-5">
                                  <label
                                      className="label-book-bold font-text-bold s-title">{t('form.brief.customFee')}</label>
                                  <input type="text" required
                                         {...formik.getFieldProps('custom_fee')}
                                         className={clsx(
                                             'form-control book-btm-fields',
                                             {'is-invalid': formik.touched.custom_fee && formik.errors.custom_fee},
                                             {
                                                 'is-valid': formik.touched.custom_fee && !formik.errors.custom_fee,
                                             }
                                         )}
                                         name="custom_fee"/>

                                  {formik.touched.custom_fee && formik.errors.custom_fee && (
                                      <div className='fv-plugins-message-container'>
                                          <span role='alert'>{formik.errors.custom_fee}</span>
                                      </div>
                                  )}
                              </div>
                          </div>
                      </div>
                      <div className="form-group  mb-sm-4 mb-5">
                          <div className="row">
                              <div className="col-md-12">
                                  <label
                                      className="label-book-bold font-text-bold s-title">{t('form.brief.extraSettings')}</label>
                              </div>
                              {EXTRA_SETTINGS.length > 0 && EXTRA_SETTINGS.map((setting: any, index) => (
                                  <div className="col-md-12" key={index}>
                                      <div className="form-check checkbox">
                                          <input className="form-check-input" name="keep_up_to_date"
                                                 type="checkbox"
                                                 value={index + 1}
                                                 onChange={handleExtraSettingsCheckbox}
                                                 id={`gridCheck${index}`}/>

                                          <label className="form-check-label  ms-1 me-1 pr-25  color-muted"
                                                 htmlFor={`gridCheck${index}`}>
                                              {currentLanguageCode === 'en' ? setting[index + 1].en : setting[index + 1].ar}
                                          </label>


                                      </div>

                                  </div>
                              ))}
                          </div>
                      </div>
                      <div className="form-group mb-sm-4 mb-5">
                          <div className="row ">
                              <div className="col-md-12 pb-10">
                                  <label
                                      className="label-book-bold font-text-bold s-title">{t('form.brief.usageRights')}</label>
                              </div>
                              <div className="col-md-12">
                                  <label className="radio ">
                                      <input id="custom_usage_right" className=" custom_usage_right color-muted"
                                             type="radio" name="usage_rights" value="1" onClick={handleRadioClick}
                                      />
                                      <span className="usage-right color-muted">&nbsp; {t('form.brief.fullRights')}</span>
                                  </label>
                              </div>
                              <div className="col-md-12">
                                  <label className="radio">
                                      <input id="custom_usage_right" className=" custom_usage_right " type="radio"
                                             name="usage_rights" value="2" onClick={handleRadioClick}
                                      />
                                      <span className="usage-right  color-muted">&nbsp;{t('form.brief.twoRights')}</span>
                                  </label>
                              </div>
                              <div className="col-md-12">
                                  <label className="radio">
                                      <input id="custom_usage_right" className="custom_usage_right " type="radio"
                                             name="usage_rights" value="3" onClick={handleRadioClick}
                                      />
                                      <span
                                          className="usage-right color-muted">&nbsp;{t('form.brief.noRights')} </span></label>
                              </div>
                              <div className="col-md-12 d-flex">
                                  <label className="radio">
                                      <input id="custom_usage_right" className=" custom_usage_right" type="radio"
                                             name="usage_rights" value="4" onClick={handleRadioClick}
                                      />
                                      <span
                                          className="usage-right  color-muted">&nbsp; {t('form.brief.customRights')}</span>
                                  </label>
                                  {showInputField && (
                                      <span id="custom_usage_right_nb " className={'me-2 ms-2'}>
                                        <input type="number"
                                               className={clsx(
                                                   'form-control book-btm-fields',
                                                   {'is-invalid': formik.touched.custom_number && formik.errors.custom_number},
                                                   {
                                                       'is-valid': formik.touched.custom_number && !formik.errors.custom_number,
                                                   }
                                               )}
                                               {...formik.getFieldProps('custom_number')}
                                               id="custom_usage_right_nb_input" name="custom_number"
                                               placeholder="Please enter the number"/>
                                          {formik.touched.custom_number && formik.errors.custom_number && (
                                              <div className='fv-plugins-message-container'>
                                                  <span role='alert'>{formik.errors.custom_number}</span>
                                              </div>
                                          )}
                                    </span>
                                  )}
                              </div>
                          </div>
                      </div>
                      <div className="container">
                          <div className="row">
                              <button type="submit"
                                      id="request-btn"
                                      className=" btn btn-primary submit_btn my-auto btn continue-btn bk-btn w-100"
                                      name="submit_request"
                                      disabled={formik.isSubmitting || !formik.isValid}
                                      value="1">
                                  {!loading && <span className='indicator-label'>  {t('button.submit')}</span>}
                                  {loading && (
                                      <span className='indicator-progress' style={{display: 'block'}}>
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
                                  )}

                              </button>
                          </div>
                      </div>
                  </div>



                }


            </div>
        </div>
        </div>


    );
}

export default BriefForm;