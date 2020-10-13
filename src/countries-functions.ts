import { access } from "fs";
import * as _ from "lodash";

export interface Country {
    name: string;
    region: string;
    subregion: string;
    population: number;
    area: number;
    languages: Language[];
    currencies: Currency[];
}

interface Language {
    "iso639_1": string,
    "iso639_2": string,
    "name": string,
    "nativeName": string
}

interface Currency {
    code: string,
    name: string,
	symbol: string
}

interface CurrencyCountries {
    currency: string;
    countries: string[];
    count: number
}

export const task1 = (countries: Country[]): string[] => {
    return countries.map(country => country.name);
}

export const task2 = (countries: Country[]): string[] => {
    return countries
        .filter(country => country.region === 'Europe')
        .map(country => country.name);
}

export const task3 = (countries: Country[]): Array<{ name: string, area: string }> => {
    return countries
        .filter(country => country.population > 100000000)
        // .map(country => {
        //     return {name: country.name, area: country.area + ' km2'};
        // });
        .map(({ name, area }) => ({ name, area: area + ' km2' }));
}

export const task4 = (countries: Country[]): Language[] => {
    return countries
        .filter(country => country.subregion === "South America")
        .flatMap(({ languages }) => languages)
        .reduce((acc, language) => 
                    acc.some(langInAcc => langInAcc.name === language.name) 
                       ? acc 
                       : [...acc, language] ,[]);
}

export const task5 = (countries: Country[]): { [key:string]: string[] } => {
    
    const langObjects = (country: Country) => {
        return country.languages.map(language => 
             ({ name: country.name, language : language.name}));
    }
    
    return countries
        .filter(country => country.subregion === "South America")
        .map(country => langObjects(country)).flat()
        .reduce((acc, {name, language}) => 
            // acc[language] 
            // ? {...acc, [language] : [...acc[language], name]}
            // : {...acc, [language] : [name]}
        ({...acc, [language] : [...(acc[language] || [] ), name]})
        , {});
}

export const task6 = (countries: Country[]): 
    {language:string, countries:string[]}[] => {
    // return Object.entries(task5(countries)).map(
    //     (pairArray) => ({language: pairArray[0], countries:pairArray[1]}));
       return Object.entries(task5(countries)).map(
           ([language, countries]) => ({language, countries}));
}

const pipe = (...fns) => fns.reduceRight((f, g) => (...args) => f(g(...args)));
const tap = f => value => { f(value); return value; };

export const task7 = (countries: Country[]): any => {
    const currencyObjects = (country: Country):{name:string, currency:string}[] => {
        return country.currencies.map(currency => 
             ({ name: country.name, currency : currency.name}));
    }
 
    const countryCurrencyObjects = (countries: Country[]):{name:string, currency:string}[] => {
        return countries
        .flatMap(country => currencyObjects(country))
    }  

    const currencyCountriesMap = (objects: {name:string, currency:string}[]):
    { [key:string]: string[] } =>  {
        return objects.reduce((acc, {name, currency}) => 
         ({...acc, [currency] : [...(acc[currency] || [] ), name]})
        , {});
    }
    
    const arrayOfComplexObjects = (currMap: { [key:string]: string[] }): CurrencyCountries[] => {
        return Object.entries(currMap).map(
            ([currency, countries]) => ({currency, countries, count: countries.length}));
    }

    const fivePlusCurrencies = (allObjects: CurrencyCountries[]): CurrencyCountries[]  => {
        return allObjects.filter(obj => obj.count >= 5);
    }
    
    const sortCurrencies = (objects: CurrencyCountries[]): CurrencyCountries[] => {
        return objects.sort((a,b) => a.count - b.count);
    }

    return pipe( countryCurrencyObjects,                
                currencyCountriesMap,                
                arrayOfComplexObjects,                
                fivePlusCurrencies,
                sortCurrencies,
                tap(value => console.log(value)))(countries);
}

export const task8 = (countries: Country[]): any => {
    const languageObjects = (country: Country): { population: number, language:string}[] => {
        return country.languages.map(language => 
             ({ language : language.name, population: country.population}));
    }

    const languageCountObjects = (countries: Country[]):{population: number, language:string}[] => {
        return countries
        .flatMap(country => languageObjects(country))
    }  

    const languageToCountObject = (occurencies: {population: number, language:string}[])
    : {[key: string]: number} => {
        return occurencies.reduce((acc, occurence) => {
            // return acc[occurence.language] 
            //  ? {...acc, [occurence.language]: occurence.population + acc[occurence.language] }
            //  : {...acc, [occurence.language]: occurence.population}
            return {...acc, [occurence.language]: 
                             (acc[occurence.language] || 0) + occurence.population}
        }, {});       
    }

    const arrayOfLanguages = (obj: {[key: string]: number}):{language:string, count:number}[] => {
        return Object.entries(obj).map(pair => ({language: pair[0], count: pair[1]}));
    }

    const sortArray = (languageArr: {language:string, count:number}[]):{language:string, count:number}[] => {
        return languageArr.sort((a,b) => b.count - a.count);
    }

    const topTen = (languageArr: {language:string, count:number}[]):{language:string, count:number}[] => {
        return languageArr.slice(0, 10);
    }

    const humanReadable = (languageArr: {language:string, count:number}[])
       :{language:string, count:string}[] => {
        return languageArr.map(obj => 
            ({language:obj.language, count: Math.round(obj.count/1e6) / 1000 + " mld"}));
    }

    const toString = (languageArr: {language:string, count:string}[]): string => {
        return languageArr.reduce((acc, obj) => acc + obj.language + " " + obj.count + "\n" , "");
    }

    const toString2 = (languageArr: {language:string, count:string}[]): string => {

        const maxlen = languageArr.reduce(
            (max, obj) => obj.language.length > max ? obj.language.length: max, 0);

        const printSpaces = ( language: string, maxlen: number) => {
            let spaces = " ";
            for (let i = 0; i < maxlen - language.length ; i++) {
                spaces += " "; 
            } 
            return spaces;    
        } 

        const printOne = (obj: {language:string, count:string}, maxLength:number) => {
            return obj.language + printSpaces(obj.language, maxlen) + obj.count + "\n";
        }

        return languageArr.reduce((acc, obj) => acc + printOne(obj, maxlen) , "");
    }

    return _.flow([languageCountObjects,
                   languageToCountObject,
                   arrayOfLanguages,
                   sortArray,
                   topTen,
                   humanReadable,
                   toString2
                 ])(countries);
}