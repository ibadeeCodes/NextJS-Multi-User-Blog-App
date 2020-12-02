import { useState, useEffect } from 'react'
import { signin, authenticate, isAuth } from '../../actions/auth'
import Router from 'next/router'
import LoginGoogle from './LoginGoogle'

const SigninComponent = () => {
  const [values, setValues] = useState({
    email: 'ibad@gmail.com',
    password: '123456',
    error: '',
    loading: false,
    message: '',
    showForm: true,
  })

  const { email, password, error, loading, message, showForm } = values

  useEffect(() => {
    isAuth() && Router.push('/')
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    let user = { email, password }
    signin(user)
      .then((data) => {
        if (!data.success) {
          setValues({ ...values, error: data.message })
        } else {
          setValues({
            ...values,
            email: '',
            password: '',
            error: '',
            loading: false,
            message: data.message,
            showForm: false,
          })

          authenticate(data, () => {
            if (isAuth() && isAuth().role == 1) {
              Router.push('/admin')
            } else {
              Router.push('/user')
            }
          })
        }
      })
      .catch((err) => {
        console.log(err)
        setValues({ ...values, error: err.message })
      })
  }

  const handleChange = (e) => {
    setValues({ ...values, error: false, [e.target.name]: e.target.value })
  }

  const showLoading = () =>
    loading ? <div className='alert alert-info'>Loading..</div> : ''

  const showError = () =>
    error ? <div className='alert alert-danger'>{error}</div> : ''

  const showMessage = () =>
    message ? <div className='alert alert-info'>{message}</div> : ''

  const signinForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <input
            value={email}
            onChange={handleChange}
            type='email'
            name='email'
            className='form-control'
            placeholder='Type your email'
          />
        </div>

        <div className='form-group'>
          <input
            value={password}
            onChange={handleChange}
            type='password'
            name='password'
            className='form-control'
            placeholder='Type your password'
          />
        </div>

        <div>
          <button className='btn btn-primary'>Signin</button>
        </div>
      </form>
    )
  }

  return (
    <>
      {showLoading()}
      {showError()}
      {showMessage()}
      <LoginGoogle />
      {showForm && signinForm()}
    </>
  )
}

export default SigninComponent
