import { Fragment, useState, useEffect } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

const people = [
  {
    id: 1,
    name: 'Wade Cooper',
    avatar:
      'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 2,
    name: 'Arlene Mccoy',
    avatar:
      'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 3,
    name: 'Devon Webb',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
  },
  {
    id: 4,
    name: 'Classes like this',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 5,
    name: 'Tanya Fox',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 6,
    name: 'Hellen Schmidt',
    avatar:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 7,
    name: 'Caroline Schultz',
    avatar:
      'https://images.unsplash.com/photo-1568409938619-12e139227838?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 8,
    name: 'Mason Heaney',
    avatar:
      'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 9,
    name: 'Claudie Smitham',
    avatar:
      'https://images.unsplash.com/photo-1584486520270-19eca1efcce5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 10,
    name: 'Emil Schaefer',
    avatar:
      'https://images.unsplash.com/photo-1561505457-3bcad021f8ee?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
]

var classes = []
var built = false

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function buildClasses(arr){
  classes = []
  for(let i = 0; i < arr.length; i++){
    if(classes.length < 500){
      classes.push(arr[i])
      classes[classes.length - 1].index = classes.length - 1
    }
  }
  classes.push({name:"Add Class (+)"})
  classes[classes.length - 1].index = classes.length - 1
  classes.push({name:"Delete Class (-)"})
  classes[classes.length - 1].index = classes.length - 1
}

export default function ListBox(classesNew, currentClassPageNum) {

  console.log("classes:", classesNew)

  const [selected, setSelected] = useState(classesNew ? classesNew[0] : {name:"Incomplete(Rendering)Class"})

  if(classesNew){
    buildClasses(classesNew)
    if(selected.name === "Incomplete(Rendering)Class"){
      setSelected(classes[currentClassPageNum])
    }
  }

  const [class_name, setClass_name] = useState("Class")
  const [newClass, setUploadClass] = useState({makeNew:false})
  const[toDelete, setDelete] = useState([])
  const[deleteTime, setDeleteTime] = useState(false)

  function newClassButton() {
    if(!(newClass.makeNew)){
      console.log("NEWCLASS:", newClass)
      setUploadClass({makeNew:true, newName:class_name})
    }
  }

  if(selected.name === "Add Class (+)"){
    if(newClass.makeNew){
      setUploadClass({makeNew:false})
      setSelected({name:"Incomplete(Rendering)Class"})
    }
    return({element: <>
      <input type="text" id="Class Name" onChange={(event) => setClass_name(event.target.value)} name="Class Name" placeholder="Class Name" className=" h-9 pl-2 bg-gray-100 rounded-md appearance-none cursor-pointer dark:bg-gray-700"></input>
          <button onClick={newClassButton} className="h-9 rounded-md bg-green-500 text-white text-sm font-medium">
              Create Class
          </button>
    </>, value:newClass})
  }

  function deleteClassButton() {
    if(!deleteTime){
      setDeleteTime(true)
    }
    else{
      alert("PUT SMTH HERE")
    }
  }

  //console.log("TODELTE:", toDelete)
  //console.log("SELCTED:", selected)

  if(selected.name === "Delete Class (-)"){
    if(deleteTime){
      setDeleteTime(false)
      setSelected({name:"Incomplete(Rendering)Class"})
    }
    return({element: <>
    <Listbox value={toDelete} onChange={setDelete} multiple>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-medium text-gray-700"></Listbox.Label>
          <div className="relative mt-1">
            <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
              <span className="flex items-center">
                <span className="ml-3 block truncate">{selected.name}</span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-100 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {classes.map((classes) => (
                  <Listbox.Option
                    key={classes.id}
                    className={({ selected, active }) =>
                      classNames(
                        active ? 'text-white bg-red-600' : selected ? 'text-white bg-red-400' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-3 pr-9'
                      )
                    }
                    value={classes}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          <span
                            className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                          >
                            {classes.name}
                          </span>
                        </div>

                        {/*selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-indigo-600',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            )}
                          >

                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                            ) : null*/}

                        { }
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
        <button onClick={deleteClassButton} className="h-9 rounded-md bg-red-500 text-white text-sm font-medium">
            Delete Classes
        </button>
    </>
    , value: deleteTime ? {deleteTime:true, classes:toDelete} : classes[classes.length-1]})
  }

  return ({element:
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-medium text-gray-700"></Listbox.Label>
          <div className="relative mt-1">
            <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
              <span className="flex items-center">
                <span className="ml-3 block truncate">{selected.name}</span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-100 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {classes.map((classes) => (
                  <Listbox.Option
                    key={classes.id}
                    className={({ active }) =>
                      classNames(
                        active ? 'text-white bg-indigo-600' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-3 pr-9'
                      )
                    }
                    value={classes}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          <span
                            className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                          >
                            {classes.name}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-indigo-600',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
, value: selected})
}
