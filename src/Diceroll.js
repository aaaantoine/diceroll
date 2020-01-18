import React from 'react';
import Formula from './Formula.js';
import Help from './Help.js';

export default class Diceroll extends React.Component {
    constructor(props) {
        super(props);
        this.handleHelpClick = this.handleHelpClick.bind(this);
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
                const rowClass = "row align-items-center" + latestClass;
                const resultClass = "result" + latestClass;
                return (
                    <div class={rowClass}>
                        <div class="col-md-8">
                            {th.renderSymbols(result.symbols)}
                        </div>
                        <div class="col-md-3 text-right">
                            <span class={resultClass}>{result.total}</span>
                        </div>
                        <div class="col-md-1 text-right">
                            <button class="btn btn-outline-primary btn-sm" type="button"
                                    title={result.expression}
                                    onClick={() => th.handleReRollClick(result.expression)}>Re-roll</button>
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
