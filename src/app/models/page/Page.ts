import {ID} from "../../helpers";
export type Page = {
    id ?: ID,
    title : {
        en: string
        ar: string
    },
    content ?: {
        en: string
        ar: string
    },
    video_link ?:string,
    video_poster ?: string
}

