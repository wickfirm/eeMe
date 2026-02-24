import {ID} from "../../helpers";
import {Article} from "../article/Article";
import {Talent} from "./Talent";

export type TalentArticle = {
    id ?: ID,
    article ?: Article,
    talent ?: Talent,

}