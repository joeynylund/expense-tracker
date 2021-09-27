import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { auth } from '../config/firebase';
import logo from '../assets/logo.png';

const Example = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/"><img src={logo} style={{width:'200px'}} /></NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
          </Nav>
          <UncontrolledDropdown nav inNavbar style={{display:"inline-block",justifyContent:'center'}} direction="left">
              <DropdownToggle nav caret>
                <div style={{display:'inline-block',alignItems:'center'}}>
                  <h6 style={{display:'inline', color:'#000'}}>Welcome Back{props.displayname !== null ? ', ' + props.displayname : null}!</h6>
                  {props.displayname !== null && <div style={{width:'40px',height:'40px',marginLeft:'10px',padding:'10px',background:'linear-gradient(315deg, #711CAC, #a229f6)',color:'#FFF',borderRadius:'40px',display:'inline-flex',alignItems:'center',justifyContent:'center'}}>{props.displayname.substring(0,1)}</div>}                </div>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={() => {auth.signOut(); window.location.reload() }}>
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
        </Collapse>
      </Navbar>
    </>
  );
}

export default Example;