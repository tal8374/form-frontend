import React, { useState, useEffect } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Menu, Dropdown, Container } from 'semantic-ui-react'
import PropTypes from 'prop-types';
import { useAuthState, useAuthDispatch } from '../../shared/AuthContext'

import { useQuery } from "react-query";
import { BACKEND_URL } from '../../utils/settings'
import { localStorage } from '../../shared/functions'

const fetchUserFromCookie = async () => {
    const response = await fetch(`${BACKEND_URL}/user/isLoggedIn`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
    const data = await response.json();
    return data;

}

const Header = (props) => {
    const state = useAuthState();
    const dispatch = useAuthDispatch();
    const { data, refetch } = useQuery('fetchUserFromCookie', fetchUserFromCookie, { manual: true });

    useEffect(() => {
        let user = localStorage.get('user');
        if (user != null)
            dispatch({ type: 'login', userName: user.userName });
        refetch();
    }, []);

    useEffect(() => {
        if (data && data.userName)
            dispatch({ type: 'login', userName: data.userName });
    }, [data]);

    return (
        <Menu
            pointing
            secondary
            size='large'
        >
            <Container>
                {
                    state.isLoggedIn && <Menu.Item
                        name='Form List'
                        active={props.location.pathname === '/form-list'}
                        as={NavLink} exact to="/form-list"
                    />
                }
                {
                    state.isLoggedIn && <Menu.Item
                        name='Create Form'
                        active={props.location.pathname === '/form-build'}
                        as={NavLink} exact to="/form-build"
                    />
                }


                <Menu.Item position='right' style={{ padding: '0', margin: '0', fontWeight: '0' }}>
                    {
                        !state.isLoggedIn && <Menu.Item
                            name='Register'
                            active={props.location.pathname === '/register'}
                            as={NavLink} exact to="/register"
                        />
                    }
                    {
                        !state.isLoggedIn && <Menu.Item
                            name='Login'
                            active={props.location.pathname === '/login'}
                            as={NavLink} exact to="/login"
                        />
                    }
                </Menu.Item>

                {
                    state.isLoggedIn && <Dropdown text={`Hello ${state.userName || ''}`} pointing className='link item'>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => dispatch({ type: 'logout' })}>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                }

            </Container>
        </Menu>
    )
}

Header.contextTypes = {
    router: PropTypes.object
};

export default withRouter(Header);