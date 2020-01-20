import Formula from '../Formula';

function mockRandom(sequence) {
    let position = 0;
    return () => {
        const outValue = sequence[position];
        position = (position + 1 < sequence.length) ? position + 1 : 0;
        return outValue;
    };
}

function calculate(expression, randomSequence) {
    return Formula.calculate(expression, mockRandom(randomSequence || [0.99]));
}

function testTotal(expression, expected, randomSequence) {
    const response = calculate(expression, randomSequence);
    expect(response.total).toBe(expected);
}

function testFormula(expression, randomSequence) {
    const response = calculate(expression, randomSequence);
    expect(response.expression).toBe(expression);
}

// parsing
test('throws exception when calculating abc', () => {
    expect(() => Formula.calculate("abc")).toThrow(new Error('At position 0: Unrecognized character "a".'));
});
test('throws exception when calculating 2+2+', () => {
    expect(() => Formula.calculate("2+2+")).toThrow(new Error('At position 3: Operator "+" is missing a right-hand value.'));
});
test('throws exception when calculating 2+(2+)', () => {
    expect(() => Formula.calculate("2+(2+)")).toThrow(new Error('At position 4: Operator "+" is missing a right-hand value.'));
});
test('throws exception when calculating *2+2', () => {
    expect(() => Formula.calculate("*2+2")).toThrow(new Error('At position 0: Operator "*" is missing a left-hand value.'));
});
test('throws exception when calculating 2+*2', () => {
    expect(() => Formula.calculate("2+*2")).toThrow(new Error('At position 2: Operator "*" is missing a left-hand value.'));
});
test('throws exception when calculating (2*(2+2)', () => {
    expect(() => Formula.calculate("(2*(2+2)")).toThrow(new Error('Parentheses mismatch. Counted 2 opening and 1 closing.'));
});
test('throws exception when calculating d', () => {
    expect(() => Formula.calculate("d")).toThrow(new Error('At position 0: Operator "d" is missing a right-hand value.'));
});
test('throws exception when calculating d4d6', () => {
    expect(() => Formula.calculate("d4d6")).toThrow(new Error('At position 2: Invalid placement of operator "d".'));
});
test('throws exception when calculating "2 3d6"', () => {
    expect(() => Formula.calculate("2 3d6")).toThrow(new Error('At position 2: Invalid spacing between numeric characters.'));
});

// straight math
test('calculates 1+1 and returns total of 2', () => testTotal("1+1", 2));
test('calculates 8*4 and returns total of 32', () => testTotal("8*4", 32));
test('calculates 4+3*2 and returns total of 10', () => testTotal("4+3*2", 10));
test('calculates (4+3)*2 and returns total of 14', () => testTotal("(4+3)*2", 14));
test('calculates 2+(2+2) and returns total of 6', () => testTotal("2+(2+2)", 6));

// dice rolls
test('calculates 1d1+1 and returns total of 2', () => testTotal("1d1+1", 2));
test('calculates 1D1+1 and returns total of 2', () => testTotal("1D1+1", 2));
test('calculates 1d10 with random values [.3] and returns total of 4', () =>
    testTotal("1d10", 4, [.3]));
test('calculates d10 with random values [.3] and returns total of 4 (assuming 1d10)', () =>
    testTotal("d10", 4, [.3]));
test('calculates 3d10 with random values [.0, .1, .3] and returns total of 7', () =>
    testTotal("3d10", 7, [.0, .1, .3]));
test('calculates 3+d10 with random values [.3] and returns total of 7 (assuming 3+1d10)', () =>
    testTotal("3+d10", 7, [.3]));
test('throws exception when calculating d(2+2)', () => {
    expect(() => Formula.calculate("d(2+2)")).toThrow(new Error('At position 1: Calculating number of sides per die is not supported.'));
});
test('throws exception when calculating (d4)d6', () => {
    expect(() => Formula.calculate("(d4)d6")).toThrow(new Error('At position 4: Calculating number of dice in a pool is not supported.'));
});

// fudge dice
test('calculates 1df with random values [.0] and returns total of -1', () =>
    testTotal("1df", -1, [.0]));
test('calculates 1df with random values [.34] and returns total of 0', () =>
    testTotal("1df", 0, [.34]));
test('calculates 1df with random values [.67] and returns total of 1', () =>
    testTotal("1df", 1, [.67]));
test('calculates df+3 with random values [.0] and returns total of 2', () =>
    testTotal("df+3", 2, [.0]));
test('calculates df(5) with random values [.0] and returns total of -5', () =>
    testTotal("df(5)", -5, [.0]));
test('throws exception when calculating "3f"', () => {
    expect(() => Formula.calculate("3f")).toThrow(new Error('At position 1: Invalid placement of character "f".'));
});
test('throws exception when calculating "1df3"', () => {
    expect(() => Formula.calculate("1df3")).toThrow(new Error('At position 3: Invalid number placement.'));
});

// compound
test('calculates 2*(2d10-4) with random values [.8, .9] and returns total of 30', () =>
    testTotal("2*(2d10-4)", 30, [.8, .9]));
test('calculates 2(2d10-4) with random values [.8, .9] and returns total of 30 (assuming 2*(2d10-4))', () =>
    testTotal("2(2d10-4)", 30, [.8, .9]));

// Keep high/low
test('calculates 2h3d10 with random values [.0, .1, .3], keeps 2 highest rolls to return total of 6', () =>
    testTotal("2h3d10", 6, [.0, .1, .3]));
test('calculates 1h3d10 with random values [.0, .1, .3], keeps highest roll to return total of 4', () =>
    testTotal("1h3d10", 4, [.0, .1, .3]));
    test('calculates h3d10 with random values [.0, .1, .3], keeps highest roll to return total of 4 (assumes 1h3d10)', () =>
    testTotal("h3d10", 4, [.0, .1, .3]));
test('calculates 2l3d10 with random values [.0, .1, .3], keeps 2 lowest rolls to return total of 3', () =>
    testTotal("2l3d10", 3, [.0, .1, .3]));
test('calculates 3l3d10 with random values [.0, .1, .3], keeps all rolls to return total of 7', () =>
    testTotal("3l3d10", 7, [.0, .1, .3]));
test('calculates 4l3d10 with random values [.0, .1, .3], keeps all rolls to return total of 7', () =>
    testTotal("4l3d10", 7, [.0, .1, .3]));

const highestVsDiceOnly = 'Can only keep highest/lowest against a dice pool.';
test('throws exception when calculating 1h(4+5)', () => {
    expect(() => Formula.calculate("1h(4+5)")).toThrow(new Error(highestVsDiceOnly));
});
test('throws exception when calculating 1l12', () => {
    expect(() => Formula.calculate("1h12")).toThrow(new Error(highestVsDiceOnly));
});

// spacing
test('calculates " 1+1 " and returns total of 2', () => testTotal(" 1+1 ", 2));
test('calculates "1 + 1" and returns total of 2', () => testTotal("1 + 1", 2));
test('throws exception when calculating " 2+*2"', () => {
    expect(() => Formula.calculate(" 2+*2")).toThrow(new Error('At position 3: Operator "*" is missing a left-hand value.'));
});
test('throws exception when calculating " *2+2"', () => {
    expect(() => Formula.calculate(" *2+2")).toThrow(new Error('At position 1: Operator "*" is missing a left-hand value.'));
});
test('throws exception when calculating "2+2+ "', () => {
    expect(() => Formula.calculate("2+2+ ")).toThrow(new Error('At position 3: Operator "+" is missing a right-hand value.'));
});

// returns a matching formula
test('calculates "4 + 2(d6)" and returns formula "4 + 2(d6)"', () => testFormula("4 + 2(d6)"));