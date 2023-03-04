import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import ListBox from './Listbox'
import ListCont from './Listcont'

const user = {
  name: 'Tom Cook',
  email: 'tom@example.com',
  imageUrl:
    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
}
const navigation = [
  { name: 'Weighted Groups', href: '#', current: true },
  { name: 'Seating Chart', href: '#', current: false },
  { name: 'Other1', href: '#', current: false },
  { name: 'Other2', href: '#', current: false },
  { name: 'Other3', href: '#', current: false },
]
const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' },
]

const testPeople = [{
  id: 1,
  first_name: 'Wade',
  last_name: 'Cooper',
},
{
  id: 2,
  first_name: 'Joe',
  last_name: 'Bob',
},
{
  id: 3,
  first_name: 'FirstName',
  last_name: 'LastName',
},
{
  id: 1,
  first_name: 'Wade',
  last_name: 'Cooper',
},
{
  id: 2,
  first_name: 'Joe',
  last_name: 'Bob',
},
{
  id: 3,
  first_name: 'FirstName',
  last_name: 'LastName',
},
{
  id: 1,
  first_name: 'Wade',
  last_name: 'Cooper',
},
{
  id: 2,
  first_name: 'Joe',
  last_name: 'Bob',
},
{
  id: 3,
  first_name: 'FirstName',
  last_name: 'LastName',
},
{
  id: 1,
  first_name: 'Wade',
  last_name: 'Cooper',
},
{
  id: 2,
  first_name: 'Joe',
  last_name: 'Bob',
},
{
  id: 3,
  first_name: 'FirstName',
  last_name: 'LastName',
},
{
  id: 1,
  first_name: 'Wade',
  last_name: 'Cooper',
},
{
  id: 2,
  first_name: 'Joe',
  last_name: 'Bob',
},
{
  id: 3,
  first_name: 'FirstName',
  last_name: 'LastName',
},
{
  id: 1,
  first_name: 'Wade',
  last_name: 'Cooper',
},
{
  id: 2,
  first_name: 'Joe',
  last_name: 'Bob',
},
{
  id: 3,
  first_name: 'FirstName',
  last_name: 'LastName',
},
{
  id: 1,
  first_name: 'Wade',
  last_name: 'Cooper',
},
{
  id: 2,
  first_name: 'SecondtoLastTest',
  last_name: 'Bob',
},
{
  id: 3,
  first_name: 'FirstName',
  last_name: 'LastName',
},]

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
}

//Testing the API, runs on refresh
let x = 0
while (x < 3) {
  addUser("Joe User", "SafePassword")
  x++
}

addClass(5, "AP Econ")

const otherPeople = getUsers()
console.log("OtherPeople", otherPeople)
console.log("TestPeople", testPeople)

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Example() {
  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full">
        ```
      */}
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-neutral-400">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="h-8 w-18"
                        src="https://i.imgur.com/mGBBnE0.png"
                        alt="Your Company"
                      />
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-7 flex items-baseline space-x-2 space-y-0">
                        {new ListBox()}
                      </div>
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-7 flex items-baseline space-x-3">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.current
                                ? 'bg-gray-800 text-white'
                                : 'text-gray-800 hover:bg-gray-700 hover:text-white',
                              'px-3 py-2 rounded-md text-sm font-medium'
                            )}
                            aria-current={item.current ? 'page' : undefined}
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      <button
                        type="button"
                        className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                      >
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button>

                      {/* Profile dropdown */}
                      <Menu as="div" className="relative ml-3">
                        <div>
                          <Menu.Button className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            <span className="sr-only">Open user menu</span>
                            <img className="h-8 w-8 rounded-full" src={user.imageUrl} alt="" />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {userNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <a
                                    href={item.href}
                                    className={classNames(
                                      active ? 'bg-gray-100' : '',
                                      'block px-4 py-2 text-sm text-gray-700'
                                    )}
                                  >
                                    {item.name}
                                  </a>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>
              <Disclosure.Panel className="md:hidden">
                <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'block px-3 py-2 rounded-md text-base font-medium'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
                <div className="border-t border-gray-700 pt-4 pb-3">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <img className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium leading-none text-white">{user.name}</div>
                      <div className="text-sm font-medium leading-none text-gray-400">{user.email}</div>
                    </div>
                    <button
                      type="button"
                      className="ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    {userNavigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <main>
          <div className="mx-auto max-w-7xl py-4 sm:px-4 lg:px-4">
            {/* /Add content */}
            <div className="px-4 py-1 sm:px-0">
              <div className="my-auto h-[85vh] rounded-lg border-4 border-dashed border-gray-200">
                <div>{new ListCont(85, testPeople)}</div>
              </div>
            </div>
            {/* /End replace */}
          </div>
        </main>
      </div>
    </>
  )
}

export function display_student(student,styleClass=""){
  //no css made for this yet...
  return (
    
    <div className='student'>
      <div className={styleClass}>
            {student["last_name"] + " " + student["first_name"]}
      </div>
    </div>
  )
}

export function display_group(groups,n,styleclass="",student_styleClass=""){
  return(
    <div className = "group">
      <div className = {styleClass}>
          {n}
        {
          
          display_students(groups[n],student_styleClass)
        }

      </div>
    </div>
  )
}

function display_students(group,i,styleClass=""){
  if (i < group.length){
    return (
      <div>
        display_student(group[i],styleClass)
      display_students(group,i+1,styleClass)
      </div>
    )
  }
}