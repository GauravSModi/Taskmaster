import React, { useState, useEffect } from 'react';
import { FaCirclePlus, FaRotate } from "react-icons/fa6";
// import { IoMdRefreshCircle } from "react-icons/io";
import logo from "../../logo.svg";
import './Navbar.css';

function AppNavbar({openCreateNew, Mode, setMode, refresh}) {

    const handleModeChange = (event) => {
        if (event.target.id != Mode) {
            setMode(event.target.id);
        }
    };

    // <img className="pb-5" src={logo} alt="My Logo" /> {/* Display the logo image */}

    return (
        <nav className="navbar fixed-top navbar-light bg-light shadow vw-100 text-light">
            <div className="container-fluid">
                <a className="navbar-brand" >
                    <img src={logo} alt="logo" width="60" height="60"/>
                </a>
                <form className="d-flex">
{/* 
                    <div className='d-flex justify-content-between m-2 p-2'>
                        <input className="form-control" type="search" placeholder="Search" aria-label="Search"/>
                        <button className="btn btn-outline-success" type="button">Search</button>
                    </div> */}
                    <button className="btn" type='button' onClick={refresh} id='create-new'> 
                            <FaRotate color='#0d6efd' size='2.5em' title='refresh' className='refresh p-0 m-0'/>
                    </button>

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
                
                    <button className="btn" type='button' onClick={openCreateNew} id='create-new'> 
                            <FaCirclePlus color='#0d6efd' size='2.5em' title='Create New Note' className='createNewButton'/>
                    </button>
                </form>
            </div>
        </nav>
    );
}

export default AppNavbar;