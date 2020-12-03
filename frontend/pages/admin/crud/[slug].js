import Layout from '../../../components/Layout'
import Admin from '../../../components/auth/Admin'
import { useRouter } from 'next/router'
// import Back from '../../../components/Back'
import BlogUpdate from '../../../components/crud/BlogUpdate'

const Blog = () => {
  return (
    <Layout>
      <Admin>
        <div className='container'>
          <h1>Updated Blog</h1>
          <div className='row'>
            <div className='col-md-12'>
              <BlogUpdate />
            </div>
          </div>
        </div>
      </Admin>
    </Layout>
  )
}

export default Blog
