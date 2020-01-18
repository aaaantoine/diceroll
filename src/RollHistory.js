import React from 'react';

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
}
