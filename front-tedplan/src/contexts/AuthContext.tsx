import React, { createContext, useEffect, useState } from "react";
import { recoverUserInformation, signInRequest } from "../services/auth";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import Router from "next/router";
import api from "../services/api";

type SignInData = {
  login: string;
  senha: string;
  id_sistema: string;
};

type Usuario = {
  permissao_usuario: string;
  id_usuario: BigInteger;
  login: string;
  nome: string;
  ultimo_login: string;
  id_sistema: number;
  id_permissao: number;
  id_municipio: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  usuario: Usuario;
  signIn: (data: SignInData) => Promise<void>;
  signOut: () => Promise<void>;
  setMunicipioUser: (id: bigint) => void;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }) {
  // const [usuario, setUser] = useState<Usuario | null>(null);

  const [usuario, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      const savedUsuario = localStorage.getItem("usuario");
      return savedUsuario !== null ? JSON.parse(savedUsuario) : 0;
    }
  });

  const isAuthenticated = !!usuario;

  useEffect(() => {
    const { "tedplan.token": token } = parseCookies();

    const { "tedplan.id_usuario": id_usuario } = parseCookies();

    if (!usuario && token && id_usuario) {
      recoverUserInformation(id_usuario).then((response) => {
        setUser(response[0]);
      });
    }
  }, [usuario]);

  async function signIn({ login, senha, id_sistema }: SignInData) {
    const data = await signInRequest({
      login,
      senha,
      id_sistema,
    })
      .then((response) => {
        if (response.token && response.id_usuario) {
          setCookie(undefined, "tedplan.token", response.token);

          setCookie(undefined, "tedplan.id_usuario", response.id_usuario);

          api.defaults.headers["Authorization"] = `Bearer ${response.token}`;

          recoverUserInformation(response.id_usuario).then((value) => {
            setUser(value[0]);
          });
        }
        return response;
      })
      .catch((error) => {
        return error;
      });

    const resUsuarioLogado = await api.get("getUsuario", {
      params: { id_usuario: data.id_usuario },
    });
    const usuarioLogado = await resUsuarioLogado.data;

    usuarioLogado.map((user) => {
      if (user.id_permissao === 3 && user.id_sistema === 2) {
        Router.push("/indicadores/home_indicadores");
      } else {
        Router.push("/dashboard");
      }
    });

    usuarioLogado.map((user) => {
      if (user.id_tipo_usuario === 1) {
        Router.push("/listarUsuarios");
      }
      if (user.id_tipo_usuario === 2) {
        Router.push("/indicadores/home_indicadores");
      }
    });

    usuarioLogado.map((user) => {
      if (user.id_tipo_usuario === 1) {
        Router.push("/listarUsuarios");
      }
      if (user.id_tipo_usuario === 2) {
        Router.push("/indicadores/home_indicadores");
      }
    });

    async function signOut() {
      destroyCookie(undefined, "tedplan.token", {});
      destroyCookie(undefined, "tedplan.id_usuario", {});
      localStorage.removeItem("usuario");
      Router.push("/");
    }

    function setMunicipioUser(id) {
      usuario.id_municipio = id;
      localStorage.setItem("usuario", JSON.stringify(usuario));
      setUser(usuario);
    }

    return (
      <AuthContext.Provider
        value={{ usuario, isAuthenticated, signIn, signOut, setMunicipioUser }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
}
