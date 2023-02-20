import {TestBed} from '@angular/core/testing';

import {AirportService} from './airport.service';
import {HttpClientTestingModule, HttpTestingController, TestRequest} from "@angular/common/http/testing";
import {Airport} from "../models/airport";
import {
  HTTP_DELETE_REQUEST,
  HTTP_GET_REQUEST,
  HTTP_POST_REQUEST,
  HTTP_PUT_REQUEST
} from "../constants/services-constants";
import {NULL} from "../utils/common-utils";

describe('AirportService', () => {
  let service: AirportService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [HttpClientTestingModule]});
    service = TestBed.inject(AirportService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getHubs should return all hub airports', () => {
    const hubs: Airport[] = [
      {
        id: 1,
        iata: 'QQQ',
        name: 'Q',
        city: 'Q',
        countryId: 62,
        regionId: NULL,
        hub: true
      }, {
        id: 2,
        iata: 'TTT',
        name: 'T',
        city: 'T',
        countryId: 46,
        regionId: NULL,
        hub: true
      }, {
        id: 3,
        iata: 'VVV',
        name: 'V',
        city: 'V',
        countryId: 146,
        regionId: NULL,
        hub: true
      }, {
        id: 4,
        iata: 'WWW',
        name: 'W',
        city: 'W',
        countryId: 66,
        regionId: NULL,
        hub: true
      }, {
        id: 5,
        iata: 'YYY',
        name: 'Y',
        city: 'Y',
        countryId: 144,
        regionId: NULL,
        hub: true
      }
    ];

    service.getHubs().subscribe(hubs => {
      expect(hubs.length).toEqual(5);
    });

    const reqs: TestRequest[] = httpTestingController.match(request => request.method === HTTP_GET_REQUEST);
    reqs.forEach(req => req.flush(hubs));
  });

  it('#getAirport should return the airport with specified id', () => {
    const airportsToFind: any = [
      {
        id: 5,
        iata: 'VVV',
        name: 'V',
        city: 'V',
        countryId: 67,
        regionId: NULL,
        hub: true
      }
    ];

    service.getAirport(5).subscribe(airportsFound => {
      expect(airportsFound[0]).toEqual(airportsToFind[0]);
      expect(airportsFound[0].id).toEqual(5);
    });

    const reqs: TestRequest[] = httpTestingController.match(request => request.method === HTTP_GET_REQUEST);
    reqs.forEach(req => req.flush(airportsToFind));
  });

  it('#createAirport should create an airport and return it', () => {
    const airportToCreate: Airport = {
      id: 6,
      iata: 'XXX',
      name: 'X',
      city: 'X',
      countryId: 66,
      regionId: NULL,
      hub: true
    };

    service.createAirport(airportToCreate).subscribe(airportCreated => {
      expect(airportCreated).toEqual(airportToCreate);
      expect(airportCreated.hub).toBeTruthy();
    });

    const req: TestRequest = httpTestingController.expectOne(request => request.method === HTTP_POST_REQUEST);
    req.flush(airportToCreate);
  });

  it('#updateAirport should update an airport and return it', () => {
    const airportToUpdate: Airport = {
      id: 6,
      iata: 'WWW',
      name: 'W',
      city: 'W',
      countryId: 65,
      regionId: NULL,
      hub: false
    };

    service.updateAirport(airportToUpdate).subscribe(airportUpdated => {
      expect(airportUpdated).toEqual(airportToUpdate);
      expect(airportUpdated.iata).toEqual('WWW');
      expect(airportUpdated.name).toEqual('W');
      expect(airportUpdated.city).toEqual('W');
      expect(airportUpdated.countryId).toEqual(65);
      expect(airportUpdated.hub).toBeFalsy();
    });

    const req: TestRequest = httpTestingController.expectOne(request => request.method === HTTP_PUT_REQUEST);
    req.flush(airportToUpdate);
  });

  it('#deleteAirport should delete an airport and return it', () => {
    const airportToDelete: Airport = {
      id: 6,
      iata: 'WWW',
      name: 'W',
      city: 'W',
      countryId: 65,
      regionId: NULL,
      hub: false
    };

    service.deleteAirport(6).subscribe(airportDeleted => {
      expect(airportDeleted).toEqual(airportToDelete);
      expect(airportDeleted.id).toEqual(6);
    });

    const req: TestRequest = httpTestingController.expectOne(request => request.method === HTTP_DELETE_REQUEST);
    req.flush(airportToDelete);
  });
});
