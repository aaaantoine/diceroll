import React from 'react';
import Formula from './Formula.js';
import InputBar from './InputBar.js';
import RollHistory from './RollHistory.js';

export default class Diceroll extends React.Component {
    constructor(props) {
        super(props);
        this.maxResults = 50;
        this.state = {
            formula: null,
            formulaError: null,
            results: []
        };
    }

    render() {
        const error = this.state.formulaError
            ? (
                <div class="alert alert-danger" role="alert">
                    {this.state.formulaError.message}
                </div>
            )
            : "";
        return (
            <div class="container">
                <InputBar
                    formula={this.state.formula}
                    onSetFormulaRequest={value => this.setState({formula: value})}
                    onRollRequest={this.handleRollRequest} />
                {error}
                <RollHistory
                    rolls={this.state.results}
                    onReRollRequest={this.handleRollRequest} />
            </div>
        );
    }

    roll = (expression) => {
        try {
            const result = Formula.calculate(expression || this.state.formula);
            this.addResult(result);
        } catch(ex) {
            this.setState({formulaError: ex});
        }
    };

    handleRollRequest = (value) => {
        const formula = value !== undefined ? value : this.state.formula;
        this.setState({formula});
        this.roll(formula);
    };

    addResult(result) {
        let results = this.state.results;
        results.push(result);
        if (results.length > this.maxResults) {
            results.splice(0, 1);
        }
        this.setState({
            results: results,
            formulaError: null
        });
    }
}
