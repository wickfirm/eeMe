import axios from 'axios'
import {API_URL} from "../../helpers/crud-helper/consts";



const TALENT_INDEX_URL = `${API_URL}/talent`
const TALENT_TEMP_URL = `${API_URL}/talent-temp`


const bookStore = (values : any , talent: any ) : Promise<any> => {
    return axios
        .post(`${TALENT_INDEX_URL}/${talent}/book?host=${window.location.host}` , values )
        .then((response) => response)
}

const bookTalent = (talent : any , lang : any ) : Promise<any> => {
    return axios
        .get(`${TALENT_INDEX_URL}/${lang}/${talent}/book?host=${window.location.host}`)
        .then((response) => response)
        .catch((response) => response)
}

const promoCodeValidity = (talent : any ,promoCode : any ) : Promise<any> => {
    return axios
        .post(`${TALENT_INDEX_URL}/${talent}/promo-code-validity/${promoCode}?host=${window.location.host}` )
        .then((response) => response)
}

const bookPayment = (status: any , order_request_id: any) : Promise<any> => {
    return axios
        .get(`${API_URL}/payment/${status}/order/${order_request_id}?host=${window.location.host}` )
        .then((response) => response)

}

const bookTempTalent = (talent : any , lang : any ) : Promise<any> => {
    return axios
        .get(`${TALENT_TEMP_URL}/${lang}/${talent}/book?host=${window.location.host}`)
        .then((response) => response)
}


export {bookTempTalent, bookStore, bookTalent ,promoCodeValidity , bookPayment}
