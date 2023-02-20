export interface IAirport {
  id: number,
  iata: string,
  name: string,
  city: string,
  countryId: number,
  regionId: number | null,
  hub: boolean
}
