import React, { useState, useEffect } from 'react';
import AppSidebar from '../Sidebar/Sidebar';
import AppNavbar from '../Navbar/Navbar';
import NoteCard from './NoteCard/NoteCard';
import Notes from './Notes/Notes';
import './TodoApp.css';
import { url } from '../../index'


function TodoApp({token}) {

    const [ShowNotes, setShowNotes] = useState(0); // 0 = show notes, 1 = show lists
    const [NoteTitles, setNoteTitles] = useState([]); // State to keep track of the note titles
    const [Note, setNote] = useState(null); // State to keep track of the note
    const [List, setList] = useState(null); // State to keep track of the note
    const [NoteId, setNoteId] = useState(null); // State to keep track of the title
    const [Title, setTitle] = useState(null); // State to keep track of the title
    const [ShowModal, setShowModal] = useState(false); // State to manage modal visibility
    const [NoteType, setNoteType] = useState(true); // true for note, false for note
    const [IsNewNote, setIsNewNote] = useState(true); // State to manage if making new note vs showing an old one

    useEffect(() => {
        // Functions to be called immediately upon component mount
        console.log('getNotes');
        getNotes();
    }, []); // Empty dependency array to ensure the effect runs only once




    
    const closeNote = () => {
        console.log('closeNote');
        setNoteTitles([...NoteTitles]);
        setShowModal(false); // Close the modal
        setTitle(null);
        setNote(null);
        setNoteId(null);
    };


    const openCreateNew = () => {
        console.log("OpenCreateNew")
    }

    const openList = async (task) => {

        setNoteId(task.note_id);

        try {
            const response = await fetch(url + '/getList', {
                method: 'POST',
                headers: { 
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'list_id': task.list_id }),
            });

            if (response.ok) { // in the 200 range
                const data = await response.json();
                let task_list = []; // Holds description of tasks

                if (!data.tasks.includes('No Tasks Found')){
                    task_list = data.tasks.map(task => {
                        return [task.task_id, task.description, task.is_completed];
                    })
                }

                setTitle(task.title);
                setList(task_list);
                setShowModal(true); // Open the modal
            } else {
                const errorData = await response.json();
                console.log(errorData);
            }

        } catch (error) {
            console.error('Error: ', error);
        };
    };

    // Retreive all notes/lists associated with the user
    const getNotes = async () => {
        try {
            const response = await fetch(url + '/getNotes', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) { // in the 200 range)
                const data = await response.json();

                if (data.notes === "No Notes Found") {
                    // setNoteTitles([{note_id: -1}])
                    console.log("Nope, no notes found");
                    return;
                } else{
                    setNoteTitles(data.notes);
                }

            } else {
                const errorData = await response.json();
                console.log(errorData);
            }
        } catch (error) {
            console.error('Error: ', error);
        }
    };


    // Update Note/List title if it has changed
    const updateTitle = async (newTitle) => {

        if (Title !== newTitle) {
            try {
                const response = await fetch(url + '/updateTitle', {
                    method: 'POST',
                    headers: { 
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        'note_id': NoteId, 
                        'title': newTitle 
                    })
                });
                if (response.ok) {
                    const data = await response.json();
                    const noteWithNewTitle = NoteTitles.find(currNote => currNote.note_id === NoteId);
                    
                    if (noteWithNewTitle) {
                        noteWithNewTitle.title = newTitle;
                    }
                    setNoteTitles([...NoteTitles]);
                } else {

                }
            } catch (error) {
                console.error('Error: ', error);
            }
        }
    };


    // Delete the task from the list
    const handleDeleteTask = async (task_id) => {

        // Delete the task from the front-end
        setList( List.filter((element) => {
            return element[0] !== task_id;
        }))

        try {
            await fetch(url + '/deleteTask', {
                method: 'DELETE',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify({ task_id }),
            })
        } catch (error) {
            console.error('Error: ', error);
        }
    };

    return (
        <div className='todo-app '>
            {/* <AppSidebar/> */}
            <div>
                <AppNavbar openCreateNew={openCreateNew}/>
            </div>
            <div>
                <NoteCard
                    ShowModal={ShowModal}
                    // isNew={isNew}
                    // isNote={isNote}
                    handleDeleteTask={handleDeleteTask}
                    handleClose={closeNote}
                    title={Title}
                    list={List}
                    note={Note}
                    updateNote={updateTitle}
                />

                <Notes noteTitles={NoteTitles} openList={openList}/>


            </div>
        </div>
    );
};


export default TodoApp;