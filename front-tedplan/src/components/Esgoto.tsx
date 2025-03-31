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

export default function Esgoto({ municipio }: MunicipioProps) {
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
  const infoRef = useRef(null);
  const [data, setData] = useState(null);
  const [visibleInfo, setVisibleInfo] = useState(false);
  const [descricaoIndicador, setDescricaoIndicador] = useState(null);
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
    const res = await api.post("get-indicador-por-codigo/",{codigo: data.indicador, eixo: 'esgoto'})
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
    if (data.indicador == "IN015") {
      IN015(data);
    }
    if (data.indicador == "IN016") {
      IN016(data);
    }
    if (data.indicador == "IN021") {
      IN021(data);
    }
    if (data.indicador == "IN024") {
      IN024(data);
    }
    if (data.indicador == "IN046") {
      IN046(data);
    }
    if (data.indicador == "IN047") {
      IN047(data);
    }
    if (data.indicador == "IN056") {
      IN056(data);
    }
    if (data.indicador == "IN059") {
      IN059(data);
    }
    if (data.indicador == "IN061") {
      IN061(data);
    }
    if (data.indicador == "IN062") {
      IN062(data);
    }
    if (data.indicador == "IN063") {
      IN063(data);
    }
    if (data.indicador == "IN064") {
      IN064(data);
    }
    if (data.indicador == "IN065") {
      IN065(data);
    }
    if (data.indicador == "IN066") {
      IN066(data);
    }
    if (data.indicador == "IN067") {
      IN067(data);
    }
    if (data.indicador == "IN068") {
      IN068(data);
    }
    if (data.indicador == "IN069") {
      IN069(data);
    }
  }

  async function IN015(data) {
    getDescricaoIndicador(data);
    const rsEs = await api
      .post("get-esgoto", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });
    const rs = await Promise.all(
      rsEs.map(async (esgoto) => {
        const rsAg = await api
          .post("get-agua-por-ano", {
            id_municipio: data.id_municipio,
            ano: esgoto.ano,
          })
          .then((response) => {
            return response.data[0];
          });

        if (!rsAg?.ag010 || !rsAg?.ag019 || !esgoto.es005) {
          return null;
        }

        const AG010 = parseFloat(rsAg?.ag010);
        const AG019 = parseFloat(rsAg?.ag019);
        const ES005 = parseFloat(esgoto.es005);

        const result = (ES005 / (AG010 - AG019)) * 100;
        const ano = esgoto.ano.toString();
        const dados = [
          ano,
          parseFloat(result.toFixed(2)),
          result.toFixed(2).toString(),
        ];
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

    setTituloIndicador("IN015 - Índice de coleta de esgoto");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  //NÃO HA ENTRADA DE DADOS NO SISTEMA PARA O CAMPO ES013, ES014
  async function IN016(data) {
    getDescricaoIndicador(data);
    const rsEs = await api
      .post("get-esgoto", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsEs.map(async (esgoto) => {
        const ES005 = parseFloat(esgoto?.es005);
        const ES006 = parseFloat(esgoto?.es006);
        const ES013 = parseFloat(esgoto?.es013);
        const ES014 = parseFloat(esgoto?.es014);
        const ES015 = parseFloat(esgoto?.es015);

        if (!ES005 || !ES013 || !ES006 || !ES014 || !ES015) {
          return null;
        }

        const result = ((ES006 + ES014 + ES015) / (ES005 + ES013)) * 100;
        const ano = esgoto.ano.toString();
        const dados = [
          ano,
          parseFloat(result.toFixed(2)),
          result.toFixed(2).toString(),
        ];
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

    setTituloIndicador("IN016 - Índice de tratamento de esgoto");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN021(data) {
    getDescricaoIndicador(data);
    const rsEs = await api
      .post("get-esgoto", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsEs.map(async (esgoto) => {
        const rsESAnoAnterior = await api
          .post("get-esgoto-por-ano", {
            id_municipio: data.id_municipio,
            ano: parseInt(esgoto.ano) - 1,
          })
          .then((response) => {
            return response.data[0];
          });

        if (!esgoto?.es004 || !esgoto?.es009) {
          return null;
        }

        const ES004_ANO_ANTERIOR =
          rsESAnoAnterior?.es004 === undefined ||
          rsESAnoAnterior?.es004 === null
            ? parseFloat(esgoto?.es004)
            : parseFloat(rsESAnoAnterior?.es004);

        const ES009_ANO_ANTERIOR =
          rsESAnoAnterior?.es009 === undefined ||
          rsESAnoAnterior?.es009 === null
            ? parseFloat(esgoto?.es009)
            : parseFloat(rsESAnoAnterior?.es009);

        const ES004 = parseFloat(esgoto?.es004);
        const ES009 = parseFloat(esgoto?.es009);

        const MEDIA_ES004 = (ES004_ANO_ANTERIOR + ES004) / 2;
        const MEDIA_ES009 = (ES009_ANO_ANTERIOR + ES009) / 2;

        const result = (MEDIA_ES004 / MEDIA_ES009) * 1000;
        const ano = esgoto.ano.toString();
        const dados = [
          ano,
          parseFloat(result.toFixed(2)),
          result.toFixed(2).toString(),
        ];
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

    setTituloIndicador("IN021 - Extensão da rede de esgoto por ligação");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  //NÃO HA ENTRADA DE DADOS NO SISTEMA PARA O CAMPO GE06a
  async function IN024(data) {
    getDescricaoIndicador(data);
    const rsEs = await api
      .post("get-esgoto", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsEs.map(async (esgoto) => {
        const ES026 = parseFloat(esgoto?.es026);
        const GE06a = 0;

        if (!ES026 || !GE06a) {
          return null;
        }

        const result = (ES026 / GE06a) * 100;
        const ano = esgoto.ano.toString();
        const dados = [
          ano,
          parseFloat(result.toFixed(2)),
          result.toFixed(2).toString(),
        ];
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

    setTituloIndicador("IN024 - Índice de atendimento urbano de esgoto referido aos municípios atendidos com água");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN046(data) {
    getDescricaoIndicador(data);
    const rsEs = await api
      .post("get-esgoto", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsEs.map(async (esgoto) => {
        const rsAg = await api
          .post("get-agua-por-ano", {
            id_municipio: data.id_municipio,
            ano: esgoto.ano,
          })
          .then((response) => {
            return response.data[0];
          });

        if (!rsAg?.ag010 || !rsAg?.ag019 || !esgoto.es006 || !esgoto.es015) {
          return null;
        }

        const AG010 = parseFloat(rsAg?.ag010);
        const AG019 = parseFloat(rsAg?.ag019);
        const ES006 = parseFloat(esgoto.es006);
        const ES015 = parseFloat(esgoto.es015);

        const result = ((ES006 + ES015) / (AG010 - AG019)) * 100;
        const ano = esgoto.ano.toString();
        const dados = [
          ano,
          parseFloat(result.toFixed(2)),
          result.toFixed(2).toString(),
        ];
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

    setTituloIndicador("IN046 - Índice de esgoto tratado referido à água consumida");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  //NÃO HA ENTRADA DE DADOS NO SISTEMA PARA O CAMPO GE06b

  async function IN047(data) {
    getDescricaoIndicador(data);
    const rsEs = await api
      .post("get-esgoto", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsEs.map(async (esgoto) => {
        const ES026 = parseFloat(esgoto?.es026);
        const GE06b = 0;

        if (!ES026 || !GE06b) {
          return null;
        }

        const result = (ES026 / GE06b) * 100;
        const ano = esgoto.ano.toString();
        const dados = [
          ano,
          parseFloat(result.toFixed(2)),
          result.toFixed(2).toString(),
        ];
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

    setTituloIndicador("IN047 - Índice de atendimento urbano de esgoto referido aos municípios atendidos com esgoto");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  //NÃO HA ENTRADA DE DADOS NO SISTEMA PARA O CAMPO GE012a

  async function IN056(data) {
    getDescricaoIndicador(data);
    const rsEs = await api
      .post("get-esgoto", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsEs.map(async (esgoto) => {
        const ES001 = parseFloat(esgoto?.es001);
        const GE012a = 0;

        if (!ES001 || !GE012a) {
          return null;
        }

        const result = (ES001 / GE012a) * 100;
        const ano = esgoto.ano.toString();
        const dados = [
          ano,
          parseFloat(result.toFixed(2)),
          result.toFixed(2).toString(),
        ];
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

    setTituloIndicador("IN056 - Índice de coleta de esgoto");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN059(data) {
    getDescricaoIndicador(data);
    const rsEs = await api
      .post("get-esgoto", { id_municipio: data.id_municipio, ano: data.ano })
      .then((response) => {
        return response.data[0];
      });

    const ES028 = rsEs?.es028;
    const ES005 = rsEs?.es005;

    const result = ES028 + ES005;
    const ano = data.ano;
    const dados = [
      ["Ano", "Dados"],
      [ano, result],
    ];
    setData(dados);
  }

  async function IN061(data) {
    getDescricaoIndicador(data);
    const rsBl = await api
      .post("get-balanco", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsBl.map(async (balanco) => {
        const BL001 = parseFloat(balanco?.bl001);
        const BL005 = parseFloat(balanco?.bl005);

        if (!BL001 || !BL005) {
          return null;
        }

        const result = BL001 / BL005;
        const ano = balanco.ano.toString();
        const dados = [
          ano,
          parseFloat(result.toFixed(2)),
          result.toFixed(2).toString(),
        ];
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

    setTituloIndicador("IN061 - Liquidez corrente");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN062(data) {
    getDescricaoIndicador(data);
    const rsBl = await api
      .post("get-balanco", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsBl.map(async (balanco) => {
        const BL001 = parseFloat(balanco?.bl001);
        const BL003 = parseFloat(balanco?.bl003);
        const BL005 = parseFloat(balanco?.bl005);
        const BL010 = parseFloat(balanco?.bl010);

        if (!BL001 || !BL003 || !BL005 || !BL010) {
          return null;
        }

        const result = (BL001 + BL010) / (BL010 + BL005);
        const ano = balanco.ano.toString();
        const dados = [
          ano,
          parseFloat(result.toFixed(2)),
          result.toFixed(2).toString(),
        ];
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

    setTituloIndicador("IN062 - Liquidez geral");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN063(data) {
    getDescricaoIndicador(data);
    const rsBl = await api
      .post("get-balanco", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsBl.map(async (balanco) => {
        const BL002 = parseFloat(balanco?.bl002);
        const BL003 = parseFloat(balanco?.bl003);
        const BL005 = parseFloat(balanco?.bl005);
        const BL008 = parseFloat(balanco?.bl008);

        if (!BL002 || !BL003 || !BL005 || !BL008) {
          return null;
        }

        const result = (BL003 + BL005 + BL008) / BL002;
        const ano = balanco.ano.toString();
        const dados = [
          ano,
          parseFloat(result.toFixed(2)),
          result.toFixed(2).toString(),
        ];
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

    setTituloIndicador("IN063 - Grau de endividamento");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN064(data) {
    getDescricaoIndicador(data);
    const rsBl = await api
      .post("get-balanco", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsBl.map(async (balanco) => {
        const BL009 = parseFloat(balanco?.bl009);
        const BL007 = parseFloat(balanco?.bl007);

        if (!BL009 || !BL007) {
          return null;
        }

        const result = (BL009 / BL007) * 100;
        const ano = balanco.ano.toString();
        const dados = [
          ano,
          parseFloat(result.toFixed(2)),
          result.toFixed(2).toString(),
        ];
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

    setTituloIndicador("IN064 - Margem operacional com depreciação");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN065(data) {
    getDescricaoIndicador(data);
    const rsBl = await api
      .post("get-balanco", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsBl.map(async (balanco) => {
        const BL004 = parseFloat(balanco?.bl004);
        const BL007 = parseFloat(balanco?.bl007);

        if (!BL004 || !BL007) {
          return null;
        }

        const result = (BL004 / BL007) * 100;
        const ano = balanco.ano.toString();
        const dados = [
          ano,
          parseFloat(result.toFixed(2)),
          result.toFixed(2).toString(),
        ];
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

    setTituloIndicador("IN065 - Margem líquida com depreciação");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN066(data) {
    getDescricaoIndicador(data);
    const rsBl = await api
      .post("get-balanco", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsBl.map(async (balanco) => {
        const BL004 = parseFloat(balanco?.bl004);
        const BL006 = parseFloat(balanco?.bl006);

        if (!BL004 || !BL006) {
          return null;
        }

        const result = (BL004 / (BL006 - BL004)) * 100;
        const ano = balanco.ano.toString();
        const dados = [
          ano,
          parseFloat(result.toFixed(2)),
          result.toFixed(2).toString(),
        ];
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

    setTituloIndicador("IN066 - Retorno sobre o patrimônio líquido");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN067(data) {
    getDescricaoIndicador(data);
    const rsBl = await api
      .post("get-balanco", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsBl.map(async (balanco) => {
        const BL003 = parseFloat(balanco?.bl003);
        const BL005 = parseFloat(balanco?.bl005);

        if (!BL003 || !BL005) {
          return null;
        }

        const result = (BL003 / (BL003 + BL005)) * 100;
        const ano = balanco.ano.toString();
        const dados = [
          ano,
          parseFloat(result.toFixed(2)),
          result.toFixed(2).toString(),
        ];
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

    setTituloIndicador("IN067 - Composição de exigibilidades");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN068(data) {
    getDescricaoIndicador(data);
    const rsBl = await api
      .post("get-balanco", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsBl.map(async (balanco) => {
        const BL007 = parseFloat(balanco?.bl007);
        const BL012 = parseFloat(balanco?.bl012);

        if (!BL007 || !BL012) {
          return null;
        }

        const result = (BL012 / BL007) * 100;
        const ano = balanco.ano.toString();
        const dados = [
          ano,
          parseFloat(result.toFixed(2)),
          result.toFixed(2).toString(),
        ];
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

    setTituloIndicador("IN068 - Margem operacional sem depreciação");
    setIndicador(rsFilter.sort((a, b) => b[0] - a[0]));
    setData(dados);
  }

  async function IN069(data) {
    getDescricaoIndicador(data);
    const rsBl = await api
      .post("get-balanco", { id_municipio: data.id_municipio })
      .then((response) => {
        return response.data;
      });

    const rs = await Promise.all(
      rsBl.map(async (balanco) => {
        const BL011 = parseFloat(balanco?.bl011);
        const BL007 = parseFloat(balanco?.bl007);

        if (!BL011 || !BL007) {
          return null;
        }

        const result = (BL011 / BL007) * 100;
        const ano = balanco.ano.toString();
        const dados = [
          ano,
          parseFloat(result.toFixed(2)),
          result.toFixed(2).toString(),
        ];
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

    setTituloIndicador("IN069 - Margem líquida sem depreciação");
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
                      <option value="IN015">
                        IN015 - Índice de coleta de esgoto
                      </option>
                      <option value="IN016">
                        IN016 - Índice de tratamento de esgoto
                      </option>
                      <option value="IN021">
                        IN021 - Extensão da rede de esgoto por ligação
                      </option>
                      <option value="IN024">
                        IN024 - Índice de atendimento urbano de esgoto referido
                        aos municípios atendidos com água
                      </option>
                      <option value="IN046">
                        IN046 - Índice de esgoto tratado referido à água
                        consumida
                      </option>
                      <option value="IN047">
                        IN047 - Índice de atendimento urbano de esgoto referido
                        aos municípios atendidos com esgoto
                      </option>
                      <option value="IN056">
                        IN007 - Incidência de empregados próprios no total de
                        empregados no manejo de rsu
                      </option>
                      <option value="IN059">
                        IN059 - Índice de consumo de energia elétrica em
                        sistemas de esgotamento sanitário
                      </option>
                      <option value="IN061">IN061 - Liquidez corrente</option>
                      <option value="IN062">IN062 - Liquidez geral</option>
                      <option value="IN063">
                        IN063 - Grau de endividamento
                      </option>
                      <option value="IN064">
                        IN064 - Margem operacional com depreciação
                      </option>
                      <option value="IN065">
                        IN065 - Margem líquida com depreciação
                      </option>
                      <option value="IN066">
                        IN066 - Retorno sobre o patrimônio líquido
                      </option>
                      <option value="IN067">
                        IN067 - Composição de exigibilidades
                      </option>
                      <option value="IN068">
                        IN068 - Margem operacional sem depreciação
                      </option>
                      <option value="IN069">
                        IN069 - Margem líquida sem depreciação
                      </option>
                      <option value="IN071">
                        IN071 - Economias atingidas por paralisações
                      </option>
                      <option value="IN072">
                        IN072 - Duração média das paralisações
                      </option>
                      <option value="IN073">
                        IN073 - Economias atingidas por intermitências
                      </option>
                      <option value="IN074">
                        IN074 - Duração média das intermitências
                      </option>
                      <option value="IN075">
                        IN075 - Incidência das análises de cloro residual fora
                        do padrão
                      </option>
                      <option value="IN076">
                        IN076 - Incidência das análises de turbidez fora do
                        padrão
                      </option>
                      <option value="IN077">
                        IN077 - Duração média dos reparos de extravasamentos de
                        esgotos
                      </option>
                      <option value="IN079">
                        IN079 - Índice de conformidade da quantidade de amostras
                        - cloro residual
                      </option>
                      <option value="IN080">
                        IN080 - Índice de conformidade da quantidade de amostras
                        - turbidez
                      </option>
                      <option value="IN082">
                        IN082 - Extravasamentos de esgotos por extensão de rede
                      </option>
                      <option value="IN083">
                        IN083 - Duração média dos serviços executados
                      </option>
                      <option value="IN084">
                        IN084 - Incidência das análises de coliformes totais
                        fora do padrão
                      </option>
                      <option value="IN085">
                        IN085 - Índice de conformidade da quantidade de amostras
                        - coliformes totais
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
