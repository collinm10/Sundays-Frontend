import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import React from 'react';
import '../Component-CSS/Navibar-CSS.css'

function getToken() {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken;
}
  
function Navibar(){
    if(!getToken()){
        return (
            <div className="navibar">
                <Navbar>
                    <Navbar.Brand className="brand-name" href="/">Sundays</Navbar.Brand>
                    <Nav>
                        <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                        <Nav.Link href="/classes">Classes</Nav.Link>
                        <Nav.Link href="/settings">Settings</Nav.Link>
                        <Nav.Link className="d-flex" href="/">Login</Nav.Link>
                    </Nav>
                </Navbar>
            </div>
        );
    }
    else{
        return (
            <div className="navibar">
                <Navbar>
                    <Navbar.Brand className="brand-name" href="/">Sundays</Navbar.Brand>
                    <Nav>
                        <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                        <Nav.Link href="/classes">Classes</Nav.Link>
                        <Nav.Link href="/settings">Settings</Nav.Link>
                        <Nav.Link className="d-flex" href="/logout">Logout</Nav.Link>
                    </Nav>
                </Navbar>
            </div>
        );
    }
    
}

export default Navibar;