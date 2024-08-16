/* Responsible for rendering a user's collection of notes and lists */
import React, { useEffect } from 'react';
import '../Todo.css';

function NoteGrid({ VisibleNotes, openNote }) {

    const notifyResize = () => {
        window.addEventListener("resize", organizeCards)
    };

    // Adjust card height every time VisibleNotes changes
    useEffect(() => {
        organizeCards();
        adjustCardHeight();
        window.addEventListener('resize', adjustCardHeight);
        return () => {
            window.removeEventListener('resize', adjustCardHeight);
        };
    }, [VisibleNotes]);

    // Adjust card height on launch
    useEffect(() => {
        notifyResize();
        adjustCardHeight();
        window.addEventListener('resize', adjustCardHeight);
        return () => {
            window.removeEventListener('resize', adjustCardHeight);
        };
    }, []);

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

    const organizeCards = () => {
        const grid = document.getElementById('note-card-grid');

        if (!grid) return;

        let leftMarginValue = (window.innerWidth % 224)/2;
        grid.style.marginLeft = `${leftMarginValue}px`;
    };

    return (
        <div className='w-100'>
            { VisibleNotes.length > 0 &&
                <div className='note-card-grid row' id='note-card-grid' style={{ marginTop: '100px' }}>
                    {VisibleNotes.map(task => (
                        <div
                            key={task.note_id}
                            id={`card-${task.note_id}`}
                            className="card cursor-pointer p-3 mx-3 my-4 rounded bg-secondary text-white"
                            style={{ width: "12rem" }}
                            onClick={() => openNote(task)} >
                            <div className="card-title pe-none" id={`title-${task.note_id}`}>{task.title ? task.title: <br/>}</div>
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

export default NoteGrid;
