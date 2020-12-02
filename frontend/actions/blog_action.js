import fetch from 'isomorphic-unfetch'
import { API } from '../config'
import queryString from 'query-string'
import { isAuth } from '../actions/auth'

export const createBlog = async (blog, token) => {
  try {
    let res = await fetch(`${API}/blogs`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: blog,
    })

    let data = await res.json()

    return data
  } catch (error) {
    console.log(error)
  }
}

export const list = async (username) => {
  try {
    let listBlogEndPoint

    if (username) {
      listBlogEndPoint = `${API}/${username}/blogs`
    } else {
      listBlogEndPoint = `${API}/blogs`
    }

    let res = await fetch(listBlogEndPoint, {
      method: 'GET',
    })

    let data = await res.json()

    return data
  } catch (error) {
    console.log(error)
  }
}

export const listBlogsWithCategoriesAndTags = async (skip, limit) => {
  const data = {
    skip,
    limit,
  }

  return fetch(`${API}/blogs-categories-tags`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const readBlog = async (slug) => {
  try {
    let res = await fetch(`${API}/blogs/${slug}`, {
      method: 'GET',
    })

    let data = res.json()

    return data
  } catch (error) {
    console.log(error)
  }
}

export const removeBlog = async (slug, token) => {
  try {
    let removeBlogEndPoint

    if (isAuth() && isAuth().role === 1) {
      removeBlogEndPoint = `${API}/blogs/${slug}`
    } else {
      removeBlogEndPoint = `${API}/user/blogs/${slug}`
    }

    let res = await fetch(removeBlogEndPoint, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    let data = await res.json()

    return data
  } catch (error) {
    console.log(error)
  }
}

export const updateBlog = async (blog, token, slug) => {
  try {
    let updateBlogEndPoint

    if (isAuth() && isAuth().role === 1) {
      updateBlogEndPoint = `${API}/blogs/${slug}`
    } else {
      updateBlogEndPoint = `${API}/user/blogs/${slug}`
    }

    let res = await fetch(updateBlogEndPoint, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: blog,
    })

    let data = await res.json()

    return data
  } catch (error) {
    console.log(error)
  }
}

export const listSearch = (params) => {
  // {search: test}
  let query = queryString.stringify(params)
  // search=test
  return fetch(`${API}/blogs/search?${query}`, {
    method: 'GET',
  })
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

// User Blog CRUD.

export const createUserBlog = async (blog, token) => {
  try {
    let res = await fetch(`${API}/user/blogs`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: blog,
    })

    let data = await res.json()

    return data
  } catch (error) {
    console.log(error)
  }
}
