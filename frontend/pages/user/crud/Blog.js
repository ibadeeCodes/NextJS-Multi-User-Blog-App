import Layout from '../../../components/Layout'
import Private from '../../../components/auth/Private'
import { useRouter } from 'next/router'
import BlogCreate from '../../../components/crud/BlogCreate'

const Blog = () => {
  return (
    <Layout>
      <Private>
        <div className='container'>
          <h1>Create Blog</h1>
          <div className='row'>
            <div className='col-md-12'>
              <BlogCreate />
            </div>
          </div>
        </div>
      </Private>
    </Layout>
  )
}

export default Blog
