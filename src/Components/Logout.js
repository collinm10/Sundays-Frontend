import React from 'react';
import Navibar from './Navibar';
import Button from 'react-bootstrap/Button';
import {useNavigate} from 'react-router-dom';

export default function Logout() {

    let nav = useNavigate();
    const return_me = <div className="page"><Navibar /> <Button onClick={() => {localStorage.clear(); nav("/", {replace: true})} }>Logout</Button></div>
    
    return(return_me)
}
