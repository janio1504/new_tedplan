import { AuthProvider } from "../contexts/AuthContext";
import { MunicipioProvider } from "../contexts/MunicipioContext";
import { Municipio } from "../styles/financeiro";
import GlobalStyle from "../styles/GlobalStyle";
import NextNProgress from "nextjs-progressbar";
function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <MunicipioProvider>
        <GlobalStyle />
        <NextNProgress />
        <Component {...pageProps} />
      </MunicipioProvider>
    </AuthProvider>
  );
}

export default MyApp;
