import en from './en.json';
import ar from './ar.json';

export const translate = (key: string, language: string): string => {
  let langData: { [key: string]: string } = {};

  if(language === 'en') {
    langData = en;

  } else if(language === 'ar') {
    langData = ar;
  }

  return langData[key];
}