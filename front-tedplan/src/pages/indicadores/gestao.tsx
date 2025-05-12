import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-nextjs-toast";
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
  ContainerModal,
  Modal,
  ConteudoModal,
  CloseModalButton,
  SubmitButtonModal,
  Tabela,
  Actions,
} from "../../styles/indicadores";
import HeadIndicadores from "../../components/headIndicadores";
import Image from "next/image";
import "suneditor/dist/css/suneditor.min.css";
import { getAPIClient } from "../../services/axios";
import MenuIndicadores from "../../components/MenuIndicadoresCadastro";
import { parseCookies } from "nookies";
import { GetServerSideProps } from "next";
import Router from "next/router";
import { AuthContext } from "../../contexts/AuthContext";
import RepresentanteGestaoAssociada from "../../components/RepresentanteGestaoAssociada";
import { FormModal } from "../../styles/dashboard";
import Excluir from "../../img/excluir.png";
import Pdf from "../../img/pdf.png";
import {
  faPlus,
  faCoffee,
  faRadiation,
} from "@fortawesome/free-solid-svg-icons";
import api from "../../services/api";
import MenuHorizontal from "../../components/MenuHorizontal";
import { FaFilePdf } from "react-icons/fa";
import styled from "styled-components";
import {
  capitalizeFrasal,
  onlyLettersAndCharacters,
  toTitleCase,
} from "@/util/util";
const InputMask = require("react-input-mask");

const ModalSubmitButton = styled.button`
  background: #008080;
  color: #fff;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  margin-top: 20px;
  display: block;
  margin-left: auto;
  margin-right: 0;

  &:hover {
    background: #008899;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;
interface IMunicipio {
  id_municipio: string;
  municipio_codigo_ibge: string;
  municipio_nome: string;
  municipio_cnpj: string;
  municipio_nome_prefeitura: string;
  municipio_cep: string;
  municipio_endereco: string;
  municipio_numero: string;
  municipio_bairro: string;
  municipio_telefone: string;
  municipio_email: string;
  municipio_nome_prefeito: string;
}

interface IGestao {
  id_gestao_associada: string;
  nome_associacao: string;
  norma_associacao: string;

  plano_ano: string;
  plano_titulo: string;

  politica_ano: string;
  politica_titulo: string;

  sr_descricao: string;

  ct_nomes_comunidades: string;
  ct_descricao: string;
  string: string;
}

interface IRepresentantes {
  id_representante_servicos_ga: string;
  cargo: string;
  email: string;
  telefone: string;
  nome: string;
}

interface IPoliticas {
  id_politica_municipal: string;
  titulo: string;
  ano: string;
  id_arquivo: string;
}
interface IPlanos {
  id_plano_municipal: string;
  titulo: string;
  ano: string;
  id_arquivo: string;
}

interface IParticipacao {
  id_participacao_controle_social: string;
  titulo: string;
  ano: string;
  id_arquivo: string;
}

interface MunicipioProps {
  municipio: IMunicipio[];
  gestao: IGestao[];
}

export default function GestaoIndicadores({
  municipio,
  gestao,
}: MunicipioProps) {
  const { usuario, signOut } = useContext(AuthContext);
  const [dadosMunicipio, setMunicipio] = useState<IMunicipio | any>(municipio);
  const [dadosGestao, setGestao] = useState<IGestao | any>(gestao);
  const [representantes, setRepresentantes] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm();

  const [showModal, setShowModal] = useState(false);
  const [listParticipacoes, setListParticipacoes] = useState(null);
  const [content, setContent] = useState("");
  const [listPoliticas, setPoliticas] = useState(null);
  const [listPlanos, setPlanos] = useState(null);
  const editor = useRef(null);
  let txtArea = useRef();

  useEffect(() => {
    setIsClient(true);
    getMunicipio();
    getPoliticas();
    getPlanos();
    getParticipacoes();
    getRepresentantes();
    getGestao();
  }, []);

  async function getMunicipio() {
    const res = await api
      .get("getMunicipio", {
        params: { id_municipio: usuario.id_municipio },
      })
      .then((response) => {
        const res = response.data;
        setMunicipio(res[0]);
      });
  }

  async function getGestao() {
    const resGestao = await api.get("/getGestao", {
      params: { id_municipio: usuario.id_municipio },
    });

    setGestao(resGestao.data[0]);
  }

  async function handleCadastro(data) {
    if (usuario?.id_permissao === 4) {
      return;
    }
    const formData = new FormData();

    formData.append("id_municipio", usuario.id_municipio);
    formData.append(
      "id_gestao_associada",
      dadosGestao?.id_gestao_associada ? dadosGestao?.id_gestao_associada : ""
    );
    formData.append(
      "id_saneamento_rural",
      dadosGestao?.id_saneamento_rural ? dadosGestao?.id_saneamento_rural : ""
    );
    formData.append(
      "id_comunidades_tradicionais",
      dadosGestao?.id_comunidades_tradicionais
        ? dadosGestao?.id_comunidades_tradicionais
        : ""
    );

    formData.append(
      "nome_associacao",
      data.nome_associacao ? data.nome_associacao : dadosGestao?.ga_nome
    );
    formData.append(
      "norma_associacao",
      data.norma_associacao ? data.norma_associacao : dadosGestao?.ga_norma
    );
    formData.append("pcs_ano", data.pcs_ano);
    formData.append("pcs_arquivo", data.pcs_arquivo[0]);
    formData.append("pcs_titulo", data.pcs_titulo);
    formData.append("plano_ano", data.plano_ano);
    formData.append("plano_arquivo", data.plano_arquivo[0]);
    formData.append("plano_titulo", data.plano_titulo);
    formData.append("politica_ano", data.politica_ano);
    formData.append("politica_arquivo", data.politica_arquivo[0]);
    formData.append("politica_titulo", data.politica_titulo);
    formData.append(
      "sr_descricao",
      data.sr_descricao ? data.sr_descricao : dadosGestao?.sr_descricao
    );
    formData.append(
      "ct_nomes_comunidades",
      data.ct_nomes_comunidades
        ? data.ct_nomes_comunidades
        : dadosGestao?.nomes_comunidades_beneficiadas
    );
    formData.append(
      "ct_descricao",
      data.ct_descricao ? data.ct_descricao : dadosGestao?.ct_descricao
    );

    const apiClient = getAPIClient();
    const resCad = await apiClient
      .post("addGestaoIndicadores", formData, {
        headers: {
          "Content-Type": `multipart/form-data=${formData}`,
        },
      })
      .then((response) => {
        toast.notify("Representante cadastrado com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
        getPoliticas();
        getPlanos();
        getParticipacoes();
        getRepresentantes();
        reset({
          pcs_ano: "",
          pcs_titulo: "",
          pcs_arquivo: "",
          plano_ano: "",
          plano_titulo: "",
          plano_arquivo: "",
          politica_ano: "",
          politica_titulo: "",
          politica_arquivo: "",
        });
      })
      .catch((error) => {
        toast.notify("Não foi possivel cadastrar o representante! ", {
          title: "Erro!",
          duration: 7,
          type: "error",
        });
      });

    const resParticipacao = await apiClient.get(
      "getParticipacaoControleSocial",
      {
        params: { id_municipio: dadosMunicipio.id_municipio },
      }
    );
    const participacoes = await resParticipacao.data;
    setListParticipacoes(participacoes);
  }

  async function handleSignOut() {
    signOut();
  }

  function handleShowModal() {
    setShowModal(true);
  }
  function handleCloseModal() {
    setShowModal(false);
  }

  async function handleAddRepresentante(data) {
    if (!usuario.id_municipio) {
      toast.notify("Não existe Município, entre novamente no sistema! ", {
        title: "Erro!",
        duration: 7,
        type: "error",
      });
      signOut();
    }

    const id = await api
      .post("addRepresentanteServicos", {
        ga_cargo: data.ga_cargo,
        ga_email: data.ga_email,
        ga_nome_representante: data.ga_nome_representante,
        ga_telefone: data.ga_telefone,
        id_municipio: usuario.id_municipio,
      })
      .then((response) => {
        toast.notify("Representante cadastrado com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
        setShowModal(false);
        return response;
      })
      .catch((error) => {
        toast.notify("Não foi possivel cadastrar o representante! ", {
          title: "Erro!",
          duration: 7,
          type: "error",
        });
      });
    getRepresentantes();
  }

  function handleOnChange(content) {
    setContent(content);
  }

  async function handleRemoverParticipacao({ id, id_arquivo }) {
    await api
      .delete("remover-participacao", {
        params: { id: id, id_arquivo: id_arquivo },
      })
      .then((response) => {
        toast.notify("Participacão removido com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
      })
      .catch((error) => {
        toast.notify("Não foi possivel remover a participação! ", {
          title: "Erro!",
          duration: 7,
          type: "error",
        });
      });
    getParticipacoes();
  }

  async function handleRemoverPolitica({ id, id_arquivo }) {
    await api
      .delete("remover-politica", {
        params: { id: id, id_arquivo: id_arquivo },
      })
      .then((response) => {
        toast.notify("Política removida com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
      })
      .catch((error) => {
        toast.notify("Não foi possivel remover a politica municipal! ", {
          title: "Erro!",
          duration: 7,
          type: "error",
        });
      });
    getPoliticas();
  }

  async function handleRemoverPlano({ id, id_arquivo }) {
    await api
      .delete("remover-plano", {
        params: { id: id, id_arquivo: id_arquivo },
      })
      .then((response) => {
        toast.notify("Plano removido com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
      })
      .catch((error) => {
        toast.notify("Não foi possivel remover o plano municipal! ", {
          title: "Erro!",
          duration: 7,
          type: "error",
        });
      });
    getPlanos();
  }

  async function handleRemoverRepresentante({ id }) {
    await api
      .delete("remover-representante", {
        params: { id: id },
      })
      .then((response) => {
        toast.notify("Representante removido com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
      })
      .catch((error) => {
        toast.notify("Não foi possivel remover o plano municipal! ", {
          title: "Erro!",
          duration: 7,
          type: "error",
        });
      });
    getRepresentantes();
  }

  async function getPoliticas() {
    const resPoliticas = await api.get("getPoliticas", {
      params: { id_municipio: usuario?.id_municipio },
    });
    const politicas = await resPoliticas.data;
    if (politicas) {
      const resPoliticas = await Promise.all(
        politicas.map(async (p) => {
          const file = await api
            .get("getFile", {
              params: { id: p.id_arquivo },
              responseType: "blob",
            })
            .then((response) => {
              return URL.createObjectURL(response.data);
            })
            .catch((error) => {
              console.log(error);
            });
          const pf = {
            ...p,
            file,
          };
          return pf;
        })
      );
      setPoliticas(resPoliticas);
    }
  }

  async function getPlanos() {
    const resPlanos = await api.get("getPlanos", {
      params: { id_municipio: usuario?.id_municipio },
    });
    const planos = await resPlanos.data;
    if (planos) {
      const resPlanos = await Promise.all(
        planos.map(async (p) => {
          const file = await api
            .get("getFile", {
              params: { id: p.id_arquivo },
              responseType: "blob",
            })
            .then((response) => {
              return URL.createObjectURL(response.data);
            })
            .catch((error) => {
              console.log(error);
            });
          const pf = {
            ...p,
            file,
          };
          return pf;
        })
      );
      setPlanos(resPlanos);
    }
  }

  async function getParticipacoes() {
    const resParticipacao = await api.get("getParticipacaoControleSocial", {
      params: { id_municipio: usuario?.id_municipio },
    });
    const participacoes = await resParticipacao.data;
    if (participacoes) {
      const resParticipacoes = await Promise.all(
        participacoes.map(async (p) => {
          const file = await api
            .get("/getFile", {
              params: { id: p.id_arquivo },
              responseType: "blob",
            })
            .then((response) => {
              return URL.createObjectURL(response.data);
            })
            .catch((error) => {
              console.log(error);
            });
          const pf = {
            ...p,
            file,
          };
          return pf;
        })
      );
      setListParticipacoes(resParticipacoes);
    }
  }

  async function getRepresentantes() {
    const resRepresentantes = await api.get("getRepresentantesServicos", {
      params: { id_municipio: usuario?.id_municipio },
    });
    const representantes = await resRepresentantes.data;

    setRepresentantes(representantes);
  }

  return (
    <Container>
      <ToastContainer></ToastContainer>
      <HeadIndicadores usuarios={[]}></HeadIndicadores>
      <MenuHorizontal
        municipio={dadosMunicipio?.municipio_nome}
      ></MenuHorizontal>
      <MenuIndicadores></MenuIndicadores>
      <DivCenter>
        <Form onSubmit={handleSubmit(handleCadastro)}>
          <DivForm>
            <DivTituloForm>Gestão Associada</DivTituloForm>
            <table>
              <tr>
                <td>
                  <InputG>
                    <label>Nome da associação</label>
                    <input
                      {...register("nome_associacao")}
                      defaultValue={dadosGestao?.ga_nome}
                      onChange={handleOnChange}
                      type="text"
                    ></input>
                  </InputG>
                </td>
                <td>
                  <InputG>
                    <label>
                      Norma da associação<span> *</span>
                    </label>
                    <input
                      {...register("norma_associacao")}
                      defaultValue={dadosGestao?.ga_norma}
                      onChange={handleOnChange}
                      type="text"
                    ></input>
                  </InputG>
                </td>
              </tr>
            </table>
            <DivEixo>
              Representantes{" "}
              <span
                onClick={() => {
                  handleShowModal();
                }}
              >
                Adicionar
              </span>{" "}
            </DivEixo>

            <Tabela>
              <table cellSpacing={0}>
                <tbody>
                  {representantes && (
                    <tr>
                      <th>ID</th>
                      <th>Nome</th>
                      <th>Cargo</th>
                      <th>Telefone</th>
                      <th>email</th>
                      <th>Ações</th>
                    </tr>
                  )}

                  {representantes?.map((representante, index) => (
                    <tr role="row" key={index}>
                      <td>{representante.id_representante_servicos_ga}</td>
                      <td>
                        <InputM>{representante.nome}</InputM>
                      </td>
                      <td>{representante.cargo}</td>
                      <td>{representante.telefone}</td>
                      <td>{representante.email}</td>
                      <td>
                        <Actions>
                          <Image
                            onClick={() =>
                              handleRemoverRepresentante({
                                id: representante.id_representante_servicos_ga,
                              })
                            }
                            src={Excluir}
                            alt="Excluir"
                            width={25}
                            height={25}
                          />
                        </Actions>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Tabela>
          </DivForm>
          <DivForm>
            <DivTituloForm>
              Política Municipal de Saneamento Básico
            </DivTituloForm>
            <table>
              <tr>
                <td>
                  <InputG>
                    <label>Título</label>
                    <input
                      {...register("politica_titulo")}
                      defaultValue={dadosGestao?.politica_titulo}
                      onChange={(e) => {
                        const value = capitalizeFrasal(e.target.value);
                        setValue("politica_titulo", value);
                      }}
                      type="text"
                      //aceita apenas letras e caracteres especiais
                      onKeyPress={onlyLettersAndCharacters}
                    ></input>
                  </InputG>
                </td>
                <td>
                  <InputP>
                    <label>Ano</label>
                    <input
                      {...register("politica_ano")}
                      defaultValue={dadosGestao?.politica_ano}
                      onChange={handleOnChange}
                      type="text"
                      //aceita apenas números
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    ></input>
                  </InputP>
                </td>
                <td>
                  <InputM>
                    <label>Arquivo</label>
                    <input
                      {...register("politica_arquivo")}
                      type="file"
                    ></input>
                  </InputM>
                </td>
              </tr>
            </table>

            <DivEixo>Atualizações</DivEixo>

            <Tabela>
              <table cellSpacing={0}>
                <tbody>
                  {listPoliticas && (
                    <tr>
                      <th>ID</th>
                      <th>Nome</th>
                      <th>Ano</th>
                      <th>Ações</th>
                    </tr>
                  )}
                  {listPoliticas?.map((politica, index) => (
                    <tr key={index}>
                      <td>{politica.id_politica_municipal}</td>
                      <td>
                        <InputG>{politica.titulo}</InputG>
                      </td>
                      <td>{politica.ano}</td>
                      <td>
                        <Actions>
                          <a
                            href={politica.file}
                            rel="noreferrer"
                            target="_blank"
                          >
                            <FaFilePdf></FaFilePdf>
                          </a>
                          <Image
                            src={Excluir}
                            alt="Excluir"
                            width={25}
                            height={25}
                            onClick={() => {
                              handleRemoverPolitica({
                                id: politica.id_politica_municipal,
                                id_arquivo: politica.id_arquivo,
                              });
                            }}
                          />
                        </Actions>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Tabela>
          </DivForm>
          <DivForm>
            <DivTituloForm>Plano Municipal de Saneamento Básico</DivTituloForm>
            <table>
              <tr>
                <td>
                  <InputG>
                    <label>Título</label>
                    <input {...register("plano_titulo")} type="text"></input>
                  </InputG>
                </td>
                <td>
                  <InputP>
                    <label>Ano</label>
                    <input {...register("plano_ano")} type="text"></input>
                  </InputP>
                </td>
                <td>
                  <InputM>
                    <label>Arquivo</label>
                    <input {...register("plano_arquivo")} type="file"></input>
                  </InputM>
                </td>
              </tr>
            </table>

            <DivEixo>Atualizações</DivEixo>

            <Tabela>
              <table cellSpacing={0}>
                <tbody>
                  {listPlanos && (
                    <tr>
                      <th>ID</th>
                      <th>Nome</th>
                      <th>Ano</th>
                      <th>Ações</th>
                    </tr>
                  )}

                  {listPlanos?.map((plano, index) => (
                    <tr key={index}>
                      <td>{plano.id_plano_municipal}</td>
                      <td>
                        <InputG>{plano.titulo}</InputG>
                      </td>
                      <td>{plano.ano}</td>
                      <td>
                        <Actions>
                          <a href={plano.file} rel="noreferrer" target="_blank">
                            <FaFilePdf></FaFilePdf>
                          </a>
                          <Image
                            src={Excluir}
                            alt="Excluir"
                            width={25}
                            height={25}
                            onClick={() => {
                              handleRemoverPlano({
                                id: plano.id_plano_municipal,
                                id_arquivo: plano.id_arquivo,
                              });
                            }}
                          />
                        </Actions>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Tabela>
          </DivForm>

          <DivForm>
            <DivTituloForm>Participação e Controle Social</DivTituloForm>
            <table>
              <tr>
                <td>
                  <InputG>
                    <label>Titulo</label>
                    <input
                      {...register("pcs_titulo")}
                      onChange={(e) => {
                        const value = capitalizeFrasal(e.target.value);
                        setValue("pcs_titulo", value);
                      }}
                      type="text"
                      onKeyPress={onlyLettersAndCharacters}
                    ></input>
                  </InputG>
                </td>
                <td>
                  <InputP>
                    <label>Ano</label>
                    <input
                      {...register("pcs_ano")}
                      type="text"
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    ></input>
                  </InputP>
                </td>
                <td>
                  <InputM>
                    <label>Arquivo</label>
                    <input {...register("pcs_arquivo")} type="file"></input>
                  </InputM>
                </td>
              </tr>
            </table>

            <DivEixo>Atualizações</DivEixo>

            <Tabela>
              <table cellSpacing={0}>
                <tbody>
                  {listParticipacoes && (
                    <tr>
                      <th>ID</th>
                      <th>Nome</th>
                      <th>Ano</th>
                      <th>Ações</th>
                    </tr>
                  )}

                  {listParticipacoes?.map((participacao, index) => (
                    <tr key={index}>
                      <td>{participacao.id_participacao_controle_social}</td>
                      <td>
                        <InputG>{participacao.titulo}</InputG>
                      </td>
                      <td>{participacao.ano}</td>
                      <td>
                        <Actions>
                          <a
                            href={participacao.file}
                            rel="noreferrer"
                            target="_blank"
                          >
                            <FaFilePdf></FaFilePdf>
                          </a>
                          <Image
                            src={Excluir}
                            alt="Excluir"
                            width={25}
                            height={25}
                            onClick={() =>
                              handleRemoverParticipacao({
                                id: participacao.id_participacao_controle_social,
                                id_arquivo: participacao.id_arquivo,
                              })
                            }
                          />
                        </Actions>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Tabela>
          </DivForm>
          <DivForm>
            <DivTituloForm>Saneamento Rural</DivTituloForm>
            <DivTextArea>
              <label>Breve Descrição</label>

              <textarea
                ref={txtArea}
                {...register("sr_descricao")}
                defaultValue={
                  dadosGestao?.sr_descricao ? dadosGestao?.sr_descricao : ""
                }
                onChange={handleOnChange}
              ></textarea>
            </DivTextArea>
          </DivForm>
          <DivForm>
            <DivTituloForm>Comunidades Tradicionais</DivTituloForm>

            <DivTextArea>
              <label>Nome das Comunidades Beneficiadas</label>

              <textarea
                ref={txtArea}
                {...register("ct_nomes_comunidades")}
                defaultValue={
                  dadosGestao?.nomes_comunidades_beneficiadas
                    ? dadosGestao?.nomes_comunidades_beneficiadas
                    : ""
                }
                onChange={handleOnChange}
              ></textarea>

              <label>Breve Descrição</label>

              <textarea
                ref={txtArea}
                {...register("ct_descricao")}
                defaultValue={
                  dadosGestao?.ct_descricao ? dadosGestao?.ct_descricao : ""
                }
                onChange={handleOnChange}
              ></textarea>
            </DivTextArea>
          </DivForm>
          {usuario?.id_permissao !== 4 && (
            <SubmitButton type="submit">Gravar</SubmitButton>
          )}
        </Form>

        {showModal && (
          <ContainerModal>
            <Modal>
              <Form onSubmit={handleSubmit(handleAddRepresentante)}>
                <CloseModalButton
                  onClick={() => {
                    handleCloseModal();
                  }}
                >
                  Fechar
                </CloseModalButton>

                <ConteudoModal>
                  <InputG>
                    <label>
                      Nome<span> *</span>
                    </label>
                    <input
                      {...register("ga_nome_representante", {
                        required: "O nome é obrigatório",
                      })}
                      onKeyPress={onlyLettersAndCharacters}
                      type="text"
                      style={{ textTransform: "capitalize" }}
                      onChange={(e) => {
                        const value = toTitleCase(e.target.value);
                        setValue("ga_nome_representante", value);
                      }}
                    ></input>
                  </InputG>
                  {errors.ga_nome_representante && (
                    <span>{errors.ga_nome_representante.message}</span>
                  )}
                  <InputP>
                    <label>
                      Cargo<span> *</span>
                    </label>
                    <input
                      {...register("ga_cargo", {
                        required: "O cargo é obrigatório",
                      })}
                      onKeyPress={onlyLettersAndCharacters}
                      type="text"
                      onChange={(e) => {
                        const value = toTitleCase(e.target.value);
                        setValue("ga_cargo", value);
                      }}
                    ></input>
                  </InputP>
                  {errors.ga_cargo && <span>{errors.ga_cargo.message}</span>}

                  <InputP>
                    <label>
                      Telefone<span> *</span>
                    </label>
                    <Controller
                      name="ga_telefone"
                      control={control}
                      rules={{ required: "O telefone é obrigatório" }}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <>
                          <InputMask
                            mask="(99) 99999-9999"
                            maskChar={null}
                            value={value}
                            onChange={(e) => {
                              const justNumbers = e.target.value.replace(
                                /\D/g,
                                ""
                              );
                              if (justNumbers.length <= 11) {
                                onChange(justNumbers);
                              }
                            }}
                          >
                            {(inputProps) => (
                              <input {...inputProps} type="text" />
                            )}
                          </InputMask>
                          {error && <span>{error.message}</span>}
                        </>
                      )}
                    />
                  </InputP>
                  <InputM>
                    <label>
                      Email<span> *</span>
                    </label>
                    <input
                      {...register("ga_email")}
                      defaultValue={dadosGestao?.ga_email}
                      onChange={handleOnChange}
                      type="text"
                    ></input>
                  </InputM>
                  <ModalSubmitButton type="submit">Gravar</ModalSubmitButton>
                </ConteudoModal>
              </Form>
            </Modal>
          </ContainerModal>
        )}
      </DivCenter>
    </Container>
  );
}
