import { Feed } from 'feed';
import {getLatestArticles} from "../core/talent/requests";
import {FC} from "react";
import Homepage from "./Homepage";


const FeedPage: FC = () => {
    // Define the metadata for your feed
    const feed = new Feed({
        copyright: "",
        title: 'Showcasing people, their news & creating connections | eeMe',
        description: 'A space for talents, brands and the audience to connect.',
        id: 'https://eeme.io/',
        link: 'https://eeme.io/',
        language: 'en-US'
    });

// Add each article to the feed
//     const articles = getLatestArticles();
//     for (const key in articles) {
//         if (Object.prototype.hasOwnProperty.call(articles, key)) {
//             // @ts-ignore
//             const article = articles[key];
//             feed.addItem({
//                 title: article.title.en,
//                 description: article.description.en,
//                 id:  '/talent/' + article.talent.slug.en + '/' + article.slug.en,
//                 link:'https://eeme.io/talent/' + article.talent.slug.en + '/' + article.slug.en,
//                 date: new Date(article.created_at),
//             });
//         }
//     }
//
//
// // Convert the feed to XML and return it as the response
    const xml = feed.rss2();

    return (<div dangerouslySetInnerHTML={{ __html: xml }} />);
}

export default FeedPage;


