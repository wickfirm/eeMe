import React, {FC} from 'react';
type Props = {
    className ?: any

}

const Loader: FC<Props> = ({className}) => {

    return(

        <div className={`loader ${className}`}>
            <div className="loader-in">
                <div />
                <div />
            </div>
        </div>

    );
}

export default Loader;