import React, { createContext, useContext, useState, useCallback } from "react";
import { InfoIndicador } from "../types/InfoIndicador";
import * as infoIndicadorService from "../services/infoIndicador";

interface InfoIndicadorContextData {
  indicadores: InfoIndicador[];
  loading: boolean;
  error: string | null;
  loadInfoIndicadores: () => Promise<void>;
  currentInfoIndicador: (id: number) => Promise<InfoIndicador>;
  createInfoIndicador: (data: Partial<InfoIndicador>) => Promise<void>;
  updateInfoIndicador: (data: Partial<InfoIndicador>) => Promise<void>;
  deleteInfoIndicador: (id: string | number) => Promise<void>;
  clearError: () => void;
}

const InfoIndicadorContext = createContext<InfoIndicadorContextData>(
  {} as InfoIndicadorContextData
);

export const InfoIndicadorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [indicadores, setInfoIndicadores] = useState<InfoIndicador[]>([]);

  useState<InfoIndicador | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadInfoIndicadores = useCallback(async () => {
    try {
      setLoading(true);
      const data = await infoIndicadorService.getAllInfoIndicadores();
      setInfoIndicadores(data);
    } catch (err) {
      setError("Erro ao carregar indicadores");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const currentInfoIndicador = async (id: number) => {
    try {
      const response = await infoIndicadorService.getInfoIndicadorById(id);
      return response;
    } catch (error) {
      setError("Erro ao buscar indicador");
      console.error("Error fetching indicator:", error);
      throw error;
    }
  };

  const createInfoIndicador = useCallback(async (data: FormData) => {
    try {
      setLoading(true);
      const newIndicador = await infoIndicadorService.createInfoIndicador(data);
      setInfoIndicadores((prev) => [...prev, newIndicador]);
      return newIndicador;
    } catch (err) {
      setError("Erro ao criar indicador");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateInfoIndicador = useCallback(async (data: FormData) => {
    try {
      setLoading(true);
      const updatedIndicador = await infoIndicadorService.updateInfoIndicador(
        data
      );
      setInfoIndicadores((prev) =>
        prev.map((item) =>
          item.id_descricao_indicador ===
          updatedIndicador.id_descricao_indicador
            ? updatedIndicador
            : item
        )
      );
    } catch (err) {
      setError("Erro ao atualizar indicador");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteInfoIndicador = useCallback(
    async (id: string | number, id_imagem?: number) => {
      try {
        setLoading(true);
        await infoIndicadorService.deleteInfoIndicador(id, id_imagem);
        setInfoIndicadores((prev) =>
          prev.filter((item) => item.id_descricao_indicador !== id)
        );
      } catch (err) {
        setError("Erro ao deletar indicador");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <InfoIndicadorContext.Provider
      value={{
        indicadores,
        currentInfoIndicador,
        loading,
        error,
        loadInfoIndicadores,
        createInfoIndicador,
        updateInfoIndicador,
        deleteInfoIndicador,
        clearError,
      }}
    >
      {children}
    </InfoIndicadorContext.Provider>
  );
};

export const useInfoIndicador = (): InfoIndicadorContextData => {
  const context = useContext(InfoIndicadorContext);
  if (!context) {
    throw new Error(
      "useInfoIndicador must be used within an InfoIndicadorProvider"
    );
  }
  return context;
};
