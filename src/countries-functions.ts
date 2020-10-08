import { access } from "fs";

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
