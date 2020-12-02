import React, { useEffect, useState } from 'react'
import { withRouter } from 'next/router'
import Router from 'next/router'
import { readBlog } from '../../actions/blog_action'
import dynamic from 'next/dynamic'
import { getCategories } from '../../actions/category'
import { getTags } from '../../actions/tags'
import { getCookie } from '../../actions/auth'
import { API } from '../../config'
import { isAuth } from '../../actions/auth'

import { QuillModules, QuillFormats } from '../../helpers/quill'
import { updateBlog } from '../../actions/blog_action'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

const BlogUpdate = ({ router }) => {
  const token = getCookie('token')

  const [values, setValues] = useState({
    title: '',
    formData: new FormData(),
    error: '',
    success: '',
  })

  const [body, setBody] = useState('')

  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])

  const [checked, setChecked] = useState([])
  const [checkedtags, setCheckedtags] = useState([])

  const [previewImg, setPreviewImg] = useState('')
  const [imgDB, setImgDB] = useState('')

  useEffect(() => {
    getInit()
    initTags()
    initCategories()
  }, [router])

  let { title, success, error, formData } = values

  const getInit = () => {
    readBlog(router.query.slug).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        setValues({
          ...values,
          title: data.blog.title,
        })
        setBody(data.blog.body)
        setCategoriesArray(data.blog.categories)
        setTagsArray(data.blog.tags)
        // previewFile(`${API}/uploads/${data.blog.photo}`)
        setImgDB(`${API}/uploads/${data.blog.photo}`)
      }
    })
  }

  const setCategoriesArray = (cats) => {
    let ca = []
    cats.map((c, i) => {
      ca.push(c._id)
    })
    setChecked(ca)
  }

  const setTagsArray = (tags) => {
    let ta = []
    tags.map((t, i) => {
      ta.push(t._id)
    })

    setCheckedtags(ta)
  }

  const checkInCategory = (cat) => {
    let doesExist = checked.indexOf(cat)

    if (doesExist !== -1) {
      return true
    } else {
      return false
    }
  }

  const checkInTags = (tag) => {
    let doesExist = checkedtags.indexOf(tag)

    if (doesExist !== -1) {
      return true
    } else {
      return false
    }
  }

  const previewFile = (file) => {
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setPreviewImg(reader.result)
    }
  }

  const initCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error })
      } else {
        setCategories(data)
      }
    })
  }

  const initTags = () => {
    getTags().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error })
      } else {
        setTags(data)
      }
    })
  }

  const showCategories = () => {
    return (
      categories.categories &&
      categories.categories.map((c, i) => (
        <li key={i} className='list-unstyled'>
          <input
            onChange={() => {
              handleToggle(c._id)
            }}
            checked={checkInCategory(c._id)}
            type='checkbox'
            className='mr-2'
          />
          <label className='form-check-label'>{c.name}</label>
        </li>
      ))
    )
  }

  const showTags = () => {
    return (
      tags.tags &&
      tags.tags.map((t, i) => (
        <li key={i} className='list-unstyled'>
          <input
            onChange={() => {
              handleTagsToggle(t._id)
            }}
            checked={checkInTags(t._id)}
            type='checkbox'
            className='mr-2'
          />
          <label className='form-check-label'>{t.name}</label>
        </li>
      ))
    )
  }

  const handleToggle = (id) => {
    setValues({
      ...values,
      error: '',
    })

    let selectedCategory = checked.indexOf(id)

    let resultant = [...checked]

    if (selectedCategory === -1) {
      resultant.push(id)
    } else {
      resultant.splice(selectedCategory, 1)
    }
    setChecked(resultant)
    formData.set('categories', resultant)
  }

  const handleTagsToggle = (id) => {
    setValues({
      ...values,
      error: '',
    })

    let selectedTags = checkedtags.indexOf(id)

    let resultant = [...checkedtags]

    if (selectedTags === -1) {
      resultant.push(id)
    } else {
      resultant.splice(selectedTags, 1)
    }
    setCheckedtags(resultant)
    formData.set('tags', resultant)
  }

  const handleChange = (name) => (e) => {
    let value
    if (name === 'photo') {
      console.log(name)
      value = e.target.files[0]
      if (value.size > 1000000) {
        console.log('size greater error')
      } else {
        formData.set(name, value)
        previewFile(value)
        setValues({
          ...values,
          [name]: value,
          formData,
          error: '',
        })
      }
    } else {
      formData.set(name, e.target.value)
      setValues({
        ...values,
        [name]: e.target.value,
        formData,
      })
    }
  }

  const handleBody = (e) => {
    setBody(e)
    formData.set('body', e)
  }

  const editBlog = async (e) => {
    e.preventDefault()
    let blogUpdate = await updateBlog(formData, token, router.query.slug)
    if (blogUpdate.success === false) {
      setValues({ ...values, error: blogUpdate.message })
    } else {
      setValues({
        ...values,
        error: '',
        title: '',
        success: `Blog updated successfully!`,
      })
      if (isAuth() && isAuth().role === 1) {
        // Router.replace(`/admin/crud/${router.query.slug}`);
        Router.replace(`/admin`)
      } else if (isAuth() && isAuth().role === 0) {
        // Router.replace(`/user/crud/${router.query.slug}`);
        Router.replace(`/user`)
      }
    }
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

  const createBlogForm = () => {
    return (
      <form onSubmit={editBlog}>
        <div className='form-group'>
          <label className='text-muted'>Title</label>
          <input
            type='text'
            className='form-control'
            value={title}
            onChange={handleChange('title')}
          />
        </div>

        <div className='form-group'>
          <ReactQuill
            modules={QuillModules}
            formats={QuillFormats}
            value={body}
            name='body'
            placeholder='Write something amazing...'
            onChange={handleBody}
          />
        </div>

        <div>
          <button type='submit' className='btn btn-primary'>
            Publish
          </button>
        </div>
      </form>
    )
  }

  return (
    <div className='container-fluid pb-5'>
      <div className='row'>
        <div className='col-md-8'>
          {createBlogForm()}

          <div className='pt-3'>
            {showSuccess()}
            {showError()}
          </div>

          {/* {body && (
            <img
              src={`${API}/uploads/${req.query.slug}`}
              alt={title}
              style={{ width: '100%' }}
            />
          )} */}
        </div>

        <div className='col-md-4'>
          <div>
            <div className='form-group pb-2'>
              <h5>Featured image</h5>
              <hr />

              <small className='text-muted'>Max size: 1mb</small>
              <br />
              <label className='btn btn-outline-info'>
                Upload featured image
                <input
                  onChange={handleChange('photo')}
                  type='file'
                  accept='image/*'
                  hidden
                />
              </label>
              {previewImg && (
                <img
                  src={previewImg}
                  alt='blog_img'
                  style={{ height: '200px' }}
                />
              )}
            </div>
          </div>
          <div>
            <h5>Categories</h5>
            <hr />

            <ul style={{ maxHeight: '200px', overflowY: 'scroll' }}>
              {showCategories()}
            </ul>
          </div>
          <div>
            <h5>Tags</h5>
            <hr />
            <ul style={{ maxHeight: '200px', overflowY: 'scroll' }}>
              {showTags()}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withRouter(BlogUpdate)
