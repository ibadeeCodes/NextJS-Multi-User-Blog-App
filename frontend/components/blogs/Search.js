import React, { useState, useEffect } from 'react'
import { listSearch } from '../../actions/blog_action'
import Link from 'next/link'

const Search = () => {
  const [values, setValues] = useState({
    search: undefined,
    results: [],
    searched: false,
    error: '',
    message: '',
  })

  const { search, results, searched, message, error } = values

  const searchSubmit = async (e) => {
    e.preventDefault()

    let data = await listSearch({ search })

    console.log(data)

    if (!data.success) {
      setValues({
        ...values,
        searched: false,
        error: `${data.message} :(`,
      })
    } else {
      setValues({
        ...values,
        searched: true,
        results: data.blogs,
        message: `${data.blogs.length} blogs found.`,
      })
    }
  }

  const handleChange = (e) => {
    setValues({
      ...values,
      search: e.target.value,
      searched: false,
      results: [],
    })
  }

  const searchedBlogs = (results) => {
    return (
      <div className='jumbotron bg-white'>
        {message && <p className='pt-4 text-muted font-italic'>{message}</p>}
        <ul>
          {results.map((res) => (
            <div key={res._id}>
              <Link href={`/blogs/${res.slug}`}>
                <a className='text-primary'>{res.title}</a>
              </Link>
            </div>
          ))}
        </ul>
      </div>
    )
  }

  const errorLog = () => {
    return <div>{error}</div>
  }

  const searchForm = () => (
    <form onSubmit={searchSubmit}>
      <div className='row'>
        <div className='col-md-8 pb-2'>
          <input
            type='search'
            className='form-control'
            placeholder='Search blogs'
            onChange={handleChange}
          />
        </div>

        <div className='col-md-4'>
          <button className='btn btn-block btn-outline-primary' type='submit'>
            Search
          </button>
        </div>
      </div>
    </form>
  )

  return (
    <div className='container-fluid'>
      <div className='pt-3 pb-5'>{searchForm()}</div>
      {error && <div>{errorLog()}</div>}
      {searched && (
        <div style={{ marginTop: '-120px', marginBottom: '-80px' }}>
          {searchedBlogs(results)}
        </div>
      )}
    </div>
  )
}

export default Search
