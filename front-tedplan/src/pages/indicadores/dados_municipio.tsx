import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  Container,
  Sidebar,
  SidebarItem,
  MainContent,
  DivCenter,
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
  StepContent,
  StepLabel,
  StepperNavigation,
  StepperWrapper,
  StepperContainer,
  StepperButton,
  DivFormCadastro,
  StepButton,
} from "../../styles/indicadores";
import HeadIndicadores from "../../components/headIndicadores";
import MenuIndicadores from "../../components/MenuIndicadoresCadastro";

import "suneditor/dist/css/suneditor.min.css";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import MenuHorizontal from "../../components/MenuHorizontal";
import { Municipio } from "../../types";
import { useMunicipio } from "../../contexts/MunicipioContext";
const InputMask = require("react-input-mask");
import { onlyLettersAndCharacters, toTitleCase } from "@/util/util";
import api from "@/services/api";
import { Loading } from "@/components/Loading";
import styled from "styled-components";

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
  } = useForm<Municipio>({});
  const [activeForm, setActiveForm] = useState("dadosMunicipio");
  const { usuario, signOut } = useAuth();
  const [content, setContent] = useState("");
  const [responsaveisSimisab, setResponsaveisSimisab] = useState<any[]>([]);
  const [copiaParaEsgoto, setCopiaParaEsgoto] = useState(false);

  const popUrbana = watch("dd_populacao_urbana");
  const popRural = watch("dd_populacao_rural");

  const estabUrbano = watch("OGM4001");
  const estabRural = watch("OGM4002");

  const domiUrbano = watch("OGM4004");
  const domiRural = watch("OGM4005");

  const viaPublicaPavimento = watch("OGM4007");
  const viaPublicaSemPavimento = watch("OGM4008");

  useEffect(() => {
    try {
      const urban = parseInt(popUrbana || "0");
      const rural = parseInt(popRural || "0");
      const total = urban + rural;

      if (!isNaN(total)) {
        setValue("dd_populacao_total", total.toString());
      }
    } catch (error) {
      console.error("Error calculating total population:", error);
    }
  }, [popUrbana, popRural, setValue]);

  useEffect(() => {
    try {
      const urban = parseInt(estabUrbano || "0");
      const rural = parseInt(estabRural || "0");
      const total = urban + rural;

      if (!isNaN(total)) {
        setValue("", total.toString());
      }
    } catch (error) {
      console.error("Error calculating total population:", error);
    }
  }, [estabUrbano, estabRural, setValue]);

  useEffect(() => {
    try {
      const urban = parseInt(domiUrbano || "0");
      const rural = parseInt(domiRural || "0");
      const total = urban + rural;

      if (!isNaN(total)) {
        setValue("OGM4006", total.toString());
      }
    } catch (error) {
      console.error("Error calculating total population:", error);
    }
  }, [domiUrbano, domiRural, setValue]);

  useEffect(() => {
    try {
      const urban = parseInt(viaPublicaPavimento || "0");
      const rural = parseInt(viaPublicaSemPavimento || "0");
      const total = urban + rural;

      if (!isNaN(total)) {
        setValue("OGM4009", total.toString());
      }
    } catch (error) {
      console.error("Error calculating total population:", error);
    }
  }, [viaPublicaPavimento, viaPublicaSemPavimento, setValue]);

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
        setValue(key as keyof Municipio, value);
      });
    }
    getResponsaveisSimisab();
  }, [dadosMunicipio, setValue]);

  useEffect(() => {
    if (copiaParaEsgoto && activeStep === 0) {
      const fieldsToWatch = [
        "aa_secretaria_setor_responsavel",
        "aa_abrangencia",
        "aa_natureza_juridica",
        "aa_cnpj",
        "aa_telefone",
        "aa_cep",
        "aa_endereco",
        "aa_numero",
        "aa_bairro",
        "aa_responsavel",
        "aa_cargo",
        "aa_email",
      ];

      const subscription = watch((value, { name }) => {
        if (fieldsToWatch.includes(name)) {
          const sanitaryField = name.replace("aa_", "es_") as keyof Municipio;
          setValue(sanitaryField, value[name]);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [copiaParaEsgoto, activeStep, watch, setValue]);

  const handleNext = () => {
    if (activeStep === 0 && copiaParaEsgoto) {
      setActiveStep(2);
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleStepClick = (step: number) => {
    setActiveStep(step);
  };

  async function handleCadastro(data: any) {
    try {
      if (usuario?.id_permissao === 4) {
        return;
      }
      console.log("Dados enviados:", data);

      const submitData = {
        ...data,
        id_municipio: usuario?.id_municipio,
      };

      await updateMunicipio(submitData);

      await loadMunicipio();

      toast.success("Dados gravados com sucesso!", {});
    } catch (error) {
      console.error("Erro ao gravar dados:", error);
      toast.error("Erro ao gravar dados", {});
    }
  }

  async function getResponsaveisSimisab() {
    try {
      const response = await api.get(
        "get-responsaveis-simisab/" + usuario?.id_municipio
      );
      if (Array.isArray(response.data)) {
        setResponsaveisSimisab(response.data);
      } else {
        console.error("Expected array but got:", typeof response.data);
        setResponsaveisSimisab([]);
      }
    } catch (error) {
      console.error("Error fetching responsaveis simisab:", error);
      setResponsaveisSimisab([]);
    }
  }

  function handleOnChange(content) {
    setContent(content);
  }

  async function getResSimisab(id) {
    if (id) {
      let resSimisab = responsaveisSimisab.find((res) => res.id_usuario == id);
      if (resSimisab) {
        setValue("simisab_responsavel", resSimisab.nome);
        setValue("simisab_telefone", resSimisab.telefone);
        setValue("simisab_email", resSimisab.email);
      }
    }
  }

  const [activeTab, setActiveTab] = useState("controleSocial");

  const TabContainer = styled.div`
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  `;

  const TabButton = styled.button<{ active: boolean }>`
    padding: 10px 20px;
    border: none;
    background: ${(props) => (props.active ? "#007bff" : "#e9ecef")};
    color: ${(props) => (props.active ? "white" : "black")};
    cursor: pointer;
    border-radius: 4px;
  `;

  return (
    <Container>
      {loading && <Loading />}

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
          active={activeForm === "dadosGeograficos"}
          onClick={() => setActiveForm("dadosGeograficos")}
        >
          Dados Geográficos
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
                          {...register("municipio_nome_prefeitura", {
                            required: "Este campo é obrigatório",
                          })}
                          type="text"
                          style={{ textTransform: "capitalize" }}
                          onChange={(e) => {
                            const value = toTitleCase(e.target.value);
                            setValue("municipio_nome_prefeitura", value);
                          }}
                          onKeyPress={onlyLettersAndCharacters}
                        />
                        {errors.municipio_nome_prefeitura && (
                          <span>
                            {errors.municipio_nome_prefeitura.message}
                          </span>
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
                          rules={{ required: "O CEP é obrigatório" }}
                          render={({
                            field: { onChange, value },
                            fieldState: { error },
                          }) => (
                            <>
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
                                    style={{ borderColor: error ? "red" : "" }}
                                  />
                                )}
                              </InputMask>
                              {error && <span>{error.message}</span>}
                            </>
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
                          Endereço<span> *</span>
                        </label>
                        <input
                          {...register("municipio_endereco", {
                            required: "Este campo é obrigatório",
                          })}
                          type="text"
                          style={{ textTransform: "capitalize" }}
                          onChange={(e) => {
                            const value = toTitleCase(e.target.value);
                            setValue("municipio_endereco", value);
                          }}
                          onKeyPress={onlyLettersAndCharacters}
                        />
                        {errors.municipio_endereco && (
                          <span>{errors.municipio_endereco.message}</span>
                        )}
                      </InputG>
                    </td>
                    <td>
                      <InputP>
                        <label>
                          Número<span> *</span>
                        </label>
                        <input
                          {...register("municipio_numero", {
                            required: "Este campo é obrigatório",
                          })}
                          type="text"
                          onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        />
                        {errors.municipio_numero && (
                          <span>{errors.municipio_numero.message}</span>
                        )}
                      </InputP>
                    </td>
                    <td>
                      <InputM>
                        <label>
                          Bairro<span> *</span>
                        </label>
                        <input
                          {...register("municipio_bairro", {
                            required: "Este campo é obrigatório",
                          })}
                          type="text"
                          onKeyPress={onlyLettersAndCharacters}
                          style={{ textTransform: "capitalize" }}
                          onChange={(e) => {
                            const value = toTitleCase(e.target.value);
                            setValue("municipio_bairro", value);
                          }}
                        />
                        {errors.municipio_bairro && (
                          <span>{errors.municipio_bairro.message}</span>
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
                    </td>
                    <td>
                      <InputM>
                        <label>
                          E-mail<span> *</span>
                        </label>
                        <input
                          {...register("municipio_email", {
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Endereço de email inválido",
                            },
                          })}
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
                          {...register("municipio_prefeito", {
                            required: "Este campo é obrigatório",
                          })}
                          type="text"
                          style={{ textTransform: "capitalize" }}
                          onChange={(e) => {
                            const value = toTitleCase(e.target.value);
                            setValue("municipio_prefeito", value);
                          }}
                          onKeyPress={onlyLettersAndCharacters}
                        />
                        {errors.municipio_prefeito && (
                          <span>{errors.municipio_prefeito.message}</span>
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
                          {...register("ts_setor_responsavel", {
                            required: "Este campo é obrigatório",
                          })}
                          type="text"
                          style={{ textTransform: "capitalize" }}
                          onChange={(e) => {
                            const value = toTitleCase(e.target.value);
                            setValue("ts_setor_responsavel", value);
                          }}
                          onKeyPress={onlyLettersAndCharacters}
                        ></input>
                      </InputG>
                      {errors.ts_setor_responsavel && (
                        <span>{errors.ts_setor_responsavel.message}</span>
                      )}
                    </td>
                    <td>
                      <InputP>
                        <label>
                          Telefone Comercial<span> *</span>
                        </label>

                        <Controller
                          name="ts_telefone_comercial"
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
                    </td>
                  </tr>
                </tbody>
              </table>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <InputM>
                        <label>
                          Nome do Responsável<span> *</span>
                        </label>
                        <input
                          {...register("ts_responsavel", {
                            required: "Este campo é obrigatório",
                          })}
                          type="text"
                          style={{ textTransform: "capitalize" }}
                          onChange={(e) => {
                            const value = toTitleCase(e.target.value);
                            setValue("ts_responsavel", value);
                          }}
                          onKeyPress={onlyLettersAndCharacters}
                        ></input>
                      </InputM>
                      {errors.ts_responsavel && (
                        <span>{errors.ts_responsavel.message}</span>
                      )}
                    </td>
                    <td>
                      <InputM>
                        <label>
                          Cargo<span> *</span>
                        </label>
                        <input
                          {...register("ts_cargo", {
                            required: "Este campo é obrigatório",
                          })}
                          type="text"
                          style={{ textTransform: "capitalize" }}
                          onChange={(e) => {
                            const value = toTitleCase(e.target.value);
                            setValue("ts_cargo", value);
                          }}
                          onKeyPress={onlyLettersAndCharacters}
                        ></input>
                      </InputM>
                      {errors.ts_cargo && (
                        <span>{errors.ts_cargo.message}</span>
                      )}
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
                          Função<span> *</span>
                        </label>
                        <select {...register("ts_funcao")}>
                          <option
                            value={dadosMunicipio?.ts_funcao || "Selecione..."}
                          >
                            {dadosMunicipio?.ts_funcao || "Selecione..."}
                          </option>
                          {dadosMunicipio?.ts_funcao !== "Encargo Direto" && (
                            <option value="Encargo Direto">
                              Encargo Direto
                            </option>
                          )}
                          {dadosMunicipio?.ts_funcao !== "Concursado" && (
                            <option value="Concursado">Concursado</option>
                          )}
                          {dadosMunicipio?.ts_funcao !== "Outro" && (
                            <option value="Outro">Outro</option>
                          )}
                        </select>
                      </InputG>
                    </td>
                    <td>
                      <InputM>
                        <label>
                          Telefone<span> *</span>
                        </label>

                        <Controller
                          name="ts_telefone"
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
                          Email<span> *</span>
                        </label>
                        <input
                          {...register("ts_email", {
                            required: "Este campo é obrigatório",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Endereço de email inválido",
                            },
                          })}
                          type="text"
                        />
                        {errors.ts_email && (
                          <span>{errors.ts_email.message}</span>
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
                    <DivEixo style={{ color: "#000", marginTop: "60px" }}>
                      <div style={{ marginBottom: "20px" }}>
                        <label
                          style={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={copiaParaEsgoto}
                            onChange={(e) => {
                              setCopiaParaEsgoto(e.target.checked);
                              if (e.target.checked) {
                                setValue(
                                  "es_secretaria_setor_responsavel",
                                  watch("aa_secretaria_setor_responsavel")
                                );
                                setValue(
                                  "es_abrangencia",
                                  watch("aa_abrangencia")
                                );
                                setValue(
                                  "es_natureza_juridica",
                                  watch("aa_natureza_juridica")
                                );
                                setValue("es_cnpj", watch("aa_cnpj"));
                                setValue("es_telefone", watch("aa_telefone"));
                                setValue("es_cep", watch("aa_cep"));
                                setValue("es_endereco", watch("aa_endereco"));
                                setValue("es_numero", watch("aa_numero"));
                                setValue("es_bairro", watch("aa_bairro"));
                                setValue(
                                  "es_responsavel",
                                  watch("aa_responsavel")
                                );
                                setValue("es_cargo", watch("aa_cargo"));
                                setValue("es_email", watch("aa_email"));
                              }
                            }}
                            style={{ marginRight: "8px" }}
                          />
                          Esgotamento Sanitário
                        </label>
                      </div>
                    </DivEixo>
                    <input
                      {...register("id_ps_abastecimento_agua")}
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
                                {...register(
                                  "aa_secretaria_setor_responsavel",
                                  {
                                    required: "Este campo é obrigatório",
                                  }
                                )}
                                type="text"
                                onKeyPress={onlyLettersAndCharacters}
                              ></input>
                              {errors.aa_secretaria_setor_responsavel && (
                                <span>
                                  {
                                    errors.aa_secretaria_setor_responsavel
                                      .message
                                  }
                                </span>
                              )}
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
                              <Controller
                                name="aa_cnpj"
                                control={control}
                                rules={{
                                  required: "Campo obrigatório",
                                  minLength: 14,
                                  maxLength: 14,
                                  pattern: /^\d{14}$/,
                                }}
                                render={({
                                  field: { onChange, value },
                                  fieldState: { error },
                                }) => (
                                  <>
                                    <InputMask
                                      mask="99.999.999/9999-99"
                                      maskChar={null}
                                      value={value}
                                      onChange={(e) => {
                                        const justNumbers =
                                          e.target.value.replace(/\D/g, "");
                                        if (justNumbers.length <= 14) {
                                          onChange(justNumbers);
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
                                        />
                                      )}
                                    </InputMask>
                                    {error && <span>{error.message}</span>}
                                  </>
                                )}
                              />
                            </InputM>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Telefone<span> *</span>
                              </label>

                              <Controller
                                name="aa_telefone"
                                control={control}
                                rules={{
                                  required: "Campo obrigatório",
                                }}
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
                                        const justNumbers =
                                          e.target.value.replace(/\D/g, "");
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

                              <Controller
                                name="aa_cep"
                                control={control}
                                rules={{
                                  required: "Campo obrigatório",
                                }}
                                render={({
                                  field: { onChange, value },
                                  fieldState: { error },
                                }) => (
                                  <>
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
                                        <input {...inputProps} type="text" />
                                      )}
                                    </InputMask>
                                    {error && <span>{error.message}</span>}
                                  </>
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
                                {...register("aa_endereco", {
                                  required: "Campo obrigatório",
                                })}
                                type="text"
                                onKeyPress={onlyLettersAndCharacters}
                              ></input>
                              {errors.aa_endereco && (
                                <span>{errors.aa_endereco.message}</span>
                              )}
                            </InputM>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Número<span> *</span>
                              </label>
                              <input
                                {...register("aa_numero", {
                                  required: "Campo obrigatório",
                                })}
                                type="text"
                                onKeyPress={(e) => {
                                  if (!/[0-9]/.test(e.key)) {
                                    e.preventDefault();
                                  }
                                }}
                              ></input>
                              {errors.aa_numero && (
                                <span>{errors.aa_numero.message}</span>
                              )}
                            </InputP>
                          </td>
                          <td>
                            <InputM>
                              <label>
                                Bairro<span> *</span>
                              </label>
                              <input
                                {...register("aa_bairro", {
                                  required: "Campo obrigatório",
                                })}
                                type="text"
                                onKeyPress={onlyLettersAndCharacters}
                              ></input>
                              {errors.aa_bairro && (
                                <span>{errors.aa_bairro.message}</span>
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
                            <InputG>
                              <label>
                                Nome do Responsável<span> *</span>
                              </label>
                              <input
                                {...register("aa_responsavel", {
                                  required: "Campo obrigatório",
                                })}
                                type="text"
                                onKeyPress={onlyLettersAndCharacters}
                              ></input>
                              {errors.aa_responsavel && (
                                <span>{errors.aa_responsavel.message}</span>
                              )}
                            </InputG>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Cargo<span> *</span>
                              </label>
                              <input
                                {...register("aa_cargo", {
                                  required: "Campo obrigatório",
                                })}
                                type="text"
                                onKeyPress={onlyLettersAndCharacters}
                              ></input>
                              {errors.aa_cargo && (
                                <span>{errors.aa_cargo.message}</span>
                              )}
                            </InputP>
                          </td>
                          <td>
                            <InputM>
                              <label>
                                Email<span> *</span>
                              </label>

                              <input
                                {...register("aa_email", {
                                  required: "Este campo é obrigatório",
                                  pattern: {
                                    value:
                                      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Endereço de email inválido",
                                  },
                                })}
                                type="text"
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
                                {...register(
                                  "es_secretaria_setor_responsavel",
                                  {
                                    required: "Este campo é obrigatório",
                                  }
                                )}
                                type="text"
                                onKeyPress={onlyLettersAndCharacters}
                              ></input>
                              {errors.es_secretaria_setor_responsavel && (
                                <span>
                                  {
                                    errors.es_secretaria_setor_responsavel
                                      .message
                                  }
                                </span>
                              )}
                            </InputG>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Abrangência<span> *</span>
                              </label>
                              <select {...register("es_abrangencia")}>
                                <option value={dadosMunicipio?.es_abrangencia}>
                                  {dadosMunicipio?.es_abrangencia}
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

                              <Controller
                                name="es_cnpj"
                                control={control}
                                rules={{
                                  required: "Campo obrigatório",
                                  minLength: 14,
                                  maxLength: 14,
                                  pattern: /^\d{14}$/,
                                }}
                                render={({
                                  field: { onChange, value },
                                  fieldState: { error },
                                }) => (
                                  <>
                                    <InputMask
                                      mask="99.999.999/9999-99"
                                      maskChar={null}
                                      value={value}
                                      onChange={(e) => {
                                        const justNumbers =
                                          e.target.value.replace(/\D/g, "");
                                        if (justNumbers.length <= 14) {
                                          onChange(justNumbers);
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
                                        />
                                      )}
                                    </InputMask>
                                    {error && <span>{error.message}</span>}
                                  </>
                                )}
                              />
                            </InputM>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Telefone<span> *</span>
                              </label>

                              <Controller
                                name="es_telefone"
                                control={control}
                                rules={{
                                  required: "Campo obrigatório",
                                }}
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
                                        const justNumbers =
                                          e.target.value.replace(/\D/g, "");
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

                              <Controller
                                name="es_cep"
                                control={control}
                                rules={{
                                  required: "Campo obrigatório",
                                }}
                                render={({
                                  field: { onChange, value },
                                  fieldState: { error },
                                }) => (
                                  <>
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
                                        <input {...inputProps} type="text" />
                                      )}
                                    </InputMask>
                                    {error && <span>{error.message}</span>}
                                  </>
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
                                {...register("es_endereco", {
                                  required: "Campo obrigatório",
                                })}
                                type="text"
                              ></input>
                              {errors.es_endereco && (
                                <span>{errors.es_endereco.message}</span>
                              )}
                            </InputM>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Número<span> *</span>
                              </label>
                              <input
                                {...register("es_numero", {
                                  required: "Campo obrigatório",
                                })}
                                type="text"
                              ></input>
                              {errors.es_numero && (
                                <span>{errors.es_numero.message}</span>
                              )}
                            </InputP>
                          </td>
                          <td>
                            <InputM>
                              <label>
                                Bairro<span> *</span>
                              </label>
                              <input
                                {...register("es_bairro", {
                                  required: "Campo obrigatório",
                                })}
                                type="text"
                              ></input>
                              {errors.es_bairro && (
                                <span>{errors.es_bairro.message}</span>
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
                            <InputG>
                              <label>
                                Nome do Responsável<span> *</span>
                              </label>
                              <input
                                {...register("es_responsavel", {
                                  required: "Campo obrigatório",
                                })}
                                type="text"
                              ></input>
                              {errors.es_responsavel && (
                                <span>{errors.es_responsavel.message}</span>
                              )}
                            </InputG>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Cargo<span> *</span>
                              </label>
                              <input
                                {...register("es_cargo", {
                                  required: "Campo obrigatório",
                                })}
                                type="text"
                              ></input>
                              {errors.es_cargo && (
                                <span>{errors.es_cargo.message}</span>
                              )}
                            </InputP>
                          </td>
                          <td>
                            <InputM>
                              <label>
                                Email<span> *</span>
                              </label>

                              <input
                                {...register("es_email", {
                                  required: "Campo obrigatório",
                                  pattern: {
                                    value:
                                      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Endereço de email inválido",
                                  },
                                })}
                                type="text"
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
                                {...register(
                                  "da_secretaria_setor_responsavel",
                                  {
                                    required: "Campo obrigatório",
                                  }
                                )}
                                type="text"
                              ></input>
                              {errors.da_secretaria_setor_responsavel && (
                                <span>
                                  {
                                    errors.da_secretaria_setor_responsavel
                                      .message
                                  }
                                </span>
                              )}
                            </InputG>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Abrangência<span> *</span>
                              </label>
                              <select {...register("da_abrangencia")}>
                                <option value={dadosMunicipio?.da_abrangencia}>
                                  {dadosMunicipio?.da_abrangencia}
                                </option>
                                <option value="Regional">Regional</option>
                                <option value="Microregional">
                                  Microregional
                                </option>
                                <option value="Local">Local</option>
                              </select>
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

                              <Controller
                                name="da_cnpj"
                                control={control}
                                rules={{
                                  required: "Campo obrigatório",
                                  minLength: 14,
                                  maxLength: 14,
                                  pattern: /^\d{14}$/,
                                }}
                                render={({
                                  field: { onChange, value },
                                  fieldState: { error },
                                }) => (
                                  <>
                                    <InputMask
                                      mask="99.999.999/9999-99"
                                      maskChar={null}
                                      value={value}
                                      onChange={(e) => {
                                        const justNumbers =
                                          e.target.value.replace(/\D/g, "");
                                        if (justNumbers.length <= 14) {
                                          onChange(justNumbers);

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
                                        />
                                      )}
                                    </InputMask>
                                    {error && <span>{error.message}</span>}
                                  </>
                                )}
                              />
                            </InputM>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Telefone<span> *</span>
                              </label>

                              <Controller
                                name="da_telefone"
                                control={control}
                                rules={{
                                  required: "Campo obrigatório",
                                }}
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
                                        const justNumbers =
                                          e.target.value.replace(/\D/g, "");
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

                              <Controller
                                name="da_cep"
                                control={control}
                                rules={{
                                  required: "Campo obrigatório",
                                }}
                                render={({
                                  field: { onChange, value },
                                  fieldState: { error },
                                }) => (
                                  <>
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
                                        <input {...inputProps} type="text" />
                                      )}
                                    </InputMask>
                                    {error && <span>{error.message}</span>}
                                  </>
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
                                {...register("da_endereco", {
                                  required: "Campo obrigatório",
                                })}
                                type="text"
                              ></input>
                              {errors.da_endereco && (
                                <span>{errors.da_endereco.message}</span>
                              )}
                            </InputM>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Número<span> *</span>
                              </label>
                              <input
                                {...register("da_numero", {
                                  required: "Campo obrigatório",
                                })}
                                type="text"
                              ></input>
                              {errors.da_numero && (
                                <span>{errors.da_numero.message}</span>
                              )}
                            </InputP>
                          </td>
                          <td>
                            <InputM>
                              <label>
                                Bairro<span> *</span>
                              </label>
                              <input
                                {...register("da_bairro", {
                                  required: "Campo obrigatório",
                                })}
                                type="text"
                              ></input>
                              {errors.da_bairro && (
                                <span>{errors.da_bairro.message}</span>
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
                            <InputG>
                              <label>
                                Nome do Responsável<span> *</span>
                              </label>
                              <input
                                {...register("da_responsavel", {
                                  required: "Campo obrigatório",
                                })}
                                type="text"
                              ></input>
                              {errors.da_responsavel && (
                                <span>{errors.da_responsavel.message}</span>
                              )}
                            </InputG>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Cargo<span> *</span>
                              </label>
                              <input
                                {...register("da_cargo", {
                                  required: "Campo obrigatório",
                                })}
                                type="text"
                              ></input>
                              {errors.da_cargo && (
                                <span>{errors.da_cargo.message}</span>
                              )}
                            </InputP>
                          </td>
                          <td>
                            <InputM>
                              <label>
                                Email<span> *</span>
                              </label>

                              <input
                                {...register("da_email", {
                                  pattern: {
                                    value:
                                      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Endereço de email inválido",
                                  },
                                })}
                                type="text"
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
                                {...register(
                                  "rs_secretaria_setor_responsavel",
                                  {
                                    required: "Campo obrigatório",
                                  }
                                )}
                                type="text"
                              ></input>
                              {errors.rs_secretaria_setor_responsavel && (
                                <span>
                                  {
                                    errors.rs_secretaria_setor_responsavel
                                      .message
                                  }
                                </span>
                              )}
                            </InputG>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Abrangência<span> *</span>
                              </label>
                              <select {...register("rs_abrangencia")}>
                                <option value={dadosMunicipio?.rs_abrangencia}>
                                  {dadosMunicipio?.rs_abrangencia}
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
                    <input
                      {...register("id_ps_residuo_solido")}
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

                              <Controller
                                name="rs_cnpj"
                                control={control}
                                rules={{
                                  required: "Campo obrigatório",
                                  minLength: 14,
                                  maxLength: 14,
                                  pattern: /^\d{14}$/,
                                }}
                                render={({
                                  field: { onChange, value },
                                  fieldState: { error },
                                }) => (
                                  <>
                                    <InputMask
                                      mask="99.999.999/9999-99"
                                      maskChar={null}
                                      value={value}
                                      onChange={(e) => {
                                        const justNumbers =
                                          e.target.value.replace(/\D/g, "");
                                        if (justNumbers.length <= 14) {
                                          onChange(justNumbers);

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
                                        />
                                      )}
                                    </InputMask>
                                    {error && <span>{error.message}</span>}
                                  </>
                                )}
                              />
                            </InputM>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Telefone<span> *</span>
                              </label>

                              <Controller
                                name="rs_telefone"
                                control={control}
                                rules={{
                                  required: "Campo obrigatório",
                                }}
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
                                        const justNumbers =
                                          e.target.value.replace(/\D/g, "");
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

                              <Controller
                                name="rs_cep"
                                control={control}
                                rules={{
                                  required: "Campo obrigatório",
                                }}
                                render={({
                                  field: { onChange, value },
                                  fieldState: { error },
                                }) => (
                                  <>
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
                                        <input {...inputProps} type="text" />
                                      )}
                                    </InputMask>
                                    {error && <span>{error.message}</span>}
                                  </>
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
                                {...register("rs_endereco", {
                                  required: "Campo obrigatório",
                                })}
                                type="text"
                              ></input>
                              {errors.rs_endereco && (
                                <span>{errors.rs_endereco.message}</span>
                              )}
                            </InputM>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Número<span> *</span>
                              </label>
                              <input
                                {...register("rs_numero", {
                                  required: "Campo obrigatório",
                                })}
                                type="text"
                              ></input>
                              {errors.rs_numero && (
                                <span>{errors.rs_numero.message}</span>
                              )}
                            </InputP>
                          </td>
                          <td>
                            <InputM>
                              <label>
                                Bairro<span> *</span>
                              </label>
                              <input
                                {...register("rs_bairro", {
                                  required: "Campo obrigatório",
                                })}
                                type="text"
                              ></input>
                              {errors.rs_bairro && (
                                <span>{errors.rs_bairro.message}</span>
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
                            <InputG>
                              <label>
                                Nome do Responsável<span> *</span>
                              </label>
                              <input
                                {...register("rs_responsavel", {
                                  required: "Campo obrigatório",
                                })}
                                type="text"
                              ></input>
                              {errors.rs_responsavel && (
                                <span>{errors.rs_responsavel.message}</span>
                              )}
                            </InputG>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Cargo<span> *</span>
                              </label>
                              <input
                                {...register("rs_cargo", {
                                  required: "Campo obrigatório",
                                })}
                                type="text"
                              ></input>
                              {errors.rs_cargo && (
                                <span>{errors.rs_cargo.message}</span>
                              )}
                            </InputP>
                          </td>
                          <td>
                            <InputM>
                              <label>
                                Email<span> *</span>
                              </label>

                              <input
                                {...register("rs_email", {
                                  pattern: {
                                    value:
                                      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Endereço de email inválido",
                                  },
                                })}
                                type="text"
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
                      {activeStep === steps.length - 1 ? "Gravar" : "Próximo"}
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
                          {...register("rf_setor_responsavel", {
                            required: "Campo obrigatório",
                          })}
                          type="text"
                          style={{ textTransform: "capitalize" }}
                          onChange={(e) => {
                            const value = toTitleCase(e.target.value);
                            setValue("rf_setor_responsavel", value);
                          }}
                        ></input>
                        {errors.rf_setor_responsavel && (
                          <span>{errors.rf_setor_responsavel.message}</span>
                        )}
                      </InputG>
                    </td>
                    <td>
                      <InputP>
                        <label>
                          Telefone Comercial<span> *</span>
                        </label>

                        <Controller
                          name="rf_telefone_comercial"
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
                          {...register("rf_responsavel", {
                            required: "Campo obrigatório",
                          })}
                          type="text"
                          onChange={(e) => {
                            const value = toTitleCase(e.target.value);
                            setValue("rf_responsavel", value);
                          }}
                        ></input>
                        {errors.rf_responsavel && (
                          <span>{errors.rf_responsavel.message}</span>
                        )}
                      </InputG>
                    </td>
                    <td>
                      <InputM>
                        <label>
                          Cargo<span> *</span>
                        </label>
                        <input
                          {...register("rf_cargo", {
                            required: "Campo obrigatório",
                          })}
                          type="text"
                          onChange={(e) => {
                            const value = toTitleCase(e.target.value);
                            setValue("rf_cargo", value);
                          }}
                        ></input>
                        {errors.rf_cargo && (
                          <span>{errors.rf_cargo.message}</span>
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
                      <InputG>
                        <label>
                          Função<span> *</span>
                        </label>
                        <select {...register("rf_funcao")}>
                          <option value={dadosMunicipio?.rf_funcao}>
                            {dadosMunicipio?.rf_funcao}
                          </option>
                          <option value="Encargo Direto">Encargo Direto</option>
                          <option value="Concursado">Concursado</option>
                          <option value="Outro">Outro</option>
                        </select>
                      </InputG>
                    </td>
                    <td>
                      <InputP>
                        <label>
                          Telefone<span> *</span>
                        </label>

                        <Controller
                          name="rf_telefone"
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
                          {...register("rf_email", {
                            required: "Campo obrigatório",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Endereço de email inválido",
                            },
                          })}
                          type="text"
                        />
                        {errors.rf_email && (
                          <span>{errors.rf_email.message}</span>
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
                            {...register("rf_descricao", {
                              required: "Campo obrigatório",
                            })}
                            name="rf_descricao"
                          />
                        </TextArea>
                        {errors.rf_descricao && (
                          <span>{errors.rf_descricao.message}</span>
                        )}
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
                Controle Social & Responsável pelo SIMISAB
              </DivTituloForm>

              <TabContainer>
                <TabButton
                  active={activeTab === "controleSocial"}
                  onClick={() => setActiveTab("controleSocial")}
                >
                  Controle Social
                </TabButton>
                <TabButton
                  active={activeTab === "responsaveisSimisab"}
                  onClick={() => setActiveTab("responsaveisSimisab")}
                >
                  Responsável SIMISAB
                </TabButton>
                <TabButton
                  active={activeTab === "conselhoMunicipal"}
                  onClick={() => setActiveTab("conselhoMunicipal")}
                >
                  Conselho Municipal
                </TabButton>
              </TabContainer>

              <div
                style={{
                  display: activeTab === "controleSocial" ? "block" : "none",
                }}
              >
                <input {...register("id_controle_social_sms")} type="hidden" />
                <InputG>
                  <label>
                    Setor Responsável<span> *</span>
                  </label>
                  <input
                    {...register("cs_setor_responsavel", {
                      required: "Campo obrigatório",
                    })}
                    style={{ textTransform: "capitalize" }}
                    onChange={(e) => {
                      const value = toTitleCase(e.target.value);
                      setValue("cs_setor_responsavel", value);
                    }}
                    onKeyPress={onlyLettersAndCharacters}
                    type="text"
                  ></input>
                  {errors.cs_setor_responsavel && (
                    <span>{errors.cs_setor_responsavel.message}</span>
                  )}
                </InputG>

                <InputP>
                  <label>
                    Telefone<span> *</span>
                  </label>

                  <Controller
                    name="cs_telefone"
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
                <InputG>
                  <label>
                    Email<span> *</span>
                  </label>

                  <input
                    {...register("cs_email", {
                      required: "Campo obrigatório",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Endereço de email inválido",
                      },
                    })}
                    type="text"
                  />
                  {errors.cs_email && errors.cs_email.type && (
                    <span>{errors.cs_email.message}</span>
                  )}
                </InputG>
              </div>

              <div
                style={{
                  display:
                    activeTab === "responsaveisSimisab" ? "block" : "none",
                }}
              >
                <input {...register("id_responsavel_simisab")} type="hidden" />

                <InputG>
                  <label>Usuarios Simisab</label>
                  <select onChange={(e) => getResSimisab(e.target.value)}>
                    <option value="">
                      Selecione um usuário para ser o responsavel Simisab
                    </option>
                    {Array.isArray(responsaveisSimisab) &&
                      responsaveisSimisab.map((resp) => (
                        <option key={resp.id_usuario} value={resp.id_usuario}>
                          {resp.nome}
                        </option>
                      ))}
                  </select>
                </InputG>
                <InputG>
                  <label>
                    Nome<span> *</span>
                  </label>
                  <input
                    {...register("simisab_responsavel", {
                      required: "Campo obrigatório",
                    })}
                    onKeyPress={onlyLettersAndCharacters}
                    style={{ textTransform: "capitalize" }}
                    onChange={(e) => {
                      const value = toTitleCase(e.target.value);
                      setValue("simisab_responsavel", value);
                    }}
                    type="text"
                  ></input>
                  {errors.simisab_responsavel && (
                    <span>{errors.simisab_responsavel.message}</span>
                  )}
                </InputG>

                <InputP>
                  <label>
                    Telefone<span> *</span>
                  </label>

                  <Controller
                    name="simisab_telefone"
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
                <InputG>
                  <label>
                    Email<span> *</span>
                  </label>

                  <input
                    {...register("simisab_email", {
                      required: "Campo obrigatório",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Endereço de email inválido",
                      },
                    })}
                    type="text"
                  />
                  {errors.simisab_email && (
                    <span>{errors.simisab_email.message}</span>
                  )}
                </InputG>
              </div>

              <div
                style={{
                  display: activeTab === "conselhoMunicipal" ? "block" : "none",
                }}
              >
                <input {...register("id_conselho_municipal")} type="hidden" />
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "flex", marginBottom: "10px" }}>
                    Conselho Municipal de Saneamento Básico?
                    <span style={{ color: "red" }}> *</span>
                  </label>
                  <div
                    style={{
                      display: "flex",
                      gap: "20px",
                      alignItems: "center",
                    }}
                  >
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <input
                        type="radio"
                        {...register("possui_conselho", {
                          required: "É necessário selecionar uma opção",
                        })}
                        value="sim"
                      />
                      Sim
                    </label>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <input
                        type="radio"
                        {...register("possui_conselho", {
                          required: "É necessário selecionar uma opção",
                        })}
                        value="nao"
                      />
                      Não
                    </label>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <input
                        type="radio"
                        {...register("possui_conselho", {
                          required: "É necessário selecionar uma opção",
                        })}
                        value="outros"
                      />
                      Outros
                    </label>
                  </div>
                  {errors.possui_conselho && (
                    <span
                      style={{
                        color: "red",
                        fontSize: "14px",
                        marginTop: "5px",
                      }}
                    >
                      {errors.possui_conselho.message}
                    </span>
                  )}
                </div>
                {watch("possui_conselho") === "outros" && (
                  <textarea
                    style={{ width: "500px" }}
                    {...register("descricao_outros", {
                      required: "Campo obrigatório",
                    })}
                    placeholder="Por favor, explique..."
                    rows={4}
                  />
                )}
              </div>
              {errors.descricao_outros && (
                <span>{errors.descricao_outros.message}</span>
              )}

              <SubmitButtonContainer>
                {usuario?.id_permissao !== 4 && (
                  <SubmitButton type="submit">Gravar</SubmitButton>
                )}
              </SubmitButtonContainer>
            </DivFormCadastro>

            <DivFormCadastro active={activeForm === "dadosGeograficos"}>
              <DivTituloForm>Dados Geográficos</DivTituloForm>
              <input
                {...register("id_dados_geograficos")}
                type="hidden"
                name="id_dados_geograficos"
              />
              <table style={{ marginBottom: "50px" }}>
                <tbody>
                  <tr>
                    <td
                      colSpan={4}
                      style={{ paddingTop: "25px", fontWeight: "bold" }}
                    >
                      Gerais
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td style={{ paddingTop: "15px" }}>
                      Nome da mesorregião geográfica
                    </td>
                    <td style={{ paddingTop: "0px", width: "150px" }}>
                      <input
                        style={{ margin: "0px", width: "150px" }}
                        {...register("OGM0001", {
                          required: "Campo obrigatório",
                        })}
                        type="text"
                        name="OGM0001"
                      />
                      {errors.OGM0001 && <span>{errors.OGM0001.message}</span>}
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td style={{ paddingTop: "15px" }}>
                      Nome da microrregião geográfica
                    </td>
                    <td style={{ paddingTop: "0px", width: "150px" }}>
                      <input
                        style={{ margin: "0px", width: "150px" }}
                        {...register("OGM0002", {
                          required: "Campo obrigatório",
                        })}
                        type="text"
                        name="OGM0002"
                      />
                      {errors.OGM0002 && <span>{errors.OGM0002.message}</span>}
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td style={{ paddingTop: "15px" }}>
                      O município pertence a uma Região Metropolitana (RM),
                      Região Integrada de Desenvolvimento (RIDE), Aglomeração
                      Urbana ou Microrregião legalmente instituída?
                    </td>
                    <td style={{ paddingTop: "0px", width: "150px" }}>
                      <select
                        style={{ margin: "0px", width: "150px" }}
                        {...register("OGM0003", {
                          required: "Campo obrigatório",
                        })}
                        name="OGM0003"
                      >
                        <option value="">Selecione</option>
                        <option value="Sim">Sim</option>
                        <option value="Não">Não</option>
                      </select>
                      {errors.OGM0003 && <span>{errors.OGM0003.message}</span>}
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td style={{ paddingTop: "15px" }}>
                      Nome oficial (RM, RIDE, Aglomeração Urbana ou
                      Microrregião)
                    </td>
                    <td style={{ paddingTop: "0px", width: "150px" }}>
                      <input
                        style={{ margin: "0px", width: "150px" }}
                        {...register("OGM0004", {
                          required:
                            watch("OGM0003") === "Sim"
                              ? "Campo obrigatório"
                              : false,
                        })}
                        disabled={watch("OGM0003") !== "Sim"}
                        type="text"
                        name="OGM0004"
                      />
                      {errors.OGM0004 && <span>{errors.OGM0004.message}</span>}
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td style={{ paddingTop: "15px" }}>
                      Área territorial total
                    </td>
                    <td style={{ paddingTop: "0px", width: "150px" }}>
                      <input
                        style={{ margin: "0px", width: "150px" }}
                        {...register("OGM0005", {
                          required: "Campo obrigatório",
                        })}
                        type="text"
                        name="OGM0005"
                        onKeyPress={(e) => {
                          if (!/[0-9.]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                      {errors.OGM0005 && <span>{errors.OGM0005.message}</span>}
                    </td>
                    <td style={{ paddingTop: "15px" }}>km²</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td style={{ paddingTop: "15px" }}>
                      Total de áreas urbanizadas
                    </td>
                    <td style={{ paddingTop: "0px", width: "150px" }}>
                      <input
                        style={{ margin: "0px", width: "150px" }}
                        {...register("OGM0006", {
                          required: "Campo obrigatório",
                        })}
                        type="text"
                        name="OGM0006"
                        onKeyPress={(e) => {
                          if (!/[0-9.]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                      {errors.OGM0006 && <span>{errors.OGM0006.message}</span>}
                    </td>
                    <td style={{ paddingTop: "15px" }}>km²</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td style={{ paddingTop: "15px" }}>
                      Quantidade de distritos em que se divide o município
                      (previsão de coleta: a partir de 2025)
                    </td>
                    <td style={{ paddingTop: "0px", width: "150px" }}>
                      <input
                        style={{ margin: "0px", width: "150px" }}
                        {...register("OGM0007", {
                          required: "Campo obrigatório",
                        })}
                        type="text"
                        name="OGM0007"
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                      {errors.OGM0007 && <span>{errors.OGM0007.message}</span>}
                    </td>
                    <td style={{ paddingTop: "15px" }}>unidades</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td style={{ paddingTop: "15px" }}>
                      Quantidade de localidades urbanas existentes, inclusive à
                      sede (previsão de coleta: a partir de 2025)
                    </td>
                    <td style={{ paddingTop: "0px", width: "150px" }}>
                      <input
                        style={{ margin: "0px", width: "150px" }}
                        {...register("OGM0008", {
                          required: "Campo obrigatório",
                        })}
                        type="text"
                        name="OGM0008"
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                      {errors.OGM0008 && <span>{errors.OGM0008.message}</span>}
                    </td>
                    <td style={{ paddingTop: "15px" }}>unidades</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td style={{ paddingTop: "15px" }}>
                      Quantidade de aglomerados rurais de características
                      urbanas existentes (previsão de coleta: a partir de 2025)
                    </td>
                    <td style={{ paddingTop: "0px", width: "150px" }}>
                      <input
                        style={{ margin: "0px", width: "150px" }}
                        {...register("OGM0009", {
                          required: "Campo obrigatório",
                        })}
                        type="text"
                        name="OGM0009"
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                      {errors.OGM0009 && <span>{errors.OGM0009.message}</span>}
                    </td>
                    <td style={{ paddingTop: "15px" }}>unidades</td>
                  </tr>

                  <tr>
                    <td
                      colSpan={4}
                      style={{ paddingTop: "25px", fontWeight: "bold" }}
                    >
                      Cotas topográficas, bacias hidrográficas e cursos d'água
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td style={{ paddingTop: "15px" }}>
                      Cota altimétrica de referência
                    </td>
                    <td style={{ paddingTop: "0px", width: "150px" }}>
                      <input
                        style={{ margin: "0px", width: "150px" }}
                        {...register("OGM0010", {
                          required: "Campo obrigatório",
                        })}
                        type="text"
                        name="OGM0010"
                        onKeyPress={(e) => {
                          if (!/[0-9.]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                      {errors.OGM0010 && <span>{errors.OGM0010.message}</span>}
                    </td>
                    <td style={{ paddingTop: "15px" }}>m</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td style={{ paddingTop: "15px" }}>
                      Cota altimétrica mínima
                    </td>
                    <td style={{ paddingTop: "0px", width: "150px" }}>
                      <input
                        style={{ margin: "0px", width: "150px" }}
                        {...register("OGM0011", {
                          required: "Campo obrigatório",
                        })}
                        type="text"
                        name="OGM0011"
                        onKeyPress={(e) => {
                          if (!/[0-9.]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                      {errors.OGM0011 && <span>{errors.OGM0011.message}</span>}
                    </td>
                    <td style={{ paddingTop: "15px" }}>m</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td style={{ paddingTop: "15px" }}>
                      Cota altimétrica máxima
                    </td>
                    <td style={{ paddingTop: "0px", width: "150px" }}>
                      <input
                        style={{ margin: "0px", width: "150px" }}
                        {...register("OGM0012", {
                          required: "Campo obrigatório",
                        })}
                        type="text"
                        name="OGM0012"
                        onKeyPress={(e) => {
                          if (!/[0-9.]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                      {errors.OGM0012 && <span>{errors.OGM0012.message}</span>}
                    </td>
                    <td style={{ paddingTop: "15px" }}>m</td>
                  </tr>

                  <tr>
                    <td
                      colSpan={4}
                      style={{ paddingTop: "25px", fontWeight: "bold" }}
                    >
                      Comunidades especiais existentes no município
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td style={{ paddingTop: "15px" }}>
                      Existem Aldeias Indígenas no município?
                    </td>
                    <td style={{ paddingTop: "0px", width: "150px" }}>
                      <select
                        style={{ margin: "0px", width: "150px" }}
                        {...register("OGM0101", {
                          required: "Campo obrigatório",
                        })}
                        name="OGM0101"
                      >
                        <option value="">Selecione</option>
                        <option value="Sim">Sim</option>
                        <option value="Não">Não</option>
                      </select>
                      {errors.OGM0101 && <span>{errors.OGM0101.message}</span>}
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td style={{ paddingTop: "15px" }}>
                      Quantidade de moradias/habitações existente nas Aldeias
                      Indígenas (previsão de coleta: a partir de 2025)
                    </td>
                    <td style={{ paddingTop: "0px", width: "150px" }}>
                      <input
                        style={{ margin: "0px", width: "150px" }}
                        {...register("OGM0102", {
                          required:
                            watch("OGM0101") === "Sim"
                              ? "Campo obrigatório"
                              : false,
                        })}
                        disabled={watch("OGM0101") !== "Sim"}
                        type="text"
                        name="OGM0102"
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                      {errors.OGM0102 && <span>{errors.OGM0102.message}</span>}
                    </td>
                    <td style={{ paddingTop: "15px" }}>moradias</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td style={{ paddingTop: "15px" }}>
                      População permanente estimada nas Aldeias Indígenas
                      (previsão de coleta: a partir de 2025)
                    </td>
                    <td style={{ paddingTop: "0px", width: "150px" }}>
                      <input
                        style={{ margin: "0px", width: "150px" }}
                        {...register("OGM0103", {
                          required:
                            watch("OGM0101") === "Sim"
                              ? "Campo obrigatório"
                              : false,
                        })}
                        disabled={watch("OGM0101") !== "Sim"}
                        type="text"
                        name="OGM0103"
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                      {errors.OGM0103 && <span>{errors.OGM0103.message}</span>}
                    </td>
                    <td style={{ paddingTop: "15px" }}>habitantes</td>
                  </tr>

                  <tr>
                    <td></td>
                    <td style={{ paddingTop: "15px" }}>
                      Existem Comunidades Quilombolas no município?
                    </td>
                    <td style={{ paddingTop: "0px", width: "150px" }}>
                      <select
                        style={{ margin: "0px", width: "150px" }}
                        {...register("OGM0104", {
                          required: "Campo obrigatório",
                        })}
                        name="OGM0104"
                      >
                        <option value="">Selecione</option>
                        <option value="Sim">Sim</option>
                        <option value="Não">Não</option>
                      </select>
                      {errors.OGM0104 && <span>{errors.OGM0104.message}</span>}
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td style={{ paddingTop: "15px" }}>
                      Quantidade de moradias/habitações existente nas
                      Comunidades Quilombolas (previsão de coleta: a partir de
                      2025)
                    </td>
                    <td style={{ paddingTop: "0px", width: "150px" }}>
                      <input
                        style={{ margin: "0px", width: "150px" }}
                        {...register("OGM0105", {
                          required:
                            watch("OGM0104") === "Sim"
                              ? "Campo obrigatório"
                              : false,
                        })}
                        disabled={watch("OGM0104") !== "Sim"}
                        type="text"
                        name="OGM0105"
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                      {errors.OGM0105 && <span>{errors.OGM0105.message}</span>}
                    </td>
                    <td style={{ paddingTop: "15px" }}>moradias</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td style={{ paddingTop: "15px" }}>
                      População permanente estimada nas Comunidades Quilombolas
                      (previsão de coleta: a partir de 2025)
                    </td>
                    <td style={{ paddingTop: "0px", width: "150px" }}>
                      <input
                        style={{ margin: "0px", width: "150px" }}
                        {...register("OGM0106", {
                          required:
                            watch("OGM0104") === "Sim"
                              ? "Campo obrigatório"
                              : false,
                        })}
                        disabled={watch("OGM0104") !== "Sim"}
                        type="text"
                        name="OGM0106"
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                      {errors.OGM0106 && <span>{errors.OGM0106.message}</span>}
                    </td>
                    <td style={{ paddingTop: "15px" }}>habitantes</td>
                  </tr>

                  <tr>
                    <td></td>
                    <td style={{ paddingTop: "15px" }}>
                      Existem Comunidades Extrativistas no município?
                    </td>
                    <td style={{ paddingTop: "0px", width: "150px" }}>
                      <select
                        style={{ margin: "0px", width: "150px" }}
                        {...register("OGM0107", {
                          required: "Campo obrigatório",
                        })}
                        name="OGM0107"
                      >
                        <option value="">Selecione</option>
                        <option value="Sim">Sim</option>
                        <option value="Não">Não</option>
                      </select>
                      {errors.OGM0107 && <span>{errors.OGM0107.message}</span>}
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td style={{ paddingTop: "15px" }}>
                      Quantidade de moradias/habitações existente nas
                      Comunidades Extrativistas (previsão de coleta: a partir de
                      2025)
                    </td>
                    <td style={{ paddingTop: "0px", width: "150px" }}>
                      <input
                        style={{ margin: "0px", width: "150px" }}
                        {...register("OGM0108", {
                          required:
                            watch("OGM0107") === "Sim"
                              ? "Campo obrigatório"
                              : false,
                        })}
                        disabled={watch("OGM0107") !== "Sim"}
                        type="text"
                        name="OGM0108"
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                      {errors.OGM0108 && <span>{errors.OGM0108.message}</span>}
                    </td>
                    <td style={{ paddingTop: "15px" }}>moradias</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td style={{ paddingTop: "15px" }}>
                      População permanente estimada nas Comunidades
                      Extrativistas (previsão de coleta: a partir de 2025)
                    </td>
                    <td style={{ paddingTop: "0px", width: "150px" }}>
                      <input
                        style={{ margin: "0px", width: "150px" }}
                        {...register("OGM0109", {
                          required:
                            watch("OGM0107") === "Sim"
                              ? "Campo obrigatório"
                              : false,
                        })}
                        disabled={watch("OGM0107") !== "Sim"}
                        type="text"
                        name="OGM0109"
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                      {errors.OGM0109 && <span>{errors.OGM0109.message}</span>}
                    </td>
                    <td style={{ paddingTop: "15px" }}>habitantes</td>
                  </tr>
                </tbody>
              </table>

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
                type="hidden"
                name="id_dados_demograficos"
              />
              <table style={{ marginBottom: "50px" }}>
                <tbody>
                  <tr>
                    <td></td>
                    <td style={{ paddingTop: "15px" }}>
                      População Urbana<span> *</span>
                    </td>
                    <td style={{ paddingTop: "0px", width: "150px" }}>
                      <input
                        style={{ margin: "0px", width: "150px" }}
                        {...register("dd_populacao_urbana", {
                          required: "Campo obrigatório",
                        })}
                        type="text"
                        name="dd_populacao_urbana"
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      ></input>
                      {errors.dd_populacao_urbana && (
                        <span>{errors.dd_populacao_urbana.message}</span>
                      )}
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td style={{ paddingTop: "15px" }}>
                      {" "}
                      População Rural<span> *</span>
                    </td>
                    <td style={{ paddingTop: "0px", width: "150px" }}>
                      <input
                        style={{ margin: "0px", width: "150px" }}
                        {...register("dd_populacao_rural", {
                          required: "Campo obrigatório",
                        })}
                        type="text"
                        name="dd_populacao_rural"
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      ></input>
                      {errors.dd_populacao_rural && (
                        <span>{errors.dd_populacao_rural.message}</span>
                      )}
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td style={{ paddingTop: "15px" }}>
                      {" "}
                      População Total<span> *</span>
                    </td>
                    <td style={{ paddingTop: "0px", width: "150px" }}>
                      <input
                        style={{ margin: "0px", width: "150px" }}
                        {...register("dd_populacao_total")}
                        type="text"
                        disabled={true}
                        readOnly
                      ></input>
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td style={{ paddingTop: "15px" }}>
                      Total de Moradias<span> *</span>
                    </td>
                    <td style={{ paddingTop: "0px", width: "150px" }}>
                      <input
                        style={{ margin: "0px", width: "150px" }}
                        {...register("dd_total_moradias", {
                          required: "Campo obrigatório",
                        })}
                        type="text"
                        name="dd_total_moradias"
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      ></input>
                      {errors.dd_total_moradias && (
                        <span>{errors.dd_total_moradias.message}</span>
                      )}
                    </td>
                    <td></td>
                  </tr>

                  <tr>
                    <td></td>
                    <td style={{ paddingTop: "15px" }}>
                      {" "}
                      Quantidade de estabelecimentos urbanos existente no
                      município (previsão de coleta: a partir de 2025)
                    </td>
                    <td style={{ paddingTop: "0px", width: "150px" }}>
                      <input
                        style={{ margin: "0px", width: "150px" }}
                        {...register("OGM4001", {
                          required: "Campo obrigatório",
                        })}
                        type="text"
                        name="OGM4001"
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      ></input>
                      {errors.OGM4001 && <span>{errors.OGM4001.message}</span>}
                    </td>
                    <td style={{ paddingTop: "15px" }}>Unidades</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td style={{ paddingTop: "15px" }}>
                      {" "}
                      Quantidade de estabelecimentos rurais existente no
                      município (previsão de coleta: a partir de 2025)
                    </td>
                    <td style={{ paddingTop: "0px", width: "150px" }}>
                      <input
                        style={{ margin: "0px", width: "150px" }}
                        {...register("OGM4002", {
                          required: "Campo obrigatório",
                        })}
                        type="text"
                        name="OGM4002"
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      ></input>
                      {errors.OGM4002 && <span>{errors.OGM4002.message}</span>}
                    </td>
                    <td style={{ paddingTop: "15px" }}>Unidades</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td style={{ paddingTop: "15px" }}>
                      {" "}
                      Quantidade de estabelecimentos totais existente no
                      município (previsão de coleta: a partir de 2025).
                    </td>
                    <td style={{ paddingTop: "0px", width: "150px" }}>
                      <input
                        style={{ margin: "0px", width: "150px" }}
                        {...register("OGM4003")}
                        type="text"
                        name="OGM4003"
                        disabled={true}
                      ></input>
                    </td>
                    <td style={{ paddingTop: "15px" }}>Unidades</td>
                  </tr>

                  <tr>
                    <td></td>
                    <td style={{ paddingTop: "15px" }}>
                      Quantidade de domicílios urbanos existente no município.
                    </td>
                    <td style={{ paddingTop: "0px", width: "150px" }}>
                      <input
                        style={{ margin: "0px", width: "150px" }}
                        {...register("OGM4004", {
                          required: "Campo obrigatório",
                        })}
                        type="text"
                        name="OGM4004"
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      ></input>
                      {errors.OGM4004 && <span>{errors.OGM4004.message}</span>}
                    </td>
                    <td style={{ paddingTop: "15px" }}>Domicílios</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td style={{ paddingTop: "15px" }}>
                      Quantidade de domicílios rurais existente no município.
                    </td>
                    <td style={{ paddingTop: "0px", width: "150px" }}>
                      <input
                        style={{ margin: "0px", width: "150px" }}
                        {...register("OGM4005", {
                          required: "Campo obrigatório",
                        })}
                        type="text"
                        name="OGM4005"
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      ></input>
                      {errors.OGM4005 && <span>{errors.OGM4005.message}</span>}
                    </td>
                    <td style={{ paddingTop: "15px" }}>Domicílios</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td style={{ paddingTop: "15px" }}>
                      Quantidade de domicílios totais existente no município.
                    </td>
                    <td style={{ paddingTop: "0px", width: "150px" }}>
                      <input
                        style={{ margin: "0px", width: "150px" }}
                        {...register("OGM4006")}
                        type="text"
                        name="OGM4006"
                        disabled={true}
                      ></input>
                    </td>
                    <td style={{ paddingTop: "15px" }}>Domicílios</td>
                  </tr>

                  <tr>
                    <td></td>
                    <td style={{ paddingTop: "15px" }}>
                      Extensão total de vias públicas urbanas com pavimento.
                    </td>
                    <td style={{ paddingTop: "0px", width: "150px" }}>
                      <input
                        style={{ margin: "0px", width: "150px" }}
                        {...register("OGM4007", {
                          required: "Campo obrigatório",
                        })}
                        type="text"
                        name="OGM4007"
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      ></input>
                      {errors.OGM4007 && <span>{errors.OGM4007.message}</span>}
                    </td>
                    <td style={{ paddingTop: "15px" }}>Km</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td style={{ paddingTop: "15px" }}>
                      {" "}
                      Extensão total de vias públicas urbanas sem pavimento.
                    </td>
                    <td style={{ paddingTop: "0px", width: "150px" }}>
                      <input
                        style={{ margin: "0px", width: "150px" }}
                        {...register("OGM4008", {
                          required: "Campo obrigatório",
                        })}
                        type="text"
                        name="OGM4008"
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      ></input>
                      {errors.OGM4008 && <span>{errors.OGM4008.message}</span>}
                    </td>
                    <td style={{ paddingTop: "15px" }}>Km</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td style={{ paddingTop: "15px" }}>
                      Extensão total de vias públicas urbanas (com e sem
                      pavimento).
                    </td>
                    <td style={{ paddingTop: "0px", width: "150px" }}>
                      <input
                        style={{ margin: "0px", width: "150px" }}
                        {...register("OGM4009")}
                        type="text"
                        name="OGM4009"
                        disabled={true}
                      ></input>
                    </td>
                    <td style={{ paddingTop: "15px" }}>Km</td>
                  </tr>
                </tbody>
              </table>

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
