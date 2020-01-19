import React from 'react';
import RollSymbol from './RollSymbol.js';

const rollSymbol = (value) =>
    <RollSymbol symbol={{sides: value, text: value}} />;

export default class DieDropDown extends React.Component {
    render = () => (
        <React.Fragment>
            <button class="btn btn-outline-secondary dropdown-toggle"
                type="button"
                id="commonDiceDropdown"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false">
                {rollSymbol(this.props.value || " ")} 
            </button>
            <div class="dropdown-menu" aria-labelledby="commonDiceDropdown">
                {this.sidesDropDownOption(2)}
                {this.sidesDropDownOption(4)}
                {this.sidesDropDownOption(6)}
                {this.sidesDropDownOption(8)}
                {this.sidesDropDownOption(10)}
                {this.sidesDropDownOption(12)}
                {this.sidesDropDownOption(20)}
                {this.sidesDropDownOption(100)}
            </div>
        </React.Fragment>
    );

    sidesDropDownOption = (value) => (
        <button class="dropdown-item" type="button"
            onClick={() => this.props.onChange(value)}>
            {rollSymbol(value)}
        </button>
    );
}
