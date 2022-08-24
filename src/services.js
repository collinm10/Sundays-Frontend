const axios = require('axios')
const backend_url = 'https://www.sundaysbackenddomainname.com/'

function getToken() {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    console.log(userToken);
    return userToken;
}

export const getClassesForUser = async (userId) => {
    try{
        const response = await axios.get(backend_url + 'user-classes/', { params: { user: userId } });
        return response.data;
    }
    catch(error){
        return [];
    }
}

export const getAssignmentsDueThisWeek = async (userId) => {
    try{
        const response = await axios.get(backend_url + 'week-assignments/',  { params: { user: userId } });
        console.log(response.data)
        return response.data;
    }
    catch(error){
        return [];
    }
}

export const createNewClass = async (classObject, assignmentTypeObjects) => {
    try{
        const response = await axios.post(backend_url + 'create-class/',  {classObject, assignmentTypeObjects});
        console.log(response)
        return response.data;
    }
    catch(error){
        return [];
    }
}

export const setAssCompleted = async (assignmentId) => {
    try{
        const response = await axios.put(backend_url + 'set-completed/',  {assignmentId});
        console.log(response)
        return response.data;
    }
    catch(error){
        return [];
    }
}

export const updateDueDate = async (assignmentId, newDate) => {
    try{
        const response = await axios.put(backend_url + 'update-due-date/',  {assignmentId, newDate});
        console.log(response);
        return response.data;
    }
    catch(error){
        return [];
    }
}

export const getAssignmentTypesForClass = async (classId) => {
    try{
        const response = await axios.get(backend_url + 'get-asses-class/',  { params: { classId: classId } });
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
        const response = await axios.put(backend_url + 'update-assignment/',  {assTypeId,assIndex, newData});
    }
    catch{
        
    }
}

export const login = async (email, password) => {
    try{
        const response = await axios.get(backend_url + 'log-me-in/', {params: {email: email, password: password}});
        console.log(response.data)
        return response.data;
    }
    catch(error){
        console.log(error);
        return [];
    }
}

export const signMeUp = async (email, password) => {
    console.log('hello')
    try{
        const response = await axios.post(backend_url + 'sign-me-up/',  {email: email, password: password});
        console.log(response.data)
        return response.data;
    }
    catch(error){
        console.log(error);
        return [];
    }
}
