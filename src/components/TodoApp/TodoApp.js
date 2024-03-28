import React, { useState, useEffect } from 'react';
import AppSidebar from '../Sidebar/Sidebar';
import AppNavbar from '../Navbar/Navbar';
import NoteCard from './NoteCard/NoteCard';
import Notes from './Notes/Notes';
import './Todo.css';
import { url } from '../../index'


function TodoApp({token}) {

    const [ListTitles, setListTitles] = useState([]); // State to keep track of the list titles
    const [List, setList] = useState(null); // State to keep track of the list
    const [ListId, setListId] = useState(null); // State to keep track of the title
    const [Title, setTitle] = useState(null); // State to keep track of the title
    const [ShowModal, setShowModal] = useState(false); // State to manage modal visibility
    const [NoteType, setNoteType] = useState(true); // true for note, false for list
    const [IsNewNote, setIsNewNote] = useState(true); // State to manage if making new note vs showing an old one

    useEffect(() => {
        // Functions to be called immediately upon component mount
        getTodoLists();
    }, []); // Empty dependency array to ensure the effect runs only once

    
    const closeList = () => {
        console.log('closeList');
        setShowModal(false); // Close the modal
        setTitle(null);
        setList(null);
        setListId(null);
    };


    const openCreateNew = () => {
        console.log("OpenCreateNew")
    }

    // const openNote = async ()

    const openList = async (task) => {

        setListId(task.list_id);


        // if (task.list_id === -1) {
        //     // setShowModal(true);
        //     return;
        // }

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

    const getTodoLists = async () => {
        console.log('getTodoLists');
        try {
            const response = await fetch(url + '/getLists', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) { // in the 200 range)
                const data = await response.json();
                if (data.lists === "No Lists Found") {
                    setListTitles([{list_id: -1}])
                    console.log("Nope, no lists found");
                    return;
                }
                setListTitles(data.lists);

            } else {
                const errorData = await response.json();
                console.log(errorData);
            }
        } catch (error) {
            console.error('Error: ', error);
        }
    };

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
                        'list_id': ListId, 
                        'title': newTitle 
                    })
                });
                if (response.ok) {
                    const data = await response.json();
                    const listWithNewTitle = ListTitles.find(currList => currList.list_id === ListId);
                    
                    if (listWithNewTitle) {
                        listWithNewTitle.title = newTitle;
                    }
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
        <div>
            {/* <AppSidebar/> */}
            <AppNavbar/>
            <div>
                <NoteCard
                    ShowModal={ShowModal}
                    // isNew={isNew}
                    // isNote={isNote}
                    // isList={isList}
                    handleDeleteTask={handleDeleteTask}
                    handleClose={closeList}
                    title={Title}
                    list={List}
                    updateList={updateTitle}
                />

                <Notes listTitles={ListTitles} openList={openList} openCreateNew={openCreateNew} />


            </div>
        </div>
    );
};


export default TodoApp;