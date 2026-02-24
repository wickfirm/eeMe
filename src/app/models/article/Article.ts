import {ID} from "../../helpers";
import {Video} from "../video";
export type Article = {
    id ?: ID,
    title ?: string,
    description ?: string,
    image : string,
    is_published: boolean,
    video ?: Video,
}