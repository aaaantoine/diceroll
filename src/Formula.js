const PLUS = '+';
const MINUS = '-';
const TIMES = '*';
const DIV = '/';
const ROLL = 'd';
const LOWEST = 'l';
const HIGHEST = 'h';

// symbol types
const NUMBER = 0;
const OPERATOR = 1;
const COMPOUND = 2;

class Symbol {
    constructor(type, text) {
        this.type = type;
        this.text = text;
    }

    getNumber() {
        return this.type !== NUMBER || !!this.discard
            ? 0 
            : parseFloat(this.text);
    }
}

class DieSymbol extends Symbol {
    constructor(sides, value) {
        super(NUMBER, value.toString());
        this.sides = sides;
        this.discard = false;
    }
}

function NumberSymbol(value) {
    return new Symbol(NUMBER, value.toString());
}

function parseSymbols(expression) {
    let symbols = [];
    let parenCount = 0;
    for (let i = 0; i < expression.length; i++) {
        let lastSymbol = symbols.length > 0
            ? symbols[symbols.length - 1]
            : null;
        if (parenCount > 0)
        {
            // within any number of parentheses
            // all characters are treated
            // as part of the same expression
            if (expression[i] === ')')
            {
                parenCount--;
            }
            else if (expression[i] === '(')
            {
                parenCount++;
            }
            
            if (parenCount > 0)
            {
                symbols[symbols.length - 1].text += expression[i];
            }
        }
        else if (expression[i] === PLUS ||
            expression[i] === MINUS ||
            expression[i] === TIMES ||
            expression[i] === DIV ||
            expression[i] === ROLL ||
            expression[i] === LOWEST ||
            expression[i] === HIGHEST) {
            symbols.push(new Symbol(OPERATOR, expression[i]));
        }
        else if (expression[i] >= '0' && expression[i] <= '9') {
            if (!lastSymbol || lastSymbol.type !== NUMBER) {
                symbols.push(new Symbol(NUMBER, expression[i]));
            }
            else {
                lastSymbol.text += expression[i];
            }
        }
        else if (expression[i] === '(')
        {
            parenCount++;
            symbols.push(new Symbol(COMPOUND, ''));
        }
    }

    // convert COMPOUND symbols to sub-arrays.
    for (let i = 0; i < symbols.length; i++) {
        if (symbols[i].type === COMPOUND) {
            symbols[i] = parseSymbols(symbols[i].text);
        }
    }
    
    return symbols;
}

function rollOne(sides, randomizer) {
    const r = randomizer || Math.random;
    return Math.floor(r() * (sides)) + 1;
}

function rollIntoSymbols(count, sides, randomizer) {
    let symbols = [];
    for (let i = 0; i < count; i++) {
        if (symbols.length > 0) {
            symbols.push(new Symbol(OPERATOR, PLUS));
        }
        symbols.push(new DieSymbol(sides, rollOne(sides, randomizer)));
    }
    return symbols;
}

function markDiscarded(keepCount, keepLowestOrHighest, dice) {
    function handleNoDice() {
        throw new Error("Can only keep highest/lowest against a dice pool.");
    }
    if (!Array.isArray(dice)) {
        handleNoDice();
    }
    let workdice = dice.filter(d => d.sides !== undefined);
    if (workdice.length === 0) {
        handleNoDice();
    }
    workdice.forEach(die => die.discard = false);
    const compFunc = keepLowestOrHighest === LOWEST
        ? (a, b) => a.getNumber() - b.getNumber()
        : (a, b) => b.getNumber() - a.getNumber();
    workdice
        .sort(compFunc)
        .slice(keepCount)
        .forEach(die => die.discard = true);
    
    return dice;
}
    
function operation(number1, symbol, number2, randomizer) {
    if (symbol === ROLL) {
        return rollIntoSymbols(number1, number2, randomizer);
    }
    if ([LOWEST, HIGHEST].includes(symbol)) {
        return markDiscarded(number1, symbol, number2);
    }

    return NumberSymbol((function () {
        switch (symbol)
        {
            case PLUS:
                return number1 + number2;
            case MINUS:
                return number1 - number2;
            case TIMES:
                return number1 * number2;
            case DIV:
                return number1 / number2;
            default:
                return number1;
        }
    })());
}

function performOperations(symbols, ops, randomizer)
{
    let newSymbols = [];
    for (let i = 0; i < symbols.length; i++)
    {
        let symbol = symbols[i];
        // if the current symbol is an operator
        // and is one of the current operations declared by ops,
        // perform that operation now.
        if (symbol.type && symbol.type === OPERATOR && ops.includes(symbol.text))
        {
            // effectively convert NUMBER OPERATOR NUMBER to NUMBER
            
            // assumes that i is not first or last in the array
            // and that before and after are both numbers.
            const number1 = newSymbols[newSymbols.length-1].getNumber();
            const operator = symbol.text[0];
            const next = symbols[i+1];
            const number2 = Array.isArray(next) ? next : next.getNumber();
            let newSymbol = operation(number1, operator, number2, randomizer);
            newSymbols.pop();
            newSymbols.push(newSymbol);
            i++;
        } else {
            newSymbols.push(symbol);
        }
    }

    return newSymbols;
}

function validate(expression) {
    function count(symbol) {
        const pattern = new RegExp('\\'+symbol, "g");
        return (expression.match(pattern) || []).length;
    }
    const regex = /^\(*\d+(\)*[dhl+\-*/]\(*\d+)*\)*$/;
    const isMatch = !!expression.match(regex);
    const countLeft = count('(');
    const countRight = count(')');
    return isMatch && countLeft === countRight;
}

function subCalculate(symbols) {
    // order of operations is R-P-MD-AS
    // where R = roll dice
    // Dice should already be rolled and processed into symbols.

    // find parentheses first
    let newSymbols = symbols.slice();
    for (let i = 0; i < newSymbols.length; i++) {

        if (Array.isArray(newSymbols[i]))
        {
            // convert COMPOUND to NUMBER via recursion
            newSymbols[i] = NumberSymbol(subCalculate(newSymbols[i]));
        }
    }
    
    // multiplication and division
    newSymbols = performOperations(newSymbols, [TIMES, DIV]);
    
    // addition and subtraction
    newSymbols = performOperations(newSymbols, [PLUS, MINUS]);
    
    // by this point there should only be one NUMBER left.
    // TODO: confirm above via validation code
    
    if (newSymbols.length >= 1)
    {
        return newSymbols[0].getNumber();
    }
    else
    {
        return 0;
    }
}

function rollAll(symbols, randomizer) {
    // roll dice in sub-expressions
    symbols = symbols.map(
        symbol => Array.isArray(symbol) ? rollAll(symbol, randomizer) : symbol);

    // roll dice
    symbols = performOperations(symbols, [ROLL], randomizer);
    symbols = performOperations(symbols, [LOWEST, HIGHEST]);
    return symbols;
}

/**
 * Calculates the given formula expression.
 * 
 * @param {string} expression
 *      The expression to parse and calculate.
 * @param {function} randomizer
 *      An optional function to produce a number
 *      between 0 (inclusive) and 1 (exclusive).
 *      Default is `Math.random`.
 */
function calculate(expression, randomizer)
{
    const lowerExpression = expression.toLowerCase();
    if (!validate(lowerExpression)) {
        throw new Error("Formula is invalid.");
    }

    let symbols = parseSymbols(lowerExpression);
    symbols = rollAll(symbols, randomizer);
    return {
        symbols,
        total: subCalculate(symbols)
    };
}

export default {
    parseSymbols,
    calculate
};