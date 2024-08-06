/* Responsible for creating, or showing an existing, single note or list using a bootstrap modal */
import React, { useEffect, useState, useRef} from 'react';
import { Modal, CloseButton } from 'react-bootstrap';
import { IoCloseCircle, IoAdd } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";

function NoteCard({ showModal, isNew, noteId, title, 
                    noteType, list, setList, message, createNote, 
                    updateNote, handleDeleteTask, 
                    handleDeleteNote, handleClose, refresh }) {

    const [textAreaHeight, setTextAreaHeight] = useState('auto');
    const [selectedTask, setSelectedTask] = useState(null);
    const [hoveredTask, setHoveredTask] = useState(null);
    const [oldList, setOldList] = useState(list);
    const [newTaskCounter, setNewTaskCounter] = useState(0);
    const [newTaskActive, setNewTaskActive] = useState(null);
    const [newTaskTextarea, setNewTaskTextarea] = useState(null);
    const [newTaskCreated, setNewTaskCreated] = useState(false);

    // Resize Title text area height when modal is activated
    useEffect(() => {
        if (showModal) {
            resizeTextAreaInput('modalTitleTextArea');
            setOldList(list);
        } else {
            setNewTaskCounter(0);
        }
    }, [showModal]);

    useEffect(() => {
        if (newTaskCreated) {
            // Switch focus to the new task that was just created
            focusOnLastTaskCreated();
            setNewTaskCreated(false);
        }
    }, [list]);

    const [newTaskTypeStatus, setNewTaskTypeStatus] = useState(false);
    useEffect(() => {
        clearNewTaskTextarea();
        setNewTaskTypeStatus(false);
    }, [newTaskTypeStatus]);

    const addNewTaskToList = (key) => {
        if (key){
            setNewTaskTypeStatus(true);
            let newTask = [`newTask${newTaskCounter}`, key, false];
            setList([...list, newTask]);
            clearNewTaskTextarea();
        }
    };

    const clearNewTaskTextarea = () => {
        if (document.getElementById('modalNewTaskTextarea')){
            document.getElementById('modalNewTaskTextarea').value = '';
        }
    };


    const focusOnLastTaskCreated = () => {
        try {
            const newTaskId = "modal-newTask" + newTaskCounter;
            const newTaskElement = document.getElementById(newTaskId);
    
            newTaskElement.focus();
            newTaskElement.select();
        } catch (e) {
            console.log('Something went wrong switching focus to the new task:', e)
        };

        setNewTaskCounter(newTaskCounter+1);
    };

    const handleNewTask = (event) => {
        if(event.key.length != 1 || event.altKey || event.ctrlKey || event.metaKey) return;

        // Create a new task and add it to the list
        addNewTaskToList(event.key);

        // Change focus to the new task that was just created
        setNewTaskCreated(true);
    };

    // Show button to delete task
    const handleTaskHover = (task_id) => {
        setHoveredTask(task_id);
    };

    // Hide button to delete task
    const handleTaskLeave = () => {
        setHoveredTask(null);
    };

    // Show button to delete task
    const handleTaskFocus = (task_id) => {
        setSelectedTask(task_id);
        if (task_id === -1) {
            setNewTaskActive(true);
        }
    };

    // Hide button to delete task
    const handleTaskBlur = () => {
        if (selectedTask === -1) {
            setNewTaskActive(false);
        }
        setSelectedTask(null);
    };
    
    // Delete task before adding it to the database
    const handleDeleteNewTask = () => {

    };

    const resizeTextAreaInput = (id) => {
        const textArea = document.getElementById(id);
        textArea.style.height = 'auto';
        textArea.style.height = `${textArea.scrollHeight}px`;
        setTextAreaHeight(`${textArea.scrollHeight}px`);
    };

    // Update the task messages in the list one by one
    const updateList = () => {
        for (let i = 0; i < list.length; i++) {
            try {
                const taskId = "modal-" + list[i][0];
                const taskValue = document.getElementById(taskId).value;
                list[i][1] = taskValue;
                const taskCheckId = list[i][0];
                const taskCheckValue = document.getElementById(taskCheckId).checked? 1 : 0;
                console.log(taskCheckValue);
                list[i][2] = taskCheckValue;
            } catch (e) {
                console.log('Error getting value from task:', e)
            };
        }
    };

    const saveHelper = () => {

        // Get title and note content
        let newTitle = document.getElementById('modalTitleTextArea').value;
        let noteContent = null;
        switch (noteType) {
            case 0: // Save note
                noteContent = document.getElementById('modalNoteTextArea').value;
                break;
            case 1: // Save list
                updateList();
                noteContent = list;
                break;
        }

        let saveSucceeded = (isNew? 
            createNote(newTitle, noteContent):
            updateNote(noteId, noteType, newTitle, noteContent))
        saveSucceeded? 
            handleClose() :
            console.log('Error saving note'); // TODO: Do something if save fails
    }

    return (
        <Modal show={showModal} onHide={handleClose} className='note-modal '>
            <button type='button' className='btn position-absolute top-0 end-0' id='close-button' onClick={handleClose}>
                <IoCloseCircle color='#0d6efd' size='2.5em' />
            </button>
            <Modal.Header className='border-0 pb-0 me-4'>
                <textarea
                    className='title bg-transparent overflow-auto mx-2 border-0 rounded fs-3 w-100'
                    id='modalTitleTextArea'
                    rows={1}
                    placeholder='Title'
                    defaultValue={title}
                    onInput={(event) => resizeTextAreaInput(event.target.id)}
                />
                {/* <button type="button" className="btn-close position-absolute top-0 end-0" aria-label="Close" onClick={handleClose}></button> */}
            </Modal.Header>
    
            <Modal.Body className='border-0 mx-2'>

                {/* Lists */}
                {list && 
                    <div className='todo-list w-100'>
                            <div className='input-group w-100' id='modalListTasks'>

                                {/* Existing tasks */}

                                {list.map(task => (
                                    <div
                                        key={task[0]}
                                        className="form-check d-flex flex-row"
                                        onMouseEnter={() => handleTaskHover(task[0])}
                                        onMouseLeave={handleTaskLeave}
                                        onFocus={() => handleTaskFocus(task[0])}
                                        onBlur={handleTaskBlur} >

                                        <input className="form-check-input" type="checkbox" id={task[0]} defaultChecked={task[2] === 1} />
                                        {/* <label className="form-check-label text-decoration-line-through" htmlFor={task[0]}>
                                            {task[1]}
                                        </label> */}
                                        <textarea 
                                            className='text-space w-100 border-0 ms-1 me-4 pe-3' 
                                            id={`modal-${task[0]}`}
                                            htmlFor={task[0]} 
                                            defaultValue={task[1]} 
                                            rows={1}
                                            onInput={(event) => resizeTextAreaInput(event.target.id)}/>
                                        {(hoveredTask === task[0] || selectedTask === task[0]) && (
                                            // <button type='button' className='btn taskDeleteBttn p-0 m-0' id='close-button' onClick={handleClose}><IoCloseCircle color='#0d6efd' size='1.5em' /></button>
                                            <CloseButton
                                                className='taskDeleteBttn'
                                                onClick={() => handleDeleteTask(task[0])}
                                            />
                                        )}
                                    </div>
                                ))}

                                {/* New task */}

                                <div 
                                    className='form-check w-100 d-flex flex-row m-0 p-0'
                                    onKeyDown={handleNewTask}
                                    onMouseEnter={() => handleTaskHover(-1)}
                                    onMouseLeave={handleTaskLeave}
                                    onFocus={() => handleTaskFocus(-1)}
                                    onBlur={handleTaskBlur} >
                                    {/* <input className='form-check-input' type='checkbox' id='newTaskCheckbox' /> */}


                                    <IoMdAdd className='plus-icon border-0' id='newTask' color='#4A5058' size='1em' />
                                    
                                    <textarea 
                                        id={'modalNewTaskTextarea'}
                                        className='text-space w-100 border-0 ms-1 me-4 pe-3' 
                                        htmlFor={'newTask'} 
                                        placeholder={'List item'}
                                        rows={1}
                                        onInput={(event) => resizeTextAreaInput(event.target.id)} />
                                        {/* {(hoveredTask === -1 || selectedTask === -1) && (
                                            // <button type='button' className='btn taskDeleteBttn p-0 m-0' id='close-button' onClick={handleClose}><IoCloseCircle color='#0d6efd' size='1.5em' /></button>
                                            <CloseButton
                                                className='taskDeleteBttn'
                                                onClick={handleDeleteNewTask}
                                            />
                                        )} */}
                                </div>

                            </div>
                    </div>
                }


                {/* Notes */}
                {message && 
                    <textarea 
                        id='modalNoteTextArea' 
                        className='text-space border border-0 rounded w-100' 
                        placeholder='Note'
                        // value={message}
                        defaultValue={message}
                        onInput={(event) => resizeTextAreaInput(event.target.id)} 
                        />
                }
                {/* <p className='text-danger'>Title cannot exceed 100 characters</p> */}
            </Modal.Body>
            
            {!isNew &&
                <Modal.Footer className='border-0 d-flex justify-content-between'>

                            <button type='button' className='btn btn-danger px-3' onClick={() => handleDeleteNote(noteId)}>Delete</button>

                            <div>
                                <button type="button" className="btn btn-secondary" onClick={handleClose}>Cancel</button>
                                <button type="button" className="btn btn-primary ms-2" style={{paddingLeft:'2rem', paddingRight:'2rem'}} onClick={saveHelper}>Save</button>
                            </div>

                </Modal.Footer>
            }

            {isNew && 
                <Modal.Footer className='border-0 d-flex justify-content-end'>
                    <div>
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>Cancel</button>
                        <button type="button" className="btn btn-primary ms-2" style={{paddingLeft:'2rem', paddingRight:'2rem'}} onClick={saveHelper}>Create</button>
                    </div>
                </Modal.Footer>
            }

        </Modal>
    );
}

export default NoteCard;