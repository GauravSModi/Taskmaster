import React, { useState } from 'react';
import TodoItem from '../TodoItem/TodoItem';

function TodoList() {
    const [tasks, setTasks] = useState([
        {
            id: 1,
            text: "Doctor's appointment",
            completed: true
        },
        {
            id: 2,
            text: "Meeting at School",
            completed: false
        }
    ]);

    const [text, setText] = useState('');
    
    function addTask(text) {
        const newTask = {
            id: Date.now(),
            text,
            completed: false
        };

        setTasks([...tasks, newTask]);
        setText('');
    }

    function deleteTask(id) {
        setTasks(tasks.filter(task => task.id !== id));
    }

    function toggleCompleted(id) {
        setTasks(tasks.map(task => {
            if (task.id === id) {
                return {...task, completed: !task.completed};   // reverse the completion status
            } else {
                return task;
            }
        }));
    }
    
    return (
        <div className="TodoList">
            {tasks.map(task => (
                <TodoItem
                    key = {task.id}
                    task = {task}
                    deleteTask = {deleteTask}
                    toggleCompleted = {toggleCompleted}
                />
            ))}
            <input 
                value={text}
                onChange={E=> setText(E.target.value)}
            />
            <button
                onClick={() => addTask(text)}>
                Add
            </button>
        </div>
    );
}

export default TodoList;