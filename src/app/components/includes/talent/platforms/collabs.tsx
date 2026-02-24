import React, {FC} from 'react';


type Props  = {
    collabs?: any;

}

const Collabs: FC<Props> = ({collabs } ) => {

    return(
        <div className="row pb-30 bg-white pt-30">
            {collabs && collabs.length > 0 && collabs.map((collab : any ) => (
                <div className="col-md-2 pb-15">
                    <img  alt={`${collab.name.en}`} title={collab.name.en}
                        className="w-100" src={`${collab.image}`} />
                </div>
            ))}
        </div>
    );
}
export default Collabs;