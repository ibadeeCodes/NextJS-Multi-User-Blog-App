import { useEffect } from 'react'
import Head from 'next/head'
import Layout from '../../components/Layout'
import Link from 'next/link'
import { isAuth } from '../../actions/auth'
import Router from 'next/router'
import Admin from '../../components/auth/Admin'

const AdminIndex = () => {
  return (
    <Layout>
      <Admin>
        <div className='adminPanel'>
          <div className='container'>
            <h1 className='pt-5 pb-5'>Admin Dashboard</h1>
            <ul className='list-group'>
              <li className='list-group-item'>
                <Link href='/admin/crud/category-tag'>
                  <a>Categories & Tags</a>
                </Link>
              </li>
              <li className='list-group-item'>
                <Link href='/admin/crud/Blog'>
                  <a>Create Blogs</a>
                </Link>
              </li>
              <li className='list-group-item'>
                <Link href='/admin/crud/Blogs'>
                  <a>Update | Delete Blogs</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </Admin>
    </Layout>
  )
}
export default AdminIndex
