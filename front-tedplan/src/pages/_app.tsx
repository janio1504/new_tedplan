import { AuthProvider } from "../contexts/AuthContext";
import { MunicipioProvider } from "../contexts/MunicipioContext";
import { ResiduosProvider } from "../contexts/ResiduosContext";
import { Municipio } from "../styles/financeiro";
import GlobalStyle from "../styles/GlobalStyle";
import NextNProgress from "nextjs-progressbar";
function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <MunicipioProvider>
        <ResiduosProvider>
          <GlobalStyle />
          <NextNProgress />
          <Component {...pageProps} />
        </ResiduosProvider>
      </MunicipioProvider>
    </AuthProvider>
  );
}

export default MyApp;
