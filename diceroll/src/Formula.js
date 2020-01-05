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
    
    return symbols;
}

function roll(count, sides)
{
    function rollOne(sides) {
        return Math.floor(Math.random() * (sides)) + 1;
    }
    
    let sum = 0;
    for (let i = 0; i < count; i++)
    {
        sum += rollOne(sides);
    }
    return sum;
}
    
function operation(number1, symbol, number2)
{
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
        if (symbol.type === OPERATOR && ops.includes(symbol.text))
        {
            // effectively convert NUMBER OPERATOR NUMBER to NUMBER
            
            // assumes that i is not first or last in the array
            // and that before and after are both numbers.
            let newSymbol = NumberSymbol(
                operation(
                    symbols[i-1].getNumber(),
                    symbol.text[0],
                    symbols[i+1].getNumber()));
            newSymbols.pop();
            newSymbols.push(newSymbol);
            i++;
        } else {
            newSymbols.push(symbol);
        }
    }

    return newSymbols;
}

function calculate(expression)
{
    let symbols = parseSymbols(expression);
    
    // order of operations is P-R-MD-AS
    // where R = roll dice
    
    // find parentheses first
    for (let i = 0; i < symbols.length; i++) {
        if (symbols[i].type === COMPOUND)
        {
            // convert COMPOUND to NUMBER via recursion
            symbols[i] = NumberSymbol(calculate(symbols[i].text));
        }
    }
    
    // roll dice
    symbols = performOperations(symbols, [ROLL]);
    
    // multiplication and division
    symbols = performOperations(symbols, [TIMES, DIV]);
    
    // addition and subtraction
    symbols = performOperations(symbols, [PLUS, MINUS]);
    
    // by this point there should only be one NUMBER left.
    // TODO: confirm above via validation code
    
    if (symbols.length >= 1)
    {
        return symbols[0].getNumber();
    }
    else
    {
        return 0;
    }
}

export default {
    parseSymbols,
    calculate
};