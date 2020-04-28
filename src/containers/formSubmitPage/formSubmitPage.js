import React from 'react';
import GeneralFormInput from '../../components/generalFormInput/generalFormInput'
import FormSeperator from '../../components/formSeperator/formSeperator'
import Spinner from '../../components/spinner/spinner'
import { Button, Alert } from 'react-bootstrap';
import FormInput from '../../classess/formInput'
import axios from 'axios';
import { BACKEND_URL } from '../../utils/settings'

class FormSubmitPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            formInputs: [],
            formName: '',
            showCreateFormErrorAlert: false,
            showDoneSubmittingAlertSuccess: false,
            showDoneSubmittingAlertFailure: false,
            isSubmitting: false,
            submitError: null,
        };
        this.clearForm.bind(this);
    }

    componentDidMount() {
        let _this = this;
        axios.get(`${BACKEND_URL}/form/${this.props.match.params.formId}`)
            .then(function (response) {
                _this.setState({
                    ..._this.state,
                    isLoading: false,
                    formName: response.data.formName,
                    formInputs: _this.getFormInputs(response.data.formInputs),
                });
            })
            .catch(function (error) {
                _this.setState({
                    ..._this.state,
                    isLoading: false,
                    error: error
                });
            })
    }

    getFormInputs(formInputs) {
        return formInputs.map(formInput => {
            return new FormInput(false, false, formInput.label, formInput.inputName, formInput.inputType, null, formInput._id);
        })
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

        this.setState({
            ...this.state,
            formInputs: formInputs,
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

    createFormHandler() {
        if (this.isFormLegal()) {
            this.submitForm();
        } else {
            this.setState({
                ...this.state,
                showCreateFormErrorAlert: true,
            });
        }
    }

    submitForm() {
        let _this = this;
        this.setState({
            ...this.state,
            isSubmitting: true,
        });

        axios.post(`${BACKEND_URL}/form/${this.props.match.params.formId}`, {
            "formSubmission": this.state.formInputs.map(formInput => {
                return {
                    "inputName": formInput.inputName,
                    "inputValue": formInput.inputValue,
                    "inputType": formInput.inputType
                }
            })
        })
            .then(function (response) {
                _this.clearForm();
                _this.setState({
                    ..._this.state,
                    isSubmitting: false,
                    showDoneSubmittingAlertSuccess: true,
                });
            })
            .catch(function (error) {
                _this.setState({
                    ..._this.state,
                    isSubmitting: false,
                    showDoneSubmittingAlertFailure: true,
                    submitError: error,
                });
            });
    }

    clearForm() {
        let formInputs = this.state.formInputs;
        for (let i = 0; i < formInputs.length; i++) {
            formInputs[i] = new FormInput(false, false, formInputs[i].label, formInputs[i].inputName, formInputs[i].inputType, null, formInputs[i].id);
        }
        this.setState({
            ...this.state,
            formInputs: formInputs,
        });
    }

    isFormLegal() {
        let areFilled = true;

        for (let i = 0; i < this.state.formInputs.length; i++) {
            if (this.state.formInputs[i].isValid() === false) {
                areFilled = false;
                break;
            }
        }

        return areFilled;
    }

    closeCreateFormCreateAlertSuccess() {
        this.setState({
            ...this.state,
            showDoneSubmittingAlertSuccess: false,
        });
    }

    closeCreateFormCreateAlertFailure() {
        this.setState({
            ...this.state,
            showDoneSubmittingAlertFailure: false,
        });
    }

    closeCreateFormErrorAlert() {
        this.setState({
            ...this.state,
            showCreateFormErrorAlert: false,
        });
    }

    render() {
        return (
            <React.Fragment>
                <h2 className='header'>Submit {!this.state.formName ? '' : ` Of ${this.state.formName}`}</h2>

                {
                    this.state.isLoading ?
                        <Spinner></Spinner>
                        :
                        null
                }

                {
                    this.state.formInputs.map(formInput => {
                        return (
                            <React.Fragment>
                                <GeneralFormInput
                                    handleClick={this.onClickFormInput.bind(this)}
                                    formInput={formInput}
                                    changeUnedibleInput={this.changeGeneralHandler.bind(this)}
                                    showChosen={true}
                                ></GeneralFormInput>
                                <FormSeperator></FormSeperator>
                            </React.Fragment>
                        )
                    })
                }

                <Button
                    variant="success"
                    type="button"
                    onClick={this.createFormHandler.bind(this)}
                    block
                >
                    Submit
                        </Button>

                {
                    this.state.showCreateFormErrorAlert ?
                        <Alert variant="danger" onClose={() => this.closeCreateFormErrorAlert()} dismissible>
                            <Alert.Heading>Oh snap! You missed to fill one of the forms inputs!</Alert.Heading>
                        </Alert>
                        :
                        null
                }

                {
                    this.state.showDoneSubmittingAlertFailure ?
                        <Alert variant="danger" onClose={() => this.closeCreateFormCreateAlertFailure()} dismissible>
                            <Alert.Heading>Oh snap! Got an error while submitting the form!</Alert.Heading>
                            <p>{this.state.submitError? this.state.submitError.toString() : ''}</p>
                        </Alert>
                        :
                        null
                }

                {
                    this.state.showDoneSubmittingAlertSuccess ?
                        <Alert variant="success" onClose={() => this.closeCreateFormCreateAlertSuccess()} dismissible>
                            <Alert.Heading>You have successfully submitted the form.</Alert.Heading>
                        </Alert>
                        :
                        null
                }

                {
                    this.state.isSubmitting ?
                        <Spinner></Spinner>
                        :
                        null
                }


            </React.Fragment>
        )
    }

}

export default FormSubmitPage;