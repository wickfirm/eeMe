import axios from 'axios'
import {API_URL} from "../../helpers/crud-helper/consts";


const getVideoIndexData = (code : any ) : Promise<any> => {
    return axios
        .get(`${API_URL}/video/${code}/preview?host=${window.location.host}`)
        .then((response) => response)
}




export { getVideoIndexData }
