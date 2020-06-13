import React, {useEffect} from 'react';

import { NavLink } from 'react-router-dom';

import { BACKEND_URL } from '../../utils/settings'

import { Label, Table, Message, Loader } from 'semantic-ui-react'
import { useQuery } from "react-query";

const fetchForms = async () => {
    const response = await fetch(`${BACKEND_URL}/form`);
    const data = await response.json();
    return data;
}

const FormList = () => {

    const { data, error, isFetching, refetch } = useQuery('fetchForms', fetchForms, { manual: true });

    useEffect(() => {
        refetch();
    }, []);

    return (
        <React.Fragment>
            {
                error && <Message negative>
                    <pre>{JSON.stringify(error)}</pre>
                </Message>
            }

            {isFetching && <Loader active inline='centered' />}

            {
                !isFetching &&
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Form Id</Table.HeaderCell>
                            <Table.HeaderCell>Form Name</Table.HeaderCell>
                            <Table.HeaderCell># Submissions</Table.HeaderCell>
                            <Table.HeaderCell>Submit Page</Table.HeaderCell>
                            <Table.HeaderCell>Submissions Page</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {
                            data && data.map(form => {
                                return (
                                    <Table.Row key={form._id}>
                                        <Table.Cell>
                                            <Label ribbon>{form._id}</Label>
                                        </Table.Cell>
                                        <Table.Cell>{form.formName}</Table.Cell>
                                        <Table.Cell>{form.formSubmissions.length}</Table.Cell>
                                        <Table.Cell><NavLink to={`/form-submit/${form._id}`}>View</NavLink></Table.Cell>
                                        <Table.Cell><NavLink to={`/submission-page/${form._id}`}>View</NavLink></Table.Cell>
                                    </Table.Row>
                                )
                            })
                        }
                    </Table.Body>
                </Table>
            }
        </React.Fragment>
    )
}

export default FormList;