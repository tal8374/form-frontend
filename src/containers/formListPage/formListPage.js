import React from 'react';
import { Table } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import Spinner from '../../components/spinner/spinner'
import axios from 'axios';
import { BACKEND_URL } from '../../utils/settings'

class FormListPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            error: null,
            formList: [],
        }
    }

    componentDidMount() {
        let _this = this;

        axios.get(`${BACKEND_URL}/form`)
            .then(function (response) {
                _this.setState({
                    ..._this.state,
                    isLoading: false,
                    formList: _this.getFormList(response.data),
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

    getFormList(forms) {
        return forms.map(form => {
            return {
                id: form._id,
                formName: form.formName,
                numberOfSubmissions: form.formSubmissions.length,
                submitPage: `/form-submit/${form._id}`,
                submissionsPage: `/submission-page/${form._id}`,
            }
        });
    }

    render() {
        return (
            <React.Fragment>
                {
                    this.state.isLoading ? 
                    <Spinner></Spinner>
                    :
                    null
                }

                <Table className="centerText" striped bordered hover>
                    <thead>
                        <tr>
                            <th>Form Id</th>
                            <th>Form Name</th>
                            <th># Submissions</th>
                            <th>Submit Page</th>
                            <th>Submissions Page</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.formList.map(form => {
                                return (
                                    <tr>
                                        <td>{form.id}</td>
                                        <td>{form.formName}</td>
                                        <td>{form.numberOfSubmissions}</td>
                                        <td><NavLink to={form.submitPage}>View</NavLink></td>
                                        <td><NavLink to={form.submissionsPage}>View</NavLink></td>
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

export default FormListPage;