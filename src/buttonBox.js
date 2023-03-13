import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import * as constants from './sharedData'

var people = []

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

var built = false

function buildPeople(arr, oneName){
  if(!built){
  for(let i = 0; i < arr.length; i++){
    people.push(oneName ? {name: arr[i].name} : {
      first_name: arr[i].first_name,
      last_name: arr[i].last_name
    })
  }
    built = true
  }
}

export default function ButtonBox(height, peopleNew, oneName) {
//Visual height, array of people, true/false of whether there's "name" or "first_name, last_name"

if(peopleNew){
  buildPeople(peopleNew, oneName)
}

const [selected, setSelected] = useState(people[0])

var totalHeight = height - 1.5
const rowSize = 8
var rowIndex = 0
var currentRow = 0
const rowStrings = [
  'px-3 py-2 rounded-md text-sm font-medium',
  'px-3 py-12 rounded-md text-sm font-medium',
  'px-3 py-22 rounded-md text-sm font-medium',
  'px-3 py-32 rounded-md text-sm font-medium',
  'px-3 py-42 rounded-md text-sm font-medium',
]

for (let i = 0; i < people.length; i += 1) {
  people[i].sizeStr = rowStrings[currentRow]
  console.log(people[i].sizeStr)
  rowIndex += 1
  {
    if(rowIndex >= rowSize){
      currentRow += 1
      rowIndex = 0
    }
  }
}


//hardcoded for now ^
return (
    <div className="top-16 w-72">
      <div className="hidden md:block">
                    <div className="ml-7 flex items-baseline space-x-10">
                      {people.map((person, personIdx) => (
                        <div>
                        <div
                          key={person.name}
                          to={person.href}
                          className={constants.classNames(
                            person.current
                              ? 'bg-gray-800 text-white'
                              : 'text-gray-800 hover:bg-gray-700 hover:text-white',
                            person.sizeStr
                          )}
                          aria-current={person.current ? 'page' : undefined}
                        >
                          {person.first_name + " " + person.last_name}
                        </div>
                        </div>
                      ))}
                    </div>
                  </div>
    </div>
  )
}
