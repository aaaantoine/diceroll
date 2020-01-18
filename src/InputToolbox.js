import React from 'react';

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
            <div>
                <div class="form-row">
                    <div class="col">
                        <label>Count</label>
                        <div class="form-group">
                            <input class="form-control" type="number" min="1" max="1000"
                                value={this.state.dieCount}
                                onChange={this.handleDieCountChange} /> 
                        </div>
                    </div>
                    <div class="col">
                        <label>Sides</label>
                        <div class="form-group">
                            <input class="form-control" type="number" min="2" max="1000"
                                value={this.state.sidesPerDie}
                                onChange={this.handleSidesPerDieChange} />
                        </div>
                    </div>
                    <div class="col">
                        <label>Highest/Lowest</label>
                        <div class="form-row">
                            <div class="col">
                                <select class="custom-select"
                                    disabled={this.state.dieCount <= 1}
                                    value={this.state.highLow}
                                    onChange={this.handleHighLowChange}>
                                    <option value=""></option>
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
                            <div class="col">
                                <button class="btn btn-secondary" type="button"
                                    onClick={this.handleDiceAddClick}>Add</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-row">
                    {this.formulaButtons(['+','-','*','/','(',')',0,1,2,3,4,5,6,7,8,9])}
                </div>
            </div>
        );
    }

    formulaButton = (value) => (
        <div class="col text-center">
            <button class="btn btn-secondary" type="button"
                onClick={() => this.props.onFormulaAddRequest(value)}>{value}</button>
        </div>
    );
    formulaButtons = (collection) => collection
        .map(value => this.formulaButton(value));

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
    handleSidesPerDieChange = (e) => this.setState({sidesPerDie: e.target.value});
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
