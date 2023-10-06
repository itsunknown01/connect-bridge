import React from 'react'

const AuthLayout = ({children} : {children : React.ReactNode}) => {
  return (
    <div className='w-full h-screen flex justify-center items-center bg-[url(/login-bg.png)]'>
      {children}
    </div>
  )
}

export default AuthLayout
