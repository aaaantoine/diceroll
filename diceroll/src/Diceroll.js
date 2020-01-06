import React from 'react';
import Formula from './Formula.js';

export default class Diceroll extends React.Component {
    constructor(props) {
        super(props);
        this.maxResults = 5;
        this.state = {
            formula: null,
            formulaIsInvalid: false,
            results: []
        };
    }

    render() {
        const error = this.state.formulaIsInvalid
            ? (
                <div class="alert alert-danger" role="alert">
                    The formula is invalid.
                </div>
            )
            : "";
        return (
            <div class="container">
                <div class="form-group">
                    <label for="rollFormula">Formula</label>
                    <div class="input-group">
                        <input type="text" class="form-control" id="rollFormula"
                            onKeyUp={(e) => this.handleFormulaKeyUp(e, this)}
                            onChange={(e) => this.setState({formula: e.target.value})} />
                        <div class="input-group-append">
                        <button class="btn btn-primary" type="submit"
                            onClick={() => this.handleRollClick(this)}>Roll</button>
                        </div>
                    </div>
                </div>
                {error}
                <div>
                    {this.renderHistory()}
                </div>
            </div>
        );
    }

    renderHistory() {
        const latestIndex = this.state.results.length - 1;
        return this.state.results
            .map(function(result, index) {
                const isLatest = index === latestIndex;
                const resultClass = "result" + (isLatest ? " latest" : "");
                return (
                    <div class="row">
                        <div class="col-md-9">

                        </div>
                        <div class="col-md-3">
                            <span class={resultClass}>{result}</span>
                        </div>
                    </div>
                );
            })
            .reverse();
    }

    handleFormulaKeyUp(event) {
        if (event.keyCode === 13) {
            this.handleRollClick();
        }
    }

    handleRollClick() {
        try {
            const result = Formula.calculate(this.state.formula);
            this.addResult(result);
        } catch {
            this.setState({formulaIsInvalid: true});
        }
    }

    addResult(result) {
        let results = this.state.results;
        results.push(result);
        if (results.length > this.maxResults) {
            results.splice(0, 1);
        }
        this.setState({
            results: results,
            formulaIsInvalid: false
        });
    }
}
