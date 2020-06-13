import React from 'react';

import TextInput from './RawInput/RawInput.js'

import inputEnums from '../../shared/enums';

const GeneralFormInput = (props) => {
    switch (props.inputType) {
        case inputEnums.TEXT:
        case inputEnums.EMAIL:
        case inputEnums.DATE:
        case inputEnums.TEL:
        case inputEnums.NUMBER:
            return <TextInput {...props} />

        case inputEnums.COLOR:
            return <TextInput {...props} defaultValue={'#ffffff'} />

        default:
            return <div>default</div>
    }
}

export default GeneralFormInput;