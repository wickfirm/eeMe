import React, {FC, useState} from 'react';
import Cookies from "js-cookie";
import clsx from "clsx";
import {useFormik} from "formik";
import {notify} from "../../../core/talent/requests";
import * as Yup from "yup";
import {useTranslation} from "react-i18next";



type Props = {
    talent ?: any

}

const VerifyForm: FC<Props> = ({talent}) => {
    const subscribeSchema = Yup.object().shape({
        email: Yup.string()
            .email('Wrong email format')
            .min(3, 'Minimum 3 symbols')
            .max(50, 'Maximum 50 symbols')
            .required('Email is required'),
    })

    const initialValues = {
        email: '',
    }
    const currentLanguageCode = Cookies.get('i18next') || 'en'
    const [loading, setLoading] = useState(false)
    const [isActive, setIsActive] = useState(false);
    const {t} = useTranslation()
    const formik = useFormik({
        initialValues,
        validationSchema: subscribeSchema,
        onSubmit: async (values, {setSubmitting}) => {

            setSubmitting(true)
            try {
                setLoading(true)
                const {data} = await notify(talent.id, values)

                if (data.data.success === 1) {
                    setLoading(false)
                    setIsActive(true)

                    setTimeout(function () {
                        setIsActive(false)
                        // resetForm()
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
    return(
        <form className='form w-100 pt-40' onSubmit={formik.handleSubmit} noValidate>
            <div className="notify-me-container">
                <div className={` ${isActive ? " alert-box d-block" : "alert-box"}`}>
                    <div className="alert alert-success alert-dismissible fade show"
                         role="alert">

                        {t('notifyAlertMessage')}
                    </div>
                </div>
                <div className="talent-actions mb-3">
                    <div className="talent-book-now">

                        <div className="form-group pb-15">

                            <input type="email"
                                   placeholder={t('emailAddress') || ""}  {...formik.getFieldProps('email')}

                                   className={clsx(
                                       'form-control book-top-fields',
                                       {'is-invalid': formik.touched.email && formik.errors.email},
                                       {
                                           'is-valid': formik.touched.email && !formik.errors.email,
                                       }
                                   )}
                            />
                        </div>

                        <div className="form-group">
                            <button type="submit"
                                    disabled={formik.isSubmitting || !formik.isValid}
                                    className="btn btn-primary btn-omneeyat">
                                {!loading && <span
                                    className='indicator-label'>{t('talentNotifyButton')}</span>}
                                {loading && (
                                    <span className='indicator-progress'
                                          style={{display: 'block'}}>

              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
                                )}</button>
                        </div>


                    </div>
                </div>
            </div>

        </form>

    );
}

export default VerifyForm;