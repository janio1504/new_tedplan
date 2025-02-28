/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import {
  Container,
  DivInput,
  Form,
  InputP,
  InputM,
  DivEixo,
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

import {
  DivCenter,  
  DivForm,
  DivFormCadastro,
  DivTituloForm,
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

import HeadIndicadores from "../../components/headIndicadores";
import { toast, ToastContainer } from "react-nextjs-toast";
import "suneditor/dist/css/suneditor.min.css";
import { getAPIClient } from "../../services/axios";
import MenuIndicadores from "../../components/MenuIndicadores";
import { parseCookies } from "nookies";
import { GetServerSideProps } from "next";
import Router from "next/router";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../services/api";
import MenuHorizontal from "../../components/MenuHorizontal";
import MenuIndicadoresCadastro from "../../components/MenuIndicadoresCadastro";
import { anosSelect } from "../../util/util";
interface IMunicipio {
  id_municipio: string;
  municipio_codigo_ibge: string;
  municipio_nome: string;
}

interface MunicipioProps {
  municipio: IMunicipio[];
}

export default function Balanco({ municipio }: MunicipioProps) {
  const { usuario, signOut } = useContext(AuthContext);
  const [isMunicipio, setMunicipio] = useState<IMunicipio | any>(municipio);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [dadosBalanco, setDadosBalanco] = useState(null);
  const [content, setContent] = useState("");
  const [dadosMunicipio, setDadosMunicipio] = useState<IMunicipio>(null);

  useEffect(() => {
    getMunicipio()
  }, [municipio]);
 

  function handleOnChange(content) {
    setContent(content);
  }

  async function getMunicipio() {
    const res = await api
      .get("getMunicipio", {
        params: { id_municipio: usuario.id_municipio },
      })
      .then((response) => {
        const res = response.data;       
        setDadosMunicipio(res[0]);
      });
  }

  async function handleCadastro(data) {

    if(usuario?.id_permissao === 4){
      return
    }

    data.id_balanco = dadosBalanco?.id_balanco;
    data.id_municipio = usuario?.id_municipio;
    data.ano = anoSelected;
    const resCad = await api
      .post("create-balanco", data)
      .then((response) => {
        toast.notify("Dados gravados com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    getDadosBalanco(anoSelected);
  }

  async function getDadosBalanco(ano) {
    const id_municipio = usuario.id_municipio;
    const res = await api
      .post("get-balanco", { id_municipio: id_municipio, ano: ano })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });

    setDadosBalanco(res[0]);
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

  const [anoSelected, setAnoSelected] = useState(null);

  function seletcAno(ano: any) {
    setAnoSelected(ano);
    getDadosBalanco(ano);
  }

  return (
    <Container>
      <ToastContainer></ToastContainer>
      <HeadIndicadores usuarios={[]}></HeadIndicadores>
      <MenuHorizontal municipio={dadosMunicipio?.municipio_nome}></MenuHorizontal>
      <MenuIndicadoresCadastro></MenuIndicadoresCadastro>
      <DivCenter>
        <Form onSubmit={handleSubmit(handleCadastro)}>
          <DivForm>
            <DivTituloForm>Balanço</DivTituloForm>
            <DivFormEixo>
              <DivFormConteudo>
                <DivTitulo>
                  <DivTituloConteudo>Ano</DivTituloConteudo>
                </DivTitulo>
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
              </DivFormConteudo>
            </DivFormEixo>
            <DivFormEixo>
            <DivFormConteudo>
              <DivTitulo>
                <DivTituloConteudo>Água e Esgoto Sanitário</DivTituloConteudo>
              </DivTitulo>

              <table>
              <tbody>
                  <tr>
                    <th>Código SNIS</th>
                    <th>Descrição</th>
                    <th>Ano {anoSelected}</th>
                  </tr>              
                  <tr>
                    <td>
                      <InputSNIS>BL002</InputSNIS>
                    </td>
                    <td>
                      <InputG>Ativo total</InputG>
                    </td>
                    <td>
                      <InputP>
                        <input
                          {...register("BL002")}
                          defaultValue={dadosBalanco?.bl002}
                          onChange={handleOnChange}
                          type="text"
                        ></input>
                      </InputP>
                    </td>
                    <td>1000 R$/ano</td>
                  </tr>
                  <tr>
                    <td>
                      <InputSNIS>BL001</InputSNIS>
                    </td>
                    <td>
                      <InputG>Ativo circulante</InputG>
                    </td>
                    <td>
                      <InputP>
                        <input
                          {...register("BL001")}
                          defaultValue={dadosBalanco?.bl001}
                          onChange={handleOnChange}
                          type="text"
                        ></input>
                      </InputP>
                    </td>
                    <td>1000 R$/ano</td>
                  </tr>
                  <tr>
                    <td>
                      <InputSNIS>BL010</InputSNIS>
                    </td>
                    <td>
                      <InputG>Realizável a longo prazo</InputG>
                    </td>
                    <td>
                      <InputP>
                        <input
                          {...register("BL010")}
                          defaultValue={dadosBalanco?.bl010}
                          onChange={handleOnChange}
                          type="text"
                        ></input>
                      </InputP>
                    </td>
                    <td>1000 R$/ano</td>
                  </tr>
                  <tr>
                    <td>
                      <InputSNIS>BL005</InputSNIS>
                    </td>
                    <td>
                      <InputG>Passivo circulante</InputG>
                    </td>
                    <td>
                      <InputP>
                        <input
                          {...register("BL005")}
                          defaultValue={dadosBalanco?.bl005}
                          onChange={handleOnChange}
                          type="text"
                        ></input>
                      </InputP>
                    </td>
                    <td>1000 R$/ano</td>
                  </tr>
                  <tr>
                    <td>
                      <InputSNIS>BL003</InputSNIS>
                    </td>
                    <td>
                      <InputG>Exigível a longo prazo</InputG>
                    </td>
                    <td>
                      <InputP>
                        <input
                          {...register("BL003")}
                          defaultValue={dadosBalanco?.bl003}
                          onChange={handleOnChange}
                          type="text"
                        ></input>
                      </InputP>
                    </td>
                    <td>1000 R$/ano</td>
                  </tr>
                  <tr>
                    <td>
                      <InputSNIS>BL008</InputSNIS>
                    </td>
                    <td>
                      <InputG>Resultado de exercícios futuros</InputG>
                    </td>
                    <td>
                      <InputP>
                        <input
                          {...register("BL008")}
                          defaultValue={dadosBalanco?.bl008}
                          onChange={handleOnChange}
                          type="text"
                        ></input>
                      </InputP>
                    </td>
                    <td>1000 R$/ano</td>
                  </tr>
                  <tr>
                    <td>
                      <InputSNIS>BL006</InputSNIS>
                    </td>
                    <td>
                      <InputG>Patrimônio líquido</InputG>
                    </td>
                    <td>
                      <InputP>
                        <input
                          {...register("BL006")}
                          defaultValue={dadosBalanco?.bl006}
                          onChange={handleOnChange}
                          type="text"
                        ></input>
                      </InputP>
                    </td>
                    <td>1000 R$/ano</td>
                  </tr>
                  <tr>
                    <td>
                      <InputSNIS>BL007</InputSNIS>
                    </td>
                    <td>
                      <InputG>Receita operacional</InputG>
                    </td>
                    <td>
                      <InputP>
                        <input
                          {...register("BL007")}
                          defaultValue={dadosBalanco?.bl007}
                          onChange={handleOnChange}
                          type="text"
                        ></input>
                      </InputP>
                    </td>
                    <td>1000 R$/ano</td>
                  </tr>
                  <tr>
                    <td>
                      <InputSNIS>BL009</InputSNIS>
                    </td>
                    <td>
                      <InputG>Resultado operacional com depreciação</InputG>
                    </td>
                    <td>
                      <InputP>
                        <input
                          {...register("BL009")}
                          defaultValue={dadosBalanco?.bl009}
                          onChange={handleOnChange}
                          type="text"
                        ></input>
                      </InputP>
                    </td>
                    <td>1000 R$/ano</td>
                  </tr>
                  <tr>
                    <td>
                      <InputSNIS>BL012</InputSNIS>
                    </td>
                    <td>
                      <InputG>Resultado operacional sem depreciação</InputG>
                    </td>
                    <td>
                      <InputP>
                        <input
                          {...register("BL012")}
                          defaultValue={dadosBalanco?.bl012}
                          onChange={handleOnChange}
                          type="text"
                        ></input>
                      </InputP>
                    </td>
                    <td>1000 R$/ano</td>
                  </tr>
                  <tr>
                    <td>
                      <InputSNIS>BL004</InputSNIS>
                    </td>
                    <td>
                      <InputG>Lucro líquido com depreciação</InputG>
                    </td>
                    <td>
                      <InputP>
                        <input
                          {...register("BL004")}
                          defaultValue={dadosBalanco?.bl004}
                          onChange={handleOnChange}
                          type="text"
                        ></input>
                      </InputP>
                    </td>
                    <td>1000 R$/ano</td>
                  </tr>
                  <tr>
                    <td>
                      <InputSNIS>BL011</InputSNIS>
                    </td>
                    <td>
                      <InputG>Lucro líquido sem depreciação</InputG>
                    </td>
                    <td>
                      <InputP>
                        <input
                          {...register("BL011")}
                          defaultValue={dadosBalanco?.bl011}
                          onChange={handleOnChange}
                          type="text"
                        ></input>
                      </InputP>
                    </td>
                    <td>1000 R$/ano</td>
                  </tr>
                </tbody>
              </table>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <InputSNIS>BL099</InputSNIS>
                    </td>
                    <td>
                      <InputG>Observação, esclarecimentos ou sugestões</InputG>
                    </td>
                    <td>
                      <InputG>
                        <textarea
                          {...register("BL099")}
                          defaultValue={dadosBalanco?.bl099}
                          onChange={handleOnChange}
                        />
                      </InputG>
                    </td>
                  </tr>
                </tbody>
              </table>
            </DivFormConteudo>
            </DivFormEixo>
          </DivForm>

          <SubmitButton type="submit">Gravar</SubmitButton>
        </Form>
      </DivCenter>
    </Container>
  );
}

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
    params: { id_usuario: id_usuario },
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
