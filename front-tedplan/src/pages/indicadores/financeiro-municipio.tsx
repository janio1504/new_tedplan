import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import {
  Form,
  InputP,
  InputM,
  MenuMunicipio,
  Municipio,
  MenuMunicipioItem,
  DivTitulo,
  DivFormEixo,
  DivTituloEixo,
  DivTituloConteudo,
  InputGG,
  DivSeparadora,
  InputSNIS,
  InputXL,
  InputAno,
} from "../../styles/financeiro";

import {
  DivTituloForm,
  DivForm,
  Container,
  DivCenter,
  InputG,
  SubmitButton,
  TextArea,
  DivTextArea,
  StepButton,
  StepContent,
  StepLabel,
  StepperNavigation,
  StepperWrapper,
  StepperContainer,
  StepperButton,
} from "../../styles/esgoto-indicadores";

import { DivFormConteudo } from "../../styles/drenagem-indicadores";
import HeadIndicadores from "../../components/headIndicadores";
import dynamic from "next/dynamic";
import "suneditor/dist/css/suneditor.min.css";
import { getAPIClient } from "../../services/axios";
import MenuIndicadores from "../../components/MenuIndicadores";
import { toast, ToastContainer } from "react-nextjs-toast";
import { GetServerSideProps } from "next";
import Router from "next/router";
import { AuthContext } from "../../contexts/AuthContext";
import CurrencyInput from "react-currency-masked-input";
import { parseCookies } from "nookies";
import api from "../../services/api";
import MenuIndicadoresCadastro from "../../components/MenuIndicadoresCadastro";
import MenuHorizontal from "../../components/MenuHorizontal";
import { log } from "console";
import { MainContent } from "../../styles/indicadores";
import { SidebarItem, Sidebar } from "../../styles/residuo-solido-coleta-in";
import { LineSideBar } from "../../styles/drenagem-indicadores";
import { anosSelect } from "../../util/util";

interface IMunicipio {
  id_municipio: string;
  municipio_codigo_ibge: string;
  municipio_nome: string;
}

interface MunicipioProps {
  municipio: IMunicipio[];
}

export default function Financeiro({ municipio }: MunicipioProps) {
  const { usuario, isEditor, isAuthenticated, anoEditorSimisab, permission } =
    useContext(AuthContext);
  const [isMunicipio, setMunicipio] = useState<IMunicipio | any>(municipio);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [content, setContent] = useState("");
  const [contentForEditor, setContentForEditor] = useState(null);
  const [contentSR, setContentSR] = useState("");
  const [dadosMunicipio, setDadosMunicipio] = useState<IMunicipio | any>(
    municipio
  );
  const [dadosFinanceiros, setDadosFinanceiros] = useState(null);
  const [anoSelected, setAnoSelected] = useState(null);
  const [activeForm, setActiveForm] = useState("receitas1");

  useEffect(() => {
    getDadosMunicipio();
    if (anoEditorSimisab) {
      getFinaceiroMunicipio(anoEditorSimisab);
      setAnoSelected(anoEditorSimisab);
    }
  }, [municipio, usuario, anoEditorSimisab]);

  async function getDadosMunicipio() {
    const res = await api.get("getMunicipio", {
      params: { id_municipio: usuario?.id_municipio },
    });
    setDadosMunicipio(res.data);
  }

  function handleOnChange(content) {
    setContent(content);
  }

  function seletcAno(ano: any) {
    if (ano) {
      setAnoSelected(ano);
      getFinaceiroMunicipio(ano);
    } else {
      setAnoSelected("");
      setDadosFinanceiros([]);
    }
  }

  async function handleCadastro(data) {
    if (!isEditor) {
      toast.notify("Você não tem permissão para editar!", {
        title: "Atenção!",
        duration: 7,
        type: "error",
      });
      return;
    }
    // CALCULO DA FORMULAS DO SNIS
    // AGUA E ESGOTO
    data.AES_FN005 =
      (data.AES_FN003
        ? parseFloat(data.AES_FN003.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.aes_fn003
        ? parseFloat(dadosFinanceiros?.aes_fn003)
        : 0) +
      (data.FN002
        ? parseFloat(data.FN002.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn002
        ? parseFloat(dadosFinanceiros?.fn002)
        : 0) +
      (data.FN007
        ? parseFloat(data.FN007.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn007
        ? parseFloat(dadosFinanceiros?.fn007)
        : 0) +
      (data.FN038
        ? parseFloat(data.FN038.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn038
        ? parseFloat(dadosFinanceiros?.fn038)
        : 0) +
      (data.AES_FN004
        ? parseFloat(data.AES_FN004.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.aes_fn004
        ? parseFloat(dadosFinanceiros?.aes_fn004)
        : 0);

    data.FN001 =
      (data.FN002
        ? parseFloat(data.FN002.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn002
        ? parseFloat(dadosFinanceiros?.fn002)
        : 0) +
      (data.AES_FN003
        ? parseFloat(data.AES_FN003.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.aes_fn003
        ? parseFloat(dadosFinanceiros?.aes_fn003)
        : 0) +
      (data.FN007
        ? parseFloat(data.FN007.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn007
        ? parseFloat(dadosFinanceiros?.fn007)
        : 0) +
      (data.FN038
        ? parseFloat(data.FN038.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn038
        ? parseFloat(dadosFinanceiros?.fn038)
        : 0);

    data.AES_FN015 =
      (data.FN010
        ? parseFloat(data.FN010.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn010
        ? parseFloat(dadosFinanceiros?.fn010)
        : 0) +
      (data.FN011
        ? parseFloat(data.FN011.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn011
        ? parseFloat(dadosFinanceiros?.fn011)
        : 0) +
      (data.FN013
        ? parseFloat(data.FN013.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn013
        ? parseFloat(dadosFinanceiros?.fn013)
        : 0) +
      (data.FN014
        ? parseFloat(data.FN014.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn014
        ? parseFloat(dadosFinanceiros?.fn014)
        : 0) +
      (data.AES_FN020
        ? parseFloat(data.AES_FN020.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.aes_fn020
        ? parseFloat(dadosFinanceiros?.aes_fn020)
        : 0) +
      (data.FN039
        ? parseFloat(data.FN039.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn039
        ? parseFloat(dadosFinanceiros?.fn039)
        : 0) +
      (data.AES_FN021
        ? parseFloat(data.AES_FN021.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.aes_fn021
        ? parseFloat(dadosFinanceiros?.aes_fn021)
        : 0) +
      (data.FN027
        ? parseFloat(data.FN027.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn027
        ? parseFloat(dadosFinanceiros?.fn027)
        : 0);
    //console.log(data.AES_FN015);

    data.AES_FN017 =
      (data.AES_FN015
        ? data.AES_FN015
        : dadosFinanceiros?.aes_fn015
        ? parseFloat(dadosFinanceiros?.aes_fn015)
        : 0) +
      (data.FN035
        ? parseFloat(data.FN035.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn035
        ? parseFloat(dadosFinanceiros?.fn035)
        : 0) +
      (data.FN036
        ? parseFloat(data.FN036.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn036
        ? parseFloat(dadosFinanceiros?.fn036)
        : 0) +
      (data.FN019
        ? parseFloat(data.FN019.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn019
        ? parseFloat(dadosFinanceiros?.fn019)
        : 0) +
      (data.AES_FN022
        ? parseFloat(data.AES_FN022.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.aes_fn022
        ? parseFloat(dadosFinanceiros?.aes_fn022)
        : 0) +
      (data.FN028
        ? parseFloat(data.FN028.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn028
        ? parseFloat(dadosFinanceiros?.fn028)
        : 0);

    data.AES_FN016 =
      (data.FN035
        ? parseFloat(data.FN035.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn035
        ? parseFloat(dadosFinanceiros?.fn035)
        : 0) +
      (data.FN036
        ? parseFloat(data.FN036.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn036
        ? parseFloat(dadosFinanceiros?.fn036)
        : 0);

    data.FN037 =
      (data.FN017
        ? data.FN017
        : dadosFinanceiros?.fn017
        ? parseFloat(dadosFinanceiros?.fn017)
        : 0) +
      (data.FN034
        ? parseFloat(data.FN034.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn034
        ? parseFloat(dadosFinanceiros?.fn034)
        : 0);

    data.FN033 =
      (data.FN030
        ? parseFloat(data.FN030.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn030
        ? parseFloat(dadosFinanceiros?.fn030)
        : 0) +
      (data.FN031
        ? parseFloat(data.FN031.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn031
        ? parseFloat(dadosFinanceiros?.fn011)
        : 0) +
      (data.FN032
        ? parseFloat(data.FN032.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn032
        ? parseFloat(dadosFinanceiros?.fn032)
        : 0) +
      (data.FN018
        ? parseFloat(data.FN018.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn018
        ? parseFloat(dadosFinanceiros?.fn018)
        : 0) +
      (data.AES_FN023
        ? parseFloat(data.AES_FN023.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.aes_fn023
        ? parseFloat(dadosFinanceiros?.aes_fn023)
        : 0) +
      (data.AES_FN024
        ? parseFloat(data.AES_FN024.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.aes_fn024
        ? parseFloat(dadosFinanceiros?.aes_fn024)
        : 0) +
      (data.FN025
        ? parseFloat(data.FN025.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn025
        ? parseFloat(dadosFinanceiros?.fn025)
        : 0);

    data.FN048 =
      (data.FN041
        ? parseFloat(data.FN041.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn041
        ? parseFloat(dadosFinanceiros?.fn041)
        : 0) +
      (data.FN042
        ? parseFloat(data.FN042.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn042
        ? parseFloat(dadosFinanceiros?.fn042)
        : 0) +
      (data.FN043
        ? parseFloat(data.FN043.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn043
        ? parseFloat(dadosFinanceiros?.fn043)
        : 0) +
      (data.FN044
        ? parseFloat(data.FN044.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn044
        ? parseFloat(dadosFinanceiros?.fn044)
        : 0) +
      (data.FN045
        ? parseFloat(data.FN045.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn045
        ? parseFloat(dadosFinanceiros?.fn045)
        : 0) +
      (data.FN046
        ? parseFloat(data.FN046.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn046
        ? parseFloat(dadosFinanceiros?.fn046)
        : 0) +
      (data.FN047
        ? parseFloat(data.FN047.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn047
        ? parseFloat(dadosFinanceiros?.fn047)
        : 0);

    data.FN058 =
      (data.FN051
        ? parseFloat(data.FN051.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn041
        ? parseFloat(dadosFinanceiros?.fn041)
        : 0) +
      (data.FN052
        ? parseFloat(data.FN052.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn052
        ? parseFloat(dadosFinanceiros?.fn052)
        : 0) +
      (data.FN053
        ? parseFloat(data.FN053.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn053
        ? parseFloat(dadosFinanceiros?.fn053)
        : 0) +
      (data.FN054
        ? parseFloat(data.FN054.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn054
        ? parseFloat(dadosFinanceiros?.fn054)
        : 0) +
      (data.FN055
        ? parseFloat(data.FN055.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn055
        ? parseFloat(dadosFinanceiros?.fn055)
        : 0) +
      (data.FN056
        ? parseFloat(data.FN056.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn056
        ? parseFloat(dadosFinanceiros?.fn056)
        : 0) +
      (data.FN057
        ? parseFloat(data.FN057.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn057
        ? parseFloat(dadosFinanceiros?.fn057)
        : 0);

    // DRENAGEM

    data.FN009 =
      (data.FN005
        ? parseFloat(data.FN005.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn005
        ? parseFloat(dadosFinanceiros?.fn005)
        : 0) +
      (data.FN008
        ? parseFloat(data.FN008.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn008
        ? parseFloat(dadosFinanceiros?.fn008)
        : 0);

    data.FN016 =
      (data.FN013
        ? parseFloat(data.FN013.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn013
        ? parseFloat(dadosFinanceiros?.fn013)
        : 0) +
      (data.FN015
        ? parseFloat(data.FN015.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn015
        ? parseFloat(dadosFinanceiros?.fn015)
        : 0);

    data.AES_FN022 =
      (data.FN024
        ? parseFloat(data.FN024.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn024
        ? parseFloat(dadosFinanceiros?.fn024)
        : 0) +
      (data.FN018
        ? parseFloat(data.FN018.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn018
        ? parseFloat(dadosFinanceiros?.fn018)
        : 0) +
      (data.FN020
        ? parseFloat(data.FN020.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn020
        ? parseFloat(dadosFinanceiros?.fn020)
        : 0);

    data.FN023 =
      (data.FN017
        ? data.FN017
        : dadosFinanceiros?.fn017
        ? parseFloat(dadosFinanceiros?.fn017)
        : 0) +
      (data.FN019
        ? parseFloat(data.FN019.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn019
        ? parseFloat(dadosFinanceiros?.fn019)
        : 0) +
      (data.FN021
        ? parseFloat(data.FN021.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn021
        ? parseFloat(dadosFinanceiros?.fn021)
        : 0);

    //RESIDUOS SÓLIDOS

    data.FN208 =
      (data.FN206
        ? parseFloat(data.FN206.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn206
        ? parseFloat(dadosFinanceiros?.fn206)
        : 0) +
      (data.FN207
        ? parseFloat(data.FN207.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn207
        ? parseFloat(dadosFinanceiros?.fn207)
        : 0);

    data.FN0211 =
      (data.FN209
        ? parseFloat(data.FN209.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn209
        ? parseFloat(dadosFinanceiros?.fn209)
        : 0) +
      (data.FN210
        ? parseFloat(data.FN210.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn210
        ? parseFloat(dadosFinanceiros?.fn210)
        : 0);

    data.FN0214 =
      (data.FN212
        ? parseFloat(data.FN213.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn212
        ? parseFloat(dadosFinanceiros?.fn212)
        : 0) +
      (data.FN213
        ? parseFloat(data.FN213.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn213
        ? parseFloat(dadosFinanceiros?.fn213)
        : 0);

    data.FN0217 =
      (data.FN216
        ? parseFloat(data.FN216.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn216
        ? parseFloat(dadosFinanceiros?.fn216)
        : 0) +
      (data.FN215
        ? parseFloat(data.FN215.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn215
        ? parseFloat(dadosFinanceiros?.fn215)
        : 0);

    data.FN0218 =
      (data.FN208
        ? data.FN208
        : dadosFinanceiros?.fn208
        ? parseFloat(dadosFinanceiros?.fn208)
        : 0) +
      (data.FN211
        ? parseFloat(data.FN211.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn211
        ? parseFloat(dadosFinanceiros?.fn211)
        : 0) +
      (data.FN214
        ? parseFloat(data.FN214.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn214
        ? parseFloat(dadosFinanceiros?.fn214)
        : 0) +
      (data.FN217
        ? parseFloat(data.FN217.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn217
        ? parseFloat(dadosFinanceiros?.fn217)
        : 0);

    data.FN0219 =
      (data.FN206
        ? parseFloat(data.FN206.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn206
        ? parseFloat(dadosFinanceiros?.fn206)
        : 0) +
      (data.FN209
        ? parseFloat(data.FN209.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn209
        ? parseFloat(dadosFinanceiros?.fn209)
        : 0) +
      (data.FN212
        ? parseFloat(data.FN212.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn212
        ? parseFloat(dadosFinanceiros?.fn212)
        : 0) +
      (data.FN216
        ? parseFloat(data.FN216.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn216
        ? parseFloat(dadosFinanceiros?.fn216)
        : 0);

    data.FN022 =
      (data.FN207
        ? parseFloat(data.FN207.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn207
        ? parseFloat(dadosFinanceiros?.fn207)
        : 0) +
      (data.FN210
        ? parseFloat(data.FN210.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn210
        ? parseFloat(dadosFinanceiros?.fn210)
        : 0) +
      (data.FN213
        ? parseFloat(data.FN213.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn213
        ? parseFloat(dadosFinanceiros?.fn213)
        : 0) +
      (data.FN215
        ? parseFloat(data.FN215.replace(".", "").replace(",", "."))
        : dadosFinanceiros?.fn215
        ? parseFloat(dadosFinanceiros?.fn215)
        : 0);

    //const dados = Object.entries(data)
    data.ano = anoSelected;
    data.id_municipio = dadosMunicipio?.id_municipio;
    data.id_fn_residuos_solidos = dadosFinanceiros?.id_fn_residuos_solidos
      ? dadosFinanceiros.id_fn_residuos_solidos
      : null;
    data.id_fn_drenagem_aguas_pluviais =
      dadosFinanceiros?.id_fn_drenagem_aguas_pluviais
        ? dadosFinanceiros.id_fn_drenagem_aguas_pluviais
        : null;
    data.id_fn_agua_esgoto_sanitario =
      dadosFinanceiros?.id_fn_agua_esgoto_sanitario
        ? dadosFinanceiros.id_fn_agua_esgoto_sanitario
        : null;

    const resCad = await api
      .post("addPsFinanceiro", data)
      .then((response) => {
        toast.notify("Dados gravados com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
        getFinaceiroMunicipio(anoSelected);
        return response;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
    return resCad;
  }

  async function getFinaceiroMunicipio(ano: any) {
    await api
      .post("get-ps-financeiro-por-ano", {
        id_municipio: dadosMunicipio?.id_municipio,
        ano: ano,
      })
      .then((response) => {
        console.log(response.data[0]);
        setDadosFinanceiros(response.data[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <Container>
      <ToastContainer></ToastContainer>
      <HeadIndicadores usuarios={[]}></HeadIndicadores>
      <MenuHorizontal
        municipio={dadosMunicipio?.municipio_nome}
      ></MenuHorizontal>
      <MenuIndicadoresCadastro></MenuIndicadoresCadastro>
      <Sidebar>
        <LineSideBar>Água e Esgoto Sanitário</LineSideBar>
        <SidebarItem
          active={activeForm === "receitas1"}
          onClick={() => setActiveForm("receitas1")}
        >
          Receitas
        </SidebarItem>
        <SidebarItem
          active={activeForm === "arrecadacao"}
          onClick={() => setActiveForm("arrecadacao")}
        >
          Arrecadação e crédito a receber
        </SidebarItem>
        <SidebarItem
          active={activeForm === "despesas1"}
          onClick={() => setActiveForm("despesas1")}
        >
          Despesas
        </SidebarItem>
        <SidebarItem
          active={activeForm === "investimentos"}
          onClick={() => setActiveForm("investimentos")}
        >
          Investimentos realizados pelo prestador de serviços
        </SidebarItem>
        <SidebarItem
          active={activeForm === "investimentosMunicipio"}
          onClick={() => setActiveForm("investimentosMunicipio")}
        >
          Investimentos realizados pelo município
        </SidebarItem>
        <SidebarItem
          active={activeForm === "investimentosEstado"}
          onClick={() => setActiveForm("investimentosEstado")}
        >
          Investimentos realizados pelo estado
        </SidebarItem>
        <SidebarItem
          active={activeForm === "observacoes"}
          onClick={() => setActiveForm("observacoes")}
        >
          Observações, esclarecimentos e sugestões
        </SidebarItem>
        <LineSideBar>Drenagem e Águas Pluviais</LineSideBar>
        <SidebarItem
          active={activeForm === "cobranca"}
          onClick={() => setActiveForm("cobranca")}
        >
          Cobrança
        </SidebarItem>
        <SidebarItem
          active={activeForm === "receitas"}
          onClick={() => setActiveForm("receitas")}
        >
          Receitas
        </SidebarItem>
        <SidebarItem
          active={activeForm === "despesas"}
          onClick={() => setActiveForm("despesas")}
        >
          Despesas
        </SidebarItem>
        <SidebarItem
          active={activeForm === "investimentoDesembolsos"}
          onClick={() => setActiveForm("investimentoDesembolsos")}
        >
          Investimento e desembolsos
        </SidebarItem>
        <SidebarItem
          active={activeForm === "observacoes2"}
          onClick={() => setActiveForm("observacoes2")}
        >
          Observações, esclarecimentos e sugestões
        </SidebarItem>
        <LineSideBar>Resíduos Sólidos</LineSideBar>
        <SidebarItem
          active={activeForm === "cobranca2"}
          onClick={() => setActiveForm("cobranca2")}
        >
          Cobrança
        </SidebarItem>
        <SidebarItem
          active={activeForm === "despesas2"}
          onClick={() => setActiveForm("despesas2")}
        >
          Despesas
        </SidebarItem>
        <SidebarItem
          active={activeForm === "receitas2"}
          onClick={() => setActiveForm("receitas2")}
        >
          Receitas
        </SidebarItem>
        <SidebarItem
          active={activeForm === "investimentoUniao"}
          onClick={() => setActiveForm("investimentoUniao")}
        >
          Investimento da União
        </SidebarItem>
        <SidebarItem
          active={activeForm === "observacoes3"}
          onClick={() => setActiveForm("observacoes3")}
        >
          Observações, esclarecimentos e sugestões
        </SidebarItem>
      </Sidebar>
      <MainContent>
        <DivCenter>
          <Form onSubmit={handleSubmit(handleCadastro)}>
            <DivForm>
              <DivTituloForm>Informações Financeiras</DivTituloForm>
              <DivFormEixo>
                <DivFormConteudo
                  active={
                    activeForm === "receitas1" ||
                    activeForm === "arrecadacao" ||
                    activeForm === "despesas1" ||
                    activeForm === "investimentos" ||
                    activeForm === "investimentosMunicipio" ||
                    activeForm === "investimentosEstado" ||
                    activeForm === "observacoes" ||
                    activeForm === "cobranca" ||
                    activeForm === "receitas" ||
                    activeForm === "despesas" ||
                    activeForm === "investimentoDesembolsos" ||
                    activeForm === "observacoes2" ||
                    activeForm === "cobranca2" ||
                    activeForm === "despesas2" ||
                    activeForm === "receitas2" ||
                    activeForm === "investimentoUniao" ||
                    activeForm === "observacoes3"
                  }
                >
                  <DivTitulo>
                    <DivTituloConteudo>Ano</DivTituloConteudo>
                  </DivTitulo>
                  {anoEditorSimisab ? (
                    <div
                      style={{
                        marginLeft: 40,
                        fontSize: 18,
                        fontWeight: "bolder",
                      }}
                    >
                      {anoEditorSimisab}
                    </div>
                  ) : (
                    ""
                  )}
                  {!anoEditorSimisab && (
                    <>
                      <label>Selecione o ano desejado:</label>
                      <select
                        name="ano"
                        id="ano"
                        onChange={(e) => seletcAno(e.target.value)}
                      >
                        <option>Selecionar</option>
                        {anosSelect().map((ano) => (
                          <option value={ano}>{ano}</option>
                        ))}
                      </select>
                    </>
                  )}
                </DivFormConteudo>
              </DivFormEixo>
              <DivFormEixo>
                <DivFormConteudo active={activeForm === "receitas1"}>
                  <DivTitulo>
                    <DivTituloConteudo>Receitas</DivTituloConteudo>
                  </DivTitulo>

                  <table>
                    <tbody>
                      <tr>
                        <th style={{width: '120px'}}>Código SNIS</th>
                        <th style={{width: '600px'}}>Descrição</th>
                        <th style={{width: '100px'}}>Ano: {anoSelected}</th>
                        <th></th>
                      </tr>
                      <tr>
                        <td>FN002</td>
                        <td>Receita operacional direta de Água</td>
                        <td>
                          <input
                            {...register("FN002")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn002}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN003</td>
                        <td>Receita operacional direta de Esgoto</td>
                        <td>
                          <input
                            {...register("AES_FN003")}
                            defaultValue={dadosFinanceiros?.aes_fn003}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN007</td>
                        <td>
                          Receita operacional direta de Água exportada (Bruta ou
                          Tratada)
                        </td>
                        <td>
                          <input
                            {...register("FN007")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn007}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN038</td>
                        <td>
                          Receita operacional direta - Esgoto bruto importado
                        </td>
                        <td>
                          <input
                            {...register("FN038")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn038}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN001</td>
                        <td>Receita operacional direta Total</td>
                        <td>
                          <input
                            {...register("FN001")}
                            disabled={true}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn001}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN004</td>
                        <td>Receita operacional indireta</td>
                        <td>
                          <input
                            {...register("AES_FN004")}
                            type="text"
                            defaultValue={dadosFinanceiros?.aes_fn004}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN005</td>
                        <td>Receita operacional Total (Direta + Indireta)</td>
                        <td>
                          <input
                            {...register("AES_FN005")}
                            disabled={true}
                            type="text"
                            defaultValue={dadosFinanceiros?.aes_fn005}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                    </tbody>
                  </table>
                </DivFormConteudo>

                <DivFormConteudo active={activeForm === "arrecadacao"}>
                  <DivTitulo>
                    <DivTituloConteudo>
                      Arrecadação e crédito a receber
                    </DivTituloConteudo>
                  </DivTitulo>
                  <table>
                    <tbody>
                      <tr>
                        <th style={{ width: "120px" }}>Código SNIS</th>
                         <th style={{ width: "600px" }}>Descrição</th>
                        <th style={{ width: "100px" }}>Ano: {anoSelected}</th>
                        <th></th>
                      </tr>
                      <tr>
                        <td>FN006</td>
                        <td>Arrecadação total operacional indireta</td>
                        <td>
                          <input
                            {...register("FN006")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn006}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN008</td>
                        <td>Créditos de contas a receber</td>
                        <td>
                          <input
                            {...register("AES_FN008")}
                            type="text"
                            defaultValue={dadosFinanceiros?.aes_fn008}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                    </tbody>
                  </table>
                </DivFormConteudo>

                <DivFormConteudo active={activeForm === "despesas1"}>
                  <DivTitulo>
                    <DivTituloConteudo>Despesas</DivTituloConteudo>
                  </DivTitulo>
                  
                  <table>
                    <tbody>
                      <tr>
                       <th style={{ width: "120px" }}>Código SNIS</th>
                         <th style={{ width: "600px" }}>Descrição</th>
                        <th style={{ width: "100px" }}>Ano: {anoSelected}</th>
                        <th></th>
                      </tr>
                      <tr>
                        <td>FN010</td>
                        <td>Despesa com pessoal próprio</td>
                        <td>
                          <input
                            {...register("FN010")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn010}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN011</td>
                        <td>Despesa com produtos químicos</td>
                        <td>
                          <input
                            {...register("FN011")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn011}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN013</td>
                        <td>Despesa com energia elétrica</td>
                        <td>
                          <input
                            {...register("AES_FN013")}
                            type="text"
                            defaultValue={dadosFinanceiros?.aes_fn013}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN014</td>
                        <td>Despesa com serviços de terceiros</td>
                        <td>
                          <input
                            {...register("FN014")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn014}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN020</td>
                        <td>Despesa com água importada (Bruta ou tratada)</td>
                        <td>
                          <input
                            {...register("AES_FN020")}
                            type="text"
                            defaultValue={dadosFinanceiros?.aes_fn020}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN039</td>
                        <td>Despesa com esgoto exportado</td>
                        <td>
                          <input
                            {...register("FN039")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn039}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN021</td>
                        <td>
                          Despesas fiscais ou tributarias computadas na dex
                        </td>
                        <td>
                          <input
                            {...register("AES_FN021")}
                            type="text"
                            defaultValue={dadosFinanceiros?.aes_fn021}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN027</td>
                        <td>Outras despesas de exploração</td>
                        <td>
                          <input
                            {...register("FN027")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn027}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN015</td>
                        <td>Despesas de exploração (DEX)</td>
                        <td>
                          <input
                            {...register("AES_FN015")}
                            disabled={true}
                            type="text"
                            defaultValue={dadosFinanceiros?.aes_fn015}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN035</td>
                        <td>
                          Despesas com juros e encargos do serviço da dívida
                        </td>
                        <td>
                          <input
                            {...register("FN035")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn035}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN036</td>
                        <td>
                          Despesas com variações monetárias e cambiais das
                          dividas
                        </td>
                        <td>
                          <input
                            {...register("FN036")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn036}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN016</td>
                        <td>
                          Despesas com juros e encargos do serviço da divida
                        </td>
                        <td>
                          <input
                            type="text"
                            disabled={true}
                            defaultValue={dadosFinanceiros?.aes_fn016}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN019</td>
                        <td>
                          Despesas com depreciação, amortização do ativo
                          deferido
                        </td>
                        <td>
                          <input
                            {...register("AES_FN019")}
                            type="text"
                            defaultValue={dadosFinanceiros?.aes_fn019}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN022</td>
                        <td>
                          Despesas fiscais ou tributarias não computadas na dex
                        </td>
                        <td>
                          <input
                            {...register("AES_FN022")}
                            type="text"
                            defaultValue={dadosFinanceiros?.aes_fn022}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN028</td>
                        <td>Outras depesas com os servicos</td>
                        <td>
                          <input
                            {...register("FN028")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn028}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN017</td>
                        <td>Despesas totais com os serviços (DTS)</td>
                        <td>
                          <input
                            {...register("AES_FN017")}
                            type="text"
                            disabled={true}
                            defaultValue={dadosFinanceiros?.aes_fn017}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN034</td>
                        <td>Despesas com amortização do serviço da dívida</td>
                        <td>
                          <input
                            {...register("FN034")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn034}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN037</td>
                        <td>Despesas totais com o serviço da dívida</td>
                        <td>
                          <input
                            {...register("FN037")}
                            type="text"
                            disabled={true}
                            defaultValue={dadosFinanceiros?.fn037}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                    </tbody>
                  </table>
                  
                </DivFormConteudo>

                <DivFormConteudo active={activeForm === "investimentos"}>
                  <DivTitulo>
                    <DivTituloConteudo>
                      Investimentos realizados pelo prestador de serviços
                    </DivTituloConteudo>
                  </DivTitulo>
                  <table>
                    <tbody>
                      <tr>
                       <th style={{ width: "120px" }}>Código SNIS</th>
                         <th style={{ width: "600px" }}>Descrição</th>
                        <th style={{ width: "100px" }}>Ano: {anoSelected}</th>
                        <th></th>
                      </tr>
                      <tr>
                        <td>FN018</td>
                        <td>
                          {" "}
                          Despesas capitalizáveis realizadas pelo prestador de
                          serviços
                        </td>
                        <td>
                          {" "}
                          <input
                            {...register("AES_FN018")}
                            type="text"
                            defaultValue={dadosFinanceiros?.aes_fn018}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN023</td>
                        <td>
                          {" "}
                          Investimentos realizados em abastecimento de água pelo
                          prestador de serviços
                        </td>
                        <td>
                          <input
                            {...register("AES_FN023")}
                            type="text"
                            defaultValue={dadosFinanceiros?.aes_fn023}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN024</td>
                        <td>Despesas com água importada (Bruta ou Tratada)</td>
                        <td>
                          <input
                            {...register("AES_FN024")}
                            type="text"
                            defaultValue={dadosFinanceiros?.aes_fn024}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN025</td>
                        <td>
                          Outros investimentos realizados pelo prestador de
                          serviços
                        </td>
                        <td>
                          <input
                            {...register("FN025")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn025}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN030</td>
                        <td>
                          Investimento com recursos próprios realizado pelo
                          prestador de serviços
                        </td>
                        <td>
                          <input
                            {...register("FN030")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn030}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN031</td>
                        <td>
                          Investimento com recursos onerosos realizado pelo
                          prestador de serviços
                        </td>
                        <td>
                          <input
                            {...register("FN031")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn031}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN032</td>
                        <td>
                          Investimento com recursos não onerosos realizado pelo
                          prestador de serviços
                        </td>
                        <td>
                          <input
                            {...register("FN032")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn032}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN033</td>
                        <td>
                          Investimentos totais realizados pelo prestador de
                          serviços
                        </td>
                        <td>
                          <input
                            {...register("FN033")}
                            type="text"
                            disabled={true}
                            defaultValue={dadosFinanceiros?.fn033}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                    </tbody>
                  </table>
                </DivFormConteudo>

                <DivFormConteudo
                  active={activeForm === "investimentosMunicipio"}
                >
                  <DivTitulo>
                    <DivTituloConteudo>
                      Investimentos realizados pelo município
                    </DivTituloConteudo>
                  </DivTitulo>
                  <table>
                    <tbody>
                      <tr>
                       <th style={{ width: "120px" }}>Código SNIS</th>
                         <th style={{ width: "600px" }}>Descrição</th>
                        <th style={{ width: "100px" }}>Ano: {anoSelected}</th>
                        <th></th>
                      </tr>
                      <tr>
                        <td>FN041</td>
                        <td>
                          Despesas capitalizáveis realizadas pelo munícipio
                        </td>
                        <td>
                          <input
                            {...register("FN041")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn041}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN042</td>
                        <td>
                          Investimentos realizados em abastecimento de água pelo
                          munícipio
                        </td>
                        <td>
                          <input
                            {...register("FN042")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn042}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN043</td>
                        <td>
                          Investimentos realizados em esgotamento sanitário pelo
                          munícipio
                        </td>
                        <td>
                          <input
                            {...register("FN043")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn043}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN044</td>
                        <td>Outros investimentos realizados pelo munícipio</td>
                        <td>
                          <input
                            {...register("FN044")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn044}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN045</td>
                        <td>
                          Investimento com recursos próprios realizado pelo
                          munícipio
                        </td>
                        <td>
                          <input
                            {...register("FN045")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn045}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN046</td>
                        <td>
                          Investimento com recursos onerosos realizado pelo
                          munícipio
                        </td>
                        <td>
                          <input
                            {...register("FN046")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn046}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN047</td>
                        <td>
                          Investimento com recursos não onerosos realizado pelo
                          munícipio
                        </td>
                        <td>
                          <input
                            {...register("FN047")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn047}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN048</td>
                        <td>Investimentos totais realizados pelo munícipio</td>
                        <td>
                          <input
                            {...register("FN048")}
                            type="text"
                            disabled={true}
                            defaultValue={dadosFinanceiros?.fn048}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                    </tbody>
                  </table>
                </DivFormConteudo>

                <DivFormConteudo active={activeForm === "investimentosEstado"}>
                  <DivTitulo>
                    <DivTituloConteudo>
                      Investimentos realizados pelo estado
                    </DivTituloConteudo>
                  </DivTitulo>
                  <table>
                    <tbody>
                      <tr>
                       <th style={{ width: "120px" }}>Código SNIS</th>
                         <th style={{ width: "600px" }}>Descrição</th>
                        <th style={{ width: "100px" }}>Ano: {anoSelected}</th>
                        <th></th>
                      </tr>
                      <tr>
                        <td>FN051</td>
                        <td>Despesas capitalizáveis realizadas pelo estado</td>
                        <td>
                          <input
                            {...register("FN051")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn051}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN052</td>
                        <td>
                          Investimentos realizados em abastecimento de água pelo
                          estado
                        </td>
                        <td>
                          <input
                            {...register("FN052")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn052}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN053</td>
                        <td>
                          Investimentos realizados em esgotamento sanitário pelo
                          estado
                        </td>
                        <td>
                          <input
                            {...register("FN053")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn053}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN054</td>
                        <td>Outros investimentos realizados pelo estado</td>
                        <td>
                          <input
                            {...register("FN054")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn054}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN055</td>
                        <td>
                          Investimento com recursos próprios realizado pelo
                          estado
                        </td>
                        <td>
                          <input
                            {...register("FN055")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn055}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN056</td>
                        <td>
                          Investimento com recursos onerosos realizado pelo
                          estado
                        </td>
                        <td>
                          <input
                            {...register("FN056")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn056}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN057</td>
                        <td>
                          Investimento com recursos não onerosos realizado pelo
                          estado
                        </td>
                        <td>
                          <input
                            {...register("FN057")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn057}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN058</td>
                        <td>Investimentos totais realizados pelo estado</td>
                        <td>
                          <input
                            {...register("FN058")}
                            type="text"
                            disabled={true}
                            defaultValue={dadosFinanceiros?.fn058}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                    </tbody>
                  </table>
                </DivFormConteudo>

                <DivFormConteudo active={activeForm === "observacoes"}>
                  <DivTitulo>
                    <DivTituloConteudo>
                      Observações, esclarecimentos ou sugestões
                    </DivTituloConteudo>
                  </DivTitulo>
                  <table>
                    <tbody>
                      <tr>
                        <th>Código SNIS</th>
                        <th>Descrição</th>
                        <th>Ano {anoSelected}</th>
                        <th></th>
                      </tr>
                      <tr>
                        <td>FN098</td>
                        <td>Campo de justificativa</td>
                        <td>
                          <textarea
                            {...register("FN098")}
                            defaultValue={dadosFinanceiros?.fn098}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          />
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>FN099</td>
                        <td>Observações</td>
                        <td colSpan={2}>
                          <textarea
                            {...register("FN099")}
                            defaultValue={dadosFinanceiros?.fn099}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></textarea>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </DivFormConteudo>

                {/* Drenagem e Águas Pluviais */}
                <DivFormConteudo active={activeForm === "cobranca"}>
                  <DivTitulo>
                    <DivTituloConteudo>Cobrança</DivTituloConteudo>
                  </DivTitulo>
                  <table>
                    <tbody>
                      <tr>
                        <th style={{ width: "120px" }}>Código SNIS</th>
                        <th>Descrição</th>
                        <th style={{ width: "100px" }}>Ano: {anoSelected}</th>
                        <th></th>
                      </tr>
                      <tr>
                        <td>CB001</td>
                        <td>
                          Existe alguma forma de cobrança pelos serviços de
                          drenagem e manejo das APU
                        </td>
                        <td>
                          <select {...register("CB001")}>
                            <option value="">{dadosFinanceiros?.cb001}</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                          </select>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>CB002</td>
                        <td>Qual é a forma de cobrança adotada?</td>
                        <td>
                          <select {...register("CB002")}>
                            <option value="">
                              {dadosFinanceiros?.cb002
                                ? dadosFinanceiros?.cb002
                                : "Opções"}
                            </option>
                            <option value="Cobrança de taxa específica">
                              Cobrança de taxa específica
                            </option>
                            <option value="Cobrança de tarifa">
                              Cobrança de tarifa
                            </option>
                            <option value="Outra">Outra</option>
                          </select>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>CB002A</td>
                        <td>Especifique qual é a forma de cobrança adotada</td>
                        <td>
                          <input
                            {...register("CB002A")}
                            type="text"
                            defaultValue={dadosFinanceiros?.cb002a}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>CB003</td>
                        <td>
                          Quantidade total de imóveis urbanos tributados pelos
                          serviços de drenagem das APU
                        </td>
                        <td>
                          <input
                            {...register("CB003")}
                            type="text"
                            defaultValue={dadosFinanceiros?.cb003}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>Imóveis</td>
                      </tr>
                      <tr>
                        <td>CB004</td>
                        <td>
                          Valor cobrado pelos serviços de Drenagem e Manejo das
                          APU por ímovel urbano
                        </td>
                        <td>
                          <input
                            {...register("CB004")}
                            type="text"
                            defaultValue={dadosFinanceiros?.cb004}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/unid./mês</td>
                      </tr>
                      <tr>
                        <td>CB999</td>
                        <td>Observações, esclarecimentos ou sugestões</td>
                        <td colSpan={2}>
                          <textarea
                            {...register("CB999")}
                            defaultValue={dadosFinanceiros?.cb999}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          />  
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <InputGG></InputGG>
                </DivFormConteudo>

                <DivFormConteudo active={activeForm === "receitas"}>
                  <DivTitulo>
                    <DivTituloConteudo>Receitas</DivTituloConteudo>
                  </DivTitulo>
                  <table>
                    <tbody>
                      <tr>
                        <th style={{ width: "120px" }}>Código SNIS</th>
                        <th>Descrição</th>
                        <th style={{ width: "100px" }}>Ano: {anoSelected}</th>
                        <th></th>
                      </tr>
                      <tr>
                        <td>FN003</td>
                        <td>
                          Receita total (Saúde, Educação, Pagamento de pessoal,
                          etc...)
                        </td>
                        <td>
                          <input
                            {...register("FN003")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn003}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN004</td>
                        <td>
                          Fontes de recursos para custeio dos serviços de
                          drenagem e manejo de APU
                        </td>
                        <td colSpan={2}>
                          <select {...register("FN004")}>
                            <option value="">
                              {dadosFinanceiros?.dap_fn004}
                            </option>
                            <option value="Não existe forma de custeio">
                              Não existe forma de custeio
                            </option>
                            <option value="Receitas de taxas">
                              Receitas de taxas
                            </option>
                            <option value="Receitas de contribuição de melhoria">
                              Receitas de contribuição de melhoria
                            </option>
                            <option value="Recursos do orçamento geral do município">
                              Recursos do orçamento geral do município
                            </option>
                            <option value="Outra">Outra</option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <td>FN004A</td>
                        <td>
                          Especifique qual é a outra fonte de recursos para
                          custeio dos serviços
                        </td>
                        <td>
                          <input
                            {...register("FN004A")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn004a}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>FN005</td>
                        <td>
                          Receita operacional total dos serviços de drenagem e
                          manejo de APU
                        </td>
                        <td>
                          <input
                            {...register("FN005")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn005}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN008</td>
                        <td>
                          Receita não operacional total dos serviços de drenagem
                          e manejo de APU
                        </td>
                        <td>
                          <input
                            {...register("FN008")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn008}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN009</td>
                        <td>
                          Receita total serviços de drenagem e manejo de APU
                        </td>
                        <td>
                          <input
                            {...register("FN009")}
                            type="text"
                            disabled={true}
                            defaultValue={dadosFinanceiros?.fn009}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                    </tbody>
                  </table>
                </DivFormConteudo>

                <DivFormConteudo active={activeForm === "despesas"}>
                  <DivTitulo>
                    <DivTituloConteudo>Despesas</DivTituloConteudo>
                  </DivTitulo>
                  <table>
                    <tbody>
                      <tr>
                        <th>Código SNIS</th>
                        <th>Descrição</th>
                        <th>Ano: {anoSelected}</th>
                        <th></th>
                      </tr>
                      <tr>
                        <td>FN012</td>
                        <td>
                          Despesa total do município (Saúde, Educação, pagamento
                          de pessoal, etc...)
                        </td>
                        <td>
                          <input
                            {...register("FN012")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn012}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN013</td>
                        <td>
                          Despesas de Exploração(DEX) diretas ou de custeio
                          total dos serviços de Drenagem e Manejo de APU
                        </td>
                        <td>
                          <input
                            {...register("FN013")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn013}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN015</td>
                        <td>
                          Despesa total com serviço da dívida para os serviços
                          de drenagem e Manejo de APU
                        </td>
                        <td>
                          <input
                            {...register("FN015")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn015}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN016</td>
                        <td>
                          Despesa total com serviços de Drenagem e Manejo de APU
                        </td>
                        <td>
                          <input
                            {...register("FN016")}
                            type="text"
                            disabled={true}
                            defaultValue={dadosFinanceiros?.dap_fn016}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                    </tbody>
                  </table>
                </DivFormConteudo>

                <DivFormConteudo
                  active={activeForm === "investimentoDesembolsos"}
                >
                  <DivTitulo>
                    <DivTituloConteudo>
                      Investimentos e desembolsos
                    </DivTituloConteudo>
                  </DivTitulo>
                  <table>
                    <tbody>
                      <tr>
                        <th style={{ width: "120px" }}>Código SNIS</th>
                        <th>Descrição</th>
                        <th>Ano: {anoSelected}</th>
                        <th></th>
                      </tr>

                      <tr>
                        <td>FN024</td>
                        <td>
                          Investimento com recursos próprios em Drenagem e
                          Manejo das APU contratados pelo município no ano de
                          referência
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...register("FN024")}
                              type="text"
                              defaultValue={dadosFinanceiros?.fn024}
                              onChange={handleOnChange}
                              onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            ></input>
                          </InputP>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN018</td>
                        <td>
                          Investimento com recursos onerosos em Drenagem e
                          Manejo das APU contratados pelo município no ano de
                          referência
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...register("FN018")}
                              type="text"
                              defaultValue={dadosFinanceiros?.fn018}
                              onChange={handleOnChange}
                              onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            ></input>
                          </InputP>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN020</td>
                        <td>
                          Investimento com recursos não onerosos em Drenagem e
                          Manejo das APU contratados pelo município no ano de
                          referência
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...register("FN020")}
                              type="text"
                              defaultValue={dadosFinanceiros?.fn020}
                              onChange={handleOnChange}
                              onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            ></input>
                          </InputP>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN022</td>
                        <td>
                          Investimento total em Drenagem das APU contratado pelo
                          município no ano de referência
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...register("FN022")}
                              type="text"
                              defaultValue={dadosFinanceiros?.fn022}
                              onChange={handleOnChange}
                              onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            ></input>
                          </InputP>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN017</td>
                        <td>
                          Desembolsos de investimentos com recursos próprios em
                          Drenagem e Manejo das APU realizados pelo Município no
                          ano de referência
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...register("FN017")}
                              type="text"
                              defaultValue={dadosFinanceiros?.fn017}
                              onChange={handleOnChange}
                              onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            ></input>
                          </InputP>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN019</td>
                        <td>
                          Desembolsos de investimentos com recursos onerosos em
                          Drenagem e Manejo das APU realizados pelo Município no
                          ano de referência
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...register("FN019")}
                              type="text"
                              defaultValue={dadosFinanceiros?.fn019}
                              onChange={handleOnChange}
                              onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            ></input>
                          </InputP>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN021</td>
                        <td>
                          Desembolsos de investimentos com recursos não onerosos
                          em Drenagem e Manejo das APU realizados pelo Município
                          no ano de referência
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...register("FN021")}
                              type="text"
                              defaultValue={dadosFinanceiros?.fn021}
                              onChange={handleOnChange}
                            ></input>
                          </InputP>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN023</td>
                        <td>
                          Desembolsos total de investimentos em Drenagem e
                          Manejo das APU realizados pelo Município no ano de
                          referência
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...register("FN023")}
                              type="text"
                              defaultValue={dadosFinanceiros?.fn023}
                              disabled
                              onChange={handleOnChange}
                            ></input>
                          </InputP>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                    </tbody>
                  </table>
                </DivFormConteudo>

                <DivFormConteudo active={activeForm === "observacoes2"}>
                  <DivTitulo>
                    <DivTituloConteudo>
                      Observações, esclarecimentos ou sugestões
                    </DivTituloConteudo>
                  </DivTitulo>
                  <table>
                    <tbody>
                      <tr>
                        <th>Código SNIS</th>
                        <th>Descrição</th>
                        <th>Ano: {anoSelected}</th>
                      </tr>
                      <tr>
                        <td>FN999</td>
                        <td>Observações, esclarecimentos ou sugestões</td>
                        <td>
                          <textarea
                            {...register("DRENAGEM_FN999")}
                            defaultValue={dadosFinanceiros?.drenagem_fn999}
                            onChange={handleOnChange}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </DivFormConteudo>

                {/* Resíduos Sólidos */}

                <DivFormConteudo active={activeForm === "cobranca2"}>
                  <DivTitulo>
                    <DivTituloConteudo>Cobrança</DivTituloConteudo>
                  </DivTitulo>
                  <table>
                    <tbody>
                      <tr>
                        <th style={{ width: "120px" }}>Código SNIS</th>
                        <th>Descrição</th>
                        <th>Ano: {anoSelected}</th>
                        <th></th>
                      </tr>
                      <tr>
                        <td>FN201</td>
                        <td>
                          A prefeitura (prestadora) cobra pelos serviços de
                          coleta regular, transporte e destinação final de RSU?
                        </td>
                        <td>
                          <select {...register("FN201")} name="FN201">
                            <option value="">{dadosFinanceiros?.fn201}</option>
                            <option>Sim</option>
                            <option>Não</option>
                          </select>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>FN202</td>
                        <td>Principal forma adotada</td>
                        <td>
                          <select {...register("FN202")}>
                            <option value="">{dadosFinanceiros?.fn202}</option>
                            <option value="Taxa específica no boleto do IPTU">
                              Taxa específica no boleto do IPTU
                            </option>
                            <option value="Taxa em boleto exclusivo">
                              Taxa em boleto exclusivo
                            </option>
                            <option value="Tarifa">Tarifa</option>
                            <option value="Taxa específica no boleto de água">
                              Taxa específica no boleto de água
                            </option>
                            <option value="outra forma.">outra forma.</option>
                          </select>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>FN203</td>
                        <td>Descrição da outra forma adotada</td>
                        <td>
                          <input
                            {...register("FN203")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn203}
                            onChange={handleOnChange}
                          ></input>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>FN204</td>
                        <td>
                          Unidade adotada para a cobrança (No caso de tarifa)
                        </td>
                        <td>
                          <select {...register("FN204")}>
                            <option value="">{dadosFinanceiros?.fn204}</option>
                            <option value="Peso">Peso</option>
                            <option value="Volume">Volume</option>
                          </select>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>FN205</td>
                        <td>
                          A prefeitura cobra pela prestação de serviços
                          especiais ou eventuais de manejo de RSU?
                        </td>
                        <td>
                          <select {...register("FN205")}>
                            <option value="">{dadosFinanceiros?.fn205}</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                          </select>
                        </td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </DivFormConteudo>
                <DivFormConteudo active={activeForm === "despesas2"}>
                  <DivTitulo>
                    <DivTituloConteudo>Despesas</DivTituloConteudo>
                  </DivTitulo>
                  <table>
                    <tbody>
                      <tr>
                        <th style={{ width: "120px" }}>Código SNIS</th>
                        <th>Descrição</th>
                        <th>Ano: {anoSelected}</th>
                        <th></th>
                      </tr>
                      <tr>
                        <td>FN206</td>
                        <td>
                          Despesa dos agentes públicos com o serviço de coleta
                          de RDO e RPU
                        </td>
                        <td>
                          <input
                            {...register("FN206")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn206}
                            onChange={handleOnChange}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN207</td>
                        <td>
                          Despesa com agentes privados para execução do serviço
                          de coleta de RDO e RPU
                        </td>
                        <td>
                          <input
                            {...register("FN207")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn207}
                            onChange={handleOnChange}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN208</td>
                        <td>Despesa com o serviço de coleta de RDO e RPU</td>
                        <td>
                          <input
                            {...register("FN208")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn208}
                            onChange={handleOnChange}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN209</td>
                        <td>Despesa com agentes públicos com a coleta RSS</td>
                        <td>
                          <input
                            {...register("FN209")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn209}
                            onChange={handleOnChange}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN210</td>
                        <td>
                          Despesa com empresas contratadas para coleta RSS
                        </td>
                        <td>
                          <input
                            {...register("FN210")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn210}
                            onChange={handleOnChange}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN211</td>
                        <td>Despesa total com a coleta RSS</td>
                        <td>
                          <input
                            {...register("FN211")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn211}
                            onChange={handleOnChange}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN212</td>
                        <td>
                          Despesa dos agentes públicos com o serviço de varrição
                        </td>
                        <td>
                          <input
                            {...register("FN212")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn212}
                            onChange={handleOnChange}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN213</td>
                        <td>
                          Despesa com empresas contratadas para o serviço de
                          varrição
                        </td>
                        <td>
                          <input
                            {...register("FN213")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn213}
                            onChange={handleOnChange}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN214</td>
                        <td>Despesa total com serviços de varrição</td>
                        <td>
                          <input
                            {...register("FN214")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn214}
                            onChange={handleOnChange}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN215</td>
                        <td>
                          Despesas com agentes públicos executores dos demais
                          serviços quando não especificado sem campo próprio
                        </td>
                        <td>
                          <input
                            {...register("FN215")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn215}
                            onChange={handleOnChange}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN216</td>
                        <td>
                          Despesas com agentes privados executores dos demais
                          serviços quando não especificado sem campo próprio
                        </td>
                        <td>
                          <input
                            {...register("FN216")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn216}
                            onChange={handleOnChange}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN217</td>
                        <td>
                          Despesas total com todos os agentes executores dos
                          demais serviços quando não especificado sem campo
                          próprio
                        </td>
                        <td>
                          <input
                            {...register("FN217")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn217}
                            onChange={handleOnChange}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN218</td>
                        <td>
                          Despesa dos agentes públicos executores de serviços de
                          manejo de RSU
                        </td>
                        <td>
                          <input
                            {...register("FN218")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn218}
                            onChange={handleOnChange}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN219</td>
                        <td>
                          Despesa dos agentes privados executores de serviços de
                          manejo de RSU
                        </td>
                        <td>
                          <input
                            {...register("FN219")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn219}
                            onChange={handleOnChange}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN220</td>
                        <td>Despesa total com os serviços de manejo de RSU</td>
                        <td>
                          <input
                            {...register("FN220")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn220}
                            onChange={handleOnChange}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN223</td>
                        <td>
                          Despesa corrente da prefeitura durante o ano com todos
                          os serviços do município (Saúde, educação, pagamento
                          de pessoal, etc...)
                        </td>
                        <td>
                          <input
                            {...register("FN223")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn223}
                            onChange={handleOnChange}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                    </tbody>
                  </table>
                </DivFormConteudo>

                <DivFormConteudo active={activeForm === "receitas2"}>
                  <DivTitulo>
                    <DivTituloConteudo>Receitas</DivTituloConteudo>
                  </DivTitulo>
                  <table>
                    <tbody>
                      <tr>
                        <th style={{ width: "120px" }}>Código SNIS</th>
                        <th>Descrição</th>
                        <th>Ano: {anoSelected}</th>
                        <th></th>
                      </tr>
                      <tr>
                        <td>FN221</td>
                        <td>
                          Receita orçada com a cobrança de taxas e tarifas
                          referentes á getão e manejo de RSU
                        </td>
                        <td>
                          <input
                            {...register("FN221")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn221}
                            onChange={handleOnChange}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                      <tr>
                        <td>FN222</td>
                        <td>
                          Receita arrecadada com taxas e tarifas referentes à
                          gestão e manejo de RSU
                        </td>
                        <td>
                          <input
                            {...register("FN222")}
                            type="text"
                            defaultValue={dadosFinanceiros?.fn222}
                            onChange={handleOnChange}
                          ></input>
                        </td>
                        <td>R$/ano</td>
                      </tr>
                    </tbody>
                  </table>
                </DivFormConteudo>

                <DivFormConteudo active={activeForm === "investimentoUniao"}>
                  <DivTitulo>
                    <DivTituloConteudo>
                      Investimentos da União
                    </DivTituloConteudo>
                  </DivTitulo>

                  <table>
                    <tbody>
                      <tr>
                        <th style={{ width: "120px" }}>Código SNIS</th>
                        <th>Descrição</th>
                        <th style={{ width: "100px" }}>Ano: {anoSelected}</th>
                        <th></th>
                      </tr>
                      <tr>
                        <td>FN224</td>
                        <td>
                          A prefeitura recebeu algum recurso federal para
                          aplicação no setor de manejo de RSU?
                        </td>
                        <td>
                          <InputP>
                            {" "}
                            <select {...register("FN224")}>
                              <option value="">
                                {dadosFinanceiros?.fn224}
                              </option>
                              <option value="Sim">Sim</option>
                              <option value="Não">Não</option>
                            </select>
                          </InputP>
                        </td>
                      </tr>
                      <tr>
                        <td>FN225</td>
                        <td>Valor repassado</td>
                        <td>
                          <InputP>
                            <input
                              {...register("FN225")}
                              type="text"
                              defaultValue={dadosFinanceiros?.fn225}
                              onChange={handleOnChange}
                              onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            ></input>
                          </InputP>
                        </td>
                        <td>R$</td>
                      </tr>
                      <tr>
                        <td>FN226</td>
                        <td>Tipo de recurso</td>
                        <td>
                          <InputP>
                            <select {...register("FN226")}>
                              <option value="">
                                {dadosFinanceiros?.fn226}
                              </option>
                              <option value="Oneroso">Oneroso</option>
                              <option value="Não oneroso">Não oneroso</option>
                            </select>
                          </InputP>
                        </td>
                      </tr>
                      <tr>
                        <td>FN227</td>
                        <td>Em que foi aplicado o recurso?</td>
                        <td colSpan={4}>
                          <textarea
                            {...register("FN227")}
                            defaultValue={dadosFinanceiros?.fn227}
                            onChange={handleOnChange}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </DivFormConteudo>

                <DivFormConteudo active={activeForm === "observacoes3"}>
                  <DivTitulo>
                    <DivTituloConteudo>
                      Observações, esclarecimentos ou sugestões
                    </DivTituloConteudo>
                  </DivTitulo>

                  <table>
                    <tbody>
                      <tr>
                        <th>Código SNIS</th>
                        <th>Descrição</th>
                        <th>Ano: {anoSelected}</th>

                        <th></th>
                      </tr>

                      <tr>
                        <td>FN999</td>
                        <td>Observações, esclarecimentos ou sugestões</td>
                        <td colSpan={4}>
                          <textarea
                            {...register("RESIDUOS_FN999")}
                            defaultValue={dadosFinanceiros?.residuos_fn999}
                            onChange={handleOnChange}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <table></table>
                </DivFormConteudo>
                 {anoSelected && isEditor && (
              <SubmitButton type="submit">Gravar</SubmitButton>
            )}
              </DivFormEixo>
            </DivForm>

           
          </Form>
        </DivCenter>
      </MainContent>
    </Container>
  );
}
