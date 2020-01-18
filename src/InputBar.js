import React from 'react';
import InputToolbox from './InputToolbox.js';

export default class InputBar extends React.Component {
    constructor(props) {
        super(props);
        this.formulaField = React.createRef();
        this.state = {
            showTools: false
        };
    }
    render() {
        const buttonClass = isActive =>
            "btn btn-outline-secondary" + (isActive ? " active" : "");
        return (
            <div>
                {
                    this.state.showTools
                        ? <InputToolbox
                            onFormulaAddRequest={this.handleFormulaAddRequest} />
                        : ""
                }
                <div class="form-group">
                    <label for="rollFormula">Formula</label>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <button type="button"
                                class={buttonClass(this.state.showTools)}
                                onClick={() => this.setState({showTools: !this.state.showTools})}>Tools</button>
                            <button class="btn btn-outline-danger" type="button"
                                onClick={(e) => this.props.onSetFormulaRequest("")}>Clear</button>
                        </div>
                        <input type="text" class="form-control"
                            ref={this.formulaField}
                            onKeyUp={this.handleFormulaKeyUp}
                            onChange={(e) => this.props.onSetFormulaRequest(e.target.value)}
                            value={this.props.formula} />
                        <div class="input-group-append">
                            <button class={buttonClass(this.props.helpIsVisible)} type="button"
                                onClick={this.props.onHelpRequest}>Help</button>
                            <button class="btn btn-primary" type="submit"
                                onClick={this.props.onRollRequest}>Roll</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    handleFormulaAddRequest = (value) =>
        this.props.onSetFormulaRequest(
            this.formulaField.current.value + value);

    handleFormulaKeyUp = (event) => {
        if (event.keyCode === 13) {
            this.props.onRollRequest();
        }
    };
}
