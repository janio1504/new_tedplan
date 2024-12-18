/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-nextjs-toast";
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
interface IMunicipio {
  id_municipio: string;
  municipio_codigo_ibge: string;
  municipio_nome: string;
}

interface MunicipioProps {
  municipio: IMunicipio[];
}

export default function ResiduosUnidades({ municipio }: MunicipioProps) {
  const { usuario, signOut } = useContext(AuthContext);
  const [isMunicipio, setMunicipio] = useState<IMunicipio | any>(municipio);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [residuosRecebidos, setResiduosRecebidos] = useState(null);
  const [content, setContent] = useState("");
  const [dadosUnidade, setDadosUnidade] = useState(null);
  const [unidades, setUnidades] = useState(null);
  const [visibleUnidade, setVisibleUnidade] = useState(false);
  const [visibleCadastro, setVisibleCadastro] = useState(true);
  const [visibleResiduosRecebidos, setVisibleResiduosRecebidos] =
    useState(false);
  const [up080, setUp080] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    getResiduosRecebidos();
    getUnidadesProcessamento();
  }, []);

  function handleOnChange(content) {
    console.log(content.target.value);

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

  async function getResiduosRecebidos() {
    const ano = new Date().getFullYear();
    const id_municipio = municipio[0]?.id_municipio;
    const res = await api
      .post("list-residuos-recebidos", { ano: ano, id_municipio: id_municipio })
      .then((response) => {
        setResiduosRecebidos(response.data);
      });
  }

  async function handleCreateResiduosRecebidos(data) {
    data.id_residuos_unidade_processamento =
      dadosUnidade?.id_residuos_unidade_processamento;
    data.id_quant_residuos_recebidos =
      residuosRecebidos?.id_quant_residuos_recebidos;
    data.ano = new Date().getFullYear();
    data.id_municipio = municipio[0]?.id_municipio;

    data.UP080 =
      (data.UP025
        ? parseFloat(data.UP025.replace(".", "").replace(",", "."))
        : 0) +
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
        toast.notify("Sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
    getResiduosRecebidos();
  }

  function handleOpenResiduosRecebidos() {
    setVisibleResiduosRecebidos(true);
  }
  function handleCloseResiduosRecebidos() {
    setVisibleResiduosRecebidos(false);
  }

  async function handleCadastro(data) {
    data.UP079a ? (data.UP079 = data.UP079a) : data.UP079;
    data.UP051a ? (data.UP051 = data.UP051a) : data.UP051;
    data.UP001a ? (data.UP001 = data.UP001a) : data.UP001;

    data.id_residuos_unidade_processamento =
      dadosUnidade?.id_residuos_unidade_processamento;
    data.id_municipio = municipio[0].id_municipio;
    data.ano = new Date().getFullYear();
    const resCad = await api
      .post("create-unidade-processamento", data)
      .then((response) => {
        toast.notify("Dados gravados com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
        getUnidadesProcessamento();
      })
      .catch((error) => {
        toast.notify("Aconteceu o seguinte erro: ", {
          title: "Erro",
          duration: 7,
          type: "error",
        });
      });
  }

  async function getUnidadesProcessamento() {
    const ano = new Date().getFullYear();
    const id_municipio = municipio[0]?.id_municipio;
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
        id_residuos_unidade_processamento: id,
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    reset();
    setDadosUnidade(res[0]);
    setVisibleUnidade(true);
    getUnidadesProcessamento();
    setVisibleCadastro(false);
  }

  async function handleDelete(id) {
    const del = confirm("Voçê tem certeza que quer remover o item?");
    if (del) {
      await api
        .delete("detete-unidade-processamento/" + id)
        .then((response) => {
          toast.notify("Sucesso!", {
            title: "Sucesso!",
            duration: 7,
            type: "success",
          });
          getUnidadesProcessamento();
        })
        .catch((error) => {
          toast.notify("Aconteceu o seguinte erro: " + error, {
            title: "Erro",
            duration: 7,
            type: "error",
          });
        });
    }
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

  function unidadeColeta() {
    Router.push("/indicadores/residuos-indicadores-coleta");
  }

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <Container>
      <ToastContainer></ToastContainer>
      <HeadIndicadores usuarios={[]}></HeadIndicadores>
      <MenuHorizontal municipio={municipio[0].municipio_nome}></MenuHorizontal>
      <MenuIndicadores></MenuIndicadores>
      <DivCenter>
        <DivFormResiduo>
          <DivTituloFormResiduo>Resíduos Sólidos</DivTituloFormResiduo>
          <DivCenter>
            <DivBotao>
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
              <IconeColeta>
                {" "}
                <Image src={unidade_escuro} alt="Simisab" />
                <BotaoResiduos>Processamento</BotaoResiduos>
              </IconeColeta>
            </DivBotao>
          </DivCenter>
          {visibleCadastro && (
            <FormCadastro onSubmit={handleSubmit(handleCadastro)}>
              <table>
                <thead>
                  <tr>
                    <th>
                      <label>Município</label>
                    </th>
                    <th>
                      <label>Unidade</label>
                    </th>
                    <th>
                      <label>Observações</label>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <InputM>
                        <input
                          aria-invalid={errors.value ? "true" : "false"}
                          {...register("UP079a", { required: true })}
                        />
                        {errors.UP079a && errors.UP079a.type && (
                          <span>O campo é obrigatório!</span>
                        )}
                      </InputM>
                    </td>
                    <td>
                      <InputM>
                        <input
                          aria-invalid={errors.value ? "true" : "false"}
                          {...register("UP001a")}
                        ></input>
                        {errors.UP079a && errors.UP079a.type && (
                          <span>O campo é obrigatório!</span>
                        )}
                      </InputM>
                    </td>
                    <td>
                      <InputG>
                        <input {...register("UP051a")}></input>
                      </InputG>
                    </td>
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
                  <th>Unidade</th>
                  <th>Esteve em operção no ano de referencia?</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {unidades?.map((unidade, index) => (
                  <>
                    <tr key={index}>
                      <td>{unidade.up079}</td>
                      <td>{unidade.up001}</td>
                      <td>{unidade.up051}</td>
                      <td>
                        <Actions>
                          <Image
                            title="Editar"
                            onClick={() => {
                              getUnidadeProcessamento(
                                unidade.id_residuos_unidade_processamento
                              );
                            }}
                            width={30}
                            height={30}
                            src={Editar}
                            alt=""
                          />
                          <Image
                            onClick={() =>
                              handleDelete(
                                unidade.id_residuos_unidade_processamento
                              )
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

            <Form onSubmit={handleSubmit(handleCadastro)}>
              <ModalStepperContainer>
                <ModalStepperWrapper>
                  <div>
                    <ModalStepButton
                      active={currentStep === 0}
                      completed={currentStep > 0}
                    >
                      1
                    </ModalStepButton>
                    <ModalStepLabel active={currentStep === 0}></ModalStepLabel>
                  </div>

                  <div>
                    <ModalStepButton
                      active={currentStep === 1}
                      completed={currentStep > 1}
                    >
                      2
                    </ModalStepButton>
                    <ModalStepLabel active={currentStep === 1}></ModalStepLabel>
                  </div>

                  <div>
                    <ModalStepButton
                      active={currentStep === 2}
                      completed={currentStep > 2}
                    >
                      3
                    </ModalStepButton>
                    <ModalStepLabel active={currentStep === 2}></ModalStepLabel>
                  </div>

                  <div>
                    <ModalStepButton
                      active={currentStep === 3}
                      completed={currentStep > 3}
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
                    <table>
                      <thead>
                        <tr>
                          <th>Código SNIS</th>
                          <th>Descrição</th>
                          <th>Ano {new Date().getFullYear()}</th>
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
                                {...register("UP079")}
                                defaultValue={dadosUnidade?.up079}
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
                              <select
                                {...register("UP003")}
                                defaultValue={dadosUnidade?.up003}
                                onChange={handleOnChange}
                              >
                                <option>Lixão</option>
                                <option>
                                  Queima em forno de qualquer tipo
                                </option>
                                <option>
                                  Unidade de manejo de galhadas e podas{" "}
                                </option>
                                <option>Unidade de transbordo </option>
                                <option>
                                  Área de reciclagem de RCC (unidade de
                                  reciclagem de entulho){" "}
                                </option>
                                <option>
                                  Aterro de resíduos da construção civil
                                  (inertes)
                                </option>
                                <option>
                                  Área de transbordo e triagem de RCC e
                                  volumosos (ATT)
                                </option>
                                <option>Aterro controlado </option>
                                <option>Aterro sanitário </option>
                                <option>Vala específica de RSS</option>
                                <option>
                                  Unidade de triagem (galpão ou usina)
                                </option>
                                <option>
                                  Unidade de compostagem (pátio ou usina){" "}
                                </option>
                                <option>
                                  Unidade de tratamento por incineração
                                </option>
                                <option>
                                  Unidade de tratamento por microondas ou
                                  autoclave{" "}
                                </option>
                                <option>Outra</option>
                              </select>
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
                                {...register("UP001")}
                                defaultValue={dadosUnidade?.up001}
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
                                defaultValue={dadosUnidade?.up065}
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
                                {...register("UP087")}
                                defaultValue={dadosUnidade?.up087}
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
                                defaultValue={dadosUnidade?.up051}
                                onChange={handleOnChange}
                              >
                                <option></option>
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
                                defaultValue={dadosUnidade?.up002}
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
                                defaultValue={dadosUnidade?.up066}
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
                                defaultValue={dadosUnidade?.up004}
                                onChange={handleOnChange}
                              >
                                <option></option>
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
                                defaultValue={dadosUnidade?.up084}
                                onChange={handleOnChange}
                              >
                                <option></option>
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
                                defaultValue={dadosUnidade?.up050}
                                onChange={handleOnChange}
                              >
                                <option></option>
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
                                defaultValue={dadosUnidade?.up012}
                                onChange={handleOnChange}
                              >
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
                                defaultValue={dadosUnidade?.up085}
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
                                {...register("UP086")}
                                defaultValue={dadosUnidade?.up086}
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
                          <th>Ano {new Date().getFullYear()}</th>
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
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                              </select>
                            </InputP>
                          </td>
                        </tr>
                        <tr>
                          <td>UP028</td>
                          <td>
                            <InputXL>
                              Existe instaloções administrativas ou de apoio aos
                              trabalhadores?
                            </InputXL>
                          </td>
                          <td>
                            <InputP>
                              <select
                                {...register("UP028")}
                                defaultValue={dadosUnidade?.up028}
                                onChange={handleOnChange}
                              >
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                              </select>
                            </InputP>
                          </td>
                        </tr>
                        <tr>
                          <td>UP029</td>
                          <td>
                            <InputXL>
                              Existe impermeabilização da base do aterro(com
                              argila ou manta)?
                            </InputXL>
                          </td>
                          <td>
                            <InputP>
                              <select
                                {...register("UP029")}
                                defaultValue={dadosUnidade?.up029}
                                onChange={handleOnChange}
                              >
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                              </select>
                            </InputP>
                          </td>
                        </tr>
                        <tr>
                          <td>UP030</td>
                          <td>
                            <InputXL>
                              Qual a frequência do recolhimento de resíduos?
                            </InputXL>
                          </td>
                          <td>
                            <InputG>
                              <select
                                {...register("UP030")}
                                defaultValue={dadosUnidade?.up030}
                                onChange={handleOnChange}
                              >
                                <option></option>
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
                            <InputXL>Existe drenagem de gases?</InputXL>
                          </td>
                          <td>
                            <InputP>
                              <select
                                {...register("UP031")}
                                defaultValue={dadosUnidade?.up031}
                                onChange={handleOnChange}
                              >
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                              </select>
                            </InputP>
                          </td>
                        </tr>
                        <tr>
                          <td>UP052</td>
                          <td>
                            <InputXL>
                              Existe algum tipo de reaproveitamento de gases
                              drenados?
                            </InputXL>
                          </td>
                          <td>
                            <InputP>
                              <select
                                {...register("UP052")}
                                defaultValue={dadosUnidade?.up052}
                                onChange={handleOnChange}
                              >
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                              </select>
                            </InputP>
                          </td>
                        </tr>
                        <tr>
                          <td>UP032</td>
                          <td>
                            <InputXL>
                              Existe sistema de drenagem do liquído
                              percola(chorume)?
                            </InputXL>
                          </td>
                          <td>
                            <InputP>
                              <select
                                {...register("UP032")}
                                defaultValue={dadosUnidade?.up032}
                                onChange={handleOnChange}
                              >
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                              </select>
                            </InputP>
                          </td>
                        </tr>
                        <tr>
                          <td>UP033</td>
                          <td>
                            <InputXL>
                              Existe unidade de tratamento do líquido percolado
                              na área da unidade?
                            </InputXL>
                          </td>
                          <td>
                            <InputP>
                              <select
                                {...register("UP033")}
                                defaultValue={dadosUnidade?.up033}
                                onChange={handleOnChange}
                              >
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                              </select>
                            </InputP>
                          </td>
                        </tr>
                        <tr>
                          <td>UP053</td>
                          <td>
                            <InputXL>
                              Existe unidade de tratamento do líquido percolado
                              localizado fora da área da unidade?
                            </InputXL>
                          </td>
                          <td>
                            <InputP>
                              <select
                                {...register("UP053")}
                                defaultValue={dadosUnidade?.up053}
                                onChange={handleOnChange}
                              >
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                              </select>
                            </InputP>
                          </td>
                        </tr>
                        <tr>
                          <td>UP054</td>
                          <td>
                            <InputXL>
                              Existe sistema de drenagem de águas pluviais?
                            </InputXL>
                          </td>
                          <td>
                            <InputP>
                              <select
                                {...register("UP054")}
                                defaultValue={dadosUnidade?.up054}
                                onChange={handleOnChange}
                              >
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                              </select>
                            </InputP>
                          </td>
                        </tr>
                        <tr>
                          <td>UP034</td>
                          <td>
                            <InputXL>
                              Existe recirculação do líquido percolado
                              (chorume)?
                            </InputXL>
                          </td>
                          <td>
                            <InputP>
                              <select
                                {...register("UP034")}
                                defaultValue={dadosUnidade?.up034}
                                onChange={handleOnChange}
                              >
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                              </select>
                            </InputP>
                          </td>
                        </tr>

                        <tr>
                          <td>UP035</td>
                          <td>
                            <InputXL>
                              Há vigilância diurna e norturna na unidade?
                            </InputXL>
                          </td>
                          <td>
                            <InputP>
                              <select
                                {...register("UP035")}
                                defaultValue={dadosUnidade?.up035}
                                onChange={handleOnChange}
                              >
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                              </select>
                            </InputP>
                          </td>
                        </tr>

                        <tr>
                          <td>UP036</td>
                          <td>
                            <InputXL>
                              Há algum tipo de monitoramento ambiental da
                              instalação?
                            </InputXL>
                          </td>
                          <td>
                            <InputP>
                              <select
                                {...register("UP036")}
                                defaultValue={dadosUnidade?.up036}
                                onChange={handleOnChange}
                              >
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                              </select>
                            </InputP>
                          </td>
                        </tr>
                        <tr>
                          <td>UP037</td>
                          <td>
                            <InputXL>
                              É feita queima de resíduos a céu aberto?
                            </InputXL>
                          </td>
                          <td>
                            <InputP>
                              <select
                                {...register("UP037")}
                                defaultValue={dadosUnidade?.up037}
                                onChange={handleOnChange}
                              >
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                              </select>
                            </InputP>
                          </td>
                        </tr>

                        <tr>
                          <td>UP038</td>
                          <td>
                            <InputXL>
                              Há presença de animais(exceto aves) na
                              área(porcos, cavalos, vacas...)?
                            </InputXL>
                          </td>
                          <td>
                            <InputP>
                              <select
                                {...register("UP038")}
                                defaultValue={dadosUnidade?.up038}
                                onChange={handleOnChange}
                              >
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                              </select>
                            </InputP>
                          </td>
                        </tr>

                        <tr>
                          <td>UP081</td>
                          <td>
                            <InputXL>
                              Existem catadores de materiais recicláveis?
                            </InputXL>
                          </td>
                          <td>
                            <InputP>
                              <select
                                {...register("UP081")}
                                defaultValue={dadosUnidade?.up081}
                                onChange={handleOnChange}
                              >
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                              </select>
                            </InputP>
                          </td>
                        </tr>

                        <tr>
                          <td>UP082</td>
                          <td>
                            <InputXL>
                              Quantidade de catadores até 14 anos?
                            </InputXL>
                          </td>
                          <td>
                            <InputG>
                              <input
                                {...register("UP082")}
                                defaultValue={dadosUnidade?.up082}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputG>
                          </td>
                          <td>Catadores</td>
                        </tr>

                        <tr>
                          <td>UP083</td>
                          <td>
                            <InputXL>
                              Quantidade de catadores maiores de 14 anos?
                            </InputXL>
                          </td>
                          <td>
                            <InputPP>
                              <input
                                {...register("UP083")}
                                defaultValue={dadosUnidade?.up083}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputPP>
                          </td>
                          <td>Catadores</td>
                        </tr>

                        <tr>
                          <td>UP039</td>
                          <td>
                            <InputXL>
                              há domicílios de catadores na areá da unidade?
                            </InputXL>
                          </td>
                          <td>
                            <InputP>
                              <select
                                {...register("UP039")}
                                defaultValue={dadosUnidade?.up039}
                                onChange={handleOnChange}
                              >
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                              </select>
                            </InputP>
                          </td>
                        </tr>
                        <tr>
                          <td>UP040</td>
                          <td>
                            <InputXL>
                              Quantidade de domicílios de catadores na área?
                            </InputXL>
                          </td>
                          <td>
                            <InputP>
                              <input
                                {...register("UP040")}
                                defaultValue={dadosUnidade?.up040}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputP>
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
                                <td style={{ color: "#FFFFF" }}>{rr.up025}</td>
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
                  <SubmitButton type="submit">Gravar</SubmitButton>
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
                    <ModalStepperButton onClick={handleNextStep}>
                      Proximo
                    </ModalStepperButton>
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
                            <input
                              {...register("UP025")}
                              defaultValue={residuosRecebidos?.up025}
                              onChange={handleOnChange}
                              id="UP025"
                              type="text"
                            ></input>
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
                <SubmitButton type="submit">Gravar</SubmitButton>
              </ConteudoModal>
            </FormModal>
          </Modal>
        </ContainerModal>
      )}
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
