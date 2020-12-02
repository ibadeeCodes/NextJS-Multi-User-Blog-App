import React, { useState } from 'react'
import styles from './Header.module.scss'
import Link from 'next/link'
import { isAuth, signout } from '../actions/auth'
import NProgress from 'nprogress'
import Router from 'next/router'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap'
import Search from './blogs/Search'

Router.onRouteChangeStart = (url) => NProgress.start()
Router.onRouteChangeComplete = (url) => NProgress.done()
Router.onRouteChangeError = (url) => NProgress.done()

const Header = (props) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen(!isOpen)

  const guestLinks = (
    <>
      <NavItem>
        <Link href='/blogs'>
          <NavLink>Blogs</NavLink>
        </Link>
      </NavItem>
      <NavItem>
        <Link href='/signin'>
          <NavLink>Signin</NavLink>
        </Link>
      </NavItem>
      <NavItem>
        <Link href='/signup'>
          <NavLink>Signup</NavLink>
        </Link>
      </NavItem>
      <NavItem>
        <Link href='/user/crud/Blog'>
          <NavLink className='btn btn-primary' style={{ color: '#fff' }}>
            Write Blog
          </NavLink>
        </Link>
      </NavItem>
    </>
  )

  const authLinks = (
    <>
      {isAuth() && isAuth().role === 0 && (
        <NavItem>
          <Link href='/user'>
            <NavLink>{`🙋‍♂️${isAuth().name}'s Dashboard`}</NavLink>
          </Link>
        </NavItem>
      )}
      {isAuth() && isAuth().role === 1 && (
        <NavItem>
          <Link href='/admin'>
            <NavLink>{`🙋‍♂️${isAuth().name}'s Dashboard`}</NavLink>
          </Link>
        </NavItem>
      )}
      <NavItem>
        <Link href='/blogs'>
          <NavLink>Blogs</NavLink>
        </Link>
      </NavItem>
      <NavItem>
        <Link href='/signin'>
          <NavLink onClick={() => signout(() => Router.replace('/signin'))}>
            Signout
          </NavLink>
        </Link>
      </NavItem>
      <NavItem>
        <Link href='/user/crud/Blog'>
          <NavLink className='btn btn-primary' style={{ color: '#fff' }}>
            Write Blog
          </NavLink>
        </Link>
      </NavItem>
    </>
  )

  return (
    <div>
      <Navbar className={styles.header} color='light' light expand='md'>
        <div className='container'>
          <Link href='/'>
            <NavLink className='font-weight-bold'>
              {process.env.NEXT_PUBLIC_APP_NAME}
            </NavLink>
          </Link>
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className='ml-auto' navbar>
              {isAuth() ? authLinks : guestLinks}
            </Nav>
          </Collapse>
        </div>
      </Navbar>
      <div>
        <div className='container'>
          <Search />
        </div>
      </div>
    </div>
  )
}

export default Header
