import {ID} from "../../helpers";
export type Category = {
    id ?: ID,
    name ?: {
        en: string
        ar: string
    },
    slug ?:string
}