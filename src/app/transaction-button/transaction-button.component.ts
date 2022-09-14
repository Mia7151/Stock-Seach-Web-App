import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-transaction-button',
  templateUrl: './transaction-button.component.html',
  styleUrls: ['./transaction-button.component.css']
})
export class TransactionButtonComponent implements OnInit {
  @Input() public ticker:string;
  @Input() public name:string;
  @Input() public currentPrice:number;
  @Input() public opt: string;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  inputQuantity: number = 0;
  purchasedQuantity: number = 0;
  stockItem;
  moneyinwallet;

  

  getTickerStorage() {
    this.moneyinwallet = parseFloat(localStorage.getItem('moneyinwallet'))
    console.log("moneyinwallet",this.moneyinwallet)
    let portfolioArr = localStorage.getItem('Portfolio')
      ? JSON.parse(localStorage.getItem('Portfolio'))
      : [];
    if (this.opt === 'Sell') {
      this.stockItem = portfolioArr.filter(
        (data) => data.ticker == this.ticker
      )[0];
      this.purchasedQuantity = this.stockItem.quantity;
    } else if (this.opt === 'Buy') {
      this.stockItem = portfolioArr.filter((data) => data.ticker == this.ticker)
        .length
        ? portfolioArr.filter((data) => data.ticker == this.ticker)[0]
        : { ticker: this.ticker, name: this.name, quantity: 0, totalCost: 0 };
    }
  }

  public executeOpt() {
    
    if (this.opt === 'Sell') {
      let avgcost = this.stockItem.totalCost / this.stockItem.quantity;
      this.stockItem.quantity -= this.inputQuantity;
      this.stockItem.totalCost -= avgcost * this.inputQuantity;
      this.moneyinwallet += this.inputQuantity*this.currentPrice
      localStorage.setItem('moneyinwallet', JSON.stringify(this.moneyinwallet))
      console.log("moneyinwallet1",localStorage.getItem('moneyinwallet'))
      console.log(
        `Sell ${this.ticker} ${this.inputQuantity}, ${this.stockItem.quantity} left, totalCost ${this.stockItem.totalCost}`
      );
    } else if (this.opt === 'Buy') {
      this.stockItem.quantity += this.inputQuantity;
      this.stockItem.totalCost += this.currentPrice * this.inputQuantity;
      this.moneyinwallet -= this.inputQuantity*this.currentPrice
      localStorage.setItem('moneyinwallet', JSON.stringify(this.moneyinwallet))
      console.log("moneyinwallet2",localStorage.getItem('moneyinwallet'))
      console.log(
        `Buy ${this.ticker} ${this.inputQuantity}, ${this.stockItem.quantity} now, totalCost ${this.stockItem.totalCost}`
      );
    }
    let portfolioArr = localStorage.getItem('Portfolio')
      ? JSON.parse(localStorage.getItem('Portfolio'))
      : [];
    if (!this.stockItem.quantity) {
      // delete stockItem from localStorage
      let portfolioArrNew = portfolioArr.filter(
        (data) => data.ticker != this.ticker
      );
      localStorage.setItem('Portfolio', JSON.stringify(portfolioArrNew));
    } else {
      // replace stockItem from localStorage
      if (portfolioArr.filter((item) => item.ticker == this.ticker).length) {
        portfolioArr.forEach((item, i) => {
          if (item.ticker == this.stockItem.ticker) {
            portfolioArr[i] = this.stockItem;
          }
        });
      } else {
        portfolioArr.push(this.stockItem);
      }
      localStorage.setItem('Portfolio', JSON.stringify(portfolioArr));
      //console.log('111',localStorage.setItem('Portfolio', JSON.stringify(portfolioArr)))
    }
    this.transModalService.close(this.stockItem);
  }
   


  constructor(public transModalService: NgbActiveModal) { }

  ngOnInit(): void {
    this.getTickerStorage();
  }

}
