import React from 'react';
import CalcKeys from './CalcKeys.js';
import DiceTools from './DiceTools.js';

export default class InputToolbox extends React.Component {
    render() {
        return (
            <div class="row justify-content-center">
                <div class="col-lg-4">
                    <DiceTools 
                        onDiceAddClick={this.props.onFormulaAddRequest}
                        onRollClick={this.props.onRollRequest} />
                </div>
                <div class="col-lg-4">
                    <CalcKeys onInput={this.props.onFormulaAddRequest} />
                </div>
            </div>
        );
    }
}
