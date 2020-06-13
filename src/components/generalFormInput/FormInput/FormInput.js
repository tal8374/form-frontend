import React, { useEffect } from 'react'

import { Form, Input } from 'semantic-ui-react'

import inputEnums from '../../../shared/enums';

const FormInput = (props) => {

    useEffect(() => {
        if (props.defaultValue != null)
            props.onChangeValue(props.defaultValue)
    }, []);

    const getValue = () => {
        return props.value || props.defaultValue || '';
    }

    return (
        <Form.Field
            required={props.required}
            type={inputEnums.TEXT}
            control={Input}
            label={props.label}
            name={props.inputName}
            value={getValue()}
            onChange={(event) => props.onChangeValue(event.target.value)}
            readOnly={false}
        />
    )
}

export default FormInput;