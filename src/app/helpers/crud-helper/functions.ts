import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
function formatPlatform( platform : any){
    const fields =  platform.embed.fillable_fields.split('|')
    const data = platform.link.split('|')

    const result = {};
    // @ts-ignore
    data.forEach((value, i) => result[fields[i]] = value);

    return autoUpdate(platform.embed.iframe, result)

}

function autoUpdate(text: any, data: any) {
    const reg = new RegExp(Object.keys(data).join("|"), "g");
    return text.replace(reg, (matched:any) => data[matched]);
}

const nbFormatter = (num: any, digits: any) => {
    const lookup = [
        {value: 1, symbol: ""},
        {value: 1e3, symbol: "k"},
        {value: 1e6, symbol: "M"},
        {value: 1e9, symbol: "G"},
        {value: 1e12, symbol: "T"},
        {value: 1e15, symbol: "P"},
        {value: 1e18, symbol: "E"}
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup.slice().reverse().find(function (item) {
        return num >= item.value;
    });
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
}



export {formatPlatform , autoUpdate ,nbFormatter}