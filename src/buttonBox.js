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
//hardcoded for now ^
return (
    <div className="top-16 w-72">
      <div className="hidden md:block">
                    <div className="ml-7 flex items-baseline space-x-10">
                      {people.map((person, personIdx) => (
                        <div
                          key={person.name}
                          to={person.href}
                          className={constants.classNames(
                            person.current
                              ? 'bg-gray-800 text-white'
                              : 'text-gray-800 hover:bg-gray-700 hover:text-white',
                            'px-3 py-2 rounded-md text-sm font-medium'
                          )}
                          aria-current={person.current ? 'page' : undefined}
                        >
                          {person.first_name + " " + person.last_name}
                        </div>
                      ))}
                    </div>
                  </div>
    </div>
  )
}
