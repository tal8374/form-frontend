import React, { useState, useEffect } from 'react'

import { useQuery, useMutation } from "react-query";

import { BACKEND_URL } from '../../utils/settings'

import { Message, Loader, Form, Header, Button } from 'semantic-ui-react'

import GeneralFormInput from '../../components/GeneralFormInput/GeneralFormInput';

const fetchForm = async (formId) => {
    const response = await fetch(`${BACKEND_URL}/form/${formId}`);
    const data = await response.json();
    return data;
}

const submithForm = async (payload) => {
    const response = await fetch(`${BACKEND_URL}/form/${payload.formId}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload.formBody)
    })
    const data = await response.json();
    return data;
}

const FormSubmit = (props) => {

    const { data, error, isFetching, refetch } = useQuery(props.match.params.formId, fetchForm, { manual: true });
    const [mutate] = useMutation(submithForm, { onSuccess: () => setHasSubmitted(true) })
    const [formValues, setFormValues] = useState({});
    const [hasSubmitted, setHasSubmitted] = useState(false);

    useEffect(() => {
        refetch();
    }, []);

    const handleSubmit = async () => {
        await mutate({
            formId: props.match.params.formId,
            formBody: data.formInputs.map(formInput => {
                return {
                    inputName: formInput.inputName,
                    inputValue: formValues[formInput.inputName],
                    inputType: formInput.inputType
                }
            })
        })

        setFormValues({});
    }

    return (
        <React.Fragment>
            {
                data && hasSubmitted &&
                <Message positive>
                    <Message.Header>You have successfully submitted the form {data.formName}</Message.Header>
                </Message>
            }

            {
                error && <Message negative>
                    <pre>{JSON.stringify(error)}</pre>
                </Message>
            }

            {isFetching && <Loader active inline='centered' />}

            {!hasSubmitted && data &&
                <React.Fragment>
                    <Header as='h1'>Submit Form - {data.formName}</Header>

                    <Form onSubmit={handleSubmit}>
                        {
                            data.formInputs.map(formInput => {
                                return (
                                    <Form.Group widths='equal'>
                                        <GeneralFormInput
                                            inputType={formInput.inputType}
                                            value={formValues[formInput.inputName]}
                                            onChangeValue={(value) => setFormValues({ ...formValues, [formInput.inputName]: value })}
                                            label={formInput.label}
                                            inputName={formInput.inputName}
                                            readOnly={false}
                                        />
                                    </Form.Group>
                                )
                            })
                        }

                        <Button
                            fluid
                            color='green'
                            style={{ marginBottom: '2vh' }}
                        >Submit</Button>
                    </Form>
                </React.Fragment>
            }

        </React.Fragment>
    )
}

export default FormSubmit;