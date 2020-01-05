import React from 'react';
import Formula from './Formula.js';

export default class Diceroll extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formula: null,
            formulaIsInvalid: false,
            result: null
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
                            onKeyUp={(e) => handleFormulaKeyUp(e, this)}
                            onChange={(e) => this.setState({formula: e.target.value})} />
                        <div class="input-group-append">
                        <button class="btn btn-primary" type="submit"
                            onClick={() => handleRollClick(this)}>Roll</button>
                        </div>
                    </div>
                </div>
                {error}
                <div class="row">
                    <div class="col-md-9">

                    </div>
                    <div class="col-md-3">
                        <span class="result">{this.state.result === 0 ? '0' : this.state.result || ''}</span>
                    </div>
                </div>
            </div>
        );
    }
}

function handleFormulaKeyUp(event, component) {
    if (event.keyCode === 13) {
        handleRollClick(component);
    }
}
function handleRollClick(component) {
    try {
        const result = Formula.calculate(component.state.formula);
        component.setState({result, formulaIsInvalid: false});
    } catch {
        component.setState({formulaIsInvalid: true});
    }
}
