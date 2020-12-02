import Link from 'next/link'
import { useState, useEffect } from 'react'
import Router, { withRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { isAuth, getCookie } from '../../actions/auth'
import { updateBlog, removeBlog, list } from '../../actions/blog_action'
import { QuillModules, QuillFormats } from '../../helpers/quill'
import styles from './Category.module.scss'
import moment from 'moment'
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

const BlogModify = ({ router, username }) => {
  const token = getCookie('token')

  const [blogs, setBlogs] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadBlogs()
  }, [])

  const loadBlogs = () => {
    list(username).then((data) => {
      if (data.error) {
        console.log(error)
      } else {
        setBlogs(data.blogs)
      }
    })
  }

  const updateBtn = (slug) => {
    if (isAuth() && isAuth().role === 1) {
      return (
        <Link href={`/admin/crud/${slug}`}>
          <a className='ml-2 btn btn-sm btn-warning'>Update</a>
        </Link>
      )
    } else if (isAuth() && isAuth().role === 0) {
      return (
        <Link href={`/user/${slug}`}>
          <a className='ml-2 btn btn-sm btn-warning'>Update</a>
        </Link>
      )
    }
  }

  const renderBlogs = () => {
    return (
      <div>
        {blogs && blogs.length > 0 ? (
          blogs.map((blog, i) => (
            <div key={i} className='pb-5'>
              <h3>{blog.title}</h3>
              <p className='mark'>
                Written by {blog.postedBy.name} | Published on{' '}
                {moment(blog.updatedAt).fromNow()}
              </p>
              <button
                className='btn btn-sm btn-danger'
                onClick={() => deleteConfirm(blog.slug)}
              >
                Delete
              </button>
              {updateBtn(blog.slug)}
            </div>
          ))
        ) : (
          <div>No Blogs Found</div>
        )}
      </div>
    )
  }

  const deleteConfirm = (slug) => {
    let answer = window.confirm(
      `Are you sure you want to delete this blog : ${slug} ?`
    )

    if (answer) {
      deleteBlog(slug)
    }
  }

  const deleteBlog = (slug) => {
    removeBlog(slug, token).then((data) => {
      if (data.error) {
        setError(error)
      } else {
        setSuccess(data.message)
        // for fetching the latest blogs from db after deleting the recent blog..
        loadBlogs()
      }
    })
  }

  return (
    <div className='container-fluid pb-5'>
      <div className='row'>
        {error && <div className='alert alert-alert'>{error}</div>}
        {success && <div className='alert alert-success'>{success}</div>}
        <div className='col-md-12'>{renderBlogs()}</div>
      </div>
    </div>
  )
}

export default withRouter(BlogModify)
