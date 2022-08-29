import React from 'react';
import Navibar from './Navibar';
import '../App.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import '../Component-CSS/Dashboard-CSS.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {getAssignmentsDueThisWeek, setAssCompleted, updateDueDate} from '../services';

function getToken() {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    console.log(userToken);
    return userToken;
}

class Dashboard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            asses: [], 
            asses_gotten: false,
            edit_ass_form: false,
            active_ass_index: 0,
            selected_date: null,
            selected_time: '',
        }
    }
    
    componentDidMount() {
        //If the token doesn't exist then reload the page... we shouldn't be here yet
        let tok = parseInt(getToken());
        if(isNaN(tok)){
            window.location.reload(false);
        }

        let _asses = getAssignmentsDueThisWeek(tok);

        _asses.then((_assArray) => {
            this.setState({
                asses: _assArray,
                asses_gotten: true
            });
        });
    }

    onEditSubmitClick(event, ass, index){
        //Get our date
        let dat = new Date(this.state.selected_date);

        //Get our time
        let hours = this.state.selected_time.substring(0, 2);
        const minutes = this.state.selected_time.substring(3, 5);

        //if minutes or hours isn't parsable to int then return
        if(isNaN(minutes) || isNaN(hours)){
            alert("Please enter in the format - HH:MM am/pm... if it's like 8:00 enter 08:00 (easier for me)");
            return;
        }

        //Calculate proper hours based on am or pm
        const re = new RegExp('pm');
        hours = re.test(this.state.selected_time) ? parseInt(hours) + 12 : parseInt(hours);

        dat.setUTCHours(hours);
        dat.setUTCMinutes(minutes);

        let items = [...this.state.asses];

        let item = {...ass};

        item.due_date = dat;

        items[index] = item;

        updateDueDate(ass['pk'], dat);

        this.setState({asses: items})

        this.setState({selected_date: null, selected_time: '', edit_ass_form: false});
    }

    onEditClick = (event, ass, index) => {
        this.setState({
            edit_ass_form: true,
            active_ass_index: index,
        });
    }

    onDoneClick = (event, ass, index) => {
        let prom = setAssCompleted(ass['pk']);
        prom.then(() => {console.log("Ass completed successfully!")});
        let items = [...this.state.asses];

        let item = {...ass};

        item.completed = !item.completed;

        items[index] = item;

        this.setState({asses: items})
    }

    render(){
        let cards = <h1></h1>;
        if(this.state.asses_gotten){
            
            let row_count = [0, 0, 0, 0, 0, 0, 0];

            cards = this.state.asses.map((ass, index) => {
                
                const day = new Date(ass['due_date']).getDay();
                const style = {
                    gridColumnStart: (day + 1),
                    gridColumnEnd: (day + 2),
                    gridRowStart: (row_count[day] + 1, row_count[day] + 2)
                }

                row_count[day] = row_count[day] + 1;
                
                let full_time_print;

                let hours = new Date(ass['due_date']).getUTCHours();
                
                let minutes = new Date(ass['due_date']).getUTCMinutes();

                minutes = minutes < 10 ? '0' + minutes : minutes;

                if(hours > 12){
                    hours -= 12;
                    full_time_print = hours + ':' + minutes + ' pm';
                }
                else{
                    full_time_print = hours + ':' + minutes + ' am';
                }

                let ass_type_name = ass['assignment_type_name'];
                if(ass_type_name.substr(ass_type_name.length-1) === 's'){
                    ass_type_name = ass_type_name.slice(0, -1);
                }
                
                const css = ass['completed'] === false ? "indiv-card" : "indiv-card-completed";
                const buttons = (this.state.edit_ass_form && this.state.active_ass_index === index) ? 
                    <div>
                        <Button className="shadow-none cancel-button d-inline" onClick={(event) => {this.setState({selected_date: null, selected_time: '', edit_ass_form: false});}}>Cancel</Button>
                        <Button className="shadow-none edit-submit-button d-inline" onClick={ (event) => {this.onEditSubmitClick(event, ass, index)}}>Submit</Button>
                    </div> : 
                    <div>
                         <Button className="shadow-none edit-button d-inline" onClick={ (event) => {this.onEditClick(event, ass, index)}}>Edit</Button>
                         <Button className="shadow-none done-button d-inline" onClick={(event) => {this.onDoneClick(event, ass, index)}}>Done</Button>
                    </div>;

                const time = (this.state.edit_ass_form && this.state.active_ass_index === index) ? 
                <div className="new-date-picker">
                    <Card.Body> New Date
                        <DatePicker selected={this.state.selected_date} onSelect={(date) => {this.setState({selected_date: date})}}></DatePicker>
                        <br />
                        <br />
                        New Time
                        <input type="text" value={this.state.selected_time} onChange={(e) => {this.setState({selected_time: e.target.value})}}></input>
                    </Card.Body>
                </div> 
                : <Card.Body>{full_time_print}</Card.Body>;
                
                return(
                    <Card key={ass_type_name + ass['ass_number']} className={css} style={style}>
                        <Card.Title>{ass['class']}</Card.Title>
                        {time}
                        <Card.Text>{ass_type_name + ' ' + ass['ass_number']}</Card.Text>
                        {buttons}
                    </Card>
                );
                
            })
        }

        return (
            <div>
                <Navibar/>
                <div className="page">
                    <div className='header-style '>
                        <div className="grid">
                            <h3 className="week-name-0">This Week</h3>
                            <h3 className="week-names week-name-1">Monday</h3>
                            <h3 className="week-names week-name-2">Tuesday</h3>
                            <h3 className="week-names week-name-3">Wednesday</h3>
                            <h3 className="week-names week-name-4">Thursday</h3>
                            <h3 className="week-names week-name-5">Friday</h3>
                        </div>
                    </div>
                    <div className="grid card-stuff">
                        {cards}
                    </div>
                </div>
            </div>
        );
    }
    
}

export default Dashboard;