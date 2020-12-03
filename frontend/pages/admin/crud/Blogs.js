import Layout from '../../../components/Layout'
import Admin from '../../../components/auth/Admin'
import { useRouter } from 'next/router'
import Back from '../../../components/Back'
import BlogModify from '../../../components/crud/BlogModify'

const Blog = () => {
  return (
    <Layout>
      <Admin>
        <div className='container'>
          <h1 className='pt-5'>Update & Delete Blogs!</h1>
          <div className='row'>
            <div className='col-md-12'>
              <BlogModify />
            </div>
          </div>
        </div>
      </Admin>
    </Layout>
  )
}

export default Blog
