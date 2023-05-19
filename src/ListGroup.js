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
    name: 'groups like this',
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

var groups = []
var built = false

function classNames(...groups) {
  return groups.filter(Boolean).join(' ')
}

function buildgroups(arr){
  groups = []
  for(let i = 0; i < arr.length; i++){
    if(groups.length < 500){
      groups.push(arr[i])
      groups[groups.length - 1].index = groups.length - 1
    }
  }
  groups.push({name:"Change Group"})
  groups[groups.length - 1].index = groups.length - 1
}

export default function ListGroup(groupsNew, currentGroupPageNum) {

  console.log("ListGroupGroups:", groupsNew)

  const [selected, setSelected] = useState(groupsNew ? groupsNew[0] : {name:"Incomplete(Rendering)Group"})

  if(groupsNew){
    buildgroups(groupsNew)
    if(selected.name === "Incomplete(Rendering)Group"){
      setSelected(groups[currentGroupPageNum])
    }
  }

  const [group_name, setGroup_name] = useState("Group")
  const [newGroup, setUploadGroup] = useState({makeNew:false})
  const[toDelete, setDelete] = useState([])
  const[deleteTime, setDeleteTime] = useState(false)

  function newGroupButton() {
    if(!(newGroup.makeNew)){
      console.log("NEWGroup:", newGroup)
      setUploadGroup({makeNew:true, newName:group_name})
    }
  }

  if(selected.name === "Disabled function"){
    if(newGroup.makeNew){
      setUploadGroup({makeNew:false})
      setSelected({name:"Incomplete(Rendering)Group"})
    }
    return({element: <>
      <input type="text" id="Group Name" onChange={(event) => setGroup_name(event.target.value)} name="Group Name" placeholder="Group Name" className=" h-9 pl-2 bg-gray-100 rounded-md appearance-none cursor-pointer dark:bg-gray-700"></input>
          <button onClick={newGroupButton} className="h-9 rounded-md bg-green-500 text-white text-sm font-medium">
              Create Group
          </button>
    </>, value:newGroup})
  }

  function deleteGroupButton() {
    if(!deleteTime){
      setDeleteTime(true)
    }
    else{
      alert("PUT SMTH HERE")
    }
  }

  //console.log("TODELTE:", toDelete)
  //console.log("SELCTED:", selected)

  if(selected.name === "Disabled function"){
    if(deleteTime){
      setDeleteTime(false)
      setSelected({name:"Incomplete(Rendering)Group"})
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
                {groups.map((groups) => (
                  <Listbox.Option
                    key={groups.id}
                    className={({ selected, active }) =>
                      classNames(
                        active ? 'text-white bg-red-600' : selected ? 'text-white bg-red-400' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-3 pr-9'
                      )
                    }
                    value={groups}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          <span
                            className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                          >
                            {groups.name}
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
        <button onClick={deleteGroupButton} className="h-9 rounded-md bg-red-500 text-white text-sm font-medium">
            Delete groups
        </button>
    </>
    , value: deleteTime ? {deleteTime:true, groups:toDelete} : groups[groups.length-1]})
  }

  return ({element:
    <div className="ml-2 mr-2 inline-block w-[20%]">
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <Listbox.Label className="text-sm font-medium text-gray-700"></Listbox.Label>
          <div>
            <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
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
              <Listbox.Options className="-translate-y-full absolute z-10 -mt-10 max-h-56 w-50 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {groups.slice(0, -1).map((groups) => (
                  <Listbox.Option
                    key={groups.id}
                    className={({ active }) =>
                      classNames(
                        active ? 'text-white bg-indigo-600' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-3 pr-9'
                      )
                    }
                    value={groups}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          <span
                            className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                          >
                            {groups.name}
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
    </div>
, value: selected})
}
