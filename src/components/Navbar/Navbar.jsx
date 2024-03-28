import React from 'react';

function AppNavbar() {
    return (
        <nav className="navbar navbar-light text-light bg-dark ">
          <div className="container-fluid">
            <a className="navbar-brand text-light">Navbar</a>
            <form className="d-flex">
            <div className="btn-group btn-group-toggle" data-toggle="buttons">
                <label className="btn btn-secondary active">
                    {/* <input type="radio" name="options" id="option1" autoComplete="off" value={"Active"}  defaultChecked/> */}
                    {"Notes"}
                </label>
                <label className="btn btn-secondary">
                    {"Lists"}
                    {/* <input type="radio" name="options" id="option2" autoComplete="off" value={"Inactive"} /> */}
                </label>
            </div>
              <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
              <button className="btn btn-outline-success" type="submit">Search</button>
            </form>
          </div>
        </nav>
    );
}

export default AppNavbar;