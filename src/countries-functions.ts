import { access } from "fs";

export interface Country {
    name: string;
    region: string;
    subregion: string;
    population: number;
    area: number;
    languages: Language[];
}

interface Language {
    "iso639_1": string,
    "iso639_2": string,
    "name": string,
    "nativeName": string
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

export const task5 = (countries: Country[]): any => {
    
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