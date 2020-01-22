import React from 'react';
import CalcKeys from './CalcKeys.js';
import DiceTools from './DiceTools.js';

export default class InputToolbox extends React.Component {
    constructor(props) {
        super(props);
        this.dialogs = {
            dice: {
                label: "Dice",
                content: <DiceTools 
                    onDiceAddClick={this.props.onFormulaAddRequest}
                    onRollClick={this.props.onRollRequest} />
            },
            calc: {
                label: "Math",
                content: <CalcKeys onInput={this.props.onFormulaAddRequest} />
            }
        };
        this.state = {
            openDialog: this.dialogs.dice
        };
    }
    render() {
        return (
            <React.Fragment>
                <div class="row justify-content-center d-lg-none">
                    <div class="btn-group">
                        {Object.values(this.dialogs).map(dialog => (
                            <button
                                class={"btn btn-outline-secondary btn-sm" + (this.state.openDialog === dialog ? " active" : "")}
                                onClick={() => this.setState({openDialog: dialog})}>
                                {dialog.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div class="row justify-content-center">
                    {Object.values(this.dialogs).map(dialog => this.state.openDialog === dialog ? (
                        <div class="col-lg-4 d-lg-block">
                            {dialog.content}
                        </div>
                    ) : null)}
                </div>
            </React.Fragment>
        );
    }
}
