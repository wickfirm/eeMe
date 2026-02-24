import axios from 'axios'
import {API_URL} from "../../helpers/crud-helper/consts";

const SUBSCRIBE_URL = `${API_URL}/subscribe`
const SEARCH_URL = `${API_URL}/search`

const subscribe = (value: any): Promise<any> => {
    return axios
        .post(SUBSCRIBE_URL, value)
        .then((response) => response)
}

const search = (value: any): Promise<any> => {
    return axios
        .get(`${SEARCH_URL}?search=${value}&host=${window.location.host}`)
        .then((response) => response)
}


export {subscribe,search}
