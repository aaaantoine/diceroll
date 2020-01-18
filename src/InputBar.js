import React from 'react';

export default class InputBar extends React.Component {
    render() {
        const helpButtonClass = "btn btn-outline-secondary" +
            (this.props.helpIsVisible ? " active" : "");
        return (
            <div class="form-group">
                <label for="rollFormula">Formula</label>
                <div class="input-group">
                    <input type="text" class="form-control" id="rollFormula"
                        onKeyUp={this.handleFormulaKeyUp}
                        onChange={(e) => this.props.onSetFormulaRequest(e.target.value)}
                        value={this.props.formula} />
                    <div class="input-group-append">
                        <button class={helpButtonClass} type="button"
                            onClick={this.props.onHelpRequest}>Help</button>
                        <button class="btn btn-primary" type="submit"
                            onClick={this.props.onRollRequest}>Roll</button>
                    </div>
                </div>
            </div>
        );
    }

    handleFormulaKeyUp = (event) => {
        if (event.keyCode === 13) {
            this.props.onRollRequest();
        }
    };
}
