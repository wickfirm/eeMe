import React, {FC, useState} from 'react';
import Cookies from "js-cookie";
import Modal from "react-bootstrap/Modal";



type Props = {
    talent ?: any

}

const Charity: FC<Props> = ({talent}) => {

    const currentLanguageCode = Cookies.get('i18next') || 'en'
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [show, setShow] = useState(false);
    return(
        <div className="">
            <div className="">
                Supporting <a data-toggle="modal" onClick={handleShow}
                              data-target="#charity-modal"><span
                className="">{talent.charities[0].name.en}</span>
                <i className="fa fa-info-circle"></i></a>

                {talent.charities.slice(0, 1).map((charity: any) => (charity.image ? (
                    <div className="" key={charity.id}>
                        <img width="100"
                             src={talent.charities[0].image}
                             alt={`${talent.user.name.en}`}/>
                    </div>) : null))}



                <Modal show={show} onHide={handleClose}>
                    <Modal.Header >
                        <Modal.Title>{currentLanguageCode === 'en' ? talent.charities[0].name.en : talent.charities[0].name.ar}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="text-center"> <img width="100"
                                                              src={talent.charities[0].image}
                                                              alt={`${talent.user.name.en}`}/> </Modal.Body>
                    <Modal.Body dangerouslySetInnerHTML={{__html: currentLanguageCode === 'en' ? talent.charities[0].description.en : talent.charities[0].description.ar as string}} />

                </Modal>

            </div>
        </div>

    );
}

export default Charity;