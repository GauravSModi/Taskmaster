import React, { useState, useEffect } from 'react';
import App_Sidebar from '../Sidebar/Sidebar';
import { Modal } from 'react-bootstrap';
import './Todo.css';

const TodoApp = (props) => {

    const [listTitles, setListTitles] = useState([]);
    const [List, setList] = useState(null); // State to keep track of the list
    const [Title, setTitle] = useState(null); // State to keep track of the title
    const [showModal, setShowModal] = useState(false); // State to manage modal visibility
    // const [collapsed, setCollapsed] = React.useState(false);


    useEffect(() => {
        // Function to be called immediately upon component mount
        getTodoList();
    }, []); // Empty dependency array ensures the effect runs only once

    const token = props.token;
    
    const closeList = () => {
        setTitle(null);
        setList(null);
        setShowModal(false); // Close the modal
    };

    const openList = async (task) => {
        const list_id = task.list_id;

        try {
            const response = await fetch('http://localhost:8009/list', {
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

    const getTodoList = async () => {
        try {
            const response = await fetch('http://localhost:8009/todo', {
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

    return (
        <div>
            <App_Sidebar/>
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
                                {/* <ul> */}
                                    {List.map(task => (
                                        <div 
                                            key={task[0]}
                                            className="form-check" >
                                                
                                                
                                            <input className="form-check-input" type="checkbox" id={task[0]}></input>
                                            <label className="form-check-label" for={task[0]}>
                                            {task[1]}
                                            </label>
                                        </div>
                                    ))}
                                {/* </ul> */}
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={closeList}>Close</button>
                        <button type="button" className="btn btn-primary">Save changes</button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};


export default TodoApp;