import React from 'react';
import AppBar from 'material-ui/AppBar';
import LoginModal from '../login-modal/login-modal.component';


import './header.css';


const Header = () => {
    return (
        <AppBar
          title="Band Mom"
          style={{paddingTop: 5, paddingLeft: 24}}
          titleStyle={{minWidth: 100, paddingLeft: 60, fontSize: 38, fontFamily: 'cursive' || 'Roboto'}}
          //iconElementLeft={<DrawerMenu />}
          iconElementRight={<LoginModal/>}
        />
    );
}

export default Header;