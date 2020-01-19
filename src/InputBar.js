import React from 'react';
import InputToolbox from './InputToolbox.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDice, faInfo, faTrashAlt, faWrench } from '@fortawesome/free-solid-svg-icons';

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
                                title="Formula Building Tools"
                                class={buttonClass(this.state.showTools)}
                                onClick={() => this.setState({showTools: !this.state.showTools})}>
                                    <FontAwesomeIcon icon={faWrench} />
                            </button>
                            <button class={buttonClass(this.props.helpIsVisible)} type="button"
                                title="Formula Help"
                                onClick={this.props.onHelpRequest}>
                                    <FontAwesomeIcon icon={faInfo} />
                            </button>
                            <button class="btn btn-outline-danger" type="button"
                                title="Clear Formula"
                                onClick={(e) => this.props.onSetFormulaRequest("")}>
                                    <FontAwesomeIcon icon={faTrashAlt} />
                            </button>
                        </div>
                        <input type="text" class="form-control"
                            ref={this.formulaField}
                            onKeyUp={this.handleFormulaKeyUp}
                            onChange={(e) => this.props.onSetFormulaRequest(e.target.value)}
                            value={this.props.formula} />
                        <div class="input-group-append">
                            <button class="btn btn-primary" type="submit"
                                title="Roll"
                                onClick={this.props.onRollRequest}>
                                    <FontAwesomeIcon icon={faDice} />
                            </button>
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
