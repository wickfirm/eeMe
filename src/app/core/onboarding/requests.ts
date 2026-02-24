import axios from 'axios'
import {API_URL} from "../../helpers/crud-helper/consts";

const ON_BOARDING_INDEX_URL = `${API_URL}/on-boarding`

const getOnBoardingIndexData = (): Promise<any> => {
    return axios
        .get(`${ON_BOARDING_INDEX_URL}?host=${window.location.host}`)
        .then((response) => response)
}

const createEnroll = (values: any): Promise<any> => {
    return axios
        .post(`${ON_BOARDING_INDEX_URL}?host=${window.location.host}` , values)
        .then((response) => response)
}

const enrollPayment = (status: any , public_enrollment_id: any, stripe_session_id : any) : Promise<any> => {
    return axios
        .get(`${API_URL}/subscription/${status}/enroll/${public_enrollment_id}/stripe/${stripe_session_id}?host=${window.location.host}` )
        .then((response) => response)

}

export {getOnBoardingIndexData , createEnroll , enrollPayment}
