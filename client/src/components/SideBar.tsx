import { Sidebar, Menu, MenuItem, sidebarClasses, SubMenu} from "react-pro-sidebar";
import { Link } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import TableViewIcon from "@mui/icons-material/TableView";
import PersonIcon from "@mui/icons-material/Person";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useState } from "react";



export default function SideBar(){
  const [transactionsActive, setTransactionsActive] = useState(true);
  const [userMangementActive, setUserMangementActive] = useState(false);
  const [atmManagementActive, setAtmManagementActive] = useState(false);
  const [myAccountActive, setMyAccountActive] = useState(false);

  // Below functions update active state of menu items, if a menu item is clciked active state is set true and style is changed
  const handleTransactionsClick = () => {
    setTransactionsActive(true);
    setUserMangementActive(false);
    setAtmManagementActive(false);
    setMyAccountActive(false);
  }

  const handleUserMangementClick = () => {
    setTransactionsActive(false);
    setUserMangementActive(true);
    setAtmManagementActive(false);
    setMyAccountActive(false);
  }

  const handleAtmManagementClick = () => {
    setTransactionsActive(false);
    setUserMangementActive(false);
    setAtmManagementActive(true);
    setMyAccountActive(false);
  }

  const handleMyAccountClick = () => {
    setTransactionsActive(false);
    setUserMangementActive(false);
    setAtmManagementActive(false);
    setMyAccountActive(true);
  }

  return (
    //SideBar component with given styles and menu items
    <Sidebar
    rootStyles={{
      position: "sticky",
      top: 0,
      height: "100vh",
      [`.${sidebarClasses.container}`]: {
        backgroundColor: "#faf9f7",
      },
    }}>
      <Menu className="text-sm text-black" menuItemStyles={{
        button : ({ active }) => {
          return {
            backgroundColor: active ? "#d5d4cf" : undefined,
            "&:hover": {
              backgroundColor: "#e2e0de",
            },
          };
        }
      }}>
        <div className="flex flex-col h-screen p-2 gap-px">
          <MenuItem active={transactionsActive} icon= {<TableViewIcon/>} onClick={handleTransactionsClick}
            component={<Link to="/" />}>Transactions</MenuItem>
          <SubMenu label="Settings" icon={<SettingsIcon />}>
            <MenuItem active={userMangementActive} icon={<PersonIcon/>} onClick={handleUserMangementClick}
              component={<Link to="/settings/userMangement"/>}>User management</MenuItem>
            <MenuItem active={atmManagementActive} icon={<LocalAtmIcon/>} onClick={handleAtmManagementClick}
              component={<Link to="/settings/atmMangement"/>}>ATM management</MenuItem>
            <MenuItem active={myAccountActive} icon={<ManageAccountsIcon/>} onClick={handleMyAccountClick}
              component={<Link to="/settings/account"/>}>My account</MenuItem>
          </SubMenu>
        </div>
      </Menu>
    </Sidebar>
  )
}