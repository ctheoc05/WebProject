import Navbar from '../components/Navbar'
import '../src/app/globals.css'

function MyApp({ Component, pageProps }) {
  return <>
    <Navbar/>

    <Component {...pageProps} />
  </>
}

export default MyApp
