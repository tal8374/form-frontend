import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import inputTypes from '../../utils/consts/inputTypes'
import RawInputFormUnEdible from '../../components/rawInputFormUnEdible/RawInputFormUnEdible'
import './generalFormInput.css'

class GeneralFormInput extends React.Component {

    onFormClick() {
        this.props.handleClick(this.props.formInput.id);
    }

    payloadRawInputChangeHander(inputName, inputValue) {
        let formInput = this.props.formInput;
        formInput[inputName] = inputValue;
        this.props.payloadChangeHandler(this.props.formInput.id, formInput);
    }

    changeGeneralHandler(event) {
        this.props.changeGeneralHandler(this.props.formInput.id, event.target.name, event.target.value);
    }

    changeUnedibleInput(event) {
        this.props.changeUnedibleInput(this.props.formInput.id, event.target.name, event.target.value);
    }

    getInputTypes() {
        return [inputTypes.TEXT, inputTypes.COLOR, inputTypes.DATE, inputTypes.EMAIL, inputTypes.TEL, inputTypes.NUMBER];
    }

    getUnedibleInput() {
        switch (this.props.formInput.inputType) {
            case inputTypes.TEXT:
            case inputTypes.DATE:
            case inputTypes.EMAIL:
            case inputTypes.TEL:
            case inputTypes.COLOR:
            case inputTypes.NUMBER:
                return (
                    <RawInputFormUnEdible
                        inputType={this.props.formInput.inputType}
                        inputPlaceholder={this.props.formInput.inputPlaceholder}
                        label={this.props.formInput.label}
                        name={'inputValue'}
                        onChange={this.changeUnedibleInput.bind(this)}
                        inputValue={this.props.formInput.inputValue}
                        disabled={this.props.formInput.isEdible === true}
                    ></RawInputFormUnEdible>
                )

            default:
                return null
        }
    }

    getContainerClasses() {
        let containerClasses = ['generalFormInput'];
        if (this.props.showChosen && this.props.formInput.isChosen)
            containerClasses.push('generalFormInputChosen');
        if (!this.props.formInput.isValid())
            containerClasses.push('generalFormInputInvalid');
        return containerClasses.join(' ');
    }

    render() {
        return (
            <div onClick={this.onFormClick.bind(this)} className={this.getContainerClasses()}>
                {
                    this.props.formInput.isEdible === true && this.props.formInput.isChosen ?
                        (
                            <React.Fragment>
                                <Form as={Row} key={this.props.formInput.id}>
                                    <Col sm={4}>
                                        <Form.Control
                                            type='text'
                                            placeholder='Enter label name'
                                            name='label'
                                            onChange={this.changeGeneralHandler.bind(this)}
                                            value={this.props.formInput.label}
                                        />
                                    </Col>

                                    <Col sm={4}>
                                        <Form.Control
                                            type='text'
                                            placeholder='Enter input name'
                                            name='inputName'
                                            onChange={this.changeGeneralHandler.bind(this)}
                                            value={this.props.formInput.inputName}
                                        />
                                    </Col>

                                    <Col sm={4}>
                                        <Form.Control
                                            as='select'
                                            name='inputType'
                                            value={this.props.formInput.inputType}
                                            onChange={this.changeGeneralHandler.bind(this)}
                                        >
                                            {this.getInputTypes().map(type => { return <option>{type}</option> })}
                                        </Form.Control>
                                    </Col>
                                </Form>
                            </React.Fragment>
                        )
                        :
                        this.getUnedibleInput()
                }
            </div>
        )
    }
}

export default GeneralFormInput;