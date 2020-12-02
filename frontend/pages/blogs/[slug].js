import { readBlog } from '../../actions/blog_action'
import { API } from '../../config'
import moment from 'moment'
import renderHtml from 'react-render-html'
import Layout from '../../components/Layout'
import Link from 'next/link'
import { DOMAIN } from '../../config'

const slug = ({ blog }) => {
  const showBlogCategories = () => {
    return (
      <div>
        {blog.categories.map((c, i) => (
          <Link key={i} href={`/categories/${c.slug}`}>
            <a className='btn btn-outline-primary mb-1 mr-1'>{c.name}</a>
          </Link>
        ))}
      </div>
    )
  }

  const showBlogTags = () => {
    return (
      <div>
        {blog.tags.map((t, i) => (
          <Link key={i} href={`/categories/${t.slug}`}>
            <a className='btn btn-primary mb-1 mr-1'>{t.name}</a>
          </Link>
        ))}
      </div>
    )
  }

  return (
    <>
      <Layout>
        <main>
          <article>
            <div className='container-fluid'>
              <section>
                <div className='row' style={{ marginTop: '-30px' }}>
                  <img
                    src={`${API}/uploads/${blog.photo}`}
                    alt={blog.title}
                    className='img img-fluid featured-image'
                  />
                </div>
              </section>

              <section>
                <div className='container'>
                  <h1 className='display-2 pb-3 pt-3 text-center font-weight-bold'>
                    {blog.title}
                  </h1>
                  <p className='lead mt-3 mark'>
                    Written by{' '}
                    <Link href={`/profile/${blog.postedBy.username}`}>
                      <a>{blog.postedBy.username}</a>
                    </Link>{' '}
                    | Published {moment(blog.createdAt).fromNow()}
                  </p>

                  <div className='pb-3'>
                    {showBlogCategories(blog)}
                    {showBlogTags(blog)}
                    <br />
                    <br />
                  </div>
                </div>
              </section>
            </div>

            <div className='container'>
              <section>
                <div className='col-md-12 lead'>{renderHtml(blog.body)}</div>
              </section>
            </div>

            <div className='container'>
              <h4 className='text-center pt-5 pb-5 h2'>Related blogs</h4>
              {/* <div className='row'>{showRelatedBlog()}</div> */}
            </div>

            {/* <div className='container pt-5 pb-5'>{showComments()}</div> */}
          </article>
        </main>
      </Layout>
    </>
  )
}

slug.getInitialProps = ({ query }) => {
  return readBlog(query.slug)
    .then((data) => {
      return {
        blog: data.blog,
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

export default slug
