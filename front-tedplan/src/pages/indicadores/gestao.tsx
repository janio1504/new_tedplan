import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
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
} from "../../styles/indicadores";
import HeadIndicadores from "../../components/headIndicadores";
import Image from "next/image";
import "suneditor/dist/css/suneditor.min.css";
import { getAPIClient } from "../../services/axios";
import MenuIndicadores from "../../components/MenuIndicadores";
import { parseCookies } from "nookies";
import { GetServerSideProps } from "next";
import Router from "next/router";
import { AuthContext } from "../../contexts/AuthContext";
import RepresentanteGestaoAssociada from "../../components/RepresentanteGestaoAssociada";
import { FormModal } from "../../styles/dashboard";
import Excluir from "../../img/excluir.png";
import {
  faPlus,
  faCoffee,
  faRadiation,
} from "@fortawesome/free-solid-svg-icons";
import api from "../../services/api";
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
  representantes: IRepresentantes[];
  planos: IPlanos[];
  politicas: IPoliticas[];
  participacoes: IParticipacao[];
}

export default function GestaoIndicadores({
  municipio,
  gestao,
  representantes,
  planos,
  politicas,
  participacoes,
}: MunicipioProps) {
  const { usuario, signOut } = useContext(AuthContext);
  const [isMunicipio, setMunicipio] = useState<IMunicipio | any>(municipio);
  const [isGestao, setGestao] = useState<IGestao | any>(gestao);
  const [isFormRepresentante, setFormRepresentante] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [showModal, setShowModal] = useState(false);
  const [ listParticipacoes, setListParticipacoes]= useState(null)
  const [contentForEditor, setContentForEditor] = useState(null);
  const [content, setContent] = useState("");
  const [contentSR, setContentSR] = useState("");
  const [contentCTNC, setContentCTNC] = useState("");
  const [contentCTD, setContentCTD] = useState("");
  const editor = useRef(null);
  let txtArea = useRef();
  const firstRender = useRef(true);
  const editorContent = useMemo(() => contentForEditor, [contentForEditor]);

  const getSunEditorInstance = (sunEditor) => {
    editor.current = sunEditor;
  };

  useEffect(() => {
    municipio.map((value) => {
      setMunicipio(value);
    });
    setListParticipacoes(participacoes)
    setGestao(gestao[0]);
  }, [municipio, gestao, participacoes]);

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

  async function handleCadastro(data) {
    const formData = new FormData();

    formData.append("id_municipio", isMunicipio.id_municipio);
    formData.append(
      "id_gestao_associada",
      isGestao.id_gestao_associada ? isGestao.id_gestao_associada : ""
    );
    formData.append(
      "id_saneamento_rural",
      isGestao.id_saneamento_rural ? isGestao.id_saneamento_rural : ""
    );
    formData.append(
      "id_comunidades_tradicionais",
      isGestao.id_comunidades_tradicionais
        ? isGestao.id_comunidades_tradicionais
        : ""
    );

    formData.append(
      "nome_associacao",
      data.nome_associacao ? data.nome_associacao : isGestao.ga_nome
    );
    formData.append(
      "norma_associacao",
      data.norma_associacao ? data.norma_associacao : isGestao.ga_norma
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
      data.sr_descricao ? data.sr_descricao : isGestao.sr_descricao
    );
    formData.append(
      "ct_nomes_comunidades",
      data.ct_nomes_comunidades
        ? data.ct_nomes_comunidades
        : isGestao.nomes_comunidades_beneficiadas
    );
    formData.append(
      "ct_descricao",
      data.ct_descricao ? data.ct_descricao : isGestao.ct_descricao
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
      })
      .catch((error) => {
        toast.notify("Não foi possivel cadastrar o representante! ", {
          title: "Erro!",
          duration: 7,
          type: "error",
        });
      });
      
      const resParticipacao = await apiClient.get("getParticipacaoControleSocial", {
        params: { id_municipio:  isMunicipio.id_municipio },
      });
      const participacoes = await resParticipacao.data;
      setListParticipacoes(participacoes)
    
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
    
    const id = await api
      .post("addRepresentanteServicos", {
        ga_cargo: data.ga_cargo,
        ga_email: data.ga_email,
        ga_nome_representante: data.ga_nome_representante,
        ga_telefone: data.ga_telefone,
        id_municipio: isMunicipio.id_municipio,
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

  function handleOnChange(content) {
    setContent(content);
  }

  async function handleRemoverParticipacao({ id, id_arquivo }) {
    await api
      .delete("remover-participacao", {
        params: { id: id, id_arquivo: id_arquivo },
      })
      .then((response) => {
        toast.notify("Representante removido com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
        Router.push("/indicadores/gestao");
      })
      .catch((error) => {
        toast.notify("Não foi possivel remover o representante! ", {
          title: "Erro!",
          duration: 7,
          type: "error",
        });
      });
  }

  async function handleRemoverPolitica({ id, id_arquivo }) {
    await api
      .delete("remover-politica", {
        params: { id: id, id_arquivo: id_arquivo },
      })
      .then((response) => {
        toast.notify("Politica removida com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
        Router.push("/indicadores/gestao");
      })
      .catch((error) => {
        toast.notify("Não foi possivel remover a politica municipal! ", {
          title: "Erro!",
          duration: 7,
          type: "error",
        });
      });
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
        Router.push("/indicadores/gestao");
      })
      .catch((error) => {
        toast.notify("Não foi possivel remover o plano municipal! ", {
          title: "Erro!",
          duration: 7,
          type: "error",
        });
      });
  }

  return (
    <Container>
      <ToastContainer></ToastContainer>
      <HeadIndicadores usuarios={[]}></HeadIndicadores>
      <MenuMunicipio>
        <Municipio>Municipio: {isMunicipio?.municipio_nome}</Municipio>
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
            <DivTituloForm>Gestão Associada</DivTituloForm>

            <InputG>
              <label>Nome da associação</label>
              <input
                {...register("nome_associacao")}
                defaultValue={isGestao?.ga_nome}
                onChange={handleOnChange}
                type="text"
              ></input>
            </InputG>
            <InputG>
              <label>
                Norma da associação<span> *</span>
              </label>
              <input
                {...register("norma_associacao")}
                defaultValue={isGestao?.ga_norma}
                onChange={handleOnChange}
                type="text"
              ></input>
            </InputG>

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
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {representantes?.map((representante, index) => (
                    <>
                      <tr role="row" key={index}>
                        <td>{representante.id_representante_servicos_ga}</td>
                        <td >{representante.nome}</td>
                        <td>
                          <Image src={Excluir} alt="Excluir" width={20} height={20}/>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </Tabela>
          </DivForm>
          <DivForm>
            <DivTituloForm>
              Politica Municipal de Saneamento Básico
            </DivTituloForm>
            <InputG>
              <label>Titulo</label>
              <input
                {...register("politica_titulo")}
                defaultValue={isGestao?.politica_titulo}
                onChange={handleOnChange}
                type="text"
              ></input>
            </InputG>
            <InputP>
              <label>Ano</label>
              <input
                {...register("politica_ano")}
                defaultValue={isGestao?.politica_ano}
                onChange={handleOnChange}
                type="text"
              ></input>
            </InputP>
            <InputM>
              <label>Arquivo</label>
              <input {...register("politica_arquivo")} type="file"></input>
            </InputM>
            <DivEixo>Atualizações</DivEixo>
            <Tabela>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Ano</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {politicas?.map((politica, index) => (
                    <>
                      <tr key={index}>
                        <td>{politica.id_politica_municipal}</td>
                        <td >{politica.titulo}</td>
                        <td>{politica.ano}</td>
                        <td>
                        <Image src={Excluir} alt="Excluir" width={20} height={20}
                          onClick={() => {
                            handleRemoverPolitica({
                              id: politica.id_politica_municipal,
                              id_arquivo: politica.id_arquivo,
                            });
                        }}
                        />
                        
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </Tabela>
          </DivForm>
          <DivForm>
            <DivTituloForm>Plano Municipal de Saneamento Básico</DivTituloForm>
            <InputG>
              <label>Titulo</label>
              <input {...register("plano_titulo")} type="text"></input>
            </InputG>
            <InputP>
              <label>Ano</label>
              <input {...register("plano_ano")} type="text"></input>
            </InputP>
            <InputM>
              <label>Arquivo</label>
              <input {...register("plano_arquivo")} type="file"></input>
            </InputM>
            <DivEixo>Atualizações</DivEixo>
            <Tabela>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Ano</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {planos?.map((plano, index) => (
                    <>
                      <tr key={index}>
                        <td>{plano.id_plano_municipal}</td>
                        <td >{plano.titulo}</td>
                        <td>{plano.ano}</td>
                        <td>
                        <Image src={Excluir} alt="Excluir" width={20} height={20}
                          onClick={() => {
                            handleRemoverPlano({
                              id: plano.id_plano_municipal,
                              id_arquivo: plano.id_arquivo,
                            });
                          }}
                        />
                         
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </Tabela>
          </DivForm>

          <DivForm>
            <DivTituloForm>Participação e Controle Social</DivTituloForm>
            <InputG>
              <label>Titulo</label>
              <input {...register("pcs_titulo")} type="text"></input>
            </InputG>
            <InputP>
              <label>Ano</label>
              <input {...register("pcs_ano")} type="text"></input>
            </InputP>
            <InputM>
              <label>Arquivo</label>
              <input {...register("pcs_arquivo")} type="file"></input>
            </InputM>
            <DivEixo>Atualizações</DivEixo>
            <Tabela>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Ano</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {listParticipacoes?.map((participacao, index) => (
                    <>
                      <tr key={index}>
                        <td>{participacao.id_participacao_controle_social}</td>
                        <td >{participacao.titulo}</td>
                        <td>{participacao.ano}</td>
                        <td>
                        <Image src={Excluir} alt="Excluir" width={20} height={20}
                         onClick={() =>
                          handleRemoverParticipacao({
                            id: participacao.id_participacao_controle_social,
                            id_arquivo: participacao.id_arquivo,
                          })
                        }
                        />
                         
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </Tabela>
          </DivForm>
          <DivForm>
            <DivTituloForm>Saneamento Rural</DivTituloForm>
            <DivTextArea>
              <label>Breve descrição</label>
              <TextArea>
                <textarea
                  ref={txtArea}
                  {...register("sr_descricao")}
                  defaultValue={isGestao?.sr_descricao}
                  onChange={handleOnChange}
                ></textarea>
              </TextArea>
            </DivTextArea>
          </DivForm>
          <DivForm>
            <DivTituloForm>Comunidades Tradicionais</DivTituloForm>

            <DivTextArea>
              <label>Nome das Comunidades Beneficiadas</label>
              <TextArea>
                <textarea
                  ref={txtArea}
                  {...register("ct_nomes_comunidades")}
                  defaultValue={isGestao?.nomes_comunidades_beneficiadas}
                  onChange={handleOnChange}
                ></textarea>
              </TextArea>

              <label>Breve descrição</label>
              <TextArea>
                <textarea
                  ref={txtArea}
                  {...register("ct_descricao")}
                  defaultValue={isGestao?.ct_descricao}
                  onChange={handleOnChange}
                ></textarea>
              </TextArea>
            </DivTextArea>
          </DivForm>
          <SubmitButton type="submit">Gravar</SubmitButton>
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
                <SubmitButtonModal type="submit">Gravar</SubmitButtonModal>

                <ConteudoModal>
                  <InputG>
                    <label>
                      Nome<span> *</span>
                    </label>
                    <input
                      {...register("ga_nome_representante")}
                      defaultValue={isGestao?.ga_nome_representante}
                      onChange={handleOnChange}
                      type="text"
                    ></input>
                  </InputG>
                  <InputP>
                    <label>
                      Cargo<span> *</span>
                    </label>
                    <input
                      {...register("ga_cargo")}
                      defaultValue={isGestao?.ga_cargo}
                      onChange={handleOnChange}
                      type="text"
                    ></input>
                  </InputP>
                  <InputP>
                    <label>
                      Telefone<span> *</span>
                    </label>
                    <input
                      {...register("ga_telefone")}
                      defaultValue={isGestao?.ga_telefone}
                      onChange={handleOnChange}
                      type="text"
                    ></input>
                  </InputP>
                  <InputM>
                    <label>
                      Email<span> *</span>
                    </label>
                    <input
                      {...register("ga_email")}
                      defaultValue={isGestao?.ga_email}
                      onChange={handleOnChange}
                      type="text"
                    ></input>
                  </InputM>
                </ConteudoModal>
              </Form>
            </Modal>
          </ContainerModal>
        )}
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

  const resPoliticas = await apiClient.get("getPoliticas", {
    params: { id_municipio: usuario[0].id_municipio },
  });
  const politicas = await resPoliticas.data;

  const resPlanos = await apiClient.get("getPlanos", {
    params: { id_municipio: usuario[0].id_municipio },
  });
  const planos = await resPlanos.data;

  const resGestao = await apiClient.get("getGestao", {
    params: { id_municipio: usuario[0].id_municipio },
  });
  const gestao = await resGestao.data;

  const resParticipacao = await apiClient.get("getParticipacaoControleSocial", {
    params: { id_municipio: usuario[0].id_municipio },
  });
  const participacoes = await resParticipacao.data;

  const resRepresentantes = await apiClient.get("getRepresentantesServicos", {
    params: { id_municipio: usuario[0].id_municipio },
  });
  const representantes = await resRepresentantes.data;

  return {
    props: {
      municipio,
      gestao,
      representantes,
      politicas,
      planos,
      participacoes,
    },
  };
};
