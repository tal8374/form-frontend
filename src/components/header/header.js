import React from 'react';
import { NavLink, withRouter  } from 'react-router-dom';
import PropTypes from 'prop-types';
import './header.css'

class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            options: [
                {
                    name: 'formList',
                    text: 'Form List',
                    url: '',
                    path: '/form-list',
                    isChosen: window.location.pathname === '/form-list' ? true : false
                },
                {
                    name: 'createForm',
                    text: 'Create Form',
                    url: '',
                    path: '/form-build',
                    isChosen: window.location.pathname === '/form-build' ? true : false
                }
            ]
        }
    }

    moveTo() {
        this.setState({
            ...this.state,
        });
    }

    render() {
        const pathname = this.props.location.pathname
        return (
            <div className="navbar-container">
                <ul>
                    {
                        this.state.options.map(option => {
                            let className = ['nav-link'];
                            if (option.path === pathname)
                                className.push('active-link');
                            return (
                                <li className={className.join(' ')}>
                                    <a ><NavLink to={option.path}>{option.text}</NavLink></a>
                                    <div className="underline"></div>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }

}

Header.contextTypes = {
    router: PropTypes.object
};

export default withRouter(Header);