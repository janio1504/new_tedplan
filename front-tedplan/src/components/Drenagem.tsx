import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  TabButtonDados,
  TabButtonGrafico,
  TabFormSubmit,
  Tabs,
  TabsContent,
  TabsError,
  TabsForm,
  TabsInstructons,
  TabsList,
  TabsMenuChartsOnClick,
  TabsMenuReports,
  TabsMenuReportsOnClick,
  TabsTable,
  TabsTitleIndicador,
} from "../styles/financeiro";
import { Chart, GoogleChartWrapperChartType } from "react-google-charts";
import { useForm } from "react-hook-form";
import api from "../services/api";
import {
  FaBars,
  FaChartArea,
  FaChartBar,
  FaChartLine,
  FaEllipsisV,
  FaFileCsv,
  FaFileExcel,
  FaInfo,
  FaPrint,
} from "react-icons/fa";
import { TabsInfoIndicador } from "./TabsInfoIndicador";

interface IMunicipio {
  id_municipio: string;
  municipio_codigo_ibge: string;
  municipio_nome: string;
}

interface MunicipioProps {
  municipio: IMunicipio[];
}

export default function Drenagem({ municipio }: MunicipioProps) {
  const [title, setTitle] = useState<IMunicipio | any>(municipio);
  const [municipios, setMunicipios] = useState(null);
  const [indicador, setIndicador] = useState(null);
  const [tituloIndicador, setTituloIndicador] = useState(null);
  const [visibleInfo, setVisibleInfo] = useState(false);
  const [descricaoIndicador, setDescricaoIndicador] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [typeChart, setTypeChart] =
    useState<GoogleChartWrapperChartType>("LineChart");
  const chartRef = useRef(null);
  const reportRef = useRef(null);
  const infoRef = useRef(null);
  const [data, setData] = useState(null);
  var options = {
    title: title,
    curveType: "default",
    legend: { position: "rigth" },
  };

  useEffect(() => {
    let data = {
      ano: new Date().getFullYear(),
      id_municipio: 1,
    };
    data.ano = new Date().getFullYear();
    getMunucipios();
    const handleClickOutside = (event) => {
      if (chartRef.current && !chartRef.current.contains(event.target)) {
        setVisibleMenuChart(false);
      }

      if (reportRef.current && !reportRef.current.contains(event.target)) {
        setVisibleMenuReports(false);
      }

      if (infoRef.current && !infoRef.current.contains(event.target)) {
        setVisibleInfo(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  async function getDescricaoIndicador(data) {
    const res = await api.post("get-indicador-por-codigo/",{codigo: data.indicador, eixo: 'drenagem'})
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
    if (res?.length === 0) {      
      return
    }
    
    const indicador = await Promise.all(
      res.map(async (ind) => {
        const img = await api({
          method: "GET",
          url: "getImagem",
          params: { id: ind.id_imagem },
          responseType: "blob",
        }).then((response) => {          
          return URL.createObjectURL(response.data);
        }).catch((error)=>{          
          console.log(error);          
        }); 
        const dados = {
          ...ind,
          imagem: img,
        }
      return dados
        
      })
    );    
    setDescricaoIndicador(indicador[0]);
  }

  async function getMunucipios() {
    await api
      .get("getMunicipios")
      .then((response) => {
        setMunicipios(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleIndicador(data) {
    if (data.indicador == "IN042") {
      IN042(data);
    }
    if (data.indicador == "IN043") {
      IN043(data);
    }
    if (data.indicador == "IN044") {
      IN044(data);
    }
    if (data.indicador == "IN001") {
      IN001(data);
    }
    if (data.indicador == "IN006") {
      IN006(data);
    }
    if (data.indicador == "IN010") {
      IN010(data);
    }
    if (data.indicador == "IN050") {
      IN050(data);
    }
    if (data.indicador == "IN054") {
      IN054(data);
    }
    if (data.indicador == "IN005") {
      IN005(data);
    }
    if (data.indicador == "IN009") {
      IN009(data);
    }
    if (data.indicador == "IN048") {
      IN048(data);
    }
    if (data.indicador == "IN049") {
      IN049(data);
    }
    if (data.indicador == "IN053") {
      IN053(data);
    }
    if (data.indicador == "IN020") {
      IN020(data);
    }
    if (data.indicador == "IN021") {
      IN021(data);
    }
    if (data.indicador == "IN025") {
      IN025(data);
    }
    if (data.indicador == "IN026") {
      IN026(data);
    }
    if (data.indicador == "IN027") {
      IN027(data);
    }
    if (data.indicador == "IN029") {
      IN029(data);
    }
    if (data.indicador == "IN035") {
      IN035(data);
    }
    if (data.indicador == "IN051") {
      IN051(data);
    }
    if (data.indicador == "IN040") {
      IN040(data);
    }
    if (data.indicador == "IN041") {
      IN041(data);
    }
    if (data.indicador == "IN046") {
      IN046(data);
    }
    if (data.indicador == "IN047") {
      IN047(data);
    }
  }

  async function IN042(data) {
    getDescricaoIndicador(data);
    const rsGe = await api
      .post("get-geral", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

      const rs = await Promise.all(
        rsGe.map(async (drenagem) => {
          if(!drenagem.ge002 || !drenagem.ge001) {
            return null;
          }
          const result = (parseFloat(drenagem.ge002) / parseFloat(drenagem.ge001)) * 100;
          const ano = drenagem.ano.toString();
          const dados = [ano,parseFloat(result.toFixed(2)), result.toFixed(2).toString()];
          return dados;
        })
      )

      const rsFilter = rs.filter((item) => item !== null);

      if (rsFilter.length === 0) {
        setActiveTab("error");
        setData(null);
      } else {
        setActiveTab("dados");
      }
  
      //retorno para o grafico e para os dados
      const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];
  
      setTituloIndicador(
        "IN042 - Parcela de área urbana em relação à área total"
      );
      setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
      setData(dados);
  }

  async function IN043(data) {
    getDescricaoIndicador(data);
    const rsGe = await api
      .post("get-geral", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsGe.map(async (drenagem) => {
        if (!drenagem.ge002 || !drenagem.ge006) {
          return null;
        }
        const result = (parseFloat(drenagem.ge006) / parseFloat(drenagem.ge002)) * 100;
        const ano = drenagem.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(2)), result.toFixed(2).toString()];
        return dados;
      })
    );

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador("IN043 - Densidade Demográfica na Área Urbana");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN044(data) {
    getDescricaoIndicador(data);
    const rsGe = await api
      .post("get-geral", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsGe.map(async (drenagem) => {
        if (!drenagem.ge002 || !drenagem.ge008) {
          return null;
        }
        const result = (parseFloat(drenagem.ge008) / parseFloat(drenagem.ge002)) * 100;
        const ano = drenagem.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(2)), result.toFixed(2).toString()];
        return dados;
      })
    );

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador("IN044 - Densidade de Domicílios na Área Urbana");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN001(data) {
    getDescricaoIndicador(data);
    const rsGe = await api
      .post("get-geral", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsGe.map(async (drenagem) => {
        if (!drenagem.ag001 || !drenagem.ag003) {
          return null;
        }
        const result = (parseFloat(drenagem.ag001) / parseFloat(drenagem.ag003)) * 100;
        const ano = drenagem.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(2)), result.toFixed(2).toString()];
        return dados;
      })
    );

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador("IN001 - Participação do Pessoal Próprio Sobre o Total de Pessoal Alocado nos Serviços de Drenagem e Manejo das Águas Pluviais Urbanas");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN006(data) {
    getDescricaoIndicador(data);
    const rsFn = await api
      .post("get-ps-financeiro", {
        id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsFn.map(async (financeiro) => {
        if (!financeiro.fn005 || !financeiro.cb003) {
          return null;
        }
        const result = parseFloat(financeiro.fn005) / parseFloat(financeiro.cb003);
        const ano = financeiro.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(2)), result.toFixed(2).toString()];
        return dados;
      })
    );

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador("IN006 - Receita Operacional Média do Serviço por Unidades Tributadas");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN010(data) {
    getDescricaoIndicador(data);
    const rsFn = await api
      .post("get-ps-financeiro", {
        id_municipio: data.id_municipio,
      })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsFn.map(async (financeiro) => {
        if (!financeiro.fn012 || !financeiro.fn016) {
          return null;
        }
        const result = (parseFloat(financeiro.fn016) / parseFloat(financeiro.fn012)) * 100;
        const ano = financeiro.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(2)), result.toFixed(2).toString()];
        return dados;
      })
    );

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador("IN010 - Despesa per capita com manejo de rsu em relação à população urbana");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN050(data) {
    getDescricaoIndicador(data);
    const rsFn = await api
      .post("get-ps-financeiro", {
        id_municipio: data.id_municipio,
      })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsFn.map(async (financeiro) => {
        if (!financeiro.fn009 || !financeiro.fn016) {
          return null;
        }
        const result = ((parseFloat(financeiro.fn009) - parseFloat(financeiro.fn016)) / parseFloat(financeiro.fn009)) * 100;
        const ano = financeiro.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(2)), result.toFixed(2).toString()];
        return dados;
      })
    );

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador("IN050 - Diferença relativa entre despesas e receitas de Drenagem e Manejo de Águas Pluviais urbanas");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN054(data) {
    getDescricaoIndicador(data);
    const rsFn = await api
      .post("get-ps-financeiro", {
        id_municipio: data.id_municipio,
      })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsFn.map(async (financeiro) => {
        if (!financeiro.fn023 || !financeiro.fn022) {
          return null;
        }
        const result = (parseFloat(financeiro.fn023) / parseFloat(financeiro.fn022)) * 100;
        const ano = financeiro.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(2)), result.toFixed(2).toString()];
        return dados;
      })
    );

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador("IN054 - Investimentos totais desembolsados em relação aos investimentos totais contratados");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN005(data) {
    getDescricaoIndicador(data);
    const rsFn = await api
      .post("get-ps-financeiro", {
        id_municipio: data.id_municipio,
      })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsFn.map(async (financeiro) => {
        if (!financeiro.fn005 || !financeiro.ge007) {
          return null;
        }
        const result = (parseFloat(financeiro.fn005) / parseFloat(financeiro.ge007));
        const ano = financeiro.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(2)), result.toFixed(2).toString()];
        return dados;
      })
    );

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador("IN005 - Taxa Média Praticada para os Serviços de Drenagem e Manejo das Águas Pluviais Urbanas");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN009(data) {
    getDescricaoIndicador(data);
    const rsFn = await api
      .post("get-ps-financeiro", {
        id_municipio: data.id_municipio,
      })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsFn.map(async (financeiro) => {
        if (!financeiro.fn016 || !financeiro.ge007) {
          return null;
        }
        const result = (parseFloat(financeiro.fn016) / parseFloat(financeiro.ge007));
        const ano = financeiro.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(2)), result.toFixed(2).toString()];
        return dados;
      })
    );

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador("IN009 - Despesa Média Praticada para os Serviços de Drenagem e Manejo das Águas Pluviais Urbanas");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN048(data) {
    getDescricaoIndicador(data);
    const rsFn = await api
      .post("get-ps-financeiro", {
        id_municipio: data.id_municipio,
      })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsFn.map(async (financeiro) => {
        if (!financeiro.fn016 || !financeiro.ge006) {
          return null;
        }
        const result = parseFloat(financeiro.fn016) / parseFloat(financeiro.ge006);
        const ano = financeiro.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(2)), result.toFixed(2).toString()];
        return dados;
      })
    );

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador("IN048 - Despesa per capita com serviços de Drenagem e Manejo das Águas Pluviais Urbanas");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN049(data) {
    getDescricaoIndicador(data);
    const rsFn = await api
      .post("get-ps-financeiro", {
        id_municipio: data.id_municipio,
      })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsFn.map(async (financeiro) => {
        if (!financeiro.fn022 || !financeiro.ge006) {
          return null;
        }
        const result = parseFloat(financeiro.fn022) / parseFloat(financeiro.ge006);
        const ano = financeiro.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(2)), result.toFixed(2).toString()];
        return dados;
      })
    );

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador("IN049 - Indicador de exemplo");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN053(data) {
    getDescricaoIndicador(data);
    const rsFn = await api
      .post("get-ps-financeiro", {
        id_municipio: data.id_municipio,
      })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsFn.map(async (financeiro) => {
        if (!financeiro.fn023 || !financeiro.ge006) {
          return null;
        }
        const result = parseFloat(financeiro.fn023) / parseFloat(financeiro.ge006);
        const ano = financeiro.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(2)), result.toFixed(2).toString()];
        return dados;
      })
    );

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador("IN053 - Desembolso de investimentos per capta");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN020(data) {
    getDescricaoIndicador(data);
    const rsDr = await api
      .post("get-drenagem",{ id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsDr.map(async (drenagem) => {
        if (!drenagem.ie019 || !drenagem.ie017) {
          return null;
        }
        const result = (parseFloat(drenagem.ie019) / parseFloat(drenagem.ie017)) * 100;
        const ano = drenagem.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(2)), result.toFixed(2).toString()];
        return dados;
      })
    );

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador("IN020 - Taxa de Cobertura de Pavimentação e Meio-Fio na Área Urbana do Município");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN021(data) {
    getDescricaoIndicador(data);
    const rsDr = await api
      .post("get-drenagem", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsDr.map(async (drenagem) => {
        if (!drenagem.ie024 || !drenagem.ie017) {
          return null;
        }
        const result = (parseFloat(drenagem.ie024) / parseFloat(drenagem.ie017)) * 100;
        const ano = drenagem.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(2)), result.toFixed(2).toString()];
        return dados;
      })
    );

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador("IN021 - Taxa de cobertura de vias públicas com redes ou canais pluviais subterrâneos na área urbana");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN025(data) {
    getDescricaoIndicador(data);
    const rsDr = await api
      .post("get-drenagem", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsDr.map(async (drenagem) => {
        if (!drenagem.ie044 || !drenagem.ie032) {
          return null;
        }
        const result = (parseFloat(drenagem.ie044) / parseFloat(drenagem.ie032)) * 100;
        const ano = drenagem.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(2)), result.toFixed(2).toString()];
        return dados;
      })
    );

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador("IN025 - Parcela de Cursos d’Água Naturais Perenes em Área Urbana com Parques Lineares");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN026(data) {
    getDescricaoIndicador(data);
    const rsDr = await api
      .post("get-drenagem", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsDr.map(async (drenagem) => {
        if (!drenagem.ie034 || !drenagem.ie032) {
          return null;
        }
        const result = (parseFloat(drenagem.ie034) / parseFloat(drenagem.ie032)) * 100;
        const ano = drenagem.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(2)), result.toFixed(2).toString()];
        return dados;
      })
    );

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador("IN026 - Parcela de Cursos d’Água Naturais Perenes com Canalização Aberta");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN027(data) {
    getDescricaoIndicador(data);
    const rsDr = await api
      .post("get-drenagem", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsDr.map(async (drenagem) => {
        if (!drenagem.ie035 || !drenagem.ie032) {
          return null;
        }
        const result = (parseFloat(drenagem.ie035) / parseFloat(drenagem.ie032)) * 100;
        const ano = drenagem.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(2)), result.toFixed(2).toString()];
        return dados;
      })
    );

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador("IN027 - Parcela de Cursos d’Água Naturais Perenes com Canalização Fechada");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN029(data) {
    getDescricaoIndicador(data);
    const rsDr = await api
      .post("get-drenagem", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsDr.map(async (drenagem) => {
        if (!drenagem.ie033 || !drenagem.ie032) {
          return null;
        }
        const result = (parseFloat(drenagem.ie033) / parseFloat(drenagem.ie032)) * 100;
        const ano = drenagem.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(2)), result.toFixed(2).toString()];
        return dados;
      })
    );

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador("IN029 - Parcela de Cursos d’Água Naturais Perenes com Diques");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN035(data) {
    getDescricaoIndicador(data);
    const rsDr = await api
      .post("get-drenagem", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsDr.map(async (drenagem) => {
        if (!drenagem.ie058 || !drenagem.ge002) {
          return null;
        }
        const result = parseFloat(drenagem.ie058) / parseFloat(drenagem.ge002);
        const ano = drenagem.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(2)), result.toFixed(2).toString()];
        return dados;
      })
    );

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador("IN035 - Volume de reservação de águas pluviais por unidade de área urbana");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN051(data) {
    getDescricaoIndicador(data);
    const rsDr = await api
      .post("get-drenagem", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsDr.map(async (drenagem) => {
        if (!drenagem.ie021 || !drenagem.ie022 || !drenagem.ge002) {
          return null;
        }
        const result = (parseFloat(drenagem.ie021) + parseFloat(drenagem.ie022)) / parseFloat(drenagem.ge002);
        const ano = drenagem.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(2)), result.toFixed(2).toString()];
        return dados;
      })
    );

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador("IN051 - Densidade de captações de águas pluviais na área urbana");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN040(data) {
    getDescricaoIndicador(data);
    const rsDr = await api
      .post("get-drenagem", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsDr.map(async (drenagem) => {
        if (!drenagem.ri013 || !drenagem.ge008) {
          return null;
        }
        const result = (parseFloat(drenagem.ri013) / parseFloat(drenagem.ge008)) * 100;
        const ano = drenagem.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(2)), result.toFixed(2).toString()];
        return dados;
      })
    );

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador("IN040 - Parcela de Domicílios em Situação de Risco de Inundação");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN041(data) {
    getDescricaoIndicador(data);
    const rsDr = await api
      .post("get-drenagem", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsDr.map(async (drenagem) => {
        if (!drenagem.ri029 || !drenagem.ri067 || !drenagem.ge006) {
          return null;
        }
        const result = ((parseFloat(drenagem.ri029) + parseFloat(drenagem.ri067)) / parseFloat(drenagem.ge006)) * 100;
        const ano = drenagem.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(2)), result.toFixed(2).toString()];
        return dados;
      })
    );

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador("IN041 - Parcela da População Impactada por Eventos Hidrológicos");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN046(data) {
    getDescricaoIndicador(data);
    const rsDr = await api
      .post("get-drenagem", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsDr.map(async (drenagem) => {
        if (!drenagem.ri031 || !drenagem.ri068 || !drenagem.ge006) {
          return null;
        }
        const result = (((parseFloat(drenagem.ri031) + parseFloat(drenagem.ri068)) * 10) ** 5) / parseFloat(drenagem.ge006);
        const ano = drenagem.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(2)), result.toFixed(2).toString()];
        return dados;
      })
    );

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador("IN046 - Índice de Óbitos");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN047(data) {
    getDescricaoIndicador(data);
    const rsDr = await api
      .post("get-drenagem", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsDr.map(async (drenagem) => {
        if (!drenagem.ri043 || !drenagem.ri044 || !drenagem.ge005) {
          return null;
        }
        const result = (((parseFloat(drenagem.ri043) + parseFloat(drenagem.ri044)) / parseFloat(drenagem.ge005)) * 10) ** 5;
        const ano = drenagem.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(2)), result.toFixed(2).toString()];
        return dados;
      })
    );

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador("IN047 - Habitantes Realocados em Decorrência de Eventos Hidrológicos");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  const [activeTab, setActiveTab] = useState("dados");
  const [activeButtonDados, setActiveButtonDados] = useState(true);
  const [activeButtonGrafico, setActiveButtonGrafico] = useState(false);

  const [visibleMenuChart, setVisibleMenuChart] = useState(false);
  const [visibleMenuReports, setVisibleMenuReports] = useState(false);

  function handleActiveTab({ value }) {
    value === "dados"
      ? setActiveButtonDados(true)
      : setActiveButtonDados(false);
    value === "graficos"
      ? setActiveButtonGrafico(true)
      : setActiveButtonGrafico(false);

    if (data == null) {
      setActiveTab("error");
      return;
    }

    setActiveTab(value);
  }

  const printRef = useRef(null);

  const handlePrint = () => {
    const printContent = printRef.current;
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(
      "<html><head><title>Impressão</title></head><body>"
    );
    printWindow.document.write(printContent.outerHTML);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <>
      <TabsList>
        <TabButtonDados
          activeButtonDados={activeButtonDados}
          onClick={() => handleActiveTab({ value: "dados" })}
        >
          Dados
        </TabButtonDados>
        <TabButtonGrafico
          activeButtonGrafico={activeButtonGrafico}
          onClick={() => handleActiveTab({ value: "graficos" })}
        >
          Gráficos
        </TabButtonGrafico>
      </TabsList>
      <Tabs>
        <TabsForm>
          <TabsMenuReports>
            <div ref={chartRef} onClick={() => setVisibleMenuChart(true)}>
              <FaEllipsisV />
            </div>
            <div ref={reportRef} onClick={() => setVisibleMenuReports(true)}>
              <FaBars />
            </div>
              <div ref={infoRef} onClick={() => setVisibleInfo(true)}>
              <FaInfo />
              </div>
            <TabsMenuChartsOnClick visibleMenuChart={visibleMenuChart}>
              <ul>
                <li onClick={() => setTypeChart("ColumnChart")}>
                  <FaChartBar /> Gráfico Barra
                </li>
                <li onClick={() => setTypeChart("LineChart")}>
                  <FaChartLine /> Gráfico Linea
                </li>
                <li onClick={() => setTypeChart("AreaChart")}>
                  <FaChartArea /> Gráfico Àrea
                </li>
              </ul>
            </TabsMenuChartsOnClick>
            <TabsMenuReportsOnClick visibleMenuReports={visibleMenuReports}>
              <ul>
                <li onClick={() => handlePrint()}>
                  <FaPrint /> Imprimir
                </li>
                <li>
                  <FaFileExcel /> Gerar Excel
                </li>
                <li>
                  <FaFileCsv /> Gerar CSV
                </li>
              </ul>
            </TabsMenuReportsOnClick>
             {visibleInfo && <TabsInfoIndicador data={descricaoIndicador}>     
                        </TabsInfoIndicador>}
          </TabsMenuReports>
          <TabsInstructons>
            Para obter os indicadores, selecione o município e o indicador.
          </TabsInstructons>
          <form onSubmit={handleSubmit(handleIndicador)}>
            <table>
              <thead>
                <tr>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <select {...register("id_municipio")}>
                      <option>Município</option>
                      {municipios?.map((municipio, key) => (
                        <option key={key} value={municipio.id_municipio}>
                          {municipio.nome}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <select {...register("indicador")}>
                      <option>Indicardor</option>
                      <option value="IN042">
                        IN042 - Parcela de área urbana em relação à área total
                      </option>
                      <option value="IN043">
                        IN043 - Densidade Demográfica na Área Urbana
                      </option>
                      <option value="IN044">
                        IN044 - Densidade de Domicílios na Área Urbana
                      </option>
                      <option value="IN001">
                        IN001 - Participação do Pessoal Próprio Sobre o Total de
                        Pessoal Alocado nos Serviços de Drenagem e Manejo das
                        Águas Pluviais Urbanas
                      </option>
                      <option value="IN006">
                        IN006 - Receita Operacional Média do Serviço por
                        Unidades Tributadas
                      </option>
                      <option value="IN010">
                        IN006 - Despesa per capita com manejo de rsu em relação
                        à população urbana
                      </option>
                      <option value="IN050">
                        IN050 - Diferença relativa entre despesas e receitas de
                        Drenagem e Manejo de Águas Pluviais urbanas
                      </option>
                      <option value="IN054">
                        IN054 - Investimentos totais desembolsados em relação
                        aos investimentos totais contratados
                      </option>
                      <option value="IN005">
                        IN005 - Taxa Média Praticada para os Serviços de
                        Drenagem e Manejo das Águas Pluviais Urbanas
                      </option>
                      <option value="IN009">
                        IN009 - Despesa Média Praticada para os Serviços de
                        Drenagem e Manejo das Águas Pluviais Urbanas
                      </option>
                      <option value="IN048">
                        IN048 - Despesa per capita com serviços de Drenagem e
                        Manejo das Águas Pluviais Urbanas
                      </option>
                      <option value="IN053">
                        IN053 - Desembolso de investimentos per capta
                      </option>
                      <option value="IN020">
                        IN020 - Taxa de Cobertura de Pavimentação e Meio-Fio na
                        Área Urbana do Município
                      </option>
                      <option value="IN021">
                        IN021 - Taxa de cobertura de vias públicas com redes ou
                        canais pluviais subterrâneos na área urbana
                      </option>
                      <option value="IN025">
                        IN025 - Parcela de Cursos d’Água Naturais Perenes em
                        Área Urbana com Parques Lineares
                      </option>
                      <option value="IN026">
                        IN026 - Parcela de Cursos d’Água Naturais Perenes com
                        Canalização Aberta
                      </option>
                      <option value="IN027">
                        IN027 - Parcela de Cursos d’Água Naturais Perenes com
                        Canalização Fechada
                      </option>
                      <option value="IN029">
                        IN029 - Parcela de Cursos d’Água Naturais Perenes com
                        Diques
                      </option>
                      <option value="IN035">
                        IN035 - Volume de reservação de águas pluviais por
                        unidade de área urbana
                      </option>
                      <option value="IN051">
                        IN051 - Densidade de captações de águas pluviais na área
                        urbana
                      </option>
                      <option value="IN040">
                        IN040 - Parcela de Domicílios em Situação de Risco de
                        Inundação
                      </option>
                      <option value="IN041">
                        IN041 - Parcela da População Impactada por Eventos
                        Hidrológicos
                      </option>
                      <option value="IN046">IN046 - Índice de Óbitos</option>
                      <option value="IN047">
                        IN047 - Habitantes Realocados em Decorrência de Eventos
                        Hidrológicos
                      </option>
                    </select>
                  </td>
                  <td>
                    <TabFormSubmit type="submit">Buscar</TabFormSubmit>
                  </td>
                </tr>
              </tbody>
            </table>
            </form>
            </TabsForm>
            {activeTab === "dados" && (
              <TabsContent ref={printRef}>
                <TabsTitleIndicador>{tituloIndicador}</TabsTitleIndicador>
                <TabsTable>
                  <tbody>
                    <tr>
                      <th>Ano</th>
                      <th>Indicador</th>
                    </tr>
                    {indicador?.map((item, index) => (
                      <tr key={index}>
                        <td>{item[0]}</td>
                        <td>{item[1]}</td>
                      </tr>
                    ))}
                  </tbody>
                </TabsTable>
              </TabsContent>
            )}
            {activeTab === "graficos" && (
              <TabsContent ref={printRef}>
                <TabsTitleIndicador>{tituloIndicador}</TabsTitleIndicador>
                <Chart
                  chartType={typeChart}
                  data={data}
                  options={options}
                  width={"100%"}
                  height={"500px"}
                />
              </TabsContent>
            )}
            {activeTab === "error" && (
              <TabsError>
                Não foram encontrados dados suficientes para gerar o indicador
                desejado!
              </TabsError>
            )}
          
        
      </Tabs>
    </>
  );
}
