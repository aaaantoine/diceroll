import React from 'react';
import Formula from './Formula.js';
import Help from './Help.js';
import RollHistory from './RollHistory.js';

export default class Diceroll extends React.Component {
    constructor(props) {
        super(props);
        this.handleHelpClick = this.handleHelpClick.bind(this);
        this.handleReRollClick = this.handleReRollClick.bind(this);
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
        const helpButtonClass = "btn btn-outline-secondary" +
            (this.state.showHelp ? " active" : "");
        return (
            <div class="container">
                <div class="form-group">
                    <label for="rollFormula">Formula</label>
                    <div class="input-group">
                        <input type="text" class="form-control" id="rollFormula"
                            onKeyUp={(e) => this.handleFormulaKeyUp(e)}
                            onChange={(e) => this.setState({formula: e.target.value})}
                            value={this.state.formula} />
                        <div class="input-group-append">
                            <button class={helpButtonClass} type="button"
                                onClick={() => this.handleHelpClick()}>Help</button>
                            <button class="btn btn-primary" type="submit"
                                onClick={() => this.handleRollClick()}>Roll</button>
                        </div>
                    </div>
                </div>
                {error}
                {helpSection}
                <RollHistory
                    rolls={this.state.results}
                    onReRollRequest={this.handleReRollClick} />
            </div>
        );
    }

    handleFormulaKeyUp(event) {
        if (event.keyCode === 13) {
            this.handleRollClick();
        }
    }

    handleHelpClick() {
        this.setState({showHelp: !this.state.showHelp});
    }
    handleRollClick(expression) {
        try {
            const result = Formula.calculate(expression || this.state.formula);
            this.addResult(result);
        } catch(ex) {
            this.setState({formulaError: ex});
        }
    }
    handleReRollClick(expression) {
        this.setState({formula: expression});
        this.handleRollClick(expression);
    }

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
