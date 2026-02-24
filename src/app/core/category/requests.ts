import axios from 'axios'
import {API_URL} from "../../helpers/crud-helper/consts";



const CATEGORY_INDEX_URL = `${API_URL}/category`

const getCategoryIndexData = (slug : any ): Promise<any> => {
    return axios
        .get(`${CATEGORY_INDEX_URL}/${slug}?host=${window.location.host}`)
        .then((response) => response)
        .catch((response) => response)
}

const getMoreTalentsData = (slug: any, page: any , type : any): Promise<any> => {
    return axios
        .get(`${CATEGORY_INDEX_URL}/${slug}?host=${window.location.host}&page=${page}&type=${type}`)
        .then((response) => response)
};


const getCategories = (): Promise<any> => {
    return axios
        .get(`${CATEGORY_INDEX_URL}?host=${window.location.host}`)
        .then((response) => response)
}

export {getCategoryIndexData , getMoreTalentsData, getCategories}
