import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { IoCloseCircle} from "react-icons/io5";
import { RxMagicWand } from "react-icons/rx";
import './AiNoteCard.scss';

function AiNoteCard({ showAiModal, generateAiNote, handleClose, generatingStatus, setGeneratingStatus }){

    const [examplePromptIndex, setExamplePromptIndex] = useState(0);
    const [textAreaHeight, setTextAreaHeight] = useState('auto');

    // Cycle through example prompts every few seconds
    const examplePrompts = [
        'Classic movies to watch on Halloween',
        'Things to do on a weekend trip to Whistler',
        'Back-to-school shopping list for a 10 year old',
        'Best ways to wind down after a long day of work',
        'Spring cleaning checklist for a 2 bedroom apartment',
        'Packing list for a camping trip with 2 kids in the summer',
        'Snacks for a housewarming party with 20 guests',
        'Groceries for the week for a vegetarian family of 3'
    ];
    
    useEffect(() => {
        const intervalId = setInterval(() => {
            setExamplePromptIndex(prevIndex => (prevIndex+1) % examplePrompts.length);
        }, 4000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const examplePrompt = document.getElementById('prompt-textarea');
        if (examplePrompt) { examplePrompt.placeholder = examplePrompts[examplePromptIndex] }
    }, [examplePromptIndex]);


    const resizeTextAreaInput = (id) => {
        const textArea = document.getElementById(id);
        textArea.style.height = 'auto';
        textArea.style.height = `${textArea.scrollHeight}px`;
        setTextAreaHeight(`${textArea.scrollHeight}px`);
    };

    const generateAiNoteHelper = () => {
        const promptTextarea = document.getElementById('prompt-textarea');
        setGeneratingStatus(true);
        if (promptTextarea) {
            const prompt = promptTextarea.value;
            generateAiNote(prompt);
        } else {
            console.log('Something went wrong generating the note')
        }
    };

    return (
        <Modal show={showAiModal} onHide={handleClose} className='ai-modal' id='ai-modal'>
            <button type='button' className='btn position-absolute top-0 end-0' id='icon' onClick={handleClose}>
                <IoCloseCircle size='2.5em' />
            </button>

            <Modal.Header className='border-0 p-0 me-4 mb-0 hstack gap-1'>
                <RxMagicWand className='my-0 py-0 ms-3 me-2' id='icon' size='1.5em'/>
                <p className='fs-3 my-2 py-0 me-auto'>
                    Let AI help you create your note!
                </p>
            </Modal.Header>

            <Modal.Body className='fw-lighter fs-6 px-2 py-0 mx-2 my-0'>
                <p>
                    Describe the list you want to create. Try a packing list, to-do list, or something else.
                </p>
                <textarea 
                    id='prompt-textarea' 
                    className='text-space fw-lighter border-1 rounded w-100 p-2' 
                    placeholder='Classic movies to watch on Halloween'
                    onInput={(event) => resizeTextAreaInput(event.target.id)} 
                />
            </Modal.Body>
            
            <Modal.Footer className='border-0 hstack gap-2'>
                <button 
                    type="button" 
                    className="btn btn-secondary ms-auto" 
                    onClick={handleClose}>
                        Cancel
                </button>
                <div className="vr"></div>
                <button 
                    type="button" 
                    className="btn btn-primary" 
                    style={{paddingLeft:'2rem', paddingRight:'2rem'}} 
                    onClick={generateAiNoteHelper}
                    disabled={generatingStatus}>
                        { generatingStatus && 
                            <span>
                                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span> 
                                <span role="status"> Generating...</span>
                            </span>
                        }
                        { !generatingStatus && 
                            <span>Generate</span> 
                        }
                </button>
            </Modal.Footer>
        </Modal>
    );
}

export default AiNoteCard;