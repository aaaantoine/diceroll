import React from 'react';
import CalcKeys from './CalcKeys.js';
import DieDropDown from './DieDropDown.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faDice } from '@fortawesome/free-solid-svg-icons';

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
                                        <DieDropDown
                                            value={this.state.sidesPerDie}
                                            onChange={this.handleSidesPerDieChange} />
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
                <div class="col-lg-4">
                    <CalcKeys onInput={this.props.onFormulaAddRequest} />
                </div>
            </div>
        );
    }

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
