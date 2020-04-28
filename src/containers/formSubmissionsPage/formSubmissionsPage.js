import React from 'react';
import { Table } from 'react-bootstrap';
import Spinner from '../../components/spinner/spinner'
import axios from 'axios';
import { BACKEND_URL } from '../../utils/settings'

class FormSubmissionsPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            inputValues: [],
            inputNames: [],
            formName: '',
            isLoading: false,
        }
    }

    componentDidMount() {
        let _this = this;
        axios.get(`${BACKEND_URL}/form/${this.props.match.params.formId}`)
            .then(function (response) {
                _this.setState({
                    ..._this.state,
                    isLoading: false,
                    formName: response.data.formName,
                    inputValues: _this.getAnswers(response.data.formSubmissions),
                    inputNames: _this.getInputNames(response.data.formInputs)
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

    getAnswers(formSubmissions) {
        let answers = [];
        for (let i = 0; i < formSubmissions.length; i++) {
            answers.push(formSubmissions[i].map(answer => answer.inputValue));
        }
        return answers;
    }

    getInputNames(formSubmissions) {
        return formSubmissions.map(formSubmission => formSubmission.label);
    }

    render() {
        return (
            <React.Fragment>
                <h2 className='header'>Submissions {!this.state.formName ? '' : ` Of ${this.state.formName}`}</h2>

                {
                    this.state.isLoading ?
                        <Spinner></Spinner>
                        :
                        null
                }

                <Table className="centerText" striped bordered hover>
                    <thead>
                        <tr>
                            {this.state.inputNames.map(inputName => {
                                return (<th>{inputName}</th>)
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.inputValues.map(inputValue => {
                                return (
                                    <tr>
                                        {inputValue.map(value => {
                                            return (<td>{value}</td>)
                                        })}

                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
            </React.Fragment>
        )
    }

}

export default FormSubmissionsPage;