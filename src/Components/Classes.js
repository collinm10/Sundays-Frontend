import React from 'react';
import Navibar from './Navibar';
import '../App.css';
import '../Component-CSS/Classes.css';
import Card from 'react-bootstrap/Card';
import {getClassesForUser} from '../services';
import AddClassForm from './AddClassForm';
import { Link, Outlet } from "react-router-dom";

function getToken() {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    console.log(userToken);
    return userToken;
}

class Classes extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            classes: [], 
            classes_gotten: false,
            showAddClass: false,
        };
    }

    componentDidMount(){
        let classs = getClassesForUser(getToken());

        classs.then(_classes => {
            this.setState({
                classes: _classes,
                classes_gotten: true,
                reload: false,
            })
            console.log(_classes);
        });
    }

    render(){
        let cards = <h1></h1>;

        if(this.state.classes_gotten){

            let count = 0;

            cards = this.state.classes.map((klass) => {
                
                count = count + 1;
                const cardSubtitle = parseInt(klass['grade']) !== 0 ? <Card.Subtitle>{klass['grade']}</Card.Subtitle> : null;
                return(
                    <div>
                        <Link key={klass['pk']} className="card-link" to={`/class/${klass['pk']}`}>
                            <Card className="class-card">
                                <Card.Title>{klass['name']}</Card.Title>
                                {cardSubtitle}
                            </Card>
                        </Link>
                        <Outlet />   
                    </div>
 
                )
            })
        }

        return (
            <div>
                <Navibar />
                <div className="page">
                    <div className="class-card-stuff">
                        {cards}
                        <button className="add-button" onClick={() => this.setState({showAddClass: true})}><img className="plus-image" src={require('../Images/curved-plus-sign-cyan.png')} alt="photoshopped plus sign" /></button>
                    </div>
                    {this.state.showAddClass ? <AddClassForm /> : null}
                </div>
            </div>
        );
    }
}

export default Classes;