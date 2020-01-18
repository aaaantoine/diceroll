import React from 'react';
import Formula from './Formula.js';
import Help from './Help.js';
import InputBar from './InputBar.js';
import RollHistory from './RollHistory.js';

export default class Diceroll extends React.Component {
    constructor(props) {
        super(props);
        this.maxResults = 50;
        this.state = {
            formula: null,
            formulaError: null,
            results: [],
            showHelp: false
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
        const helpSection = this.state.showHelp
            ? <Help onCloseRequest={this.handleHelpClick} />
            : "";
        return (
            <div class="container">
                <InputBar
                    formula={this.state.formula}
                    helpIsVisible={this.state.showHelp}
                    onSetFormulaRequest={value => this.setState({formula: value})}
                    onRollRequest={this.handleRollClick}
                    onHelpRequest={this.handleHelpClick} />
                {error}
                {helpSection}
                <RollHistory
                    rolls={this.state.results}
                    onReRollRequest={this.handleReRollClick} />
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

    handleHelpClick = () => {
        this.setState({showHelp: !this.state.showHelp});
    };
    handleRollClick = () => this.roll();
    handleReRollClick = (expression) => {
        this.setState({formula: expression});
        this.roll(expression);
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
