import React from 'react';
import RollSymbol from './RollSymbol.js';

export default class RollHistory extends React.Component {
    render() {
        return (
            <div class="history">
                {this.renderHistory()}
            </div>
        );
    }

    renderHistory() {
        const latestIndex = this.props.rolls.length - 1;
        const th = this;
        return this.props.rolls
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
                                    onClick={() => th.props.onReRollRequest(result.expression)}>Re-roll</button>
                        </div>
                    </div>
                );
            })
            .reverse();
    }

    renderSymbols(symbols) {
        const leftParen = <RollSymbol symbol={{text: "("}} />;
        const rightParen = <RollSymbol symbol={{text: ")"}} />;
        return symbols.map(symbol => {
            if (Array.isArray(symbol)) {
                const renderParen = symbols.length > 1 &&
                    (
                        symbol.length > 1 ||
                        Array.isArray(symbol[0])
                    );
                return <span>
                    {renderParen ? leftParen : ""}
                    {this.renderSymbols(symbol)}
                    {renderParen ? rightParen : ""}
                </span>;
            }
            // Skip plus operator from dice array. 
            if (symbols.some(x => x.sides) && symbol.text === "+") {
                return "";
            }
            return <RollSymbol symbol={symbol} />;
        });
    }
}
