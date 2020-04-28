import { v4 as uuidv4 } from 'uuid';
import inputTypes from '../utils/consts/inputTypes'

export default class FormInput {

    constructor(isEdible, isChosen, label, inputName, inputType, inputValue, id) {
        this.id = !id ? uuidv4() : id;

        this.label = !label ? 'Label' : label;
        this.inputName = !inputName ? '' : inputName;
        this.inputType = !inputType ? inputTypes.TEXT : inputType;
        this.inputValue = !inputValue ? this.getDefaultValue(this.inputType) : inputValue;

        this.isChosen = isChosen;
        this.isEdible = isEdible;
    }

    isValid() {
        if (this.isEdible) {
            switch (this.inputType) {
                case inputTypes.TEXT:
                case inputTypes.COLOR:
                case inputTypes.DATE:
                case inputTypes.EMAIL:
                case inputTypes.TEL:
                case inputTypes.NUMBER:
                    return !!this.inputName && !!this.label

                default:
                    break;
            }
        } else {
            if (!this.inputValue)
                return false;
            let re;

            switch (this.inputType) {
                case inputTypes.TEXT:
                    return this.inputValue.length > 0;
                case inputTypes.DATE:
                    return Date.parse(this.inputValue);
                case inputTypes.EMAIL:
                    re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    return re.test(this.inputValue);
                case inputTypes.TEL:
                    re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
                    return re.test(this.inputValue);
                case inputTypes.COLOR:
                case inputTypes.NUMBER:
                    return true;

                default:
                    return false;
            }
        }
    }

    getDefaultValue(inputType) {
        switch (inputType) {
            case inputTypes.NUMBER:
            case inputTypes.TEL:
            case inputTypes.TEXT:
            case inputTypes.EMAIL:
                return '';
            case inputTypes.DATE:
                return null;
            case inputTypes.COLOR:
                return '#ffffff'

            default:
                return null;
        }
    }

}