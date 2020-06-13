import React, { useState } from 'react';

import { Form, Button, Message } from 'semantic-ui-react'

import { v4 as uuidv4 } from 'uuid';

import { BACKEND_URL } from '../../utils/settings'
import { useMutation } from "react-query";

import GeneralFormInput from '../../components/GeneralFormInput/GeneralFormInput';
import inputEnums from '../../shared/enums';

const getFormNameInput = () => {
    return {
        _id: uuidv4(),
        inputType: inputEnums.FORM_NAME,
        value: 'Form Name',
        label: 'Form Name',
        inputName: 'formName',
        readOnly: true,
        isEdible: true,
    }
}

const createForm = async (payload) => {
    const response = await fetch(`${BACKEND_URL}/form`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            formName: payload.formName,
            formInputs: payload.formInputs
        })
    })
    const data = await response.json();
    return data;
}

const FormBuilder = () => {

    const [formInputs, setFormInputs] = useState([getFormNameInput()]);
    const [showFormNotValidMessage, setShowFormNotValidMessage] = useState(false);
    const [formErrorMessage, setFormErrorMessage] = useState('');
    const [hasCreateForm, setHasCreateForm] = useState(false);
    const [mutate] = useMutation(createForm, { onSuccess: () => setHasCreateForm(true) })

    const handleSubmit = async () => {
        if (formInputs.length == 1) {
            setFormErrorMessage('At least one input must be provided');
            setShowFormNotValidMessage(true);
        }
        else if(areAllInputNamesAreUnique() == false) {
            setFormErrorMessage('All the input name should be unique');
            setShowFormNotValidMessage(true);
        }
        else if (!areAllFieldsFilled()) {
            setFormErrorMessage('One of the fields are not filled.');
            setShowFormNotValidMessage(true);
        } else {
            await mutate({
                formName: formInputs[0].value,
                formInputs: formInputs.slice(1).map(formInput => {
                    return {
                        label: formInput.label,
                        inputName: formInput.inputName,
                        inputType: formInput.inputType
                    }
                })
            })

            setFormInputs([getFormNameInput()]);
        }
    }

    const areAllInputNamesAreUnique = () => {
        return new Set(formInputs.slice(1).map(formInput => formInput.inputName)).size == formInputs.length - 1;
    }

    const areAllFieldsFilled = () => {
        for (let i = 1; i < formInputs.length; i++) {
            if (!formInputs[i].label || !formInputs[i].inputName)
                return false;
        }

        return true;
    }

    const updateInput = (formInput, value) => {
        formInput.value = value;
        setFormInputs([...formInputs]);
    }

    const addFieldHandler = () => {
        setFormInputs(formInputs.concat({
            _id: uuidv4(),
            inputType: inputEnums.TEXT,
            value: '',
            label: 'Label',
            inputName: 'inputName',
            readOnly: true,
            isEdible: false,
        }));
    }

    const inputClickHandler = (chosenFormInput) => {
        formInputs.forEach((formInput) => {
            formInput.isEdible = false;
        });
        chosenFormInput.isEdible = true;
        setFormInputs([...formInputs]);
    }

    const onChangeEdit = (formInput, name, value) => {
        formInput[name] = value;
        setFormInputs([...formInputs]);
        setShowFormNotValidMessage(false);
    }

    return (
        <Form>
            {
                formInputs.map((formInput) => {
                    return (
                        <Form.Group widths='equal' onClick={() => inputClickHandler(formInput)}>
                            <GeneralFormInput
                                key={formInput._id}
                                inputType={formInput.inputType}
                                value={formInput.value}
                                onChangeValue={(value) => updateInput(formInput, value)}
                                label={formInput.label}
                                inputName={formInput.inputName}
                                isEdible={formInput.isEdible}
                                readOnly={formInput.readOnly}
                                required={false}
                                onChangeEdit={(name, value) => onChangeEdit(formInput, name, value)}
                            />
                        </Form.Group>
                    )
                })
            }

            <Button
                fluid
                color='olive'
                style={{ marginBottom: '2vh' }}
                onClick={addFieldHandler}
            >
                Add Field
            </Button>

            <Button
                fluid
                color='green'
                style={{ marginBottom: '2vh' }}
                onClick={handleSubmit}
            >
                Submit
            </Button>

            {
                showFormNotValidMessage &&
                <Message negative>
                    <Message.Header>{formErrorMessage}</Message.Header>
                </Message>
            }

            {
                hasCreateForm &&
                <Message positive>
                    <Message.Header>Form {formInputs[0].value} has been created</Message.Header>
                </Message>
            }
        </Form>
    )
}

export default FormBuilder;