/* Responsible for rendering a user's collection of notes and lists */
import React, { useRef, useEffect } from 'react';
import '../TodoApp.css';


function Notes({ VisibleNotes, openList, Mode }) {
    const titleRef = useRef(null);

    // Adjust card height every time listTitles changes
    useEffect(() => {
        checkEmptyNotes();
        adjustCardHeight();
        window.addEventListener('resize', adjustCardHeight);
        return () => {
            window.removeEventListener('resize', adjustCardHeight);
        };
    }, [VisibleNotes]);

    // Adjust card height on launch
    useEffect(() => {
        checkEmptyNotes();
        adjustCardHeight();
        window.addEventListener('resize', adjustCardHeight);
        return () => {
            window.removeEventListener('resize', adjustCardHeight);
        };
    }, []);

    // Add a create not note if user doesn't have any notes
    const checkEmptyNotes = () => {
        console.log(VisibleNotes.length);
        if (VisibleNotes.length === 0) {
            
        }
    };

    // Adjust card height depending on note title length
    const adjustCardHeight = () => {
        VisibleNotes.forEach(task => {
            const card = document.getElementById(`card-${task.note_id}`);
            const title = document.getElementById(`title-${task.note_id}`);
            if (card && title) {
                const lines = title.offsetHeight / parseInt(window.getComputedStyle(title).lineHeight);
                card.style.height = `${(lines * 1.5) + 2}em`; 
            }
        });
    };

    return (
        <div className='notes-grid mt-5 p-5 row mx-auto'>
            {VisibleNotes.length > 0 && VisibleNotes.map(task => (
                <div
                    key={task.note_id}
                    id={`card-${task.note_id}`}
                    className="card shadow-sm p-3 mx-3 my-4 rounded"
                    style={{ width: "12rem" }}
                    onClick={() => openList(task)} >
                    <div className="card-title" id={`title-${task.note_id}`} ref={titleRef}>{task.title.trim()}</div>
                </div>
            ))}

            {VisibleNotes.length === 0 && 
                <div className='w-100'> 
                    <p className='text-center text-muted'>Empty</p>
                </div>
            }
        </div>
    );
};

export default Notes;
