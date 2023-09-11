/* eslint-disable @next/next/no-img-element */
'use client'

import { useState, Fragment } from 'react'
import Image from 'next/image'
import {
  StarIcon,
  ArchiveBoxIcon,
  UserIcon,
  Cog8ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisVerticalIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'
import { Menu, Transition } from '@headlessui/react'
import { useSession, signOut } from 'next-auth/react'

export default function Sidebar() {
  const [isExpand, setIsExpand] = useState<boolean>(false)
  const { data: session } = useSession()

  return (
    <aside className="fixed left-0 top-0 z-10 m-0 hidden h-screen flex-col bg-white shadow-md dark:bg-gray-900 md:flex">
      <div className="flex h-8 w-full justify-end">
        <button onClick={() => setIsExpand(!isExpand)}>
          {isExpand ? (
            <ChevronLeftIcon className="h-5 w-5 bg-gray-400 text-slate-900 dark:bg-gray-500" />
          ) : (
            <ChevronRightIcon className="h-5 w-5 bg-gray-400 text-slate-900 dark:bg-gray-500" />
          )}
        </button>
      </div>
      <ul className="flex-1 p-1">
        <SidebarIcon icon={<UserIcon className="h-5 w-5" />} text="Account" isExpand={isExpand} />
        <SidebarIcon
          icon={<ArchiveBoxIcon className="h-5 w-5" />}
          text="Archive"
          isExpand={isExpand}
        />
        <SidebarIcon icon={<StarIcon className="h-5 w-5" />} text="Favorites" isExpand={isExpand} />
        <Divider />
        <SidebarIcon
          icon={<Cog8ToothIcon style={{ width: '20px', height: '20px' }} />}
          text="Setting"
          isExpand={isExpand}
        />
      </ul>
      <Divider />
      <div className="my-1 flex justify-center p-1">
        <img
          src={
            session?.user?.image
              ? session.user.image
              : 'https://avatars.dicebear.com/api/open-peeps/2.svg'
          }
          alt=""
          className="h-8 w-8 rounded-full bg-gray-100 object-cover shadow-md"
        />
        {isExpand ? (
          <div className="ml-3 flex w-40 items-center justify-between transition-all">
            <div className="leading-4  text-gray-600 dark:text-gray-400">
              <h4 className="font-semibold">{session?.user?.name}</h4>
              <span className="text-xs">{session?.user?.email}</span>
            </div>
            <Menu as="div" className="relative">
              <Menu.Button>
                <EllipsisVerticalIcon className="mr-2 h-5 w-5 text-gray-600 dark:text-gray-400" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute bottom-10 right-0 mb-2 w-40 origin-bottom-right rounded-md bg-gray-200 p-1 focus:outline-none dark:bg-gray-700">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-gray-500 text-white' : ' text-gray-600 dark:text-gray-400'
                        } group inline-flex w-full items-center gap-6 rounded-md p-2 text-sm`}
                        onClick={() => signOut()}
                      >
                        <ArrowRightOnRectangleIcon className="h-5 w-5" />
                        <span>Sign Out</span>
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        ) : (
          <div className="w-0"></div>
        )}
      </div>
    </aside>
  )
}

const SidebarIcon = ({
  icon,
  text = 'tooltip',
  isExpand,
}: {
  icon: any
  text?: string
  isExpand: boolean
}) => {
  return (
    <>
      {isExpand ? (
        <li className="group relative my-2 cursor-pointer hover:rounded-md hover:bg-gray-200">
          <div
            className=" flex h-8 w-8  items-center justify-center 
              text-gray-600 dark:text-gray-400
            "
          >
            {icon}
            <span className="absolute left-8 ml-1 text-sm text-gray-600 dark:text-gray-400">
              {text}
            </span>
          </div>
        </li>
      ) : (
        <li className="group relative my-2 cursor-pointer  ">
          <div
            className=" flex h-8 w-8  items-center justify-center 
            rounded-3xl bg-gray-400 
         text-green-500
         shadow-lg transition-all
         duration-300 ease-linear hover:rounded-xl
         hover:bg-green-600  dark:bg-gray-800 "
          >
            {icon}
            <span className="invisible absolute left-full ml-4 -translate-x-3 rounded-md bg-gray-900 p-2 text-xs font-bold text-white opacity-5 shadow-md transition-all group-hover:visible group-hover:translate-x-0 group-hover:opacity-100">
              {text}
            </span>
          </div>
        </li>
      )}
    </>
  )
}

const Divider = () => (
  <hr
    className="mx-2 rounded-full 
border border-gray-200 bg-gray-200 dark:border-gray-800
dark:bg-gray-800"
  />
)
