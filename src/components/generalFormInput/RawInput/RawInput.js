import React, { useEffect } from 'react'

import { Form, Input } from 'semantic-ui-react'

const TextInput = (props) => {

    useEffect(() => {
        if (props.defaultValue != null)
            props.onChangeValue(props.defaultValue)
    }, []);

    return (
        <Form.Field
            required
            type={props.inputType}
            control={Input}
            label={props.label}
            name={props.inputName}
            value={props.value || props.defaultValue || ''}
            onChange={(event) => props.onChangeValue(event.target.value)}
            readOnly={props.readOnly}
        />
    )
}

export default TextInput;