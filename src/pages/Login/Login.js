import React, { useState } from 'react'

import { Button, Form, Grid, Segment, Message } from 'semantic-ui-react'

import { useMutation } from "react-query";

import { BACKEND_URL } from '../../utils/settings'

import { useAuthDispatch } from '../../shared/AuthContext'

import { localStorage } from '../../shared/functions'

const login = async (payload) => {
    const response = await fetch(`${BACKEND_URL}/user/login`, {
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
        throw 'User name or password is not correct.';
}

const Login = () => {

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [isLogginin, setIsLogginin] = useState(false);
    const [mutate, { error }] = useMutation(login)
    const dispatch = useAuthDispatch()

    const submitHandler = async (event) => {
        event.preventDefault();
        await mutate({ userName, password });
        if (!error) {
            dispatch({ type: 'login', userName: userName });
            localStorage.set('user', { userName: userName });
        }
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
                            loading={isLogginin}
                        >
                            Login
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

export default Login;