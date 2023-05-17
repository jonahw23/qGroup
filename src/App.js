import React, { useState, useEffect } from 'react'
import ListCont from './Listcont'
import Header from './Header'
import SeatingEditor from './seating/SeatingEditor'
import * as constants from './sharedData'
import {
  Routes,
  Route,
} from "react-router-dom"
import ButtonBox from './buttonBox'
import Papa from 'papaparse'
import ListBox from './Listbox'
import Login from "./account/Login"

//Body of main page and API calls

//Constants for user and class 
//Current user 1 class 1 (Alice's Geometry Class)
//CSV goes to user 6 class 8 (Joe's optics class)
const pageUserId = 6

const pageCurrentNum = [0]
const pageClassId = [8]

const addUser = async (userName, userPw) => {
  const response = await fetch('http://127.0.0.1:5000/api/users/new', {
    method: 'POST',
    body: JSON.stringify({
      name: userName,
      password: userPw,
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const peopleAPI = await response
  console.log("Added")
}

const addClass = async (user_id, className) => {
  const response = await fetch('http://127.0.0.1:5000/api/users/' + user_id + '/class/new', {
    method: 'POST',
    body: JSON.stringify({
      user_id: user_id,
      name: className,
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const peopleAPI = await response
  console.log("Added")
}

const deleteClass = async (user_id, class_id) => {
  const response = await fetch('http://127.0.0.1:5000/api/users/' + user_id + '/class/' + class_id + '/delete_class', {
    method: 'DELETE',
    body: JSON.stringify({
      user_id: user_id,
      class_id: class_id,
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const peopleAPI = await response
  console.log("Deleted")
}

const getUsers = async () => {
  const response = await fetch('http://127.0.0.1:5000/api/users/list', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const peopleAPI = await response.json()
  console.log("PeopleAPI", peopleAPI)
  return peopleAPI
}

const getStudents = async (user_id, class_id) => {
  const response = await fetch('http://127.0.0.1:5000/api/users/' + user_id + '/class/' + class_id + '/students', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const peopleAPI = await response.json()
  console.log("students", peopleAPI)
  return peopleAPI
}

const getNumGroup = async (class_id, user_id, group_num) => {
  const response = await fetch("http://127.0.0.1:5000/api/users/" + user_id + "/class/" + class_id + "/meta_group/make_groups", {
    method: 'POST',
    body: JSON.stringify({
      meta_group_name: "meta_group_name",
      group_size: 0,
      group_amount: group_num,
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const peopleAPI = await response
  return peopleAPI
}

const addStudent = async (user_id, class_id, first_name, last_name) => {
  const response = await fetch("http://127.0.0.1:5000/api/users/" + user_id + "/class/" + class_id + "/add_student", {
    method: 'POST',
    body: JSON.stringify({
      first_name: first_name,
      last_name: last_name,
      class_id: class_id
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const peopleAPI = await response
  console.log("Student added")
}

const getGroupMeta = async (meta_id) => {
  const response = await fetch("http://127.0.0.1:5000/api/meta_groups/get_groups_from_metaID", {
    method: 'GET',
    body: JSON.stringify({
      meta_group_id: meta_id,
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const peopleAPI = await response
  return("meta?group", peopleAPI)
}

//addMetaGroup(1, 2, "NewMETAGROUP", 5)

//Testing the API, runs on refresh

//addUser("Joe User", "SafePassword")

//addClass(user_id, class_name)

//const otherPeople = getUsers()
//console.log("OtherPeople", otherPeople)
//console.log("TestPeople", constants.testPeople)

function fillUsers() {
  //Refill database users after database reset
  for (let i = 0; i < constants.testUsers.length; i++) {
    addUser(constants.testUsers[i].name, constants.testUsers[i].password)
  }
}

function fillClasses() {
  //Refill database classes after database reset (fill users first)
  for (let i = 0; i < constants.testClasses.length; i++) {
    addClass(constants.testClasses[i].id, constants.testClasses[i].name)
  }
}

function fillStudents() {
  //Refill database students after database reset (fill classes first)
  for (let i = 0; i < constants.testStudents.length; i++) {
    addStudent(pageUserId, pageClassId[0], constants.testStudents[i].first_name, constants.testStudents[i].last_name)
  }
}

export default function Example() {

  const [state, addToState] = useState([])
  const [rangeval, setRangeval] = useState(8)
  const [group_name, setGroup_name] = useState("Group")

  const [uploadedFile, setUploadedFile] = useState()
  const [lastClicked, setLastClicked] = useState(-1)

  const [useWeights, setUseWeights] = useState(false)


  const [addStudentToClass, setAddStudent] = useState(false)
  const [first_name, setFirstName] = useState("")
  const [last_name, setLastName] = useState("")



  //Random factor for render debugging
  var randomColor = Math.floor(Math.random() * 16777215).toString(16)

  //ListCont instance (dict where element:element, value:selected)
  const theList = ListCont('HardCoded', state.students, state.groups, false, lastClicked)

  //Header instance (dict as above, value:listbox value)
  const theHeader = Header(state.classes, 0)
  
  const [stateUser, setStateUser] = useState({stateUserId:pageUserId, stateClassId: 8})

  console.log("CURRENT:", theHeader.value)

  async function fetchData() {
    const users = await (await fetch('http://127.0.0.1:5000/api/users/list', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }, [])).json()
    const students = await (await fetch('http://127.0.0.1:5000/api/users/' + stateUser.stateUserId + '/class/' + pageClassId[0] + '/students', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })).json()
    const classes = await (await fetch('http://127.0.0.1:5000/api/users/' + stateUser.stateUserId + '/get_classes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })).json()
    const weights = await (await fetch('http://127.0.0.1:5000/api/users/' + stateUser.stateUserId + '/class/' + pageClassId[0] + '/get_weights', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })).json()
    const groups = await (await fetch('http://127.0.0.1:5000/api/users/' + stateUser.stateUserId + '/class/' + pageClassId[0] + '/meta_group/make_groups', {
      method: 'POST',
      body: JSON.stringify({
        meta_group_name: "Test metagroup name",
        group_size: 4,
        group_amount: 0,
        weights:weights,
        disable_weights:useWeights
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }, [])).json()
    const metaGroup = await (await fetch("http://127.0.0.1:5000/api/meta_groups/700/get_groups_from_metaID", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })).json()
    if (students && users && weights && groups && metaGroup) {
      addToState({ "students": students, "users": users, "classes": classes, "groups": groups, "weights": weights, "metaGroup": metaGroup})
    }
    else {
      console.log("Didn't add students or users or groups")
    }
  }

  console.log("metaGroup:", state.metaGroup)

  if(theHeader.value.class_id){
    if(theHeader.value.class_id !== pageClassId[0]){
      pageClassId[0] = theHeader.value.class_id
      setStateUser({stateUserId:pageUserId, stateClassId: theHeader.value.class_id})
      fetchData()
    } 
  }
  if(theHeader.value.makeNew){
    //alert("NEW CLASS IS:" + theHeader.value.newName)
    pageClassId[0] = state.classes.length - 1
    addClass(pageUserId, theHeader.value.newName)
    fetchData()
  }
  if(theHeader.value.deleteTime){
    //alert("DELETING:" + theHeader.value.classes)
    pageClassId[0] = state.classes.length - 1
    for(let i = 0; i < theHeader.value.classes.length; i++){
      deleteClass(pageUserId, theHeader.value.classes[i].class_id)
      fetchData()
    }
  }

  //console.log("state", state)

  useEffect(() => {
    fetchData()
  }, [])

  function useButtonSize() {
    async function fetchData() {
      const groups = await (await fetch('http://127.0.0.1:5000/api/users/' + stateUser.stateUserId + '/class/' + pageClassId[0] + '/meta_group/make_groups', {
        method: 'POST',
        body: JSON.stringify({
          meta_group_name: group_name,
          group_size: Number(rangeval),
          group_amount: 0,
          weights:state.weights,
          disable_weights:useWeights,

                }),
        headers: {
          'Content-Type': 'application/json'
        }
      }, [])).json()
      if (groups) {
        console.log("groups:", groups)
        addToState({ "students": state.students, "users": state.users, "groups": groups, "weights": state.weights, "metaGroup": state.metaGroup })
      }
      else {
        console.log("Didn't change groups")
      }
    }
    fetchData()
  }

  function useButtonNum() {
    async function fetchData() {
      const groups = await (await fetch('http://127.0.0.1:5000/api/users/' + stateUser.stateUserId + '/class/' + pageClassId[0] + '/meta_group/make_groups', {
        method: 'POST',
        body: JSON.stringify({
          meta_group_name: group_name,
          group_size: 0,
          group_amount: Number(rangeval),
          weights:state.weights,
          disable_weights:useWeights,

        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }, [])).json()
      if (groups) {
        console.log("groups:", groups)
        addToState({ "students": state.students, "users": state.users, "groups": groups, "weights": state.weights, "metaGroup": state.metaGroup})
      }
      else {
        console.log("Didn't change groups")
      }
    }
    fetchData()
  }

  const uploadStudents = async (user_id, class_id, dataFile) => {
    console.log("Uploading", dataFile)
    const response = await fetch("http://127.0.0.1:5000/api/users/" + user_id + "/class/" + class_id + "/upload_students", {
      method: 'POST',
      body: JSON.stringify({
        students: dataFile
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const peopleAPI = await response
  }

  const deleteStudent = async (user_id, class_id, student_id) => {
    const response = await fetch("http://127.0.0.1:5000/api/users/" + user_id + "/class/" + class_id + "/students/remove_student", {
      method: 'DELETE',
      body: JSON.stringify({
        student_id: student_id
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  function parseResults(dataFile) {
    const returnJson = []
    for (let i = 0; i < dataFile.length; i++) {
      const arr = dataFile[i][0].split(",")
      if (arr[0] && arr[1]) {
        const lastName = arr[0].trim()
        const firstName = arr[1].trim()
        returnJson.push({ first_name: firstName, last_name: lastName })
      }
    }
    console.log("json", returnJson)
    return returnJson
  }

  function submitForm() {
    //console.log(uploadedFile)
    const inputFile = uploadedFile
    if(uploadedFile){
    Papa.parse(inputFile[0], {
      complete: function(results) {
        const unparsedFile = results.data
        const parsedFile = parseResults(unparsedFile)
        //console.log("File", parsedFile)
        //This is file destination, should be changed to not be hardcoded
        uploadStudents(pageUserId, pageClassId[0], parsedFile)
      }
    })
  }
    fetchData()
  }

  function deleteStudentButton() {
    async function fetchData() {
      const deleteStudents = await( fetch("http://127.0.0.1:5000/api/users/" + stateUser.stateUserId + "/class/" + pageClassId[0] + "/students/remove_student", {
          method: 'DELETE',
          body: JSON.stringify({
            student_id: theList.value.id
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }))
      const students = await ((await fetch('http://127.0.0.1:5000/api/users/' + stateUser.stateUserId + '/class/' + pageClassId[0] + '/students', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })).json())
      if (deleteStudents && students) {
        //console.log(students)
        addToState({ "students": students, "users": state.users, "groups": state.groups, "weights": state.weights, "metaGroup": state.metaGroup})
      }
      else {
        console.log("Didn't delete students or refind")
      }
    }
    fetchData()
    //console.log("NewSetudenst:", state.students)
  }

  function swapAddStudent(){
    setAddStudent(!addStudentToClass)
  }

  function addStudentButton() {
    setAddStudent(false)
    addStudent(stateUser.stateUserId,pageClassId[0],first_name,last_name)
    fetchData()
    //console.log("NewSetudenst:", state.students)
  }

  /*
return({element: <>
      <input type="text" id="First Name" onChange={(event) => setFirstName(event.target.value)} name="First Name" placeholder="First" className=" h-9 pl-2 bg-gray-100 rounded-md appearance-none cursor-pointer dark:bg-gray-700"></input>
      <input type="text" id="Last Name" onChange={(event) => setLastName(event.target.value)} name="Last Name" placeholder="Last" className=" h-9 pl-2 bg-gray-100 rounded-md appearance-none cursor-pointer dark:bg-gray-700"></input>

      <button onClick={addStudentButton} className="h-9 rounded-md bg-green-500 text-white text-sm font-medium">
              Add Student
          </button>
    </>, value:newStudent})
  }
  */
 function makeAddStdentButton(){
  if (addStudentToClass){
    return(<div>
      <input type="text" id="First Name" onChange={(event) => setFirstName(event.target.value)} name="First Name" placeholder="First" className=" h-9 pl-2 bg-gray-100 rounded-md appearance-none cursor-pointer dark:bg-gray-700"></input>
      <input type="text" id="Last Name" onChange={(event) => setLastName(event.target.value)} name="Last Name" placeholder="Last" className=" h-9 pl-2  bg-gray-100 rounded-md appearance-none cursor-pointer dark:bg-gray-700"></input>

      <button onClick={addStudentButton} className="h-9 rounded-md bg-green-500 text-white text-sm font-medium">
              Add Student
          </button>
    </div>)
  }else{
    return(<button onClick={swapAddStudent} className="ml-3 w-8 mt-3 h-9 rounded-md bg-green-500 text-white text-sm font-medium">
                      Add
                    </button>)
  }
  }

  function minusWeightButton() {
    async function fetchData(user_id, class_id, stud_id1, stud_id2, weight) {
      const groupsUpdate = await fetch("http://127.0.0.1:5000/api/users/" + user_id + "/class/" + class_id + "/students/set_weight", {
        method: 'POST',
        body: JSON.stringify({
          stud_id1: stud_id1,
          stud_id2: stud_id2,
          weight: weight
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const weights = await (await fetch('http://127.0.0.1:5000/api/users/' + stateUser.stateUserId + '/class/' + pageClassId[0] + '/get_weights', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })).json()
      if (groupsUpdate && weights) {
        console.log("weights:", weights)
        addToState({ "students": state.students, "users": state.users, "groups": state.groups, "weights": weights, "metaGroup": state.metaGroup})
      }
      else {
        console.log("Didn't change weights")
      }
    }
    if(lastClicked > 0){
      fetchData(stateUser.stateUserId, pageClassId[0], theList.value.id, lastClicked, -1)
      setLastClicked(-1)
    }
    else{
      setLastClicked(theList.value.id)
    }
  }

  function plusWeightButton() {
    async function fetchData(user_id, class_id, stud_id1, stud_id2, weight) {
      const groupsUpdate = await fetch("http://127.0.0.1:5000/api/users/" + user_id + "/class/" + class_id + "/students/set_weight", {
        method: 'POST',
        body: JSON.stringify({
          stud_id1: stud_id1,
          stud_id2: stud_id2,
          weight: weight
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const weights = await (await fetch('http://127.0.0.1:5000/api/users/' + stateUser.stateUserId + '/class/' + pageClassId[0] + '/get_weights', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })).json()
      if (groupsUpdate && weights) {
        console.log("weights:", weights)
        addToState({ "students": state.students, "users": state.users, "groups": state.groups, "weights": weights, "metaGroup": state.metaGroup})
      }
      else {
        console.log("Didn't change weights")
      }
    }
    if(lastClicked > 0){
      fetchData(stateUser.stateUserId, pageClassId[0], theList.value.id, lastClicked, 1)
      setLastClicked(-1)
    }
    else{
      setLastClicked(theList.value.id)
    }
  }

  //console.log("state weights", state.weights)
  //console.log("state students", state.groups)

  const weightButtons = () => {
    if(lastClicked > 0){
    return (<div>
      <label className="ml-3 w-24 mt-0 h-12 rounded-md bg-white-500 text-black text-sm font-medium">Select Another Student</label>
      <p></p>
      <button onClick={minusWeightButton} className="ml-3 w-24 mt-0 h-12 rounded-md bg-red-500 text-white text-sm font-medium">
                      Add Negative Weight
                    </button>
                    <button onClick={plusWeightButton} className="ml-3 w-24 mt-0 h-12 rounded-md bg-green-500 text-white text-sm font-medium">
                      Add Positive Weight
                    </button></div>)
  }else{
   return(<div> <button onClick={plusWeightButton} className="ml-3 w-48 mt-6 h-12 rounded-md bg-blue-500 text-white text-sm font-medium">
                      Add Weight
                    </button></div>)
  }
}

const changeUseWeights = () => {
  setUseWeights(!useWeights)
}
  return (
      <div className="min-h-full">

        {theHeader.element}

        <main>
          <div className="mx-auto max-w-7xl py-4 sm:px-4 lg:px-4">
            <div className="px-4 py-1 sm:px-0">
              <div className="flex my-auto h-[85vh] rounded-lg border-4 border-dashed border-gray-200">

                <div className="w-18">
                  <div>{theList.element}</div>
                  <div class="mt-[47vh]">
                    {
                     weightButtons()
                    }
                    <button onClick={deleteStudentButton} className="ml-3 w-48 mt-3 h-9 rounded-md bg-red-500 text-white text-sm font-medium">
                      Delete Selected Student
                    </button>
                    {makeAddStdentButton()}
                    
                    <label class="block ml-5 mt-3 text-sm font-medium text-gray-900 dark:text-white" for="file_input">Upload classlist csv</label>
                    <input onChange={(event) => setUploadedFile(event.target.files)} class="block ml-3 w-62 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file"></input>
                    <button onClick={submitForm} className="ml-3 w-48 mt-2 h-9 rounded-md bg-gray-500 text-white text-sm font-medium">
                      Submit CSV
                    </button>
                  </div>
                </div>

                <div className="w-full h-full">
                  <Routes>
                    <Route path="/" element={
                      <div className="py-4">
                        {ButtonBox(85, state.students, state.groups, false, state.weights, theList.value.id)}
                        <div>
                          <div className="px-7 py-5">
                            <label for="steps-range" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Group size/number</label>
                            <input id="steps-range" type="range" onChange={(event) => setRangeval(event.target.value)} min="1" max="8" step="1" value={rangeval} className=" w-[20%] mb-0 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"></input>
                            <output className="ml-2 text-base font-medium text-gray-900">{rangeval}</output>
                            <button onClick={useButtonSize} className="ml-3 w-48 h-9 rounded-md bg-gray-500 text-white text-sm font-medium">
                              Make groups of that size
                            </button>
                            <button onClick={useButtonNum} className="ml-2 w-48 h-9 rounded-md bg-gray-500 text-white text-sm font-medium">
                              Make that many groups
                            </button>
                            <button onClick={changeUseWeights} className="ml-2 w-48 h-9 rounded-md bg-gray-500 text-white text-sm font-medium">
                              {(useWeights?"en":"dis") + "able weights"}
                            </button>
                          </div>
                          <label for="Group Name" className=" mb-2 font-medium text-gray-900 dark:text-white">Group Name: </label>

                          <input type="text" id="Group Name" onChange={(event) => setGroup_name(event.target.value)} name="Group Name" placeholder="Group" className=" w-[20%] mb-0 bg-gray-200 pl-2 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"></input>
                          <button onClick={()=>exportGroup(state.students,state.groups,group_name,theHeader.value.name)} className="ml-2 w-32 h-9 rounded-md bg-green-500 text-white text-sm font-medium">
                              Export Group
                            </button>
                        </div>
                      </div>
                    } />
                    <Route path="/seating" element={<SeatingEditor groups={state.groups} />} />
                  </Routes>
                </div>

              </div>
            </div>
          </div>
        </main>

      </div>
  )
}

const exportGroup = (students,groups,group_name,class_name) => {
  let cols = ["Last name","First name","Group"]
  
  let data = []

  if (!students || !groups){
    return
  }
  for (let i = 0; i < students.length;i++){
    let g = getGroupId(students[i],groups)
    if (g > -1){
      data.push([students[i]["last_name"],students[i]["first_name"],getGroupId(students[i],groups)+1])
    }
  }

  download_group(csvmaker(cols,data),group_name,class_name)
}

const getGroupId = (student,groups) => {
  for (let i = 0; i < groups.length;i++){
    for(let j = 0; j < groups[i].length;j++){
      if (student.id == groups[i][j]){
        return i
      }
    }
  }
  return -1
}


//addapted from geeksforgeeks
const download_group = function (data,group_name,class_name) {

	// Creating a Blob for having a csv file format
	// and passing the data with type
	const blob = new Blob([data], { type: 'text/csv' });

	// Creating an object for downloading url
	const url = window.URL.createObjectURL(blob)

	// Creating an anchor(a) tag of HTML
	const a = document.createElement('a')

	// Passing the blob downloading url
	a.setAttribute('href', url)

	// Setting the anchor tag attribute for downloading
	// and passing the download file name
	a.setAttribute('download', class_name+(group_name?" "+group_name:" Group")+'.csv');

	// Performing a download with click
	a.click()
}

const csvmaker = function (cols,data) {

	// Empty array for storing the values
	let csvRows = [];

	// Headers is basically a keys of an
	// object which is id, name, and
	// profession
	const headers = cols;

	// As for making csv format, headers
	// must be separated by comma and
	// pushing it into array
	csvRows.push(headers.join(','));

	// Pushing Object values into array
	// with comma separation
  for (let i = 0; i < data.length;i++){
    const values = data[i].join(',');
    csvRows.push(values)
  }


	// Returning the array joining with new line
	return csvRows.join('\n')
}