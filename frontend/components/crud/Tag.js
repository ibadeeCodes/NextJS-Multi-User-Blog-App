import React, { useEffect, useState } from 'react'
import { isAuth, getCookie } from '../../actions/auth'
import { create, getTags, deleteTag } from '../../actions/tags'
import styles from './Category.module.scss'

const Tag = () => {
  let [value, setValue] = useState({
    name: '',
    error: false,
    success: false,
    tags: [],
    removed: false,
    reload: false,
  })

  const { name, error, success, tags, removed, reload } = value

  const token = getCookie('token')

  const loadTags = () => {
    getTags().then((data) => {
      if (data.error) {
        console.error(data.error)
      } else {
        setValue({
          ...value,
          tags: data.tags,
        })
      }
    })
  }

  useEffect(() => {
    loadTags()
  }, [reload])

  const showTags = () => {
    return tags.map((t, i) => {
      return (
        <button
          key={i}
          onDoubleClick={() => {
            confirmDelete(t.slug)
          }}
          className='btn btn-outline-danger mr-1 ml-1 mt-3'
        >
          {t.name}
        </button>
      )
    })
  }

  const confirmDelete = (slug) => {
    let yes = window.confirm('Are you sure you wan to delete?')
    if (yes) {
      removeTag(slug)
    }
  }

  const removeTag = (slug) => {
    deleteTag(slug, token).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        setValue({
          ...value,
          error: false,
          removed: true,
          reload: !reload,
        })
      }
    })
  }

  const onChangeHandler = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value,
    })
  }

  const onSubmitHandler = (e) => {
    e.preventDefault()

    create({ name }, token).then((data) => {
      if (data.success === false) {
        setValue({
          ...value,
          name: '',
          success: false,
          error: true,
          reload: !reload,
        })
      } else {
        setValue({
          ...value,
          name: '',
          success: true,
          error: false,
          reload: !reload,
        })
      }
    })
  }

  let tagForm = (
    <form className='tag-form' onSubmit={onSubmitHandler}>
      <div className='form-group pt-4'>
        <input
          type='text'
          name='name'
          className={`form-control ${styles.form_control_width}`}
          onChange={onChangeHandler}
          value={name}
          placeholder='Enter tag here.'
          required
        />
      </div>
      <button type='submit' className='btn btn-primary mb-3'>
        Create
      </button>
    </form>
  )

  let showError = () => {
    if (error) {
      return (
        <div className='alert alert-warning' role='alert'>
          Tag already exist.
        </div>
      )
    }
  }

  let showCreated = () => {
    if (success) {
      return (
        <div className='alert alert-success' role='alert'>
          Tag created.
        </div>
      )
    }
  }

  let showRemove = () => {
    if (removed) {
      return (
        <div className='alert alert-success' role='alert'>
          Tag deleted.
        </div>
      )
    }
  }

  let mouseHandler = () => {
    setValue({
      ...value,
      error: false,
      success: false,
      removed: false,
    })
  }

  return (
    <div className={styles.category_crud}>
      {showError()}
      {showCreated()}
      {showRemove()}

      <div onMouseMove={mouseHandler}>
        {tagForm}
        {tags.length > 0 ? showTags() : <p>No tags created.</p>}
      </div>
    </div>
  )
}

export default Tag
