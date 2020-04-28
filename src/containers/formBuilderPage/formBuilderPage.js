import React from 'react';
import GeneralFormInput from '../../components/generalFormInput/generalFormInput'
import FormSeperator from '../../components/formSeperator/formSeperator'
import Spinner from '../../components/spinner/spinner'
import { Button, Alert } from 'react-bootstrap';
import FormInput from '../../classess/formInput'
import axios from 'axios';
import { BACKEND_URL } from '../../utils/settings'

class FormBuilderPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showCreateFormErrorAlert: false,
            createFormError: null,
            isCreatingForm: false,
            showDoneSubmittingAlertSuccess: false,
            ...this.getInitState()
        };

        this.clearForm.bind(this);
    }

    addFieldHandler() {
        let formInputs = this.state.formInputs.slice();
        formInputs.push(new FormInput(true, false));

        this.setState({
            ...this.state,
            formInputs: formInputs.slice()
        });
    }

    onClickFormInput(id) {
        let formInputs = this.state.formInputs;
        for (let i = 0; i < formInputs.length; i++) {
            formInputs[i].isChosen = formInputs[i].id === id ? true : false;
        }

        let formData = this.state.formData;
        formData.isChosen = false;

        this.setState({
            ...this.state,
            formInputs: formInputs,
            formData: formData
        });
    }

    onClickFormData() {
        let formInputs = this.state.formInputs;
        for (let i = 0; i < formInputs.length; i++) {
            formInputs[i].isChosen = false;
        }

        let formData = this.state.formData;
        formData.isChosen = true;

        this.setState({
            ...this.state,
            formInputs: formInputs,
            formData: formData,
        });
    }

    changeGeneralHandler(id, key, value) {
        let formInputs = this.state.formInputs;
        let formInput = formInputs.filter(formInput => formInput.id === id);

        formInput[0][key] = value;
        this.setState({
            ...this.state,
            formInputs: formInputs
        });
    }

    changeFormHandler(id, key, value) {
        let formData = this.state.formData;
        formData[key] = value;
        this.setState({
            ...this.state,
            formData: formData
        });
    }

    createFormHandler() {
        if (this.isFormLegal()) {
            this.createForm();
        } else {
            this.setState({
                ...this.state,
                showCreateFormErrorAlert: true,
            });
        }
    }

    createForm() {
        let _this = this;
        this.setState({
            ...this.state,
            isCreatingForm: true,
        });

        axios.post(`${BACKEND_URL}/form`, {
            "formName": _this.state.formData.inputValue,
            "formInputs": _this.state.formInputs.map(formInput => {
                return {
                    "label": formInput.label,
                    "inputName": formInput.inputName,
                    "inputType": formInput.inputType
                }
            })
        })
            .then(function (response) {
                _this.setState({
                    ..._this.state,
                    isCreatingForm: false,
                    showDoneSubmittingAlertSuccess: true,
                });
                _this.clearForm();
            })
            .catch(function (error) {
                _this.setState({
                    ..._this.state,
                    isCreatingForm: false,
                    showDoneSubmittingAlertFailure: true,
                    createFormError: error,
                });
            });
    }

    isFormLegal() {
        return this.isFormNameFilled() && this.areFormInputsFilled();
    }

    isFormNameFilled() {
        return this.state.formData.inputValue.length > 0;
    }

    areFormInputsFilled() {
        let areFilled = true;

        for (let i = 0; i < this.state.formInputs.length; i++) {
            if (this.isFormInputFilled(this.state.formInputs[i]) === false) {
                areFilled = false;
                break;
            }
        }

        return areFilled;
    }

    isFormInputFilled(formInput) {
        if (formInput.inputName.length === 0 || formInput.inputName.label === 0) {
            return false;
        }

        return true;
    }

    closeCreateFormAlertSuccess() {
        this.setState({
            ...this.state,
            showDoneSubmittingAlertSuccess: false,
        });
    }

    closeCreateFormErrorAlert() {
        this.setState({
            ...this.state,
            showCreateFormErrorAlert: false,
        });
    }

    closeCreateFormAlertFailure() {
        this.setState({
            ...this.state,
            showDoneSubmittingAlertFailure: false,
        });
    }

    clearForm() {
        this.setState({
            ...this.state,
            ...this.getInitState()
        })
    }

    getInitState() {
        return {
            formInputs: [new FormInput(true, false)],
            formData: new FormInput(false, true, 'Form Name'),
        }
    }

    render() {
        return (
            <React.Fragment>

                <GeneralFormInput
                    handleClick={this.onClickFormData.bind(this)}
                    formInput={this.state.formData}
                    changeUnedibleInput={this.changeFormHandler.bind(this)}
                    showChosen={true}
                ></GeneralFormInput>

                <FormSeperator></FormSeperator>

                {
                    this.state.formInputs.map(formInput => {
                        return (
                            <React.Fragment>
                                <GeneralFormInput
                                    handleClick={this.onClickFormInput.bind(this)}
                                    formInput={formInput}
                                    changeGeneralHandler={this.changeGeneralHandler.bind(this)}
                                    showChosen={true}
                                ></GeneralFormInput>
                                <FormSeperator></FormSeperator>
                            </React.Fragment>
                        )
                    })
                }

                <Button
                    variant="primary"
                    type="button"
                    onClick={this.addFieldHandler.bind(this)}
                    block
                >
                    Add Field
                        </Button>

                <Button
                    variant="success"
                    type="button"
                    onClick={this.createFormHandler.bind(this)}
                    block
                >
                    Create Form
                        </Button>

                {
                    this.state.isLoading || this.state.isCreatingForm ?
                        <Spinner></Spinner>
                        :
                        null
                }

                {
                    this.state.showCreateFormErrorAlert ?
                        <Alert variant="danger" onClose={() => this.closeCreateFormErrorAlert()} dismissible>
                            <Alert.Heading>Oh snap! You missed to fill one of the forms inputs or the form name!</Alert.Heading>
                        </Alert>
                        :
                        null
                }

                {
                    this.state.showDoneSubmittingAlertFailure ?
                        <Alert variant="danger" onClose={() => this.closeCreateFormAlertFailure()} dismissible>
                            <Alert.Heading>Oh snap! Error occured while creating the form</Alert.Heading>
                            <p>{this.state.createFormError ? this.state.createFormError.toString() : ''}</p>
                        </Alert>
                        :
                        null
                }

                {
                    this.state.showDoneSubmittingAlertSuccess ?
                        <Alert variant="success" onClose={() => this.closeCreateFormAlertSuccess()} dismissible>
                            <Alert.Heading>You have successfully created the form.</Alert.Heading>
                        </Alert>
                        :
                        null
                }


            </React.Fragment>
        )
    }

}

export default FormBuilderPage;