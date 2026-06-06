import React, {useState} from 'react';
import './MobileNav.scss';
import Backdrop from './Backdrop/Backdrop';
import Toolbar from './Toolbar/Toolbar';
import Sidebar from './Sidebar/Sidebar';

const MobileNav = () => {

  const [openSideDrawer, setOpenSideDrawer] = useState(false);
  function showDrawer(){
    setOpenSideDrawer(!openSideDrawer);
  }

  function backdropClickHandler(){
    setOpenSideDrawer(false);
  }

let sideDrawer;
  let backdrop;

  if(openSideDrawer){
    sideDrawer = <Sidebar click={backdropClickHandler}/>;
    backdrop = <Backdrop click={backdropClickHandler}/>;
  } 

    return (
      <div className='mobile-nav'>
          <Toolbar drawerClickHandler={showDrawer} iconHandler={openSideDrawer} />
          {sideDrawer}
          {backdrop}
      </div>
    )
}

export default MobileNav;