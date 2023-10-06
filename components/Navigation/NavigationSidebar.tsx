import React from 'react'
import { Separator } from '../ui/separator'
import NavigationChatRoom from './NavigationChatRoom'

const NavigationSidebar = () => {
  return (
    <div className='space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22]'>
      <NavigationChatRoom />  
      <Separator className='h-0.5 bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto' />
    
    </div>
  )
}

export default NavigationSidebar