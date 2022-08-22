import React from 'react';
import Navibar from './Navibar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../Component-CSS/Login.css';
import Card from 'react-bootstrap/Card';
import {useState, useEffect} from 'react';
import {useNavigate, Navigate} from 'react-router-dom';
import {login, signMeUp} from '../services';
import PropTypes from 'prop-types';

function getToken() {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken;
}
function setToken(userToken){
    localStorage.setItem('token', JSON.stringify(userToken));
}

export default function Login() {

    const [signup, setSignup] = useState(false);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();

    let nav;
    try{
        nav = useNavigate();
    }
    catch{
        nav = () => {};
    }
    let return_me = 
        <div className="page">
            <Navibar />
            <div className="login-flexbox">
                <Card className="padding m-top">
                    <Form onSubmit={(event) => {
                            const userToken = login(email, password); 
                            userToken.then((data) => {if(userToken == -1)return; setToken(data);}); 
                        }
                    }>
                        <Form.Group className="mb-3 text-boxes" controlId="formBasicEmail">
                            <Form.Label className="login-text">Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" onChange={e => setEmail(e.target.value)} />
                            <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3 text-boxes" controlId="formBasicPassword">
                            <Form.Label className="login-text">Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" onChange={e => setPassword(e.target.value)}/>
                        </Form.Group>
                        <Button variant="primary" type="submit" >
                            Login
                        </Button>
                    </Form>
                </Card>
            </div>
            <div className="sign-up-stuff">
                    <h5>Don't have an account?</h5>
                    <Button variant="secondary" className="m-left" onClick={() => {setSignup(true);}}>Sign Up</Button>
            </div>
        </div>

    if(signup){
        return_me = 
        <div>
            <div className="page">
            <Navibar />
            <div className="login-flexbox">
                <Card className="padding m-top">
                    <Form onSubmit={() => {
                        const token = signMeUp(email, password)
                        token.then((data) => {
                            setToken(data);
                            nav("/");
                        })
                    }}>
                        <Form.Group className="mb-3 text-boxes" controlId="formBasicEmail">
                            <Form.Label className="login-text">Email address</Form.Label>
                            <Form.Control type="email"  onChange={e => setEmail(e.target.value)} placeholder="Enter email" />
                            <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3 text-boxes" controlId="formBasicPassword">
                            <Form.Label className="login-text">Password</Form.Label>
                            <Form.Control onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
                        </Form.Group>
                        <Form.Group className="mb-3 text-boxes" controlId="formBasicPassword">
                            <Form.Label className="login-text">Confirm Password</Form.Label>
                            <Form.Control onChange={e => setConfirmPassword(e.target.value)} type="password" placeholder="Password" />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Sign Up
                        </Button>
                    </Form>
                </Card>
            </div>
            </div>
        </div>
    }


    if(getToken() != -1 && getToken() != null){
        return_me = <div className="page"><Navibar /> <Button onClick={() => {localStorage.clear(); setEmail('')} }>Logout</Button></div>
    }
    
    
    return(return_me)
}
