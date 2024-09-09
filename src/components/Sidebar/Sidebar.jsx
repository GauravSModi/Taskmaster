import { Sidebar, Menu, MenuItem, SubMenu, menuClasses, sidebarClasses } from 'react-pro-sidebar';
import './Sidebar.css';


function AppSidebar({token}) {
    return (
        <div className='sidebar z-3 position-absolute'
            style={{display: 'flex', height: '100%'}}>
            <Sidebar
                // collapsed // Collapses sidebar by default
                rootStyles={{
                    [`.${sidebarClasses.container}`]: {
                        backgroundColor: '#424874',
                        
                    },
                }}>
                <Menu
                    menuItemStyles={{
                        button: ({ level, active, disabled }) => {
                            // only apply styles on first level elements of the tree
                            // if (level === 0)
                            return {
                                color: disabled ? 'white' : 'white',
                                backgroundColor: active ? '#424874' : '#424874',
                            };
                            // or can do it this way:

                        // button: {
                        //     [`&.active`]: {
                        //         backgroundColor: '#13395e',
                        //         color: '#b6c8d9',
                        //     },
                        // },
                        },
                    }} >
                    <SubMenu subMenuStyles={{
                        button: ({ level, active, disabled }) => {
                            // only apply styles on first level elements of the tree
                            // if (level === 0)
                            return {
                                color: disabled ? 'white' : 'white',
                                backgroundColor: active ? '#424874' : '#424874',
                            };
                        },
                    }} 
                    className='submenu' label="Charts">
                    <MenuItem className='menuitem'> Pie charts </MenuItem>
                    <MenuItem className='menuitem'> Line charts </MenuItem>
                    </SubMenu>
                    <MenuItem className='menuitem'> Documentation </MenuItem>
                    <MenuItem className='menuitem'> Calendar </MenuItem>
                </Menu>
            </Sidebar>
        </div>
    );
};

export default AppSidebar;