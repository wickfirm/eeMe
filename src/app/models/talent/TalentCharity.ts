import {ID} from "../../helpers";
import {Talent} from "./Talent";
import {Charity} from "../misc/Charity";

export type TalentCharity = {
    id ?: ID,
    category : Charity,
    talent : Talent,
}