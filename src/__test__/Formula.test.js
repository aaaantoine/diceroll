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

// parsing
test('throws exception when calculating abc', () => {
    expect(() => Formula.calculate("abc")).toThrow(new Error('Unrecognized character "a" at position 0.'));
});
test('throws exception when calculating 2+2+', () => {
    expect(() => Formula.calculate("2+2+")).toThrow(new Error('Operator "+" at position 3 is missing a right-hand value.'));
});
test('throws exception when calculating *2+2', () => {
    expect(() => Formula.calculate("*2+2")).toThrow(new Error('Operator "*" at position 0 is missing a left-hand value.'));
});
test('throws exception when calculating 2+*2', () => {
    expect(() => Formula.calculate("2+*2")).toThrow(new Error('Operator "*" at position 2 is missing a left-hand value.'));
});
test('throws exception when calculating (2*(2+2)', () => {
    expect(() => Formula.calculate("(2*(2+2)")).toThrow(new Error('Parentheses mismatch. Counted 2 opening and 1 closing.'));
});
test('throws exception when calculating d', () => {
    expect(() => Formula.calculate("d")).toThrow(new Error('Operator "d" at position 0 is missing a right-hand value.'));
});
test('throws exception when calculating d4d6', () => {
    expect(() => Formula.calculate("d4d6")).toThrow(new Error('Invalid placement of operator "d" at position 2.'));
});

// straight math
test('calculates 1+1 and returns total of 2', () => testTotal("1+1", 2));
test('calculates 8*4 and returns total of 32', () => testTotal("8*4", 32));
test('calculates 4+3*2 and returns total of 10', () => testTotal("4+3*2", 10));
test('calculates (4+3)*2 and returns total of 14', () => testTotal("(4+3)*2", 14));

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
