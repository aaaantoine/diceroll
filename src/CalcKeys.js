import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faTimes, faDivide } from '@fortawesome/free-solid-svg-icons';

const iconMap = {
    "+": faPlus,
    "-": faMinus,
    "*": faTimes,
    "/": faDivide
};

const iconifyButton = value => iconMap[value]
    ? <FontAwesomeIcon icon={iconMap[value]} />
    : value;

export default class CalcKeys extends React.Component {
    render = () => (
        <div class="my-2 calculator-buttons">
            {this.formulaButtonRow([7,8,9,'/'])}
            {this.formulaButtonRow([4,5,6,'*'])}
            {this.formulaButtonRow([1,2,3,'-'])}
            {this.formulaButtonRow(['(',0,')','+'])}
        </div>
    );

    formulaButtonRow = (collection) => (
        <div class="form-row">
            {collection.map(value => this.formulaButton(value))}
        </div>
    );

    formulaButton = (value) => (
        <div class="col text-center">
            <button class="btn btn-secondary btn-lg" type="button"
                onClick={() => this.props.onInput(value)}>
                    {iconifyButton(value)}
            </button>
        </div>
    );
}