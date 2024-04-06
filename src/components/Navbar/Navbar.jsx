import React, { useState, useEffect } from 'react';
import { FaCirclePlus } from "react-icons/fa6";
import './Navbar.css';

function AppNavbar({openCreateNew, Mode, setMode}) {

    const handleModeChange = (event) => {
        if (event.target.id != Mode) {
            setMode(event.target.id);
        }
    };


    return (
        <nav className="navbar fixed-top navbar-light bg-light shadow vw-100 text-light">
            <div className="container-fluid">
                <a className="navbar-brand text-light"></a>
                <form className="d-flex">

                    <div className='btn-group mx-2 my-2' role='group' aria-label="Basic radio toggle button group" >
                        <input 
                            type="radio" 
                            className="btn-check" 
                            name="btnradio" 
                            id="btn-radio-notes" 
                            autoComplete="off" 
                            checked={Mode === 'btn-radio-notes'}
                            onChange={handleModeChange} 
                            onClick={handleModeChange}/>
                        <label 
                            className="btn btn-outline-primary fs-5 px-4" 
                            htmlFor="btn-radio-notes" 
                            id="btn-radio-label" >
                                Notes
                        </label>

                        <input 
                            type="radio" 
                            className="btn-check" 
                            name="btnradio" 
                            id="btn-radio-lists" 
                            autoComplete="off" 
                            checked={Mode === 'btn-radio-lists'}
                            onChange={handleModeChange}
                            onClick={handleModeChange}/>
                        <label 
                            className="btn btn-outline-primary fs-5 px-4" 
                            htmlFor="btn-radio-lists" 
                            id="btn-radio-label">
                                Lists
                        </label>
                    </div>

                    {/* <input className="form-control mx-2" type="search" placeholder="Search" aria-label="Search"/> */}
                    {/* <button className="btn btn-outline-success mx-2 " type="button">Search</button> */}
                    {/* <button className="btn btn-primary fw-bold fs-3 p-3 lh-1" >Create new</button> */}
                    
                        <button className="btn" type='button' onClick={openCreateNew} id='create-new'> 
                                <FaCirclePlus color='#0d6efd' size='2.5em' title='Create New Note' className='createNewButton'/>
                        </button>
                </form>
            </div>
        </nav>
    );
}

export default AppNavbar;