import React, { useState, useEffect } from 'react';
import TodoList from './TodoList/TodoList';

const TodoApp = (props) => {

    useEffect(() => {
        // Function to be called immediately upon component mount
        getTodoList();
    }, []); // Empty dependency array ensures the effect runs only once

    const token = props.token;

    const getTodoList = async () => {
        try {
            const response = await fetch('http://localhost:8009/todo', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + props.token,
                    'Content-Type': 'application/json',
                },
                // body: JSON.stringify({ }),
            });

            if (response.ok) { // in the 200 range?
                const data = await response.json();
                const title = data.lists;
                console.log(title);
                
            } else {
                const errorData = await response.json();


            }
        } catch (error) {
            console.error('Error: ', error);
        }
    };

    

    return (
        <div className="card" style={{width: "18rem"}}>
            <div className="card-body">
                <h5 className="card-title">{props.token}</h5>
                {/* <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6> */}
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="#" className="card-link">Card link</a>
                <a href="#" className="card-link">Another link</a>
            </div>
        </div>
    );
};

export default TodoApp;