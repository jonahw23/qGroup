import { Fragment } from 'react'
import React, { useState, useEffect } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import ListBox from './Listbox'
import ListCont from './Listcont'
import Header from './header'
import SeatingEditor from './seating/SeatingEditor.js'
import * as constants from './sharedData'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom"

//Body of main page and API calls

const pageUserId = 3
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

const addMetaGroup = async (class_id, user_id, meta_group_name, group_size) => {
  const response = await fetch("http://127.0.0.1:5000/api/users/" + user_id + "/class/" + class_id + "/meta_group/make_groups", {
    method: 'POST',
    body: JSON.stringify({
      meta_group_name: meta_group_name,
      group_size: group_size,
      group_amount: 0,
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const peopleAPI = await response
  console.log("Metagroup called")
}

const addStudent = async (class_id, user_id, first_name, last_name) => {
  const response = await fetch("http://127.0.0.1:5000/api/users/" + user_id + "/class/" + class_id + "/add_student", {
    method: 'POST',
    body: JSON.stringify({
      first_name: first_name,
      last_name: last_name,
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const peopleAPI = await response
  console.log("Student added")
}

addMetaGroup(1, 2, "NewMETAGROUP", 5)
addStudent(1, 3, "Bobstudent", "LastNameStudent")

//Testing the API, runs on refresh
let x = 0
while (x < 3) {
  //addUser("Joe User", "SafePassword")
  x++
}

addClass(5, "AP Econ")

const otherPeople = getUsers()
console.log("OtherPeople", otherPeople)
console.log("TestPeople", constants.testPeople)

getStudents(3, 1)

export default function Example() {

  const [state, addToState] = useState([])

  console.log("state", state)

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
    if(students && users){
      addToState({"students": students, "users": users})
    }
    else{
      console.log("Didn't add students or users")
    }
    }
    fetchData()
  }, [])

  console.log("state", state)

  return (
    <Router>
      <div className="min-h-full">

        {new Header()}

        <main>
          <div className="mx-auto max-w-7xl py-4 sm:px-4 lg:px-4">
            <div className="px-4 py-1 sm:px-0">
              <div className="my-auto h-[85vh] rounded-lg border-4 border-dashed border-gray-200">

                <div>{new ListCont(85, state.students, false)}</div>
                <>{}</>

                <Routes>
                  <Route path="/" element={""} />
                  <Route path="/seating" element={<SeatingEditor />} />
                </Routes>

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