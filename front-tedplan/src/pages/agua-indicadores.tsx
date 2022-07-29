import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import {
  Container,
  DivCenter,
  DivForm,
  DivTituloForm,
  DivInput,
  Form,
  InputP,
  InputM,
  InputG,
  SubmitButton,
  DivEixo,
  TextArea,
  DivTextArea,
  MenuMunicipio,
  Municipio,
  MenuMunicipioItem,
  DivTitulo,
  DivFormEixo,
  DivTituloEixo,
  DivFormConteudo,
  DivTituloConteudo,
  InputGG,
  DivSeparadora,
  InputSNIS,
  InputXL,
} from "../../styles/financeiro";
import HeadIndicadores from "../../components/headIndicadores";
import dynamic from "next/dynamic";
import "suneditor/dist/css/suneditor.min.css";
import { getAPIClient } from "../../services/axios";
import MenuIndicadores from "../../components/MenuIndicadores";
import { parseCookies } from "nookies";
import { GetServerSideProps } from "next";
import Router from "next/router";
import { AuthContext } from "../../contexts/AuthContext";

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
  const [isMunicipio, setMunicipio] = useState<IMunicipio | any>(municipio);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [contentForEditor, setContentForEditor] = useState(null);
  const [contentSR, setContentSR] = useState("");
  const [contentCTNC, setContentCTNC] = useState("");
  const [contentCTD, setContentCTD] = useState("");
  const editor = useRef();
  const firstRender = useRef(true);
  const editorContent = useMemo(() => contentForEditor, [contentForEditor]);

  const getSunEditorInstance = (sunEditor) => {
    editor.current = sunEditor;
  };

  useEffect(() => {}, [municipio]);

  const setOptions = {
    attributesWhitelist: {
      all: "data-id|data-type",
    },
    defaultTag: "p",
  };

  function handleOnChangeSR(contentSR) {
    setContentSR(contentSR);
  }
  function handleOnChangeCTNC(contentCTNC) {
    setContentCTNC(contentCTNC);
  }
  function handleOnChangeCTD(contentCTD) {
    setContentCTD(contentCTD);
  }

  function handleCadastro(data) {
    const formData = new FormData();

    formData.append("ga_cargo", data.ga_cargo);
    formData.append("ga_email", data.ga_email);
    formData.append("ga_telefone", data.ga_telefone);
    formData.append("ga_nome_representante", data.ga_nome_representante);
    formData.append("nome_associacao", data.nome_associacao);
    formData.append("norma_associacao", data.norma_associacao);
    formData.append("pcs_ano", data.pcs_ano);
    formData.append("pcs_arquivo", data.pcs_arquivo[0]);
    formData.append("pcs_titulo", data.pcs_titulo);
    formData.append("plano_ano", data.plano_ano);
    formData.append("plano_arquivo", data.plano_arquivo[0]);
    formData.append("plano_titulo", data.plano_titulo);
    formData.append("politica_ano", data.politica_ano);
    formData.append("politica_arquivo", data.politica_arquivo[0]);
    formData.append("politica_titulo", data.politica_titulo);
    formData.append("sr_descricao", contentSR);
    formData.append("ct_nomes_comunidades", contentCTNC);
    formData.append("ct_descricao", contentCTD);

    const apiClient = getAPIClient();
    const resCad = apiClient
      .post("addGestaoIndicadores", formData, {
        headers: {
          "Content-Type": `multipart/form-data=${formData}`,
        },
      })
      .then((response) => {
        console.log(response);
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function handleSignOut() {
    signOut();
  }
  function handleHome() {
    Router.push("/indicadores/home_indicadores");
  }
  function handleGestao() {
    Router.push("/indicadores/gestao");
  }
  function handleIndicadores() {
    Router.push("/indicadores/gestao");
  }
  function handleReporte() {
    Router.push("/indicadores/gestao");
  }

  return (
    <Container>
      <HeadIndicadores usuarios={[]}></HeadIndicadores>
      <MenuMunicipio>
        <Municipio>Municipio: {}</Municipio>
        <MenuMunicipioItem>
          <ul>
            <li onClick={handleHome}>Home</li>
            <li onClick={handleGestao}>Gestão</li>
            <li onClick={handleIndicadores}>Indicadores</li>
            <li onClick={handleReporte}>Reporte</li>
            <li onClick={handleSignOut}>Sair</li>
          </ul>
        </MenuMunicipioItem>
      </MenuMunicipio>
      <MenuIndicadores></MenuIndicadores>
      <DivCenter>
        <Form onSubmit={handleSubmit(handleCadastro)}>
          <DivForm>
            <DivTituloForm>Água</DivTituloForm>          
             
              <DivFormConteudo>
                <DivTitulo>
                  <DivTituloConteudo>Ligações e economias</DivTituloConteudo>
                </DivTitulo>
                <InputSNIS>
                  <label>Código SNIS</label>
                  <p>AG021</p>
                  <p>AG002</p>
                  <p>AG004</p>
                  <p>AG003</p>
                  <p>AG014</p>
                  <p>AG013</p>
                  <p>AG022</p>
                </InputSNIS>
                <InputGG>
                  <label>Descrição</label>
                  <p>Quantidade de ligações totais de água</p>
                  <p>Quantidade de ligações ativas de água</p>
                  <p>Quantidade de ligações ativas de água micromedidas</p>
                  <p>Quantidade de economias ativas de água</p>
                  <p>Quantidade de economias ativas de água micromedidas</p>
                  <p>Quantidade de economias residenciais ativas de água</p>
                  <p>Quantidade de economias residenciais ativas de água micromedidas</p>
                </InputGG>
                <InputP>
                  <label>Ano: 2021</label>
                  <input type="text"></input>
                  <input type="text"></input>
                  <input type="text"></input>
                  <input type="text"></input>
                  <input type="text"></input>
                  <input type="text"></input>
                  <input type="text"></input>
                </InputP>
                <InputP>
                  <label>Ano: 2022</label>
                  <input {...register("AG021")} type="text"></input>
                  <input {...register("AG002")} type="text"></input>
                  <input {...register("AG004")} type="text"></input>
                  <input {...register("AG003")} type="text"></input>
                  <input {...register("AG014")} type="text"></input>
                  <input {...register("AG013")} type="text"></input>
                  <input {...register("AG022")} type="text"></input>
                </InputP>
                <InputSNIS>
                  <label>.</label>
                  <p>ligação</p>
                  <p>ligação</p>
                  <p>ligação</p>
                  <p>economia</p>
                  <p>economia</p>
                  <p>economia</p>
                  <p>economia</p>
                </InputSNIS>
              </DivFormConteudo>
              
              <DivFormConteudo>
                <DivTitulo>
                  <DivTituloConteudo>Volumes</DivTituloConteudo>
                </DivTitulo>
                <InputSNIS>
                  <label>Código SNIS</label>
                  <p>AG006</p>
                  <p>AG024</p>
                  <p>AG016</p>
                  <p>AG018</p>
                  <p>AG017</p>
                  <p>AG019</p>
                  <p>AG007</p>
                  <p>AG015</p>
                  <p>AG027</p>
                  <p>AG012</p>
                  <p>AG008</p>
                  <p>AG010</p>
                  <p>AG011</p>
                  <p>AG020</p>
                  
                </InputSNIS>
                <InputGG>
                  <label>Descrição</label>
                  <p>Volume de água produzido</p>
                  <p>Volume de água de serviço</p>
                  <p>Volume de água bruta importado</p>
                  <p>Volume de água tratada importado</p>
                  <p>Volume de água bruta exportado</p>
                  <p>Volume de água tratada exportado</p>
                  <p>Volume de água tratada em ETA(s)</p>
                  <p>Volume de água de água tratada por simples desinfecção</p>
                  <p>Volume de água fluoretada</p>
                  <p>Volume de água macromedida</p>
                  <p>Volume de água micromedida</p>
                  <p>Volume de água consumido</p>
                  <p>Volume de água faturado</p>
                  <p>Volume micromedido nas economias residenciais de água</p>
                </InputGG>
                <InputP>
                  <label>Ano: 2021</label>
                  <input type="text"></input>
                  <input type="text"></input>
                  <input type="text"></input>
                  <input type="text"></input>
                  <input type="text"></input>
                  <input type="text"></input>
                  <input type="text"></input>
                  <input type="text"></input>
                  <input type="text"></input>
                  <input type="text"></input>
                  <input type="text"></input>
                  <input type="text"></input>
                  <input type="text"></input>
                  <input type="text"></input>
                 
                </InputP>
                <InputP>
                  <label>Ano: 2022</label>
                  <input {...register("AG006")} type="text"></input>
                  <input {...register("AG024")} type="text"></input>
                  <input {...register("AG016")} type="text"></input>
                  <input {...register("AG018")} type="text"></input>
                  <input {...register("AG017")} type="text"></input>
                  <input {...register("AG019")} type="text"></input>
                  <input {...register("AG007")} type="text"></input>
                  <input {...register("AG015")} type="text"></input>
                  <input {...register("AG027")} type="text"></input>
                  <input {...register("AG012")} type="text"></input>
                  <input {...register("AG008")} type="text"></input>
                  <input {...register("AG010")} type="text"></input>
                  <input {...register("AG011")} type="text"></input>
                  <input {...register("AG020")} type="text"></input>
                 
                </InputP>
                <InputSNIS>
                  <label>.</label>
                  <p>1.000m³/ano</p>
                  <p>1.000m³/ano</p>
                  <p>1.000m³/ano</p>
                  <p>1.000m³/ano</p>
                  <p>1.000m³/ano</p>
                  <p>1.000m³/ano</p>
                  <p>1.000m³/ano</p>
                  <p>1.000m³/ano</p>
                  <p>1.000m³/ano</p>
                  <p>1.000m³/ano</p>
                  <p>1.000m³/ano</p>
                  <p>1.000m³/ano</p>
                  <p>1.000m³/ano</p>
                  <p>1.000m³/ano</p>
                
                </InputSNIS>
              </DivFormConteudo>

              <DivFormConteudo>
                <DivTitulo>
                  <DivTituloConteudo>
                    Extenção da rede
                  </DivTituloConteudo>
                </DivTitulo>
                <InputSNIS>
                  <label>Código SNIS</label>
                  <p>AG005</p>
                </InputSNIS>
                <InputGG>
                  <label>Descrição</label>
                  <p>Extenção da rede de água</p>
                </InputGG>
                <InputP>
                  <label>Ano: 2021</label>
                  <input type="text"></input>
                </InputP>
                <InputP>
                  <label>Ano: 2022</label>
                  <input {...register("AG005")} type="text"></input>
                </InputP>
                <InputSNIS>
                  <label>.</label>
                  <p>KM</p>
                </InputSNIS>
              </DivFormConteudo>

              <DivFormConteudo>
                <DivTitulo>
                  <DivTituloConteudo>
                    Consumo de energia elétrica
                  </DivTituloConteudo>
                </DivTitulo>
                <InputSNIS>
                  <label>Código SNIS</label>
                  <p>AG028</p>
                </InputSNIS>
                <InputGG>
                  <label>Descrição</label>
                  <p>Consumo total de energia elétrica nos sistemas de água</p>
                </InputGG>
               
                <InputP>
                  <label>Ano: 2022</label>
                  <input {...register("AG028")} type="text"></input>
                </InputP>
                <InputSNIS>
                  <label>.</label>
                  <p>1.000kWh/ano</p>
                </InputSNIS>
              </DivFormConteudo>

             

             <DivFormConteudo>
                <DivTitulo>
                  <DivTituloConteudo>
                    Observações, esclarecimentos ou sugestões
                  </DivTituloConteudo>
                </DivTitulo>
                <InputSNIS>
                  <label>Código SNIS</label>
                  <p>AG098</p>
                  <p></p>
                  <p></p>
                  <p></p>
                  <p></p>
                  <p></p>
                  <p>AG099</p>
                </InputSNIS>
                <InputM>
                  <label>Descrição</label>
                  <p>Campo de justificativa</p>
                  <p></p>
                  <p></p>
                  <p></p>
                  <p></p>
                  <p></p>
                  <p>Observações</p>
                </InputM>

                <InputG>
                  <label>Ano: 2022</label>
                  <textarea {...register("AG098")} />
                  <textarea {...register("AG099")}></textarea>
                </InputG>
              </DivFormConteudo>
          

          </DivForm>

          <SubmitButton type="submit">Gravar</SubmitButton>
        </Form>
      </DivCenter>
    </Container>
  );
}
/*
export const getServerSideProps: GetServerSideProps<MunicipioProps> = async (
  ctx
) => {
  const apiClient = getAPIClient(ctx);
  const { ["tedplan.token"]: token } = parseCookies(ctx);
  const { ["tedplan.id_usuario"]: id_usuario } = parseCookies(ctx);
 
  if (!token) {
    return {
      redirect: {
        destination: "/login_indicadores",
        permanent: false,
      },
    };
  }

  const resUsuario = await apiClient.get("getUsuario", {
    params: { id_usuario: '1' },
  });
  const usuario = await resUsuario.data;

  const res = await apiClient.get("getMunicipio", {
    params: { id_municipio: usuario[0].id_municipio },
  });
  const municipio = await res.data;

  return {
    props: {
      municipio,
    },
  };
};
*/
