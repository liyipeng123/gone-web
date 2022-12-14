import React, { Fragment, ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, Transition } from '@headlessui/react'
import cn from 'classnames'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'

interface HeaderProps {
  logo?: string | ReactNode
  menus?: Array<{ name: string, path: string, children?: Array<{ name: string, path: string }> }>
}

export const Header: React.FC<HeaderProps> = ({
  logo = '',
  menus = []
}) => {
  const themes = ['dark', 'light']
  const [theme, setTheme] = React.useState('light')
  const clickTheme = (): void => {
    const index = themes.indexOf(theme)
    const next = themes[(index + 1) % themes.length]
    if (next === 'dark') {
      document.documentElement.classList.add('dark')
      localStorage.theme = 'dark'
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.theme = 'light'
    }
    setTheme(next)
  }
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // On page load or when changing themes, best to add inline in `head` to avoid FOUC
      if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark')
        setTheme('dark')
      } else {
        document.documentElement.classList.remove('dark')
        setTheme('light')
      }
    }
  }, [])
  // const user = useSelector(selectUser)

  const [menuType, setMenuType] = useState<'search' | 'close' | 'menu'>('search')

  const [search, setSearch] = useState<string>('')

  return (
    <header
      className="min-h-48 border-b border-solid border-b-light-line dark:bg-dark-light dark:border-b-dark-line align-middle">
      <div>
        {typeof logo === 'string' ? <h1>{logo}</h1> : logo}
      </div>
      <div className="flex space-x-5 text-sm text-gray-700 items-center dark:text-white">
        <div className={cn('flex-1 space-x-5', menuType === 'search' ? 'visible' : 'invisible')}>
          {menus.map((menu, index) => {
            return ((menu.children?.length) != null)
              ? (
                <Menu key={menu.name} as="div" className="relative inline-block text-center">
                  <Menu.Button className="hover:underline">{menu.name}</Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute -left-8 z-10 mt-2 w-24 origin-top-right
                                    rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5
                                    focus:outline-none dark:bg-dark-light dark:ring-dark-line ">
                      <div className="py-1">
                        {menu.children.map((child, index) => {
                          return (<Menu.Item key={child.name}>
                            {({ active }) => (
                              <Link
                                href={child.path}
                                className={cn(
                                  active ? 'bg-gray-100 text-gray-900 dark:bg-gray-800' : 'text-gray-700',
                                  'block px-4 py-2 text-sm dark:text-white'
                                )}
                              >
                                {child.name}
                              </Link>
                            )}
                          </Menu.Item>)
                        })}
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
                )
              : <Link key={menu.name} className="hover:underline" href={menu.path}>{menu.name}</Link>
          })}
        </div>
        <div
          className={cn('w-48 search absolute right-28 translate-x-3 -top-4 transition-all opacity-0 float-right', menuType === 'close' && 'top-4 opacity-100')}>
          <input
            className="border-b border-solid border-gray-500 text-center h-8 pr-5 outline-0 w-full box-border dark:bg-transparent"
            placeholder="????????????????????????" value={search} onChange={(e) => setSearch(e.target.value)}/>
          <button className="search-icon absolute right-0"></button>
        </div>
        <div className={cn(menuType, 'md:menu')} onClick={() => {
          setMenuType(menuType === 'close' ? 'search' : 'close')
        }}>
          <button className="nav-icon relative">
            <span></span>
          </button>
        </div>
        <div className="w-6 hover:cursor-pointer" onClick={clickTheme}>
          {
            theme === 'light' ? <SunIcon className="w-6 h-6"/> : <MoonIcon className="w-5 h-5"/>
          }
        </div>

      </div>
    </header>
  )
}
