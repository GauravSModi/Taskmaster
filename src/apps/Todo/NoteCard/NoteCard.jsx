/* Responsible for creating, or showing an existing, single note or list using a bootstrap modal */
import React, { useEffect, useState} from 'react';
import { Modal, CloseButton } from 'react-bootstrap';
import { IoCloseCircle } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import appendAlert from '../../../components/Alert/AlertComponent';

function NoteCard({ showNoteModal, isNew, Types, noteId, title, 
                    noteType, list, setList, message, createNew, 
                    updateNote, handleDeleteNote, handleClose }) {

    const [textAreaHeight, setTextAreaHeight] = useState('auto');
    const [selectedTask, setSelectedTask] = useState(null);
    const [hoveredTask, setHoveredTask] = useState(null);
    const [deleteList, setDeleteList] = useState([]);
    const [newTaskCounter, setNewTaskCounter] = useState(0);
    const [newTaskActive, setNewTaskActive] = useState(null);
    const [newTaskCreated, setNewTaskCreated] = useState(false);

    // Resize Title text area height when modal is activated
    useEffect(() => {
        if (showNoteModal) {
            resizeTextAreaInput('modalTitleTextArea');
            if (noteType === Types.list){
                for (let i = 0; i < list.length; i++) {
                    resizeTextAreaInput('modal-'+list[i][0]); 
                }
            } else if (noteType === Types.note) {
                resizeTextAreaInput('modalNoteTextArea'); 
            }
        } else {
            setNewTaskCounter(0);
            setDeleteList([]);
        }
    }, [showNoteModal]);

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
    
    // Delete the task from the front-end
    const removeNewTaskFromList = (task_id) => {
        setList(list.filter((element) => {
            return element[0] !== task_id;
        }));
    };

    // Delete task from front-end and add it to delete array to be deleted.
    // Array is sent to database if the list is saved.
    const handleDeleteTask = (task_id) => {
        if (!task_id.toString().includes('newTask')) {
            setDeleteList([...deleteList, task_id]);
        }
        removeNewTaskFromList(task_id);
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
            case Types.note: // Save note
                noteContent = document.getElementById('modalNoteTextArea').value;
                break;
            case Types.list: // Save list
                updateList();
                noteContent = {list, deleteList};
                break;
        }

        let saveSucceeded = (isNew? 
            createNew(noteType, newTitle, noteContent):
            updateNote(noteId, noteType, newTitle, noteContent))
        saveSucceeded? 
            handleClose() :
            appendAlert(document.getElementById('error-alert'), 'Error saving note', 'danger');
    };

    return (
        <Modal show={showNoteModal} onHide={handleClose} className='note-modal' id='note-modal'>
            <button type='button' className='btn position-absolute top-0 end-0' id='close-button' onClick={handleClose}>
                <IoCloseCircle color='#0d6efd' size='2.5em' />
            </button>
            <Modal.Header className='border-0 pb-0 me-4'>
                <textarea
                    className='title bg-transparent overflow-auto mx-2 border-0 fs-3 w-100'
                    id='modalTitleTextArea'
                    rows={1}
                    placeholder='Title'
                    defaultValue={title}
                    onInput={(event) => resizeTextAreaInput(event.target.id)}
                />
                {/* <button type="button" className="btn-close position-absolute top-0 end-0" aria-label="Close" onClick={handleClose}></button> */}
            </Modal.Header>
    
            <Modal.Body className='mx-2' id='note-body'>

                {/* Lists */}
                {noteType === Types.list &&
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
                                    <textarea 
                                        className='text-space fw-lighter w-100 border-0 ms-1 me-4 pe-3' 
                                        id={`modal-${task[0]}`}
                                        htmlFor={task[0]} 
                                        defaultValue={task[1]} 
                                        rows={1}
                                        onInput={(event) => resizeTextAreaInput(event.target.id)}/>
                                    {(hoveredTask === task[0] || selectedTask === task[0]) && (
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
                                onKeyDown={handleNewTask} >

                                <IoMdAdd className='plus-icon border-0' id='newTask' color='#4A5058' size='1em' />
                                
                                <textarea 
                                    id={'modalNewTaskTextarea'}
                                    className='text-space w-100 border-0 ms-1 me-4 pe-3'
                                    htmlFor={'newTask'}
                                    placeholder={'List item'}
                                    rows={1} />
                            </div>
                        </div>
                    </div>
                }

                {/* Notes */}
                {noteType === Types.note &&
                    <textarea 
                        id='modalNoteTextArea' 
                        className='text-space fw-lighter border-0 w-100' 
                        placeholder='Note'
                        defaultValue={message}
                        onInput={(event) => resizeTextAreaInput(event.target.id)} 
                        />
                }
                {/* <p className='text-danger'>Title cannot exceed 100 characters</p> */}
            </Modal.Body>
            
            {!isNew &&
                <Modal.Footer className='border-0 hstack gap-2'>
                    <button type='button' className='btn btn-danger' onClick={() => handleDeleteNote(noteId)}>Delete</button>
                    <button type="button" className="btn btn-secondary ms-auto" onClick={handleClose}>Cancel</button>
                    <div className="vr"></div>
                    <button type="button" className="btn btn-primary" style={{paddingLeft:'2rem', paddingRight:'2rem'}} onClick={saveHelper}>Save</button>
                </Modal.Footer>
            }

            {isNew && 
                <Modal.Footer className='border-0 hstack gap-2'>
                    <button type="button" className="btn btn-secondary ms-auto" onClick={handleClose}>Cancel</button>
                    <div className="vr"></div>
                    <button type="button" className="btn btn-primary" style={{paddingLeft:'2rem', paddingRight:'2rem'}} onClick={saveHelper}>Create</button>
                </Modal.Footer>
            }

        </Modal>
    );
}

export default NoteCard;