import React, { useState, useEffect } from 'react';
import '../Todo.css';
    
    const ListCards = () => {
        return (
            <div className='todo-list'>
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
            </div>
        );
    }