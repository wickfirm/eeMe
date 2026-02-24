import {ID} from "../../helpers";
import {User} from "../user/user";
import {Category} from "../misc/Category";
export type Talent = {
    id ?: ID,
    slug : string,
    description ?: string,
    number ?: string,
    image ?: string,
    talent_logo ?:string,
    response_time ?:string,
    is_available: boolean,
    is_verified : boolean,
    is_published : boolean,
    activate_social_insights : boolean,
    is_influencer: boolean,
    user: User,
    categories: Category
}