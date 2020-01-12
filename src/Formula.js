const PLUS = '+';
const MINUS = '-';
const TIMES = '*';
const DIV = '/';
const ROLL = 'd';

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
         return this.type !== NUMBER ? 0 : parseFloat(this.text);
    }
}

class DieSymbol extends Symbol {
    constructor(sides, value) {
        super(NUMBER, value.toString());
        this.sides = sides;
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
            expression[i] === ROLL) {
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

function rollOne(sides) {
    return Math.floor(Math.random() * (sides)) + 1;
}

function roll(count, sides)
{
    let sum = 0;
    for (let i = 0; i < count; i++)
    {
        sum += rollOne(sides);
    }
    return sum;
}

function rollIntoSymbols(count, sides) {
    let symbols = [];
    for (let i = 0; i < count; i++) {
        if (symbols.length > 0) {
            symbols.push(new Symbol(OPERATOR, PLUS));
        }
        symbols.push(new DieSymbol(sides, rollOne(sides)));
    }
    return symbols;
}
    
function operation(number1, symbol, number2)
{
    if (symbol === ROLL) {
        return rollIntoSymbols(number1, number2);
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
            case ROLL:
                return roll(number1, number2);
            default:
                return number1;
        }
    })());
}

function performOperations(symbols, ops)
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
            const number2 = symbols[i+1].getNumber();
            let newSymbol = operation(number1, operator, number2);
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
    const regex = /^\(*\d+(\)*[d+\-*/]\(*\d+)*\)*$/;
    const isMatch = !!expression.match(regex);
    const countLeft = count('(');
    const countRight = count(')');
    return isMatch && countLeft === countRight;
}

function subCalculate(symbols) {
    // order of operations is P-R-MD-AS
    // where R = roll dice

    // find parentheses first
    let newSymbols = symbols.slice();
    for (let i = 0; i < newSymbols.length; i++) {

        if (Array.isArray(newSymbols[i]))
        {
            // convert COMPOUND to NUMBER via recursion
            newSymbols[i] = NumberSymbol(subCalculate(newSymbols[i]));
        }
    }

    // roll dice
    newSymbols = performOperations(newSymbols, [ROLL]);
    
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

function rollAll(symbols) {
    // roll dice in sub-expressions
    symbols = symbols.map(
        symbol => Array.isArray(symbol) ? rollAll(symbol) : symbol);

    // roll dice
    symbols = performOperations(symbols, [ROLL]);
    return symbols;
}

function calculate(expression)
{
    const lowerExpression = expression.toLowerCase();
    if (!validate(lowerExpression)) {
        throw new Error("Formula is invalid.");
    }

    let symbols = parseSymbols(lowerExpression);
    symbols = rollAll(symbols);
    return {
        symbols,
        total: subCalculate(symbols)
    };
}

export default {
    parseSymbols,
    calculate
};