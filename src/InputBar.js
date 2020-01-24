import React from 'react';
import Help from './Help.js';
import InputToolbox from './InputToolbox.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDice, faInfo, faTrashAlt, faWrench } from '@fortawesome/free-solid-svg-icons';

const formulaIsRollable = formula => formula && formula.trim() !== "";

export default class InputBar extends React.Component {
    constructor(props) {
        super(props);
        this.dialogs = {
            tools: {
                tooltip: "Formula Building Tools",
                icon: faWrench,
                content: <InputToolbox
                    onFormulaAddRequest={this.handleFormulaAddRequest}
                    onRollRequest={this.handleRollRequest} />
            },
            help: {
                tooltip: "Formula Help",
                icon: faInfo,
                content: <Help onCloseRequest={this.handleHelpClick} />
            }
        };
        this.formulaField = React.createRef();
        this.state = {
            openDialog: null
        };
    }
    
    render() {
        const buttonClass = isActive =>
            "btn btn-outline-secondary" + (isActive ? " active" : "");
        const dialogButton = dialog => (
            <button type="button"
                    title={dialog.tooltip}
                    class={buttonClass(this.state.openDialog === dialog)}
                    onClick={() => this.setDialog(dialog)}>
                        <FontAwesomeIcon icon={dialog.icon} />
                </button>
        );
        const buttonTray = divClass => (
            <div class={divClass}>
                {dialogButton(this.dialogs.tools)}
                {dialogButton(this.dialogs.help)}
                <button class="btn btn-outline-danger" type="button"
                    title="Clear Formula"
                    onClick={(e) => this.props.onSetFormulaRequest("")}>
                        <FontAwesomeIcon icon={faTrashAlt} />
                </button>
            </div>
        );
        return (
            <div class="form-group mt-2">
                <div class="form-group">
                    <label for="rollFormula">Formula</label>
                    <div>
                        {buttonTray("form-group btn-group d-sm-none")}
                    </div>
                    <div class="input-group">
                        {buttonTray("input-group-prepend d-none d-sm-inline-block")}
                        <input type="text" class="form-control"
                        id="rollFormula"
                            ref={this.formulaField}
                            onKeyUp={this.handleFormulaKeyUp}
                            onChange={(e) => this.props.onSetFormulaRequest(e.target.value)}
                            value={this.props.formula} />
                        <div class="input-group-append">
                            <button class="btn btn-primary" type="submit"
                                title="Roll"
                                disabled={!formulaIsRollable(this.props.formula)}
                                onClick={this.handleRollClick}><span className="sr-only">Roll</span>
                                    <FontAwesomeIcon icon={faDice} />
                            </button>
                        </div>
                    </div>
                </div>
                {Object.values(this.dialogs).map(dialog => this.state.openDialog === dialog ? (
                    <div>
                        {dialog.content}
                    </div>
                ) : null)}
            </div>
        );
    }

    setDialog = (value) => this.setState({
        openDialog: this.state.openDialog === value ? null : value
    });
    handleFormulaAddRequest = (value) =>
        this.props.onSetFormulaRequest(
            this.formulaField.current.value + value);
    handleHelpClick = () => this.setDialog(this.dialogs.help);
    handleRollRequest = (value) =>
        this.props.onRollRequest(value);
    handleRollClick = () => this.handleRollRequest();
    handleFormulaKeyUp = (event) => {
        if (event.keyCode === 13 && formulaIsRollable(this.props.formula)) {
            this.props.onRollRequest();
        }
    };
}
