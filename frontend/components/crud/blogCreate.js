import Link from 'next/link'
import { useState, useEffect } from 'react'
import Router, { withRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { isAuth, getCookie } from '../../actions/auth'
import { getCategories } from '../../actions/category'
import { getTags } from '../../actions/tags'
import { createUserBlog } from '../../actions/blog_action'
import { QuillModules, QuillFormats } from '../../helpers/quill'
import styles from './Category.module.scss'
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

const BlogCreate = ({ router }) => {
  const token = getCookie('token')

  const [previewImg, setPreviewImg] = useState('')

  useEffect(() => {
    setValues({
      ...values,
      formData: new FormData(),
    })

    initCategories()
    initTags()
  }, [router])

  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])

  const [checked, setChecked] = useState([])
  const [checkedtags, setCheckedtags] = useState([])

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

  const getBlogFromLS = () => {
    if (typeof window === 'undefined') {
      return false
    }
    if (localStorage.getItem('blog')) {
      return JSON.parse(localStorage.getItem('blog'))
    } else {
      return false
    }
  }

  const [body, setBody] = useState(getBlogFromLS())
  const [values, setValues] = useState({
    error: '',
    sizeError: '',
    success: '',
    formData: '',
    title: '',
    hidePublishButton: false,
  })

  let { error, title, sizeError, success, formData, hidePublishButton } = values

  const handleChange = (name) => (e) => {
    let value
    if (name === 'photo') {
      value = e.target.files[0]
      if (value.size > 1000000) {
        console.log('size greater error')
      } else {
        formData.set(name, value)
        previewFile(e.target.files[0])
        setValues({
          ...values,
          [name]: value,
          formData,
          error: '',
        })
      }
    } else {
      value = e.target.value
      formData.set(name, value)
      setValues({
        ...values,
        [name]: value,
        formData,
        error: '',
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

  const handleBody = (e) => {
    setBody(e)
    formData.set('body', e)
    if (typeof window !== 'undefined') {
      localStorage.setItem('blog', JSON.stringify(e))
    }
  }

  const publishBlog = async (e) => {
    e.preventDefault()

    let newBlog = await createUserBlog(formData, token)
    if (newBlog.success === false) {
      setValues({ ...values, error: newBlog.message })
    } else {
      setValues({
        ...values,
        error: '',
        title: '',
        success: `A blog titled : ${newBlog.blog.title} is created.`,
      })
      setBody('')
      setPreviewImg('')
      setCategories([])
      setTags([])
    }
  }

  const createBlogForm = () => {
    return (
      <form onSubmit={publishBlog}>
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
    console.log(resultant)
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

  const showCategories = () => {
    return (
      categories.categories &&
      categories.categories.map((c, i) => (
        <li key={i} className='list-unstyled'>
          <input
            onChange={() => {
              handleToggle(c._id)
            }}
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
            type='checkbox'
            className='mr-2'
          />
          <label className='form-check-label'>{t.name}</label>
        </li>
      ))
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
    <div className='container-fluid pb-5'>
      <div className='row'>
        <div className='col-md-8'>
          {createBlogForm()}
          <div className='pt-3'>
            {showError()}
            {showSuccess()}
          </div>
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

export default withRouter(BlogCreate)
