import Header from './Header'
function Layout({ children }) {
  return (
    <>
      <Header />
      {children}
      {/* footer */}
    </>
  )
}

export default Layout
