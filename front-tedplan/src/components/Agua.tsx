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
import { set, useForm } from "react-hook-form";
import api from "../services/api";
import {
  FaBars,
  FaChartArea,
  FaChartBar,
  FaChartLine,
  FaEllipsisV,
  FaFileCsv,
  FaFileExcel,
  FaFilePdf,
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

export default function Agua({ municipio }: MunicipioProps) {
  const { usuario, signOut } = useContext(AuthContext);
  const [title, setTitle] = useState<IMunicipio | any>(municipio);
  const [municipios, setMunicipios] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const chartRef = useRef(null);
  const reportRef = useRef(null);
  const [data, setData] = useState(null);
  const [indicador, setIndicador] = useState(null);
  const [tituloIndicador, setTituloIndicador] = useState(null);
  const [typeChart, setTypeChart] =
    useState<GoogleChartWrapperChartType>("LineChart");
  const [visibleMenuChart, setVisibleMenuChart] = useState(false);
  const [visibleMenuReports, setVisibleMenuReports] = useState(false);
  var options = {
    title: title,
    curveType: "function",
    legend: { position: "bottom" },
    pointSize: 5,
    annotations: {
      textStyle: {
        fontSize: 14,
        color: "black",
      },
    },
  };

  useEffect(() => {
    let data = {
      ano: new Date().getFullYear(),
      id_municipio: 1,
    };
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
    if (data.indicador == "IN006") {
      IN007(data);
    }
    if (data.indicador == "IN008") {
      IN008(data);
    }
    if (data.indicador == "IN012") {
      IN012(data);
    }
    if (data.indicador == "IN018") {
      IN018(data);
    }
    if (data.indicador == "IN019") {
      IN019(data);
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
    if (data.indicador == "IN030") {
      IN030(data);
    }
    if (data.indicador == "IN031") {
      IN031(data);
    }
    if (data.indicador == "IN032") {
      IN032(data);
    }
    if (data.indicador == "IN033") {
      IN033(data);
    }
    if (data.indicador == "IN034") {
      IN034(data);
    }
    if (data.indicador == "IN035") {
      IN035(data);
    }
    if (data.indicador == "IN036") {
      IN036(data);
    }
    if (data.indicador == "IN037") {
      IN037(data);
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
    if (data.indicador == "IN041") {
      IN041(data);
    }
    if (data.indicador == "IN042") {
      IN042(data);
    }
    if (data.indicador == "IN045") {
      IN045(data);
    }
    if (data.indicador == "IN048") {
      IN048(data);
    }
    if (data.indicador == "IN054") {
      IN054(data);
    }
    if (data.indicador == "IN060") {
      IN060(data);
    }
    if (data.indicador == "IN101") {
      IN101(data);
    }
    if (data.indicador == "IN102") {
      IN102(data);
    }
    if (data.indicador == "IN001") {
      IN001(data);
    }
    if (data.indicador == "IN009") {
      IN009(data);
    }
    if (data.indicador == "IN010") {
      IN010(data);
    }
    if (data.indicador == "IN011") {
      IN011(data);
    }
    if (data.indicador == "IN013") {
      IN013(data);
    }
    if (data.indicador == "IN014") {
      IN014(data);
    }
    if (data.indicador == "IN017") {
      IN017(data);
    }
    if (data.indicador == "IN020") {
      IN020(data);
    }
    if (data.indicador == "IN022") {
      IN022(data);
    }
    if (data.indicador == "IN023") {
      IN023(data);
    }
    if (data.indicador == "IN025") {
      IN025(data);
    }
    if (data.indicador == "IN028") {
      IN028(data);
    }
    if (data.indicador == "IN043") {
      IN043(data);
    }
    if (data.indicador == "IN044") {
      IN044(data);
    }
    if (data.indicador == "IN049") {
      IN049(data);
    }
    if (data.indicador == "IN050") {
      IN050(data);
    }
    if (data.indicador == "IN051") {
      IN051(data);
    }
    if (data.indicador == "IN052") {
      IN052(data);
    }
    if (data.indicador == "IN053") {
      IN053(data);
    }
    if (data.indicador == "IN055") {
      IN055(data);
    }
    if (data.indicador == "IN057") {
      IN057(data);
    }
    if (data.indicador == "IN058") {
      IN058(data);
    }
  }

  async function IN002(data) {
    //Request Agua do municipio com todos os anos cadastrados
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    //Lista do resultado da formula IN002 para cada ano
    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        const rsAguaAnoRef = await api
          .post("get-agua-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });

        let rsAguaAnoAnterior = await api
          .post("get-agua-por-ano", {
            id_municipio: data.id_municipio,
            ano: parseInt(resAgua.ano) - 1,
          })
          .then((response) => {
            return response.data[0];
          });

        const rsGeralAnoRef = await api
          .post("get-geral-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });

        let rsGeralAnoAnterior = await api
          .post("get-geral-por-ano", {
            id_municipio: data.id_municipio,
            ano: parseInt(resAgua.ano) - 1,
          })
          .then((response) => {
            return response.data[0];
          });

        const rsEsgotoAnoRef = await api
          .post("get-esgoto-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });

        let rsEsgotoAnoAnterior = await api
          .post("get-esgoto-por-ano", {
            id_municipio: data.id_municipio,
            ano: parseInt(resAgua.ano) - 1,
          })
          .then((response) => {
            return response.data[0];
          });

        //Se algum dos dados não for encontrado, retorna null
        if (!rsAguaAnoRef || !rsGeralAnoRef || !rsEsgotoAnoRef) {
          return null;
        }

        //Se não existir ano anterior, retorna o atual + atual dividido por 2
        const AG003 =
          parseFloat(rsAguaAnoRef?.ag003) +
          (rsAguaAnoAnterior?.ag003 === undefined
            ? parseFloat(rsAguaAnoRef?.ag003)
            : parseFloat(rsAguaAnoAnterior?.ag003)) /
            2;
        const ES003 =
          parseFloat(rsEsgotoAnoRef?.es003) +
          (rsEsgotoAnoAnterior?.es003 === undefined
            ? parseFloat(rsEsgotoAnoRef?.es003)
            : parseFloat(rsEsgotoAnoAnterior?.es003)) /
            2;
        const FN026 =
          parseFloat(rsGeralAnoRef?.fn026) +
          (rsGeralAnoAnterior?.fn026 === undefined
            ? parseFloat(rsGeralAnoRef?.fn026)
            : parseFloat(rsGeralAnoAnterior?.fn026)) /
            2;

        const result = (AG003 + ES003) / FN026;
        const ano = resAgua.ano.toString();
        const dados = [ano,parseFloat(result.toFixed(2)), result.toFixed(2).toString()];

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

    //retorno para o grafico e para os dados
    const dados = [["Ano", "Dados", { role: "annotation" }], ...rsFilter];

    setTituloIndicador(
      "IN002 - Índice de produtividade: economias ativas por pessoal próprio"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN003(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        const rsRagua = await api
          .post("get-agua-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });

        const rsFn = await api
          .post("get-ps-financeiro-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });

        const rsRe = await api
          .post("get-esgoto-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });

        if (!rsRagua?.ag011 || !rsFn?.fn017 || !rsRe?.es007) {
          return null;
        }

        const FN017 = rsFn?.fn017;
        const AG011 = rsRagua?.ag011;
        const ES007 = rsRe?.es007;
        const result =
          (parseFloat(FN017) / (parseFloat(AG011) + parseFloat(ES007))) *
          (1 / 1000);
        const ano = rsRagua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(2))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador("IN003 - Despesa total com os serviços por m3 faturado");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN004(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        const rsFn = await api
          .post("get-ps-financeiro-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });
        const rsRa = await api
          .post("get-agua-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });
        const rsRe = await api
          .post("get-esgoto-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });

        if (!rsFn?.fn001 || !rsRa?.ag011 || !rsRe?.es007) {
          return null;
        }

        const FN001 = rsFn?.fn001;
        const AG011 = rsRa?.ag011;
        const ES007 = rsRe?.es007;
        console.log(FN001);
        console.log(AG011);
        console.log(ES007);
        const result =
          (parseFloat(FN001) / (parseFloat(AG011) + parseFloat(ES007))) *
          (1 / 1000);
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador("IN004 - Tarifa média praticada");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN005(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        const rsFn = await api
          .post("get-ps-financeiro-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });
        const rsRa = await api
          .post("get-agua-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });

        if (!rsFn?.fn002 || !rsRa?.ag011 || !rsRa?.ag017 || !rsRa?.ag019) {
          return null;
        }

        const FN002 = rsFn?.fn002;
        const AG011 = rsRa?.ag011;
        const AG017 = rsRa?.ag017;
        const AG019 = rsRa?.ag019;
        const result =
          (parseFloat(FN002) /
            (parseFloat(AG011) - parseFloat(AG017) - parseFloat(AG019))) *
          (1 / 1000);
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador("IN005 - Tarifa média de água");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }
  async function IN006(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        const rsFn = await api
          .post("get-ps-financeiro-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });
        const rsRe = await api
          .post("get-esgoto", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });

        if (!rsFn?.fn003 || !rsRe?.es007 || !rsRe?.es013) {
          return null;
        }

        const FN003 = rsFn?.fn003;
        const ES007 = rsRe?.es007;
        const ES013 = rsRe?.es013;
        const result =
          (parseFloat(FN003) / (parseFloat(ES007) - parseFloat(ES013))) *
          (1 / 1000);
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(2))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador("IN006 - Tarifa média de esgoto");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN007(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        const rsFn = await api
          .post("get-ps-financeiro-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });

        if (!rsFn?.fn010 || !rsFn?.fn014 || !rsFn?.fn017) {
          return null;
        }

        const FN010 = rsFn?.fn010;
        const FN014 = rsFn?.fn014;
        const FN017 = rsFn?.fn017;
        const result =
          ((parseFloat(FN010) + parseFloat(FN014)) / parseFloat(FN017)) * 100;
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(2))];

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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador(
      "IN007 - Incidência da desp. de pessoal e de serv. de terc. nas despesas totais com os serviços"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN008(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        const rsGe = await api
          .post("get-geral-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });
        const rsFn = await api
          .post("get-ps-financeiro-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });

        const rsFnAnoAnterior = await api
          .post("get-ps-financeiro-por-ano", {
            id_municipio: data.id_municipio,
            ano: parseInt(resAgua.ano) - 1,
          })
          .then((response) => {
            return response.data[0];
          });

        if (!rsFn?.fn010 || !rsGe?.fn026) {
          return null;
        }

        const FN010 = rsFn?.fn010;
        const FN026_MEDIA =
          (parseFloat(rsGe?.fn026) +
            (rsFnAnoAnterior?.fn026 === undefined
              ? parseFloat(rsGe?.fn026)
              : parseFloat(rsFnAnoAnterior?.fn026))) /
          2;
        const result = parseFloat(FN010) / FN026_MEDIA;
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(2))];

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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador("IN008 - Despesa média anual por empregado");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN012(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        const rsFn = await api
          .post("get-ps-financeiro-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });
        const FN001 = rsFn?.fn001;
        const FN017 = rsFn?.fn017;
        const result = (FN001 / FN017) * 100;
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(2))];

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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador("IN012 - Indicador de desempenho financeiro");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN018(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data?.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        const rsGe = await api
          .post("get-geral-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });
        const rsFn = await api
          .post("get-ps-financeiro-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });

        const rsFnAnoAnterior = await api
          .post("get-ps-financeiro-por-ano", {
            id_municipio: data.id_municipio,
            ano: parseInt(resAgua.ano) - 1,
          })
          .then((response) => {
            return response.data[0];
          });

        if (!rsFn?.fn010 || !rsGe?.fn026 || !rsFn?.fn014) {
          return null;
        }

        const FN026_MEDIA =
          (parseFloat(rsGe?.fn026) +
            (rsFnAnoAnterior?.fn026 === undefined
              ? parseFloat(rsGe?.fn026)
              : parseFloat(rsFnAnoAnterior?.fn026))) /
          2;

        const FN010 = parseFloat(rsFn?.fn010);
        const FN014 = parseFloat(rsFn?.fn014);
        const result = (FN026_MEDIA + FN014 * FN026_MEDIA) / FN010;
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(2))];
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

    if (!data?.indicador) {
      return rsFilter;
    }

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador("IN018 - Quantidade equivalente de pessoal total");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN019(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        const rsFn = await api
          .post("get-ps-financeiro-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });
        const rsRa = await api
          .post("get-agua-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });

        const rsRaAnterior = await api
          .post("get-agua-por-ano", {
            id_municipio: data.id_municipio,
            ano: parseInt(resAgua.ano) - 1,
          })
          .then((response) => {
            return response.data[0];
          });

        const rsRe = await api
          .post("get-esgoto-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });

        const rsReAnterior = await api
          .post("get-esgoto-por-ano", {
            id_municipio: data.id_municipio,
            ano: parseInt(resAgua.ano) - 1,
          })
          .then((response) => {
            return response.data[0];
          });

        const municipio = { id_municipio: parseInt(data.id_municipio) };

        const rsIn018 = await IN018(municipio);

        const in018 = rsIn018.find(
          (item: any) => item[0] === resAgua.ano.toString()
        );

        if (!rsRa?.ag003 || !rsRe?.es003 || !in018) {
          return null;
        }

        const MEDIA_AG003 =
          ((rsRaAnterior?.ag003 === undefined
            ? parseFloat(rsRa?.ag003)
            : parseFloat(rsRaAnterior?.ag003)) +
            parseFloat(rsRa?.ag003)) /
          2;
        const MEDIA_ES003 =
          ((rsReAnterior?.es003 === undefined
            ? parseFloat(rsRe?.es003)
            : parseFloat(rsReAnterior?.es003)) +
            parseFloat(rsRe?.es003)) /
          2;

        const result = (MEDIA_AG003 + MEDIA_ES003) / in018[1];
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(2))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador(
      "IN019 - Índice de produtividade: economias ativas por pessoal total (equivalente)"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN026(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        const rsFn = await api
          .post("get-ps-financeiro-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });
        const rsRa = await api
          .post("get-agua-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });

        const rsRe = await api
          .post("get-esgoto-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });

        if (!rsFn?.fn015 || !rsRa?.ag011 || !rsRe?.es007) {
          return null;
        }

        const FN015 = parseFloat(rsFn?.fn015);
        const AG011 = parseFloat(rsRa?.ag011);
        const ES007 = parseFloat(rsRe?.es007);
        const result = (FN015 / (AG011 + ES007)) * (1 / 1000);
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador("IN026 - Despesa de exploração por m3 faturado");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN027(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        const rsFn = await api
          .post("get-ps-financeiro-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });
        const rsRa = await api
          .post("get-agua-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });
        const rsRe = await api
          .post("get-esgoto-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });

        if (!rsFn?.fn015 || !rsRa?.ag003 || !rsRe?.es003) {
          return null;
        }

        const FN015 = parseFloat(rsFn?.fn015);
        const AG003 = parseFloat(rsRa?.ag003);
        const ES003 = parseFloat(rsRe?.es003);
        const result = FN015 / (AG003 + ES003);
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador("IN027 - Despesa de exploração por economia");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN029(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        const rsFn = await api
          .post("get-ps-financeiro-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });

        if (!rsFn?.fn005 || !rsFn?.fn006) {
          return null;
        }

        const FN005 = parseFloat(rsFn?.fn005);
        const FN006 = parseFloat(rsFn?.fn006);
        const result = ((FN005 - FN006) / FN005) * 100;
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador("IN029 - Índice de evasão de receitas");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN030(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        const rsFn = await api
          .post("get-ps-financeiro-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });

        if (!rsFn?.fn015 || !rsFn?.fn001) {
          return null;
        }

        const FN015 = parseFloat(rsFn?.fn015);
        const FN001 = parseFloat(rsFn?.fn001);
        const result = (FN015 / FN001) * 100;
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador("IN030 - Margem da despesa de exploração");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN031(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        const rsFn = await api
          .post("get-ps-financeiro-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });

        if (!rsFn?.fn010 || !rsFn?.fn001) {
          return null;
        }

        const FN010 = parseFloat(rsFn?.fn010);
        const FN001 = parseFloat(rsFn?.fn001);
        const result = (FN010 / FN001) * 100;
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador("IN031 - Margem da despesa com pessoal próprio");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN032(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        const rsFn = await api
          .post("get-ps-financeiro-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });

        if (!rsFn?.fn014 || !rsFn?.fn010 || !rsFn?.fn001) {
          return null;
        }

        const FN014 = parseFloat(rsFn?.fn014);
        const FN010 = parseFloat(rsFn?.fn010);
        const FN001 = parseFloat(rsFn?.fn001);
        const result = ((FN010 + FN014) / FN001) * 100;
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador("IN032 - Margem da despesa com pessoal total");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN033(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        const rsFn = await api
          .post("get-ps-financeiro-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });

        if (!rsFn?.fn016 || !rsFn?.fn034 || !rsFn?.fn001) {
          return null;
        }

        const FN016 = parseFloat(rsFn?.fn016);
        const FN034 = parseFloat(rsFn?.fn034);
        const FN001 = parseFloat(rsFn?.fn001);
        const result = ((FN016 + FN034) / FN001) * 100;
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador("IN033 - Margem do serviço da divida");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN034(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        const rsFn = await api
          .post("get-ps-financeiro-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });

        if (!rsFn?.fn027 || !rsFn?.fn001) {
          return null;
        }

        const FN027 = parseFloat(rsFn?.fn027);
        const FN001 = parseFloat(rsFn?.fn001);
        const result = (FN027 / FN001) * 100;
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador("IN034 - Margem das outras despesas de exploração");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN035(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        const rsFn = await api
          .post("get-ps-financeiro-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });

        if (!rsFn?.fn010 || !rsFn?.fn015) {
          return null;
        }

        const FN010 = parseFloat(rsFn?.fn010);
        const FN015 = parseFloat(rsFn?.fn015);
        const result = (FN010 / FN015) * 100;
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador(
      "IN035 - Participação da despesa com pessoal próprio nas despesas de exploração"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN036(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        const rsFn = await api
          .post("get-ps-financeiro-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });

        const FN010 = parseFloat(rsFn?.fn010);
        const FN014 = parseFloat(rsFn?.fn014);
        const FN015 = parseFloat(rsFn?.fn015);
        const result = ((FN010 + FN014) / FN015) * 100;
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador(
      "IN036 - Participação da despesa com pessoal total (equivalente) nas despesas de exploração"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN037(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        const rsFn = await api
          .post("get-ps-financeiro-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });

        if (!rsFn?.fn013 || !rsFn?.fn015) {
          return null;
        }

        const FN013 = parseFloat(rsFn?.fn013);
        const FN015 = parseFloat(rsFn?.fn015);
        const result = (FN013 / FN015) * 100;
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador(
      "IN037 - Participação da despesa com energia elétrica nas despesas de exploração"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN038(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        const rsFn = await api
          .post("get-ps-financeiro-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });

        if (!rsFn?.fn011 || !rsFn?.fn015) {
          return null;
        }

        const result =
          (parseFloat(rsFn?.fn011) / parseFloat(rsFn?.fn015)) * 100;
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador(
      "IN038 - Participação da despesa com produtos químicos nas despesas de exploração (DEX)"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN039(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        const rsFn = await api
          .post("get-ps-financeiro-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });

        if (!rsFn?.fn027 || !rsFn?.fn015) {
          return null;
        }

        const result =
          (parseFloat(rsFn?.fn027) / parseFloat(rsFn?.fn015)) * 100;
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador(
      "IN039 - Participação das outras despesas nas despesas de exploração"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN040(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        const rsFn = await api
          .post("get-ps-financeiro-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });

        if (!rsFn?.fn002 || !rsFn?.fn005 || !rsFn?.fn007) {
          return null;
        }

        const result =
          ((parseFloat(rsFn?.fn002) + parseFloat(rsFn?.fn007)) /
            parseFloat(rsFn?.fn005)) *
          100;
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador(
      "IN040 - Participação da receita operacional direta de água na receita operacional total"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN041(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        const rsFn = await api
          .post("get-ps-financeiro-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });

        if (!rsFn?.fn003 || !rsFn?.fn005 || !rsFn?.fn038) {
          return null;
        }

        const result =
          ((parseFloat(rsFn?.fn003) + parseFloat(rsFn?.fn038)) /
            parseFloat(rsFn?.fn005)) *
          100;
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador(
      "IN041 - Participação da receita operacional direta de esgoto na receita operacional total"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN042(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        const rsFn = await api
          .post("get-ps-financeiro-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });

        if (!rsFn?.fn001 || !rsFn?.fn005) {
          return null;
        }

        const result =
          ((parseFloat(rsFn?.fn001) - parseFloat(rsFn?.fn005)) /
            parseFloat(rsFn?.fn005)) *
          100;
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador(
      "IN042 - Participação da receita operacional indireta na receita operacional total"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN045(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        const rsRa = await api
          .post("get-agua-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });

        const rsRaAnoAnterior = await api
          .post("get-agua-por-ano", {
            id_municipio: data.id_municipio,
            ano: parseInt(resAgua.ano) - 1,
          })
          .then((response) => {
            return response.data[0];
          });

        const rsGe = await api
          .post("get-geral-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });

        const rsGeAnoAnterior = await api
          .post("get-geral-por-ano", {
            id_municipio: data.id_municipio,
            ano: parseInt(resAgua.ano) - 1,
          })
          .then((response) => {
            return response.data[0];
          });

        if (!rsRa?.ag002 || !rsGe?.fn026) {
          return null;
        }

        const FN026_ANO_ANTERIOR =
          rsGeAnoAnterior?.fn026 == undefined
            ? parseFloat(rsGe?.fn026)
            : parseFloat(rsGeAnoAnterior?.fn026);
        const AG002_ANO_ANTERIOR =
          rsRaAnoAnterior?.ag002 == undefined
            ? parseFloat(rsRa?.ag002)
            : parseFloat(rsRaAnoAnterior?.ag002);

        const AG002 = parseFloat(rsRa?.ag002);
        const FN026 = parseFloat(rsGe?.fn026);

        const MEDIA_AG002 = (AG002_ANO_ANTERIOR + AG002) / 2;
        const MEDIA_FN026 = (FN026_ANO_ANTERIOR + FN026) / 2;

        const result = (MEDIA_AG002 / MEDIA_FN026) * 1000;
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador(
      "IN045 - Índice de produtividade: empregados próprios por 1000 ligações de água"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN048(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        const rsRe = await api
          .post("get-esgoto-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });

        const rsReAnoAnterior = await api
          .post("get-esgoto-por-ano", {
            id_municipio: data.id_municipio,
            ano: parseInt(resAgua.ano) - 1,
          })
          .then((response) => {
            return response.data[0];
          });

        const rsRa = await api
          .post("get-agua-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });

        const rsRaAnoAnterior = await api
          .post("get-agua-por-ano", {
            id_municipio: data.id_municipio,
            ano: parseInt(resAgua.ano) - 1,
          })
          .then((response) => {
            return response.data[0];
          });

        const rsGe = await api
          .post("get-geral-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });

        const rsGeAnoAnterior = await api
          .post("get-geral-por-ano", {
            id_municipio: data.id_municipio,
            ano: parseInt(resAgua.ano) - 1,
          })
          .then((response) => {
            return response.data[0];
          });

        if (!rsRa?.ag002 || !rsGe?.fn026 || !rsRe?.es002) {
          return null;
        }

        const FN026_ANO_ANTERIOR =
          rsGeAnoAnterior?.fn026 == undefined
            ? parseInt(rsGe?.fn026)
            : parseInt(rsGeAnoAnterior?.fn026);
        const AG002_ANO_ANTERIOR =
          rsRaAnoAnterior?.ag002 == undefined
            ? parseInt(rsRa?.ag002)
            : parseInt(rsRaAnoAnterior?.ag002);
        const ES002_ANO_ANTERIOR =
          rsReAnoAnterior?.es002 == undefined
            ? parseInt(rsRe?.es002)
            : parseInt(rsReAnoAnterior?.es002);

        const AG002 = parseInt(rsRa?.ag002);
        const FN026 = parseInt(rsGe?.fn026);
        const ES002 = parseInt(rsRe?.es002);

        const MEDIA_AG002 = (AG002_ANO_ANTERIOR + AG002) / 2;
        const MEDIA_FN026 = (FN026_ANO_ANTERIOR + FN026) / 2;
        const MEDIA_ES002 = (ES002_ANO_ANTERIOR + ES002) / 2;

        const result = MEDIA_FN026 / (MEDIA_AG002 + MEDIA_ES002) / 1000;
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador(
      "IN048 - Índice de produtividade: empregados próprios por 1000 ligações de água + esgoto"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN054(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        const rsFn = await api
          .post("get-ps-financeiro-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });

        if (!rsFn?.fn008 || !rsFn?.fn005) {
          return null;
        }

        const result =
          (parseFloat(rsFn?.fn008) / parseFloat(rsFn?.fn005)) * 360;
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador(
      " IN054 - Dias de faturamento comprometidos com contas a receber"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN060(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        const rsFn = await api
          .post("get-ps-financeiro-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });
        const rsRa = await api
          .post("get-agua-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });
        const rsRe = await api
          .post("get-esgoto-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });

        if (!rsFn?.fn013 || !rsRa?.ag028 || !rsRe?.es028) {
          return null;
        }

        const result =
          (parseFloat(rsFn?.fn013) /
            (parseFloat(rsRa?.ag028) + parseFloat(rsRe?.es028))) *
          (1 / 1000);
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador(
      "IN060 - Índice de despesas por consumo de energia elétrica nos sistemas de água e esgotos"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN101(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        const rsFn = await api
          .post("get-ps-financeiro-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });

        if (
          !rsFn?.fn006 ||
          !rsFn?.fn015 ||
          !rsFn?.fn016 ||
          !rsFn?.fn022 ||
          !rsFn?.fn034
        ) {
          return null;
        }
        const FN006 = parseFloat(rsFn?.fn006);
        const FN015 = parseFloat(rsFn?.fn015);
        const FN016 = parseFloat(rsFn?.fn016);
        const FN022 = parseFloat(rsFn?.fn022);
        const FN034 = parseFloat(rsFn?.fn034);
        const result = (FN006 / (FN015 + FN034 + FN016 + FN022)) * 100;
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador("IN101 - Índice de suficiência de caixa");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN102(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        const rsRa = await api
          .post("get-agua-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });

        const rsRaAnoAnterior = await api
          .post("get-agua-por-ano", {
            id_municipio: data.id_municipio,
            ano: parseInt(resAgua.ano) - 1,
          })
          .then((response) => {
            return response.data[0];
          });

        const rsRe = await api
          .post("get-esgoto-por-ano", {
            id_municipio: data.id_municipio,
            ano: resAgua.ano,
          })
          .then((response) => {
            return response.data[0];
          });

        const rsReAnoAnterior = await api
          .post("get-esgoto-por-ano", {
            id_municipio: data.id_municipio,
            ano: parseInt(resAgua.ano) - 1,
          })
          .then((response) => {
            return response.data[0];
          });

        const municipio = { id_municipio: parseInt(data.id_municipio) };

        const rsIn018 = await IN018(municipio);

        const in018 = rsIn018.find(
          (item: any) => item[0] === resAgua.ano.toString()
        );

        if (!rsRa?.ag002 || !rsRe?.es002 || !in018) {
          return null;
        }

        const ES002_ANO_ANTERIOR =
          rsReAnoAnterior?.es002 === undefined
            ? parseFloat(rsRe?.es002)
            : parseFloat(rsReAnoAnterior?.es002);
        const AG002_ANO_ANTERIOR =
          rsRaAnoAnterior?.ag002 === undefined
            ? parseFloat(rsRa?.ag002)
            : parseFloat(rsRaAnoAnterior?.ag002);

        const AG002 = parseFloat(rsRa?.ag002);
        const ES002 = parseFloat(rsRe?.es002);

        const MEDIA_AG002 = (AG002_ANO_ANTERIOR + AG002) / 2;
        const MEDIA_ES002 = (ES002_ANO_ANTERIOR + ES002) / 2;

        const result = (MEDIA_AG002 + MEDIA_ES002) / in018[1];
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador(
      "IN102 - Índice de produtividade de pessoal total (equivalente)"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN001(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });
    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        const rsRaAnoAnterior = await api
          .post("get-agua-por-ano", {
            id_municipio: data.id_municipio,
            ano: parseInt(resAgua.ano) - 1,
          })
          .then((response) => {
            return response.data[0];
          });

        if (!rsRa?.ag002 || !rsRa?.ag003) {
          return null;
        }

        const AG002_ANO_ANTERIOR =
          rsRaAnoAnterior?.ag002 === undefined
            ? parseFloat(rsRa?.ag002)
            : parseFloat(rsRaAnoAnterior?.ag002);
        const AG003_ANO_ANTERIOR =
          rsRaAnoAnterior?.ag003 === undefined
            ? parseFloat(rsRa?.ag003)
            : parseFloat(rsRaAnoAnterior?.ag003);

        const AG002 = parseFloat(rsRa?.ag002);
        const AG003 = parseFloat(rsRa?.ag003);

        const MEDIA_AG002 = (AG002_ANO_ANTERIOR + AG002) / 2;
        const MEDIA_AG003 = (AG003_ANO_ANTERIOR + AG003) / 2;

        const result = MEDIA_AG002 + MEDIA_AG003;

        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador("IN001 - Densidade de economias de água por ligação");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN009(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });
    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        const rsRaAnoAnterior = await api
          .post("get-agua-por-ano", {
            id_municipio: data.id_municipio,
            ano: parseInt(resAgua.ano) - 1,
          })
          .then((response) => {
            return response.data[0];
          });

        if (!rsRa?.ag002 || !rsRa?.ag004) {
          return null;
        }

        const AG002_ANO_ANTERIOR =
          rsRaAnoAnterior?.ag002 === undefined
            ? parseFloat(rsRa?.ag002)
            : parseFloat(rsRaAnoAnterior?.ag002);
        const AG004_ANO_ANTERIOR =
          rsRaAnoAnterior?.ag004 === undefined
            ? parseFloat(rsRa?.ag004)
            : parseFloat(rsRaAnoAnterior?.ag004);

        const AG002 = parseFloat(rsRa?.ag002);
        const AG004 = parseFloat(rsRa?.ag004);

        const MEDIA_AG002 = (AG002_ANO_ANTERIOR + AG002) / 2;
        const MEDIA_AG004 = (AG004_ANO_ANTERIOR + AG004) / 2;

        const result = (MEDIA_AG002 + MEDIA_AG004) * 100;
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador("IN009 - Índice de hidrometração");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN010(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });
    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        const AG006 = parseFloat(resAgua?.ag006);
        const AG008 = parseFloat(resAgua?.ag008);
        const AG018 = parseFloat(resAgua?.ag018);
        const AG019 = parseFloat(resAgua?.ag019);
        const AG024 = parseFloat(resAgua?.ag024);

        if (!AG006 || !AG008 || !AG018 || !AG019 || !AG024) {
          return null;
        }

        const result = (AG008 / (AG006 + AG018 - AG019 - AG024)) * 100;
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador(
      " IN010 - Índice de micromedição relativo ao volume disponibilizado"
    );
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN011(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });
    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        const AG006 = parseFloat(resAgua?.ag006);
        const AG018 = parseFloat(resAgua?.ag018);
        const AG019 = parseFloat(resAgua?.ag019);
        const AG012 = parseFloat(resAgua?.ag012);

        if (!AG006 || !AG018 || !AG019 || !AG012) {
          return null;
        }

        const result = (AG012 - AG019 / (AG006 + AG018 - AG019)) * 100;
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador("IN011 - Índice de macromedição");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN013(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });
    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        const AG006 = parseFloat(resAgua?.ag006);
        const AG018 = parseFloat(resAgua?.ag018);
        const AG011 = parseFloat(resAgua?.ag011);
        const AG024 = parseFloat(resAgua?.ag024);

        if (!AG006 || !AG018 || !AG011 || !AG024) {
          return null;
        }

        const result =
          ((AG006 + AG018 - AG011 - AG024) / (AG006 + AG018 - AG024)) * 100;
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador("IN013 - Índice de perdas faturamento");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN014(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });
    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        const rsRaAnoAnterior = await api
          .post("get-agua-por-ano", {
            id_municipio: data.id_municipio,
            ano: parseInt(resAgua.ano) - 1,
          })
          .then((response) => {
            return response.data[0];
          });

        if (!resAgua?.ag008 || !resAgua?.ag014) {
          return null;
        }

        const AG014_ANO_ANTERIOR =
          rsRaAnoAnterior?.ag014 === undefined
            ? parseFloat(resAgua?.ag014)
            : parseFloat(rsRaAnoAnterior?.ag014);
        const AG008 = parseFloat(resAgua?.ag008);
        const AG014 = parseFloat(resAgua?.ag014);

        const MEDIA_AG014 = (AG014_ANO_ANTERIOR + AG014) / 2;
        const result = (AG008 / MEDIA_AG014) * (1000 / 12);
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador("IN014 - Consumo micromedido por economia");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN017(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });
    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        const rsRaAnoAnterior = await api
          .post("get-agua-por-ano", {
            id_municipio: data.id_municipio,
            ano: parseInt(resAgua.ano) - 1,
          })
          .then((response) => {
            return response.data[0];
          });

        if (!resAgua?.ag003 || !resAgua?.ag011 || !resAgua?.ag019) {
          return null;
        }

        const AG003_ANO_ANTERIOR =
          rsRaAnoAnterior?.ag003 === undefined
            ? parseFloat(resAgua?.ag003)
            : parseFloat(rsRaAnoAnterior?.ag003);
        const AG003 = parseFloat(resAgua?.ag003);
        const AG011 = parseFloat(resAgua?.ag011);
        const AG019 = parseFloat(resAgua?.ag019);

        const MEDIA_AG003 = (AG003_ANO_ANTERIOR + AG003) / 2;
        const result = ((AG011 - AG019) / MEDIA_AG003) * (1000 / 12);
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador("IN017 - Consumo de água faturado por economia");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN020(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });
    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        const rsRaAnoAnterior = await api
          .post("get-agua-por-ano", {
            id_municipio: data.id_municipio,
            ano: parseInt(resAgua.ano) - 1,
          })
          .then((response) => {
            return response.data[0];
          });

        if (!resAgua?.ag005 || !resAgua?.ag021) {
          return null;
        }

        const AG005_ANO_ANTERIOR =
          rsRaAnoAnterior?.ag005 === undefined
            ? parseFloat(resAgua?.ag005)
            : parseFloat(rsRaAnoAnterior?.ag005);
        const AG021_ANO_ANTERIOR =
          rsRaAnoAnterior?.ag021 === undefined
            ? parseFloat(resAgua?.ag021)
            : parseFloat(rsRaAnoAnterior?.ag021);

        const AG005 = parseFloat(resAgua?.ag005);
        const AG021 = parseFloat(resAgua?.ag021);

        const MEDIA_AG005 = (AG005_ANO_ANTERIOR + AG005) / 2;
        const MEDIA_AG021 = (AG021_ANO_ANTERIOR + AG021) / 2;

        const result = (MEDIA_AG005 / MEDIA_AG021) * 1000;
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador("IN020 - Extensão da rede de água por ligação");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN022(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });
    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {

        if (!resAgua?.ag001 || !resAgua?.ag010 || !resAgua?.ag019) {
          return null;
        }
        const AG001 = parseFloat(resAgua?.ag001);
        const AG010 = parseFloat(resAgua?.ag010);
        const AG019 = parseFloat(resAgua?.ag019);

        const result = ((AG010 - AG019) / AG001) * (1000.0 / 365);
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador("IN022 - Consumo médio percapita de água");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN023(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        if (!resAgua?.ag010 || !resAgua?.ge06a) {
          return null;
        }

        const AG026 = parseFloat(resAgua?.ag010);
        const GE06a = parseFloat(resAgua?.ge06a);

        const result = (GE06a / AG026) * 100;
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador("IN023 - Índice de atendimento urbano de água");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN025(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        const rsRaAnoAnterior = await api
          .post("get-agua-por-ano", {
            id_municipio: data.id_municipio,
            ano: parseInt(resAgua.ano) - 1,
          })
          .then((response) => {
            return response.data[0];
          });

        if (!resAgua?.ag003 || !resAgua?.ag006 || !resAgua?.ag018 || !resAgua?.ag019) {
          return null;
        }

        const AG003_ANO_ANTERIOR =
          rsRaAnoAnterior?.ag003 === undefined
            ? parseFloat(resAgua?.ag003)
            : parseFloat(rsRaAnoAnterior?.ag003);

        const AG003 = parseFloat(resAgua?.ag003);
        const AG006 = parseFloat(resAgua?.ag006);
        const AG018 = parseFloat(resAgua?.ag018);
        const AG019 = parseFloat(resAgua?.ag019);

        const MEDIA = (AG003_ANO_ANTERIOR + AG003) / 2;
        const result = ((AG006 + AG018 - AG019) / MEDIA) * (1000 / 12);
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador("IN025 - Volume de água disponibilizado por economia");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN028(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        if (!resAgua?.ag006 || !resAgua?.ag011 || !resAgua?.ag018 || !resAgua?.ag024) {
          return null;
        }

        const AG006 = parseFloat(resAgua?.ag006);
        const AG011 = parseFloat(resAgua?.ag011);
        const AG018 = parseFloat(resAgua?.ag018);
        const AG024 = parseFloat(resAgua?.ag024);

        const result = (AG011 / ((AG006 + AG018) - AG024)) * 100;
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador("IN028 - Índice de faturamento de água");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN043(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        const rsRaAnoAnterior = await api
          .post("get-agua-por-ano", {
            id_municipio: data.id_municipio,
            ano: parseInt(resAgua.ano) - 1,
          })
          .then((response) => {
            return response.data[0];
          });

        if (!resAgua?.ag003 || !resAgua?.ag013) {
          return null;
        }

        const AG003_ANO_ANTERIOR =
          rsRaAnoAnterior?.ag003 === undefined
            ? parseFloat(resAgua?.ag003)
            : parseFloat(rsRaAnoAnterior?.ag003);

        const AG013_ANO_ANTERIOR =
          rsRaAnoAnterior?.ag013 === undefined
            ? parseFloat(resAgua?.ag013)
            : parseFloat(rsRaAnoAnterior?.ag013);

        const AG003 = parseFloat(resAgua?.ag003);
        const AG013 = parseFloat(resAgua?.ag013);

        const MEDIA_AG003 = (AG003_ANO_ANTERIOR + AG003) / 2;
        const MEDIA_AG013 = (AG013_ANO_ANTERIOR + AG013) / 2;

        const result = (MEDIA_AG003 / MEDIA_AG013) * 100;
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador("IN043 - Participação das economias residenciais de água no total das economias de água");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN044(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        if (!resAgua?.ag008 || !resAgua?.ag010 || !resAgua?.ag019) {
          return null;
        }

        const AG008 = parseFloat(resAgua?.ag008);
        const AG010 = parseFloat(resAgua?.ag010);
        const AG019 = parseFloat(resAgua?.ag019);

        const result = (AG008 / (AG010 - AG019)) * 100;
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador("IN044 - Índice de micromedição relativo ao consumo");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN049(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        if (!resAgua?.ag006 || !resAgua?.ag010 || !resAgua?.ag018 || !resAgua?.ag024) {
          return null;
        }

        const AG006 = parseFloat(resAgua?.ag006);
        const AG010 = parseFloat(resAgua?.ag010);
        const AG018 = parseFloat(resAgua?.ag018);
        const AG024 = parseFloat(resAgua?.ag024);

        const result = ((AG006 + AG018 - (AG010 - AG024)) / (AG006 + AG018 - AG024)) * 100;
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador("IN049 - Índice de perdas na distribuição");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN050(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        const rsRaAnoAnterior = await api
          .post("get-agua-por-ano", {
            id_municipio: data.id_municipio,
            ano: parseInt(resAgua.ano) - 1,
          })
          .then((response) => {
            return response.data[0];
          });

        if (!resAgua?.ag005 || !resAgua?.ag006 || !resAgua?.ag010 || !resAgua?.ag018 || !resAgua?.ag024) {
          return null;
        }

        const AG005_ANO_ANTERIOR =
          rsRaAnoAnterior?.ag005 === undefined
            ? parseFloat(resAgua?.ag005)
            : parseFloat(rsRaAnoAnterior?.ag005);

        const AG005 = parseFloat(resAgua?.ag005);
        const AG006 = parseFloat(resAgua?.ag006);
        const AG010 = parseFloat(resAgua?.ag010);
        const AG018 = parseFloat(resAgua?.ag018);
        const AG024 = parseFloat(resAgua?.ag024);

        const MEDIA_AG005 = (AG005_ANO_ANTERIOR + AG005) / 2;
        const result = (((AG006 + AG018) - (AG010 - AG024)) / MEDIA_AG005) * (1000 / 365);
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador("IN050 - Índice bruto de perdas lineares");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN051(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        const rsRaAnoAnterior = await api
          .post("get-agua-por-ano", {
            id_municipio: data.id_municipio,
            ano: parseInt(resAgua.ano) - 1,
          })
          .then((response) => {
            return response.data[0];
          });

        if (!resAgua?.ag002 || !resAgua?.ag006 || !resAgua?.ag010 || !resAgua?.ag018 || !resAgua?.ag024) {
          return null;
        }

        const AG002_ANO_ANTERIOR =
          rsRaAnoAnterior?.ag002 === undefined
            ? parseFloat(resAgua?.ag002)
            : parseFloat(rsRaAnoAnterior?.ag002);

        const AG002 = parseFloat(resAgua?.ag002);
        const AG006 = parseFloat(resAgua?.ag006);
        const AG010 = parseFloat(resAgua?.ag010);
        const AG018 = parseFloat(resAgua?.ag018);
        const AG024 = parseFloat(resAgua?.ag024);

        const MEDIA_AG002 = (AG002_ANO_ANTERIOR + AG002) / 2;
        const result = (((AG006 + AG018) - (AG010 - AG024)) / MEDIA_AG002) * (1000.0 / 365);
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador("IN051 - Índice de perdas por ligação");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN052(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        if (!resAgua?.ag006 || !resAgua?.ag010 || !resAgua?.ag018 || !resAgua?.ag024) {
          return null;
        }

        const AG006 = parseFloat(resAgua?.ag006);
        const AG010 = parseFloat(resAgua?.ag010);
        const AG018 = parseFloat(resAgua?.ag018);
        const AG024 = parseFloat(resAgua?.ag024);

        const result = (AG010 / ((AG006 + AG018) - AG024)) * 100;
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador("IN052 - Índice de consumo de água");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN053(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        const rsRaAnoAnterior = await api
          .post("get-agua-por-ano", {
            id_municipio: data.id_municipio,
            ano: parseInt(resAgua.ano) - 1,
          })
          .then((response) => {
            return response.data[0];
          });

        if (!resAgua?.ag003 || !resAgua?.ag010 || !resAgua?.ag019) {
          return null;
        }

        const AG003_ANO_ANTERIOR =
          rsRaAnoAnterior?.ag003 === undefined
            ? parseFloat(resAgua?.ag003)
            : parseFloat(rsRaAnoAnterior?.ag003);

        const AG003 = parseFloat(resAgua?.ag003);
        const AG010 = parseFloat(resAgua?.ag010);
        const AG019 = parseFloat(resAgua?.ag019);

        const MEDIA_AG003 = (AG003_ANO_ANTERIOR + AG003) / 2;
        const result = ((AG010 - AG019) / MEDIA_AG003) * (1000 / 12);
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador("IN053 - Consumo médio de água por economia");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN055(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        if (!resAgua?.ge12a || !resAgua?.pop_tot) {
          return null;
        }

        const GE12a = parseFloat(resAgua?.ge12a);
        const POP_TOT = parseFloat(resAgua?.pop_tot);
        const AG001 = parseFloat(resAgua?.ag001);

        const result = (AG001 / GE12a) * 100;
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador("IN055 - Índice de atendimento total de água");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN057(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        if (!resAgua?.ag006 || !resAgua?.ag018 || !resAgua?.ag027) {
          return null;
        }

        const AG006 = parseFloat(resAgua?.ag006);
        const AG018 = parseFloat(resAgua?.ag018);
        const AG027 = parseFloat(resAgua?.ag027);

        const result = (AG027 / (AG006 + AG018)) * 100;
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador("IN057 - Índice de fluoretação de água");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN058(data) {
    const rsRa = await api
      .post("get-agua", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsRa.map(async (resAgua: any) => {
        if (!resAgua?.ag006 || !resAgua?.ag018 || !resAgua?.ag028) {
          return null;
        }

        const AG006 = parseFloat(resAgua?.ag006);
        const AG018 = parseFloat(resAgua?.ag018);
        const AG028 = parseFloat(resAgua?.ag028);

        const result = (AG028 / (AG006 + AG018)) * 100;
        const ano = resAgua.ano.toString();
        const dados = [ano, parseFloat(result.toFixed(6))];
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

    const dados = [["Ano", "Dados"], ...rsFilter];
    setTituloIndicador("IN058 - Índice de consumo de energia elétrica em sistemas de abastecimento de água");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  const [activeTab, setActiveTab] = useState("dados");
  const [activeButtonDados, setActiveButtonDados] = useState(true);
  const [activeButtonGrafico, setActiveButtonGrafico] = useState(false);

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
    printWindow.document.write("<html><head><title>Impressão</title></head><body>");
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
                    <select 
                    aria-invalid={errors.value ? "true" : "false"}
                    {...register("id_municipio", {
                      required: true,
                    })}>
                      <option value="">Município</option>
                      {municipios?.map((municipio, key) => (
                        <option key={key} value={municipio.id_municipio}>
                          {municipio.nome}
                        </option>
                      ))}
                    </select><br />
                    {errors.id_municipio &&
                          errors.id_municipio.type && (
                            <span>Campo obrigatório!</span>
                          )}
                  </td>

                  <td>
                    <select
                    aria-invalid={errors.value ? "true" : "false"}
                     {...register("indicador", {
                      required: true,
                    })}>
                      <option value="">Indicardor</option>
                      <option value="IN002">
                        IN002 - Índice de produtividade: economias ativas por
                        pessoal próprio
                      </option>
                      <option value="IN003">
                        IN003 - Despesa total com os serviços por m3 faturado
                      </option>
                      <option value="IN004">
                        IN004 - Tarifa média praticada
                      </option>
                      <option value="IN005">
                        IN005 - Tarifa média de água
                      </option>
                      <option value="IN006">
                        IN006 - Tarifa média de esgoto
                      </option>
                      <option value="IN007">
                        IN007 - Incidência da desp. de pessoal e de serv. de
                        terc. nas despesas totais com os serviços
                      </option>
                      <option value="IN008">
                        IN008 - Despesa média anual por empregado
                      </option>
                      <option value="IN012">
                        IN012 - Indicador de desempenho financeiro
                      </option>
                      <option value="IN018">
                        IN018 - Quantidade equivalente de pessoal total
                      </option>
                      <option value="IN019">
                        IN019 - Índice de produtividade: economias ativas por
                        pessoal total (equivalente)
                      </option>
                      <option value="IN026">
                        IN026 - Despesa de exploração por m3 faturado
                      </option>
                      <option value="IN027">
                        IN027 - Despesa de exploração por economia
                      </option>
                      <option value="IN029">
                        IN029 - Índice de evasão de receitas
                      </option>
                      <option value="IN030">
                        IN030 - Margem da despesa de exploração
                      </option>
                      <option value="IN031">
                        IN031 - Margem da despesa com pessoal próprio
                      </option>
                      <option value="IN032">
                        IN032 - Margem da despesa com pessoal total
                        (equivalente)
                      </option>
                      <option value="IN033">
                        IN033 - Margem do serviço da divida
                      </option>
                      <option value="IN034">
                        IN034 - Margem das outras despesas de exploração
                      </option>
                      <option value="IN035">
                        IN035 - Participação da despesa com pessoal próprio nas
                        despesas de exploração
                      </option>
                      <option value="IN036">
                        IN036 - Participação da despesa com pessoal total
                        (equivalente) nas despesas de exploração
                      </option>
                      <option value="IN037">
                        IN037 - Participação da despesa com energia elétrica nas
                        despesas de exploração
                      </option>
                      <option value="IN038">
                        IN038 - Participação da despesa com produtos químicos
                        nas despesas de exploração (DEX)
                      </option>
                      <option value="IN039">
                        IN039 - Participação das outras despesas nas despesas de
                        exploração
                      </option>
                      <option value="IN040">
                        IN040 - Participação da receita operacional direta de
                        água na receita operacional total
                      </option>
                      <option value="IN041">
                        IN041 - Participação da receita operacional direta de
                        esgoto na receita operacional total
                      </option>
                      <option value="IN042">
                        IN042 - Participação da receita operacional indireta na
                        receita operacional total
                      </option>
                      <option value="IN045">
                        IN045 - Índice de produtividade: empregados próprios por
                        1000 ligações de água
                      </option>
                      <option value="IN048">
                        IN048 - Índice de produtividade: empregados próprios por
                        1000 ligações de água + esgoto
                      </option>
                      <option value="IN054">
                        IN054 - Dias de faturamento comprometidos com contas a
                        receber
                      </option>
                      <option value="IN060">
                        IN060 - Índice de despesas por consumo de energia
                        elétrica nos sistemas de água e esgotos
                      </option>
                      <option value="IN101">
                        IN101 - Índice de suficiência de caixa
                      </option>
                      <option value="IN102">
                        IN102 - Índice de produtividade de pessoal total
                        (equivalente)
                      </option>
                      <option value="IN001">
                        IN001 - Densidade de economias de água por ligação
                      </option>
                      <option value="IN009">
                        IN009 - Índice de hidrometração
                      </option>
                      <option value="IN010">
                        IN010 - Índice de micromedição relativo ao volume
                        disponibilizado
                      </option>
                      <option value="IN011">
                        IN011 - Índice de macromedição
                      </option>
                      <option value="IN013">
                        IN013 - Índice de perdas faturamento
                      </option>
                      <option value="IN014">
                        IN014 - Consumo micromedido por economia
                      </option>
                      <option value="IN017">
                        IN017 - Consumo de água faturado por economia
                      </option>
                      <option value="IN020">
                        IN020 - Extensão da rede de água por ligação
                      </option>
                      <option value="IN022">
                        IN022 - Consumo médio percapita de água
                      </option>
                      <option value="IN023">
                        IN023 - Índice de atendimento urbano de água
                      </option>
                      <option value="IN025">
                        IN025 - Volume de água disponibilizado por economia
                      </option>
                      <option value="IN028">
                        IN028 - Índice de faturamento de água
                      </option>
                      <option value="IN043">
                        IN043 - Participação das economias residenciais de água
                        no total das economias de água
                      </option>
                      <option value="IN044">
                        IN044 - Índice de micromedição relativo ao consumo
                      </option>
                      <option value="IN049">
                        IN049 - Índice de perdas na distribuição
                      </option>
                      <option value="IN050">
                        IN050 - Índice bruto de perdas lineares
                      </option>
                      <option value="IN051">
                        IN051 - Índice de perdas por ligação
                      </option>
                      <option value="IN052">
                        IN052 - Índice de consumo de água
                      </option>
                      <option value="IN053">
                        IN053 - Consumo médio de água por economia
                      </option>
                      <option value="IN055">
                        IN055 - Índice de atendimento total de água
                      </option>
                      <option value="IN057">
                        IN057 - Índice de fluoretação de água
                      </option>
                      <option value="IN058">
                        IN058 - Índice de consumo de energia elétrica em
                        sistemas de abastecimento de água
                      </option>
                    </select><br />
                    {errors.indicador &&
                          errors.indicador.type && (
                            <span>Campo obrigatório!</span>
                          )}
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
