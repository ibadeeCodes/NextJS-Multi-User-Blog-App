import React from 'react'
import { BsChevronLeft } from 'react-icons/bs'
import { useRouter } from 'next/router'

const Back = () => {
  const router = useRouter()

  return (
    <button
      className='btn btn-secondary mb-5'
      onClick={() => {
        router.back()
      }}
      style={{ display: 'flex', alignItems: 'center' }}
    >
      <BsChevronLeft />
      Back
    </button>
  )
}

export default Back
