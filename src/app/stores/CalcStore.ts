import { observable, action, computed, autorun } from 'mobx';

export class CalcStore {
  constructor() {
    fetch("http://www.apilayer.net/api/live?access_key=18b940cfc087ff097d4488d9869bd1a9").then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    }).then(result => {
      this.currentRate = result.quotes.USDRUB;
    });

    autorun(() => {
      if (this.amount && this.changeDate && this.needUpdateChangeDate) {
        fetch(`http://www.apilayer.net/api/historical?access_key=18b940cfc087ff097d4488d9869bd1a9&date=${this.changeDate}`).then(function (response) {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Network response was not ok.');
        }).then(result => {
          this.setPastRate(result.quotes.USDRUB);
          this.setNeedUpdateChangeDate(false);
        });
      }
    });
  };

  private createCurrentDate(): string {
    const curDate: Date = new Date();
    const day: string = dayOfYheMonth(curDate);
    const month: string = monthOfYheYear(curDate);
    const year: number = curDate.getFullYear();

    function monthOfYheYear(d: Date): string {
      return ((d.getMonth() + 1) < 10 ? '0' : '') + (d.getMonth() + 1);
    }

    function dayOfYheMonth(d: Date): string {
      return (d.getDate() < 10 ? '0' : '') + d.getDate();
    }
    return `${year}-${month}-${day}`;
  }

  @observable needUpdateChangeDate: boolean = false;
  @observable changeDate?: string;
  @observable currentDate?: string = this.createCurrentDate();
  @observable amount?: number;
  @observable currentRate?: number;
  @observable pastRate?: number;
  @observable spread?: number = 0.005; // 0.5%

  @action setNeedUpdateChangeDate(needUpdateChangeDate) {
    this.needUpdateChangeDate = needUpdateChangeDate;
  };

  @action setChangeDate(changeDate) {
    this.changeDate = changeDate;
  };

  @action setAmount(amount) {
    this.amount = amount;
  };

  @action setPastRate(pastRate) {
    this.pastRate = pastRate;
  };

  @computed
  get calcResult() {
    if (this.pastRate && this.currentRate && this.amount) {
      const pastUsdToRub: number = this.pastRate * this.amount;
      const currentUsdToRub: number = this.currentRate * this.amount;
      const pastResult: number = pastUsdToRub - pastUsdToRub * this.spread;
      const currentResult: number = currentUsdToRub - currentUsdToRub * this.spread;
      const result = Math.round((currentResult - pastResult) * 100) / 100;

      return result;
    }
  };
}

export default CalcStore;