/* Responsible for rendering a user's collection of notes and lists */
import React from 'react';

function CreateNote({openCreateNew}) {
    return (
        <div
            className='card shadow-sm fw-bold p-4 mx-3 my-4 rounded'
            id='cards-new'
            style={{ width: "18rem" }}
            onClick={() => openCreateNew()}>
            <div className="card-title">Create new</div>
        </div>
    );
};

function Notes({ listTitles, openList, openCreateNew }) {
    return (
        <div className='p-5 row'>
            < CreateNote openCreateNew={openCreateNew} />
            {listTitles.map(task => (
                <div
                    key={task.list_id}
                    id='cards'
                    className="card shadow-sm p-4 mx-3 my-4 rounded"
                    style={{ width: "18rem" }}
                    onClick={() => openList(task)} >
                    <div className="card-title">{task.title}</div>
                </div>
            ))}
        </div>
    );
};

export default Notes;