import React, { useState, useEffect } from 'react';
import TodoList from './TodoList/TodoList';
import { Card } from 'react-bootstrap';

const TodoApp = (props) => {

    const [listTitles, setListTitles] = useState([]);

    useEffect(() => {
        // Function to be called immediately upon component mount
        getTodoList();
    }, []); // Empty dependency array ensures the effect runs only once

    const token = props.token;

    const openList = async (task) => {
        const list_id = task.list_id;
        console.log('openList: ' + list_id);
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
                console.log(data.tasks);
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
        // <div className="card" style={{width: "18rem"}}>
        //     <div className="card-body">
        //         <h5 className="card-title">{props.token}</h5>
        //         {/* <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6> */}
        //         <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
        //         <a href="#" className="card-link">Card link</a>
        //         <a href="#" className="card-link">Another link</a>
        //     </div>
        // </div>

        <div>
            {listTitles.map(task => (
                <div className="card shadow-sm p-2 mb-3 .bg-light.bg-gradient rounded" 
                    onClick={() => openList(task)} >
                    <div className="card-title">
                        {task.title}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TodoApp;