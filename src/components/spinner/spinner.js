import React from 'react';
import { Spinner } from 'react-bootstrap';
import './spinner.css'

class SpinnerGeneral extends React.Component {

    render() {
        return (
            <Spinner className="spinner" animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>
        )
    }

}

export default SpinnerGeneral;