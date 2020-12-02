import { useEffect } from 'react'
import Head from 'next/head'
import Layout from '../../../components/Layout'
import Link from 'next/link'
import { isAuth } from '../../../actions/auth'
import Router from 'next/router'
import Admin from '../../../components/auth/Admin'
import style from './category-tag.module.scss'
import Category from '../../../components/crud/Category'
import Tag from '../../../components/crud/Tag'
import Back from '../../../components/Back'

const CategoryTag = () => {
  return (
    <Layout>
      <Admin>
        <div className={style.categoryTag}>
          <div className='container'>
            <Back />
            <div className='row'>
              <div className='col-md-12 pt-2 pb-5'>
                <h1>Manage Category & Tags</h1>
              </div>

              <div className='col-md-6'>
                <h2>✅ Category</h2>
                <Category />
              </div>
              <div className='col-md-6'>
                <h2>✅ Tags</h2>
                <Tag />
              </div>
            </div>
          </div>
        </div>
      </Admin>
    </Layout>
  )
}
export default CategoryTag
