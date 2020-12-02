import React from 'react'
import GoogleLogin from 'react-google-login'
import { GOOGLE_CLIENT_ID } from '../../config'
import { googleLogin, authenticate, isAuth } from '../../actions/auth'
import { useRouter } from 'next/router'

const loginGoogle = () => {
  const Router = useRouter()

  const responseGoogle = async (response) => {
    const tokenID = response.tokenId

    const user = { tokenID }

    let data = await googleLogin(user)

    if (data.error) {
      console.log(error)
    } else {
      authenticate(data, () => {
        if (isAuth() && isAuth().role === 1) {
          Router.push('/admin')
        } else {
          Router.push('/user')
        }
      })
    }
  }

  return (
    <div className='pb-3'>
      <GoogleLogin
        clientId={`${GOOGLE_CLIENT_ID}`}
        buttonText='Login with Google'
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        theme='dark'
      />
    </div>
  )
}

export default loginGoogle
