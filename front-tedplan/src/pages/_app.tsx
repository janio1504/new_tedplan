import { AuthProvider } from '../contexts/AuthContext'
import GlobalStyle from '../styles/GlobalStyle'
import NextNProgress from "nextjs-progressbar";
function MyApp({ Component, pageProps }) {
  return (
   
    <AuthProvider>
       <GlobalStyle />
       <NextNProgress />
        <Component {...pageProps} />    
    </AuthProvider>

  )
}

export default MyApp