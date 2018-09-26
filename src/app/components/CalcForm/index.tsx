import * as React from 'react';
import { observer, inject } from 'mobx-react';
import * as classNames from 'classnames';
import * as style from './style.css';

@inject('calcStore')
@observer
export class CalcForm extends React.Component<any, any> {
  handleDateChange = (e) => {
    this.props.calcStore.setChangeDate(e.target.value);
    this.props.calcStore.setNeedUpdateChangeDate(true);
  };

  handleAmountChange = (e) => {
    this.props.calcStore.setAmount(e.target.value);
  };

  render() {
    const calcStore = this.props.calcStore;
    const resultClasses = classNames({
      [style.hidden]: !calcStore.calcResult || calcStore.needUpdateChangeDate && calcStore.calcResult,
      [style.plus]: calcStore.calcResult > 0,
      [style.minus]: calcStore.calcResult <= 0
    });

    return (
      <form className={style.form}>
        <label className={style.label} htmlFor="changeDate">Date</label>
        <input className={style.field} id="changeDate" type="date" value={calcStore.changeDate} onChange={this.handleDateChange} required />
        <br/>

        <label className={style.label} htmlFor="amount">Amount (USD)</label>
        <input className={style.field} id="amount" type="number" min="1" step="0.01" value={calcStore.amount} onChange={this.handleAmountChange} required autoComplete="off" />

        <p className={resultClasses}>
          <span className={style.lost}>You lost: </span>
          <span className={style.got}>You got: </span>
          {calcStore.calcResult}
        </p>
      </form>
    );
  }
}

export default CalcForm;
