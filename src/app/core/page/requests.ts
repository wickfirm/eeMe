import axios from 'axios'
import {API_URL} from "../../helpers/crud-helper/consts";

const PAGE_INDEX_URL = `${API_URL}/page`

const getPageIndexData = (slug: any): Promise<any> => {
    return axios
        .get(`${PAGE_INDEX_URL}/${slug}?host=${window.location.host}`)
        .then((response) => response)
}

export {getPageIndexData}
