import { InfoIndicadorProvider } from "@/contexts/InfoIndicadorContext";
import { AuthProvider } from "../contexts/AuthContext";
import { MunicipioProvider } from "../contexts/MunicipioContext";
import { ResiduosProvider } from "../contexts/ResiduosContext";
import { Municipio } from "../styles/financeiro";
import GlobalStyle from "../styles/GlobalStyle";
import NextNProgress from "nextjs-progressbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <MunicipioProvider>
        <ResiduosProvider>
          <InfoIndicadorProvider>
            <GlobalStyle />
            {/* <NextNProgress /> */}

            <Component {...pageProps} />
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </InfoIndicadorProvider>
        </ResiduosProvider>
      </MunicipioProvider>
    </AuthProvider>
  );
}

export default MyApp;
