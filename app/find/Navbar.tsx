'use client'

import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import SearchBar from './SearchBar'
import useDarkMode from '@/hooks/useDarkMode'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import {
  MoonIcon,
  SunIcon,
  Bars3Icon,
  MagnifyingGlassIcon,
  UserCircleIcon,
} from '@heroicons/react/24/solid'
import localforage from 'localforage'
import { useSession, signOut } from 'next-auth/react'
import { Menu, Transition } from '@headlessui/react'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = useSession()

  const handleSelect = async (item: string) => {
    router.push(`/${pathname.split('/')[1]}/${item}`)
    try {
      const recentSearches = ((await localforage.getItem('recent-search')) as string[]) || []
      if (!recentSearches.includes(item)) {
        recentSearches.push(item)
      }
      if (recentSearches.length > 5) {
        recentSearches.shift()
      }
      await localforage.setItem('recent-search', recentSearches)
    } catch (err: any) {
      throw new Error(err)
    }
  }
  return (
    <nav className="m-0 w-full bg-gray-800 bg-opacity-90 dark:bg-gray-800 md:bg-transparent ">
      <span className="flex h-[60px] w-full flex-row items-center gap-4 p-2">
        <button id="hamburger-button" className="text-slate-200 md:hidden ">
          <Bars3Icon className="h-6 w-6" />
        </button>
        <Image
          src="https://img.logoipsum.com/222.svg"
          alt=""
          width={138}
          height={30}
          className="md:hidden"
        />
        <div className="hidden md:block">
          <SearchBar onSelect={handleSelect} />
        </div>
        <button
          id="search-button"
          className="ml-auto text-slate-200 md:hidden"
          onClick={() => router.push('/find/mobile-search')}
        >
          <MagnifyingGlassIcon className="h-6 w-6" />
        </button>

        <div className="hidden md:ml-auto md:flex">
          <div className="mr-3 flex flex-row gap-4">
            <TopbarIcon icon={<ThemeIcon />} />
            {session ? (
              <Menu as="div" className="relative">
                <Menu.Button>
                  {session?.user?.image ? (
                    <div className="relative h-6 w-6">
                      <img
                        src={
                          session?.user?.image
                            ? session.user.image
                            : 'https://avatars.dicebear.com/api/open-peeps/2.svg'
                        }
                        alt=""
                        className="inline-block rounded-full"
                      />
                    </div>
                  ) : (
                    <span className="inline-block h-8 w-8 overflow-hidden rounded-full bg-stone-100">
                      <svg
                        className="h-full w-full text-stone-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </span>
                  )}
                </Menu.Button>
                <Transition
                  enter="transition duration-150 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-150 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Menu.Items className="absolute right-0 top-1 mt-1 w-44 origin-top-right rounded-md bg-gray-300 p-2 focus:outline-none dark:bg-gray-700">
                    <div className="flex items-center justify-center gap-4 p-1">
                      <img
                        src={
                          session?.user?.image
                            ? session.user.image
                            : 'https://avatars.dicebear.com/api/open-peeps/2.svg'
                        }
                        alt=""
                        className="h-6 w-6 rounded-full bg-gray-100 object-cover shadow-md"
                      />
                      <div className="leading-4  text-gray-600 dark:text-gray-400">
                        <p className="text-xs font-semibold">{session?.user?.name}</p>
                        <p className="text-xs font-light">{session?.user?.email}</p>
                      </div>
                    </div>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? 'bg-gray-500 text-white' : ' text-gray-600 dark:text-gray-400'
                          } group inline-flex w-full items-center gap-4 rounded-md p-1 text-sm`}
                          onClick={() => signOut()}
                        >
                          <ArrowRightOnRectangleIcon className="ml-1 h-5 w-5 text-stone-400" />
                          <span>Sign Out</span>
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <TopbarIcon icon={<UserCircleIcon className="h-6 w-6" />} />
            )}
          </div>
        </div>
      </span>
    </nav>
  )
}

const ThemeIcon = () => {
  const [darkTheme, setDarkTheme] = useDarkMode()
  const handleMode = () => setDarkTheme(!darkTheme)
  return (
    <span onClick={handleMode}>
      {darkTheme ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
    </span>
  )
}

const TopbarIcon = ({ icon }: any) => (
  <div
    className="
  cursor-pointer
  text-gray-500 transition duration-300 
  ease-in-out 
  hover:text-amber-500"
  >
    {icon}
  </div>
)
