import React from 'react';
import { Form } from 'react-bootstrap';

class RawInputFormUnEdible extends React.Component {

    changeFormHandler(event) {
        this.props.onChange(event);
    }

    render() {
        return (
            <Form key={this.props.id}>
                <Form.Group>
                    <Form.Label>{this.props.label}</Form.Label>
                    <Form.Control
                        type={this.props.inputType}
                        placeholder={this.props.inputPlaceholder}
                        name='inputValue'
                        onChange={this.changeFormHandler.bind(this)}
                        value={this.props.inputValue}
                        disabled={this.props.disabled}
                    />
                </Form.Group>
            </Form>
        )
    }
}

export default RawInputFormUnEdible;