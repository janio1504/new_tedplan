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
import { AuthContext } from "../contexts/AuthContext";
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
  FaPrint,
} from "react-icons/fa";
import { parse } from "path";

interface IMunicipio {
  id_municipio: string;
  municipio_codigo_ibge: string;
  municipio_nome: string;
}

interface MunicipioProps {
  municipio: IMunicipio[];
}

export default function ResiduosSolidos({ municipio }: MunicipioProps) {
  const { usuario, signOut } = useContext(AuthContext);
  const [title, setTitle] = useState<IMunicipio | any>(municipio);
  const [municipios, setMunicipios] = useState(null);
  const [indicador, setIndicador] = useState(null);
  const [tituloIndicador, setTituloIndicador] = useState(null);
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
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

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
    if (data.indicador == "IN001") {
      IN001(data);
    }

    if (data.indicador == "IN002") {
      IN002(data);
    }
    if (data.indicador == "IN003") {
      IN003(data);
    }
    if (data.indicador == "IN004") {
      IN004(data);
    }
    if (data.indicador == "IN005") {
      IN005(data);
    }
    if (data.indicador == "IN006") {
      IN006(data);
    }
    if (data.indicador == "IN007") {
      IN007(data);
    }
    if (data.indicador == "IN008") {
      IN008(data);
    }
    if (data.indicador == "IN010") {
      IN010(data);
    }
    if (data.indicador == "IN011") {
      IN011(data);
    }
    if (data.indicador == "IN014") {
      IN014(data);
    }
    if (data.indicador == "IN015") {
      IN015(data);
    }
    if (data.indicador == "IN016") {
      IN016(data);
    }
    if (data.indicador == "IN017") {
      IN017(data);
    }
    if (data.indicador == "IN018") {
      IN018(data);
    }
    if (data.indicador == "IN019") {
      IN019(data);
    }
    if (data.indicador == "IN021") {
      IN021(data);
    }
    if (data.indicador == "IN022") {
      IN022(data);
    }
    if (data.indicador == "IN023") {
      IN023(data);
    }
    if (data.indicador == "IN024") {
      IN024(data);
    }
    if (data.indicador == "IN025") {
      IN025(data);
    }
    if (data.indicador == "IN027") {
      IN027(data);
    }
    if (data.indicador == "IN028") {
      IN028(data);
    }
    if (data.indicador == "IN030") {
      IN030(data);
    }
    if (data.indicador == "IN031") {
      IN031(data);
    }
    if (data.indicador == "IN032") {
      IN032(data);
    }
    if (data.indicador == "IN034") {
      IN034(data);
    }
    if (data.indicador == "IN035") {
      IN035(data);
    }
    if (data.indicador == "IN038") {
      IN038(data);
    }
    if (data.indicador == "IN039") {
      IN039(data);
    }
    if (data.indicador == "IN040") {
      IN040(data);
    }
    if (data.indicador == "IN053") {
      IN053(data);
    }
    if (data.indicador == "IN022") {
      IN054(data);
    }
    if (data.indicador == "IN023") {
      IN036(data);
    }
    if (data.indicador == "IN024") {
      IN037(data);
    }
    if (data.indicador == "IN025") {
      IN041(data);
    }
    if (data.indicador == "IN027") {
      IN042(data);
    }
    if (data.indicador == "IN028") {
      IN043(data);
    }
    if (data.indicador == "IN030") {
      IN044(data);
    }
    if (data.indicador == "IN031") {
      IN045(data);
    }
    if (data.indicador == "IN032") {
      IN046(data);
    }
    if (data.indicador == "IN034") {
      IN047(data);
    }
    if (data.indicador == "IN035") {
      IN048(data);
    }
    if (data.indicador == "IN038") {
      IN051(data);
    }
    if (data.indicador == "IN039") {
      IN052(data);
    }
    if (data.indicador == "IN040") {
      IN026(data);
    }
    if (data.indicador == "IN053") {
      IN029(data);
    }
  }

  async function IN001(data) {
    const rsDd = await api
      .get("getMunicipio", { params: { id_municipio: data.id_municipio } })
      .then((response) => {
        return response.data[0];
      });
    const rsRsc = await api
      .post("get-ps-residuos-coleta", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await rsRsc.map((residuos) => {
      if (!residuos?.tb013 || !residuos?.tb014) {
        return null;
      }
      const TB013 = parseFloat(residuos?.tb013);
      const TB014 = parseFloat(residuos?.tb014);
      const POP_URB = parseFloat(rsDd?.dd_populacao_urbana);
      const result = ((TB013 + TB014) / POP_URB) * 1000;
      const ano = residuos.ano.toString();
      const dados = [
        ano,
        parseFloat(result.toFixed(2)),
        result.toFixed(2).toString(),
      ];
      return dados;
    });

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador(
      "IN024 - Índice de atendimento urbano de esgoto referido aos municípios atendidos com água"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN002(data) {
    const rsRsc = await api
      .post("get-ps-residuos-coleta", {
        id_municipio: data.id_municipio,
      })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(rsRsc.map(async (residuos) => {
      const rsFn = await api
        .post("get-ps-financeiro-por-ano", {
          id_municipio: data.id_municipio,
          ano: residuos.ano,
        })
        .then((response) => {
          return response.data[0];
        });

      if (!residuos?.tb013 || !residuos?.tb014 || !rsFn?.fn220) {
        return null;
      }     

      const TB013 = parseFloat(residuos?.tb013);
      const TB014 = parseFloat(residuos?.tb014);
      const FN220 = parseFloat(rsFn?.fn220);
      const result = (TB013 + TB014) / FN220;
      const ano = residuos.ano.toString();
      const dados = [
        ano,
        parseFloat(result.toFixed(2)),
        result.toFixed(2).toString(),
      ];
      return dados;
    }));
    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador(
      "IN002 - Despesa média por empregado alocado nos serviços do manejo de rsu"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN003(data) {
    const rsFn = await api
        .post("get-ps-financeiro", {
          id_municipio: data.id_municipio
        })
        .then((response) => {
          return response.data;
        });

        const rs = await rsFn.map((financeiro)=>{

          if (!financeiro?.fn220 || !financeiro?.fn223) {
            return null;
          }
          const result = (parseFloat(financeiro?.fn220) / parseFloat(financeiro?.fn223)) * 100;
          const ano = financeiro.ano.toString();
          const dados = [
            ano,
            parseFloat(result.toFixed(2)),
            result.toFixed(2).toString(),
          ];
          return dados;
        })
        const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador(
      "IN003 - Incidência das despesas com o manejo de rsu nas despesas correntes da prefeitura"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN004(data) {
    const rsFn = await api
      .post("get-ps-financeiro", {
        id_municipio: data.id_municipio,
      })
      .then((response) => {
        return response.data;
      });

    const rs = await rsFn.map((financeiro) => {
      if (!financeiro?.fn219 || !financeiro?.fn220) {
        return null;
      }
      const result = (parseFloat(financeiro?.fn219) / parseFloat(financeiro?.fn220)) * 100;
      const ano = financeiro.ano.toString();
      const dados = [
        ano,
        parseFloat(result.toFixed(2)),
        result.toFixed(2).toString(),
      ];
      return dados;
    });

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador(
      "IN004 - Incidência das despesas com empresas contratadas para execução de serviços de manejo rsu nas despesas com manejo de rsu"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN005(data) {
    const rsFn = await api
      .post("get-ps-financeiro", {
        id_municipio: data.id_municipio,
      })
      .then((response) => {
        return response.data;
      });

    const rs = await rsFn.map((financeiro) => {
      if (!financeiro?.fn222 || !financeiro?.fn220) {
        return null;
      }
      const result = (parseFloat(financeiro?.fn222) / parseFloat(financeiro?.fn220)) * 100;
      const ano = financeiro.ano.toString();
      const dados = [
        ano,
        parseFloat(result.toFixed(2)),
        result.toFixed(2).toString(),
      ];
      return dados;
    });

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador(
      "IN005 - Auto-suficiência financeira da prefeitura com o manejo de rsu"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN006(data) {
    const rsDd = await api
      .get("getMunicipio", { params: { id_municipio: data.id_municipio } })
      .then((response) => {
        return response.data[0];
      });
    
    const rsFn = await api
      .post("get-ps-financeiro", {
        id_municipio: data.id_municipio
      })
      .then((response) => {
        return response.data;
      });
    
    const rs = await Promise.all(rsFn.map((financeiro) => {
      if (!financeiro?.fn220 || !rsDd?.dd_populacao_urbana) {
        return null;
      }
      const result = parseFloat(financeiro?.fn220) / parseFloat(rsDd?.dd_populacao_urbana);

      const ano = financeiro.ano.toString();
      const dados = [
        ano,
        parseFloat(result.toFixed(2)),
        result.toFixed(2).toString(),
      ];
      return dados;
    }));

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador(
      "IN006 - Despesa per capita com manejo de rsu em relação à população urbana"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);

  }

  async function IN007(data) {
    const rsRsc = await api
      .post("get-ps-residuos-coleta", {
        id_municipio: data.id_municipio
      })
      .then((response) => {
        return response.data;
      });
    const rs = await rsRsc.map((residuos) => {
      if (!residuos?.tb013 || !residuos?.tb014) {
        return null;
      }
      const TB013 = parseFloat(residuos?.tb013);
      const TB014 = parseFloat(residuos?.tb014);
      const result = (TB013 / (TB013 + TB014)) * 100;
      const ano = residuos.ano.toString();
      const dados = [
        ano,
        parseFloat(result.toFixed(2)),
        result.toFixed(2).toString(),
      ];
      return dados;
    });
    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador(
      "IN007 - Incidência de empregados próprios no total de empregados no manejo de rsu"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN008(data) {
    const rsRsc = await api
      .post("get-ps-residuos-coleta", {
        id_municipio: data.id_municipio,
      })
      .then((response) => {
        return response.data;
      });

    const rs = await rsRsc.map((residuos) => {
      if (!residuos?.tb013 || !residuos?.tb014) {
        return null;
      }
      const TB013 = parseFloat(residuos?.tb013);
      const TB014 = parseFloat(residuos?.tb014);
      const result = (TB014 / (TB013 + TB014)) * 100;
      const ano = residuos.ano.toString();
      const dados = [
        ano,
        parseFloat(result.toFixed(2)),
        result.toFixed(2).toString(),
      ];
      return dados;
    });

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador(
      "IN008 - Incidência de empregados de empresas contratadas no total de empregados no manejo de rsu"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN010(data) {
    const rsRsc = await api
      .post("get-ps-residuos-coleta", {
        id_municipio: data.id_municipio,
        ano: data.ano,
      })
      .then((response) => {
        return response.data;
      });

    const rs = await rsRsc.map((residuos) => {
      if (!residuos?.tb011 || !residuos?.tb012 || !residuos?.tb013 || !residuos?.tb014) {
        return null;
      }
      const TB011 = parseFloat(residuos?.tb011);
      const TB012 = parseFloat(residuos?.tb012);
      const TB013 = parseFloat(residuos?.tb013);
      const TB014 = parseFloat(residuos?.tb014);
      const result = ((TB011 + TB012) / (TB013 + TB014)) * 100;
      const ano = residuos.ano.toString();
      const dados = [
        ano,
        parseFloat(result.toFixed(2)),
        result.toFixed(2).toString(),
      ];
      return dados;
    });

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador(
      "IN010 - Incidência de empregados gerenciais e administrativos no total de empregados no manejo de rsu"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN011(data) {
    const rsDd = await api
      .get("getMunicipio", { params: { id_municipio: data.id_municipio } })
      .then((response) => {
        return response.data[0];
      });
    
    const rsFn = await api
      .post("get-ps-financeiro", {
        id_municipio: data.id_municipio,
      })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(rsFn.map((financeiro) => {
      if (!financeiro?.fn222 || !rsDd?.dd_populacao_urbana) {
        return null;
      }
      const result = parseFloat(financeiro?.fn222) / parseFloat(rsDd?.dd_populacao_urbana);

      const ano = financeiro.ano.toString();
      const dados = [
        ano,
        parseFloat(result.toFixed(2)),
        result.toFixed(2).toString(),
      ];
      return dados;
    }));

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador(
      "IN011 - Receita arrecadada per capita com taxas ou outras formas de cobrança pela prestação de serviços de manejo rsu"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN014(data) {
    const rsDd = await api
      .get("getMunicipio", { params: { id_municipio: data.id_municipio } })
      .then((response) => {
        return response.data[0];
      });

    const rsGe = await api
      .post("get-geral", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await rsGe.map((geral) => {
      if (!geral?.co165 || !rsDd?.dd_populacao_urbana) {
        return null;
      }
      const CO165 = parseFloat(geral?.co165);
      const POP_URB = parseFloat(rsDd?.dd_populacao_urbana);
      const result = (CO165 / POP_URB) * 100;
      const ano = geral.ano.toString();
      const dados = [
        ano,
        parseFloat(result.toFixed(2)),
        result.toFixed(2).toString(),
      ];
      return dados;
    });

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador(
      "IN014 - Taxa de cobertura do serviço de coleta domiciliar direta (porta-a-porta) da população urbana do município."
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN015(data) {
    const rsDd = await api
      .get("getMunicipio", { params: { id_municipio: data.id_municipio } })
      .then((response) => {
        return response.data[0];
      });

    const rsGe = await api
      .post("get-geral", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await rsGe.map((geral) => {
      if (!geral?.co164 || !rsDd?.dd_populacao_total) {
        return null;
      }
      const CO164 = parseFloat(geral?.co164);
      const POP_TOT = parseFloat(rsDd?.dd_populacao_total);
      const result = (CO164 / POP_TOT) * 100;
      const ano = geral.ano.toString();
      const dados = [
        ano,
        parseFloat(result.toFixed(2)),
        result.toFixed(2).toString(),
      ];
      return dados;
    });

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador(
      "IN015 - Taxa de cobertura regular do serviço de coleta de rdo em relação à população total do município"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN016(data) {
    const rsDd = await api
      .get("getMunicipio", { params: { id_municipio: data.id_municipio } })
      .then((response) => {
        return response.data[0];
      });

    const rsGe = await api
      .post("get-geral", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await rsGe.map((geral) => {
      if (!geral?.co050 || !rsDd?.dd_populacao_urbana) {
        return null;
      }
      const CO050 = parseFloat(geral?.co050);
      const POP_URB = parseFloat(rsDd?.dd_populacao_urbana);
      const result = (CO050 / POP_URB) * 100;
      const ano = geral.ano.toString();
      const dados = [
        ano,
        parseFloat(result.toFixed(2)),
        result.toFixed(2).toString(),
      ];
      return dados;
    });

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador(
      "IN016 - Taxa de cobertura regular do serviço de coleta de rdo em relação à população urbana"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN017(data) {
    const rsRsc = await api
      .post("get-ps-residuos-coleta", {
        id_municipio: data.id_municipio,
      })
      .then((response) => {
        return response.data;
      });

    const rs = await rsRsc.map((residuos) => {
      if (!residuos?.co117 || !residuos?.cs048 || !residuos?.co142 || !residuos?.co116) {
        return null;
      }
      const CO117 = parseFloat(residuos?.co117);
      const CS048 = parseFloat(residuos?.cs048);
      const CO142 = parseFloat(residuos?.co142);
      const CO116 = parseFloat(residuos?.co116);
      const result = ((CO117 + CS048 + CO142) / (CO116 + CO117 + CS048 + CO142)) * 100;
      const ano = residuos.ano.toString();
      const dados = [
        ano,
        parseFloat(result.toFixed(2)),
        result.toFixed(2).toString(),
      ];
      return dados;
    });

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador(
      "IN017 - Taxa de terceirização do serviço de coleta de (rdo + rpu) em relação à quantidade coletada"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN018(data) {
    const rsRsc = await api
      .post("get-ps-residuos-coleta", {
        id_municipio: data.id_municipio,
      })
      .then((response) => {
        return response.data;
      });

    const rs = await rsRsc.map((residuos) => {
      if (!residuos?.co117 || !residuos?.co116 || !residuos?.tb001 || !residuos?.tb002) {
        return null;
      }
      const CO117 = parseFloat(residuos?.co117);
      const CO116 = parseFloat(residuos?.co116);
      const TB001 = parseFloat(residuos?.tb001);
      const TB002 = parseFloat(residuos?.tb002);
      const result = ((CO117 + CO116) / (TB001 + TB002)) * (1000 / 313);
      const ano = residuos.ano.toString();
      const dados = [
        ano,
        parseFloat(result.toFixed(2)),
        result.toFixed(2).toString(),
      ];
      return dados;
    });

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador(
      "IN018 - Produtividade média dos empregados na coleta (coletadores + motoristas) na coleta (rdo + rpu) em relação à massa coletada"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN019(data) {
    const rsDd = await api
      .get("getMunicipio", { params: { id_municipio: data.id_municipio } })
      .then((response) => {
        return response.data[0];
      });

    const rsRsc = await api
      .post("get-ps-residuos-coleta", {
        id_municipio: data.id_municipio,
      })
      .then((response) => {
        return response.data;
      });

    const rs = await rsRsc.map((residuos) => {
      if (!residuos?.tb001 || !residuos?.tb002 || !rsDd?.dd_populacao_urbana) {
        return null;
      }
      const TB001 = parseFloat(residuos?.tb001);
      const TB002 = parseFloat(residuos?.tb002);
      const POP_URB = parseFloat(rsDd?.dd_populacao_urbana);
      const result = ((TB001 + TB002) / POP_URB) * 1000;
      const ano = residuos.ano.toString();
      const dados = [
        ano,
        parseFloat(result.toFixed(2)),
        result.toFixed(2).toString(),
      ];
      return dados;
    });

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador(
      "IN019 - Taxa de empregados (coletadores + motoristas) na coleta (rdo + rpu) em relação à população urbana"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN021(data) {
    const rsDd = await api
      .get("getMunicipio", { params: { id_municipio: data.id_municipio } })
      .then((response) => {
        return response.data[0];
      });

    const rsRsc = await api
      .post("get-ps-residuos-coleta", {
        id_municipio: data.id_municipio,
      })
      .then((response) => {
        return response.data;
      });

    const rs = await rsRsc.map((residuos) => {
      if (!residuos?.co117 || !residuos?.co116 || !residuos?.cs048 || !residuos?.co142 || !rsDd?.dd_populacao_urbana) {
        return null;
      }
      const CO117 = parseFloat(residuos?.co117);
      const CO116 = parseFloat(residuos?.co116);
      const CS048 = parseFloat(residuos?.cs048);
      const CO142 = parseFloat(residuos?.co142);
      const POP_URB = parseFloat(rsDd?.dd_populacao_urbana);
      const result = (((CO116 + CO117 + CS048 + CO142) / POP_URB)) * (1000 / 365);
      const ano = residuos.ano.toString();
      const dados = [
        ano,
        parseFloat(result.toFixed(2)),
        result.toFixed(2).toString(),
      ];
      return dados;
    });

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador(
      "IN021 - Massa coletada (rdo + rpu) per capita em relação à população urbana"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN022(data) {
    const rsDd = await api
      .get("getMunicipio", { params: { id_municipio: data.id_municipio } })
      .then((response) => {
        return response.data[0];
      });
    const rsRc = await api
      .post("get-ps-residuos-coleta", {
        id_municipio: data.id_municipio,
      })
      .then((response) => {
        return response.data;
      });

    const rs = await rsRc.map((residuos) => {
      if (!residuos?.co117 || !residuos?.co116 || !residuos?.cs048 || !residuos?.co142 || !rsDd?.dd_populacao_urbana) {
        return null;
      }
      const CO117 = parseFloat(residuos?.co117);
      const CO116 = parseFloat(residuos?.co116);
      const CS048 = parseFloat(residuos?.cs048);
      const CO142 = parseFloat(residuos?.co142);
      const POP_URB = parseFloat(rsDd?.dd_populacao_urbana);
      const result = ((CO116 + CO117 + CS048 + CO142) / POP_URB) * (1000 / 365);
      const ano = residuos.ano.toString();
      const dados = [
        ano,
        parseFloat(result.toFixed(2)),
        result.toFixed(2).toString(),
      ];
      return dados;
    });

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador(
      "IN022 - Massa (rdo) coletada per capita em relação à população atendida com serviço de coleta"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN023(data) {
    const rsRc = await api
      .post("get-ps-residuos-coleta", {
        id_municipio: data.id_municipio,
      })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(rsRc.map(async (residuos) => {
      const rsFn = await api
        .post("get-ps-financeiro-por-ano", {
          id_municipio: data.id_municipio,
          ano: residuos.ano,
        })
        .then((response) => {
          return response.data[0];
        });

      if (!residuos?.co117 || !residuos?.co116 || !residuos?.cs048 || !rsFn?.fn206 || !rsFn?.fn207) {
        return null;
      }

      const CO117 = parseFloat(residuos?.co117);
      const CO116 = parseFloat(residuos?.co116);
      const CS048 = parseFloat(residuos?.cs048);
      const FN206 = parseFloat(rsFn?.fn206);
      const FN207 = parseFloat(rsFn?.fn207);
      const result = (FN206 + FN207) / (CO116 + CO117 + CS048);
      const ano = residuos.ano.toString();
      const dados = [
        ano,
        parseFloat(result.toFixed(2)),
        result.toFixed(2).toString(),
      ];
      return dados;
    }));

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador(
      "IN023 - Custo unitário médio do serviço de coleta (rdo + rpu)"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }
  async function IN024(data) {
    const rsFn = await api
      .post("get-ps-financeiro", {
        id_municipio: data.id_municipio,
      })
      .then((response) => {
        return response.data;
      });

    const rs = await rsFn.map((financeiro) => {
      if (!financeiro?.fn222 || !financeiro?.fn207 || !financeiro?.fn218 || !financeiro?.fn219) {
        return null;
      }
      const result = ((parseFloat(financeiro?.fn222) + parseFloat(financeiro?.fn207)) / (parseFloat(financeiro?.fn218) + parseFloat(financeiro?.fn219))) * 100;
      const ano = financeiro.ano.toString();
      const dados = [
        ano,
        parseFloat(result.toFixed(2)),
        result.toFixed(2).toString(),
      ];
      return dados;
    });

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador(
      "IN024 - Incidência do custo do serviço de coleta (rdo + rpu) no custo total do manejo de rsu"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN025(data) {
    const rsRsc = await api
      .post("getPsResiduosColeta", {
        id_municipio: data.id_municipio,
        ano: data.ano,
      })
      .then((response) => {
        return response.data[0];
      });

    const TB001 = rsRsc?.tb001;
    const TB002 = rsRsc?.tb002;
    const TB013 = rsRsc?.tb013;
    const TB014 = rsRsc?.tb014;
    const result = ((TB001 + TB002) / (TB013 + TB014)) * 100;
    const ano = data.ano;
    const dados = [
      ["Ano", "Dados"],
      [ano, result],
    ];
    setData(dados);
  }

  async function IN027(data) {
    const rsRc = await api
      .post("getPsResiduosColeta", {
        id_municipio: data.id_municipio,
        ano: data.ano,
      })
      .then((response) => {
        return response.data[0];
      });

    const CO108 = rsRc?.co108;
    const CO109 = rsRc?.co109;
    const CO112 = rsRc?.co112;
    const CO113 = rsRc?.co113;
    const CS048 = rsRc?.cs048;
    const CO140 = rsRc?.co140;
    const CO141 = rsRc?.co141;
    const result =
      ((CO112 + CO113 + CO141) / (CO108 + CO109 + CS048 + CO140)) * 100;
    const ano = data.ano;
    const dados = [
      ["Ano", "Dados"],
      [ano, result],
    ];
    setData(dados);
  }

  async function IN028(data) {
    const rsRsc = await api
      .post("get-ps-residuos-coleta", {
        id_municipio: data.id_municipio,
      })
      .then((response) => {
        return response.data;
      });

    const rs = await rsRsc.map((residuos) => {
      if (!residuos?.co108 || !residuos?.co109 || !residuos?.co112 || !residuos?.co113 || !residuos?.cs048 || !residuos?.co140 || !residuos?.co141) {
        return null;
      }
      const CO108 = parseFloat(residuos?.co108);
      const CO109 = parseFloat(residuos?.co109);
      const CO112 = parseFloat(residuos?.co112);
      const CO113 = parseFloat(residuos?.co113);
      const CS048 = parseFloat(residuos?.cs048);
      const CO140 = parseFloat(residuos?.co140);
      const CO141 = parseFloat(residuos?.co141);
      const result = ((CO112 + CO113 + CO141) / (CO108 + CO109 + CS048 + CO140)) * 100;
      const ano = residuos.ano.toString();
      const dados = [
        ano,
        parseFloat(result.toFixed(2)),
        result.toFixed(2).toString(),
      ];
      return dados;
    });

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador(
      "IN028 - Massa de resíduos domiciliares e públicos (rdo+rpu) coletada per capita em relação à população total atendida pelo serviço de coleta"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN030(data) {
    const rsDd = await api
      .get("getMunicipio", { params: { id_municipio: data.id_municipio } })
      .then((response) => {
        return response.data[0];
      });

    const rsGe = await api
      .post("get-geral", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await rsGe.map((geral) => {
      if (!geral?.cs050 || !rsDd?.dd_populacao_urbana) {
        return null;
      }
      const CS050 = parseFloat(geral?.cs050);
      const POP_URB = parseFloat(rsDd?.dd_populacao_urbana);
      const result = (CS050 / POP_URB) * 100;
      const ano = geral.ano.toString();
      const dados = [
        ano,
        parseFloat(result.toFixed(2)),
        result.toFixed(2).toString(),
      ];
      return dados;
    });

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador(
      "IN030 - Taxa de cobertura do serviço de coleta seletiva porta-a-porta em relação à população urbana do município."
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN031(data) {
    const rsRc = await api
      .post("get-ps-residuos-coleta", {
        id_municipio: data.id_municipio,
      })
      .then((response) => {
        return response.data;
      });

    const rs = await rsRc.map((residuos) => {
      if (!residuos?.cs009 || !residuos?.co116 || !residuos?.co117 || !residuos?.cs048 || !residuos?.co142) {
        return null;
      }
      const CS009 = parseFloat(residuos?.cs009);
      const CO116 = parseFloat(residuos?.co116);
      const CO117 = parseFloat(residuos?.co117);
      const CS048 = parseFloat(residuos?.cs048);
      const CO142 = parseFloat(residuos?.co142);
      const result = (CS009 / (CO116 + CO117 + CS048 + CO142)) * 100;
      const ano = residuos.ano.toString();
      const dados = [
        ano,
        parseFloat(result.toFixed(2)),
        result.toFixed(2).toString(),
      ];
      return dados;
    });

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador(
      "IN031 - Taxa de recuperação de materiais recicláveis (exceto matéria orgânica e rejeitos) em relação à quantidade total (rdo + rpu) coletada"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN032(data) {
    const rsDd = await api
      .get("getMunicipio", { params: { id_municipio: data.id_municipio } })
      .then((response) => {
        return response.data[0];
      });

    const rsRc = await api
      .post("get-ps-residuos-coleta", {
        id_municipio: data.id_municipio,
      })
      .then((response) => {
        return response.data;
      });

    const rs = await rsRc.map((residuos) => {
      if (!residuos?.cs009 || !rsDd?.dd_populacao_urbana) {
        return null;
      }
      const CS009 = parseFloat(residuos?.cs009);
      const POP_URB = parseFloat(rsDd?.dd_populacao_urbana);
      const result = (CS009 / POP_URB) * 1000;
      const ano = residuos.ano.toString();
      const dados = [
        ano,
        parseFloat(result.toFixed(2)),
        result.toFixed(2).toString(),
      ];
      return dados;
    });

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador(
      "IN032 - Massa recuperada per capita de materiais recicláveis (exceto matéria orgânica e rejeitos) em relação à população urbana"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN034(data) {
    const rsRc = await api
      .post("getPsResiduosColeta", {
        id_municipio: data.id_municipio,
      })
      .then((response) => {
        return response.data;
      });

    const rs = await rsRc.map((residuos) => {
      if (!residuos?.cs009 || !residuos?.cs010) {
        return null;
      }
      const CS009 = parseFloat(residuos?.cs009);
      const CS010 = parseFloat(residuos?.cs010);
      const result = (CS010 / CS009) * 100;
      const ano = residuos.ano.toString();
      const dados = [
        ano,
        parseFloat(result.toFixed(2)),
        result.toFixed(2).toString(),
      ];
      return dados;
    });

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador(
      "IN034 - Incidência de papel e papelão no total de material recuperado"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN035(data) {
    const rsRc = await api
      .post("get-ps-residuos-coleta", {
        id_municipio: data.id_municipio,
      })
      .then((response) => {
        return response.data;
      });

    const rs = await rsRc.map((residuos) => {
      if (!residuos?.cs009 || !residuos?.cs011) {
        return null;
      }
      const CS009 = parseFloat(residuos?.cs009);
      const CS011 = parseFloat(residuos?.cs011);
      const result = (CS011 / CS009) * 100;
      const ano = residuos.ano.toString();
      const dados = [
        ano,
        parseFloat(result.toFixed(2)),
        result.toFixed(2).toString(),
      ];
      return dados;
    });

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador(
      "IN035 - Incidência de plásticos no total de material recuperado"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN038(data) {
    const rsRc = await api
      .post("get-ps-residuos-coleta", {
        id_municipio: data.id_municipio,
      })
      .then((response) => {
        return response.data;
      });

    const rs = await rsRc.map((residuos) => {
      if (!residuos?.cs009 || !residuos?.cs012) {
        return null;
      }
      const CS009 = parseFloat(residuos?.cs009);
      const CS012 = parseFloat(residuos?.cs012);
      const result = (CS012 / CS009) * 100;
      const ano = residuos.ano.toString();
      const dados = [
        ano,
        parseFloat(result.toFixed(2)),
        result.toFixed(2).toString(),
      ];
      return dados;
    });

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador(
      "IN038 - Incidência de metais no total de material recuperado"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN039(data) {
    const rsRc = await api
      .post("get-ps-residuos-coleta", {
        id_municipio: data.id_municipio,
      })
      .then((response) => {
        return response.data;
      });

    const rs = await rsRc.map((residuos) => {
      if (!residuos?.cs009 || !residuos?.cs013) {
        return null;
      }
      const CS009 = parseFloat(residuos?.cs009);
      const CS013 = parseFloat(residuos?.cs013);
      const result = (CS013 / CS009) * 100;
      const ano = residuos.ano.toString();
      const dados = [
        ano,
        parseFloat(result.toFixed(2)),
        result.toFixed(2).toString(),
      ];
      return dados;
    });

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador(
      "IN039 - Incidência de vidros no total de material recuperado"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN040(data) {
    const rsRc = await api
      .post("get-ps-residuos-coleta", {
        id_municipio: data.id_municipio,
      })
      .then((response) => {
        return response.data;
      });

    const rs = await rsRc.map((residuos) => {
      if (!residuos?.cs009 || !residuos?.cs014) {
        return null;
      }
      const CS009 = parseFloat(residuos?.cs009);
      const CS014 = parseFloat(residuos?.cs014);
      const result = (CS014 / CS009) * 100;
      const ano = residuos.ano.toString();
      const dados = [
        ano,
        parseFloat(result.toFixed(2)),
        result.toFixed(2).toString(),
      ];
      return dados;
    });

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador(
      "IN040 - Incidência de outros materiais (exceto papel, plástico, metais e vidros) no total de material recuperado"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN053(data) {
    const rsRc = await api
      .post("get-ps-residuos-coleta", {
        id_municipio: data.id_municipio,
      })
      .then((response) => {
        return response.data;
      });

    const rs = await rsRc.map((residuos) => {
      if (!residuos?.co108 || !residuos?.co109 || !residuos?.cs026 || !residuos?.cs048 || !residuos?.co140) {
        return null;
      }
      const CO108 = parseFloat(residuos?.co108);
      const CO109 = parseFloat(residuos?.co109);
      const CS026 = parseFloat(residuos?.cs026);
      const CS048 = parseFloat(residuos?.cs048);
      const CO140 = parseFloat(residuos?.co140);
      const result = (CS026 / (CO108 + CO109 + CS048 + CO140)) * 100;
      const ano = residuos.ano.toString();
      const dados = [
        ano,
        parseFloat(result.toFixed(2)),
        result.toFixed(2).toString(),
      ];
      return dados;
    });

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador(
      "IN053 - Taxa de material recolhido pela coleta seletiva (exceto mat. orgânica) em relação à quantidade total coletada de resíduos sólidos domésticos"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN054(data) {
    const rsDd = await api
      .get("getMunicipio", { params: { id_municipio: data.id_municipio } })
      .then((response) => {
        return response.data[0];
      });

    const rsRc = await api
      .post("get-ps-residuos-coleta", {
        id_municipio: data.id_municipio,
      })
      .then((response) => {
        return response.data;
      });

    const rs = await rsRc.map((residuos) => {
      if (!residuos?.cs026 || !rsDd?.dd_populacao_urbana) {
        return null;
      }
      const CS026 = parseFloat(residuos?.cs026);
      const POP_URB = parseFloat(rsDd?.dd_populacao_urbana);
      const result = (CS026 / POP_URB) * 1000;
      const ano = residuos.ano.toString();
      const dados = [
        ano,
        parseFloat(result.toFixed(2)),
        result.toFixed(2).toString(),
      ];
      return dados;
    });

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador(
      "IN054 - Massa per capita de materiais recicláveis recolhidos via coleta seletiva"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN036(data) {
    const rsDd = await api
      .get("getMunicipio", { params: { id_municipio: data.id_municipio } })
      .then((response) => {
        return response.data[0];
      });

    const rsRc = await api
      .post("get-ps-residuos-coleta", {
        id_municipio: data.id_municipio,
      })
      .then((response) => {
        return response.data;
      });

    const rs = await rsRc.map((residuos) => {
      if (!residuos?.rs044 || !rsDd?.dd_populacao_urbana) {
        return null;
      }
      const RS044 = parseFloat(residuos?.rs044);
      const POP_URB = parseFloat(rsDd?.dd_populacao_urbana);
      const result = (RS044 / POP_URB) * (1000000 / 365);
      const ano = residuos.ano.toString();
      const dados = [
        ano,
        parseFloat(result.toFixed(2)),
        result.toFixed(2).toString(),
      ];
      return dados;
    });

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador(
      "IN036 - Massa de rss coletada per capita em relação à população urbana"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN037(data) {
    const rsRc = await api
      .post("get-ps-residuos-coleta", {
        id_municipio: data.id_municipio,
      })
      .then((response) => {
        return response.data;
      });

    const rs = await rsRc.map((residuos) => {
      if (!residuos?.rs044 || !residuos?.co116 || !residuos?.co117 || !residuos?.cs048 || !residuos?.co142) {
        return null;
      }
      const RS044 = parseFloat(residuos?.rs044);
      const CO116 = parseFloat(residuos?.co116);
      const CO117 = parseFloat(residuos?.co117);
      const CS048 = parseFloat(residuos?.cs048);
      const CO142 = parseFloat(residuos?.co142);
      const result = (RS044 / (CO116 + CO117 + CS048 + CO142)) * 100;
      const ano = residuos.ano.toString();
      const dados = [
        ano,
        parseFloat(result.toFixed(2)),
        result.toFixed(2).toString(),
      ];
      return dados;
    });

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador(
      "IN037 - Taxa de rss coletada em relação à quantidade total coletada"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN041(data) {
    const rsRsc = await api
      .post("get-ps-residuos-coleta", {
        id_municipio: data.id_municipio,
      })
      .then((response) => {
        return response.data;
      });

    const rs = await rsRsc.map((residuos) => {
      if (!residuos?.tb003 || !residuos?.tb004) {
        return null;
      }
      const TB003 = parseFloat(residuos?.tb003);
      const TB004 = parseFloat(residuos?.tb004);
      const result = (TB004 / (TB003 + TB004)) * 100;
      const ano = residuos.ano.toString();
      const dados = [
        ano,
        parseFloat(result.toFixed(2)),
        result.toFixed(2).toString(),
      ];
      return dados;
    });

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador(
      "IN041 - Taxa de terceirização dos varredores"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN042(data) {
    const rsRsc = await api
      .post("get-ps-residuos-coleta", {
        id_municipio: data.id_municipio,
      })
      .then((response) => {
        return response.data;
      });

    const rs = await rsRsc.map((residuos) => {
      if (!residuos?.va011 || !residuos?.va039) {
        return null;
      }
      const VA011 = parseFloat(residuos?.va011);
      const VA039 = parseFloat(residuos?.va039);
      const result = (VA011 / VA039) * 100;
      const ano = residuos.ano.toString();
      const dados = [
        ano,
        parseFloat(result.toFixed(2)),
        result.toFixed(2).toString(),
      ];
      return dados;
    });

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador(
      "IN042 - Taxa de terceirização da extensão varrida"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN043(data) {
    const rsRsc = await api
      .post("get-ps-residuos-coleta", {
        id_municipio: data.id_municipio,
      })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(rsRsc.map(async (residuos) => {
      const rsFin = await api
        .post("get-ps-financeiro-por-ano", {
          id_municipio: data.id_municipio,
          ano: residuos.ano,
        })
        .then((response) => {
          return response.data[0];
        });

      if (!residuos?.va039 || !rsFin?.fn212 || !rsFin?.fn213) {
        return null;
      }

      const VA039 = parseFloat(residuos?.va039);
      const FN212 = parseFloat(rsFin?.fn212);
      const FN213 = parseFloat(rsFin?.fn213);
      const result = (FN212 + FN213) / VA039;
      const ano = residuos.ano.toString();
      const dados = [
        ano,
        parseFloat(result.toFixed(2)),
        result.toFixed(2).toString(),
      ];
      return dados;
    }));

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador(
      "IN043 - Custo unitário médio do serviço de varrição"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN044(data) {
    const rsRsc = await api
      .post("getPsResiduosColeta", {
        id_municipio: data.id_municipio,
        ano: data.ano,
      })
      .then((response) => {
        return response.data[0];
      });

    const VA039 = rsRsc?.va039;
    const TB003 = rsRsc?.tb003;
    const TB004 = rsRsc?.tb004;
    const result = (VA039 / (TB003 + TB004)) * (1 / 313);
    const ano = data.ano;
    const dados = [
      ["Ano", "Dados"],
      [ano, result],
    ];
    setData(dados);
  }

  async function IN045(data) {
    const rsDd = await api
      .get("getMunicipio", { params: { id_municipio: data.id_municipio } })
      .then((response) => {
        return response.data[0];
      });

    const rsRsc = await api
      .post("get-ps-residuos-coleta", {
        id_municipio: data.id_municipio,
      })
      .then((response) => {
        return response.data;
      });

    const rs = await rsRsc.map((residuos) => {
      if (!residuos?.tb003 || !residuos?.tb004 || !rsDd?.dd_populacao_urbana) {
        return null;
      }
      const TB003 = parseFloat(residuos?.tb003);
      const TB004 = parseFloat(residuos?.tb004);
      const POP_URB = parseFloat(rsDd?.dd_populacao_urbana);
      const result = ((TB003 + TB004) / POP_URB) * 1000;
      const ano = residuos.ano.toString();
      const dados = [
        ano,
        parseFloat(result.toFixed(2)),
        result.toFixed(2).toString(),
      ];
      return dados;
    });

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador(
      "IN045 - Taxa de varredores em relação à população urbana"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN046(data) {
    const rsFn = await api
      .post("get-ps-financeiro", {
        id_municipio: data.id_municipio,
      })
      .then((response) => {
        return response.data;
      });

    const rs = await rsFn.map((financeiro) => {
      if (!financeiro?.fn212 || !financeiro?.fn213 || !financeiro?.fn218 || !financeiro?.fn219) {
        return null;
      }
      const result = ((parseFloat(financeiro?.fn212) + parseFloat(financeiro?.fn213)) / (parseFloat(financeiro?.fn218) + parseFloat(financeiro?.fn219))) * 100;
      const ano = financeiro.ano.toString();
      const dados = [
        ano,
        parseFloat(result.toFixed(2)),
        result.toFixed(2).toString(),
      ];
      return dados;
    });

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador(
      "IN046 - Incidência do custo do serviço de varrição no custo total com manejo de rsu"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN047(data) {
    const rsRsc = await api
      .post("get-ps-residuos-coleta", {
        id_municipio: data.id_municipio,
      })
      .then((response) => {
        return response.data;
      });

    const rs = await rsRsc.map((residuos) => {
      if (!residuos?.tb003 || !residuos?.tb004 || !residuos?.tb013 || !residuos?.tb014) {
        return null;
      }
      const TB003 = parseFloat(residuos?.tb003);
      const TB004 = parseFloat(residuos?.tb004);
      const TB013 = parseFloat(residuos?.tb013);
      const TB014 = parseFloat(residuos?.tb014);
      const result = ((TB003 + TB004) / (TB013 + TB014)) * 100;
      const ano = residuos.ano.toString();
      const dados = [
        ano,
        parseFloat(result.toFixed(2)),
        result.toFixed(2).toString(),
      ];
      return dados;
    });

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador(
      "IN047 - Incidência de varredores no total de empregados no manejo de rsu"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN048(data) {
    const rsDd = await api
      .get("getMunicipio", { params: { id_municipio: data.id_municipio } })
      .then((response) => {
        return response.data[0];
      });

    const rsRsc = await api
      .post("get-ps-residuos-coleta", {
        id_municipio: data.id_municipio,
      })
      .then((response) => {
        return response.data;
      });

    const rs = await rsRsc.map((residuos) => {
      if (!residuos?.va039 || !rsDd?.dd_populacao_urbana) {
        return null;
      }
      const VA039 = parseFloat(residuos?.va039);
      const POP_URB = parseFloat(rsDd?.dd_populacao_urbana);
      const result = (VA039 / POP_URB);
      const ano = residuos.ano.toString();
      const dados = [
        ano,
        parseFloat(result.toFixed(2)),
        result.toFixed(2).toString(),
      ];
      return dados;
    });

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador(
      "IN048 - Extensão total anual varrida per capita"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN051(data) {
    const rsDd = await api
      .get("getMunicipio", { params: { id_municipio: data.id_municipio } })
      .then((response) => {
        return response.data[0];
      });

    const rsRsc = await api
      .post("get-ps-residuos-coleta", {
        id_municipio: data.id_municipio,
      })
      .then((response) => {
        return response.data;
      });

    const rs = await rsRsc.map((residuos) => {
      if (!residuos?.tb005 || !residuos?.tb006 || !rsDd?.dd_populacao_urbana) {
        return null;
      }
      const TB005 = parseFloat(residuos?.tb005);
      const TB006 = parseFloat(residuos?.tb006);
      const POP_URB = parseFloat(rsDd?.dd_populacao_urbana);
      const result = (TB005 + TB006) / POP_URB;
      const ano = residuos.ano.toString();
      const dados = [
        ano,
        parseFloat(result.toFixed(2)),
        result.toFixed(2).toString(),
      ];
      return dados;
    });

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador(
      "IN051 - Taxa de capinadores em relação à população urbana"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN052(data) {   
    const rsRsc = await api
      .post("get-ps-residuos-coleta", {
        id_municipio: data.id_municipio,
      })
      .then((response) => {
        return response.data;
      });

    const rs = await rsRsc.map((residuos) => {
      if (!residuos?.tb005 || !residuos?.tb006 || !residuos?.tb013 || !residuos?.tb014) {
        return null;
      }
      const TB005 = parseFloat(residuos?.tb005);
      const TB006 = parseFloat(residuos?.tb006);
      const TB013 = parseFloat(residuos?.tb013);
      const TB014 = parseFloat(residuos?.tb014);
      const result = ((TB005 + TB006) / (TB013 + TB014)) * 100;
      const ano = residuos.ano.toString();
      const dados = [
        ano,
        parseFloat(result.toFixed(2)),
        result.toFixed(2).toString(),
      ];
      return dados;
    });

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador(
      "IN052 - Incidência de capinadores no total empregados no manejo de rsu"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN026(data) {
    const rsRsc = await api
      .post("get-ps-residuos-coleta", {
        id_municipio: data.id_municipio,
      })
      .then((response) => {
        return response.data;
      });

    const rs = await rsRsc.map((residuos) => {
      if (!residuos?.co116 || !residuos?.co117 || !residuos?.cc013 || !residuos?.cs048 || !residuos?.co142) {
        return null;
      }
      const CO116 = parseFloat(residuos?.co116);
      const CO117 = parseFloat(residuos?.co117);
      const CC013 = parseFloat(residuos?.cc013);
      const CS048 = parseFloat(residuos?.cs048);
      const CO142 = parseFloat(residuos?.co142);
      const result = (CC013 / (CO116 + CO117 + CS048 + CO142)) * 100;
      const ano = residuos.ano.toString();
      const dados = [
        ano,
        parseFloat(result.toFixed(2)),
        result.toFixed(2).toString(),
      ];
      return dados;
    });

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador(
      "IN026 - Taxa de resíduos sólidos da construção civil (rcc) coletada pela prefeitura em relação à quantidade total coletada"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN029(data) {
    const rsDd = await api
      .get("getMunicipio", { params: { id_municipio: data.id_municipio } })
      .then((response) => {
        return response.data[0];
      });

    const rsRsc = await api
      .post("get-ps-residuos-coleta", {
        id_municipio: data.id_municipio,
      })
      .then((response) => {
        return response.data;
      });

    const rs = await rsRsc.map((residuos) => {
      if (!residuos?.cc013 || !residuos?.cc014 || !residuos?.cc015 || !rsDd?.dd_populacao_urbana) {
        return null;
      }
      const CC013 = parseFloat(residuos?.cc013);
      const CC014 = parseFloat(residuos?.cc014);
      const CC015 = parseFloat(residuos?.cc015);
      const POP_URB = parseFloat(rsDd?.dd_populacao_urbana);
      const result = ((CC013 + CC014 + CC015) / POP_URB) * 1000;
      const ano = residuos.ano.toString();
      const dados = [
        ano,
        parseFloat(result.toFixed(2)),
        result.toFixed(2).toString(),
      ];
      return dados;
    });

    const rsFilter = rs.filter((item) => item !== null);

    if (rsFilter.length === 0) {
      setActiveTab("error");
      setData(null);
    } else {
      setActiveTab("dados");
    }

    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador(
      "IN029 - Massa de rcc per capita em relação à população urbana"
    );
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
                      <option value="IN001">
                        IN001 - Taxa de empregados em relação à população urbana
                      </option>
                      <option value="IN002">
                        IN002 - Despesa média por empregado alocado nos serviços
                        do manejo de rsu
                      </option>
                      <option value="IN003">
                        IN003 - Incidência das despesas com o manejo de rsu nas
                        despesas correntes da prefeitura
                      </option>
                      <option value="IN004">
                        IN004 - Incidência das despesas com empresas contratadas
                        para execução de serviços de manejo rsu nas despesas com
                        manejo de rsu
                      </option>
                      <option value="IN005">
                        IN005 - Auto-suficiência financeira da prefeitura com o
                        manejo de rsu
                      </option>
                      <option value="IN006">
                        IN006 - Despesa per capita com manejo de rsu em relação
                        à população urbana
                      </option>
                      <option value="IN007">
                        IN007 - Incidência de empregados próprios no total de
                        empregados no manejo de rsu
                      </option>
                      <option value="IN008">
                        IN008 - Incidência de empregados de empresas contratadas
                        no total de empregados no manejo de rsu
                      </option>
                      <option value="IN010">
                        IN010 - Incidência de empregados gerenciais e
                        administrativos no total de empregados no manejo de rsu
                      </option>
                      <option value="IN011">
                        IN011 - Receita arrecadada per capita com taxas ou
                        outras formas de cobrança pela prestação de serviços de
                        manejo rsu
                      </option>
                      <option value="IN014">
                        IN014 - Taxa de cobertura do serviço de coleta
                        domiciliar direta (porta-a-porta) da população urbana do
                        município.
                      </option>
                      <option value="IN015">
                        IN015 - Taxa de cobertura regular do serviço de coleta
                        de rdo em relação à população total do município
                      </option>
                      <option value="IN016">
                        IN016 - Taxa de cobertura regular do serviço de coleta
                        de rdo em relação à população urbana
                      </option>
                      <option value="IN017">
                        IN017 - Taxa de terceirização do serviço de coleta de
                        (rdo + rpu) em relação à quantidade coletada
                      </option>
                      <option value="IN018">
                        IN018 - Produtividade média dos empregados na coleta
                        (coletadores + motoristas) na coleta (rdo + rpu) em
                        relação à massa coletada
                      </option>
                      <option value="IN019">
                        IN019 - Taxa de empregados (coletadores + motoristas) na
                        coleta (rdo + rpu) em relação à população urbana
                      </option>
                      <option value="IN021">
                        IN021 - Massa coletada (rdo + rpu) per capita em relação
                        à população urbana
                      </option>
                      <option value="IN022">
                        IN022 - Massa (rdo) coletada per capita em relação à
                        população atendida com serviço de coleta
                      </option>
                      <option value="IN023">
                        IN023 - Custo unitário médio do serviço de coleta (rdo +
                        rpu)
                      </option>
                      <option value="IN024">
                        IN024 - Incidência do custo do serviço de coleta (rdo +
                        rpu) no custo total do manejo de rsu
                      </option>
                      <option value="IN025">
                        IN025 - Incidência de (coletadores + motoristas) na
                        quantidade total de empregados no manejo de rsu
                      </option>
                      <option value="IN027">
                        IN027 - Taxa da quantidade total coletada de resíduos
                        públicos (rpu) em relação à quantidade total coletada de
                        resíduos sólidos domésticos (rdo)
                      </option>
                      <option value="IN028">
                        IN028 - Massa de resíduos domiciliares e públicos
                        (rdo+rpu) coletada per capita em relação à população
                        total atendida pelo serviço de coleta
                      </option>
                      <option value="IN030">
                        IN030 - Taxa de cobertura do serviço de coleta seletiva
                        porta-a-porta em relação à população urbana do
                        município.
                      </option>
                      <option value="IN031">
                        IN031 - Taxa de recuperação de materiais recicláveis
                        (exceto matéria orgânica e rejeitos) em relação à
                        quantidade total (rdo + rpu) coletada
                      </option>
                      <option value="IN032">
                        IN032 - Massa recuperada per capita de materiais
                        recicláveis (exceto matéria orgânica e rejeitos) em
                        relação à população urbana
                      </option>
                      <option value="IN034">
                        IN034 - Incidência de papel e papelão no total de
                        material recuperado
                      </option>
                      <option value="IN035">
                        IN035 - Incidência de plásticos no total de material
                        recuperado
                      </option>
                      <option value="IN038">
                        IN038 - Incidência de metais no total de material
                        recuperado
                      </option>
                      <option value="IN039">
                        IN039 - Incidência de vidros no total de material
                        recuperado
                      </option>
                      <option value="IN040">
                        IN040 - Incidência de outros materiais (exceto papel,
                        plástico, metais e vidros) no total de material
                        recuperado
                      </option>
                      <option value="IN053">
                        IN053 - Taxa de material recolhido pela coleta seletiva
                        (exceto mat. orgânica) em relação à quantidade total
                        coletada de resíduos sól. domésticos
                      </option>
                      <option value="IN054">
                        IN054 - Massa per capita de materiais recicláveis
                        recolhidos via coleta seletiva
                      </option>
                      <option value="IN036">
                        IN036 - Massa de rss coletada per capita em relação à
                        população urbana
                      </option>
                      <option value="IN037">
                        IN037 - Taxa de rss coletada em relação à quantidade
                        total coletada
                      </option>
                      <option value="IN041">
                        IN041 - Taxa de terceirização dos varredores
                      </option>
                      <option value="IN042">
                        IN042 - Taxa de terceirização da extensão varrida
                      </option>
                      <option value="IN044">
                        IN044 - Produtividade média dos varredores (prefeitura +
                        empresas contratadas)
                      </option>
                      <option value="IN045">
                        IN045 - Taxa de varredores em relação à população urbana
                      </option>
                      <option value="IN046">
                        IN046 - Incidência do custo do serviço de varrição no
                        custo total com manejo de rsu
                      </option>
                      <option value="IN047">
                        IN047 - Incidência de varredores no total de empregados
                        no manejo de rsu
                      </option>
                      <option value="IN048">
                        IN048 - Extensão total anual varrida per capita
                      </option>
                      <option value="IN051">
                        IN051 - Taxa de capinadores em relação à população
                        urbana
                      </option>
                      <option value="IN052">
                        IN052 - Incidência de capinadores no total empregados no
                        manejo de rsu
                      </option>
                      <option value="IN026">
                        IN026 - Taxa de resíduos sólidos da construção civil
                        (rcc) coletada pela prefeitura em relação à quantidade
                        total coletada
                      </option>
                      <option value="IN029">
                        IN029 - Massa de rcc per capita em relação à população
                        urbana
                      </option>
                    </select>
                  </td>
                  <td>
                    {" "}
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
