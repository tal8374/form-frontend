import React, { useEffect } from 'react'

import { Form, Input } from 'semantic-ui-react'

import inputEnums from '../../../shared/enums';

const RawInput = (props) => {

    useEffect(() => {
        if (props.defaultValue != null)
            props.onChangeValue(props.defaultValue)
    }, []);

    const getValue = () => {
        return props.value || props.defaultValue || '';
    }

    if (props.isEdible == true) {
        return (
            <React.Fragment>
                <Form.Field
                    required={true}
                    type={inputEnums.TEXT}
                    control={Input}
                    label={'Field Label'}
                    name={'label'}
                    value={props.label}
                    onChange={(event) => props.onChangeEdit(event.target.name, event.target.value)}
                    readOnly={false}
                />
                <Form.Field
                    required={true}
                    type={inputEnums.TEXT}
                    control={Input}
                    label={'input name'}
                    name={'inputName'}
                    value={props.inputName}
                    onChange={(event) => props.onChangeEdit(event.target.name, event.target.value)}
                    readOnly={false}
                />
                <Form.Field
                    required={true}
                    label='Input Type'
                    control='select'
                    name={'inputType'}
                    onChange={(event) => props.onChangeEdit(event.target.name, event.target.value)}
                    value={props.inputType}
                >
                    {Object.values(inputEnums).map(inputEnum => { return <option value={inputEnum}>{inputEnum}</option> })}
                </Form.Field>
            </React.Fragment>
        );
    } else {
        return (
            <Form.Field
                required={props.required}
                type={props.inputType}
                control={Input}
                label={props.label}
                name={props.inputName}
                value={getValue()}
                onChange={(event) => props.onChangeValue(event.target.value)}
                readOnly={props.readOnly}
            />
        )
    }
}

export default RawInput;