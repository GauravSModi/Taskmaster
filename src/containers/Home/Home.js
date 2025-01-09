import React from 'react';
import TodoApp from '../../apps/Todo/Todo';
// import AppSidebar from '../../components/Sidebar/Sidebar';

function Home ({ token }){
    return (
        // <div className='home d-flex flex-row' id='home'>
        <div>
                {/* <AppSidebar
                    className='z-3'
                    token={token}
                /> */}
                <TodoApp
                    token={token}
                />
        </div>
    );
}

export default Home;