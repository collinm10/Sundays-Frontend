const axios = require('axios')

function getToken() {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    console.log(userToken);
    return userToken;
}

export async function getAllUsers(){
    try{
        const response = await axios.get('http://127.0.0.1:8000/users');
        console.log('response ', response)
        return response.data
    }
    catch(error){
        return [];
    }
}

export const getUser = async () => {
    try{
        const response = await axios.get('http://127.0.0.1:8000/users/1');
        //console.log('response ', jsonResult);
        return response.data;
    }
    catch(error){
        return [];
    }
}

export const getClassesForUser = async (userId) => {
    try{
        const response = await axios.get('http://127.0.0.1:8000/user-classes/', { params: { user: userId } });
        return response.data;
    }
    catch(error){
        return [];
    }
}

export const getAssignmentsDueThisWeek = async (userId) => {
    try{
        const response = await axios.get('http://127.0.0.1:8000/week-assignments/',  { params: { user: userId } });
        console.log(response.data)
        return response.data;
    }
    catch(error){
        return [];
    }
}

export const createNewClass = async (classObject, assignmentTypeObjects) => {
    try{
        const response = await axios.post('http://127.0.0.1:8000/create-class/',  {classObject, assignmentTypeObjects});
        console.log(response)
        return response.data;
    }
    catch(error){
        return [];
    }
}

export const setAssCompleted = async (assignmentId) => {
    try{
        const response = await axios.put('http://127.0.0.1:8000/set-completed/',  {assignmentId});
        console.log(response)
        return response.data;
    }
    catch(error){
        return [];
    }
}

export const updateDueDate = async (assignmentId, newDate) => {
    try{
        const response = await axios.put('http://127.0.0.1:8000/update-due-date/',  {assignmentId, newDate});
        console.log(response);
        return response.data;
    }
    catch(error){
        return [];
    }
}

export const getAssignmentTypesForClass = async (classId) => {
    try{
        const response = await axios.get('http://127.0.0.1:8000/get-asses-class/',  { params: { classId: classId } });
        console.log(response);
        return response.data;
    }
    catch(error){
        return [];
    }
}

export const updateAssignment = async (assTypeId,assIndex, newData) => {
    let tok = getToken();
    try{
        const response = await axios.put('http://127.0.0.1:8000/update-assignment/',  {assTypeId,assIndex, newData});
    }
    catch{

    }
}

export const login = async (email, password) => {
    try{
        const response = await axios.get('http://127.0.0.1:8000/log-me-in/', {params: {email: email, password: password}});
        console.log(response.data)
        return response.data;
    }
    catch(error){
        return [];
    }
}

export const signMeUp = async (email, password) => {
    console.log('hello')
    try{
        const response = await axios.post('http://127.0.0.1:8000/sign-me-up/',  {email: email, password: password});
        console.log(response.data)
        return response.data;
    }
    catch(error){
        return [];
    }
}