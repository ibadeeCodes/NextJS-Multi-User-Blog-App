import fetch from 'isomorphic-unfetch'
import { API } from '../config'

export const create = async (category, token) => {
  try {
    let res = await fetch(`${API}/category`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(category),
    })

    let data = await res.json()

    return data
  } catch (error) {
    console.log(error)
  }
}

export const getCategories = async () => {
  try {
    let res = await fetch(`${API}/categories`, {
      method: 'GET',
    })

    let data = await res.json()
    return data
  } catch (error) {
    console.log(error)
  }
}

export const deleteCategory = async (slug, token) => {
  try {
    let res = await fetch(`${API}/category/${slug}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    let data = await res.json()

    return data
  } catch (error) {
    console.log(error)
  }
}
