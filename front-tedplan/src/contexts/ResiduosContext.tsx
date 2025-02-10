import React, { createContext, useState, useContext, useEffect } from "react";
import {
  getPsResiduosColeta,
  getUnidadesRss,
  removerUnidadeRss,
  createUnidadeRss,
  getUnidadesRsc,
  getCooperativasCatadores,
  removerUnidadeRsc,
  createUnidadeRsc,
  createCoopCat,
  removerCoopCat,
} from "../services/residuos";
import { useAuth } from "./AuthContext";

interface ResiduosContextData {
  dadosResiduos: any | null;
  unidadesRss: any[];
  unidadesRsc: any[];
  cooperativas: any[];
  loadDadosResiduos: ({ano, id}) => Promise<void>;
  loadDadosUnidadesRss: ({ano, id}) => Promise<void>;
  loadDadosUnidadesRsc: ({ano, id}) => Promise<void>;
  loadDadosCooperativasCatadores: ({ano, id}) => Promise<void>;
  loading: boolean;
  removeUnidadeRss: (id: string) => Promise<any>;
  removeUnidadeRsc: (id: string) => Promise<any>;
  removeCoopCat: (id: string) => Promise<any>;
  createDataUnidadeRss: (
    data: any
  ) => Promise<{ success: boolean; message: string }>;
  createDataUnidadeRsc: (
    data: any
  ) => Promise<{ success: boolean; message: string }>;
  createDataCoopCat: (
    data: any
  ) => Promise<{ success: boolean; message: string }>;
}

const ResiduosContext = createContext<ResiduosContextData>(
  {} as ResiduosContextData
);

export const ResiduosProvider: React.FC = ({ children }) => {
  const [dadosResiduos, setDadosResiduos] = useState<any | null>(null);
  const [unidadesRss, setUnidadesRss] = useState([]);
  const [unidadesRsc, setUnidadesRsc] = useState([]);
  const [cooperativas, setCooperativas] = useState(null);
  const [loading, setLoading] = useState(false);
  const { usuario } = useAuth();

  const loadDadosResiduos = async ({ano, id}) => {
    if (usuario) {
      try {
        setLoading(true);
        const data = await getPsResiduosColeta(
          id,
          ano
        );
        setDadosResiduos(data);
      } catch (error) {
        console.error("Erro ao carregar dados de resíduos:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const loadDadosUnidadesRss = async ({ano, id}) => {
    if (usuario) {
      try {
        setLoading(true);
        const data = await getUnidadesRss(
          id,
          ano
        );

        setUnidadesRss(data);
      } catch (error) {
        console.error("Erro ao carregar dados de resíduos:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const removeUnidadeRss = async (id: string) => {
    try {
      const response = await removerUnidadeRss(id);
   
      if (response.success) {
        //await loadDadosUnidadesRss();
      }
      return response;
    } catch (error) {
      console.error("Erro ao remover unidade RSS:", error);
      return { success: false, message: "Erro inesperado ao remover unidade" };
    }
  };

  const createDataUnidadeRss = async (data: any) => {
    try {
     
      const response = await createUnidadeRss(data);
      if (response.success) {
        //await loadDadosUnidadesRss();
      }
      return response;
    } catch (error) {
      console.error("Erro ao criar unidade RSS:", error);
      return { success: false, message: "Erro inesperado ao criar unidade" };
    }
  };
  // =============================================================================
  const createDataUnidadeRsc = async (data: any) => {
    try {
      data.id_municipio = usuario?.id_municipio;
      data.ano = new Date().getFullYear();

      const response = await createUnidadeRsc(data);
      if (response.success) {
        //await loadDadosUnidadesRsc();
      }
      return response;
    } catch (error) {
      console.error("Erro ao criar unidade RSC:", error);
      return { success: false, message: "Erro inesperado ao criar unidade" };
    }
  };
  const loadDadosUnidadesRsc = async ({ano, id}) => {
    if (usuario) {
      try {
        setLoading(true);
        const data = await getUnidadesRsc(
          id,
          ano
        );
        setUnidadesRsc(data);
      } catch (error) {
        console.error("Erro ao carregar dados de resíduos coleta:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const removeUnidadeRsc = async (id: string) => {
    try {
      const response = await removerUnidadeRsc(id);

      if (response.success) {
        //await loadDadosUnidadesRsc();
      }
      return response;
    } catch (error) {
      console.error("Erro ao remover unidade RSC:", error);
      return {
        success: false,
        message: "Erro inesperado ao remover unidade",
      };
    }
  };

  // =============================================================================
  const loadDadosCooperativasCatadores = async ({ano, id}) => {
    if (usuario) {
      try {
        setLoading(true);
        const data = await getCooperativasCatadores(
          id,
          ano
        );
        setCooperativas(data);
      } catch (error) {
        console.error("Erro ao carregar dados cooperativas catadores:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const createDataCoopCat = async (data: any) => {
    try {
      data.id_municipio = usuario?.id_municipio;
      //data.ano = new Date().getFullYear();

      const response = await createCoopCat(data);
      if (response.success) {
        await loadDadosCooperativasCatadores(data.ano);
      }
      return response;
    } catch (error) {
      console.error("Erro ao criar cooperativa catadores:", error);
      return {
        success: false,
        message: "Erro inesperado ao criar cooperativa catadores",
      };
    }
  };

  const removeCoopCat = async (id: string) => {
    try {
      const response = await removerCoopCat(id);

      if (response.success) {
        //await loadDadosCooperativasCatadores();
      }
      return response;
    } catch (error) {
      console.error("Erro ao remover cooperativa catadores:", error);
      return {
        success: false,
        message: "Erro inesperado ao remover cooperativa catadores",
      };
    }
  };
  return (
    <ResiduosContext.Provider
      value={{
        dadosResiduos,
        loading,
        loadDadosResiduos,
        loadDadosUnidadesRss,
        loadDadosUnidadesRsc,
        unidadesRsc,
        unidadesRss,
        removeUnidadeRss,
        removeUnidadeRsc,
        removeCoopCat,
        createDataUnidadeRss,
        createDataUnidadeRsc,
        loadDadosCooperativasCatadores,
        cooperativas,
        createDataCoopCat,
      }}
    >
      {children}
    </ResiduosContext.Provider>
  );
};

export const useResiduos = (): ResiduosContextData => {
  const context = useContext(ResiduosContext);
  if (!context) {
    throw new Error("useResiduos must be used within an ResiduosProvider");
  }
  return context;
};
