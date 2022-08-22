import React, {useState, useEffect} from 'react';
import '../App.css';
import '../Component-CSS/ClassPage.css';
import {useParams} from 'react-router-dom';
import { getAssignmentTypesForClass, updateAssignment} from '../services';
import Navibar from './Navibar';
import {Card, Button} from 'react-bootstrap';

function ClassPage (){

    const params = useParams();
    const [assesGotten, setAssesGotten] = useState(false);
    const [asses, setAsses] = useState({});
    const [displayedAss, setDisplayedAss] = useState([[]]);
    const [editing, setEditing] = useState(false);
    const [firstTime, setFirstTime] = useState(true);
    const [rerun, setRereun] = useState(false);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        const promise = getAssignmentTypesForClass(params['id']);

        promise.then((data) => {
            setAsses(data);
            setAssesGotten(true);
        });
    },[reload]);

    let cards = <div></div>;
    const today = new Date();
    
    let return_class_card = <div></div>
    if(assesGotten){

        //Hold array of assignmen type averages
        let ass_type_averages = []

        let total_average = 0
        let ass_type_count = 0
        let total_weight = 0

        //Calculate the average for each assignment type
        Object.keys(asses).forEach((key, key_index) => {
            let sum = 0;
            let count = 0;
            Object.keys(asses[key]).forEach((ass, ass_index) => {
                if(asses[key][ass]['completed']){
                    count += 1
                    sum = sum + parseFloat(asses[key][ass]['grade'])
                }
            })

            ass_type_averages[key] = sum / count;
            if(ass_type_averages[key] != 0 && !isNaN(ass_type_averages[key])){
                const weighted_avg = (parseFloat(ass_type_averages[key]) * parseFloat(asses[key][asses[key].length - 1] / 100))
                total_average += weighted_avg
                ass_type_count++;
                total_weight += asses[key][asses[key].length - 1]
            }
        });

        total_average = total_average * (100 / total_weight)
        
        return_class_card = <div className="class-avg-card">
            <Card>
                <Card.Title>Class Average</Card.Title>
                <Card.Body>{total_average.toFixed(2)}</Card.Body>
            </Card>
        </div>

        let newDisplayedAss = createDisplayOject(asses);
        cards = Object.keys(asses).map((key, key_index) => {
            const ass_cards = Object.keys(asses[key]).map((ass, ass_index) => {

                if(ass_index === asses[key].length - 1)
                    return

                //Create the readable date
                const dat = new Date(asses[key][ass]['due_date']);

                //Display a color based on the due date for the assignment
                let ass_num_card_style = {backgroundColor: ''};

                if (asses[key][ass]['completed']){
                    ass_num_card_style['backgroundColor'] = '#6bff9c';
                }
                else if(today > dat){
                    ass_num_card_style['backgroundColor'] = '#ff6961';
                }
                else if(new Date(today).setUTCDate(today.getUTCDate() + 8) > dat){
                    ass_num_card_style['backgroundColor'] = '#FFE27C';
                }
                else{
                    ass_num_card_style['backgroundColor'] = '#BCBCBC';
                }

                let display_me = undefined;
                if(editing)
                    display_me = displayedAss;
                else
                    display_me = newDisplayedAss;

                //If this is our first time running this code then set our displayedAss var
                if(firstTime){
                    setDisplayedAss(newDisplayedAss);
                    setFirstTime(false); //Make sure we never set displayed ass in here again
                }

                return(
                    <div key={key + ass}>
                        <Card className = "ass-num-card" style={ass_num_card_style}>
                            <div className="input-grid">
                                <input type='text' className='input-field card-item-1' onChange={(e) => {setDisplayedAss(onDateChange(e, display_me, key_index, ass_index)); setEditing(true); setRereun(!rerun);}} style={ass_num_card_style} value={display_me[key_index][ass_index]['date']} />
                                <input type='text' className='input-field card-item-2' onChange={(e) => {setDisplayedAss(onTimeChange(e, display_me, key_index, ass_index)); setEditing(true); setRereun(!rerun);}} style={ass_num_card_style} value={display_me[key_index][ass_index]['time']} />
                                <input type='text' className='input-field card-item-3' onChange={(e) => {setDisplayedAss(onGradeChange(e, display_me, key_index, ass_index)); setEditing(true); setRereun(!rerun);}} style={ass_num_card_style} value={display_me[key_index][ass_index]['grade']} />
                            </div>
                        </Card>
                    </div>
                );
            });

            //What to display for the class average
            if(isNaN(ass_type_averages[key])){
                ass_type_averages[key] = 'N/A'
            }

            let button = <></>
            if(editing){
                button = <Button className="class-save-button" onClick={() => {onSaveClick(displayedAss, asses); setEditing(false); setReload(!reload)}}>Save</Button>
            }

            return(
                <Card className = "assignment-type-indiv">
                    <Card.Title className="card-title">{key}</Card.Title>
                    Average: {Number(ass_type_averages[key]).toFixed(2)}
                    <hr />
                    <Card.Body>{ass_cards}</Card.Body>
                    <div className="center">
                        {button}
                    </div>
                </Card>
            );
        });
    }

    return(
        <div className="page">
            <Navibar />
            {return_class_card}
            <div className="assignment-type-cards">
                {cards}
            </div>
        </div>
    );
}

// let ass_type = {0: {date: '08/03', time: '11:59', grade: '0'}, 1: {date: '08/05', time: '11:59', grade: '0'}, 2: {date: '08/06', time: '11:59', grade: '0'}, 3: {date: '08/07', time: '11:59', grade: '0'}}

function onDateChange(event, newDisplayedAssignment, key, assignment) {
    newDisplayedAssignment[key][parseInt(assignment)]['date'] = event.target.value;
    return newDisplayedAssignment;
}

function onTimeChange(e, newDisplayedAss, key, ass) {
    newDisplayedAss[key][ass]['time'] = e.target.value;
    return newDisplayedAss;
}
function onGradeChange(e, newDisplayedAss, key, ass) {
    newDisplayedAss[key][ass]['grade'] = e.target.value;
    return newDisplayedAss;
}

function onSaveClick(newDisplayedAss, asses){

    //I want to check which fields I actually changed
    let changed_assignments = []

    const hold_me = createDisplayOject(asses);

    Object.keys(hold_me).forEach((key, key_index) => {
        hold_me[key].forEach((ass, index) => {
            if(!haveSameData(ass, newDisplayedAss[key][index]))
                changed_assignments.push({key: key, ass_index: index})
        })
    })

    //Confirm all changes are valid

    changed_assignments.forEach((changed_ass) => {
        //First parse date
        const date = newDisplayedAss[changed_ass['key']][changed_ass['ass_index']]['date'];
        const date_regex = new RegExp('([0-1])?[0-9]\/[0-3]?[0-9]');
        const date_result = date_regex.exec(date)
        if(date_result === null){
            console.log("Couldn't parse date")
            return;
        }

        //Next parse time
        const time = newDisplayedAss[changed_ass['key']][changed_ass['ass_index']]['time'];
        const time_regex = new RegExp('([0-1])?[0-9]:[0-5][0-9]');
        const time_result = time_regex.exec(time)
        if(time_result === null){
            console.log("Couldn't parse time")
            return;
        }

        const grade = newDisplayedAss[changed_ass['key']][changed_ass['ass_index']]['grade'];
        const grade_regex = new RegExp('(1?[0-9][0-9])(.[0-9][0-9]?)?');
        if(grade_regex.exec(grade) === null && grade !== 'Grade: n/a'){
            console.log("Couldn't parse grade")
            return;
        }

        let valid_grade = grade_regex.exec(grade);
        
        if(valid_grade == null)
            valid_grade = 0;
        else
            valid_grade = parseFloat(valid_grade[0])

        try{
            let valid_date = new Date();

            if(date_result[0].length === 4){
                valid_date.setUTCMonth(parseInt(date_result[0].slice(0, 1)) - 1)
                valid_date.setUTCDate(parseInt(date_result[0].slice(2, 4)))
            }
            else{
                valid_date.setUTCMonth(parseInt(date_result[0].slice(0, 2)) - 1)
                valid_date.setUTCDate(parseInt(date_result[0].slice(3, 5)))
            }

            if(time_result[0].length === 4){
                valid_date.setUTCHours(parseInt(time_result[0].slice(0, 1)))
                valid_date.setUTCMinutes(parseInt(time_result[0].slice(2, 4)))
            }
            else{
                valid_date.setUTCHours(parseInt(time_result[0].slice(0, 2)))
                valid_date.setUTCMinutes(parseInt(time_result[0].slice(3, 5)))
            }

            const newData = {'due_date': valid_date, 'grade': valid_grade}
            updateAssignment(asses[Object.keys(asses)[changed_ass['key']]][0]['assignmentType'], changed_ass['ass_index'], newData)
        }
        catch{
            console.log("idk, it failed");
            return;
        }
    })
}

function createDisplayOject(asses){
    let newDisplayedAss = [];
    Object.keys(asses).map((key, key_index) => {
        Object.keys(asses[key]).map((ass, ass_index) => {

            if(ass_index === asses[key].length - 1)
                return

            //Create the readable date
            const dat = new Date(asses[key][ass]['due_date']);
            const month = (dat.getUTCMonth() + 1) < 10 ? '0' + (dat.getUTCMonth() + 1) : (dat.getUTCMonth() + 1);
            const day = (dat.getUTCDate()) < 10 ? '0' + (dat.getUTCDate()) : (dat.getUTCDate());

            const readable_date = month +'/'+ day;
            //-----------------------

            //Create readable time
            let hours = dat.getUTCHours();  
            let minutes = dat.getUTCMinutes();

            minutes = minutes < 10 ? '0' + minutes : minutes;

            let time = '';
        
            if(hours > 12){
                hours -= 12;
                time = hours + ':' + minutes + ' pm';
            }
            else if(hours == 0){
                time = '12:' + minutes + ' am';
            }
            else{
                time = hours + ':' + minutes + ' am';
            }
            //---------------------

            //Create readable grade
            const grade = asses[key][ass]['grade'] == 0 ? 'Grade: ' + 'n/a' : 'Grade: ' + asses[key][ass]['grade'];
            //---------------------
            
            //Create displayed object 
            const ass_display = {
                'date': readable_date,
                'time': time,
                'grade': grade,
            }

            //Check if the key and ass exist
            if(newDisplayedAss[key_index] !== undefined){
                if(newDisplayedAss[key_index][ass_index] !== undefined)
                    newDisplayedAss[key_index][ass_index] = ({...ass_display})
                else
                    newDisplayedAss[key_index].push({...ass_display})
            }
            else{
                newDisplayedAss[key_index] = []
                newDisplayedAss[key_index].push({...ass_display});
            }
        });
    });

    return newDisplayedAss;
}

const haveSameData = function (obj1, obj2) {
    const obj1Length = Object.keys(obj1).length;
    const obj2Length = Object.keys(obj2).length;

    if (obj1Length === obj2Length) {
        return Object.keys(obj1).every(
            key => obj2.hasOwnProperty(key)
                && obj2[key] === obj1[key]);
    }
    return false;
}

export default ClassPage;