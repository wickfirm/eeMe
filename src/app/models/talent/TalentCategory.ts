import {ID} from "../../helpers";
import {Category} from "../misc/Category";
import {Talent} from "./Talent";

export type TalentCategory = {
    id ?: ID,
    category : Category,
    talent : Talent,
}