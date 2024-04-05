import React from 'react';
import { FaCirclePlus } from "react-icons/fa6";
import './Navbar.css';

function AppNavbar({openCreateNew}) {



    return (
        <nav className="navbar fixed-top navbar-light bg-light shadow vw-100 text-light">
            <div className="container-fluid">
                <a className="navbar-brand text-light"></a>
                <form className="d-flex">
                    <div className="btn-group btn-group-toggle mx-2 my-3" data-toggle="buttons">
                        <label className="btn btn-primary" id='btn-mode-note'>
                            {/* <input type="radio" name="options" id="option1" autoComplete="off" value={"Active"}  defaultChecked/> */}
                            {"Notes"}
                        </label>
                        <label className="btn btn-secondary active" id='btn-mode-list'>
                            {"Lists"}
                            {/* <input type="radio" name="options" id="option2" autoComplete="off" value={"Inactive"} /> */}
                        </label>
                    </div>

                    {/* <input className="form-control mx-2" type="search" placeholder="Search" aria-label="Search"/> */}
                    {/* <button className="btn btn-outline-success mx-2 " type="button">Search</button> */}
                    {/* <button className="btn btn-primary fw-bold fs-3 p-3 lh-1" >Create new</button> */}
                    
                        <button className="btn" type='button' onClick={openCreateNew} id='create-new'> 
                                <FaCirclePlus color='#337DFF' size='2.5em' title='Create New Note' className='createNewButton'/>
                        </button>
                </form>
            </div>
        </nav>
    );
}

export default AppNavbar;