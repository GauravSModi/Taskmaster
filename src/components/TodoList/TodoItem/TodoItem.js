import React from 'react';

function TodoItem({task, deleteTask, toggleCompleted}){
    function handleChange() {
        toggleCompleted(task.id);
    }

    const strikethru = {
        textDecoration: 'line-through',
    };

    function strikeThroughStyle() {
        if (task.completed) {
            return {
                
            }
        } else {
            return {

            }
        }
    };

    return (
        <div className='todo-item'>
            <input
                type='checkbox'
                checked={task.completed}
                // style={strikeThroughStyle}
                onChange={handleChange}
            />
            <p>
                {task.text}
            </p>
            <button onClick={() => deleteTask(task.id)}>
                x
            </button>
        </div>
    )
}

export default TodoItem;