/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  InputP,
  InputM,
  MenuMunicipio,
  Municipio,
  MenuMunicipioItem,
  DivTitulo,
  DivTituloConteudo,
  InputGG,
  InputSNIS,
  DivFormEixo,
} from "../../styles/financeiro";

import {
  Container,
  DivCenter,
  DivForm,
  DivFormCadastro,
  DivTituloForm,
  Form,
  InputG,
  SubmitButton,
  DivEixo,
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
import { getAPIClient } from "../../services/axios";
import MenuIndicadores from "../../components/MenuIndicadores";
import { parseCookies } from "nookies";
import { GetServerSideProps } from "next";
import Router from "next/router";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../services/api";
import MenuHorizontal from "../../components/MenuHorizontal";
import { toast, ToastContainer } from "react-nextjs-toast";
import MenuIndicadoresCadastro from "../../components/MenuIndicadoresCadastro";
import { Sidebar, SidebarItem } from "../../styles/residuo-solidos-in";
import { DivFormConteudo } from "../../styles/drenagem-indicadores";
import { MainContent } from "../../styles/indicadores";
import { anosSelect } from "../../util/util";

interface IMunicipio {
  id_municipio: string;
  municipio_codigo_ibge: string;
  municipio_nome: string;
}

interface MunicipioProps {
  Imunicipio: IMunicipio[];
}

export default function Agua() {
  const { usuario, signOut } = useContext(AuthContext);
  const [dadosMunicipio, setDadosMunicipio] = useState<IMunicipio>(null);
  const [anoSelected, setAnoSelected] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [dadosAgua, setDadosAgua] = useState(null);
  const [content, setContent] = useState(null);
  const [activeForm, setActiveForm] = useState("ligacoes");

  useEffect(() => {
    getMunicipio();
  }, []);

  async function getMunicipio() {
    const res = await api
      .get("getMunicipio", {
        params: { id_municipio: usuario.id_municipio },
      })
      .then((response) => {
        setDadosMunicipio(response.data[0]);
      });
  }

  function handleOnChange(content) {
    setContent(content);
  }

  async function handleCadastro(data) {
    if(usuario?.id_permissao === 4){
      return
    }

    data.id_agua = dadosAgua?.id_agua;
    data.id_municipio = usuario?.id_municipio;
    data.ano = anoSelected;

    const resCad = await api
      .post("create-agua", data)
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
    getDadosAgua(anoSelected);
  }

  async function getDadosAgua(ano) {
    const id_municipio = usuario?.id_municipio;
    const res = await api
      .post("get-agua-por-ano", { id_municipio: id_municipio, ano: ano })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });

    setDadosAgua(res[0]);
  }

  function seletcAno(ano: any) {
    setAnoSelected(ano);

    getDadosAgua(ano);
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
        <SidebarItem
          active={activeForm === "ligacoes"}
          onClick={() => setActiveForm("ligacoes")}
        >
          Ligações e economias
        </SidebarItem>
        <SidebarItem
          active={activeForm === "volumes"}
          onClick={() => setActiveForm("volumes")}
        >
          Volumes
        </SidebarItem>
        <SidebarItem
          active={activeForm === "extencao"}
          onClick={() => setActiveForm("extencao")}
        >
          Extenção da rede
        </SidebarItem>
        <SidebarItem
          active={activeForm === "consumo"}
          onClick={() => setActiveForm("consumo")}
        >
          Consumo de energia elétrica
        </SidebarItem>
        <SidebarItem
          active={activeForm === "observacoes"}
          onClick={() => setActiveForm("observacoes")}
        >
          Observações, esclarecimentos ou sugestões
        </SidebarItem>
      </Sidebar>
      <MainContent>
        <DivCenter>
          
          <Form onSubmit={handleSubmit(handleCadastro)}>
            <DivForm style={{ borderColor: "#12B2D5" }}>
              <DivTituloForm>Água</DivTituloForm>
              <DivFormEixo>
                <DivFormConteudo
                  active={
                    activeForm === "ligacoes" ||
                    activeForm === "volumes" ||
                    activeForm === "extencao" ||
                    activeForm === "consumo" ||
                    activeForm === "observacoes"
                  }
                >
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
                <DivFormConteudo active={activeForm === "ligacoes"}>
                  <DivTitulo>
                    <DivTituloConteudo>Ligações e economias</DivTituloConteudo>
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
                        <td>AG021</td>
                        <td>Quantidade de ligações totais de água</td>
                        <td>
                          <input
                            {...register("AG021")}
                            defaultValue={dadosAgua?.ag021}
                            onChange={handleOnChange}
                            type="text"
                            onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                      }}
                          ></input>
                        </td>
                        <td>ligação</td>
                      </tr>
                      <tr>
                        <td>AG002</td>
                        <td>Quantidade de ligações ativas de água</td>
                        <td>
                          <input
                            {...register("AG002")}
                            defaultValue={dadosAgua?.ag002}
                            onChange={handleOnChange}
                            type="text"
                            onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                        }}
                          ></input>
                        </td>
                        <td>ligação</td>
                      </tr>
                      <tr>
                        <td>AG004</td>
                        <td>
                          Quantidade de ligações ativas de água micromedidas
                        </td>
                        <td>
                          <input
                            {...register("AG004")}
                            defaultValue={dadosAgua?.ag004}
                            onChange={handleOnChange}
                            type="text"
                            onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                            }}
                          ></input>
                        </td>
                        <td>ligação</td>
                      </tr>
                      <tr>
                        <td>AG003</td>
                        <td>Quantidade de economias ativas de água</td>
                        <td>
                          <input
                            {...register("AG003")}
                            defaultValue={dadosAgua?.ag003}
                            onChange={handleOnChange}
                            type="text"
                            onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                            }}
                          ></input>
                        </td>
                        <td>economia</td>
                      </tr>
                      <tr>
                        <td>AG014</td>
                        <td>
                          Quantidade de economias ativas de água micromedidas
                        </td>
                        <td>
                          <input
                            {...register("AG014")}
                            defaultValue={dadosAgua?.ag014}
                            onChange={handleOnChange}
                            type="text"
                            onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                            }}
                          ></input>
                        </td>
                        <td>economia</td>
                      </tr>
                      <tr>
                        <td>AG013</td>
                        <td>
                          Quantidade de economias residenciais ativas de água
                        </td>
                        <td>
                          <input
                            {...register("AG013")}
                            defaultValue={dadosAgua?.ag013}
                            onChange={handleOnChange}
                            type="text"
                            onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                            }}
                          ></input>
                        </td>
                        <td>economia</td>
                      </tr>
                      <tr>
                        <td>AG022</td>
                        <td>
                          Quantidade de economias residenciais ativas de água
                          micromedidas
                        </td>
                        <td>
                          <input
                            {...register("AG022")}
                            defaultValue={dadosAgua?.ag022}
                            onChange={handleOnChange}
                            type="text"
                            onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                            }}
                          ></input>
                        </td>
                        <td>economia</td>
                      </tr>
                    </tbody>
                  </table>
                </DivFormConteudo>

                <DivFormConteudo active={activeForm === "volumes"}>
                  <DivTitulo>
                    <DivTituloConteudo>Volumes</DivTituloConteudo>
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
                        <td>AG006</td>
                        <td>Volume de água produzido</td>
                        <td>
                          <input
                            {...register("AG006")}
                            defaultValue={dadosAgua?.ag006}
                            onChange={handleOnChange}
                            type="text"
                            onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                            }}
                          ></input>
                        </td>
                        <td>1.000m³/ano</td>
                      </tr>
                      <tr>
                        <td>AG024</td>
                        <td>Volume de água de serviço</td>
                        <td>
                          <input
                            {...register("AG024")}
                            defaultValue={dadosAgua?.ag024}
                            onChange={handleOnChange}
                            type="text"
                            onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                            }}
                          ></input>
                        </td>
                        <td>1.000m³/ano</td>
                      </tr>
                      <tr>
                        <td>AG016</td>
                        <td>Volume de água bruta importado</td>
                        <td>
                          <input
                            {...register("AG016")}
                            defaultValue={dadosAgua?.ag016}
                            onChange={handleOnChange}
                            type="text"
                            onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                            }}
                          ></input>
                        </td>
                        <td>1.000m³/ano</td>
                      </tr>
                      <tr>
                        <td>AG018</td>
                        <td>Volume de água tratada importado</td>
                        <td>
                          <input
                            {...register("AG018")}
                            defaultValue={dadosAgua?.ag018}
                            onChange={handleOnChange}
                            type="text"
                            onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                            }}
                          ></input>
                        </td>
                        <td>1.000m³/ano</td>
                      </tr>
                      <tr>
                        <td>AG017</td>
                        <td>Volume de água bruta exportado</td>
                        <td>
                          <input
                            {...register("AG017")}
                            defaultValue={dadosAgua?.ag017}
                            onChange={handleOnChange}
                            type="text"
                            onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                            }}
                          ></input>
                        </td>
                        <td>1.000m³/ano</td>
                      </tr>
                      <tr>
                        <td>AG019</td>
                        <td>Volume de água tratada exportado</td>
                        <td>
                          <input
                            {...register("AG019")}
                            defaultValue={dadosAgua?.ag019}
                            onChange={handleOnChange}
                            type="text"
                            onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                            }}
                          ></input>
                        </td>
                        <td>1.000m³/ano</td>
                      </tr>
                      <tr>
                        <td>AG007</td>
                        <td>Volume de água tratada em ETA(s)</td>
                        <td>
                          <input
                            {...register("AG007")}
                            defaultValue={dadosAgua?.ag007}
                            onChange={handleOnChange}
                            type="text"
                            onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                            }}
                          ></input>
                        </td>
                        <td>1.000m³/ano</td>
                      </tr>
                      <tr>
                        <td>AG015</td>
                        <td>
                          {" "}
                          Volume de água tratada por simples desinfecção
                        </td>
                        <td>
                          <input
                            {...register("AG015")}
                            defaultValue={dadosAgua?.ag015}
                            onChange={handleOnChange}
                            type="text"
                            onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                            }}
                          ></input>
                        </td>
                        <td>1.000m³/ano</td>
                      </tr>
                      <tr>
                        <td>AG027</td>
                        <td>Volume de água fluoretada</td>
                        <td>
                          <input
                            {...register("AG027")}
                            defaultValue={dadosAgua?.ag027}
                            onChange={handleOnChange}
                            type="text"
                            onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                            }}
                          ></input>
                        </td>
                        <td>1.000m³/ano</td>
                      </tr>
                      <tr>
                        <td>AG012</td>
                        <td>Volume de água macromedida</td>
                        <td>
                          <input
                            {...register("AG012")}
                            defaultValue={dadosAgua?.ag012}
                            onChange={handleOnChange}
                            type="text"
                            onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                            }}
                          ></input>
                        </td>
                        <td>1.000m³/ano</td>
                      </tr>
                      <tr>
                        <td>AG008</td>
                        <td>Volume de água micromedida</td>
                        <td>
                          <input
                            {...register("AG008")}
                            defaultValue={dadosAgua?.ag008}
                            onChange={handleOnChange}
                            type="text"
                            onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                            }}
                          ></input>
                        </td>
                        <td>1.000m³/ano</td>
                      </tr>
                      <tr>
                        <td>AG010</td>
                        <td>Volume de água consumido</td>
                        <td>
                          <input
                            {...register("AG010")}
                            defaultValue={dadosAgua?.ag010}
                            onChange={handleOnChange}
                            type="text"
                            onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                            }}
                          ></input>
                        </td>
                        <td>1.000m³/ano</td>
                      </tr>
                      <tr>
                        <td>AG011</td>
                        <td>Volume de água faturado</td>
                        <td>
                          <input
                            {...register("AG011")}
                            defaultValue={dadosAgua?.ag011}
                            onChange={handleOnChange}
                            type="text"
                            onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                            }}
                          ></input>
                        </td>
                        <td>1.000m³/ano</td>
                      </tr>
                      <tr>
                        <td>AG020</td>
                        <td>
                          Volume micromedido nas economias residenciais de água
                        </td>
                        <td>
                          <input
                            {...register("AG020")}
                            defaultValue={dadosAgua?.ag020}
                            onChange={handleOnChange}
                            type="text"
                            onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                            }}
                          ></input>
                        </td>
                        <td>1.000m³/ano</td>
                      </tr>
                    </tbody>
                  </table>
                </DivFormConteudo>

                <DivFormConteudo active={activeForm === "extencao"}>
                  <DivTitulo>
                    <DivTituloConteudo>Extenção da rede</DivTituloConteudo>
                  </DivTitulo>
                  <InputSNIS>
                    <label>
                      <b>Código SNIS</b>
                    </label>
                    <p>AG005</p>
                  </InputSNIS>
                  <InputGG>
                    <label>
                      <b>Descrição</b>
                    </label>
                    <p>Extenção da rede de água</p>
                  </InputGG>

                  <InputP>
                    <label>Ano: {anoSelected}</label>

                    <input
                      {...register("AG005")}
                      defaultValue={dadosAgua?.ag005}
                      onChange={handleOnChange}
                      type="text"
                      onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                            }}
                    ></input>
                  </InputP>
                  <InputSNIS>
                    <label>.</label>
                    <p>KM</p>
                  </InputSNIS>
                </DivFormConteudo>

                <DivFormConteudo active={activeForm === "consumo"}>
                  <DivTitulo>
                    <DivTituloConteudo>
                      Consumo de energia elétrica
                    </DivTituloConteudo>
                  </DivTitulo>
                  <InputSNIS>
                    <label>
                      <b>Código SNIS</b>
                    </label>
                    <p>AG028</p>
                  </InputSNIS>
                  <InputGG>
                    <label>
                      <b>Descrição</b>
                    </label>
                    <p>
                      Consumo total de energia elétrica nos sistemas de água
                    </p>
                  </InputGG>

                  <InputP>
                    <label>Ano: {anoSelected}</label>

                    <input
                      {...register("AG028")}
                      defaultValue={dadosAgua?.ag028}
                      onChange={handleOnChange}
                      type="text"
                      onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                            }}
                    ></input>
                  </InputP>
                  <InputSNIS>
                    <label>.</label>
                    <p>1.000kWh/ano</p>
                  </InputSNIS>
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
                        <th>Ano: {anoSelected}</th>
                      </tr>
                      <tr>
                        <td>AG098</td>
                        <td>Campo de justificativa</td>
                        <td>
                          <textarea style={{width: "500px"}}
                            {...register("AG098")}
                            defaultValue={dadosAgua?.ag098}
                            onChange={handleOnChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>AG099</td>
                        <td>Observações</td>
                        <td>
                          <textarea style={{width: "500px"}}
                            {...register("AG099")}
                            defaultValue={dadosAgua?.ag099}
                            onChange={handleOnChange}
                          ></textarea>
                        </td>
                      </tr>
                    </tbody>
                  </table>
            
                </DivFormConteudo>
              </DivFormEixo>
            </DivForm>

            {usuario?.id_permissao !== 4 && <SubmitButton type="submit">Gravar</SubmitButton>}
          </Form>
        </DivCenter>
      </MainContent>
    </Container>
  );
}
