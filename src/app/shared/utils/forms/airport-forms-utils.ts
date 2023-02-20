import {NULL} from "../common-utils";

export const IATA_LENGTH = 3;
export const IATA_PATTERN = '[A-Za-z]{3}';

export function orderGeographicElements(geographicElements: any[]): any[] {

  let geographicElementsSorted: any[] = geographicElements.sort((ge1, ge2) => {
    if (ge1.name === ge2.name) {
      return 0;
    }

    if (ge1.name > ge2.name) {
      return 1;
    }
    return -1;
  });
  return geographicElementsSorted.sort((ge1, ge2) => ge1.name.localeCompare(ge2.name, 'fr'));
}

export function buildAirportName(airportName: string, airportNameCaseRespected: boolean, airportNameIncludesCity: boolean, airportCity: string): string {
  if (airportName === NULL || airportName === '') {
    return formatAirportCity(airportCity, true, airportCity.indexOf(',') > -1);
  } else {
    airportName = formatAirportName(airportName.trim(), airportNameCaseRespected);

    if (airportNameIncludesCity) {
      return `${airportCity} – ${airportName}`;
    } else {
      return airportName;
    }
  }
}

export function formatAirportCity(airportCity: string, airportCityCaseRespected: boolean, airportCompoundCitiesInName?: boolean): string {
  let airportCities: string[] = airportCity.split(',');

  for (let i: number = 0; i < airportCities.length; i++) {
    airportCities[i] = formatAirportCharacteristic(airportCities[i].trim(), airportCityCaseRespected);
  }

  if (airportCompoundCitiesInName) {
    return airportCities.join(' – ');
  } else {
    return airportCities.join(', ');
  }
}

export function formatAirportName(airportName: string, airportNameCaseRespected: boolean): string {
  return formatAirportCharacteristic(airportName, airportNameCaseRespected);
}

function formatAirportCharacteristic(airportCharacteristic: string, characteristicCaseRespected: boolean): string {
  let airportCharacteristicWords: string[] = airportCharacteristic.split(' ');

  for (let i: number = 0; i < airportCharacteristicWords.length; i++) {
    airportCharacteristicWords[i] = airportCharacteristicWords[i].trim();

    const compoundSymbolIndex: number = airportCharacteristicWords[i].indexOf('-');

    if (compoundSymbolIndex > -1) {
      if (compoundSymbolIndex === 0) {
        airportCharacteristicWords[i] = airportCharacteristicWords[i].replace(airportCharacteristicWords[i].charAt(0), '');
      }

      let airportCharacteristicCompoundWords: string[] = airportCharacteristicWords[i].split('-');

      for (let j: number = 0; j < airportCharacteristicCompoundWords.length; j++) {
        airportCharacteristicCompoundWords[j] = airportCharacteristicCompoundWords[j].trim();

        if (!characteristicCaseRespected) {
          airportCharacteristicCompoundWords[j] = capitalizeFirstLetter(airportCharacteristicCompoundWords[j]);
        }
      }
      airportCharacteristicWords[i] = airportCharacteristicCompoundWords.join('-');
    } else if (!characteristicCaseRespected) {
      airportCharacteristicWords[i] = capitalizeFirstLetter(airportCharacteristicWords[i]);
    }
  }
  return airportCharacteristicWords.join(' ');
}

function capitalizeFirstLetter(word: string): string {
  let wordTransformed: string = word.charAt(0);
  let apostrophesIndex: number[] = [];

  for (let i: number = 0; i < word.length; i++) {
    if (word[i] === "'") {
      apostrophesIndex.push(i);
    }
  }

  if (apostrophesIndex.length === 0) {
    return wordTransformed.toUpperCase() + word.slice(1).toLowerCase();
  } else {
    let charsAfterApostrophe: any[] = [];
    apostrophesIndex.forEach(index => charsAfterApostrophe.push({index: index + 1, value: word.charAt(index + 1)}));
    wordTransformed += word.slice(1).toLowerCase();
    charsAfterApostrophe.forEach(char => wordTransformed = wordTransformed.substring(0, char.index) + char.value.toUpperCase() + wordTransformed.substring(char.index + 1));

    return wordTransformed;
  }
}
