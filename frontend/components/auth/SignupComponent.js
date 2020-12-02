import { useState, useEffect } from 'react'
import { signup, isAuth } from '../../actions/auth'
import Router from 'next/router'

const SignupComponent = () => {
  const [values, setValues] = useState({
    name: 'ibad',
    email: 'ibad@gmail.com',
    password: '123456',
    error: '',
    loading: false,
    message: '',
    showForm: true,
  })

  const { name, email, password, error, loading, message, showForm } = values

  useEffect(() => {
    isAuth() && Router.push('/')
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    let user = { name, email, password }
    signup(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error })
      } else {
        setValues({
          ...values,
          name: '',
          email: '',
          password: '',
          error: '',
          loading: false,
          message: data.message,
          showForm: false,
        })
      }
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

  const signupForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <input
            value={name}
            onChange={handleChange}
            name='name'
            type='text'
            className='form-control'
            placeholder='Type your name'
          />
        </div>

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
          <button className='btn btn-primary'>Signup</button>
        </div>
      </form>
    )
  }

  return (
    <>
      {showLoading()}
      {showError()}
      {showMessage()}
      {showForm && signupForm()}
    </>
  )
}

export default SignupComponent
