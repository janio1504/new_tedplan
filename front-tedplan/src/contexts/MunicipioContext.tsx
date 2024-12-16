// contexts/MunicipioContext.tsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { Municipio } from "../types";
import {
  getMunicipio,
  updateMunicipio,
  updateMunicipioService,
} from "../services/municipio";
import { useAuth } from "./AuthContext";

interface MunicipioContextData {
  dadosMunicipio: Municipio | null;
  setDadosMunicipio: React.Dispatch<React.SetStateAction<Municipio | null>>;
  loadMunicipio: () => Promise<void>;
  loading: boolean;
  updateMunicipio: (data: Partial<Municipio>) => Promise<void>;
}

const MunicipioContext = createContext<MunicipioContextData>(
  {} as MunicipioContextData
);

export const MunicipioProvider: React.FC = ({ children }) => {
  const [dadosMunicipio, setDadosMunicipio] = useState<Municipio | null>(null);
  const [loading, setLoading] = useState(false);
  const { usuario } = useAuth();

  const loadMunicipio = async () => {
    if (usuario) {
      try {
        setLoading(true);
        const municipio = await getMunicipio(usuario?.id_municipio);
        setDadosMunicipio(municipio);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const updateMunicipioData = async (data: Partial<Municipio>) => {
    try {
      setLoading(true);
      const updatedMunicipio = await updateMunicipio(data);

      setDadosMunicipio(updatedMunicipio);
      await loadMunicipio();
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMunicipio();
  }, [usuario]);

  return (
    <MunicipioContext.Provider
      value={{
        dadosMunicipio,
        setDadosMunicipio,
        loadMunicipio,
        updateMunicipio: updateMunicipioData,
        loading,
      }}
    >
      {children}
    </MunicipioContext.Provider>
  );
};

export const useMunicipio = (): MunicipioContextData => {
  const context = useContext(MunicipioContext);
  if (!context) {
    throw new Error("useMunicipio must be used within an MunicipioProvider");
  }
  return context;
};
