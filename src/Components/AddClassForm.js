import React, {Component} from 'react';
import '../App.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import '../Component-CSS/AddClassForm-CSS.css';
import InputGroup from 'react-bootstrap/InputGroup';
import {createNewClass} from '../services';

function getToken() {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    console.log(userToken);
    return userToken;
}

export class AddClassForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            class_name:'',
            numberOfAssignmentTypes: 1,
            assignmentTypes: [{
                'name':'',
                'weight': 0,
                'numberOfAssignments':0,
            },],
            submitted: false,
        }
    };

    handleSubmit = (event) => {
        let classObject = {
            grade: 0,
            name: this.state.class_name,
            user: getToken(),
        };

        console.log(classObject)
        const send_me = createNewClass(classObject, this.state.assignmentTypes);
        send_me.then(() => {
            console.log('Class created');
            this.setState({submitted: true});
        });
    }

    handleAssTypeChange = (event, index, property) => {
        let items = [...this.state.assignmentTypes];

        let item = {...items[index]};

        if(property !== 'name'){
            if(isNaN(event.target.value)){
                alert("please enter a number, if you break the site it's not on me");
                return;
            }
            item[property] = parseInt(event.target.value);
        }
        else
            item[property] = event.target.value;

        items[index] = item;

        this.setState({assignmentTypes: items})
    }

    handleIncreaseAssTypes = (event) => {

        const emptyAssignmentType = {
            'name':'',
            'weight': 0,
            'numberOfAssignments':0,
        };

        const {assignmentTypes} = this.state;
        assignmentTypes.push(emptyAssignmentType);

        this.setState(prevState => ({
            numberOfAssignmentTypes: prevState.numberOfAssignmentTypes + 1,
        }));
    }

    handleDecreaseAssTypes = (event) => {
        const {assignmentTypes} = this.state;
        assignmentTypes.pop(this.state.numberOfAssignmentTypes);

        console.log(assignmentTypes);

        this.setState(prevState => ({
            numberOfAssignmentTypes: prevState.numberOfAssignmentTypes - 1,
        }));
    }

    AssignmentTypeForm = (index, deleteButton) => {
        let butt = null;
        if(deleteButton){
            butt = <Button onClick={this.handleDecreaseAssTypes}>Delete Assignment Type</Button>;
        }

        return(
            <div key={index}>
                <div className= "assignment-type-form">
                    <h5>Assignment Type</h5>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Homework? Project?" onChange={(event) => {this.handleAssTypeChange(event, index, 'name')}} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Weight</Form.Label>
                        <InputGroup>
                            <Form.Control type="text" placeholder="ex: 20" onChange={(event) => {this.handleAssTypeChange(event, index, 'weight')}} />
                            <InputGroup.Text>%</InputGroup.Text>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Number of Assignments</Form.Label>
                        <Form.Control type="text" placeholder="ex: 6" onChange={(event) => {this.handleAssTypeChange(event, index, 'numberOfAssignments')}}/>
                    </Form.Group>
                    {butt}
                </div>
            </div>
        );
    }

    renderForm(){
        let assignmentTypeForms = [];

        for(var i = 0; i < this.state.numberOfAssignmentTypes; i++){
            assignmentTypeForms.push(this.AssignmentTypeForm(i, i === this.state.numberOfAssignmentTypes - 1));
        }

        return(
            <div className="popup-box">
                <div className="box">
                    <div className="center-me">
                        <Form className="add-class-form">
                            <Button className="exit-button" type="submit">X</Button>
                            <Form.Group className="mb-3" controlId="className">
                                <Form.Label>Class Name</Form.Label>
                                <Form.Control type="text" placeholder="Enter name" onChange={(event) => this.setState({class_name: event.target.value})}/>
                                <Form.Text className="text-muted">
                                It's not that deep
                                </Form.Text>
                            </Form.Group>
                            
                            {assignmentTypeForms}

                            <Form.Group className="mb-3 " controlId="assignmentTypes">
                                <Button onClick={this.handleIncreaseAssTypes}>Add assignment type</Button>
                            </Form.Group>

                            <Button variant="primary" type="submit" onClick={this.handleSubmit}>
                                Submit
                            </Button>
                        </Form>
                    </div>
                </div>
            </div>
            
        )
    }

    render(){

        return(
            <div>   
                {!this.state.submitted && this.renderForm()}
            </div>
        )
    }   
}

export default AddClassForm;
