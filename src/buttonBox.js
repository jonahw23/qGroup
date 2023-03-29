import { Fragment, useEffect, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import * as constants from './sharedData'

var people = []
var groups = []
var weights = {}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const pageUserId = 2
const pageClassId = 10

var builtPeople = false
var builtGroups = false

function buildPeople(arr, oneName){
  if(!builtPeople){
  for(let i = 0; i < arr.length; i++){
    people.push(oneName ? {name: arr[i].name} : {
      first_name: arr[i].first_name,
      last_name: arr[i].last_name,
      id:  arr[i].id,
      group:0,
    })
  }
    builtPeople = true
  }
}

function buildGroups(arr){
  groups = []
  for(let i = 0; i < arr.length; i++){
    groups.push(arr[i])
    for(let j = 0; j < groups[i].length; j++){
      people[groups[i][j]].group = i
    }
  }
  //console.log("people", people)
}

function buildWeights(dict){
  weights = {}
  for (const [key1, value1] of Object.entries(dict)) {
    weights[key1] = value1
  }
  console.log("weights", weights)
}

function getWeight(id1,id2){
  //console.log("checking", id1, id2)
  if(weights){
  if (weights[id1]){
    if(weights[id1][id2]){
      return weights[id1][id2]
    }
    else if(weights[id2]){
      if(weights[id2][id1]){
        return weights[id2][id1]
      }
    }
  }
}
  return false
}

function randColor(){
  return constants.tailwindColorOptions[Math.floor(Math.random()*constants.tailwindColorOptions.length)]
}

export default function ButtonBox(height, peopleNew, groupsNew, oneName, weightsNew, selectedStudent) {
//Visual height, array of people, true/false of whether there's "name" or "first_name, last_name"

if(peopleNew){
  buildPeople(peopleNew, oneName, selectedStudent)
}
if(groupsNew){
  buildGroups(groupsNew)
}
if(weightsNew){
  buildWeights(weightsNew)
}

people.sort(function(a,b){return (a.group>b.group?1:-1)})

const [selected, setSelected] = useState()

//Random factor for render debugging
var randomColor = Math.floor(Math.random()*16777215).toString(16)

return (
    <div className="top-16 w-fill">
                    <div className="ml-7 flex flex-wrap justify-start gap-x-3 gap-y-2">
                      {people.map((person, personIdx) => (
                        <div>
                        <div
                          key={person.name}
                          to={person.href}
                          className={constants.classNames(
                            person.current
                              ? 'bg-gray-800 text-white'
                              : person.id === selectedStudent ? 'text-gray-800 bg-' + constants.tailwindColorOptions[person.group] + '-400 hover:bg-gray-700 hover:text-white w-60 px-4 py-2 rounded-md text-sm font-medium outline outline-3 outline-black' 
                              : getWeight(person.id, selectedStudent) > 0 ? 'text-gray-800 bg-' + constants.tailwindColorOptions[person.group] + '-300 hover:bg-gray-700 hover:text-white w-60 px-4 py-2 rounded-md text-sm font-medium outline outline-2 outline-green-600'
                              : getWeight(person.id, selectedStudent) < 0 ? 'text-gray-800 bg-' + constants.tailwindColorOptions[person.group] + '-300 hover:bg-gray-700 hover:text-white w-60 px-4 py-2 rounded-md text-sm font-medium outline outline-2 outline-red-500'
                              : 'text-gray-800 bg-' + constants.tailwindColorOptions[person.group] + '-300 hover:bg-gray-700 hover:text-white w-60 px-4 py-2 rounded-md text-sm font-medium outline-black'
                          )}
                          //aria-current={person.current ? 'page' : undefined}
                        >
                          {person.first_name + " " + person.last_name}
                        </div>
                        </div>
                      ))}
                    </div>
    </div>
  )
}
