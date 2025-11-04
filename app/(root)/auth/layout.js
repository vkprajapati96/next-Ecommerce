import React from 'react'

function layout({children}) {
  return (
    <div className='w-screen h-screen flex justify-center items-center' >{children}</div>
  )
}

export default layout