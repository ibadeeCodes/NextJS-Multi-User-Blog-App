import Head from 'next/head'
import Link from 'next/link'
import Layout from '../../components/Layout'
import { useState } from 'react'
import { listBlogsWithCategoriesAndTags } from '../../actions/blog_action'
import BlogCard from '../../components/blogs/Blogcard'
import { API, DOMAIN } from '../../config'
import { withRouter } from 'next/router'

const Blogs = ({
  blogs,
  totalBlogs,
  categories,
  tags,
  BlogSkip,
  Bloglimit,
  router,
}) => {
  const head = () => (
    <Head>
      <title>Programming blogs | {process.env.NEXT_PUBLIC_APP_NAME}</title>
      <meta
        name='description'
        content='Programming blogs and tutorials on react node next vue php laravel and web developoment'
      />
      <link rel='canonical' href={`${DOMAIN}${router.pathname}`} />
      <meta
        property='og:title'
        content={`Latest web developoment tutorials | ${process.env.NEXT_PUBLIC_APP_NAME}`}
      />
      <meta
        property='og:description'
        content='Programming blogs and tutorials on react node next vue php laravel and web developoment'
      />
      <meta property='og:type' content='webiste' />
      <meta property='og:url' content={`${DOMAIN}${router.pathname}`} />
      <meta
        property='og:site_name'
        content={`${process.env.NEXT_PUBLIC_APP_NAME}`}
      />

      <meta
        property='og:image'
        content={`${DOMAIN}/static/images/seoblog.jpg`}
      />
      <meta
        property='og:image:secure_url'
        content={`${DOMAIN}/static/images/seoblog.jpg`}
      />
      <meta property='og:image:type' content='image/jpg' />
      <meta property='fb:app_id' content='no-id' />
    </Head>
  )

  let [limit, setLimit] = useState(Bloglimit)
  let [skip, setSkip] = useState(0)
  let [size, setSize] = useState(totalBlogs)
  const [loadedBlogs, setLoadedBlogs] = useState([])

  let loadMore = () => {
    let toSkip = skip + limit
    listBlogsWithCategoriesAndTags(toSkip, limit).then((data) => {
      if (data.error) {
        console.log(error)
      } else {
        setLoadedBlogs([...loadedBlogs, ...data.blogs])

        setSize(data.size)
        setSkip(toSkip)
      }
    })
  }

  let loadMoreButton = () => {
    return (
      size > 0 &&
      size >= limit && (
        <button className='btn btn-outline-primary btn-lg' onClick={loadMore}>
          Load More
        </button>
      )
    )
  }

  let showLoadedBlogs = () => {
    return loadedBlogs.map((blog, i) => (
      <article key={i}>
        <BlogCard blog={blog} />
      </article>
    ))
  }

  let renderCategories = () => {
    return (
      <div>
        {categories.map((c, i) => (
          <Link key={i} href={`/categories/${c.slug}`}>
            <a className='btn btn-outline-primary mb-2 mr-2 mt-2 ml-2'>
              {c.name}
            </a>
          </Link>
        ))}
      </div>
    )
  }

  let renderTags = () => {
    return (
      <div>
        {tags.map((t, i) => (
          <Link key={i} href={`/categories/${t.slug}`}>
            <a className='btn btn-primary mb-2 mr-2 mt-2 ml-2'>{t.name}</a>
          </Link>
        ))}
      </div>
    )
  }

  let renderBlog = () => {
    return (
      <div>
        {blogs.map((blog, i) => (
          <article key={i}>
            <BlogCard blog={blog} />
          </article>
        ))}
      </div>
    )
  }

  return (
    <>
      {head()}
      <Layout>
        <main>
          <div className='container-fluid'>
            <header>
              <div className='col-md-12 pt-3'>
                <h1 className='display-4 font-weight-bold text-center'>
                  Programming blogs and tutorials
                </h1>
              </div>
              <section className='pt-4' style={{ textAlign: 'center' }}>
                {renderTags()}
                {renderCategories()}
              </section>
            </header>
          </div>
          <div className='container-fluid'>{renderBlog()}</div>
          <div className='container-fluid'>{showLoadedBlogs()}</div>
          <div className='text-center pt-5 pb-5'>{loadMoreButton()}</div>
        </main>
      </Layout>
    </>
  )
}

//get data from the server while on the server..
Blogs.getInitialProps = () => {
  let skip = 0
  let limit = 2
  return listBlogsWithCategoriesAndTags(skip, limit).then((data) => {
    if (data.error) {
      console.log(data.error)
    } else {
      return {
        blogs: data.blogs,
        tags: data.tags,
        categories: data.categories,
        totalBlogs: data.size,
        BlogSkip: skip,
        Bloglimit: limit,
      }
    }
  })
}

export default withRouter(Blogs)
