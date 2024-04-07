import React, { useState, useEffect } from 'react';
import AppSidebar from '../Sidebar/Sidebar';
import AppNavbar from '../Navbar/Navbar';
import NoteCard from './NoteCard/NoteCard';
import Notes from './Notes/Notes';
import './TodoApp.css';
import { url } from '../../index'


function TodoApp({token}) {

    const [Mode, setMode] = useState('btn-radio-notes'); // State to manage which type of notes is visible
    const [NoteType, setNoteType] = useState(0); // State to manage which type of notes is visible
    const [AllNotes, setAllNotes] = useState([]); // State to keep track of all notes assocciated with the user
    const [VisibleNotes, setVisibleNotes] = useState([]); // State to keep track of the visible notes
    const [Message, setMessage] = useState(null); // State to keep track of the note message
    const [Tasks, setTasks] = useState(null); // State to keep track of the task list
    const [NoteId, setNoteId] = useState(null); // State to keep track of the title
    const [Title, setTitle] = useState(null); // State to keep track of the title
    const [ShowModal, setShowModal] = useState(false); // State to manage modal visibility
    const [IsNewNote, setIsNewNote] = useState(true); // State to manage if making new note vs showing an old one

    // Used to help switch visible notes
    const Modes = {
        note: 'btn-radio-notes',
        list: 'btn-radio-lists'
    }

    // Used to distinguish between which type a specific note is
    const Types = {
        note: 0,
        list: 1
    }

    useEffect(() => {
        // Functions to be called immediately upon component mount
        getNotes();
    }, []); // Empty dependency array to ensure the effect runs only once

    useEffect(() => {
        changeMode();
    }, [Mode]);

    useEffect(() => {
        changeVisible();
    }, [NoteType]);

    useEffect(() => {
        changeVisible();
    }, [AllNotes]);

    const changeVisible = () => {
        setVisibleNotes(AllNotes.filter((curr) => {
            return curr.is_note === NoteType;
        }))
    };

    const changeMode = () => {
        switch(Mode) {
            case Modes.note:
                // console.log("Setting mode: ", Types.note);
                setNoteType(Types.note);
                break;
            
            case Modes.list:
                // console.log("Setting mode: ", Types.list);
                setNoteType(Types.list);
                break;
        }
    };
    
    const closeNote = () => {
        // console.log('closeNote');
        setAllNotes([...AllNotes]);
        setShowModal(false); // Close the modal
        setTitle(null);
        setTasks(null);
        setNoteId(null);
    };


    const openCreateNew = () => {
        console.log("OpenCreateNew")
    }

    const openNote = (task) => {
        setNoteId(task.note_id);

        if (task.is_note == Types.note) {
            getMessage(task);
        } else if (task.is_note == Types.list) {
            getTasks(task);
        }

    };

    const getMessage = async (task) => {
        try {
            const response = await fetch(url + '/getMessage', {
                method: 'POST',
                headers: { 
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'note_id': task.note_id }),
            });

            if (response.ok) { // in the 200 range
                const data = await response.json();
                let message = null; // Holds note message
                console.log(data.message)
                if (!data.message.message.includes('No message Found')){
                    message = data.message;
                }

                setTitle(task.title);
                setMessage(message);
                setShowModal(true); // Open the modal
            } else {
                const errorData = await response.json();
                console.log(errorData);
            }

        } catch (error) {
            console.error('Error: ', error);
        };
    }


    const getTasks = async (task) => {
        try {
            const response = await fetch(url + '/getTasks', {
                method: 'POST',
                headers: { 
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'note_id': task.note_id }),
            });

            if (response.ok) { // in the 200 range
                const data = await response.json();
                let task_list = []; // Holds descriptions of tasks

                if (!data.tasks.includes('No tasks Found')){
                    console.log(data.tasks)
                    task_list = data.tasks.map(task => {
                        return [task.task_id, task.description, task.is_completed];
                    })
                }

                setTitle(task.title);
                setTasks(task_list);
                setShowModal(true); // Open the modal
            } else {
                const errorData = await response.json();
                console.log(errorData);
            }

        } catch (error) {
            console.error('Error: ', error);
        };
    }

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

                if (data.notes === "No notes Found") {
                    // setAllNotes([{note_id: -1}])
                    return;
                } else{
                    setAllNotes(data.notes);
                }

            } else {
                const errorData = await response.json();
                console.log(errorData);
            }
        } catch (error) {
            console.error('Error: ', error);
        }
    };


    // Update note/list title if it has changed
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
                    const noteWithNewTitle = AllNotes.find(currNote => currNote.note_id === NoteId);
                    
                    if (noteWithNewTitle) {
                        noteWithNewTitle.title = newTitle;
                    }
                    setAllNotes([...AllNotes]);
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
        setTasks( Tasks.filter((element) => {
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
        <div className='todo-app'>
            {/* <AppSidebar/> */}
            <div>
                <AppNavbar openCreateNew={openCreateNew} Mode={Mode} setMode={setMode} />
            </div>
                <NoteCard
                    ShowModal={ShowModal}
                    // isNew={isNew}
                    handleDeleteTask={handleDeleteTask}
                    handleClose={closeNote}
                    title={Title}
                    noteType={NoteType}
                    list={Tasks}
                    message={Message}
                    updateNote={updateTitle}
                />

                <Notes VisibleNotes={VisibleNotes} openNote={openNote} Mode={Mode} />
        </div>
    );
};


export default TodoApp;