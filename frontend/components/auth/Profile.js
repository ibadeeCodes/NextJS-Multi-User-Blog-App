import React, { useEffect, useState } from 'react'
import {
  userProfileAction,
  getCookie,
  userProfileUpdate,
} from '../../actions/auth'
import FormData from 'form-data'
import { API } from '../../config'

const UserProfile = () => {
  const token = getCookie('token')
  let [userProfile, setUserProfile] = useState({
    name: '',
    username: '',
    email: '',
    about: '',
    photo: '',
    error: '',
    success: '',
    formData: new FormData(),
  })

  const [previewImg, setPreviewImg] = useState()

  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    let user = await userProfileAction(token)

    if (user.success) {
      setUserProfile({
        ...userProfile,
        name: user.profile.name,
        username: user.profile.username,
        email: user.profile.email,
        about: user.profile.about,
        photo: user.profile.photo,
      })
      formData.append('name', user.profile.name)
      formData.append('username', user.profile.username)
      formData.append('email', user.profile.email)
      formData.append('about', user.profile.about)
      formData.append('photo', user.profile.photo)
    }
  }

  const {
    name,
    username,
    email,
    photo,
    about,
    error,
    success,
    formData,
  } = userProfile

  const handleChange = (name) => (e) => {
    let value
    if (name === 'photo') {
      value = e.target.files[0]
      previewFile(value)
      formData.append(name, value)
      setUserProfile({
        ...userProfile,
        [name]: value,
        formData,
      })
    } else {
      value = e.target.value
      formData.append(name, value)
      setUserProfile({
        ...userProfile,
        [name]: value,
        formData,
      })
    }
  }

  const onSubmitUserProfile = async (e) => {
    e.preventDefault()
    let result = await userProfileUpdate(formData, token)
    if (!result.success) {
      setUserProfile({
        ...userProfile,
        error: result.message,
      })
    } else {
      setUserProfile({
        ...userProfile,
        success: result.message,
        name: result.user.name,
        email: result.user.email,
        username: result.user.username,
        about: result.user.about,
        photo: result.user.photo,
      })
    }
  }

  const previewFile = (file) => {
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setPreviewImg(reader.result)
    }
  }

  const renderUserProfile = () => {
    return (
      <form onSubmit={onSubmitUserProfile}>
        <div className='form-group'>
          <label className='text-muted'>Name</label>
          <input
            type='text'
            className='form-control'
            value={name}
            onChange={handleChange('name')}
          />
        </div>

        <div className='form-group'>
          <label className='text-muted'>Username</label>
          <input
            type='text'
            className='form-control'
            value={username}
            onChange={handleChange('username')}
          />
        </div>

        <div className='form-group'>
          <label className='text-muted'>Email</label>
          <input
            type='text'
            className='form-control'
            value={email}
            readOnly='readOnly'
          />
        </div>

        <div className='form-group'>
          <label className='text-muted'>About</label>
          <textarea
            className='form-control'
            value={about}
            onChange={handleChange('about')}
            style={{ fontSize: '16px' }}
          />
        </div>

        <div>
          <button type='submit' className='btn btn-primary'>
            Submit
          </button>
        </div>
      </form>
    )
  }

  const showError = () => {
    if (error && error.length > 0) {
      return (
        <div className='alert alert-danger' role='alert'>
          {error}
        </div>
      )
    }
  }

  const showSuccess = () => {
    if (success && success.length > 0) {
      return (
        <div className='alert alert-success' role='alert'>
          {success}
        </div>
      )
    }
  }

  return (
    <div className='container'>
      <h1 className='pb-5'>User Profile</h1>
      <div className='pt-3'>
        {showError()}
        {showSuccess()}
      </div>
      <div className='row'>
        <div className='col-md-4'>
          {previewImg ? (
            <img src={previewImg} style={{ height: '250px' }} alt='' />
          ) : (
            <img
              src={`${API}/uploads/users/${photo}`}
              style={{ height: '250px' }}
              alt=''
            />
          )}

          <div className='pt-3'>
            <label className='btn btn-outline-info'>
              Edit Image
              <input
                onChange={handleChange('photo')}
                type='file'
                accept='image/*'
                hidden
              />
            </label>
          </div>
        </div>
        <div className='col-md-8'>{renderUserProfile()}</div>
      </div>
    </div>
  )
}

export default UserProfile
