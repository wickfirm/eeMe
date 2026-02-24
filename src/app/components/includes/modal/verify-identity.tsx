import React, {FC, useEffect, useState} from 'react';
import {Modal} from "react-bootstrap";
import clsx from "clsx";
import {t} from "i18next";
import {useFormik} from "formik";
import * as Yup from "yup";

type Props = {
    talent?: any
    isOpen ?:boolean


}

const VerifyModal:  FC<Props> = ({talent , isOpen}) => {
    const initialValues = {
        email: "",
        phone_number: "",
        talent_id : talent.id

    }
    const verifySchema = Yup.object().shape({
        email: Yup.string()
            .email("Wrong email format")
            .min(3, "Minimum 3 symbols")
            .max(50, "Maximum 50 symbols")
            .required("Email is required"),
        phone_number: Yup.number().required("Phone number is required")

    });
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(isOpen);
    const [isActive, setIsActive] = useState(false);

    const formik = useFormik({
        initialValues,
        validationSchema: verifySchema,
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true);
            try {
                setLoading(true);

                // const { data } = await subscribe(values);
                // if (data === 1) {
                //     setLoading(false);
                //     setIsActive(true);
                //
                //     setTimeout(function () {
                //         setIsModalOpen(false)
                //         formik.resetForm();
                //     }, 1500);
                //
                //
                // }
            } catch (ex) {
                console.error(ex);
            } finally {
                setSubmitting(true);
                setLoading(false);
            }
        },
    });

    return (
        <div>
            <Modal className="modal" show={isModalOpen} onHide={() => setIsModalOpen(false)} centered>
                <Modal.Header className="border-bottom-0" closeButton>
                    {/*  <Modal.Title className="text-primary ">Subscribe below</Modal.Title>*/}
                </Modal.Header>
                <Modal.Body>
                    <div className="">
                        {isActive ?

                            <div
                                className={` ${
                                    isActive ? " alert-box d-block" : "alert-box d-none"
                                }`}
                            >
                                <div
                                    className="alert alert-success alert-dismissible fade show"
                                    role="alert"
                                >
                                    Successfully Done
                                </div>
                            </div>
                         :
                            <div>


                                <form className="form w-100 pt-10"  onSubmit={formik.handleSubmit} noValidate>

                                    <div className="row mb-3">
                                        <div className="col-md-12 mb-3">
                                            <h6 className="modal-title title-font-bold text-dark">{t('talent.verifyIdentityTitle' , {talent: talent.user.name.en} )}</h6>
                                        </div>
                                        <input type="hidden" name="talent_id" value="{{$talent->id}}" />
                                            <div className="col-md-12 mb-4">
                                                <div className="md-form form-group">
                                                    <label className="label-book-bold text-dark">{t(
                                                        'form.email')}</label>
                                                    <input type="email"
                                                           {...formik.getFieldProps("email")}
                                                           className={clsx(
                                                               "form-control book-top-fields unique-placeholder brief-field",
                                                               {"is-invalid": formik.touched.email && formik.errors.email,},
                                                               {"is-valid": formik.touched.email && !formik.errors.email,})}

                                                           required name="email" placeholder="example@omneeyat.com"
                                                           aria-label="example@omneeyat.com"
                                                          />

                                                    {formik.touched.email && formik.errors.email && (
                                                        <div className="fv-plugins-message-container">
                                                            <span role="alert">{formik.errors.email}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                    </div>
                                    <div className="col-md-12 mb-5">
                                        <div className="md-form form-group">
                                            <label className="label-book-bold text-dark">{t('form.phoneNumber')}</label>
                                            <input type="tel"
                                                   {...formik.getFieldProps("phone_number")}
                                                   className={clsx(
                                                       "form-control book-top-fields unique-placeholder brief-field",
                                                       {"is-invalid": formik.touched.email && formik.errors.email,},
                                                       {"is-valid": formik.touched.email && !formik.errors.email,})}
                                                   required name="phone_number" id="phone_number"
                                                   placeholder={t('form.phone_placeholder') || ""}
                                                   aria-label=""
                                                />

                                            {formik.touched.phone_number && formik.errors.phone_number && (
                                                <div className="fv-plugins-message-container">
                                                    <span role="alert">{formik.errors.phone_number}</span>
                                                </div>
                                            )}

                                        </div>
                                    </div>
                            {/*        <div className="form-group row justify-content-center mb-3 mt-3">*/}
                            {/*            <div className="col-md-9">*/}


                            {/*                <input*/}
                            {/*                    type="email"*/}
                            {/*                    className={clsx(*/}
                            {/*                        "form-control input-form",*/}
                            {/*                        {*/}
                            {/*                            "is-invalid":*/}
                            {/*                                formik.touched.email && formik.errors.email,*/}
                            {/*                        },*/}
                            {/*                        {*/}
                            {/*                            "is-valid":*/}
                            {/*                                formik.touched.email && !formik.errors.email,*/}
                            {/*                        }*/}
                            {/*                    )}*/}

                            {/*                    {...formik.getFieldProps("email")}*/}

                            {/*                    placeholder={t("form.email") || ""}*/}
                            {/*                />*/}

                                            {/*{formik.touched.email && formik.errors.email && (*/}
                                            {/*    <div className="fv-plugins-message-container">*/}
                                            {/*        <span role="alert">{formik.errors.email}</span>*/}
                                            {/*    </div>*/}
                                            {/*)}*/}
                            {/*            </div>*/}
                            {/*        </div>*/}

                                    <div className="form-group row mt-4 mb-4 justify-content-center">
                                        <div className="col-md-4 col-10">
                                            <button
                                                type="submit"
                                                className="btn btn-primary w-100"
                                                disabled={formik.isSubmitting || !formik.isValid}
                                            >
                                                {!loading && (
                                                    <span className="">{t("button.submit")}</span>
                                                )}
                                                {loading && (
                                                    <span
                                                        className="indicator-progress"
                                                        style={{ display: "block" }}
                                                    >
                              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                            </span>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        }

                    </div>

                </Modal.Body>
                <Modal.Footer className="border-top-0">
                    {/*<Button variant="secondary" onClick={() => setIsModalOpen(false)}>*/}
                    {/*  Close*/}
                    {/*</Button>*/}
                </Modal.Footer>
            </Modal>
        </div>

    );
}
export {VerifyModal};

