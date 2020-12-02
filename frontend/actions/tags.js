import fetch from 'isomorphic-unfetch'
import { API } from '../config'

export const create = async (tag, token) => {
  try {
    let res = await fetch(`${API}/tag`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(tag),
    })

    let data = await res.json()

    return data
  } catch (error) {
    console.log(error)
  }
}

export const getTags = async () => {
  try {
    let res = await fetch(`${API}/tags`, {
      method: 'GET',
    })

    let data = await res.json()

    return data
  } catch (error) {
    console.log(error)
  }
}

export const deleteTag = async (slug, token) => {
  try {
    let res = await fetch(`${API}/tag/${slug}`, {
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
