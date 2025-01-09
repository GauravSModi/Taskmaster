import React, { useState, useEffect } from 'react';
import AppNavbar from '../../components/Navbar/Navbar';
import AiNoteCard from './AiNoteCard/AiNoteCard';
import NoteCard from './NoteCard/NoteCard';
import NoteGrid from './NoteGrid/NoteGrid';
import './Todo.scss';
import { url } from '../../index'
import App from '../../App';

import { Modal } from 'react-bootstrap';
import { IoCloseCircle} from "react-icons/io5";


function TodoApp({token}) {

    const [logout, setLogout] = useState(false);
    const [loading, setLoading] = useState(false);
    const [Mode, setMode] = useState('btn-radio-notes'); // State to manage which type of notes is visible
    const [NoteType, setNoteType] = useState(0); // State to manage which type of notes is visible. Note = 0, List = 1
    const [AllNotes, setAllNotes] = useState([]); // State to keep track of all notes assocciated with the user
    const [VisibleNotes, setVisibleNotes] = useState([]); // State to keep track of the visible notes
    const [Message, setMessage] = useState(''); // State to keep track of the note message
    const [Tasks, setTasks] = useState([]); // State to keep track of the task list
    const [NoteId, setNoteId] = useState(null); // State to keep track of the title
    const [Title, setTitle] = useState(null); // State to keep track of the title
    const [showNoteModal, setShowNoteModal] = useState(false); // State to manage note modal visibility
    const [showAiModal, setShowAiModal] = useState(false); // State to manage AI note modal visibility
    const [generatingAiResponseStatus, setGeneratingAiResponseStatus] = useState(false); // State to manage spinner for AI function call
    const [IsNewNote, setIsNewNote] = useState(false); // State to manage if making new note vs showing an old one
    const [isSessionExpired, setIsSessionExpired] = useState(false); // State to manage if JWT has expired

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
        getNotes();
        const intervalId = setInterval(() => {
            getNotes();
        }, 600000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        changeMode();
    }, [Mode]);

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
        setShowNoteModal(false); // Close the modal
        setTitle(null);
        setMessage('');
        setTasks([]);
        setNoteId(null);
    };

    const openAiNoteModal = () => {
        setShowAiModal(true);
    }

    const closeAiNoteModal = () => {
        setShowAiModal(false);
    }


    // Retreive all notes/lists associated with the user
    const getNotes = async () => {
        setAllNotes([])
        // setLoading(true);
        try {
            const response = await fetch(url + '/getNotes', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json',
                },
            });

            // console.log("Response: ", response);

            if (response.ok) { // in the 200 range
                const data = await response.json();

                setIsSessionExpired(false);

                if (data.notes !== "No notes Found") {
                    setAllNotes(data.notes);
                }
                // setLoading(false);
            } else if (response.status === 403) {
                setIsSessionExpired(true);
                // setLoading(false);
            } else {
                const errorData = await response.json();
                console.log(errorData);
                // setLoading(false);
            }
        } catch (error) {
            console.error('Error: ', error);
        }
    };

    const openCreateNewNoteModal = () => {
        setIsNewNote(true);
        if (NoteType === Types.note) setMessage('');
        setShowNoteModal(true);
    }

    const openNote = (note) => {
        setIsNewNote(false);
        setNoteId(note.note_id);
        if (note.is_note === Types.note) {
            getMessage(note);
        } else if (note.is_note === Types.list) {
            getTasks(note);
        }
    };

    const createNew = (noteType, newTitle, noteContent) => {
        switch (noteType) {
            case Types.note: // Save note
                return createNote(newTitle, noteContent);
            case Types.list: // Save list
                return createList(newTitle, noteContent.list);
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
    
    const createList = async (title, list) => {
        try {
            const response = await fetch(url + '/createList', {
                method: 'POST',
                headers: { 
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'title': title, 'list': list }),
            });

            if (response.ok) { // in the 200 range
                const data = await response.json();
                setAllNotes([...AllNotes, data.newList]);
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


    const generateAiNote = async (prompt) => {
        if (prompt) {
            try {
                const response = await fetch(url + '/generateAiNote', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 'prompt': prompt }),
                });

                if (response.ok) { // in the 200 range
                    const data = await response.json();
                    setIsSessionExpired(false);

                    const points = data.points.map((point, index) => {
                        return ['newTask' + index, point, 0];
                    })

                    setGeneratingAiResponseStatus(false);
                    setNoteType(Types.list);
                    setTitle(data.title);
                    setTasks(points);
                    openCreateNewNoteModal();
                    // setShowNoteModal(true); // Open the modal
                    closeAiNoteModal();

                } else if (response.status === 403) {
                    setIsSessionExpired(true);
                    // TODO: setGeneratingAiResponse as false and show error message
                    // setGeneratingAiResponseStatus(false);
                    // closeAiNoteModal();
                } else {
                    const errorData = await response.json();
                    console.log(errorData);
                    // TODO: setGeneratingAiResponse as false and show error message
                    // setGeneratingAiResponseStatus(false);
                    // closeAiNoteModal();
                }
            } catch (error) {
                console.error('Error: ', error);
            }
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
                if (!data.message.includes('No message found')){
                    setMessage(data.message);
                } else {
                    setMessage('');
                }
                setTitle(task.title);
                setShowNoteModal(true); // Open the modal
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
                setShowNoteModal(true); // Open the modal
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
        if (noteType === Types.note) {
            return updateMessage(note_id, noteContent);
        } else if (noteType === Types.list){
            return updateList(note_id, noteContent);
        }
        return false;
    };

    const updateMessage = async (note_id, newMessage) => {
        console.log("updateMessage");
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

    const updateList = async (note_id, noteContent) => {
        const { list, deleteList } = noteContent;
        try {
            const response = await fetch(url + '/updateList', {
                method: 'POST',
                headers: { 
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    'note_id': note_id, 
                    'new_list': list,
                    'delete_list': deleteList
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
                    return note.note_id !== note_id;
                }))

            } else {

            }
        } catch (error) {
            console.error('Error: ', error);
        }
    };

    // // Delete the task from the front-end
    // const removeNewTaskFromList = (task_id) => {
    //     setTasks( Tasks.filter((element) => {
    //         return element[0] !== task_id;
    //     }));
    // };

    // Delete the task from the list
    // const deleteTask = async (task_id) => {

    //     // New task
    //     if (task_id.toString().includes('newTask')) {
    //         removeNewTaskFromList(task_id);
    //         return;
    //     }

    //     // Existing task
    //     try {
    //         const response = await fetch(url + '/deleteTask', {
    //             method: 'DELETE',
    //             headers: { 
    //                 'Content-Type': 'application/json',
    //                 'Authorization': 'Bearer ' + token,
    //             },
    //             body: JSON.stringify({ task_id }),
    //         })
    //         if (response.ok) {
    //         removeTaskFromList(task_id);
    //         } else {
    //             console.log("Something went wrong deleting the task!");
    //         }
    //     } catch (error) {
    //         console.error('Error: ', error);
    //     }
    // };

    return (
        <div className='todo-app'>
                <div>
                    <AppNavbar 
                        Mode={Mode} 
                        setMode={setMode} 
                        openCreateNewNoteModal={openCreateNewNoteModal}
                        openAiNoteModal={openAiNoteModal}
                        searchNotes={searchNotes}
                        refresh={getNotes}
                        signout={signout}
                    />

                    <AiNoteCard 
                        showAiModal={showAiModal}
                        generateAiNote={generateAiNote}
                        handleClose={closeAiNoteModal}
                        generatingStatus={generatingAiResponseStatus}
                        setGeneratingStatus={setGeneratingAiResponseStatus}
                    />

                    <NoteCard
                        showNoteModal={showNoteModal}
                        isNew={IsNewNote}
                        Types={Types}
                        noteId={NoteId}
                        title={Title}
                        noteType={NoteType}
                        list={Tasks}
                        setList={setTasks}
                        message={Message}
                        createNew={createNew}
                        updateNote={updateNote}
                        handleDeleteNote={deleteNote}
                        handleClose={closeNote}
                    />


                    { !loading && 
                        <NoteGrid 
                            VisibleNotes={VisibleNotes} 
                            openNote={openNote} 
                        />
                    }
                    { loading &&
                        <div className='position-absolute top-50 start-50 translate-middle'>
                            <div className="spinner-border spinner-border-lg text-primary" style={{width: '4rem', height: '4rem'}} role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div> 
                        </div>
                    }

                    <Modal show={isSessionExpired} onHide={()=>setIsSessionExpired(false)} id='session-expired-modal'>
                        <button type='button' className='btn position-absolute top-0 end-0' id='icon' onClick={()=>setIsSessionExpired(false)}>
                            <IoCloseCircle size='2.5em' />
                        </button>

                        <Modal.Header className='border-0 pb-0 me-4'>
                            <h1>Session expired</h1>
                        </Modal.Header>

                        <Modal.Body className='border-0 mx-2'>
                            <p>Redirecting to login.</p>
                        </Modal.Body>

                        <Modal.Footer >
                            <button type='button' className='btn btn-primary px-3' onClick={signout}>Ok</button>
                        </Modal.Footer>
                    </Modal>
                </div>
            
        </div>
    );
};


export default TodoApp;