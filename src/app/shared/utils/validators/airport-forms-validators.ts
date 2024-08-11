import {Airport} from "../../models/airport";
import {AbstractControl, ValidatorFn} from "@angular/forms";
import {COUNTRIES} from "../../constants/data/countries";
import {REGIONS} from "../../constants/data/regions";
import {NULL} from "../common-utils";

export function existingAirportValidator(existingAirports: Airport[], currentAirportIATA: string): ValidatorFn {
  return (formControl: AbstractControl): { [key: string]: boolean } | null => {
    if (existingAirports.some(airport => currentAirportIATA != formControl.value?.toUpperCase() && airport.iata === formControl.value?.toUpperCase())) {
      return {'existingAirport': true};
    }
    return NULL;
  }
}

export function onlyWhitespaceValueValidator(): ValidatorFn {
  return (formControl: AbstractControl): { [key: string]: boolean } | null => {
    return !!formControl.value && formControl.value.trim() === '' ? {'onlyWhitespaceValue': true} : NULL;
  }
}

export function unknownCountryValidator(): ValidatorFn {
  return (formControl: AbstractControl): { [key: string]: boolean } | null => {
    let formControlValue: string = typeof formControl.value === 'string' ? formControl.value?.toUpperCase() : formControl.value?.name?.toUpperCase();
    if (!COUNTRIES.some(country => country.name === formControlValue)) {
      return {'unknownCountry': true};
    }
    return NULL;
  }
}

export function unknownRegionValidator(): ValidatorFn {
  return (formControl: AbstractControl): { [key: string]: boolean } | null => {
    let formControlValue: string = typeof formControl.value === 'string' ? formControl.value?.toUpperCase() : formControl.value?.name?.toUpperCase();
    if (!REGIONS.some(country => country.name === formControlValue)) {
      return {'unknownRegion': true};
    }
    return NULL;
  }
}
