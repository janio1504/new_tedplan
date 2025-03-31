import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

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
import InputMask from "react-input-mask";
import { onlyLettersAndCharacters, toTitleCase } from "@/util/util";
interface MunicipioProps {
  municipio: Municipio;
}

export default function Cadastro({ municipio }: MunicipioProps) {
  const { dadosMunicipio, loadMunicipio, loading, updateMunicipio } =
    useMunicipio();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      aa_natureza_juridica: dadosMunicipio?.aa_natureza_juridica || "",
    },
  });
  const [activeForm, setActiveForm] = useState("dadosMunicipio");
  const { usuario, signOut } = useAuth();
  const [content, setContent] = useState("");
  // const { dadosMunicipio, loadMunicipio, loading, updateMunicipio } =
  //   useMunicipio();

  const urbanPopulation = watch("dd_populacao_urbana");
  const ruralPopulation = watch("dd_populacao_rural");

  useEffect(() => {
    try {
      const urban = parseInt(urbanPopulation || "0");
      const rural = parseInt(ruralPopulation || "0");
      const total = urban + rural;

      if (!isNaN(total)) {
        setValue("dd_populacao_total", total.toString());
      }
    } catch (error) {
      console.error("Error calculating total population:", error);
    }
  }, [urbanPopulation, ruralPopulation, setValue]);
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    "Abastecimento de Água",
    "Esgotamento Sanitário",
    "Drenagem e Águas Pluviais",
    "Limpeza Pública e Resíduos Sólidos",
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
    if (usuario?.id_permissao === 4) {
      return;
    }

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

              <input {...register("id_municipio")} type="hidden"></input>
              <table>
                <thead></thead>
                <tbody>
                  <tr>
                    <td>
                      <InputP>
                        <label>Código do IBGE</label>
                        <input
                          {...register("municipio_codigo_ibge")}
                          disabled={true}
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
                        <label>Município</label>
                        <input
                          {...register("municipio_nome")}
                          disabled={true}
                          type="text"
                          onKeyPress={onlyLettersAndCharacters}
                        ></input>
                      </InputM>
                    </td>
                    <td>
                      <InputM>
                        <label>CNPJ</label>
                        <input
                          {...register("municipio_cnpj")}
                          disabled={true}
                          placeholder={""}
                          type="text"
                          onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
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
                          Prefeitura<span> *</span>
                        </label>
                        <input
                          aria-invalid={errors.value ? "true" : "false"}
                          {...register("municipio_nome_prefeitura", {
                            required: false,
                          })}
                          type="text"
                          style={{ textTransform: "capitalize" }}
                          onChange={(e) => {
                            const value = toTitleCase(e.target.value);
                            setValue("municipio_nome_prefeitura", value);
                          }}
                          onKeyPress={onlyLettersAndCharacters}
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
                        <Controller
                          name="municipio_cep"
                          control={control}
                          defaultValue=""
                          render={({ field: { onChange, value } }) => (
                            <InputMask
                              mask="99999-999"
                              maskChar={null}
                              value={value}
                              onChange={(e) => {
                                const justNumbers = e.target.value.replace(
                                  /\D/g,
                                  ""
                                );
                                onChange(justNumbers);
                              }}
                            >
                              {(inputProps) => (
                                <input
                                  {...inputProps}
                                  type="text"
                                  aria-invalid={errors.value ? "true" : "false"}
                                />
                              )}
                            </InputMask>
                          )}
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
                          type="text"
                          style={{ textTransform: "capitalize" }}
                          onChange={(e) => {
                            const value = toTitleCase(e.target.value);
                            setValue("municipio_endereco", value);
                          }}
                          onKeyPress={onlyLettersAndCharacters}
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
                          Número<span> *</span>
                        </label>
                        <input
                          aria-invalid={errors.value ? "true" : "false"}
                          {...register("municipio_numero", { required: false })}
                          type="text"
                          onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
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
                          type="text"
                          onKeyPress={onlyLettersAndCharacters}
                          style={{ textTransform: "capitalize" }}
                          onChange={(e) => {
                            const value = toTitleCase(e.target.value);
                            setValue("municipio_nome_prefeitura", value);
                          }}
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
                        <Controller
                          name="municipio_telefone"
                          control={control}
                          defaultValue=""
                          render={({ field: { onChange, value } }) => (
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
                                <input
                                  {...inputProps}
                                  type="text"
                                  aria-invalid={errors.value ? "true" : "false"}
                                />
                              )}
                            </InputMask>
                          )}
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
                          {...register("municipio_email", {
                            required: false,
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Endereço de email inválido",
                            },
                          })}
                          type="email"
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
                          type="text"
                          style={{ textTransform: "capitalize" }}
                          onChange={(e) => {
                            const value = toTitleCase(e.target.value);
                            setValue("municipio_nome_prefeitura", value);
                          }}
                          onKeyPress={onlyLettersAndCharacters}
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
                {usuario?.id_permissao !== 4 && (
                  <SubmitButton type="submit">Gravar</SubmitButton>
                )}
              </SubmitButtonContainer>
            </DivFormCadastro>
            <DivFormCadastro active={activeForm === "titularServicos"}>
              <DivTituloForm>
                Titulares dos Serviços Municipais de Saneamento Básico
              </DivTituloForm>
              <input {...register("id_titular_servicos_ms")} type="hidden" />
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
                          defaultValue={dadosMunicipio?.ts_setor_responsavel}
                          type="text"
                          style={{ textTransform: "capitalize" }}
                          onChange={(e) => {
                            const value = toTitleCase(e.target.value);
                            setValue("ts_setor_responsavel", value);
                          }}
                          onKeyPress={onlyLettersAndCharacters}
                        ></input>
                      </InputG>
                    </td>
                    <td>
                      <InputP>
                        <label>
                          Telefone Comercial<span> *</span>
                        </label>

                        <Controller
                          name="ts_telefone_comercial"
                          control={control}
                          defaultValue=""
                          render={({ field: { onChange, value } }) => (
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
                                <input
                                  {...inputProps}
                                  type="text"
                                  aria-invalid={errors.value ? "true" : "false"}
                                />
                              )}
                            </InputMask>
                          )}
                        />
                        {errors.ts_telefone_comercial &&
                          errors.ts_telefone_comercial.type && (
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
                          Nome do Responsável<span> *</span>
                        </label>
                        <input
                          {...register("ts_responsavel")}
                          type="text"
                          style={{ textTransform: "capitalize" }}
                          onChange={(e) => {
                            const value = toTitleCase(e.target.value);
                            setValue("ts_responsavel", value);
                          }}
                          onKeyPress={onlyLettersAndCharacters}
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
                          type="text"
                          style={{ textTransform: "capitalize" }}
                          onChange={(e) => {
                            const value = toTitleCase(e.target.value);
                            setValue("ts_cargo", value);
                          }}
                          onKeyPress={onlyLettersAndCharacters}
                        ></input>
                      </InputM>
                    </td>
                    <td>
                      <InputP>
                        <label>
                          Telefone<span> *</span>
                        </label>
                        {/* <input
                          {...register("ts_telefone")}
                          // defaultValue={dadosMunicipio?.ts_telefone}
                          onChange={handleOnChange}
                          type="text"
                        /> */}
                        <Controller
                          name="ts_telefone"
                          control={control}
                          defaultValue=""
                          render={({ field: { onChange, value } }) => (
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
                                <input
                                  {...inputProps}
                                  type="text"
                                  aria-invalid={errors.value ? "true" : "false"}
                                />
                              )}
                            </InputMask>
                          )}
                        />
                        {errors.ts_telefone && errors.ts_telefone.type && (
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
                          Email<span> *</span>
                        </label>
                        {/* <input
                          {...register("ts_email")}
                          onChange={handleOnChange}
                          type="text"
                        ></input> */}
                        <input
                          aria-invalid={errors.value ? "true" : "false"}
                          {...register("ts_email", {
                            required: false,
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Endereço de email inválido",
                            },
                          })}
                          type="email"
                        />
                        {errors.ts_email && errors.ts_email.type && (
                          <span>O campo é obrigatório!</span>
                        )}
                      </InputG>
                    </td>
                  </tr>
                </tbody>
              </table>
              <SubmitButtonContainer>
                {usuario?.id_permissao !== 4 && (
                  <SubmitButton type="submit">Gravar</SubmitButton>
                )}
              </SubmitButtonContainer>
            </DivFormCadastro>

            <DivFormCadastro active={activeForm === "prestadoresServicos"}>
              <DivTituloForm>
                Prestadores dos Serviços Municipais de Saneamento Básico
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
                    <DivEixo
                      style={{ color: "#000", marginTop: "60px" }}
                    ></DivEixo>
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
                                onChange={handleOnChange}
                                type="text"
                                onKeyPress={onlyLettersAndCharacters}
                              ></input>
                            </InputG>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Abrangência<span> *</span>
                              </label>
                              <select {...register("aa_abrangencia")}>
                                <option value={dadosMunicipio?.aa_abrangencia}>
                                  {dadosMunicipio?.aa_abrangencia}
                                </option>
                                <option value="Regional">Regional</option>
                                <option value="Microregional">
                                  Microregional
                                </option>
                                <option value="Local">Local</option>
                              </select>
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
                                {/* <option value="">Selecione uma opção</option> */}
                                {/* <option
                                  value={dadosMunicipio?.aa_natureza_juridica}
                                >
                                  {dadosMunicipio?.aa_natureza_juridica}
                                </option> */}
                                <option value="Empresa Privada">
                                  Empresa Privada
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
                                <option value="Organização Social">
                                  Organização Social
                                </option>
                              </select>
                            </InputG>
                          </td>
                          <td>
                            <InputM>
                              <label>
                                CNPJ<span> *</span>
                              </label>
                              {/* <input
                                {...register("aa_cnpj")}
                                onChange={handleOnChange}
                                type="text"
                                onKeyPress={(e) => {
                                  if (!/[0-9]/.test(e.key)) {
                                    e.preventDefault();
                                  }
                                }}
                              ></input> */}
                              <Controller
                                name="aa_cnpj"
                                control={control}
                                defaultValue=""
                                render={({ field: { onChange, value } }) => (
                                  <InputMask
                                    mask="99.999.999/9999-99"
                                    maskChar={null}
                                    value={value}
                                    onChange={(e) => {
                                      const justNumbers =
                                        e.target.value.replace(/\D/g, "");
                                      // Limit to 14 digits
                                      if (justNumbers.length <= 14) {
                                        // Store raw numbers in form state
                                        onChange(justNumbers);

                                        // Format display value (mask will handle this automatically)
                                        const formattedValue = e.target.value;
                                        e.target.value = formattedValue;
                                      }
                                    }}
                                  >
                                    {(inputProps) => (
                                      <input
                                        {...inputProps}
                                        type="text"
                                        placeholder="00.000.000/0000-00"
                                        aria-invalid={
                                          errors.value ? "true" : "false"
                                        }
                                      />
                                    )}
                                  </InputMask>
                                )}
                                rules={{
                                  required: true,
                                  minLength: 14,
                                  maxLength: 14,
                                  pattern: /^\d{14}$/,
                                }}
                              />
                            </InputM>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Telefone<span> *</span>
                              </label>
                              {/* <input
                                {...register("aa_telefone")}
                                onChange={handleOnChange}
                                type="text"
                                onKeyPress={(e) => {
                                  if (!/[0-9]/.test(e.key)) {
                                    e.preventDefault();
                                  }
                                }}
                              ></input> */}
                              <Controller
                                name="aa_telefone"
                                control={control}
                                defaultValue=""
                                render={({ field: { onChange, value } }) => (
                                  <InputMask
                                    mask="(99) 99999-9999"
                                    maskChar={null}
                                    value={value}
                                    onChange={(e) => {
                                      const justNumbers =
                                        e.target.value.replace(/\D/g, "");
                                      if (justNumbers.length <= 11) {
                                        onChange(justNumbers);
                                      }
                                    }}
                                  >
                                    {(inputProps) => (
                                      <input
                                        {...inputProps}
                                        type="text"
                                        aria-invalid={
                                          errors.value ? "true" : "false"
                                        }
                                      />
                                    )}
                                  </InputMask>
                                )}
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
                            <InputP>
                              <label>
                                CEP<span> *</span>
                              </label>
                              {/* <input
                                {...register("aa_cep")}
                                // defaultValue={dadosMunicipio?.aa_cep}
                                onChange={handleOnChange}
                                type="text"
                                onKeyPress={(e) => {
                                  if (!/[0-9]/.test(e.key)) {
                                    e.preventDefault();
                                  }
                                }}
                              ></input> */}
                              <Controller
                                name="aa_cep"
                                control={control}
                                defaultValue=""
                                render={({ field: { onChange, value } }) => (
                                  <InputMask
                                    mask="99999-999"
                                    maskChar={null}
                                    value={value}
                                    onChange={(e) => {
                                      const justNumbers =
                                        e.target.value.replace(/\D/g, "");
                                      onChange(justNumbers);
                                    }}
                                  >
                                    {(inputProps) => (
                                      <input
                                        {...inputProps}
                                        type="text"
                                        aria-invalid={
                                          errors.value ? "true" : "false"
                                        }
                                      />
                                    )}
                                  </InputMask>
                                )}
                              />
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
                                onKeyPress={onlyLettersAndCharacters}
                              ></input>
                            </InputM>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Número<span> *</span>
                              </label>
                              <input
                                {...register("aa_numero")}
                                // defaultValue={dadosMunicipio?.aa_numero}
                                onChange={handleOnChange}
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
                              <label>
                                Bairro<span> *</span>
                              </label>
                              <input
                                {...register("aa_bairro")}
                                // defaultValue={dadosMunicipio?.aa_bairro}
                                onChange={handleOnChange}
                                type="text"
                                onKeyPress={onlyLettersAndCharacters}
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
                                onKeyPress={onlyLettersAndCharacters}
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
                                onKeyPress={onlyLettersAndCharacters}
                              ></input>
                            </InputP>
                          </td>
                          <td>
                            <InputM>
                              <label>
                                Email<span> *</span>
                              </label>
                              {/* <input
                                {...register("aa_email")}
                                onChange={handleOnChange}
                                type="text"
                                onKeyPress={onlyLettersAndCharacters}
                              ></input> */}
                              <input
                                aria-invalid={errors.value ? "true" : "false"}
                                {...register("aa_email", {
                                  required: false,
                                  pattern: {
                                    value:
                                      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Endereço de email inválido",
                                  },
                                })}
                                type="email"
                              />
                              {errors.aa_email && errors.aa_email.type && (
                                <span>O campo é obrigatório!</span>
                              )}
                            </InputM>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </StepContent>

                  <StepContent active={activeStep === 1}>
                    <DivEixo
                      style={{ color: "#000", marginTop: "60px" }}
                    ></DivEixo>
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
                                type="text"
                                onKeyPress={onlyLettersAndCharacters}
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
                              {/* <input
                                {...register("es_cnpj")}
                                onChange={handleOnChange}
                                type="text"
                              ></input> */}
                              <Controller
                                name="es_cnpj"
                                control={control}
                                defaultValue=""
                                render={({ field: { onChange, value } }) => (
                                  <InputMask
                                    mask="99.999.999/9999-99"
                                    maskChar={null}
                                    value={value}
                                    onChange={(e) => {
                                      const justNumbers =
                                        e.target.value.replace(/\D/g, "");
                                      // Limit to 14 digits
                                      if (justNumbers.length <= 14) {
                                        // Store raw numbers in form state
                                        onChange(justNumbers);

                                        // Format display value (mask will handle this automatically)
                                        const formattedValue = e.target.value;
                                        e.target.value = formattedValue;
                                      }
                                    }}
                                  >
                                    {(inputProps) => (
                                      <input
                                        {...inputProps}
                                        type="text"
                                        placeholder="00.000.000/0000-00"
                                        aria-invalid={
                                          errors.value ? "true" : "false"
                                        }
                                      />
                                    )}
                                  </InputMask>
                                )}
                                rules={{
                                  required: true,
                                  minLength: 14,
                                  maxLength: 14,
                                  pattern: /^\d{14}$/,
                                }}
                              />
                            </InputM>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Telefone<span> *</span>
                              </label>
                              {/* <input
                                {...register("es_telefone")}
                                onChange={handleOnChange}
                                type="text"
                              ></input> */}
                              <Controller
                                name="es_telefone"
                                control={control}
                                defaultValue=""
                                render={({ field: { onChange, value } }) => (
                                  <InputMask
                                    mask="(99) 99999-9999"
                                    maskChar={null}
                                    value={value}
                                    onChange={(e) => {
                                      const justNumbers =
                                        e.target.value.replace(/\D/g, "");
                                      if (justNumbers.length <= 11) {
                                        onChange(justNumbers);
                                      }
                                    }}
                                  >
                                    {(inputProps) => (
                                      <input
                                        {...inputProps}
                                        type="text"
                                        aria-invalid={
                                          errors.value ? "true" : "false"
                                        }
                                      />
                                    )}
                                  </InputMask>
                                )}
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
                            <InputP>
                              <label>
                                CEP<span> *</span>
                              </label>
                              {/* <input
                                {...register("es_cep")}
                                // defaultValue={dadosMunicipio?.es_cep}
                                onChange={handleOnChange}
                                type="text"
                              ></input> */}
                              <Controller
                                name="es_cep"
                                control={control}
                                defaultValue=""
                                render={({ field: { onChange, value } }) => (
                                  <InputMask
                                    mask="99999-999"
                                    maskChar={null}
                                    value={value}
                                    onChange={(e) => {
                                      const justNumbers =
                                        e.target.value.replace(/\D/g, "");
                                      onChange(justNumbers);
                                    }}
                                  >
                                    {(inputProps) => (
                                      <input
                                        {...inputProps}
                                        type="text"
                                        aria-invalid={
                                          errors.value ? "true" : "false"
                                        }
                                      />
                                    )}
                                  </InputMask>
                                )}
                              />
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
                                Número<span> *</span>
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
                              {/* <input
                                {...register("es_email")}
                                onChange={handleOnChange}
                                type="text"
                              ></input> */}
                              <input
                                aria-invalid={errors.value ? "true" : "false"}
                                {...register("es_email", {
                                  required: false,
                                  pattern: {
                                    value:
                                      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Endereço de email inválido",
                                  },
                                })}
                                type="email"
                              />
                              {errors.es_email && errors.es_email.type && (
                                <span>O campo é obrigatório!</span>
                              )}
                            </InputM>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </StepContent>

                  <StepContent active={activeStep === 2}>
                    <DivEixo
                      style={{ color: "#000", marginTop: "60px" }}
                    ></DivEixo>
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
                              {/* <input
                                {...register("da_cnpj")}
                                onChange={handleOnChange}
                                type="text"
                              ></input> */}
                              <Controller
                                name="da_cnpj"
                                control={control}
                                defaultValue=""
                                render={({ field: { onChange, value } }) => (
                                  <InputMask
                                    mask="99.999.999/9999-99"
                                    maskChar={null}
                                    value={value}
                                    onChange={(e) => {
                                      const justNumbers =
                                        e.target.value.replace(/\D/g, "");
                                      // Limit to 14 digits
                                      if (justNumbers.length <= 14) {
                                        // Store raw numbers in form state
                                        onChange(justNumbers);

                                        // Format display value (mask will handle this automatically)
                                        const formattedValue = e.target.value;
                                        e.target.value = formattedValue;
                                      }
                                    }}
                                  >
                                    {(inputProps) => (
                                      <input
                                        {...inputProps}
                                        type="text"
                                        placeholder="00.000.000/0000-00"
                                        aria-invalid={
                                          errors.value ? "true" : "false"
                                        }
                                      />
                                    )}
                                  </InputMask>
                                )}
                                rules={{
                                  required: true,
                                  minLength: 14,
                                  maxLength: 14,
                                  pattern: /^\d{14}$/,
                                }}
                              />
                            </InputM>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Telefone<span> *</span>
                              </label>
                              {/* <input
                                {...register("da_telefone")}
                                onChange={handleOnChange}
                                type="text"
                              ></input> */}
                              <Controller
                                name="da_telefone"
                                control={control}
                                defaultValue=""
                                render={({ field: { onChange, value } }) => (
                                  <InputMask
                                    mask="(99) 99999-9999"
                                    maskChar={null}
                                    value={value}
                                    onChange={(e) => {
                                      const justNumbers =
                                        e.target.value.replace(/\D/g, "");
                                      if (justNumbers.length <= 11) {
                                        onChange(justNumbers);
                                      }
                                    }}
                                  >
                                    {(inputProps) => (
                                      <input
                                        {...inputProps}
                                        type="text"
                                        aria-invalid={
                                          errors.value ? "true" : "false"
                                        }
                                      />
                                    )}
                                  </InputMask>
                                )}
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
                            <InputP>
                              <label>
                                CEP<span> *</span>
                              </label>
                              {/* <input
                                {...register("da_cep")}
                                onChange={handleOnChange}
                                type="text"
                              ></input> */}
                              <Controller
                                name="da_cep"
                                control={control}
                                defaultValue=""
                                render={({ field: { onChange, value } }) => (
                                  <InputMask
                                    mask="99999-999"
                                    maskChar={null}
                                    value={value}
                                    onChange={(e) => {
                                      const justNumbers =
                                        e.target.value.replace(/\D/g, "");
                                      onChange(justNumbers);
                                    }}
                                  >
                                    {(inputProps) => (
                                      <input
                                        {...inputProps}
                                        type="text"
                                        aria-invalid={
                                          errors.value ? "true" : "false"
                                        }
                                      />
                                    )}
                                  </InputMask>
                                )}
                              />
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
                                Número<span> *</span>
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
                              {/* <input
                                {...register("da_email")}
                                onChange={handleOnChange}
                                type="text"
                              ></input> */}
                              <input
                                aria-invalid={errors.value ? "true" : "false"}
                                {...register("da_email", {
                                  required: false,
                                  pattern: {
                                    value:
                                      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Endereço de email inválido",
                                  },
                                })}
                                type="email"
                              />
                              {errors.da_email && errors.da_email.type && (
                                <span>O campo é obrigatório!</span>
                              )}
                            </InputM>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </StepContent>

                  <StepContent active={activeStep === 3}>
                    <DivEixo
                      style={{ color: "#000", marginTop: "60px" }}
                    ></DivEixo>
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
                              {/* <input
                                {...register("rs_cnpj")}
                                type="text"
                              ></input> */}
                              <Controller
                                name="rs_cnpj"
                                control={control}
                                defaultValue=""
                                render={({ field: { onChange, value } }) => (
                                  <InputMask
                                    mask="99.999.999/9999-99"
                                    maskChar={null}
                                    value={value}
                                    onChange={(e) => {
                                      const justNumbers =
                                        e.target.value.replace(/\D/g, "");
                                      // Limit to 14 digits
                                      if (justNumbers.length <= 14) {
                                        // Store raw numbers in form state
                                        onChange(justNumbers);

                                        // Format display value (mask will handle this automatically)
                                        const formattedValue = e.target.value;
                                        e.target.value = formattedValue;
                                      }
                                    }}
                                  >
                                    {(inputProps) => (
                                      <input
                                        {...inputProps}
                                        type="text"
                                        placeholder="00.000.000/0000-00"
                                        aria-invalid={
                                          errors.value ? "true" : "false"
                                        }
                                      />
                                    )}
                                  </InputMask>
                                )}
                                rules={{
                                  required: true,
                                  minLength: 14,
                                  maxLength: 14,
                                  pattern: /^\d{14}$/,
                                }}
                              />
                            </InputM>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Telefone<span> *</span>
                              </label>
                              {/* <input
                                {...register("rs_telefone")}
                                onChange={handleOnChange}
                                type="text"
                              ></input> */}
                              <Controller
                                name="rs_telefone"
                                control={control}
                                defaultValue=""
                                render={({ field: { onChange, value } }) => (
                                  <InputMask
                                    mask="(99) 99999-9999"
                                    maskChar={null}
                                    value={value}
                                    onChange={(e) => {
                                      const justNumbers =
                                        e.target.value.replace(/\D/g, "");
                                      if (justNumbers.length <= 11) {
                                        onChange(justNumbers);
                                      }
                                    }}
                                  >
                                    {(inputProps) => (
                                      <input
                                        {...inputProps}
                                        type="text"
                                        aria-invalid={
                                          errors.value ? "true" : "false"
                                        }
                                      />
                                    )}
                                  </InputMask>
                                )}
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
                            <InputP>
                              <label>
                                CEP<span> *</span>
                              </label>
                              {/* <input
                                {...register("rs_cep")}
                                onChange={handleOnChange}
                                type="text"
                              ></input> */}
                              <Controller
                                name="rs_cep"
                                control={control}
                                defaultValue=""
                                render={({ field: { onChange, value } }) => (
                                  <InputMask
                                    mask="99999-999"
                                    maskChar={null}
                                    value={value}
                                    onChange={(e) => {
                                      const justNumbers =
                                        e.target.value.replace(/\D/g, "");
                                      onChange(justNumbers);
                                    }}
                                  >
                                    {(inputProps) => (
                                      <input
                                        {...inputProps}
                                        type="text"
                                        aria-invalid={
                                          errors.value ? "true" : "false"
                                        }
                                      />
                                    )}
                                  </InputMask>
                                )}
                              />
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
                                Número<span> *</span>
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
                              {/* <input
                                {...register("rs_email")}                          
                                onChange={handleOnChange}
                                type="text"
                              ></input> */}
                              <input
                                aria-invalid={errors.value ? "true" : "false"}
                                {...register("rs_email", {
                                  required: false,
                                  pattern: {
                                    value:
                                      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Endereço de email inválido",
                                  },
                                })}
                                type="email"
                              />
                              {errors.rs_email && errors.rs_email.type && (
                                <span>O campo é obrigatório!</span>
                              )}
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
                Regulador e Fiscalizador dos Serviços Municipais de Saneamento
                Básico
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
                          // onChange={handleOnChange}
                          type="text"
                          style={{ textTransform: "capitalize" }}
                          onChange={(e) => {
                            const value = toTitleCase(e.target.value);
                            setValue("rf_setor_responsavel", value);
                          }}
                        ></input>
                      </InputG>
                    </td>
                    <td>
                      <InputP>
                        <label>
                          Telefone Comercial<span> *</span>
                        </label>
                        {/* <input
                          {...register("rf_telefone_comercial")}
                          onChange={handleOnChange}
                          type="text"
                        ></input> */}
                        <Controller
                          name="rf_telefone_comercial"
                          control={control}
                          defaultValue=""
                          render={({ field: { onChange, value } }) => (
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
                                <input
                                  {...inputProps}
                                  type="text"
                                  aria-invalid={errors.value ? "true" : "false"}
                                />
                              )}
                            </InputMask>
                          )}
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
                          Nome do Responsável<span> *</span>
                        </label>
                        <input
                          {...register("rf_responsavel")}
                          // defaultValue={dadosMunicipio?.rf_responsavel}
                          // onChange={handleOnChange}
                          type="text"
                          onChange={(e) => {
                            const value = toTitleCase(e.target.value);
                            setValue("rf_responsavel", value);
                          }}
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
                          // onChange={handleOnChange}
                          type="text"
                          onChange={(e) => {
                            const value = toTitleCase(e.target.value);
                            setValue("rf_responsavel", value);
                          }}
                        ></input>
                      </InputM>
                    </td>
                    <td>
                      <InputP>
                        <label>
                          Telefone<span> *</span>
                        </label>
                        {/* <input
                          {...register("rf_telefone")}
                          onChange={handleOnChange}
                          type="text"
                        ></input> */}
                        <Controller
                          name="rf_telefone"
                          control={control}
                          defaultValue=""
                          render={({ field: { onChange, value } }) => (
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
                                <input
                                  {...inputProps}
                                  type="text"
                                  aria-invalid={errors.value ? "true" : "false"}
                                />
                              )}
                            </InputMask>
                          )}
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
                        {/* <input
                          {...register("rf_email")}
                          onChange={handleOnChange}
                          type="text"
                        ></input> */}
                        <input
                          aria-invalid={errors.value ? "true" : "false"}
                          {...register("rf_email", {
                            required: false,
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Endereço de email inválido",
                            },
                          })}
                          type="email"
                        />
                        {errors.rf_email && errors.rf_email.type && (
                          <span>O campo é obrigatório!</span>
                        )}
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
                {usuario?.id_permissao !== 4 && (
                  <SubmitButton type="submit">Gravar</SubmitButton>
                )}
              </SubmitButtonContainer>
            </DivFormCadastro>
            <DivFormCadastro active={activeForm === "controleSocial"}>
              <DivTituloForm>
                Controle Social dos Serviços Municipais de Saneamento Básico
              </DivTituloForm>
              <input
                {...register("id_controle_social_sms")}
                onChange={handleOnChange}
                type="hidden"
              />
              <InputG>
                <label>
                  Setor Responsável<span> *</span>
                </label>
                <input
                  {...register("cs_setor_responsavel")}
                  style={{ textTransform: "capitalize" }}
                  onChange={(e) => {
                    const value = toTitleCase(e.target.value);
                    setValue("municipio_nome_prefeitura", value);
                  }}
                  onKeyPress={onlyLettersAndCharacters}
                  type="text"
                ></input>
              </InputG>
              <InputP>
                <label>
                  Telefone<span> *</span>
                </label>
                {/* <input
                  {...register("cs_telefone")}
                  onChange={handleOnChange}
                  type="text"
                ></input> */}
                <Controller
                  name="cs_telefone"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value } }) => (
                    <InputMask
                      mask="(99) 99999-9999"
                      maskChar={null}
                      value={value}
                      onChange={(e) => {
                        const justNumbers = e.target.value.replace(/\D/g, "");
                        if (justNumbers.length <= 11) {
                          onChange(justNumbers);
                        }
                      }}
                    >
                      {(inputProps) => (
                        <input
                          {...inputProps}
                          type="text"
                          aria-invalid={errors.value ? "true" : "false"}
                        />
                      )}
                    </InputMask>
                  )}
                />
              </InputP>
              <InputG>
                <label>
                  Email<span> *</span>
                </label>
                {/* <input
                  {...register("cs_email")}
                  onChange={handleOnChange}
                  type="text"
                ></input> */}
                <input
                  aria-invalid={errors.value ? "true" : "false"}
                  {...register("cs_email", {
                    required: false,
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Endereço de email inválido",
                    },
                  })}
                  type="email"
                />
                {errors.cs_email && errors.cs_email.type && (
                  <span>O campo é obrigatório!</span>
                )}
              </InputG>
              <SubmitButtonContainer>
                {usuario?.id_permissao !== 4 && (
                  <SubmitButton type="submit">Gravar</SubmitButton>
                )}
              </SubmitButtonContainer>
            </DivFormCadastro>
            <DivFormCadastro active={activeForm === "controleSocial"}>
              <DivTituloForm>Responsável Técnico do SIMISAB</DivTituloForm>
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
                  onKeyPress={onlyLettersAndCharacters}
                  style={{ textTransform: "capitalize" }}
                  onChange={(e) => {
                    const value = toTitleCase(e.target.value);
                    setValue("municipio_nome_prefeitura", value);
                  }}
                  type="text"
                ></input>
              </InputG>
              <InputP>
                <label>
                  Telefone<span> *</span>
                </label>
                {/* <input
                  {...register("simisab_telefone")}
                  onChange={handleOnChange}
                  type="text"
                ></input> */}
                <Controller
                  name="simisab_telefone"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value } }) => (
                    <InputMask
                      mask="(99) 99999-9999"
                      maskChar={null}
                      value={value}
                      onChange={(e) => {
                        const justNumbers = e.target.value.replace(/\D/g, "");
                        if (justNumbers.length <= 11) {
                          onChange(justNumbers);
                        }
                      }}
                    >
                      {(inputProps) => (
                        <input
                          {...inputProps}
                          type="text"
                          aria-invalid={errors.value ? "true" : "false"}
                        />
                      )}
                    </InputMask>
                  )}
                />
              </InputP>
              <InputG>
                <label>
                  Email<span> *</span>
                </label>
                {/* <input
                  {...register("simisab_email")}
                  onChange={handleOnChange}
                  type="text"
                ></input> */}
                <input
                  aria-invalid={errors.value ? "true" : "false"}
                  {...register("simisab_email", {
                    required: false,
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Endereço de email inválido",
                    },
                  })}
                  type="email"
                />
                {errors.simisab_email && errors.simisab_email.type && (
                  <span>O campo é obrigatório!</span>
                )}
              </InputG>
              <SubmitButtonContainer>
                {usuario?.id_permissao !== 4 && (
                  <SubmitButton type="submit">Gravar</SubmitButton>
                )}
              </SubmitButtonContainer>
            </DivFormCadastro>

            <DivFormCadastro active={activeForm === "dadosDemograficos"}>
              <DivTituloForm>Dados Demográficos</DivTituloForm>
              <input
                {...register("id_dados_demograficos")}
                // defaultValue={dadosMunicipio?.id_dados_demograficos}
                onChange={handleOnChange}
                type="hidden"
                name="id_dados_demograficos"
              />
              <InputM>
                <label>
                  População Urbana<span> *</span>
                </label>
                <input
                  {...register("dd_populacao_urbana")}
                  type="text"
                  name="dd_populacao_urbana"
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                ></input>
              </InputM>
              <InputM>
                <label>
                  População Rural<span> *</span>
                </label>
                <input
                  {...register("dd_populacao_rural")}
                  type="text"
                  name="dd_populacao_rural"
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
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
                  disabled={true}
                  readOnly
                  // onKeyPress={(e) => {
                  //   if (!/[0-9]/.test(e.key)) {
                  //     e.preventDefault();
                  //   }
                  // }}
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
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                ></input>
              </InputM>

              <SubmitButtonContainer>
                {usuario?.id_permissao !== 4 && (
                  <SubmitButton type="submit">Gravar</SubmitButton>
                )}
              </SubmitButtonContainer>
            </DivFormCadastro>
          </Form>
        </DivCenter>
      </MainContent>
    </Container>
  );
}
