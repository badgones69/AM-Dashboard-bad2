import {IAirport} from "../interfaces/i-airport";

export class Airport implements IAirport {
  id!: number;
  iata!: string;
  name!: string;
  city!: string;
  countryId!: number;
  regionId!: number | null;
  hub!: boolean;

  constructor(airport?: Airport) {
    if (airport) {
      Object.assign(this, airport);
    }
  }
}
