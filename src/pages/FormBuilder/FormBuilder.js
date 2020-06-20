import React, { useState } from "react";

import { Form, Button, Message } from 'semantic-ui-react'
import { v4 as uuidv4 } from 'uuid';
import { useMutation } from "react-query";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { BACKEND_URL } from '../../utils/settings'
import GeneralFormInput from '../../components/GeneralFormInput/GeneralFormInput';
import inputEnums from '../../shared/enums';

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const getFormNameInput = () => {
    return {
        _id: uuidv4(),
        inputType: inputEnums.TEXT,
        value: 'Form Name',
        label: 'Form Name',
        inputName: 'formName',
        readOnly: false,
        isEdible: false,
    }
}

const createForm = async (payload) => {
    const response = await fetch(`${BACKEND_URL}/form`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            formName: payload.formName,
            formInputs: payload.formInputs
        })
    })
    const data = await response.json();
    return data;
}

function FormBuilder() {
    const [formInputs, setFormInputs] = useState([getFormNameInput()]);
    const [showFormNotValidMessage, setShowFormNotValidMessage] = useState(false);
    const [formErrorMessage, setFormErrorMessage] = useState('');
    const [hasCreateForm, setHasCreateForm] = useState(false);
    const [mutate] = useMutation(createForm, { onSuccess: () => setHasCreateForm(true) })

    console.log(formInputs)

    const handleSubmit = async () => {
        if (formInputs.length === 1) {
            setFormErrorMessage('At least one input must be provided');
            setShowFormNotValidMessage(true);
        }
        else if (areAllInputNamesAreUnique() === false) {
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
        return new Set(formInputs.slice(1).map(formInput => formInput.inputName)).size === formInputs.length - 1;
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
        if (chosenFormInput.inputName != 'formName')
            chosenFormInput.isEdible = true;
        setFormInputs([...formInputs]);
    }

    const onChangeEdit = (formInput, name, value) => {
        formInput[name] = value;
        setFormInputs([...formInputs]);
        setShowFormNotValidMessage(false);
    }

    function onDragEnd(result) {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }
        const sInd = +source.droppableId;
        const dInd = +destination.droppableId;

        if (sInd === dInd) {
            let sourceIndex = source.index + 1;
            let destinationIndex = destination.index + 1;
            [formInputs[sourceIndex], formInputs[destinationIndex]] = [formInputs[destinationIndex], formInputs[sourceIndex]];
            setFormInputs([...formInputs]);
        } else {
            const result = move(formInputs[sInd], formInputs[dInd], source, destination);
            const newState = [...formInputs];
            newState[sInd] = result[sInd];
            newState[dInd] = result[dInd];

            setFormInputs(newState.filter(group => group.length));
        }
    }

    function getFormComponent(formInput) {
        return <Form.Group style={{
            width: '100%',
            padding: '20px',
            boxShadow: '2px 5px 4px #888888',
        }} widths='equal' >
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
    }

    return (
        <Form>
            <div style={{ display: "flex" }}>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId={'1'}>
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                style={{ width: '100%' }}
                                {...provided.droppableProps}
                            >

                                {
                                    getFormComponent(formInputs[0])
                                }

                                {formInputs.slice(1).map((formInput, index) => (
                                    <Draggable
                                        key={formInput._id}
                                        draggableId={formInput._id}
                                        index={index}
                                    >
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <div
                                                    onClick={() => inputClickHandler(formInput)}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-around",
                                                        cursor: 'pointer',
                                                    }}
                                                >

                                                    {
                                                        getFormComponent(formInput)
                                                    }
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>

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
    );
}

export default FormBuilder;