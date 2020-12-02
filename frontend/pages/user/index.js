import { useEffect } from 'react'
import Head from 'next/head'
import Layout from '../../components/Layout'
import Link from 'next/link'
import { isAuth } from '../../actions/auth'
import Router from 'next/router'
import Private from '../../components/auth/Private'

const userIndex = () => {
  return (
    <Layout>
      <Private>
        <div className='container'>
          <h1 className='pt-5 pb-5'>User Dashboard</h1>
          <ul className='list-group'>
            <li className='list-group-item'>
              <Link href='/profile'>
                <a>Edit Profile</a>
              </Link>
            </li>
            <li className='list-group-item'>
              <Link href='/profile'>
                <a>Change Password & Security</a>
              </Link>
            </li>
            <li className='list-group-item'>
              <Link href='/user/crud/Blog'>
                <a>Create Blogs</a>
              </Link>
            </li>
            <li className='list-group-item'>
              <Link href='/user/crud/Blogs'>
                <a>Update | Delete Blogs</a>
              </Link>
            </li>
          </ul>
        </div>
      </Private>
    </Layout>
  )
}
export default userIndex
