import React from 'react'
import Private from '../../components/auth/Private'
import Layout from '../../components/Layout'
import UserProfile from '../../components/auth/UserProfile'
import { isAuth } from '../../actions/auth'

const Profile = () => {
  const username = isAuth() && isAuth().username

  return (
    <Layout>
      <Private>
        <UserProfile username={username} />
      </Private>
    </Layout>
  )
}

export default Profile
