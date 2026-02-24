import {ID} from "../../helpers";
import {Page} from "../page/Page";
import {Video} from "../video";
import {Meta} from "../page/Meta";

export type AgencyPage = {
    id ?: ID,
    page_id ? : ID ,
    title : any,
    subtitle: string,
    content ?: string
    page : Page,
    video ?: Video
    meta ?: Meta

}

