import axios from 'axios'
import {API_URL} from "../../helpers/crud-helper/consts";

const HOME_URL = `${API_URL}/home`

const getData = (): Promise<any> => {
    return axios
        .get(`${HOME_URL}?host=${window.location.host}`)
        .then((response) => response)
}
const getMoreData = (): Promise<any> => {
    return axios
        .get(`${HOME_URL}/data?host=${window.location.host}`)
        .then((response) => response)
}

export {getData,getMoreData}
