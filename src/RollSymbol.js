import React from 'react'

export default class RollSymbol extends React.Component {
    render() {
        const discarded = this.props.symbol.discard ? " discarded" : "";
        const symbolClass = this.getSymbolClass(
            this.props.symbol.sides,
            this.props.symbol.text);
        const dieClass = this.props.symbol.sides
            ? " die " + symbolClass
            : ""
        const fullSymbolClass = "symbol" + discarded + dieClass;
        return <span class={fullSymbolClass}>{this.props.symbol.text}</span>;
    }

    getSymbolClass(sides, value) {
        function classBySides(sides) {
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
        }
        const prefix = classBySides(sides);
        return prefix
            ? `${prefix} ${prefix}-${value}`
            : "coin";
    }
}
