import axios from 'axios'
import {API_URL} from "../../helpers/crud-helper/consts";

const TALENT_INDEX_URL = `${API_URL}/talent`
const TALENT_TEMP_URL = `${API_URL}/talent-temp`


const getTalentData = (talent : any , lang : any ): Promise<any> => {
    return axios
        .get(`${TALENT_INDEX_URL}/${lang}/${talent}?host=${window.location.host}`)
        .then((response) => response)
        .catch((response) => response)
}

const getTalentIndexData = (): Promise<any> => {
    return axios
        .get(`${TALENT_INDEX_URL}?host=${window.location.host}`)
        .then((response) => response)
}

const getArticleIndexData = (talent: any , article:any , lang:string ) : Promise<any> => {
    if(lang === 'en'){
        return axios
            .get(`${TALENT_INDEX_URL}/${lang}/${talent}/${article}?host=${window.location.host}`)
            .then((response) => response)
            .catch((response) => response)
    }else{
        return axios
            .get(`${TALENT_INDEX_URL}/${lang}/${article}/${talent}?host=${window.location.host}`)
            .then((response) => response)
    }

}

const getMoreFeatured = (page: any , type :any) : Promise<any> => {
    return axios
        .get(`${TALENT_INDEX_URL}?host=${window.location.host}&page=${page}&type=${type}`)
        .then((response) => response)
}

const getMoreTalentsArticles = ( talent :any , lang : any, article: any ,page: any ) : Promise<any> => {
    if(lang === 'en'){
        return axios
            .get(`${TALENT_INDEX_URL}/${lang}/${talent}/${article}?host=${window.location.host}&page=${page}`)
            .then((response) => response)
    }else{
        return axios
            .get(`${TALENT_INDEX_URL}/${lang}/${article}/${talent}?host=${window.location.host}&page=${page}`)
            .then((response) => response)
    }
}

const getTalentsArticles = ( talent :any , lang: any  ,page: any ) : Promise<any> => {
    return axios
            .get(`${TALENT_INDEX_URL}/${lang}/${talent}/article?host=${window.location.host}&page=${page}`)
            .then((response) => response)
}

const notify = (talent :any , value : any) : Promise<any> => {
    return axios
        .post(`${TALENT_INDEX_URL}/${talent}/notify?host=${window.location.host}`, value)
        .then((response) => response)
}

const getInTheSpotFirstItem = (talent : any , lang : any , isPublished: number) :  Promise<any> => {
    return axios
        .get(`${TALENT_INDEX_URL}/${lang}/${talent}/spot/${isPublished}?host=${window.location.host}`)
        .then((response) => response)
}

const getInTheSpotData = (talent : any , lang : any , type : any  ) :  Promise<any> => {
    return axios
        .get(`${TALENT_INDEX_URL}/${lang}/${talent}/spot/type/${type}?host=${window.location.host}`)
        .then((response) => response)
}

const getInsightData = (talent : any , lang : any , type : any  ) :  Promise<any> => {
    return axios
        .get(`${TALENT_INDEX_URL}/${lang}/${talent}/insight/type/${type}?host=${window.location.host}`)
        .then((response) => response)
}



const showFilmography = (slug:any) : Promise<any> => {
    return axios
        .get(`${API_URL}/filmography/${slug}?host=${window.location.host}` )
        .then((response) => response)
        .catch((response) => response)

}

const verifyTalent = (values: any , talent: any ) : Promise<any> => {
    return axios
        .post(`${TALENT_INDEX_URL}/${talent}/verify?host=${window.location.host}` , values)
        .then((response) => response)
}

const getTalentTempData = (talent : any , lang : any ): Promise<any> => {
    return axios
        .get(`${TALENT_TEMP_URL}/${lang}/${talent}?host=${window.location.host}`)
        .then((response) => response)
}
const getArticleTempIndexData = (talent: any , article:any , lang:string ) : Promise<any> => {
    if(lang === 'en'){
        return axios
            .get(`${TALENT_TEMP_URL}/${lang}/${talent}/${article}?host=${window.location.host}`)
            .then((response) => response)
    }else{
        return axios
            .get(`${TALENT_TEMP_URL}/${lang}/${article}/${talent}?host=${window.location.host}`)
            .then((response) => response)
    }

}
const getLatestArticles = ( ) : Promise<any> => {
    return axios
        .get(`${API_URL}/latest-articles?host=${window.location.host}`)
        .then((response) => response)
}


export {getLatestArticles , getArticleTempIndexData, getTalentTempData, verifyTalent , showFilmography , getInsightData , getTalentsArticles ,getTalentIndexData,getMoreFeatured,getArticleIndexData , getTalentData , notify,getMoreTalentsArticles,getInTheSpotFirstItem ,getInTheSpotData}
