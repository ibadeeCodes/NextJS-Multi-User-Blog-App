import fetch from 'isomorphic-unfetch'
import { API } from '../config'
import cookie from 'js-cookie'

export const signup = async (user) => {
  try {
    let res = await fetch(`${API}/auth/signup`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })

    let data = await res.json()
    return data
  } catch (err) {
    console.log(err)
  }
}

export const signin = async (user) => {
  try {
    let res = await fetch(`${API}/auth/signin`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })

    let data = await res.json()

    return data
  } catch (err) {
    console.log(err)
  }
}

export const signout = async (next) => {
  try {
    removeCookie('token')
    removeLocalStorage('user')
    next()

    let res = await fetch(`${API}/auth/signout`, {
      method: 'POST',
    })

    console.log(res)
  } catch (error) {
    console.log(error)
  }
}

//set cookie

export const setCookie = (key, value) => {
  if (process.browser) {
    cookie.set(key, value, {
      expires: 1,
    })
  }
}

//getcookie

export const getCookie = (key) => {
  if (process.browser) {
    return cookie.get(key)
  }
}

//removecookie

export const removeCookie = (key) => {
  if (process.browser) {
    cookie.remove(key)
  }
}

//set localstorage

export const setLocalStorage = (key, value) => {
  if (process.browser) {
    localStorage.setItem(key, value)
  }
}

//remove localstorage
export const removeLocalStorage = (key) => {
  if (process.browser) {
    localStorage.removeItem(key)
  }
}

// authenticate

export const authenticate = (data, next) => {
  setCookie('token', data.token)
  setLocalStorage('user', JSON.stringify(data.user))
  next()
}

// isAuth

export const isAuth = () => {
  if (process.browser) {
    let cookieChecked = cookie.get('token')
    if (cookieChecked) {
      if (localStorage.getItem('user')) {
        return JSON.parse(localStorage.getItem('user'))
      } else {
        return false
      }
    }
  }
}

export const googleLogin = async (user) => {
  try {
    let res = await fetch(`${API}/auth/google-login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })

    let data = await res.json()

    console.log(data)
    return data
  } catch (err) {
    console.log(err)
  }
}

export const userProfileAction = async (token) => {
  try {
    let res = await fetch(`${API}/user/profile`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    let data = await res.json()

    return data
  } catch (err) {
    console.log(err)
  }
}

export const userProfileUpdate = async (user, token) => {
  try {
    let res = await fetch(`${API}/auth/updateProfile`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: user,
    })

    let data = await res.json()
    return data
  } catch (err) {
    console.log(err)
  }
}
