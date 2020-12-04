import React from 'react'
import Private from '../../components/auth/Private'
import Layout from '../../components/Layout'
import Profile from '../../components/auth/Profile'
import { isAuth } from '../../actions/auth'

const Profile = () => {
  const username = isAuth() && isAuth().username

  return (
    <Layout>
      <Private>
        <Profile username={username} />
      </Private>
    </Layout>
  )
}

export default Profile
