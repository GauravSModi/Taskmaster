import React, { useState, useEffect } from 'react';
import AppNavbar from '../../components/Navbar/Navbar';
import NoteCard from './NoteCard/NoteCard';
import Notes from './Notes/Notes';
import './TodoApp.css';
import { url } from '../../index'
import App from '../../App';


function TodoApp({token}) {

    const [logout, setLogout] = useState(false);
    const [Mode, setMode] = useState('btn-radio-notes'); // State to manage which type of notes is visible
    const [NoteType, setNoteType] = useState(0); // State to manage which type of notes is visible
    const [AllNotes, setAllNotes] = useState([]); // State to keep track of all notes assocciated with the user
    const [VisibleNotes, setVisibleNotes] = useState([]); // State to keep track of the visible notes
    const [Message, setMessage] = useState(null); // State to keep track of the note message
    const [Tasks, setTasks] = useState(null); // State to keep track of the task list
    const [NoteId, setNoteId] = useState(null); // State to keep track of the title
    const [Title, setTitle] = useState(null); // State to keep track of the title
    const [ShowModal, setShowModal] = useState(false); // State to manage modal visibility
    const [IsNewNote, setIsNewNote] = useState(false); // State to manage if making new note vs showing an old one

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

    useEffect(() => {
        getNotes();
        const intervalId = setInterval(() => {
            getNotes();
        }, 60000);
        return () => clearInterval(intervalId);
    }, []);

    const changeMode = () => {
        switch(Mode) {
            case Modes.note:
                setNoteType(Types.note);
                break;
            
            case Modes.list:
                setNoteType(Types.list);
                break;
        }
    };


    useEffect(() => {
        changeMode();
    }, [Mode]);

    const changeVisible = () => {
        setVisibleNotes(AllNotes.filter((curr) => {
            return curr.is_note === NoteType;
        }))
    };

    useEffect(() => {
        changeVisible();
    }, [NoteType]);

    useEffect(() => {
        changeVisible();
    }, [AllNotes]);

    const signout = () => {
        // TODO: Show an "ARE YOU SURE" warning here

        localStorage.removeItem('jwt_token');
        setLogout(true);
    };

    if (logout) {
        return <App />;
    }
    
    const closeNote = () => {
        setAllNotes([...AllNotes]);
        setShowModal(false); // Close the modal
        setTitle(null);
        setMessage(null);
        setTasks(null);
        setNoteId(null);
    };


    const openCreateNew = () => {
        setIsNewNote(true);
        if (NoteType === Types.note) setMessage('');
        setShowModal(true);
    }

    const openNote = (note) => {
        setIsNewNote(false);
        setNoteId(note.note_id);
        if (note.is_note == Types.note) {
            getMessage(note);
        } else if (note.is_note == Types.list) {
            getTasks(note);
        }
    };

    const createNote = async (title, message) => {
        try {
            const response = await fetch(url + '/createNote', {
                method: 'POST',
                headers: { 
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'title': title, 'message': message }),
            });

            if (response.ok) { // in the 200 range
                const data = await response.json();
                setAllNotes([...AllNotes, data.newNote]);
                return true;
            } else {
                const errorData = await response.json();
                console.log(errorData);
                return false;
            }

        } catch (error) {
            console.error('Error: ', error);
            return false;
        };
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
                if (!data.message.includes('No message found')){
                    setMessage(data.message);
                } else {
                    setMessage('');
                }
                setTitle(task.title);
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

                if (!data.tasks.includes('No tasks found')){
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


    const searchNotes = (e) => {
        const searchString = document.getElementById(e.target.id).value.trim().toLowerCase();

        // TODO: Get all notes and search in their contents too

        setVisibleNotes(AllNotes.filter((curr) => {
            return (curr.is_note === NoteType && curr.title.toLowerCase().includes(searchString));
        }));
    };

    const updateNote = (note_id, noteType, newTitle, noteContent) => {

        // Update the title (called function will check if different)
        let updateTitleSuccessful = updateTitle(note_id, newTitle);

        // Update the content
        let updateContentSuccessful = updateNoteContent(note_id, noteType, noteContent);

        return updateTitleSuccessful && updateContentSuccessful;
    }

    const updateNoteContent = (note_id, noteType, noteContent) => {
        if (noteType == Types.note) {
            return updateMessage(note_id, noteContent);
        } else if (noteType == Types.list){
            return updateList(note_id, noteContent);
        }
        return false;
    };

    const updateMessage = async (note_id, newMessage) => {
        if (newMessage !== Message) {
            try {
                const response = await fetch(url + '/updateMessage', {
                    method: 'POST',
                    headers: { 
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        'note_id': note_id, 
                        'message': newMessage
                    })
                });

                if (response.ok) {
                    const data = await response.json()
                    return true;
                } else {
                    return false;
                }
            } catch (error) {
                console.error('Error: ', error);
            }
        } else {
            return true; // Message didn't need to be updated
        }
    };

    const updateList = async (note_id, newList) => {
        if (newList !== Tasks) {
            try {
                const response = await fetch(url + '/updateList', {
                    method: 'POST',
                    headers: { 
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        'note_id': note_id, 
                        'list': newList
                    })
                })

                if (response.ok) {
                    const data = await response.json()
                    return true;
                } else {
                    return false;
                }
            } catch (error) {
                console.log('Error: ', error);
            }
        } else {
            return true; // List didn't need to be updated
        }
    }


    // Update note title if it has changed
    const updateTitle = async (note_id, newTitle) => {
        if (Title !== newTitle) {
            try {
                const response = await fetch(url + '/updateTitle', {
                    method: 'POST',
                    headers: { 
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        'note_id': note_id, 
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

                    return true;
                } else {
                    return false;
                }
            } catch (error) {
                console.error('Error: ', error);
            }
        } else {
            return true; // Title didn't need to be updated
        }
    };

    // Delete note
    const deleteNote = async (note_id) => {
        try {
            const response = await fetch(url + '/deleteNote', {
                method: 'DELETE',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify({ note_id }),
            })
            if (response.ok) {
                closeNote();

                setAllNotes( AllNotes.filter((note) => {
                    return note.note_id != note_id;
                }))

            } else {

            }
        } catch (error) {
            console.error('Error: ', error);
        }
    };


    // Delete the task from the list
    const deleteTask = async (task_id) => {
        try {
           const response = await fetch(url + '/deleteTask', {
                method: 'DELETE',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify({ task_id }),
            })
            if (response.ok) {
                // Delete the task from the front-end
                setTasks( Tasks.filter((element) => {
                    return element[0] !== task_id;
                }));
            } else {
                console.log("Something went wrong deleting the task!");
            }
        } catch (error) {
            console.error('Error: ', error);
        }
    };

    return (
        // <div className=''>
            // <AppSidebar className='w-25 h-25'/>
        <div className='todo-app vh-100'>
            <AppNavbar 
                Mode={Mode} 
                setMode={setMode} 
                openCreateNew={openCreateNew}
                searchNotes={searchNotes}
                refresh={getNotes} 
                signout={signout}
            />
            <NoteCard
                showModal={ShowModal}
                isNew={IsNewNote}
                noteId={NoteId}
                title={Title}
                noteType={NoteType}
                list={Tasks}
                message={Message}
                createNote={createNote}
                updateNote={updateNote}
                handleDeleteTask={deleteTask}
                handleDeleteNote={deleteNote}
                handleClose={closeNote}
            />

            <Notes VisibleNotes={VisibleNotes} openNote={openNote} Mode={Mode} />
        </div>
        // </div>
    );
};


export default TodoApp;