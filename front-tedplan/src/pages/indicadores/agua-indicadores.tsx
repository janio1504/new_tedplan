/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Container,
  DivCenter,
  DivForm,
  DivTituloForm,
  Form,
  InputP,
  InputM,
  InputG,
  SubmitButton,
  MenuMunicipio,
  Municipio,
  MenuMunicipioItem,
  DivTitulo,
  DivFormConteudo,
  DivTituloConteudo,
  InputGG,
  InputSNIS,
  DivFormEixo,
} from "../../styles/financeiro";
import HeadIndicadores from "../../components/headIndicadores";
import { getAPIClient } from "../../services/axios";
import MenuIndicadores from "../../components/MenuIndicadores";
import { parseCookies } from "nookies";
import { GetServerSideProps } from "next";
import Router from "next/router";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../services/api";
import MenuHorizontal from "../../components/MenuHorizontal";
import { toast, ToastContainer } from 'react-nextjs-toast'

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
  const [dadosMunicipio, setDadosMunicipio] = useState<IMunicipio | any>(municipio);
  const [anoSelected, setAnoSelected] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [dadosAgua, setDadosAgua] = useState(null);
  const [content, setContent] = useState(null);

  useEffect(() => {
    municipio.map((value) => {
      setDadosMunicipio(value);
    });
  }, []);

  function handleOnChange(content) {
    setContent(content);
  }

  async function handleCadastro(data) {

    data.id_agua = dadosAgua?.id_agua
    data.id_municipio = municipio[0].id_municipio
    data.ano = anoSelected

    const resCad = await api
      .post("create-agua", data)
      .then((response) => {
        toast.notify('Dados gravados com sucesso!', {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        })
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    getDadosAgua(anoSelected)
  }

  async function getDadosAgua(ano) {
    const id_municipio = municipio[0].id_municipio

    const res = await api
      .post("get-agua-por-ano", { id_municipio: id_municipio, ano: ano })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });


    setDadosAgua(res[0])
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

  function seletcAno(ano: any) {

    setAnoSelected(ano)

    getDadosAgua(ano)
  }

  return (
    <Container>
      <ToastContainer></ToastContainer>
      <HeadIndicadores usuarios={[]}></HeadIndicadores>
      <MenuHorizontal municipio={dadosMunicipio.municipio_nome}></MenuHorizontal>
      <MenuIndicadores></MenuIndicadores>
      <DivCenter>
        <Form onSubmit={handleSubmit(handleCadastro)}>
          <DivForm style={{ borderColor: "#12B2D5" }}>
            <DivTituloForm>Água</DivTituloForm>
            <DivFormEixo>
              <DivFormConteudo>
                <DivTitulo>
                  <DivTituloConteudo>Ano</DivTituloConteudo>
                </DivTitulo>
                <label>Selecione o ano desejado:</label>
                <select name="ano" id="ano" onChange={(e) => seletcAno(e.target.value)}>
                  <option >Selecionar</option>
                  <option value="2022">2022</option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                </select>
              </DivFormConteudo>
            </DivFormEixo>
            <DivFormEixo>
              <DivFormConteudo>
                <DivTitulo>
                  <DivTituloConteudo>Ligações e economias</DivTituloConteudo>
                </DivTitulo>
                <InputSNIS>
                  <label><b>Código SNIS</b></label>
                  <p>AG021</p>
                  <p>AG002</p>
                  <p>AG004</p>
                  <p>AG003</p>
                  <p>AG014</p>
                  <p>AG013</p>
                  <p>AG022</p>
                </InputSNIS>
                <InputGG>
                  <label><b>Descrição</b></label>
                  <p>Quantidade de ligações totais de água</p>
                  <p>Quantidade de ligações ativas de água</p>
                  <p>Quantidade de ligações ativas de água micromedidas</p>
                  <p>Quantidade de economias ativas de água</p>
                  <p>Quantidade de economias ativas de água micromedidas</p>
                  <p>Quantidade de economias residenciais ativas de água</p>
                  <p>Quantidade de economias residenciais ativas de água micromedidas</p>
                </InputGG>

                <InputP>

                  <label>Ano: {anoSelected}</label>

                  <input {...register("AG021")}
                    defaultValue={dadosAgua?.ag021}
                    onChange={handleOnChange}
                    type="text"></input>
                  <input {...register("AG002")}
                    defaultValue={dadosAgua?.ag002}
                    onChange={handleOnChange}
                    type="text"></input>
                  <input {...register("AG004")}
                    defaultValue={dadosAgua?.ag004}
                    onChange={handleOnChange}
                    type="text"></input>
                  <input {...register("AG003")}
                    defaultValue={dadosAgua?.ag003}
                    onChange={handleOnChange}
                    type="text"></input>
                  <input {...register("AG014")}
                    defaultValue={dadosAgua?.ag014}
                    onChange={handleOnChange}
                    type="text"></input>
                  <input {...register("AG013")}
                    defaultValue={dadosAgua?.ag013}
                    onChange={handleOnChange}
                    type="text"></input>
                  <input {...register("AG022")}
                    defaultValue={dadosAgua?.ag022}
                    onChange={handleOnChange}
                    type="text"></input>
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
                  <label><b>Código SNIS</b></label>
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
                  <label><b>Descrição</b></label>
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

                  <label>Ano: {anoSelected}</label>

                  <input {...register("AG006")}
                    defaultValue={dadosAgua?.ag006}
                    onChange={handleOnChange}
                    type="text"></input>
                  <input {...register("AG024")}
                    defaultValue={dadosAgua?.ag024}
                    onChange={handleOnChange}
                    type="text"></input>
                  <input {...register("AG016")}
                    defaultValue={dadosAgua?.ag016}
                    onChange={handleOnChange}
                    type="text"></input>
                  <input {...register("AG018")}
                    defaultValue={dadosAgua?.ag018}
                    onChange={handleOnChange}
                    type="text"></input>
                  <input {...register("AG017")}
                    defaultValue={dadosAgua?.ag017}
                    onChange={handleOnChange}
                    type="text"></input>
                  <input {...register("AG019")}
                    defaultValue={dadosAgua?.ag019}
                    onChange={handleOnChange}
                    type="text"></input>
                  <input {...register("AG007")}
                    defaultValue={dadosAgua?.ag007}
                    onChange={handleOnChange}
                    type="text"></input>
                  <input {...register("AG015")}
                    defaultValue={dadosAgua?.ag015}
                    onChange={handleOnChange}
                    type="text"></input>
                  <input {...register("AG027")}
                    defaultValue={dadosAgua?.ag027}
                    onChange={handleOnChange}
                    type="text"></input>
                  <input {...register("AG012")}
                    defaultValue={dadosAgua?.ag012}
                    onChange={handleOnChange}
                    type="text"></input>
                  <input {...register("AG008")}
                    defaultValue={dadosAgua?.ag008}
                    onChange={handleOnChange}
                    type="text"></input>
                  <input {...register("AG010")}
                    defaultValue={dadosAgua?.ag010}
                    onChange={handleOnChange}
                    type="text"></input>
                  <input {...register("AG011")}
                    defaultValue={dadosAgua?.ag011}
                    onChange={handleOnChange}
                    type="text"></input>
                  <input {...register("AG020")}
                    defaultValue={dadosAgua?.ag020}
                    onChange={handleOnChange}
                    type="text"></input>

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
                  <label><b>Código SNIS</b></label>
                  <p>AG005</p>
                </InputSNIS>
                <InputGG>
                  <label><b>Descrição</b></label>
                  <p>Extenção da rede de água</p>
                </InputGG>

                <InputP>

                  <label>Ano: {anoSelected}</label>

                  <input {...register("AG005")}
                    defaultValue={dadosAgua?.ag005}
                    onChange={handleOnChange}
                    type="text"></input>
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
                  <label><b>Código SNIS</b></label>
                  <p>AG028</p>
                </InputSNIS>
                <InputGG>
                  <label><b>Descrição</b></label>
                  <p>Consumo total de energia elétrica nos sistemas de água</p>
                </InputGG>

                <InputP>

                  <label>Ano: {anoSelected}</label>

                  <input {...register("AG028")}
                    defaultValue={dadosAgua?.ag028}
                    onChange={handleOnChange}
                    type="text"></input>
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
                  <label><b>Código SNIS</b></label>
                  <p>AG098</p>
                  <p></p>
                  <p></p>
                  <p></p>
                  <p></p>
                  <p></p>
                  <p>AG099</p>
                </InputSNIS>
                <InputM>
                  <label><b>Descrição</b></label>
                  <p>Campo de justificativa</p>
                  <p></p>
                  <p></p>
                  <p></p>
                  <p></p>
                  <p></p>
                  <p>Observações</p>
                </InputM>

                <InputG>

                  <label>Ano: {anoSelected}</label>

                  <textarea {...register("AG098")}
                    defaultValue={dadosAgua?.ag098}
                    onChange={handleOnChange}
                  />
                  <textarea {...register("AG099")}
                    defaultValue={dadosAgua?.ag099}
                    onChange={handleOnChange}
                  ></textarea>
                </InputG>
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

