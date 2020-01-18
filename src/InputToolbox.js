import React from 'react';
import RollSymbol from './RollSymbol.js';

export default class InputToolbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dieCount: 1,
            sidesPerDie: 6,
            highLow: "",
            highLowCount: null
        };
    }
    render() {
        return (
            <div class="row justify-content-center">
                <div class="col-lg-4">
                    <div class="form-row">
                        <div class="col">
                            <label>Sides</label>
                            <div class="form-group">
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <button class="btn btn-outline-secondary dropdown-toggle"
                                            type="button"
                                            id="commonDiceDropdown"
                                            data-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded="false">
                                            Common Dice
                                        </button>
                                        <div class="dropdown-menu" aria-labelledby="commonDiceDropdown">
                                            {this.sidesDropDownOption(2)}
                                            {this.sidesDropDownOption(4)}
                                            {this.sidesDropDownOption(6)}
                                            {this.sidesDropDownOption(8)}
                                            {this.sidesDropDownOption(10)}
                                            {this.sidesDropDownOption(12)}
                                            {this.sidesDropDownOption(20)}
                                            {this.sidesDropDownOption(100)}
                                        </div>
                                    </div>
                                    <input class="form-control" type="number" min="2" max="1000"
                                        value={this.state.sidesPerDie}
                                        onChange={(e) => this.handleSidesPerDieChange(e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="col">
                            <label>Count</label>
                            <div class="form-group">
                                <input class="form-control" type="number" min="1" max="1000"
                                    value={this.state.dieCount}
                                    onChange={this.handleDieCountChange} /> 
                            </div>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="col">
                            <label>Keep</label>
                            <div class="form-row">
                                <div class="col">
                                    <select class="custom-select"
                                        disabled={this.state.dieCount <= 1}
                                        value={this.state.highLow}
                                        onChange={this.handleHighLowChange}>
                                        <option value="">All</option>
                                        <option value="h">Highest</option>
                                        <option value="l">Lowest</option>
                                    </select>
                                </div>
                                <div class="col">
                                    <input class="form-control" type="number" min="1"
                                        disabled={!this.state.highLow}
                                        max={this.state.dieCount-1}
                                        value={this.state.highLowCount}
                                        onChange={this.handleHighLowCountChange} />
                                </div>
                                <div class="col text-right">
                                    <button class="btn btn-secondary" type="button"
                                        onClick={this.handleDiceAddClick}>Add Dice</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 calculator-buttons">
                    <label>Calculator</label>
                    {this.formulaButtonRow([7,8,9,'/'])}
                    {this.formulaButtonRow([4,5,6,'*'])}
                    {this.formulaButtonRow([1,2,3,'-'])}
                    {this.formulaButtonRow(['(',0,')','+'])}
                </div>
            </div>
        );
    }

    sidesDropDownOption = (value) => (
        <button class="dropdown-item" type="button"
            onClick={() => this.handleSidesPerDieChange(value)}>
            <RollSymbol symbol={{sides: value, text: value}} />
        </button>
    );
    formulaButton = (value) => (
        <div class="col text-center">
            <button class="btn btn-secondary btn-lg" type="button"
                onClick={() => this.props.onFormulaAddRequest(value)}>{value}</button>
        </div>
    );
    formulaButtonRow = (collection) => (
        <div class="form-row">
            {collection.map(value => this.formulaButton(value))}
        </div>
    );

    enableHighLow = (dieCount) => dieCount > 1;
    adjustHighLowCount = (dieCount, highLow) =>
        !highLow
            ? ""
            : (this.state.highLowCount || 1) >= dieCount
                ? dieCount - 1
                : this.state.highLowCount || 1;
    implicit1 = (value) => value > 1 ? value : "";

    handleDieCountChange = (e) => {
        const highLow = this.enableHighLow(e.target.value)
            ? this.state.highLow
            : "";
        this.setState({
            dieCount: e.target.value,
            highLow,
            highLowCount: this.adjustHighLowCount(e.target.value, highLow)
        });
    };
    handleHighLowChange = (e) => this.setState({
        highLow: e.target.value,
        highLowCount: this.adjustHighLowCount(
            this.state.dieCount,
            e.target.value)
    });
    handleHighLowCountChange = (e) => this.setState({highLowCount: e.target.value});
    handleSidesPerDieChange = (value) => this.setState({sidesPerDie: value});
    handleDiceAddClick = (e) => {
        const highLow = this.state.highLow 
            ? this.implicit1(this.state.highLowCount) + this.state.highLow
            : "";
        const dice =
            this.implicit1(this.state.dieCount) + "d" + this.state.sidesPerDie;
        const formula = highLow + dice;
        this.props.onFormulaAddRequest(formula);
    };
}
