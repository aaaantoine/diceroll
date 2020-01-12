import React from 'react';
import Formula from './Formula.js';

export default class Diceroll extends React.Component {
    constructor(props) {
        super(props);
        this.maxResults = 50;
        this.state = {
            formula: null,
            formulaIsInvalid: false,
            results: [],
            showHelp: false
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
        const helpSection = this.state.showHelp
            ? (
                <div class="alert alert-info help">
                    <h2>Help</h2>
                    <p>
                        <em>Click the <strong>Help</strong> button again to dismiss this info box.</em>
                    </p>
                    <p>
                        Any positive integer number can be entered as part of the formula.
                        Numbers are joined together by operators.
                        Operators include:
                    </p>
                    <ul>
                        <li>
                            <code>d</code>:
                            Roll dice.
                            First number is the quantity of dice.
                            Second number is the number of sides per die.
                        </li>
                        <li>
                            <code>*</code>: Multiply the two numbers.
                        </li>
                        <li>
                            <code>/</code>: Divide the first number by the second number.
                        </li>
                        <li>
                            <code>+</code>: Add the two numbers.
                        </li>
                        <li>
                            <code>-</code>: Subtract the second number from the first number.
                        </li>
                    </ul>
                    <p>
                        Calculation honors traditional order of operations.
                        Calculates dice rolls first,
                        then expressions in parentheses,
                        then multiplication and division,
                        then addition and subtraction.
                    </p>
                    <p>
                        Examples:
                        <ul>
                            <li><code>2d6</code>: Rolls 2 6-sided dice.</li>
                            <li><code>1d20+5</code>: Rolls a 20-sided die and adds 5.</li>
                            <li><code>(4d8+2)/3</code>: Rolls 4 8-sided dice and adds 2, then divides by 3.</li>
                        </ul>
                    </p>
                    <p>
                        Keep highest/lowest:
                        <ul>
                            <li><code>3h4d6</code>: Rolls 4 6-sided dice and only counts the 3 highest.</li>
                            <li><code>1l2d20+3</code>: Rolls 2 20-sided dice, only counts the lowest, and adds 3.</li>
                        </ul>
                    </p>
                </div>

            )
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
                            onChange={(e) => this.setState({formula: e.target.value})} />
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
                <div class="history">
                    {this.renderHistory()}
                </div>
            </div>
        );
    }

    renderHistory() {
        const latestIndex = this.state.results.length - 1;
        const th = this;
        return this.state.results
            .map(function(result, index) {
                const latestClass = index === latestIndex ? " latest" : "";
                const rowClass = "row" + latestClass;
                const resultClass = "result" + latestClass;
                return (
                    <div class={rowClass}>
                        <div class="col-md-9">
                            {th.renderSymbols(result.symbols)}
                        </div>
                        <div class="col-md-3">
                            <span class={resultClass}>{result.total}</span>
                        </div>
                    </div>
                );
            })
            .reverse();
    }

    renderSymbols(symbols) {
        const th = this;
        function getSymbolClass(sides, value) {
            function classBySides(sides) {
                switch(sides) {
                    case 2: return "coin";
                    case 4: return "d4";
                    case 6: return "d6";
                    case 8: return "d8";
                    case 10: return "d10";
                    case 12: return "d12";
                    case 20: return "d20";
                    default:
                        return null;
                }
            }
            const prefix = classBySides(sides);
            return prefix
                ? `${prefix} ${prefix}-${value}`
                : "coin";
        }
        function renderSymbol(symbol) {
            const discarded = symbol.discard ? " discarded" : "";
            const dieClass = symbol.sides
                ? " die " + getSymbolClass(symbol.sides, symbol.text)
                : ""
            const symbolClass = "symbol" + discarded + dieClass;
            return <span class={symbolClass}>{symbol.text}</span>;
        }
        const leftParen = renderSymbol({text: "("});
        const rightParen = renderSymbol({text: ")"});
        return symbols.map(symbol => {
            if (Array.isArray(symbol)) {
                const renderParen = symbols.length > 1 &&
                    (
                        symbol.length > 1 ||
                        Array.isArray(symbol[0])
                    );
                return <span>
                    {renderParen ? leftParen : ""}
                    {th.renderSymbols(symbol)}
                    {renderParen ? rightParen : ""}
                </span>;
            }
            // Skip plus operator from dice array. 
            if (symbols.some(x => x.sides) && symbol.text === "+") {
                return "";
            }
            return renderSymbol(symbol);
        });
    }

    handleFormulaKeyUp(event) {
        if (event.keyCode === 13) {
            this.handleRollClick();
        }
    }

    handleHelpClick() {
        this.setState({showHelp: !this.state.showHelp});
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
