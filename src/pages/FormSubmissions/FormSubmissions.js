import React from 'react';

import { useQuery } from "react-query";

import { BACKEND_URL } from '../../utils/settings'

import { Table, Loader, Header } from 'semantic-ui-react'

const fetchSubmissions = async (formId) => {
    const response = await fetch(`${BACKEND_URL}/form/${formId}`);
    const data = await response.json();
    return data;
}

const FormSubmissions = (props) => {

    const { data, error, isFetching, refetch } = useQuery(props.match.params.formId, fetchSubmissions);

    return (
        <React.Fragment>
            {isFetching && <Loader active inline='centered' />}

            {
                !isFetching && data &&
                <React.Fragment>
                    <Header as='h1'>Subbmisions of Form - {data.formName}</Header>

                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                {
                                    data.formInputs.map((formInput, i) => {
                                        return (
                                            <Table.HeaderCell key={i}>{formInput.label}</Table.HeaderCell>
                                        )
                                    })
                                }
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {
                                data && data.formSubmissions.filter(x => x.length > 1).map((submission, i) => {
                                    return (
                                        <Table.Row key={i}>
                                            {
                                                submission.map((submissionData, i) => {
                                                    return (
                                                        <Table.Cell key={i}>{submissionData ? submissionData.inputValue : ''}</Table.Cell>
                                                    )
                                                })
                                            }
                                        </Table.Row>
                                    )
                                })
                            }
                        </Table.Body>
                    </Table>
                </React.Fragment>
            }
        </React.Fragment>

    )
}

export default FormSubmissions;