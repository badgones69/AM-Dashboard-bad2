import {Airport} from "../models/airport";

export interface IRoute {
  id: number,
  departureHub: Airport,
  arrivalAirport: Airport
}
