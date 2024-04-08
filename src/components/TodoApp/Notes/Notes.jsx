/* Responsible for rendering a user's collection of notes and lists */
import React, { useState, useRef, useEffect } from 'react';
import '../TodoApp.css';


function Notes({ VisibleNotes, openNote, Mode }) {
    const titleRef = useRef(null);

    // const [numCols, setNumCols] = useState(0); // TODO: Use for organizing cards

    const notifyResize = () => {
        window.addEventListener("resize", organizeCards)
    };

    // Adjust card height every time VisibleNotes changes
    useEffect(() => {
        organizeCards();
        checkEmptyNotes();
        adjustCardHeight();
        window.addEventListener('resize', adjustCardHeight);
        return () => {
            window.removeEventListener('resize', adjustCardHeight);
        };
    }, [VisibleNotes]);

    // Adjust card height on launch
    useEffect(() => {
        notifyResize();

        checkEmptyNotes();
        adjustCardHeight();
        window.addEventListener('resize', adjustCardHeight);
        return () => {
            window.removeEventListener('resize', adjustCardHeight);
        };
    }, []);

    // Add a create note note if user doesn't have any notes?
    const checkEmptyNotes = () => {
        // console.log(VisibleNotes.length);
        if (VisibleNotes.length === 0) {
            
        }
    };

    // Adjust card height depending on note title length
    const adjustCardHeight = () => {
        VisibleNotes.forEach(task => {
            const card = document.getElementById(`card-${task.note_id}`);
            const title = document.getElementById(`title-${task.note_id}`);
            if (card && title) {
                // console.log(window.getComputedStyle(title));
                const lines = title.offsetHeight / parseInt(window.getComputedStyle(title).lineHeight);
                card.style.height = `${(lines * 1.5) + 2}em`; 
            }
        });
    };

    const organizeCards = () => {
        const grid = document.getElementById('note-card-grid');

        if (!grid) return;

        let leftMarginValue = (window.innerWidth % 224)/2;
        grid.style.marginLeft = `${leftMarginValue}px`;
    };

    return (
        <div className='d-block vh-100'>

            { VisibleNotes.length > 0 &&
                <div className='note-card-grid row' id='note-card-grid' style={{ marginTop: '100px' }}>
                    {VisibleNotes.map(task => (
                        <div
                            key={task.note_id}
                            id={`card-${task.note_id}`}
                            className="card p-3 mx-3 my-4 rounded bg-secondary text-white"
                            style={{ width: "12rem" }}
                            onClick={() => openNote(task)} >
                            <div className="card-title" id={`title-${task.note_id}`} ref={titleRef}>{task.title}</div>
                        </div>
                    ))}
                </div>
            }


            {VisibleNotes.length === 0 && 
                <div className='d-flex h-100 justify-content-center align-items-center'> 
                    <p className='text-center text-muted'>Empty</p>
                </div>
            }

        </div>
    );
};

export default Notes;
