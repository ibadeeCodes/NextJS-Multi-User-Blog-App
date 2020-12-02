import Layout from '../../../components/Layout'
import Private from '../../../components/auth/Private'
import { useRouter } from 'next/router'
import BlogModify from '../../../components/crud/BlogModify'
import { isAuth } from '../../../actions/auth'

const Blog = () => {
  let username = isAuth() && isAuth().username

  return (
    <Layout>
      <Private>
        <div className='container'>
          <h1 className='pt-5'>Update & Delete Blogs!</h1>
          <div className='row'>
            <div className='col-md-12'>
              <BlogModify username={username} />
            </div>
          </div>
        </div>
      </Private>
    </Layout>
  )
}

export default Blog
