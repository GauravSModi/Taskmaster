import React, { useState, useEffect } from 'react';
import AppSidebar from '../Sidebar/Sidebar';
import { CloseButton, Modal } from 'react-bootstrap';
import './Todo.css';

const TodoApp = (props) => {

    const url = 'http://localhost:8009';

    const [listTitles, setListTitles] = useState([]);
    const [List, setList] = useState(null); // State to keep track of the list
    const [Title, setTitle] = useState(null); // State to keep track of the title
    const [showModal, setShowModal] = useState(false); // State to manage modal visibility
    const [hoveredTask, setHoveredTask] = useState(null); // State to keep track of the current hovered task

    useEffect(() => {
        // Functions to be called immediately upon component mount
        getTodoLists();
    }, []); // Empty dependency array ensures the effect runs only once

    const token = props.token;
    
    const closeList = () => {
        setShowModal(false); // Close the modal
        setTitle(null);
        setList(null);
    };

    const saveChangesList = async () => {
        try {
            const response = await fetch(url + '/saveChangesList', {
                method: 'PUT',
                headers: { 
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({})
            });
        } catch (error) {
            console.error('Error: ', error);
        }
    };

    const openList = async (task) => {
        const list_id = task.list_id;

        try {
            const response = await fetch(url + '/getList', {
                method: 'POST',
                headers: { 
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ list_id }),
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
        try {
            const response = await fetch(url + '/todo', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) { // in the 200 range
                const data = await response.json();
                setListTitles(data.lists);

            } else {
                const errorData = await response.json();
                console.log(errorData);
            }
        } catch (error) {
            console.error('Error: ', error);
        }
    };

    const handleTaskHover = (task_id) => {
        setHoveredTask(task_id);
    };

    const handleTaskLeave = () => {
        setHoveredTask(null);
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
            <div>
                {listTitles.map(task => (
                    <div
                        key={task.list_id}
                        id='cards'
                        className="card shadow-sm p-2 mb-3 rounded"
                        style={{width: "18rem"}}
                        onClick={() => openList(task)} >

                        <div className="card-title">{task.title}</div>
                    </div>
                ))}
                
                {/* Modal Component */}
                <Modal show={showModal} onHide={closeList}>
                    <Modal.Header closeButton>
                        <Modal.Title>{List && Title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {List && (
                            <div>
                                {List.map(task => (
                                    <div 
                                        key={task[0]}
                                        className="form-check"
                                        onMouseEnter={() => handleTaskHover (task[0])}
                                        onMouseLeave={handleTaskLeave} 
                                        onFocus={() => handleTaskHover (task[0])}
                                        onBlur={handleTaskLeave}>
                                        <input className="form-check-input" type="checkbox" id={task[0]} ></input>
                                        <label className="form-check-label" htmlFor={task[0]}>
                                        {task[1]}
                                        </label>
                                            {hoveredTask === task[0] && (
                                                <CloseButton 
                                                    className='taskDeleteBttn' 
                                                    onClick={() => handleDeleteTask(task[0])}
                                                />
                                            )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-secondary btn" data-bs-dismiss="modal" onClick={closeList}>Cancel</button>
                        <button type="button" className="btn btn-primary w-25" onClick={saveChangesList}>Save</button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};


export default TodoApp;