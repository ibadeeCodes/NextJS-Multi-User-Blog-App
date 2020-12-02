import React, { useEffect, useState } from 'react'
import { isAuth, getCookie } from '../../actions/auth'
import { create, getCategories, deleteCategory } from '../../actions/category'
import Link from 'next/link'
import Router from 'next/router'
import styles from './Category.module.scss'

const Category = () => {
  let [value, setValue] = useState({
    name: '',
    error: false,
    success: false,
    categories: [],
    removed: false,
    reload: false,
  })

  const { name, error, success, categories, removed, reload } = value

  const token = getCookie('token')

  const loadCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        console.error(data.error)
      } else {
        setValue({
          ...value,
          categories: data.categories,
        })
      }
    })
  }

  useEffect(() => {
    loadCategories()
  }, [reload])

  const showCategories = () => {
    return categories.map((c, i) => {
      return (
        <button
          key={i}
          onDoubleClick={() => {
            confirmDelete(c.slug)
          }}
          className='btn btn-outline-primary mr-1 ml-1 mt-3'
        >
          {c.name}
        </button>
      )
    })
  }

  const confirmDelete = (slug) => {
    let yes = window.confirm('Are you sure you wan to delete?')
    if (yes) {
      removeCategory(slug)
    }
  }

  const removeCategory = (slug) => {
    deleteCategory(slug, token).then((data) => {
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

  let categoryForm = (
    <form className='category-form' onSubmit={onSubmitHandler}>
      <div className='form-group pt-4'>
        <input
          type='text'
          name='name'
          className={`form-control ${styles.form_control_width}`}
          onChange={onChangeHandler}
          value={name}
          placeholder='Enter category name...'
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
          Category already exist.
        </div>
      )
    }
  }

  let showCreated = () => {
    if (success) {
      return (
        <div className='alert alert-success' role='alert'>
          Category created.
        </div>
      )
    }
  }

  let showRemove = () => {
    if (removed) {
      return (
        <div className='alert alert-success' role='alert'>
          Category deleted.
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
        {categoryForm}
        {categories.length > 0 ? (
          showCategories()
        ) : (
          <p>No categories created.</p>
        )}
      </div>
    </div>
  )
}

export default Category
