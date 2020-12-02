import Head from 'next/head'
import './_app.scss'
import '../node_modules/nprogress/nprogress.css'
import '../node_modules/react-quill/dist/quill.snow.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
