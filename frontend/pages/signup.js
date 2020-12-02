import Head from 'next/head'
import Layout from '../components/Layout'
import Link from 'next/link'
import SignupComponent from '../components/auth/SignupComponent'
import style from './auth.module.scss'

const signup = () => {
  return (
    <Layout>
      <div className={style.signup}>
      <h1 className="text-center pt-4 pb-4">Signup</h1>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <SignupComponent/>
        </div>
      </div>
      </div>
    </Layout>
  )
}
export default signup