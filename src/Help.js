import React from 'react';

export default class Help extends React.Component {
    render() {
        return (
            <div class="alert alert-info help">
                <h2>Help</h2>
                <p>
                    <small><em>Click the <strong>Help</strong> button again to dismiss this info box.</em></small>
                </p>
                <p>
                    Any positive integer number can be entered as part of the formula.
                    Numbers are joined together by operators.
                    Operators include:
                </p>
                <ul>
                    <li>
                        <code>d</code>:
                        Roll dice.
                        First number is the quantity of dice.
                        Second number is the number of sides per die.
                    </li>
                    <li>
                        <code>*</code>: Multiply the two numbers.
                    </li>
                    <li>
                        <code>/</code>: Divide the first number by the second number.
                    </li>
                    <li>
                        <code>+</code>: Add the two numbers.
                    </li>
                    <li>
                        <code>-</code>: Subtract the second number from the first number.
                    </li>
                </ul>
                <p>
                    Calculation honors traditional order of operations.
                    Calculates dice rolls first,
                    then expressions in parentheses,
                    then multiplication and division,
                    then addition and subtraction.
                </p>
                <p>
                    Examples:
                    <ul>
                        <li><code>2d6</code>: Rolls 2 6-sided dice.</li>
                        <li><code>1d20+5</code>: Rolls a 20-sided die and adds 5.</li>
                        <li><code>(4d8+2)/3</code>: Rolls 4 8-sided dice and adds 2, then divides by 3.</li>
                    </ul>
                </p>
                <p>
                    Keep highest/lowest:
                    <ul>
                        <li><code>3h4d6</code>: Rolls 4 6-sided dice and only counts the 3 highest.</li>
                        <li><code>1l2d20+3</code>: Rolls 2 20-sided dice, only counts the lowest, and adds 3.</li>
                    </ul>
                </p>
                <p>
                    Fudge dice:
                    <ul>
                        <li>
                            <code>5df</code>: Rolls 5 fudge dice,
                            each producing a value of -1, 0, or +1.
                            Result will be between -5 and 5.
                        </li>
                    </ul>
                </p>
                <div class="container-fluid">
                    <div class="d-flex justify-content-end">
                        <button class="btn btn-info" type="button"
                            onClick={this.props.onCloseRequest}>Close</button>
                    </div>
                </div>
            </div>
        );
    }
}
