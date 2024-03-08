import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import './Sidebar.css';


const App_Sidebar = () => {
    return (
        <div className='app-sidebar'>
            <Sidebar>
                <Menu>
                    <SubMenu  className='menuitem' label="Charts">
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

export default App_Sidebar;