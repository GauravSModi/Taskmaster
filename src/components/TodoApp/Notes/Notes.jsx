import React, { useState, useEffect } from 'react';
import url from '../../../index'
import '../Todo.css';

const NoteCards = () => {
    const [ListTitles, setListTitles] = useState([]); // State to keep track of the list titles

    const openList = async (task) => {
        setListId(task.list_id);
    
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

    return (
        <div className='p-5 row '>
            {ListTitles.map(task => (
                <div
                    key={task.list_id}
                    id='cards'
                    className="card shadow-sm p-4 mx-3 my-4 rounded"
                    style={{width: "18rem"}}
                    onClick={() => openList(task)} >

                    <div className="card-title">{task.title}</div>
                </div>
            ))}
        </div>
    );
}

export default NoteCards;