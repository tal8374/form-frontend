import React, { useState } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Menu } from 'semantic-ui-react'
import PropTypes from 'prop-types';

const Header = (props) => {

    const [activeItem, setActiveItem] = useState(props.location.pathname);

    return (
        <div className="container" style={{ width: '40%' }}>
            <Menu pointing widths={2} secondary size='huge'>
                <Menu.Item
                    name='Form List'
                    active={activeItem === '/form-list'}
                    onClick={() => setActiveItem('/form-list')}
                    as={NavLink} exact to="/form-list"
                />
                <Menu.Item
                    name='Create Form'
                    active={activeItem === '/form-build'}
                    onClick={() => setActiveItem('/form-build')}
                    as={NavLink} exact to="/form-build"
                />
            </Menu>
        </div>
    )
}

Header.contextTypes = {
    router: PropTypes.object
};

export default withRouter(Header);