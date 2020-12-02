import { useEffect } from 'react'
import { isAuth } from '../../actions/auth'
import Router from 'next/router'

const Private = ({ children }) => {
  useEffect(() => {
    if (!isAuth()) {
      Router.push('/signin')
    }
  }, [])

  return <>{children}</>
}

export default Private
