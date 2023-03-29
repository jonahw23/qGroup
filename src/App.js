import React, { useState, useEffect } from 'react'
import ListCont from './Listcont'
import Header from './Header'
import SeatingEditor from './seating/SeatingEditor'
import * as constants from './sharedData'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom"
import ButtonBox from './buttonBox'
import Papa from 'papaparse'

//Body of main page and API calls


//Constants for user and class 
//Current user 1 class 1 (Alice's Geometry Class)
//CSV goes to user 6 class 8 (Joe's optics class)
const pageUserId = 1
const pageClassId = 1

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
    addStudent(pageUserId, pageClassId, constants.testStudents[i].first_name, constants.testStudents[i].last_name)
  }
}

export default function Example() {

  const [state, addToState] = useState([])
  const [rangeval, setRangeval] = useState(8)
  const [uploadedFile, setUploadedFile] = useState()
  const [lastClicked, setLastClicked] = useState(-1)

  //Random factor for render debugging
  var randomColor = Math.floor(Math.random() * 16777215).toString(16)

  //ListCont instance (dict where element:element, value:selected)
  const theList = ListCont('HardCoded', state.students, state.groups, false, lastClicked)

  //console.log("state", state)

  useEffect(() => {
    async function fetchData() {
      const users = await (await fetch('http://127.0.0.1:5000/api/users/list', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }, [])).json()
      const students = await (await fetch('http://127.0.0.1:5000/api/users/' + pageUserId + '/class/' + pageClassId + '/students', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })).json()
      const classes = await (await fetch('http://127.0.0.1:5000/api/users/' + pageUserId + '/get_classes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })).json()
      const weights = await (await fetch('http://127.0.0.1:5000/api/users/' + pageUserId + '/class/' + pageClassId + '/get_weights', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })).json()
      const groups = await (await fetch('http://127.0.0.1:5000/api/users/' + pageUserId + '/class/' + pageClassId + '/meta_group/make_groups', {
        method: 'POST',
        body: JSON.stringify({
          meta_group_name: "Test metagroup name",
          group_size: 4,
          group_amount: 0,
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }, [])).json()
      if (students && users && groups) {
        addToState({ "students": students, "users": users, "classes": classes, "groups": groups, "weights": weights })
      }
      else {
        console.log("Didn't add students or users or groups")
      }
    }
    fetchData()
  }, [])

  function useButtonSize() {
    async function fetchData() {
      const groups = await (await fetch('http://127.0.0.1:5000/api/users/' + pageUserId + '/class/' + pageClassId + '/meta_group/make_groups', {
        method: 'POST',
        body: JSON.stringify({
          meta_group_name: "Test metagroup name",
          group_size: Number(rangeval),
          group_amount: 0,
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }, [])).json()
      if (groups) {
        console.log("groups:", groups)
        addToState({ "students": state.students, "users": state.users, "groups": groups, "weights": state.weights })
      }
      else {
        console.log("Didn't change groups")
      }
    }
    fetchData()
  }

  function useButtonNum() {
    async function fetchData() {
      const groups = await (await fetch('http://127.0.0.1:5000/api/users/' + pageUserId + '/class/' + pageClassId + '/meta_group/make_groups', {
        method: 'POST',
        body: JSON.stringify({
          meta_group_name: "Test metagroup name",
          group_size: 0,
          group_amount: Number(rangeval),
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }, [])).json()
      if (groups) {
        console.log("groups:", groups)
        addToState({ "students": state.students, "users": state.users, "groups": groups, "weights": state.weights})
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
    console.log(uploadedFile)
    const inputFile = uploadedFile
    Papa.parse(inputFile[0], {
      complete: function(results) {
        const unparsedFile = results.data
        const parsedFile = parseResults(unparsedFile)
        console.log("File", parsedFile)
        //This is file destination, should be changed to not be hardcoded
        uploadStudents(6, 8, parsedFile)
      }
    })
  }

  function deleteStudentButton() {
    //Should be refactored for auto-state-update, see below
    const delId = theList.value.id
    deleteStudent(pageUserId, pageClassId, delId)
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
      const weights = await (await fetch('http://127.0.0.1:5000/api/users/' + pageUserId + '/class/' + pageClassId + '/get_weights', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })).json()
      if (groupsUpdate && weights) {
        console.log("weights:", weights)
        addToState({ "students": state.students, "users": state.users, "groups": state.groups, "weights": weights})
      }
      else {
        console.log("Didn't change weights")
      }
    }
    if(lastClicked > 0){
      fetchData(pageUserId, pageClassId, theList.value.id, lastClicked, -1)
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
      const weights = await (await fetch('http://127.0.0.1:5000/api/users/' + pageUserId + '/class/' + pageClassId + '/get_weights', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })).json()
      if (groupsUpdate && weights) {
        console.log("weights:", weights)
        addToState({ "students": state.students, "users": state.users, "groups": state.groups, "weights": weights})
      }
      else {
        console.log("Didn't change weights")
      }
    }
    if(lastClicked > 0){
      fetchData(pageUserId, pageClassId, theList.value.id, lastClicked, 1)
      setLastClicked(-1)
    }
    else{
      setLastClicked(theList.value.id)
    }
  }

  //console.log("state weights", state.weights)

  return (
    <Router>
      <div className="min-h-full">

        <Header stateClass={state.classes}/>

        <main>
          <div className="mx-auto max-w-7xl py-4 sm:px-4 lg:px-4">
            <div className="px-4 py-1 sm:px-0">
              <div className="flex my-auto h-[85vh] rounded-lg border-4 border-dashed border-gray-200">

                <div className="w-18">
                  <div>{theList.element}</div>
                  <div class="mt-[47vh]">
                    <button onClick={minusWeightButton} className="ml-3 w-24 mt-0 h-12 rounded-md bg-red-500 text-white text-sm font-medium">
                      Add Negative Weight
                    </button>
                    <button onClick={plusWeightButton} className="ml-3 w-24 mt-0 h-12 rounded-md bg-green-500 text-white text-sm font-medium">
                      Add Positive Weight
                    </button>
                    <button onClick={deleteStudentButton} className="ml-3 w-48 mt-3 h-9 rounded-md bg-red-500 text-white text-sm font-medium">
                      Delete Selected Student
                    </button>
                    <label class="block ml-5 mt-3 text-sm font-medium text-gray-900 dark:text-white" for="file_input">Upload file</label>
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
                          </div>
                        </div>
                      </div>
                    } />
                    <Route path="/seating" element={<SeatingEditor />} />
                  </Routes>
                </div>

              </div>
            </div>
          </div>
        </main>

      </div>
    </Router>
  )
}

export function display_student(student, styleClass = "") {
  //no css made for this yet...
  let style = styleClass
  return (

    <div className='student'>
      <div className={style}>
        {student["last_name"] + " " + student["first_name"]}
      </div>
    </div>
  )
}

export function display_group(groups, n, styleClass = "", student_styleClass = "") {
  return (
    <div className="group">
      <div className={styleClass}>
        {n}
        {
          display_students(groups[n], student_styleClass)
        }
      </div>
    </div>
  )
}

function display_students(group, i, styleClass = "") {
  if (i < group.length) {
    return (
      <div>
        display_student(group[i],styleClass)
        display_students(group,i+1,styleClass)
      </div>
    )
  }
}