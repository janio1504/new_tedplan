/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { anosSelect } from "../../util/util";
import {
  Container,
  DivCenter,
  DivFormConteudoCadastro,
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
  DivTituloFormResiduo,
  DivFormResiduo,
  DivBorder,
  LabelCenter,
  DivFormConteudoModal,
  TabelaCadastro,
  ConteudoModalResiduoSolido,
  InputPP,
} from "../../styles/residuos-solidos";
import HeadIndicadores from "../../components/headIndicadores";
import { getAPIClient } from "../../services/axios";
import MenuIndicadores from "../../components/MenuIndicadoresCadastro";
import { parseCookies } from "nookies";
import { GetServerSideProps } from "next";
import Router from "next/router";
import { AuthContext } from "../../contexts/AuthContext";
import unidade_escuro from "../../img/Icono-unidadeDeProcessamento.png";
import coleta_claro from "../../img/Icono-coleta-claro.png";
import Image from "next/image";
import Editar from "../../img/editar.png";
import Excluir from "../../img/excluir.png";
import {
  Tabela,
  ContainerModal,
  FormCadastro,
  Modal,
  CloseModalButton,
  ConteudoModal,
  FormModal,
  SubmitButtonModal,
  DivBotaoAdicionar,
  TabelaModal,
  ModalForm,
  ModalFormUnidade,
  DivBotao,
  IconeColeta,
  BotaoResiduos,
  Actions,
  DivTituloUnidadesCadastradas,
  ModalStepperContainer,
  ModalStepperWrapper,
  ModalStepButton,
  ModalStepLabel,
  ModalStepContent,
  ModalStepperNavigation,
  ModalStepperButton,
} from "../../styles/residuo-solidos-in";
import api from "../../services/api";
import { BotaoEditar } from "../../styles/dashboard";
import MenuHorizontal from "../../components/MenuHorizontal";
import { Footer } from "../../styles";
import { getMunicipio } from "../../services/municipio";
import { BreadCrumbStyle } from "@/styles/indicadores";
import Link from "next/link";
interface IMunicipio {
  id_municipio: string;
  municipio_codigo_ibge: string;
  municipio_nome: string;
}

interface MunicipioProps {
  municipio: IMunicipio[];
}

export default function ResiduosUnidades({ municipio }: MunicipioProps) {
  const { usuario, anoEditorSimisab, isEditor } = useContext(AuthContext);
  const [isMunicipio, setMunicipio] = useState<IMunicipio | any>(municipio);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const [residuosRecebidos, setResiduosRecebidos] = useState(null);
  const [municipios, setMunicipios] = useState<IMunicipio | any>(null);
  const [content, setContent] = useState("");
  const [dadosUnidade, setDadosUnidade] = useState(null);
  const [unidades, setUnidades] = useState(null);
  const [unidadeProcessamento, setUnidadeProcessamento] = useState(null);
  const [visibleUnidade, setVisibleUnidade] = useState(false);
  const [visibleCadastro, setVisibleCadastro] = useState(true);
  const [visibleResiduosRecebidos, setVisibleResiduosRecebidos] =
    useState(false);
  const [anoSelected, setAnoSelected] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [disabledProximo, setDisabledProximo] = useState(false);
  const [idMunicipio, setIdMunicipio] = useState(null);
  const [dadosMunicipio, setDadosMunicipio] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (anoEditorSimisab) {
      setAnoSelected(anoEditorSimisab);
      getResiduosRecebidos(anoEditorSimisab);
      setDisabledProximo(true);
    } else {
      getResiduosRecebidos(anoSelected);
    }
    getUnidadesProcessamento();
    getMunicipios();
    getMunicipio();
  }, []);

  async function getMunicipio() {
    const res = await api
      .get("getMunicipio", {
        params: { id_municipio: usuario.id_municipio },
      })
      .then((response) => {
        setDadosMunicipio(response.data);
      });
  }

  function handleOnChange(content) {
    setContent(content.target.value);
  }
  function handleCloseUnidade() {
    Router.reload();
    setVisibleUnidade(false);
    setVisibleCadastro(true);
  }
  function handleOpenUnidade() {
    setVisibleUnidade(true);
  }

  async function getResiduosRecebidos(ano) {
    const res = await api
      .post("list-residuos-recebidos", { ano: ano })
      .then((response) => {
        setResiduosRecebidos(response.data);
      });
  }

  async function getMunicipios() {
    await api.get("getMunicipios").then((response) => {
      setMunicipios(response.data);
    });
  }

  async function handleCreateResiduosRecebidos(data) {
    data.id_residuos_unidade_processamento =
      dadosUnidade?.id_residuos_unidade_processamento;
    data.id_quant_residuos_recebidos =
      residuosRecebidos?.id_quant_residuos_recebidos;
    data.ano = anoSelected;
    data.id_municipio = idMunicipio;

    data.UP080 =
      (data.UP007
        ? parseFloat(data.UP007.replace(".", "").replace(",", "."))
        : 0) +
      (data.UP008
        ? parseFloat(data.UP008.replace(".", "").replace(",", "."))
        : 0) +
      (data.UP009
        ? parseFloat(data.UP009.replace(".", "").replace(",", "."))
        : 0) +
      (data.UP010
        ? parseFloat(data.UP010.replace(".", "").replace(",", "."))
        : 0) +
      (data.UP067
        ? parseFloat(data.UP067.replace(".", "").replace(",", "."))
        : 0) +
      (data.UP011
        ? parseFloat(data.UP011.replace(".", "").replace(",", "."))
        : 0);

    const resCad = await api
      .post("create-residuos-recebidos", data)
      .then((response) => {
        toast.success("Sucesso!", { position: "top-right", autoClose: 5000 });
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
    getResiduosRecebidos(anoSelected);
  }

  function handleOpenResiduosRecebidos() {
    setVisibleResiduosRecebidos(true);
  }
  function handleCloseResiduosRecebidos() {
    setVisibleResiduosRecebidos(false);
  }

  async function handleCadastroDadosUP(data) {   
     if (!isEditor) {
          toast.error("Você não tem permissão para editar!", { position: "top-right", autoClose: 5000 });
          return;
        }

    data.id_unidade_processamento = Number(
      unidadeProcessamento.id_unidade_processamento
    );
    if (anoSelected === null || anoSelected === "Selecionar") {
      toast.error("Selecione um ano!", { position: "top-right", autoClose: 5000 });
      return;
    }

    data.UP079a ? (data.UP079 = data.UP079a) : data.UP079;
    data.UP051a ? (data.UP051 = data.UP051a) : data.UP051;
    data.UP001a ? (data.UP001 = data.UP001a) : data.UP001;

    data.id_residuos_unidade_processamento =
      dadosUnidade?.id_residuos_unidade_processamento;
    data.id_municipio = usuario.id_municipio;
    data.ano = anoSelected;

    
   
    const resCad = await api
      .post("create-dados-unidade-processamento", data)
      .then((response) => {
        toast.success("Dados gravados com sucesso!", { position: "top-right", autoClose: 5000 });
        getUnidadesProcessamento();
      })
      .catch((error) => {
        toast.error("Aconteceu o seguinte erro: ", { position: "top-right", autoClose: 5000 });
      });
    const id = unidadeProcessamento.id_unidade_processamento;
    const ano = anoSelected || anoEditorSimisab;
    getDadosUnidadeProcessamento({ id, ano });
  }

  async function handleCadastroUnidadeProcessamento(data) {
    if (!isEditor) {
          toast.error("Você não tem permissão para editar!", { position: "top-right", autoClose: 5000 });
          return;
        }

    data.id_municipio = usuario.id_municipio;

    if (!usuario.id_municipio) {
      toast.error("Não existe id_municipio, entre novamente no sistema!", { position: "top-right", autoClose: 5000 });
      return;
    }

    const resCad = await api
      .post("create-unidade-processamento", data)
      .then((response) => {
        toast.success("Dados gravados com sucesso!", { position: "top-right", autoClose: 5000 });
        getUnidadesProcessamento();
      })
      .catch((error) => {
        toast.error("Aconteceu o seguinte erro: " + error, {
          position: "top-right",
          autoClose: 7000,
        });
      });
  }

  async function getUnidadesProcessamento() {
    const ano = anoSelected;
    const id_municipio = usuario?.id_municipio;
    const res = await api
      .post("list-unidades-processamento", {
        ano: ano,
        id_municipio: id_municipio,
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    setUnidades(res);
  }

  async function getUnidadeProcessamento(id) {
    const res = await api
      .post("get-unidade-processamento", {
        id_unidade_processamento: id,
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    setVisibleUnidade(true);
    setUnidadeProcessamento(res[0]);
  }

  async function getDadosUnidadeProcessamento({ id, ano }) {
    const res = await api
      .post("get-dados-unidade-processamento", {
        id_unidade_processamento: id,
        ano: ano,
        id_municipio: usuario?.id_municipio,
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    setDadosUnidade(res[0]);
    setVisibleCadastro(false);
  }

  async function handleDelete(id) {
    const del = confirm("Voçê tem certeza que quer remover o item?");
    if (del) {
      await api
        .delete("detete-unidade-processamento/" + id)
        .then((response) => {
          toast.success("Sucesso!", { position: "top-right", autoClose: 5000 });
          getUnidadesProcessamento();
        })
        .catch((error) => {
          toast.error("Aconteceu o seguinte erro: " + error, {
            position: "top-right",
            autoClose: 7000,
          });
        });
    }
  }

  function unidadeColeta() {
    Router.push("/indicadores/residuos-indicadores-coleta");
  }

  const handleNextStep = () => {
    
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrevStep = () => {
    
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  function seletcAno(ano) {
    if (ano !== "") {
      const id = unidadeProcessamento.id_unidade_processamento;
      setDisabledProximo(true);
      setAnoSelected(ano);
      getResiduosRecebidos(ano);
      getDadosUnidadeProcessamento({ id, ano });
    } else {
      setDisabledProximo(false);
    }
  }

  return (
    <Container>
      
      <HeadIndicadores usuarios={[]}></HeadIndicadores>
      <MenuHorizontal
        municipio={dadosMunicipio?.municipio_nome}
      ></MenuHorizontal>
      <MenuIndicadores></MenuIndicadores>
      
      <DivCenter>
        <BreadCrumbStyle isCollapsed={isCollapsed}>
                              <nav>
                                <ol>
                                  <li>
                                    <Link href="/indicadores/home_indicadores">Home</Link>
                                    <span> / </span>
                                  </li>
                                  <li>
                                    <Link href="./prestacao-servicos-snis">Prestação de Serviços SNIS</Link>
                                    <span> / </span>
                                  </li>
                                  <li>
                                    <span>Resíduos</span>
                                  </li>
                                </ol>
                              </nav>
        </BreadCrumbStyle>
        <DivFormResiduo>
          <DivTituloFormResiduo>Resíduos Sólidos</DivTituloFormResiduo>
          <DivCenter>
            <DivBotao>
              <IconeColeta>
                {" "}
                <Image src={unidade_escuro} alt="Simisab" />
                <BotaoResiduos>Processamento</BotaoResiduos>
              </IconeColeta>
              <IconeColeta>
                {" "}
                <Image
                  onClick={() => unidadeColeta()}
                  src={coleta_claro}
                  alt="Simisab"
                />
                <BotaoResiduos onClick={() => unidadeColeta()}>
                  Coleta
                </BotaoResiduos>
              </IconeColeta>
            </DivBotao>
          </DivCenter>
          {visibleCadastro && (
            <FormCadastro
              onSubmit={handleSubmit(handleCadastroUnidadeProcessamento)}
            >
              <table>
                <tbody>
                  <tr>
                    <td>
                      <label style={{ marginLeft: "10px" }}>Município</label>
                    </td>
                    <td>
                      <label style={{ marginLeft: "10px" }}>
                        Nome da Unidade
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <InputM>
                        <select
                          aria-invalid={errors.value ? "true" : "false"}
                          {...register("id_municipio_unidade_processamento", {
                            required: true,
                          })}
                        >
                          <option value="">Selecione</option>
                          {municipios?.map((municipio) => (
                            <option
                              value={municipio.id_municipio}
                              key={municipio.id_municipio}
                            >
                              {municipio.nome}
                            </option>
                          ))}
                        </select>

                        {errors.id_municipio_unidade_processamento &&
                          errors.id_municipio_unidade_processamento.type && (
                            <span style={{ color: "red" }}>
                              O campo é obrigatório!
                            </span>
                          )}
                      </InputM>
                    </td>
                    <td colSpan={2}>
                      <InputGG>
                        <input
                          aria-invalid={errors.value ? "true" : "false"}
                          {...register("nome_unidade_processamento", {
                            required: true,
                          })}
                        ></input>
                        {errors.nome_unidade_processamento &&
                          errors.nome_unidade_processamento.type && (
                            <span style={{ color: "red" }}>
                              O campo é obrigatório!
                            </span>
                          )}
                      </InputGG>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <label style={{ marginLeft: "10px" }}>CNPJ</label>
                    </td>
                    <td>
                      <label style={{ marginLeft: "10px" }}>Endereço</label>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <InputM>
                        <input
                          style={{ width: 220 }}
                          aria-invalid={errors.value ? "true" : "false"}
                          {...register("cnpj")}
                          onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        ></input>
                        {errors.cnpj && errors.cnpj.type && (
                          <span style={{ color: "red" }}>
                            O campo é obrigatório!
                          </span>
                        )}
                      </InputM>
                    </td>
                    <td colSpan={2}>
                      <InputGG>
                        <input
                          aria-invalid={errors.value ? "true" : "false"}
                          {...register("endereco", { required: true })}
                        ></input>
                        {errors.endereco && errors.endereco.type && (
                          <span style={{ color: "red" }}>
                            O campo é obrigatório!
                          </span>
                        )}
                      </InputGG>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <label style={{ marginLeft: "10px" }}>
                        Tipo de Unidade
                      </label>
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>
                      <InputM>
                        <select
                          {...register("tipo_unidade")}
                          onChange={handleOnChange}
                        >
                          <option value="">Selecione</option>
                          <option>Lixão</option>
                          <option>Queima em forno de qualquer tipo</option>
                          <option>
                            Unidade de manejo de galhadas e podas{" "}
                          </option>
                          <option>Unidade de transbordo </option>
                          <option>
                            Área de reciclagem de RCC (unidade de reciclagem de
                            entulho){" "}
                          </option>
                          <option>
                            Aterro de resíduos da construção civil (inertes)
                          </option>
                          <option>
                            Área de transbordo e triagem de RCC e volumosos
                            (ATT)
                          </option>
                          <option>Aterro controlado </option>
                          <option>Aterro sanitário </option>
                          <option>Vala específica de RSS</option>
                          <option>Unidade de triagem (galpão ou usina)</option>
                          <option>
                            Unidade de compostagem (pátio ou usina){" "}
                          </option>
                          <option>Unidade de tratamento por incineração</option>
                          <option>
                            Unidade de tratamento por microondas ou autoclave{" "}
                          </option>
                          <option>Outra</option>
                        </select>

                        {errors.UP079a && errors.UP079a.type && (
                          <span>O campo é obrigatório!</span>
                        )}
                      </InputM>
                    </td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>

              <SubmitButtonModal type="submit">
                ADICIONAR UNIDADE
              </SubmitButtonModal>
            </FormCadastro>
          )}
          <DivTituloUnidadesCadastradas></DivTituloUnidadesCadastradas>
          <Tabela>
            <table cellSpacing={0}>
              <thead>
                <tr>
                  <th>Município</th>
                  <th>Nome da Unidade</th>
                  <th>CNPJ</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {unidades?.map((unidade, index) => (
                  <>
                    <tr key={index}>
                      <td>{unidade.nome}</td>
                      <td>{unidade.nome_unidade_processamento}</td>
                      <td>{unidade.cnpj}</td>
                      <td style={{ textAlign: "center", width: "100px" }}>
                        <Actions>
                          <Image
                            title="Editar"
                            onClick={() => {
                              getUnidadeProcessamento(
                                unidade.id_unidade_processamento
                              );
                            }}
                            width={30}
                            height={30}
                            src={Editar}
                            alt=""
                          />
                          <Image
                            onClick={() =>
                              handleDelete(unidade.id_unidade_processamento)
                            }
                            title="Excluir"
                            width={30}
                            height={30}
                            src={Excluir}
                            alt=""
                          />
                        </Actions>
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </Tabela>
        </DivFormResiduo>
      </DivCenter>

      {visibleUnidade && (
        <ContainerModal>
          <ModalFormUnidade>
            <CloseModalButton
              type="button"
              onClick={handleCloseUnidade}
              aria-label="Fechar modal"
            >
              <span></span>
            </CloseModalButton>

            <Form onSubmit={handleSubmit(handleCadastroDadosUP)}>
              <ModalStepperContainer>
                <ModalStepperWrapper>
                  <div>
                    <ModalStepButton
                    active={currentStep === 0}
                    completed={currentStep > 0}
                    onClick={() => setCurrentStep(0)}
                    >
                      1
                    </ModalStepButton>
                    <ModalStepLabel active={currentStep === 0}></ModalStepLabel>
                  </div>

                  <div>
                    <ModalStepButton
                      active={currentStep === 1}
                      completed={currentStep > 1}
                      onClick={() => setCurrentStep(1)}
                    >
                      2
                    </ModalStepButton>
                    <ModalStepLabel active={currentStep === 1}></ModalStepLabel>
                  </div>

                  <div>
                    <ModalStepButton
                      active={currentStep === 2}
                      completed={currentStep > 2}
                      onClick={() => setCurrentStep(2)}
                    >
                      3
                    </ModalStepButton>
                    <ModalStepLabel active={currentStep === 2}></ModalStepLabel>
                  </div>

                  <div>
                    <ModalStepButton
                      active={currentStep === 3}
                      completed={currentStep > 3}
                      onClick={() => setCurrentStep(3)}
                    >
                      4
                    </ModalStepButton>
                    <ModalStepLabel active={currentStep === 3}></ModalStepLabel>
                  </div>
                </ModalStepperWrapper>

                <ModalStepContent active={currentStep === 0}>
                  <ConteudoModalResiduoSolido>
                    <DivTitulo>
                      <DivTituloConteudo>Dados cadastrais</DivTituloConteudo>
                    </DivTitulo>
                    <div
                      style={{
                        marginTop: "10px",
                        marginBottom: "10px",
                        padding: "10px",
                        borderTop: "1px solid #ccc",
                        borderBottom: "1px solid #ccc",
                      }}
                    >
                      <label style={{ fontWeight: "bold" }}>
                        Selecione um ano para visualização dos dados:
                      </label>
                      <InputM>
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
                      </InputM>
                    </div>
                    <table>
                      <thead>
                        <tr>
                          <th>Código SNIS</th>
                          <th>Descrição</th>
                          <th>Ano {anoSelected}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>UP079</td>
                          <td>
                            <InputG>
                              Município onde se localiza a unidade
                            </InputG>
                          </td>
                          <td>
                            <InputG>
                              <input
                                disabled={true}
                                {...register("UP079")}
                                defaultValue={
                                  unidadeProcessamento?.municipio_unidade_processamento
                                }
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputG>
                          </td>
                        </tr>
                        <tr>
                          <td>UP003</td>
                          <td>
                            <InputG>Tipo de unidade</InputG>
                          </td>

                          <td>
                            <InputG>
                              <input
                                disabled={true}
                                {...register("UP003")}
                                defaultValue={
                                  unidadeProcessamento?.tipo_unidade
                                }
                                onChange={handleOnChange}
                              ></input>
                            </InputG>
                          </td>
                        </tr>
                        <tr>
                          <td>UP001</td>
                          <td>
                            <InputG>Nome da unidade</InputG>
                          </td>
                          <td>
                            <InputG>
                              <input
                                disabled={true}
                                {...register("UP001")}
                                defaultValue={
                                  unidadeProcessamento?.nome_unidade_processamento
                                }
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputG>
                          </td>
                        </tr>
                        <tr>
                          <td>UP065</td>
                          <td>
                            <InputG>Propriétario</InputG>
                          </td>

                          <td>
                            <InputG>
                              <input
                                {...register("UP065")}
                                defaultValue={unidadeProcessamento?.up065}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputG>
                          </td>
                        </tr>
                        <tr>
                          <td>UP087</td>
                          <td>
                            <InputG>Localização</InputG>
                          </td>
                          <td>
                            <InputG>
                              <input
                                disabled={true}
                                {...register("UP087")}
                                defaultValue={unidadeProcessamento?.endereco}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputG>
                          </td>
                        </tr>
                        <tr>
                          <td>UP051</td>
                          <td>
                            <InputG>
                              A unidade de processamento esteve em operação no
                              ano de referência?
                            </InputG>
                          </td>

                          <td>
                            <InputG>
                              <select
                                {...register("UP051")}
                                defaultValue={unidadeProcessamento?.up051}
                                onChange={handleOnChange}
                              >
                                <option value="">
                                  {unidadeProcessamento?.up051
                                    ? unidadeProcessamento?.up051
                                    : "Opções"}
                                </option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                              </select>
                            </InputG>
                          </td>
                        </tr>

                        <tr>
                          <td>UP002</td>
                          <td>
                            <InputG>Ano de início da operação</InputG>
                          </td>
                          <td>
                            <InputG>
                              <input
                                {...register("UP002")}
                                defaultValue={unidadeProcessamento?.up002}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputG>
                          </td>
                        </tr>
                        <tr>
                          <td>UP066</td>
                          <td>
                            <InputG>Ano de cadastro da unidade</InputG>
                          </td>

                          <td>
                            <InputG>
                              <input
                                {...register("UP066")}
                                defaultValue={unidadeProcessamento?.up066}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputG>
                          </td>
                        </tr>

                        <tr>
                          <td>UP004</td>
                          <td>
                            <InputG>Operador da unidade</InputG>
                          </td>
                          <td>
                            <InputG>
                              <select
                                {...register("UP004")}
                                onChange={handleOnChange}
                              >
                                <option value="">
                                  {unidadeProcessamento?.up004
                                    ? unidadeProcessamento?.up004
                                    : "Opções"}
                                </option>
                                <option>Prefeitura</option>
                                <option>Empresa privada</option>
                                <option>Associação de catadores</option>
                                <option>Consórcio intermunicipal</option>
                                <option>Outro</option>
                              </select>
                            </InputG>
                          </td>
                        </tr>
                        <tr>
                          <td>UP084</td>
                          <td>
                            <InputG>
                              A unidade (no caso de vala de RSS) está situada na
                              mesma área de outra unidade?
                            </InputG>
                          </td>
                          <td>
                            <InputG>
                              <select
                                {...register("UP084")}
                                defaultValue={unidadeProcessamento?.up084}
                              >
                                <option value="">
                                  {unidadeProcessamento?.up084
                                    ? unidadeProcessamento?.up084
                                    : "Opções"}
                                </option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                              </select>
                            </InputG>
                          </td>
                        </tr>

                        <tr>
                          <td>UP050</td>
                          <td>
                            <InputG>
                              Tipo de licença ambiental emitida pelo orgão de
                              controle ambiental
                            </InputG>
                          </td>
                          <td>
                            <InputG>
                              <select
                                {...register("UP050")}
                                defaultValue={unidadeProcessamento?.up050}
                                onChange={handleOnChange}
                              >
                                <option value="">
                                  {unidadeProcessamento?.up050
                                    ? unidadeProcessamento?.up050
                                    : "Opções"}
                                </option>
                                <option>Operação</option>
                                <option>Instalação</option>
                                <option>Prévia</option>
                                <option>Não existe</option>
                                <option>Outro tipo.</option>
                              </select>
                            </InputG>
                          </td>
                        </tr>
                        <tr>
                          <td>UP012</td>
                          <td>
                            <InputG>
                              Recebeu resíduos de outros municípios
                            </InputG>
                          </td>
                          <td>
                            <InputG>
                              <select
                                {...register("UP012")}
                                onChange={handleOnChange}
                              >
                                <option value="">
                                  {unidadeProcessamento?.up012
                                    ? unidadeProcessamento?.up012
                                    : "Opções"}
                                </option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                              </select>
                            </InputG>
                          </td>
                        </tr>

                        <tr>
                          <td>UP085</td>
                          <td>
                            <InputG>
                              Nome do titular da licença de operação (Prefeitura
                              ou Empresa)
                            </InputG>
                          </td>
                          <td>
                            <InputG>
                              <input
                                {...register("UP085")}
                                defaultValue={unidadeProcessamento?.up085}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputG>
                          </td>
                        </tr>
                        <tr>
                          <td>UP086</td>
                          <td>
                            <InputG>
                              CNPJ do titular de Licença de Operação
                            </InputG>
                          </td>
                          <td>
                            <InputG>
                              <input
                                disabled={true}
                                {...register("UP086")}
                                defaultValue={unidadeProcessamento?.cnpj}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputG>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </ConteudoModalResiduoSolido>
                </ModalStepContent>

                <ModalStepContent active={currentStep === 1}>
                  <DivFormConteudoModal>
                    <DivTitulo>
                      <DivTituloConteudo>
                        Serviços de coleta seletiva
                      </DivTituloConteudo>
                    </DivTitulo>
                    <table>
                      <thead>
                        <tr>
                          <th>Código SNIS</th>
                          <th>Descrição</th>
                          <th>Ano {anoSelected}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>UP027</td>
                          <td>
                            <InputG>Existe cercamento da área?</InputG>
                          </td>
                          <td>
                            <InputP>
                              <select
                                {...register("UP027")}
                                defaultValue={dadosUnidade?.up027}
                                onChange={handleOnChange}
                              >
                                <option value="">
                                  {dadosUnidade?.up027
                                    ? dadosUnidade?.up027
                                    : "Opções"}
                                </option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                              </select>
                            </InputP>
                          </td>
                        </tr>
                        <tr>
                          <td>UP028</td>
                          <td>
                            <InputGG>
                              Existe instaloções administrativas ou de apoio aos
                              trabalhadores?
                            </InputGG>
                          </td>
                          <td>
                            <InputP>
                              <select
                                {...register("UP028")}
                                defaultValue={dadosUnidade?.up028}
                                onChange={handleOnChange}
                              >
                                <option value="">
                                  {dadosUnidade?.up028
                                    ? dadosUnidade?.up028
                                    : "Opções"}
                                </option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                              </select>
                            </InputP>
                          </td>
                        </tr>
                        <tr>
                          <td>UP029</td>
                          <td>
                            <InputGG>
                              Existe impermeabilização da base do aterro(com
                              argila ou manta)?
                            </InputGG>
                          </td>
                          <td>
                            <InputP>
                              <select
                                {...register("UP029")}
                                defaultValue={dadosUnidade?.up029}
                                onChange={handleOnChange}
                              >
                                <option value="">
                                  {dadosUnidade?.up029
                                    ? dadosUnidade?.up029
                                    : "Opções"}
                                </option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                              </select>
                            </InputP>
                          </td>
                        </tr>
                        <tr>
                          <td>UP030</td>
                          <td>
                            <InputGG>
                              Qual a frequência do recolhimento de resíduos?
                            </InputGG>
                          </td>
                          <td>
                            <InputG>
                              <select
                                {...register("UP030")}
                                defaultValue={dadosUnidade?.up030}
                                onChange={handleOnChange}
                              >
                                <option value="">
                                  {dadosUnidade?.up030
                                    ? dadosUnidade?.up030
                                    : "Opções"}
                                </option>
                                <option>Não e realizado</option>
                                <option>Diária</option>
                                <option>Semanal</option>
                                <option>Quinzenal</option>
                              </select>
                            </InputG>
                          </td>
                        </tr>
                        <tr>
                          <td>UP031</td>
                          <td>
                            <InputGG>Existe drenagem de gases?</InputGG>
                          </td>
                          <td>
                            <InputP>
                              <select
                                {...register("UP031")}
                                defaultValue={dadosUnidade?.up031}
                                onChange={handleOnChange}
                              >
                                <option value="">
                                  {dadosUnidade?.up031
                                    ? dadosUnidade?.up031
                                    : "Opções"}
                                </option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                              </select>
                            </InputP>
                          </td>
                        </tr>
                        <tr>
                          <td>UP052</td>
                          <td>
                            <InputGG>
                              Existe algum tipo de reaproveitamento de gases
                              drenados?
                            </InputGG>
                          </td>
                          <td>
                            <InputP>
                              <select
                                {...register("UP052")}
                                defaultValue={dadosUnidade?.up052}
                                onChange={handleOnChange}
                              >
                                <option value="">
                                  {dadosUnidade?.up052
                                    ? dadosUnidade?.up052
                                    : "Opções"}
                                </option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                              </select>
                            </InputP>
                          </td>
                        </tr>
                        <tr>
                          <td>UP032</td>
                          <td>
                            <InputGG>
                              Existe sistema de drenagem do liquído
                              percola(chorume)?
                            </InputGG>
                          </td>
                          <td>
                            <InputP>
                              <select
                                {...register("UP032")}
                                defaultValue={dadosUnidade?.up032}
                                onChange={handleOnChange}
                              >
                                <option value="">
                                  {dadosUnidade?.up032
                                    ? dadosUnidade?.up032
                                    : "Opções"}
                                </option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                              </select>
                            </InputP>
                          </td>
                        </tr>
                        <tr>
                          <td>UP033</td>
                          <td>
                            <InputGG>
                              Existe unidade de tratamento do líquido percolado
                              na área da unidade?
                            </InputGG>
                          </td>
                          <td>
                            <InputP>
                              <select
                                {...register("UP033")}
                                defaultValue={dadosUnidade?.up033}
                                onChange={handleOnChange}
                              >
                                <option value="">
                                  {dadosUnidade?.up033
                                    ? dadosUnidade?.up033
                                    : "Opções"}
                                </option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                              </select>
                            </InputP>
                          </td>
                        </tr>
                        <tr>
                          <td>UP053</td>
                          <td>
                            <InputGG>
                              Existe unidade de tratamento do líquido percolado
                              localizado fora da área da unidade?
                            </InputGG>
                          </td>
                          <td>
                            <InputP>
                              <select
                                {...register("UP053")}
                                defaultValue={dadosUnidade?.up053}
                                onChange={handleOnChange}
                              >
                                <option value="">
                                  {dadosUnidade?.up053
                                    ? dadosUnidade?.up053
                                    : "Opções"}
                                </option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                              </select>
                            </InputP>
                          </td>
                        </tr>
                        <tr>
                          <td>UP054</td>
                          <td>
                            <InputGG>
                              Existe sistema de drenagem de águas pluviais?
                            </InputGG>
                          </td>
                          <td>
                            <InputP>
                              <select
                                {...register("UP054")}
                                defaultValue={dadosUnidade?.up054}
                                onChange={handleOnChange}
                              >
                                <option value="">
                                  {dadosUnidade?.up054
                                    ? dadosUnidade?.up054
                                    : "Opções"}
                                </option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                              </select>
                            </InputP>
                          </td>
                        </tr>
                        <tr>
                          <td>UP034</td>
                          <td>
                            <InputGG>
                              Existe recirculação do líquido percolado
                              (chorume)?
                            </InputGG>
                          </td>
                          <td>
                            <InputP>
                              <select
                                {...register("UP034")}
                                defaultValue={dadosUnidade?.up034}
                                onChange={handleOnChange}
                              >
                                <option value="">
                                  {dadosUnidade?.up034
                                    ? dadosUnidade?.up034
                                    : "Opções"}
                                </option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                              </select>
                            </InputP>
                          </td>
                        </tr>

                        <tr>
                          <td>UP035</td>
                          <td>
                            <InputGG>
                              Há vigilância diurna e norturna na unidade?
                            </InputGG>
                          </td>
                          <td>
                            <InputP>
                              <select
                                {...register("UP035")}
                                defaultValue={dadosUnidade?.up035}
                                onChange={handleOnChange}
                              >
                                <option value="">
                                  {dadosUnidade?.up035
                                    ? dadosUnidade?.up035
                                    : "Opções"}
                                </option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                              </select>
                            </InputP>
                          </td>
                        </tr>

                        <tr>
                          <td>UP036</td>
                          <td>
                            <InputGG>
                              Há algum tipo de monitoramento ambiental da
                              instalação?
                            </InputGG>
                          </td>
                          <td>
                            <InputP>
                              <select
                                {...register("UP036")}
                                defaultValue={dadosUnidade?.up036}
                                onChange={handleOnChange}
                              >
                                <option value="">
                                  {dadosUnidade?.up036
                                    ? dadosUnidade?.up036
                                    : "Opções"}
                                </option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                              </select>
                            </InputP>
                          </td>
                        </tr>
                        <tr>
                          <td>UP037</td>
                          <td>
                            <InputGG>
                              É feita queima de resíduos a céu aberto?
                            </InputGG>
                          </td>
                          <td>
                            <InputP>
                              <select
                                {...register("UP037")}
                                defaultValue={dadosUnidade?.up037}
                                onChange={handleOnChange}
                              >
                                <option value="">
                                  {dadosUnidade?.up037
                                    ? dadosUnidade?.up037
                                    : "Opções"}
                                </option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                              </select>
                            </InputP>
                          </td>
                        </tr>

                        <tr>
                          <td>UP038</td>
                          <td>
                            <InputGG>
                              Há presença de animais(exceto aves) na
                              área(porcos, cavalos, vacas...)?
                            </InputGG>
                          </td>
                          <td>
                            <InputP>
                              <select
                                {...register("UP038")}
                                defaultValue={dadosUnidade?.up038}
                                onChange={handleOnChange}
                              >
                                <option value="">
                                  {dadosUnidade?.up038
                                    ? dadosUnidade?.up038
                                    : "Opções"}
                                </option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                              </select>
                            </InputP>
                          </td>
                        </tr>

                        <tr>
                          <td>UP081</td>
                          <td>
                            <InputGG>
                              Existem catadores de materiais recicláveis?
                            </InputGG>
                          </td>
                          <td>
                            <InputP>
                              <select
                                {...register("UP081")}
                                defaultValue={dadosUnidade?.up081}
                                onChange={handleOnChange}
                              >
                                <option value="">
                                  {dadosUnidade?.up081
                                    ? dadosUnidade?.up081
                                    : "Opções"}
                                </option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                              </select>
                            </InputP>
                          </td>
                        </tr>

                        <tr>
                          <td>UP082</td>
                          <td>
                            <InputGG>
                              Quantidade de catadores até 14 anos?
                            </InputGG>
                          </td>
                          <td>
                            <input
                              style={{
                                width: 100,
                                padding: 2,
                                textAlign: "right",
                                paddingRight: 10,
                              }}
                              {...register("UP082")}
                              defaultValue={dadosUnidade?.up082}
                              onChange={handleOnChange}
                              type="text"
                            ></input>
                          </td>
                          <td>Catadores</td>
                        </tr>

                        <tr>
                          <td>UP083</td>
                          <td>
                            <InputGG>
                              Quantidade de catadores maiores de 14 anos?
                            </InputGG>
                          </td>
                          <td>
                            <input
                              style={{
                                width: 100,
                                padding: 2,
                                textAlign: "right",
                                paddingRight: 10,
                              }}
                              {...register("UP083")}
                              defaultValue={dadosUnidade?.up083}
                              onChange={handleOnChange}
                              type="text"
                            ></input>
                          </td>
                          <td>Catadores</td>
                        </tr>

                        <tr>
                          <td>UP039</td>
                          <td>
                            <InputGG>
                              há domicílios de catadores na areá da unidade?
                            </InputGG>
                          </td>
                          <td>
                            <InputP>
                              <select
                                {...register("UP039")}
                                defaultValue={dadosUnidade?.up039}
                                onChange={handleOnChange}
                              >
                                <option value="">
                                  {dadosUnidade?.up039
                                    ? dadosUnidade?.up039
                                    : "Opções"}
                                </option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                              </select>
                            </InputP>
                          </td>
                        </tr>
                        <tr>
                          <td>UP040</td>
                          <td>
                            <InputGG>
                              Quantidade de domicílios de catadores na área?
                            </InputGG>
                          </td>
                          <td>
                            <input
                              style={{
                                width: 100,
                                padding: 2,
                                textAlign: "right",
                                paddingRight: 10,
                              }}
                              {...register("UP040")}
                              defaultValue={dadosUnidade?.up040}
                              onChange={handleOnChange}
                              type="text"
                            ></input>
                          </td>
                          <td>Domicílios</td>
                        </tr>
                      </tbody>
                    </table>
                  </DivFormConteudoModal>
                </ModalStepContent>

                <ModalStepContent active={currentStep === 2}>
                  <DivFormConteudoModal>
                    <DivTitulo>
                      <DivTituloConteudo>
                        Quantidade de veículos e Equipamentos
                      </DivTituloConteudo>
                    </DivTitulo>
                    <table>
                      <thead>
                        <tr>
                          <th>
                            <span>Tipo de equipamentos</span>
                          </th>
                          <th></th>
                          <th>
                            <InputP>
                              <span>Forma adotada</span>
                            </InputP>
                          </th>
                          <th></th>
                        </tr>
                        <tr>
                          <th></th>
                          <th>
                            <LabelCenter>
                              <InputP>Da prefeitura ou SLU</InputP>
                            </LabelCenter>
                          </th>
                          <th></th>
                          <th>
                            <LabelCenter>
                              <InputP>De empresas contratadas</InputP>
                            </LabelCenter>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td></td>
                          <td>
                            <LabelCenter>
                              <InputP>UP015</InputP>
                            </LabelCenter>
                          </td>
                          <td></td>
                          <td>
                            <LabelCenter>
                              <InputP>UP020</InputP>
                            </LabelCenter>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <InputG>Trato de esteiras</InputG>
                          </td>
                          <td>
                            <InputP>
                              <input
                                {...register("UP015")}
                                defaultValue={dadosUnidade?.up015}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputP>
                          </td>
                          <td></td>
                          <td>
                            <InputP>
                              <input
                                {...register("UP020")}
                                defaultValue={dadosUnidade?.up020}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputP>
                          </td>
                        </tr>
                        <tr>
                          <td></td>
                          <td>
                            <LabelCenter>
                              <InputP>UP016</InputP>
                            </LabelCenter>
                          </td>
                          <td></td>
                          <td>
                            <LabelCenter>
                              <InputP>UP021</InputP>
                            </LabelCenter>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <InputG>Retro-escavadeira</InputG>
                          </td>
                          <td>
                            <InputP>
                              <input
                                {...register("UP016")}
                                defaultValue={dadosUnidade?.up016}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputP>
                          </td>
                          <td></td>
                          <td>
                            <InputP>
                              <input
                                {...register("UP021")}
                                defaultValue={dadosUnidade?.up021}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputP>
                          </td>
                        </tr>
                        <tr>
                          <td></td>
                          <td>
                            <LabelCenter>
                              <InputP>UP017</InputP>
                            </LabelCenter>
                          </td>
                          <td></td>
                          <td>
                            <LabelCenter>
                              <InputP>UP022</InputP>
                            </LabelCenter>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <InputG>Pá carregadeira</InputG>
                          </td>
                          <td>
                            <InputP>
                              <input
                                {...register("UP017")}
                                defaultValue={dadosUnidade?.up017}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputP>
                          </td>
                          <td></td>
                          <td>
                            <InputP>
                              <input
                                {...register("UP022")}
                                defaultValue={dadosUnidade?.up022}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputP>
                          </td>
                        </tr>
                        <tr>
                          <td></td>
                          <td>
                            <LabelCenter>
                              <InputP>UP018</InputP>
                            </LabelCenter>
                          </td>
                          <td></td>
                          <td>
                            <LabelCenter>
                              <InputP>UP023</InputP>
                            </LabelCenter>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <InputG>Caminhão basculante</InputG>
                          </td>
                          <td>
                            <InputP>
                              <input
                                {...register("UP018")}
                                defaultValue={dadosUnidade?.up018}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputP>
                          </td>
                          <td></td>
                          <td>
                            <InputP>
                              <input
                                {...register("UP023")}
                                defaultValue={dadosUnidade?.up023}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputP>
                          </td>
                        </tr>
                        <tr>
                          <td></td>
                          <td>
                            <LabelCenter>
                              <InputP>UP071</InputP>
                            </LabelCenter>
                          </td>
                          <td></td>
                          <td>
                            <LabelCenter>
                              <InputP>UP075</InputP>
                            </LabelCenter>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <InputG>Caminhão-pipa</InputG>
                          </td>
                          <td>
                            <InputP>
                              <input
                                {...register("UP071")}
                                defaultValue={dadosUnidade?.up071}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputP>
                          </td>
                          <td></td>
                          <td>
                            <InputP>
                              <input
                                {...register("UP075")}
                                defaultValue={dadosUnidade?.up075}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputP>
                          </td>
                        </tr>

                        <tr>
                          <td></td>
                          <td>
                            <LabelCenter>
                              <InputP>UP068</InputP>
                            </LabelCenter>
                          </td>
                          <td></td>
                          <td>
                            <LabelCenter>
                              <InputP>UP072</InputP>
                            </LabelCenter>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <InputG>Escavadeira hidráulica</InputG>
                          </td>
                          <td>
                            <InputP>
                              <input
                                {...register("UP068")}
                                defaultValue={dadosUnidade?.up068}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputP>
                          </td>
                          <td></td>
                          <td>
                            <InputP>
                              <input
                                {...register("UP072")}
                                defaultValue={dadosUnidade?.up072}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputP>
                          </td>
                        </tr>

                        <tr>
                          <td></td>
                          <td>
                            <LabelCenter>
                              <InputP>UP069</InputP>
                            </LabelCenter>
                          </td>
                          <td></td>
                          <td>
                            <LabelCenter>
                              <InputP>UP073</InputP>
                            </LabelCenter>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <InputG>Trator com rolo compactador</InputG>
                          </td>
                          <td>
                            <InputP>
                              <input
                                {...register("UP069")}
                                defaultValue={dadosUnidade?.up069}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputP>
                          </td>
                          <td></td>
                          <td>
                            <InputP>
                              <input
                                {...register("UP073")}
                                defaultValue={dadosUnidade?.up073}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputP>
                          </td>
                        </tr>

                        <tr>
                          <td></td>
                          <td>
                            <LabelCenter>
                              <InputP>UP070</InputP>
                            </LabelCenter>
                          </td>
                          <td></td>
                          <td>
                            <LabelCenter>
                              <InputP>UP074</InputP>
                            </LabelCenter>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <InputG>
                              Trator de pneus com rolo compactador
                            </InputG>
                          </td>
                          <td>
                            <InputP>
                              <input
                                {...register("UP070")}
                                defaultValue={dadosUnidade?.up070}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputP>
                          </td>
                          <td></td>
                          <td>
                            <InputP>
                              <input
                                {...register("UP074")}
                                defaultValue={dadosUnidade?.up074}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputP>
                          </td>
                        </tr>

                        <tr>
                          <td></td>
                          <td>
                            <LabelCenter>
                              <InputP>UP019</InputP>
                            </LabelCenter>
                          </td>
                          <td></td>
                          <td>
                            <LabelCenter>
                              <InputP>UP024</InputP>
                            </LabelCenter>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <InputG>Outros</InputG>
                          </td>
                          <td>
                            <InputP>
                              <input
                                {...register("UP019")}
                                defaultValue={dadosUnidade?.up019}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputP>
                          </td>
                          <td></td>
                          <td>
                            <InputP>
                              <input
                                {...register("UP024")}
                                defaultValue={dadosUnidade?.up024}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputP>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </DivFormConteudoModal>
                </ModalStepContent>

                <ModalStepContent active={currentStep === 3}>
                  <DivFormConteudoModal>
                    <DivTitulo>
                      <DivTituloConteudo>
                        Quantidade de resíduos recebidos
                      </DivTituloConteudo>
                    </DivTitulo>
                    <DivBotaoAdicionar>
                      <span
                        onClick={() => {
                          handleOpenResiduosRecebidos();
                        }}
                      >
                        Adicionar
                      </span>
                    </DivBotaoAdicionar>
                    <Tabela>
                      <table cellSpacing={0}>
                        <thead>
                          <tr>
                            <th>Município</th>
                            <th>RDO + RPU</th>
                            <th>RSS</th>
                            <th>RIN</th>
                            <th>RCC</th>
                            <th>RPO</th>
                            <th>Outros</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {residuosRecebidos?.map((rr, key) => (
                            <>
                              <tr key={key}>
                                <td style={{ color: "#FFFFF" }}>
                                  {rr.nome_municipio}
                                </td>
                                <td>{rr.up007}</td>
                                <td>{rr.up008}</td>
                                <td>{rr.up009}</td>
                                <td>{rr.up010}</td>
                                <td>{rr.up067}</td>
                                <td>{rr.up011}</td>
                                <td>{rr.up080}</td>
                              </tr>
                            </>
                          ))}
                        </tbody>
                      </table>
                    </Tabela>
                  </DivFormConteudoModal>
                  {isEditor && (
                    <SubmitButton type="submit">Gravar</SubmitButton>
                  )}
                </ModalStepContent>

                <ModalStepperNavigation>
                  <ModalStepperButton
                    secondary
                    onClick={handlePrevStep}
                    disabled={currentStep === 0}
                  >
                    Voltar
                  </ModalStepperButton>

                  {currentStep === 3 ? (
                    <h1></h1>
                  ) : (
                    disabledProximo && (
                      <ModalStepperButton onClick={handleNextStep}>
                        Proximo
                      </ModalStepperButton>
                    )
                  )}
                </ModalStepperNavigation>
              </ModalStepperContainer>
            </Form>
          </ModalFormUnidade>
        </ContainerModal>
      )}

      {visibleResiduosRecebidos && (
        <ContainerModal>
          
          <Modal>
            <FormModal onSubmit={handleSubmit(handleCreateResiduosRecebidos)}>
              <ConteudoModal>
                <CloseModalButton
                  onClick={() => {
                    handleCloseResiduosRecebidos();
                  }}
                  type="button"
                >
                  <span></span>
                </CloseModalButton>
                <DivFormConteudoModal>
                  <table>
                    <thead>
                      <tr>
                        <th>
                          <label>Municipio</label>
                        </th>
                        <th>
                          <label>RDO + RPU</label>
                        </th>
                        <th>
                          <label>RSS</label>
                        </th>
                        <th>
                          <label>RIN</label>{" "}
                        </th>
                        <th>
                          <label>RCC</label>{" "}
                        </th>
                        <th>
                          <label>RPO</label>
                        </th>
                        <th>
                          <label>Outros</label>
                        </th>
                      </tr>
                      <tr>
                        <th>
                          <label>UP025</label>
                        </th>
                        <th>
                          <label>UP007</label>
                        </th>
                        <th>
                          <label>UP008</label>
                        </th>
                        <th>
                          <label>UP009</label>
                        </th>
                        <th>
                          <label>UP010</label>
                        </th>
                        <th>
                          <label>UP067</label>
                        </th>
                        <th>
                          <label>UP011</label>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <InputP>
                            <select
                              style={{
                                padding: 11,
                                borderRadius: 5,
                                border: "1px solid #ccc",
                                width: 150,
                              }}
                              onChange={(e) => setIdMunicipio(e.target.value)}
                            >
                              <option value={null}>Selecionar</option>
                              {municipios?.map((municipio, key) => (
                                <option value={municipio?.id_municipio}>
                                  {municipio?.nome}
                                </option>
                              ))}
                            </select>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...register("UP007")}
                              defaultValue={residuosRecebidos?.up007}
                              onChange={handleOnChange}
                              type="text"
                            ></input>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...register("UP008")}
                              defaultValue={residuosRecebidos?.up008}
                              onChange={handleOnChange}
                              type="text"
                            ></input>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...register("UP009")}
                              defaultValue={residuosRecebidos?.up009}
                              onChange={handleOnChange}
                              type="text"
                            ></input>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...register("UP010")}
                              defaultValue={residuosRecebidos?.up010}
                              onChange={handleOnChange}
                              type="text"
                            ></input>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...register("UP067")}
                              defaultValue={residuosRecebidos?.up067}
                              onChange={handleOnChange}
                              type="text"
                            ></input>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...register("UP011")}
                              defaultValue={residuosRecebidos?.up011}
                              onChange={handleOnChange}
                              type="text"
                            ></input>
                          </InputP>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </DivFormConteudoModal>
                {isEditor && (
                  <SubmitButton type="submit">Gravar</SubmitButton>
                )}
              </ConteudoModal>
            </FormModal>
          </Modal>
        </ContainerModal>
      )}
    </Container>
  );
}
