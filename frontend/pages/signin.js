import Head from 'next/head'
import Layout from '../components/Layout'
import Link from 'next/link'
import SigninComponent from '../components/auth/SigninComponent'
import style from './auth.module.scss'

const signup = () => {
  return (
    <Layout>
      <div className={style.signin}>
      <h1 className="text-center pt-4 pb-4">Signin</h1>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <SigninComponent/>
        </div>
      </div>
      </div>
    </Layout>
  )
}
export default signup