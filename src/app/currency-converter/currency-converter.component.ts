import { Component, OnInit } from '@angular/core';
import { ExchangeRateService } from '../exchange-rate.service';

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.css']
})
export class CurrencyConverterComponent implements OnInit {
  exchangeRates: any[] = [];
  fromCurrency: string = 'UAH';
  toCurrency: string = 'USD';
  amount: number = 1;
  convertedAmount: number | undefined;

  constructor(private exchangeRateService: ExchangeRateService) { }

  ngOnInit() {
    this.getExchangeRates();
  }

  getExchangeRates() {
    this.exchangeRateService.getExchangeRates().subscribe(
      (data: any[]) => {
        this.exchangeRates = data;
        this.convertCurrency();
      },
      error => {
        console.log('Failed to fetch exchange rates:', error);
      }
    );
  }

  convertCurrency() {
  const fromRate = this.getRate(this.fromCurrency);
  const toRate = this.getRate(this.toCurrency);

  if (fromRate !== undefined && toRate !== undefined) {
    let convertedAmount: number;

    // Convert from UAH to another currency
    if (this.fromCurrency === 'UAH') {
      convertedAmount = this.amount / toRate;
    }
    // Convert from another currency to UAH
    else if (this.toCurrency === 'UAH') {
      convertedAmount = this.amount * fromRate;
    }
    // Convert between two non-UAH currencies
    else {
      convertedAmount = (this.amount / fromRate) * toRate;
    }

    this.convertedAmount = Number(convertedAmount.toFixed(2));
  } else {
    this.convertedAmount = undefined;
  }
}

  getRate(currency: string): number | undefined {
  const exchangeRate = this.exchangeRates.find(rate => rate.cc === currency);
  return exchangeRate ? exchangeRate.rate : 0;
}

  onAmountChange() {
    this.convertCurrency();
  }

  onCurrencyChange() {
    this.convertCurrency();
  }
  
  
  convertCurrencies() {
  const tempCurrency = this.fromCurrency;
  this.fromCurrency = this.toCurrency;
  this.toCurrency = tempCurrency;
  this.amount = this.convertedAmount || 1;
  this.convertCurrency();
}
}
