import {ID} from "../../helpers";
import {Category} from "../misc/Category";
import {Talent} from "./Talent";

export type TalentPrice = {
    id ?: ID,
    price : string,
    talent : Talent,
}