import {COUNTRIES} from "../constants/data/countries";
import {REGIONS} from "../constants/data/regions";

// @ts-ignore
export const NULL: any = null;

export function displayCity(city: string, regionId: any): string {
  let cityDisplayed = city;

  if (regionId != NULL) {
    let regionIsoAlpha2 = REGIONS.find(region => region.id === regionId)?.isoAlpha2;

    cityDisplayed += ` (${regionIsoAlpha2})`;
  }
  return cityDisplayed;
}

export function displayCountryFlag(countryId: number): string {
  return COUNTRIES.find(country => country.id === countryId)?.isoAlpha2 || '';
}

export function displayCountryName(countryId: number): string {
  return COUNTRIES.find(country => country.id === countryId)?.name || '';
}
