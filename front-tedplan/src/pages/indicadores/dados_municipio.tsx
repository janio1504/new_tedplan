import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
  Container,
  Sidebar,
  SidebarItem,
  MainContent,
  DivCenter,
  DivFormCadastro,
  DivTituloForm,
  Form,
  InputP,
  InputM,
  InputG,
  SubmitButton,
  SubmitButtonContainer,
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
} from "../../styles/indicadores";
import HeadIndicadores from "../../components/headIndicadores";
import MenuIndicadores from "../../components/MenuIndicadoresCadastro";

import "suneditor/dist/css/suneditor.min.css";
import { useAuth } from "../../contexts/AuthContext";
import { toast, ToastContainer } from "react-nextjs-toast";
import Router from "next/router";
import MenuHorizontal from "../../components/MenuHorizontal";
import { Municipio } from "../../types";
import { useMunicipio } from "../../contexts/MunicipioContext";

interface MunicipioProps {
  municipio: Municipio;
}

export default function Cadastro({ municipio }: MunicipioProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const [activeForm, setActiveForm] = useState("dadosMunicipio");
  const { usuario, signOut } = useAuth();
  const [content, setContent] = useState("");
  const { dadosMunicipio, loadMunicipio, loading, updateMunicipio } =
    useMunicipio();
  const [activeStep, setActiveStep] = useState(0);

  console.log("dados municipio", dadosMunicipio);

  const steps = [
    "Abastecimento de Água",
    "Esgotamento Sanitário",
    "Drenagem e Águas Pluviais",
    "Resíduos Sólidos",
  ];

  useEffect(() => {
    if (usuario) {
      loadMunicipio();
    }
  }, [usuario]);
  useEffect(() => {
    if (dadosMunicipio) {
      Object.entries(dadosMunicipio).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [dadosMunicipio, setValue]);
  // useEffect(() => {
  //   const carregarDados = async () => {
  //     await loadMunicipio();
  //   };
  //   carregarDados();
  // }, []);

  // useEffect(() => {
  //   if (dadosMunicipio) {
  //     Object.keys(dadosMunicipio).forEach((key) => {
  //       setValue(key, dadosMunicipio[key]);
  //     });
  //   }
  // }, [dadosMunicipio, setValue]);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleStepClick = (step: number) => {
    setActiveStep(step);
  };

  async function handleCadastro(data: any) {
    try {
      await updateMunicipio({
        ...data,
        id_municipio: usuario?.id_municipio,
      });
      toast.notify("Dados gravados com sucesso!", {
        title: "Sucesso!",
        duration: 7,
        type: "success",
      });
    } catch (error) {
      console.log(error);
      toast.notify("Erro ao gravar dados", {
        title: "Erro",
        duration: 7,
        type: "error",
      });
    }
  }

  function handleOnChange(content) {
    setContent(content);
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
      <ToastContainer
        style={{
          zIndex: 9999,
          position: "fixed",
          top: "16px",
          right: "16px",
        }}
      ></ToastContainer>
      <HeadIndicadores usuarios={[]}></HeadIndicadores>
      <MenuHorizontal municipio={[]}></MenuHorizontal>
      <MenuIndicadores></MenuIndicadores>
      <Sidebar>
        <SidebarItem
          active={activeForm === "dadosMunicipio"}
          onClick={() => setActiveForm("dadosMunicipio")}
        >
          Dados do Município
        </SidebarItem>
        <SidebarItem
          active={activeForm === "titularServicos"}
          onClick={() => setActiveForm("titularServicos")}
        >
          Titular dos Serviços
        </SidebarItem>
        <SidebarItem
          active={activeForm === "prestadoresServicos"}
          onClick={() => setActiveForm("prestadoresServicos")}
        >
          Prestadores de Serviços
        </SidebarItem>
        <SidebarItem
          active={activeForm === "reguladorFiscalizador"}
          onClick={() => setActiveForm("reguladorFiscalizador")}
        >
          Regulador e Fiscalizador
        </SidebarItem>
        <SidebarItem
          active={activeForm === "controleSocial"}
          onClick={() => setActiveForm("controleSocial")}
        >
          Controle Social & Responsavel pelo SIMISAB
        </SidebarItem>

        <SidebarItem
          active={activeForm === "dadosDemograficos"}
          onClick={() => setActiveForm("dadosDemograficos")}
        >
          Dados Demográficos
        </SidebarItem>
      </Sidebar>
      <MainContent>
        <DivCenter>
          <Form onSubmit={handleSubmit(handleCadastro)}>
            <DivFormCadastro active={activeForm === "dadosMunicipio"}>
              <DivTituloForm>Dados do Município</DivTituloForm>

              <input
                {...register("id_municipio")}
                // defaultValue={usuario?.id_municipio}
                // onChange={handleOnChange}
                type="hidden"
              ></input>
              <table>
                <thead></thead>
                <tbody>
                  <tr>
                    <td>
                      <InputP>
                        <label>Código do IBGE</label>
                        <input
                          {...register("municipio_codigo_ibge")}
                          // defaultValue={dadosMunicipio?.municipio_codigo_ibge}
                          // onChange={handleOnChange}
                          type="text"
                        ></input>
                      </InputP>
                    </td>
                    <td>
                      <InputM>
                        <label>Municipio</label>
                        <input
                          {...register("municipio_nome")}
                          // defaultValue={dadosMunicipio?.municipio_nome}
                          // onChange={handleOnChange}
                          type="text"
                        ></input>
                      </InputM>
                    </td>
                    <td>
                      <InputM>
                        <label>CNPJ ( Somente numeros )</label>
                        <input
                          {...register("municipio_cnpj")}
                          // defaultValue={dadosMunicipio?.municipio_cnpj}
                          // onChange={handleOnChange}
                          placeholder={"Somente numeros"}
                          type="text"
                        ></input>
                      </InputM>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <InputG>
                        <label>
                          Nome da Prefeitura<span> *</span>
                        </label>
                        <input
                          aria-invalid={errors.value ? "true" : "false"}
                          {...register("municipio_nome_prefeitura", {
                            required: false,
                          })}
                          // defaultValue={
                          //   dadosMunicipio?.municipio_nome_prefeitura
                          // }
                          // onChange={handleOnChange}
                          type="text"
                        />
                        {errors.municipio_nome_prefeitura &&
                          errors.municipio_nome_prefeitura.type && (
                            <span>O campo é obrigatório!</span>
                          )}
                      </InputG>
                    </td>
                    <td>
                      <InputP>
                        <label>
                          CEP<span> *</span>
                        </label>
                        <input
                          aria-invalid={errors.value ? "true" : "false"}
                          {...register("municipio_cep", { required: false })}
                          // defaultValue={dadosMunicipio?.municipio_cep}
                          // onChange={handleOnChange}
                          type="text"
                        />
                        {errors.municipio_cep && errors.municipio_cep.type && (
                          <span>O campo é obrigatório!</span>
                        )}
                      </InputP>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <InputG>
                        <label>
                          Endereço<span> *</span>
                        </label>
                        <input
                          aria-invalid={errors.value ? "true" : "false"}
                          {...register("municipio_endereco", {
                            required: false,
                          })}
                          // defaultValue={dadosMunicipio?.municipio_endereco}
                          // onChange={handleOnChange}
                          type="text"
                        />
                        {errors.municipio_endereco &&
                          errors.municipio_endereco.type && (
                            <span>O campo é obrigatório!</span>
                          )}
                      </InputG>
                    </td>
                    <td>
                      <InputP>
                        <label>
                          Numero<span> *</span>
                        </label>
                        <input
                          aria-invalid={errors.value ? "true" : "false"}
                          {...register("municipio_numero", { required: false })}
                          // defaultValue={dadosMunicipio?.municipio_numero}
                          // onChange={handleOnChange}
                          type="text"
                        />
                        {errors.municipio_numero &&
                          errors.municipio_numero.type && (
                            <span>O campo é obrigatório!</span>
                          )}
                      </InputP>
                    </td>
                    <td>
                      <InputM>
                        <label>
                          Bairro<span> *</span>
                        </label>
                        <input
                          aria-invalid={errors.value ? "true" : "false"}
                          {...register("municipio_bairro", { required: false })}
                          // defaultValue={dadosMunicipio?.municipio_bairro}
                          // onChange={handleOnChange}
                          type="text"
                        />
                        {errors.municipio_bairro &&
                          errors.municipio_bairro.type && (
                            <span>O campo é obrigatório!</span>
                          )}
                      </InputM>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <InputP>
                        <label>
                          Telefone<span> *</span>
                        </label>
                        <input
                          aria-invalid={errors.value ? "true" : "false"}
                          {...register("municipio_telefone", {
                            required: false,
                          })}
                          // defaultValue={dadosMunicipio?.municipio_telefone}
                          // onChange={handleOnChange}
                          type="text"
                        />
                        {errors.municipio_telefone &&
                          errors.municipio_telefone.type && (
                            <span>O campo é obrigatório!</span>
                          )}
                      </InputP>
                    </td>
                    <td>
                      <InputM>
                        <label>
                          E-mail<span> *</span>
                        </label>
                        <input
                          aria-invalid={errors.value ? "true" : "false"}
                          {...register("municipio_email", { required: false })}
                          // defaultValue={dadosMunicipio?.municipio_email}
                          // onChange={handleOnChange}
                          type="text"
                        />
                        {errors.municipio_email &&
                          errors.municipio_email.type && (
                            <span>O campo é obrigatório!</span>
                          )}
                      </InputM>
                    </td>
                    <td>
                      <InputG>
                        <label>
                          Nome do Prefeito<span> *</span>
                        </label>
                        <input
                          aria-invalid={errors.value ? "true" : "false"}
                          {...register("municipio_prefeito", {
                            required: false,
                          })}
                          // defaultValue={dadosMunicipio?.municipio_prefeito}
                          // onChange={handleOnChange}
                          type="text"
                        />
                        {errors.municipio_prefeito &&
                          errors.municipio_prefeito.type && (
                            <span>O campo é obrigatório!</span>
                          )}
                      </InputG>
                    </td>
                  </tr>
                </tbody>
              </table>
              <SubmitButtonContainer>
                <SubmitButton type="submit">Gravar</SubmitButton>
              </SubmitButtonContainer>
            </DivFormCadastro>
            <DivFormCadastro active={activeForm === "titularServicos"}>
              <DivTituloForm>
                Titular dos Serviços Municipais de Saneamento
              </DivTituloForm>
              <input
                {...register("id_titular_servicos_ms")}
                // defaultValue={dadosMunicipio?.id_titular_servicos_ms}
                // onChange={handleOnChange}
                type="hidden"
              />
              <table>
                <tbody>
                  <tr>
                    <td>
                      <InputG>
                        <label>
                          Setor Responsável<span> *</span>
                        </label>
                        <input
                          {...register("ts_setor_responsavel")}
                          // defaultValue={dadosMunicipio?.ts_setor_responsavel}
                          // onChange={handleOnChange}
                          type="text"
                        ></input>
                      </InputG>
                    </td>
                    <td>
                      <InputP>
                        <label>
                          Telefone Comercial<span> *</span>
                        </label>
                        <input
                          {...register("ts_telefone_comercial")}
                          // defaultValue={dadosMunicipio?.ts_telefone_comercial}
                          // onChange={handleOnChange}
                          type="text"
                        ></input>
                      </InputP>
                    </td>
                  </tr>
                </tbody>
              </table>

              <table>
                <tbody>
                  <tr>
                    <td>
                      <InputG>
                        <label>
                          Nome Responsável<span> *</span>
                        </label>
                        <input
                          {...register("ts_responsavel")}
                          // defaultValue={dadosMunicipio?.ts_responsavel}
                          // onChange={handleOnChange}
                          type="text"
                        ></input>
                      </InputG>
                    </td>
                    <td>
                      <InputM>
                        <label>
                          Cargo<span> *</span>
                        </label>
                        <input
                          {...register("ts_cargo")}
                          // defaultValue={dadosMunicipio?.ts_cargo}
                          // onChange={handleOnChange}
                          type="text"
                        ></input>
                      </InputM>
                    </td>
                    <td>
                      <InputP>
                        <label>
                          Telefone<span> *</span>
                        </label>
                        <input
                          {...register("ts_telefone")}
                          // defaultValue={dadosMunicipio?.ts_telefone}
                          onChange={handleOnChange}
                          type="text"
                        />
                      </InputP>
                    </td>
                  </tr>
                </tbody>
              </table>

              <table>
                <tbody>
                  <tr>
                    <td>
                      <InputG>
                        <label>
                          Email<span> *</span>
                        </label>
                        <input
                          {...register("ts_email")}
                          // defaultValue={dadosMunicipio?.ts_email}
                          onChange={handleOnChange}
                          type="text"
                        ></input>
                      </InputG>
                    </td>
                  </tr>
                </tbody>
              </table>
              <SubmitButtonContainer>
                <SubmitButton type="submit">Gravar</SubmitButton>
              </SubmitButtonContainer>
            </DivFormCadastro>

            <DivFormCadastro active={activeForm === "prestadoresServicos"}>
              <DivTituloForm>
                Prestadores do Serviço de Saneamento Básico
              </DivTituloForm>
              <div className="form-content">
                <StepperContainer>
                  <StepperWrapper>
                    {steps.map((label, index) => (
                      <div key={label} style={{ position: "relative" }}>
                        <StepButton
                          active={activeStep === index}
                          completed={activeStep > index}
                          onClick={() => handleStepClick(index)}
                        >
                          {index + 1}
                        </StepButton>
                        <StepLabel active={activeStep === index}>
                          {label}
                        </StepLabel>
                      </div>
                    ))}
                  </StepperWrapper>

                  <StepContent active={activeStep === 0}>
                    <DivEixo style={{ color: "#000", marginTop: "60px" }}>
                      Abastecimento de Água
                    </DivEixo>
                    <input
                      {...register("id_ps_abastecimento_agua")}
                      // defaultValue={dadosMunicipio?.id_ps_abastecimento_agua}
                      onChange={handleOnChange}
                      type="hidden"
                    />
                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <InputG>
                              <label>
                                Secretaria ou Setor Responsável<span> *</span>
                              </label>
                              <input
                                {...register("aa_secretaria_setor_responsavel")}
                                // defaultValue={
                                //   dadosMunicipio?.aa_secretaria_setor_responsavel
                                // }
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputG>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Abrangência<span> *</span>
                              </label>
                              <input
                                {...register("aa_abrangencia")}
                                // defaultValue={dadosMunicipio?.aa_abrangencia}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputP>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <InputG>
                              <label>
                                Natureza jurídica<span> *</span>
                              </label>
                              <select {...register("aa_natureza_juridica")}>
                                <option
                                  value={dadosMunicipio?.aa_natureza_juridica}
                                >
                                  {dadosMunicipio?.aa_natureza_juridica}
                                </option>
                                <option value="Administração Pública Direta">
                                  Administração Pública Direta
                                </option>
                                <option value="Autarquia">Autarquia</option>
                                <option value="Empresa pública">
                                  Empresa pública
                                </option>
                                <option value="Sociedade de economia mista com administração privada">
                                  Sociedade de economia mista com administração
                                  privada
                                </option>
                                <option value="Sociedade de economia mista com administração pública">
                                  Sociedade de economia mista com administração
                                  pública
                                </option>
                              </select>
                            </InputG>
                          </td>
                          <td>
                            <InputM>
                              <label>
                                CNPJ<span> *</span>
                              </label>
                              <input
                                {...register("aa_cnpj")}
                                // defaultValue={dadosMunicipio?.aa_cnpj}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputM>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Telefone<span> *</span>
                              </label>
                              <input
                                {...register("aa_telefone")}
                                // defaultValue={dadosMunicipio?.aa_telefone}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputP>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <InputP>
                              <label>
                                CEP<span> *</span>
                              </label>
                              <input
                                {...register("aa_cep")}
                                // defaultValue={dadosMunicipio?.aa_cep}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputP>
                          </td>
                          <td>
                            <InputM>
                              <label>
                                Endereço<span> *</span>
                              </label>
                              <input
                                {...register("aa_endereco")}
                                // defaultValue={dadosMunicipio?.aa_endereco}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputM>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Numero<span> *</span>
                              </label>
                              <input
                                {...register("aa_numero")}
                                // defaultValue={dadosMunicipio?.aa_numero}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputP>
                          </td>
                          <td>
                            <InputM>
                              <label>
                                Bairro<span> *</span>
                              </label>
                              <input
                                {...register("aa_bairro")}
                                // defaultValue={dadosMunicipio?.aa_bairro}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputM>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <InputG>
                              <label>
                                Nome do Responsável<span> *</span>
                              </label>
                              <input
                                {...register("aa_responsavel")}
                                // defaultValue={dadosMunicipio?.aa_responsavel}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputG>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Cargo<span> *</span>
                              </label>
                              <input
                                {...register("aa_cargo")}
                                // defaultValue={dadosMunicipio?.aa_cargo}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputP>
                          </td>
                          <td>
                            <InputM>
                              <label>
                                Email<span> *</span>
                              </label>
                              <input
                                {...register("aa_email")}
                                // defaultValue={dadosMunicipio?.aa_email}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputM>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </StepContent>

                  <StepContent active={activeStep === 1}>
                    <DivEixo style={{ color: "#000", marginTop: "60px" }}>
                      Esgotamento Sanitário
                    </DivEixo>
                    <input
                      {...register("id_ps_esgotamento_sanitario")}
                      // defaultValue={dadosMunicipio?.id_ps_esgotamento_sanitario}
                      onChange={handleOnChange}
                      type="hidden"
                    />
                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <InputG>
                              <label>
                                Secretaria ou Setor Responsável<span> *</span>
                              </label>
                              <input
                                // {...register("es_secretaria_setor_responsavel")}
                                // defaultValue={
                                //   dadosMunicipio?.es_secretaria_setor_responsavel
                                // }
                                // onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputG>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Abrangência<span> *</span>
                              </label>
                              <input
                                {...register("es_abrangencia")}
                                // defaultValue={dadosMunicipio?.es_abrangencia}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputP>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <InputG>
                              <label>
                                Natureza jurídica<span> *</span>
                              </label>
                              <select {...register("es_natureza_juridica")}>
                                <option
                                  value={dadosMunicipio?.es_natureza_juridica}
                                >
                                  {dadosMunicipio?.es_natureza_juridica}
                                </option>
                                <option value="Administração Pública Direta">
                                  Administração Pública Direta
                                </option>
                                <option value="Autarquia">Autarquia</option>
                                <option value="Empresa pública">
                                  Empresa pública
                                </option>
                                <option value="Sociedade de economia mista com administração privada">
                                  Sociedade de economia mista com administração
                                  privada
                                </option>
                                <option value="Sociedade de economia mista com administração pública">
                                  Sociedade de economia mista com administração
                                  pública
                                </option>
                              </select>
                            </InputG>
                          </td>
                          <td>
                            <InputM>
                              <label>
                                CNPJ<span> *</span>
                              </label>
                              <input
                                {...register("es_cnpj")}
                                // defaultValue={dadosMunicipio?.es_cnpj}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputM>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Telefone<span> *</span>
                              </label>
                              <input
                                {...register("es_telefone")}
                                // defaultValue={dadosMunicipio?.es_telefone}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputP>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <InputP>
                              <label>
                                CEP<span> *</span>
                              </label>
                              <input
                                {...register("es_cep")}
                                // defaultValue={dadosMunicipio?.es_cep}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputP>
                          </td>
                          <td>
                            <InputM>
                              <label>
                                Endereço<span> *</span>
                              </label>
                              <input
                                {...register("es_endereco")}
                                // defaultValue={dadosMunicipio?.es_endereco}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputM>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Numero<span> *</span>
                              </label>
                              <input
                                {...register("es_numero")}
                                // defaultValue={dadosMunicipio?.es_numero}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputP>
                          </td>
                          <td>
                            <InputM>
                              <label>
                                Bairro<span> *</span>
                              </label>
                              <input
                                {...register("es_bairro")}
                                // defaultValue={dadosMunicipio?.es_bairro}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputM>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <InputG>
                              <label>
                                Nome do Responsável<span> *</span>
                              </label>
                              <input
                                {...register("es_responsavel")}
                                // defaultValue={dadosMunicipio?.es_responsavel}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputG>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Cargo<span> *</span>
                              </label>
                              <input
                                {...register("es_cargo")}
                                // defaultValue={dadosMunicipio?.es_cargo}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputP>
                          </td>
                          <td>
                            <InputM>
                              <label>
                                Email<span> *</span>
                              </label>
                              <input
                                {...register("es_email")}
                                // defaultValue={dadosMunicipio?.es_email}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputM>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </StepContent>

                  <StepContent active={activeStep === 2}>
                    <DivEixo style={{ color: "#000", marginTop: "60px" }}>
                      Drenagem e Àguas pluviais
                    </DivEixo>
                    <input
                      {...register("id_ps_drenagem_aguas_pluviais")}
                      // defaultValue={
                      //   dadosMunicipio?.id_ps_drenagem_aguas_pluviais
                      // }
                      // onChange={handleOnChange}
                      type="hidden"
                    />
                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <InputG>
                              <label>
                                Secretaria ou Setor Responsável<span> *</span>
                              </label>
                              <input
                                {...register("da_secretaria_setor_responsavel")}
                                // defaultValue={
                                //   dadosMunicipio?.da_secretaria_setor_responsavel
                                // }
                                // onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputG>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Abrangência<span> *</span>
                              </label>
                              <input
                                {...register("da_abrangencia")}
                                // defaultValue={dadosMunicipio?.da_abrangencia}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputP>
                          </td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>

                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <InputG>
                              <label>
                                Natureza jurídica<span> *</span>
                              </label>
                              <select {...register("da_natureza_juridica")}>
                                <option
                                  value={dadosMunicipio?.da_natureza_juridica}
                                >
                                  {" "}
                                  {dadosMunicipio?.da_natureza_juridica}{" "}
                                </option>
                                <option value="Administração Pública Direta">
                                  Administração Pública Direta
                                </option>
                                <option value="Autarquia">Autarquia</option>
                                <option value="Empresa pública">
                                  Empresa pública
                                </option>
                                <option value="Sociedade de economia mista com administração privada">
                                  Sociedade de economia mista com administração
                                  privada
                                </option>
                                <option value="Sociedade de economia mista com administração pública">
                                  Sociedade de economia mista com administração
                                  pública
                                </option>
                              </select>
                            </InputG>
                          </td>
                          <td>
                            <InputM>
                              <label>
                                CNPJ<span> *</span>
                              </label>
                              <input
                                {...register("da_cnpj")}
                                // defaultValue={dadosMunicipio?.da_cnpj}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputM>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Telefone<span> *</span>
                              </label>
                              <input
                                {...register("da_telefone")}
                                // defaultValue={dadosMunicipio?.da_telefone}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputP>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <InputP>
                              <label>
                                CEP<span> *</span>
                              </label>
                              <input
                                {...register("da_cep")}
                                // defaultValue={dadosMunicipio?.da_cep}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputP>
                          </td>
                          <td>
                            <InputM>
                              <label>
                                Endereço<span> *</span>
                              </label>
                              <input
                                {...register("da_endereco")}
                                // defaultValue={dadosMunicipio?.da_endereco}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputM>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Numero<span> *</span>
                              </label>
                              <input
                                {...register("da_numero")}
                                // defaultValue={dadosMunicipio?.da_numero}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputP>
                          </td>
                          <td>
                            <InputM>
                              <label>
                                Bairro<span> *</span>
                              </label>
                              <input
                                {...register("da_bairro")}
                                // defaultValue={dadosMunicipio?.da_bairro}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputM>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <InputG>
                              <label>
                                Nome do Responsável<span> *</span>
                              </label>
                              <input
                                {...register("da_responsavel")}
                                // defaultValue={dadosMunicipio?.da_responsavel}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputG>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Cargo<span> *</span>
                              </label>
                              <input
                                {...register("da_cargo")}
                                // defaultValue={dadosMunicipio?.da_cargo}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputP>
                          </td>
                          <td>
                            <InputM>
                              <label>
                                Email<span> *</span>
                              </label>
                              <input
                                {...register("da_email")}
                                // defaultValue={dadosMunicipio?.da_email}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputM>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </StepContent>

                  <StepContent active={activeStep === 3}>
                    <DivEixo style={{ color: "#000", marginTop: "60px" }}>
                      Resíduos Sólidos
                    </DivEixo>
                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <InputG>
                              <label>
                                Secretaria ou Setor Responsável<span> *</span>
                              </label>
                              <input
                                {...register("rs_secretaria_setor_responsavel")}
                                // defaultValue={
                                //   dadosMunicipio?.rs_secretaria_setor_responsavel
                                // }
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputG>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Abrangência<span> *</span>
                              </label>
                              <input
                                {...register("rs_abrangencia")}
                                // defaultValue={dadosMunicipio?.rs_abrangencia}
                                // onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputP>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <input
                      {...register("id_ps_residuo_solido")}
                      // defaultValue={dadosMunicipio?.id_ps_residuo_solido}
                      // onChange={handleOnChange}
                      type="hidden"
                    />

                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <InputG>
                              <label>
                                Natureza jurídica<span> *</span>
                              </label>
                              <select {...register("rs_natureza_juridica")}>
                                <option
                                  value={dadosMunicipio?.rs_natureza_juridica}
                                >
                                  {" "}
                                  {dadosMunicipio?.rs_natureza_juridica}{" "}
                                </option>
                                <option value="Administração Pública Direta">
                                  Administração Pública Direta
                                </option>
                                <option value="Autarquia">Autarquia</option>
                                <option value="Empresa pública">
                                  Empresa pública
                                </option>
                                <option value="Sociedade de economia mista com administração privada">
                                  Sociedade de economia mista com administração
                                  privada
                                </option>
                                <option value="Sociedade de economia mista com administração pública">
                                  Sociedade de economia mista com administração
                                  pública
                                </option>
                              </select>
                            </InputG>
                          </td>
                          <td>
                            <InputM>
                              <label>
                                CNPJ<span> *</span>
                              </label>
                              <input
                                {...register("rs_cnpj")}
                                // defaultValue={dadosMunicipio?.rs_cnpj}
                                // onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputM>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Telefone<span> *</span>
                              </label>
                              <input
                                {...register("rs_telefone")}
                                // defaultValue={dadosMunicipio?.rs_telefone}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputP>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <InputP>
                              <label>
                                CEP<span> *</span>
                              </label>
                              <input
                                {...register("rs_cep")}
                                // defaultValue={dadosMunicipio?.rs_cep}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputP>
                          </td>
                          <td>
                            <InputM>
                              <label>
                                Endereço<span> *</span>
                              </label>
                              <input
                                {...register("rs_endereco")}
                                // defaultValue={dadosMunicipio?.rs_endereco}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputM>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Numero<span> *</span>
                              </label>
                              <input
                                {...register("rs_numero")}
                                // defaultValue={dadosMunicipio?.rs_numero}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputP>
                          </td>
                          <td>
                            <InputM>
                              <label>
                                Bairro<span> *</span>
                              </label>
                              <input
                                {...register("rs_bairro")}
                                // defaultValue={dadosMunicipio?.rs_bairro}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputM>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <InputG>
                              <label>
                                Nome do Responsável<span> *</span>
                              </label>
                              <input
                                {...register("rs_responsavel")}
                                // defaultValue={dadosMunicipio?.rs_responsavel}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputG>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Cargo<span> *</span>
                              </label>
                              <input
                                {...register("rs_cargo")}
                                // defaultValue={dadosMunicipio?.rs_cargo}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputP>
                          </td>
                          <td>
                            <InputM>
                              <label>
                                Email<span> *</span>
                              </label>
                              <input
                                {...register("rs_email")}
                                // defaultValue={dadosMunicipio?.rs_email}
                                onChange={handleOnChange}
                                type="text"
                              ></input>
                            </InputM>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </StepContent>

                  <StepperNavigation>
                    <StepperButton
                      secondary
                      onClick={handleBack}
                      disabled={activeStep === 0}
                    >
                      Voltar
                    </StepperButton>
                    <StepperButton
                      onClick={
                        activeStep === steps.length - 1
                          ? () => handleSubmit(handleCadastro)()
                          : handleNext
                      }
                    >
                      {activeStep === steps.length - 1 ? "Gravar" : "Gravar"}
                    </StepperButton>
                  </StepperNavigation>
                </StepperContainer>
              </div>
            </DivFormCadastro>

            <DivFormCadastro active={activeForm === "reguladorFiscalizador"}>
              <DivTituloForm>
                Regulador e Fiscalizador dos Serviços de Saneamento
              </DivTituloForm>
              <input
                {...register("id_regulador_fiscalizador_ss")}
                // defaultValue={dadosMunicipio?.id_regulador_fiscalizador_ss}
                onChange={handleOnChange}
                type="hidden"
              />
              <table>
                <tbody>
                  <tr>
                    <td>
                      <InputG>
                        <label>
                          Setor Responsável<span> *</span>
                        </label>
                        <input
                          {...register("rf_setor_responsavel")}
                          // defaultValue={dadosMunicipio?.rf_setor_responsavel}
                          onChange={handleOnChange}
                          type="text"
                        ></input>
                      </InputG>
                    </td>
                    <td>
                      <InputP>
                        <label>
                          Telefone Comercial<span> *</span>
                        </label>
                        <input
                          {...register("rf_telefone_comercial")}
                          // defaultValue={dadosMunicipio?.rf_telefone_comercial}
                          onChange={handleOnChange}
                          type="text"
                        ></input>
                      </InputP>
                    </td>
                  </tr>
                </tbody>
              </table>

              <table>
                <tbody>
                  <tr>
                    <td>
                      <InputG>
                        <label>
                          Nome Responsável<span> *</span>
                        </label>
                        <input
                          {...register("rf_responsavel")}
                          // defaultValue={dadosMunicipio?.rf_responsavel}
                          onChange={handleOnChange}
                          type="text"
                        ></input>
                      </InputG>
                    </td>
                    <td>
                      <InputM>
                        <label>
                          Cargo<span> *</span>
                        </label>
                        <input
                          {...register("rf_cargo")}
                          // defaultValue={dadosMunicipio?.rf_cargo}
                          onChange={handleOnChange}
                          type="text"
                        ></input>
                      </InputM>
                    </td>
                    <td>
                      <InputP>
                        <label>
                          Telefone<span> *</span>
                        </label>
                        <input
                          {...register("rf_telefone")}
                          // defaultValue={dadosMunicipio?.rf_telefone}
                          onChange={handleOnChange}
                          type="text"
                        ></input>
                      </InputP>
                    </td>
                  </tr>
                </tbody>
              </table>

              <table>
                <tbody>
                  <tr>
                    <td>
                      <InputG>
                        <label>
                          Email<span> *</span>
                        </label>
                        <input
                          {...register("rf_email")}
                          // defaultValue={dadosMunicipio?.rf_email}
                          onChange={handleOnChange}
                          type="text"
                        ></input>
                      </InputG>
                    </td>
                  </tr>
                </tbody>
              </table>

              <table>
                <tbody>
                  <tr>
                    <td>
                      <DivTextArea>
                        <label>
                          <b>Descrição</b> detalhada das funções e
                          responsabilidades<span> *</span>
                        </label>
                        <TextArea>
                          <textarea
                            {...register("rf_descricao")}
                            // defaultValue={dadosMunicipio?.rf_descricao}
                            onChange={handleOnChange}
                            name="rf_descricao"
                          />
                        </TextArea>
                      </DivTextArea>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div style={{ color: "#fff" }}>;</div>
              <SubmitButtonContainer>
                <SubmitButton type="submit">Gravar</SubmitButton>
              </SubmitButtonContainer>
            </DivFormCadastro>
            <DivFormCadastro active={activeForm === "controleSocial"}>
              <DivTituloForm>
                Controle Social dos Serviços Municipais de Saneamento
              </DivTituloForm>
              <input
                {...register("id_controle_social_sms")}
                // defaultValue={dadosMunicipio?.id_controle_social_sms}
                onChange={handleOnChange}
                type="hidden"
              />
              <InputG>
                <label>
                  Setor Responsável<span> *</span>
                </label>
                <input
                  {...register("cs_setor_responsavel")}
                  // defaultValue={dadosMunicipio?.cs_setor_responsavel}
                  onChange={handleOnChange}
                  type="text"
                ></input>
              </InputG>
              <InputP>
                <label>
                  Telefone<span> *</span>
                </label>
                <input
                  {...register("cs_telefone")}
                  // defaultValue={dadosMunicipio?.cs_telefone}
                  onChange={handleOnChange}
                  type="text"
                ></input>
              </InputP>
              <InputG>
                <label>
                  Email<span> *</span>
                </label>
                <input
                  {...register("cs_email")}
                  // defaultValue={dadosMunicipio?.cs_email}
                  onChange={handleOnChange}
                  type="text"
                ></input>
              </InputG>
              <SubmitButtonContainer>
                <SubmitButton type="submit">Gravar</SubmitButton>
              </SubmitButtonContainer>
            </DivFormCadastro>
            <DivFormCadastro active={activeForm === "controleSocial"}>
              <DivTituloForm>Responsável pelo SIMISAB</DivTituloForm>
              <input
                {...register("id_responsavel_simisab")}
                // defaultValue={dadosMunicipio?.id_responsavel_simisab}
                onChange={handleOnChange}
                type="hidden"
              />
              <InputG>
                <label>
                  Nome<span> *</span>
                </label>
                <input
                  {...register("simisab_responsavel")}
                  // defaultValue={dadosMunicipio?.simisab_responsavel}
                  onChange={handleOnChange}
                  type="text"
                ></input>
              </InputG>
              <InputP>
                <label>
                  Telefone<span> *</span>
                </label>
                <input
                  {...register("simisab_telefone")}
                  // defaultValue={dadosMunicipio?.simisab_telefone}
                  onChange={handleOnChange}
                  type="text"
                ></input>
              </InputP>
              <InputG>
                <label>
                  Email<span> *</span>
                </label>
                <input
                  {...register("simisab_email")}
                  // defaultValue={dadosMunicipio?.simisab_email}
                  onChange={handleOnChange}
                  type="text"
                ></input>
              </InputG>
              <SubmitButtonContainer>
                <SubmitButton type="submit">Gravar</SubmitButton>
              </SubmitButtonContainer>
            </DivFormCadastro>

            <DivFormCadastro active={activeForm === "dadosDemograficos"}>
              <DivTituloForm>Dados demográficos</DivTituloForm>
              <input
                {...register("id_dados_demograficos")}
                // defaultValue={dadosMunicipio?.id_dados_demograficos}
                onChange={handleOnChange}
                type="hidden"
                name="id_dados_demograficos"
              />
              <InputM>
                <label>
                  População urbana<span> *</span>
                </label>
                <input
                  {...register("dd_populacao_urbana")}
                  // defaultValue={dadosMunicipio?.dd_populacao_urbana}
                  onChange={handleOnChange}
                  type="text"
                  name="dd_populacao_urbana"
                ></input>
              </InputM>
              <InputM>
                <label>
                  População rural<span> *</span>
                </label>
                <input
                  {...register("dd_populacao_rural")}
                  // defaultValue={dadosMunicipio?.dd_populacao_rural}
                  onChange={handleOnChange}
                  type="text"
                  name="dd_populacao_rural"
                ></input>
              </InputM>
              <InputM>
                <label>
                  População Total<span> *</span>
                </label>
                <input
                  {...register("dd_populacao_total")}
                  // defaultValue={dadosMunicipio?.dd_populacao_total}
                  onChange={handleOnChange}
                  type="text"
                  name="dd_populacao_total"
                ></input>
              </InputM>
              <InputM>
                <label>
                  Total de Moradias<span> *</span>
                </label>
                <input
                  {...register("dd_total_moradias")}
                  // defaultValue={dadosMunicipio?.dd_total_moradias}
                  onChange={handleOnChange}
                  type="text"
                  name="dd_total_moradias"
                ></input>
              </InputM>

              <SubmitButtonContainer>
                <SubmitButton type="submit">Gravar</SubmitButton>
              </SubmitButtonContainer>
            </DivFormCadastro>
          </Form>
        </DivCenter>
      </MainContent>
    </Container>
  );
}
