import { useEffect } from 'react'
import Head from 'next/head'
import Layout from '../components/Layout'
import Link from 'next/link'
import { isAuth } from '../actions/auth'
import Router from 'next/router'

const Index = () => {
  useEffect(() => {
    !isAuth() && Router.push('/signin')
  }, [])
  return (
    <Layout>
      <div className='container'>
        <h1>Index Page</h1>
      </div>
    </Layout>
  )
}
export default Index
