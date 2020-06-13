import React from 'react';

import RawInput from './RawInput/RawInput.js'

import inputEnums from '../../shared/enums';

const GeneralFormInput = (props) => {
    switch (props.inputType) {
        case inputEnums.TEXT:
        case inputEnums.EMAIL:
        case inputEnums.DATE:
        case inputEnums.TEL:
        case inputEnums.NUMBER:
            return <RawInput {...props} />

        case inputEnums.COLOR:
            return <RawInput {...props} defaultValue={'#ffffff'} />

        default:
            return <div>default</div>
    }
}

export default GeneralFormInput;