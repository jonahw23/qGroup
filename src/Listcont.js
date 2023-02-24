import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

var people = []

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

var built = false

function buildPeople(arr){
  if(!built){
  for(let i = 0; i < arr.length; i++){
    people.push({
      first_name: arr[i].first_name,
      last_name: arr[i].last_name
    })
  }
    built = true
  }
}

export default function ListCont(height, peopleNew) {

if(peopleNew){
  buildPeople(peopleNew)
}

const [selected, setSelected] = useState(people[0])

var totalHeight = height - 1.5
var hString = "absolute max-h-[" + totalHeight + "vh] w-full overflow-auto rounded-md bg-white text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"

return (
    <div className="top-16 w-72">
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative mt-0">

            {true && (
            <div>
            <Listbox.Options static className={hString}>
              {people.map((person, personIdx) => (
                <Listbox.Option static
                  key={personIdx}
                  className={({ selected }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                       selected ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                    }`
                  }
                  value={person}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {person.first_name + " " + person.last_name}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
            </div>)} 
        </div>
      </Listbox>
    </div>
  )
}
