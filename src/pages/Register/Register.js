import React, { useState } from 'react'

import { Button, Form, Grid, Segment, Message } from 'semantic-ui-react'
import { useMutation } from "react-query";

import { BACKEND_URL } from '../../utils/settings'

const createUser = async (payload) => {
    const response = await fetch(`${BACKEND_URL}/user/createUser`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            userName: payload.userName,
            password: payload.password
        })
    })
    if (response.status === 409)
        throw 'User is already exists.';
}

const Register = (props) => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [mutate, { error }] = useMutation(createUser)
    const [isCreatingUser, setIsCreatingUser] = useState(false);

    const submitHandler = async (event) => {
        event.preventDefault();
        setIsCreatingUser(true);
        await mutate({ userName, password });
        setIsCreatingUser(false);
        if (error == null)
            props.history.push('/login')
    }

    return (
        <Grid textAlign='center' verticalAlign='middle'>
            <Grid.Column style={{ maxWidth: 450 }}>
                <Form onSubmit={submitHandler} size='large'>
                    <Segment stacked>
                        <Form.Input
                            fluid
                            icon='user'
                            iconPosition='left'
                            placeholder='User Name'
                            required
                            onChange={(event) => setUserName(event.target.value)}
                        />
                        <Form.Input
                            fluid
                            icon='lock'
                            iconPosition='left'
                            placeholder='Password'
                            type='password'
                            required
                            onChange={(event) => setPassword(event.target.value)}
                        />

                        <Button
                            type="submit"
                            color='teal'
                            fluid
                            size='large'
                            loading={isCreatingUser}
                        >
                            Register
                        </Button>

                        {
                            error && <Message negative>
                                <p>{error}</p>
                            </Message>
                        }
                    </Segment>
                </Form>
            </Grid.Column>
        </Grid>
    )
}

export default Register;