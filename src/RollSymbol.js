import React from 'react'

const renderSymbol = symbol => symbol.sides === 100
    ? d100(symbol)
    : singleDie(symbol);

const d100 = symbol => singleDie(symbol);

const singleDie = symbol => {
    const discarded = symbol.discard ? " discarded" : "";
    const symbolClass = getSymbolClass(symbol.sides, symbol.text);
    const dieClass = symbol.sides ? " die " + symbolClass : "";
    const fullSymbolClass = "symbol" + discarded + dieClass;
    return <span class={fullSymbolClass}>{symbol.text}</span>;
};

const getSymbolClass = (sides, value) => {
    const prefix = classBySides(sides);
    return prefix ? `${prefix} ${prefix}-${value}` : "coin";
};

const classBySides = (sides) => {
    switch(parseInt(sides)) {
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
};

export default class RollSymbol extends React.Component {
    render = () => renderSymbol(this.props.symbol);
}
