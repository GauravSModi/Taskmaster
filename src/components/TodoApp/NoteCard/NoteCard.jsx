/* Responsible for creating, or showing an existing, single note or list using a bootstrap modal */
import React, { useEffect, useState } from 'react';
import { Modal, CloseButton } from 'react-bootstrap';
import { IoCloseCircle } from "react-icons/io5";

function NoteCard({ showModal, noteId, title, noteType, list, message, updateNote, handleDeleteTask, handleDeleteNote, handleClose }) {
    const [textAreaHeight, setTextAreaHeight] = useState('auto');
    const [HoveredTask, setHoveredTask] = useState(null);


    // Resize Title text area height when modal is activated
    useEffect(() => {
        if (showModal) {
            resizeTextAreaInput();
        }
    }, [showModal]);

    const handleTaskHover = (task_id) => {
        setHoveredTask(task_id);
    };

    const handleTaskLeave = () => {
        setHoveredTask(null);
    };

    const resizeTextAreaInput = () => {
        const textArea = document.getElementById('modalTitleTextArea');
        textArea.style.height = 'auto';
        textArea.style.height = `${textArea.scrollHeight}px`;
        setTextAreaHeight(`${textArea.scrollHeight}px`);
    };

    const updateHelper = () => {
        const newTitle = document.getElementById('modalTitleTextArea').value;

        // Update the title if it has changed
        if (newTitle !== title) {
            updateNote(newTitle);
        }

        // Close modal window
        handleClose();
    }


    return (
        <Modal show={showModal} onHide={handleClose} className='note-modal'>
            <button type='button' className='btn position-absolute top-0 end-0' id='close-button' onClick={handleClose}><IoCloseCircle color='#0d6efd' size='2.5em' /></button>
            <Modal.Header className='border-0 pb-0 me-4'>
                <textarea
                    className='title overflow-auto mx-2 border-0 rounded fs-3 w-100'
                    id='modalTitleTextArea'
                    rows={1}
                    placeholder='Title'
                    defaultValue={title}
                    onInput={resizeTextAreaInput}
                />
                {/* <button type="button" className="btn-close position-absolute top-0 end-0" aria-label="Close" onClick={handleClose}></button> */}
            </Modal.Header>
    
            <Modal.Body className='border-0 mx-2'>
                {list && 
                    <div className='todo-list'>
                            <div className='input-group'>
                                {list.map(task => (
                                    <div
                                        key={task[0]}
                                        className="form-check"
                                        onMouseEnter={() => handleTaskHover(task[0])}
                                        onMouseLeave={handleTaskLeave}
                                        onFocus={() => handleTaskHover(task[0])}
                                        onBlur={handleTaskLeave} >

                                        <input className="form-check-input" type="checkbox" id={task[0]} />
                                        <label className="form-check-label" htmlFor={task[0]}>
                                            {task[1]}
                                        </label>
                                        {HoveredTask === task[0] && (
                                            <CloseButton
                                                className='taskDeleteBttn'
                                                onClick={() => handleDeleteTask(task[0])}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                    </div>
                }
                {message != null && 
                    <textarea 
                        id='modalNoteTextArea' 
                        className='text-space border border-0 rounded w-100' 
                        placeholder='Note'
                        // value={message.message}
                        defaultValue={message}
                        onInput={resizeTextAreaInput} />
                }
                {/* <p className='text-danger'>Title cannot exceed 100 characters</p> */}
            </Modal.Body>
            <Modal.Footer className='border-0 d-flex justify-content-between'>
                <button type='button' className='btn btn-danger px-3' onClick={() => handleDeleteNote(noteId)}>Delete</button>

                <div>
                    <button type="button" className="btn btn-secondary" onClick={handleClose}>Cancel</button>
                    <button type="button" className="btn btn-primary ms-2" style={{paddingLeft:'2.5rem', paddingRight:'2.5rem'}} onClick={updateHelper}>Save</button>
                </div>

            </Modal.Footer>
        </Modal>
    );
}



export default NoteCard;