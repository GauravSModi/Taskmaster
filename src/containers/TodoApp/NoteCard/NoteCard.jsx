/* Responsible for creating, or showing an existing, single note or list using a bootstrap modal */
import React, { useEffect, useState } from 'react';
import { Modal, CloseButton } from 'react-bootstrap';
import { IoCloseCircle } from "react-icons/io5";

function NoteCard({ showModal, isNew, noteId, title, 
                    noteType, list, message, createNote, 
                    updateNote, handleDeleteTask, 
                    handleDeleteNote, handleClose, refresh }) {

    const [textAreaHeight, setTextAreaHeight] = useState('auto');
    const [selectedTask, setSelectedTask] = useState(null);
    const [hoveredTask, setHoveredTask] = useState(null);
    const [oldList, setOldList] = useState(list);

    // Resize Title text area height when modal is activated
    useEffect(() => {
        if (showModal) {
            resizeTextAreaInput('modalTitleTextArea');
        }
        setOldList(list);
    }, [showModal]);

    // Show/hide button to delete task
    const handleTaskHover = (task_id) => {
        setHoveredTask(task_id);
    };

    const handleTaskLeave = () => {
        setHoveredTask(null);
    };

    const handleTaskFocus = (task_id) => {
        setSelectedTask(task_id);
    };

    const handleTaskBlur = () => {
        setSelectedTask(null);
    };

    const resizeTextAreaInput = (id) => {
        const textArea = document.getElementById(id);
        textArea.style.height = 'auto';
        textArea.style.height = `${textArea.scrollHeight}px`;
        setTextAreaHeight(`${textArea.scrollHeight}px`);
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
                // noteContent = 

                console.log("Old list:", oldList);
                console.log(document.getElementById('modalListTasks'));
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
            <button type='button' className='btn position-absolute top-0 end-0' id='close-button' onClick={handleClose}><IoCloseCircle color='#0d6efd' size='2.5em' /></button>
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
                    <div className='todo-list'>
                            <div className='input-group' id='modalListTasks'>
                                {list.map(task => (
                                    <div
                                        key={task[0]}
                                        className="form-check d-flex"
                                        onMouseEnter={() => handleTaskHover(task[0])}
                                        onMouseLeave={handleTaskLeave}
                                        onFocus={() => handleTaskFocus(task[0])}
                                        onBlur={handleTaskBlur} >

                                        <input className="form-check-input" type="checkbox" id={task[0]} />
                                        {/* <label className="form-check-label text-decoration-line-through" htmlFor={task[0]}>
                                            {task[1]}
                                        </label> */}
                                        <textarea 
                                            id={`modal-${task[0]}-textarea`}
                                            className='text-space w-100 border-0 ms-1 me-4 pe-3' 
                                            htmlFor={task[0]} 
                                            defaultValue={task[1]} 
                                            rows={1}
                                            onInput={(event) => resizeTextAreaInput(event.target.id)} />
                                        {(hoveredTask === task[0] || selectedTask === task[0]) && (
            // <button type='button' className='btn taskDeleteBttn p-0 m-0' id='close-button' onClick={handleClose}><IoCloseCircle color='#0d6efd' size='1.5em' /></button>
                                            <CloseButton
                                                className='taskDeleteBttn'
                                                onClick={() => handleDeleteTask(task[0])}
                                            />
                                        )}
                                    </div>
                                ))}
                                <div className='newTask'>


                                    <input className="form-check-input" type="checkbox" id={'newTaskCheckbox'} />
                                    <textarea 
                                        id={`modalnewTaskTextarea`}
                                        className='text-space w-100 border-0 ms-1 me-4 pe-3' 
                                        htmlFor={'newTask'} 
                                        defaultValue={"New list item"}
                                        rows={1}
                                        onInput={(event) => resizeTextAreaInput(event.target.id)} />
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