import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Country} from "../../shared/models/country";
import {Region} from "../../shared/models/region";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {distinctUntilChanged, map, Observable, startWith, Subject} from "rxjs";
import {Airport} from "../../shared/models/airport";
import {AirportService} from "../../shared/services/airport.service";
import {
  ALL_WHITESPACE_FIELD_ERROR_MESSAGE,
  ALREADY_EXISTING_AIRPORT_ERROR_MESSAGE,
  EMPTY_COUNTRY_FLAG,
  EMPTY_REGION_FLAG,
  EMPTY_REQUIRED_FIELD_ERROR_MESSAGE,
  HUB_FORM_TITLE,
  INVALID_IATA_ERROR_MESSAGE,
  UNKNOWN_COUNTRY_ERROR_MESSAGE,
  UNKNOWN_REGION_ERROR_MESSAGE,
} from "../../shared/constants/form-constants";
import {
  buildAirportName,
  formatAirportCity,
  IATA_LENGTH,
  IATA_PATTERN,
  orderGeographicElements
} from "../../shared/utils/forms/airport-forms-utils";
import {displayCountryName, NULL} from "../../shared/utils/common-utils";
import {
  existingAirportValidator,
  onlyWhitespaceValueValidator,
  unknownCountryValidator,
  unknownRegionValidator
} from "../../shared/utils/validators/airport-forms-validators";
import {COUNTRIES_WITH_REGIONS} from "../../shared/constants/app-constants";
import {COUNTRIES} from "../../shared/constants/data/countries";
import {REGIONS} from "../../shared/constants/data/regions";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-page-hub-form',
  templateUrl: './hub-form.component.html',
  styleUrls: ['../../shared/styles/forms.scss', '../../shared/styles/airport-forms.scss']
})
export class HubFormComponent implements OnInit, OnDestroy {

  public unsubscriber: Subject<void> = new Subject<void>();

  @Input() public formMode!: string;
  @Input() public hubAirport!: Airport;
  @Output() public submitted = new EventEmitter();

  /* Form + its title */
  public hubForm!: FormGroup;
  public hubFormTitle!: string;
  public cityIncludedInName: boolean = false;
  public characteristicsCaseRespected: boolean = false;

  /* Form fields identifiers */
  public iataFieldIdentifier: string = 'iata';
  public nameFieldIdentifier: string = 'name';
  public cityFieldIdentifier: string = 'city';
  public countryFieldIdentifier: string = 'countryId';
  public regionFieldIdentifier: string = 'regionId';

  // Flag of current selected country
  public flagAirportCountry!: string;
  // Indicator to know if current country selected has regions
  public countrySelectedHasRegions!: boolean;
  // Flag of potential current selected region
  public flagAirportRegion!: string;

  // List of already existing airports
  public existingAirports$!: Observable<Airport[]>;

  // List of available countries
  public countries: Country[] = COUNTRIES;
  // List of available regions
  public regions: Region[] = REGIONS;
  // List of countries matching to value entered in field
  public filteredCountries: Observable<Country[]> = new Observable<Country[]>();
  // List of regions matching to value entered in field
  public filteredRegions: Observable<Region[]> = new Observable<Region[]>();

  constructor(private formBuilder: FormBuilder, private airportService: AirportService) {
    this.existingAirports$ = this.airportService.airportsCollection;
  }

  ngOnInit(): void {
    this.hubFormTitle = `${this.formMode} ${HUB_FORM_TITLE}`;

    // Form fields creation and constraints definition
    this.existingAirports$.pipe(takeUntil(this.unsubscriber)).subscribe(airports => {
      this.hubForm = this.formBuilder.group({
        iata: new FormControl(this.hubAirport?.iata, [Validators.required, Validators.pattern(IATA_PATTERN), Validators.minLength(IATA_LENGTH), Validators.maxLength(IATA_LENGTH), existingAirportValidator(airports, this.hubAirport?.iata).bind(this)]),
        name: new FormControl(this.hubAirport?.name, [onlyWhitespaceValueValidator().bind(this)]),
        city: new FormControl(this.hubAirport?.city, [Validators.required, onlyWhitespaceValueValidator().bind(this)]),
        countryId: new FormControl(this.hubAirport?.countryId != NULL ? this.countries.find(c => c.id === this.hubAirport.countryId) : NULL, [Validators.required, unknownCountryValidator().bind(this)]),
        regionId: new FormControl(this.hubAirport?.regionId != NULL ? this.regions.find(c => c.id === this.hubAirport.regionId) : NULL)
      });

      this.configureCountryFieldAutocomplete();

      this.hubForm.get(this.countryFieldIdentifier)?.valueChanges.pipe(takeUntil(this.unsubscriber)).subscribe(countryValueChanged => this.addCountryListener(countryValueChanged));
      this.hubForm.get(this.countryFieldIdentifier)?.setValue(this.hubAirport?.countryId != NULL ? this.countries.find(c => c.id === this.hubAirport.countryId) : NULL);
    });
  }

  // Country definition (with default value)
  private setDefaultCountry(): void {
    this.flagAirportCountry = EMPTY_COUNTRY_FLAG;
    this.setDefaultRegion();
  }

  // Region definition (with default value)
  private setDefaultRegion(): void {
    this.countrySelectedHasRegions = false;
    this.flagAirportRegion = EMPTY_REGION_FLAG;
    this.hubForm.get(this.regionFieldIdentifier)?.setValue(NULL);
    this.hubForm.get(this.regionFieldIdentifier)?.setValidators(NULL);
  }

  // Country field autocomplete configuration
  private configureCountryFieldAutocomplete(): void {
    this.countries = orderGeographicElements(this.countries);

    // @ts-ignore
    this.filteredCountries = this.hubForm.get(this.countryFieldIdentifier)?.valueChanges.pipe(distinctUntilChanged(),
      startWith(''),
      map(country => (country ? this.getMatchedCountries(country) : this.countries.slice())),
    );
  }

  // Countries filtering (matched to the entered value)
  private getMatchedCountries(countryValue: any): Country[] {
    if (countryValue === NULL || countryValue === undefined) {
      return this.countries;
    }

    const filterValue: string = typeof countryValue === 'string' ? countryValue.toUpperCase() : countryValue.name.toUpperCase();
    return this.countries.filter(country => country.name.startsWith(filterValue));
  }

  // Region field autocomplete configuration
  private configureRegionFieldAutocomplete(countryFound: Country): void {
    this.regions = orderGeographicElements(this.regions.filter(r => r.countryId === countryFound.id));

    // @ts-ignore
    this.filteredRegions = this.hubForm.get(this.regionFieldIdentifier)?.valueChanges.pipe(distinctUntilChanged(),
      startWith(''),
      map(region => (region ? this.getMatchedRegions(region) : this.regions.slice())),
    );
  }

  // Regions filtering (matched to the entered value)
  private getMatchedRegions(regionValue: any): Region[] {
    const filterValue: string = typeof regionValue === 'string' ? regionValue.toUpperCase() : regionValue.name.toUpperCase();
    return this.regions.filter(region => region.name.startsWith(filterValue));
  }

  // Country field listener
  addCountryListener(countryValueChanged: any): void {
    if (countryValueChanged != NULL) {
      const countryFound = this.countries.find(country => typeof countryValueChanged === 'string' ? country.name === countryValueChanged.toUpperCase() : country.name === countryValueChanged.name.toUpperCase());

      if (countryFound != undefined) {
        this.flagAirportCountry = countryFound.isoAlpha2;

        if (COUNTRIES_WITH_REGIONS.includes(countryFound.isoAlpha2)) {
          this.configureRegionFieldAutocomplete(countryFound);
          this.addRegionListener();
          this.hubForm?.get(this.regionFieldIdentifier)?.setValue(this.hubAirport?.regionId != NULL ? this.regions.find(c => c.id === this.hubAirport.regionId) : NULL);
          this.countrySelectedHasRegions = true;
          // @ts-ignore
          this.hubForm.get(this.regionFieldIdentifier)?.setValidators([Validators.required, unknownRegionValidator().bind(this)]);
        } else {
          this.setDefaultRegion();
        }
      } else {
        this.setDefaultCountry();
      }
    } else {
      this.setDefaultCountry();
    }
  }

  // Region field listener
  private addRegionListener(): void {
    this.hubForm.get(this.regionFieldIdentifier)?.valueChanges.pipe(takeUntil(this.unsubscriber)).subscribe(regionValueChanged => {
      if (regionValueChanged != NULL) {
        const regionFound = this.regions.find(region => typeof regionValueChanged === 'string' ? region.name === regionValueChanged.toUpperCase() : region.name === regionValueChanged.name.toUpperCase());

        if (regionFound != undefined) {
          this.flagAirportRegion = `assets/regions-flag/${this.flagAirportCountry}/${regionFound.isoAlpha2}.svg`;
        } else {
          this.flagAirportRegion = EMPTY_REGION_FLAG;
        }
      } else {
        this.flagAirportRegion = EMPTY_REGION_FLAG;
      }
    });
  }

  // Custom country display (by name)
  displayCountryByName(country: Country): string {
    return country ? displayCountryName(country.id) : '';
  }

  // Custom region display (by name)
  displayRegionByName(region: Region): string {
    return region ? region.name : '';
  }

  // Form submit
  submitHubForm(): void {
    this.hubForm.value.hub = true;
    this.hubForm.value.iata = this.hubForm.value.iata?.toUpperCase();
    this.hubForm.value.city = formatAirportCity(this.hubForm.value.city.trim(), this.characteristicsCaseRespected);
    this.hubForm.value.name = buildAirportName(this.hubForm.value.name, this.characteristicsCaseRespected, this.cityIncludedInName, this.hubForm.value.city);
    this.hubForm.value.countryId = this.countries.find(country => country.isoAlpha2 === this.flagAirportCountry)?.id;
    this.hubForm.value.regionId = !this.countrySelectedHasRegions ? NULL : this.regions.find(region => region.isoAlpha2 ===
      this.flagAirportRegion.replace(`assets/regions-flag/${this.flagAirportCountry}/`, '').replace('.svg', ''))?.id;

    this.submitted.emit(this.hubForm.value);
  }

  // IATA field error message(s) display
  displayIATAErrorMessage(): string {
    if (this.hubForm.get(this.iataFieldIdentifier)?.hasError('required')) {
      return EMPTY_REQUIRED_FIELD_ERROR_MESSAGE;
    } else if (this.hubForm.get(this.iataFieldIdentifier)?.hasError('minlength') || this.hubForm.get(this.iataFieldIdentifier)?.hasError('maxlength') || this.hubForm.get(this.iataFieldIdentifier)?.hasError('pattern')) {
      return INVALID_IATA_ERROR_MESSAGE;
    } else if (this.hubForm.get(this.iataFieldIdentifier)?.hasError('existingAirport')) {
      return ALREADY_EXISTING_AIRPORT_ERROR_MESSAGE;
    }
    return '';
  }

  // Name field error message(s) display
  displayNameErrorMessage(): string {
    if (this.hubForm.get(this.nameFieldIdentifier)?.hasError('onlyWhitespaceValue')) {
      return ALL_WHITESPACE_FIELD_ERROR_MESSAGE;
    }
    return '';
  }

  // City field error message(s) display
  displayCityErrorMessage(): string {
    if (this.hubForm.get(this.cityFieldIdentifier)?.hasError('required')) {
      return EMPTY_REQUIRED_FIELD_ERROR_MESSAGE;
    } else if (this.hubForm.get(this.cityFieldIdentifier)?.hasError('onlyWhitespaceValue')) {
      return ALL_WHITESPACE_FIELD_ERROR_MESSAGE;
    }
    return '';
  }

  // Country field error message(s) display
  displayCountryErrorMessage(): string {
    if (this.hubForm.get(this.countryFieldIdentifier)?.hasError('required')) {
      return EMPTY_REQUIRED_FIELD_ERROR_MESSAGE;
    } else if (this.hubForm.get(this.countryFieldIdentifier)?.hasError('unknownCountry')) {
      return UNKNOWN_COUNTRY_ERROR_MESSAGE;
    }
    return '';
  }

  // Region field error message(s) display
  displayRegionErrorMessage(): string {
    if (this.hubForm.get(this.regionFieldIdentifier)?.hasError('required')) {
      return EMPTY_REQUIRED_FIELD_ERROR_MESSAGE;
    } else if (this.hubForm.get(this.regionFieldIdentifier)?.hasError('unknownRegion')) {
      return UNKNOWN_REGION_ERROR_MESSAGE;
    }
    return '';
  }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }
}
