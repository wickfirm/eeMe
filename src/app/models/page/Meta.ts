import {ID} from "../../helpers";
import {Page} from "./Page";
import {AgencyPage} from "../agency/AgencyPage";
export type Meta = {
    id ?: ID,
    title : {
        en: string
        ar: string
    },
    description ?: {
        en: string
        ar: string
    },
    page_id ?:string,
    Page ?: Page
    AgencyPage ?: AgencyPage
}

