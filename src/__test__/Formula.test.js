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
    expect(() => Formula.calculate("abc")).toThrow(new Error('Formula is invalid.'));
});

// straight math
test('calculates 1+1 and returns total of 2', () => testTotal("1+1", 2));
test('calculates 8*4 and returns total of 32', () => testTotal("8*4", 32));
test('calculates 4+3*2 and returns total of 10', () => testTotal("4+3*2", 10));
test('calculates (4+3)*2 and returns total of 14', () => testTotal("(4+3)*2", 14));

// dice rolls
test('calculates 1d1+1 and returns total of 2', () => testTotal("1d1+1", 2));
test('calculates 1D1+1 and returns total of 2', () => testTotal("1D1+1", 2));
test('calculates 3d10 with random values [.0, .1, .3] and returns total of 7', () =>
    testTotal("3d10", 7, [.0, .1, .3]));

// compound
test('calculates 2*(2d10-4) with random values [.8, .9] and returns total of 30', () =>
    testTotal("2*(2d10-4)", 30, [.8, .9]));

// Keep high/low
test('calculates 2h3d10 with random values [.0, .1, .3], keeps 2 highest rolls to return total of 6', () =>
    testTotal("2h3d10", 6, [.0, .1, .3]));
test('calculates 1h3d10 with random values [.0, .1, .3], keeps highest roll to return total of 4', () =>
    testTotal("1h3d10", 4, [.0, .1, .3]));
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
