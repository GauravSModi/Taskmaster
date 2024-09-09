import React, { useState, useEffect } from 'react';
import { FaCirclePlus, FaRotate } from "react-icons/fa6";
import { IoSparklesSharp } from "react-icons/io5";
import { FaSignOutAlt } from "react-icons/fa";
import logo from "../../logo.svg";
import './Navbar.css';

function AppNavbar({Mode, setMode, openCreateNewNoteModal, openAiNoteModal, searchNotes, refresh, signout}) {

    const handleModeChange = (event) => {
        if (event.target.id != Mode) {
            setMode(event.target.id);
        }
    };

    return (
        <div className='container p-0 m-0'>
            {/* fixed-top */}
            {/* sticky-top */}
            <nav className="navbar z-1 fixed-top navbar-light bg-light shadow text-light">
                <div className="container-fluid">
                    <a className="navbar-brand p-0 m-0" >
                        <img src={logo} alt="logo" width="60" height="60"/>
                    </a>
                    <form className="d-flex">

                        <div className='d-flex justify-content-between m-2 p-2'>
                            <input className="form-control" id="searchField" type="search" placeholder="Search" aria-label="Search" onInput={(e) => searchNotes(e)}/>
                            {/* <button className="btn btn-outline-primary" type="button">Search</button> */}
                        </div>

                        <div className='btn-group m-2 p-2' role='group' aria-label="Basic radio toggle button group" >
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
                                className="btn btn-outline-primary h-5 " 
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
                                className="btn btn-outline-primary " 
                                htmlFor="btn-radio-lists" 
                                id="btn-radio-label">
                                    Lists
                            </label>
                        </div>
                    
                        <button className="btn m-2 p-2" type='button' onClick={openCreateNewNoteModal} id='create-new-note'> 
                                <FaCirclePlus color='#0d6efd' size='2em' title='Create New Note' className='createNewButton'/>
                        </button>

                        <button className="btn m-2 p-2" type='button' onClick={openAiNoteModal} id='create-new-ai'> 
                                <IoSparklesSharp color='#0d6efd' size='2em' title='AI notes' className='createNewAiButton'/>
                        </button>

                        <button className="btn m-2 p-2" type='button' onClick={refresh} id='create-new'> 
                                <FaRotate color='#0d6efd' size='2em' title='Refresh' className='refresh p-0 m-0'/>
                        </button>

                        <button className="btn m-2 p-2" type='button' onClick={signout} id='signout'> 
                                <FaSignOutAlt color='#0d6efd' size='2em' title='Sign-out' className='signout'/>
                        </button>
                    </form>
                </div>
            </nav>
        </div>
    );
}

export default AppNavbar;