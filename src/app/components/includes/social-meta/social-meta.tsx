import React, {FC} from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import {t} from "i18next";

interface Props {
    title: any;
    description: any;
    image: string;
    name: string
    link ?: any
    index ?:boolean
}

const SocialMeta:  FC<Props> = ({ title, description, image, name,link ,index}) => {
   const  url = window.location.origin + link;
    return (
        <div>
            <HelmetProvider>
            <Helmet>
                <title>{title}</title>

                <link rel = "canonical" href = {url} />
                <meta name="description" content={description} />
                {index ? <meta name="robots" content="index,follow"/> : <meta name="robots" content="noindex,nofollow"/>}

                 {/*Schema.org markup for Google*/}
                <meta itemProp="name" content={name} />
                <meta itemProp="description" content={description} />
                <meta itemProp="image" content={image} />

                {/*Twitter Card data*/}
                <meta name="twitter:card" content="summary_large_image"/>
                <meta name="twitter:title" content={name}/>
                <meta name="twitter:description" content={description}/>
                <meta name="twitter:image" content={image}/>
                <meta name="twitter:image:src" content={image}/>


                {/*Open Graph data*/}
                <meta property = "fb:app_id" content = "526578061564254" />
                <meta property="og:site_name" content={t('webName') || ""}/>
                <meta property="og:type" content="website"/>
                <meta property="og:description" content={description}/>
                <meta property="og:image" content={image}/>
                <meta property="og:url" content={url && url}/>
                <meta property="og:title" content={name} />

            </Helmet>
            </HelmetProvider>
        </div>
    );
};

export {SocialMeta};
