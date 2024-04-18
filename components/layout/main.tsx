import React from 'react'
import Sidebar from '@/components/common/sidebar'
import { type HotList } from '@/types'

export interface MainProps {
  children: React.ReactNode
  hotList: HotList
}

const Main: React.FC<MainProps> = ({
  children,
  hotList
}) => {
  return <div
    className="relative lg:max-w-7xl md:max-w-5xl max-w-full m-auto px-4 py-3 flex items-start mt-0 justify-between gap-x-12 lg:min-w-[64rem] md:min-w-[48rem]">
    {children}
    <Sidebar hotList={hotList}/>
  </div>
}

export default Main
