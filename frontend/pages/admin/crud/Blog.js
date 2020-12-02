import Layout from '../../../components/Layout'
import Admin from '../../../components/auth/Admin'
import { useRouter } from 'next/router'
import Back from '../../../components/Back'
import BlogCreate from '../../../components/crud/BlogCreate'

const Blog = () => {
  return (
    <Layout>
      <Admin>
        <div className='container'>
          <h1>Create Blog</h1>
          <div className='row'>
            <div className='col-md-12'>
              <BlogCreate />
            </div>
          </div>
        </div>
      </Admin>
    </Layout>
  )
}

export default Blog
