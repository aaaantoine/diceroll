import React from 'react';
import RollSymbol from './RollSymbol.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faTimes, faDivide, faDice } from '@fortawesome/free-solid-svg-icons';

export default class InputToolbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dieCount: null,
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
                                            {this.rollSymbol(this.state.sidesPerDie || " ")} 
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
                        <div class="col-7">
                            <label>Keep</label>
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <select class="custom-select"
                                        disabled={this.state.dieCount <= 1}
                                        value={this.state.highLow}
                                        onChange={this.handleHighLowChange}>
                                        <option value="">All</option>
                                        <option value="h">High</option>
                                        <option value="l">Low</option>
                                    </select>
                                </div>
                                <input class="form-control" type="number" min="1"
                                    disabled={!this.state.highLow}
                                    max={this.state.dieCount-1}
                                    value={this.state.highLowCount}
                                    onChange={this.handleHighLowCountChange} />
                            </div>
                        </div>
                        <div class="col">
                            <label>&nbsp;</label>
                            <div class="form-row">
                                <div class="col btn-group text-right">
                                    <button class="btn btn-secondary" type="button"
                                        title="Add dice to formula"
                                        disabled={!this.state.sidesPerDie}
                                        onClick={this.handleDiceAddClick}>
                                            <FontAwesomeIcon icon={faPlus} />
                                    </button>
                                    <button class="btn btn-outline-primary" type="button"
                                        title="Set dice as formula and roll now"
                                        disabled={!this.state.sidesPerDie}
                                        onClick={this.handleRollClick}>
                                            <FontAwesomeIcon icon={faDice} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 my-2 calculator-buttons">
                    {this.formulaButtonRow([7,8,9,'/'])}
                    {this.formulaButtonRow([4,5,6,'*'])}
                    {this.formulaButtonRow([1,2,3,'-'])}
                    {this.formulaButtonRow(['(',0,')','+'])}
                </div>
            </div>
        );
    }

    rollSymbol = (value) => <RollSymbol symbol={{sides: value, text: value}} />;
    sidesDropDownOption = (value) => (
        <button class="dropdown-item" type="button"
            onClick={() => this.handleSidesPerDieChange(value)}>
            {this.rollSymbol(value)}
        </button>
    );
    iconMap = {
        "+": faPlus,
        "-": faMinus,
        "*": faTimes,
        "/": faDivide
    };
    iconifyButton = (value) => this.iconMap[value]
        ? <FontAwesomeIcon icon={this.iconMap[value]} />
        : value;
    formulaButton = (value) => (
        <div class="col text-center">
            <button class="btn btn-secondary btn-lg" type="button"
                onClick={() => this.props.onFormulaAddRequest(value)}>
                    {this.iconifyButton(value)}
            </button>
        </div>
    );
    formulaButtonRow = (collection) => (
        <div class="form-row">
            {collection.map(value => this.formulaButton(value))}
        </div>
    );

    getDiceFormula = () => {
        const highLow = this.state.highLow 
            ? this.implicit1(this.state.highLowCount) + this.state.highLow
            : "";
        const dice =
            this.implicit1(this.state.dieCount) + "d" + this.state.sidesPerDie;
        return highLow + dice;
    };

    enableHighLow = (dieCount) => dieCount > 1;
    adjustHighLowCount = (dieCount, highLow) =>
        !highLow
            ? ""
            : this.state.highLowCount >= dieCount
                ? dieCount - 1
                : this.state.highLowCount;
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
    handleDiceAddClick = () =>
        this.props.onFormulaAddRequest(this.getDiceFormula());
    handleRollClick = () =>
        this.props.onRollRequest(this.getDiceFormula());
}
