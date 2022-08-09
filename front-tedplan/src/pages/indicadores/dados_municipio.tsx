import React, { useMemo, useRef, useState, useContext } from "react";
import { useForm } from "react-hook-form";

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
  ItensMenu,
} from "../../styles/indicadores";
import HeadIndicadores from "../../components/headIndicadores";
import MenuIndicadores from "../../components/MenuIndicadores";
import dynamic from "next/dynamic";
import "suneditor/dist/css/suneditor.min.css";
import DadosMunicipio from "../../components/DadosMunicipio";
import { AuthContext } from "../../contexts/AuthContext";
import { useEffect } from "react";
import api from "../../services/api";
import { toast, ToastContainer } from 'react-nextjs-toast'
import { parseCookies } from "nookies";
import Router from "next/router";
import { GetServerSideProps } from "next";
import { getAPIClient } from "../../services/axios";
import MenuHorizontal from "../../components/MenuHorizontal";

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
  //titular dos serviços municipais de saneamento
  id_titular_servicos_ms: string;
  ts_setor_responsavel: string;
  ts_telefone_comercial: string;
  ts_responsavel: string;
  ts_cargo: string;
  ts_telefone: string;
  ts_email: string;

  //prestador do serviço de seneamento basico
  //abastecimento de agua
  id_ps_abastecimento_agua: string;
  aa_abrangencia: string;
  aa_natureza_juridica: string;
  aa_cnpj: string;
  aa_telefone: string;
  aa_cep: string;
  aa_endereco: string;
  aa_numero: string;
  aa_bairro: string;
  aa_responsavel: string;
  aa_cargo: string;
  aa_email: string;
  aa_secretaria_setor_responsavel: string;

  //esgotamento sanitario
  id_ps_esgotamento_sanitario: string;
  es_secretaria_setor_responsavel: string;
  es_abrangencia: string;
  es_natureza_juridica: string;
  es_cnpj: string;
  es_telefone: string;
  es_cep: string;
  es_endereco: string;
  es_numero: string;
  es_bairro: string;
  es_responsavel: string;
  es_cargo: string;
  es_email: string;
  //drenagem e àguas pluvias
  id_ps_drenagem_aguas_pluviais: string;
  da_secretaria_setor_responsavel: string;
  da_abrangencia: string;
  da_natureza_juridica: string;
  da_cnpj: string;
  da_telefone: string;
  da_cep: string;
  da_endereco: string;
  da_numero: string;
  da_bairro: string;
  da_responsavel: string;
  da_cargo: string;
  da_email: string;
  //Resíduos Sólidos
  id_ps_residuo_solido: string;
  rs_secretaria_setor_responsavel: string;
  rs_abrangencia: string;
  rs_natureza_juridica: string;
  rs_cnpj: string;
  rs_telefone: string;
  rs_cep: string;
  rs_endereco: string;
  rs_numero: string;
  rs_bairro: string;
  rs_responsavel: string;
  rs_cargo: string;
  rs_email: string;

  //Regulador e Fiscalizador dos Serviços de Saneamento
  id_regulador_fiscalizador_ss: string;
  rf_setor_responsavel: string;
  rf_telefone_comercial: string;
  rf_responsavel: string;
  rf_cargo: string;
  rf_telefone: string;
  rf_email: string;
  rf_descricao: string;

  //Controle Social dos Serços Municipais de Saneamento
  id_controle_social_sms: string;
  setor_responsavel_cs_sms: string;
  telefone_cs_sms: string;
  email_cs_sms: string;

  //Responsável pelo SIMISAB
  id_responsavel_simisab: string;
  simisab_responsavel: string;
  simisab_telefone: string;
  simisab_email: string;

  //Dados demográficos
  id_dados_demograficos: string;
  dd_populacao_urbana: string;
  dd_populacao_rural: string;
  dd_populacao_total: string;
  dd_total_moradias: string;
}

interface MunicipioProps {
  municipio: IMunicipio[];
}

export default function Cadastro({ municipio }: MunicipioProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { usuario, signOut } = useContext(AuthContext);
  const [contentForEditor, setContentForEditor] = useState(null);
  const [content, setContent] = useState("");
  const [dadosMunicipio, setDadosMunicipio] = useState<IMunicipio | any>("");
  const editor = useRef();
  const firstRender = useRef(true);
  const editorContent = useMemo(() => contentForEditor, [contentForEditor]);
  const [nomeMunicipio, setMunicipio] = useState("");


  useEffect(() => {    
    setDadosMunicipio(municipio[0]);
    setContentForEditor(municipio[0].rf_descricao);
    setMunicipio(municipio[0].municipio_nome)
  }, [municipio]);

  async function handleGetMunicipio(id_municipio) {
    const resMunicipio = await api.get("getMunicipio", {
      params: { id_municipio: id_municipio },
    });
    const res = resMunicipio.data.map((mun: IMunicipio) => {
      return mun;
    });
    console.log(res[0]);

    setDadosMunicipio(res[0]);
    setContentForEditor(res[0].rf_descricao);
  }

  async function handleCadastro(data) {
      if(typeof content === 'string'){
        data.rf_descricao = content;
      }else{
        data.rf_descricao = "";
      }  

      data.id_municipio = data.id_municipio ? data.id_municipio : dadosMunicipio.id_municipio 

    {
      data.municipio_codigo_ibge
        ? ""
        : (data.municipio_codigo_ibge = dadosMunicipio.municipio_codigo_ibge);
    }
    {
      data.municipio_nome
        ? ""
        : (data.municipio_nome = dadosMunicipio.municipio_nome);
    }
    {
      data.municipio_cnpj
        ? ""
        : (data.municipio_cnpj = dadosMunicipio.municipio_cnpj);
    }
    {
      data.municipio_cep
        ? ""
        : (data.municipio_cep = dadosMunicipio.municipio_cep);
    }
    {
      data.municipio_endereco
        ? ""
        : (data.municipio_endereco = dadosMunicipio.municipio_endereco);
    }
    {
      data.municipio_numero
        ? ""
        : (data.municipio_numero = dadosMunicipio.municipio_numero);
    }
    {
      data.municipio_bairro
        ? ""
        : (data.municipio_bairro = dadosMunicipio.municipio_bairro);
    }
    {
      data.municipio_telefone
        ? ""
        : (data.municipio_telefone = dadosMunicipio.municipio_telefone);
    }
    {
      data.municipio_email
        ? ""
        : (data.municipio_email = dadosMunicipio.municipio_email);
    }
    {
      data.municipio_prefeito
        ? ""
        : (data.municipio_prefeito = dadosMunicipio.municipio_prefeito);
    }
    {
      data.municipio_nome_prefeitura
        ? ""
        : (data.municipio_nome_prefeitura =
          dadosMunicipio.municipio_nome_prefeitura);
    }

    {
      data.id_titular_servicos_ms
        ? ""
        : (data.id_titular_servicos_ms = dadosMunicipio.id_titular_servicos_ms);
    }
    {
      data.ts_setor_responsavel
        ? ""
        : (data.ts_setor_responsavel = dadosMunicipio.ts_setor_responsavel);
    }
    {
      data.ts_telefone_comercial
        ? ""
        : (data.ts_telefone_comercial = dadosMunicipio.ts_telefone_comercial);
    }
    {
      data.ts_responsavel
        ? ""
        : (data.ts_responsavel = dadosMunicipio.ts_responsavel);
    }
    {
      data.ts_cargo ? "" : (data.ts_cargo = dadosMunicipio.ts_cargo);
    }
    {
      data.ts_telefone ? "" : (data.ts_telefone = dadosMunicipio.ts_telefone);
    }
    {
      data.ts_email ? "" : (data.ts_email = dadosMunicipio.ts_email);
    }

    {
      data.id_ps_abastecimento_agua
        ? ""
        : (data.id_ps_abastecimento_agua =
          dadosMunicipio.id_ps_abastecimento_agua);
    }
    {
      data.aa_abrangencia
        ? ""
        : (data.aa_abrangencia = dadosMunicipio.aa_abrangencia);
    }
    {
      data.aa_natureza_juridica
        ? ""
        : (data.aa_natureza_juridica = dadosMunicipio.aa_natureza_juridica);
    }
    {
      data.aa_cnpj ? "" : (data.aa_cnpj = dadosMunicipio.aa_cnpj);
    }
    {
      data.aa_telefone ? "" : (data.aa_telefone = dadosMunicipio.aa_telefone);
    }
    {
      data.aa_cep ? "" : (data.aa_cep = dadosMunicipio.aa_cep);
    }
    {
      data.aa_endereco ? "" : (data.aa_endereco = dadosMunicipio.aa_endereco);
    }
    {
      data.aa_numero ? "" : (data.aa_numero = dadosMunicipio.aa_numero);
    }
    {
      data.aa_bairro ? "" : (data.aa_bairro = dadosMunicipio.aa_bairro);
    }
    {
      data.aa_responsavel
        ? ""
        : (data.aa_responsavel = dadosMunicipio.aa_responsavel);
    }
    {
      data.aa_cargo ? "" : (data.aa_cargo = dadosMunicipio.aa_cargo);
    }
    {
      data.aa_email ? "" : (data.aa_email = dadosMunicipio.aa_email);
    }
    {
      data.aa_secretaria_setor_responsavel
        ? ""
        : (data.aa_secretaria_setor_responsavel =
          dadosMunicipio.aa_secretaria_setor_responsavel);
    }

    {
      data.id_ps_esgotamento_sanitario
        ? ""
        : (data.id_ps_esgotamento_sanitario =
          dadosMunicipio.id_ps_esgotamento_sanitario);
    }
    {
      data.es_secretaria_setor_responsavel
        ? ""
        : (data.es_secretaria_setor_responsavel =
          dadosMunicipio.es_secretaria_setor_responsavel);
    }
    {
      data.es_abrangencia
        ? ""
        : (data.es_abrangencia = dadosMunicipio.es_abrangencia);
    }
    {
      data.es_natureza_juridica
        ? ""
        : (data.es_natureza_juridica = dadosMunicipio.es_natureza_juridica);
    }
    {
      data.es_cnpj ? "" : (data.es_cnpj = dadosMunicipio.es_cnpj);
    }
    {
      data.es_telefone ? "" : (data.es_telefone = dadosMunicipio.es_telefone);
    }
    {
      data.es_cep ? "" : (data.es_cep = dadosMunicipio.es_cep);
    }
    {
      data.es_endereco ? "" : (data.es_endereco = dadosMunicipio.es_endereco);
    }
    {
      data.es_numero ? "" : (data.es_numero = dadosMunicipio.es_numero);
    }
    {
      data.es_bairro ? "" : (data.es_bairro = dadosMunicipio.es_bairro);
    }
    {
      data.es_responsavel
        ? ""
        : (data.es_responsavel = dadosMunicipio.es_responsavel);
    }
    {
      data.es_cargo ? "" : (data.es_cargo = dadosMunicipio.es_cargo);
    }
    {
      data.es_email ? "" : (data.es_email = dadosMunicipio.es_email);
    }

    {
      data.id_ps_drenagem_aguas_pluviais
        ? ""
        : (data.id_ps_drenagem_aguas_pluviais =
          dadosMunicipio.id_ps_drenagem_aguas_pluviais);
    }
    {
      data.da_secretaria_setor_responsavel
        ? ""
        : (data.da_secretaria_setor_responsavel =
          dadosMunicipio.da_secretaria_setor_responsavel);
    }
    {
      data.da_abrangencia
        ? ""
        : (data.da_abrangencia = dadosMunicipio.da_abrangencia);
    }
    {
      data.da_natureza_juridica
        ? ""
        : (data.da_natureza_juridica = dadosMunicipio.da_natureza_juridica);
    }
    {
      data.da_cnpj ? "" : (data.da_cnpj = dadosMunicipio.da_cnpj);
    }
    {
      data.da_telefone ? "" : (data.da_telefone = dadosMunicipio.da_telefone);
    }
    {
      data.da_cep ? "" : (data.da_cep = dadosMunicipio.da_cep);
    }
    {
      data.da_endereco ? "" : (data.da_endereco = dadosMunicipio.da_endereco);
    }
    {
      data.da_numero ? "" : (data.da_numero = dadosMunicipio.da_numero);
    }
    {
      data.da_bairro ? "" : (data.da_bairro = dadosMunicipio.da_bairro);
    }
    {
      data.da_responsavel
        ? ""
        : (data.da_responsavel = dadosMunicipio.da_responsavel);
    }
    {
      data.da_cargo ? "" : (data.da_cargo = dadosMunicipio.da_cargo);
    }
    {
      data.da_email ? "" : (data.da_email = dadosMunicipio.da_email);
    }

    {
      data.id_ps_residuo_solido
        ? ""
        : (data.id_ps_residuo_solido = dadosMunicipio.id_ps_residuo_solido);
    }
    {
      data.rs_secretaria_setor_responsavel
        ? ""
        : (data.rs_secretaria_setor_responsavel =
          dadosMunicipio.rs_secretaria_setor_responsavel);
    }
    {
      data.rs_abrangencia
        ? ""
        : (data.rs_abrangencia = dadosMunicipio.rs_abrangencia);
    }
    {
      data.rs_natureza_juridica
        ? ""
        : (data.rs_natureza_juridica = dadosMunicipio.rs_natureza_juridica);
    }
    {
      data.rs_cnpj ? "" : (data.rs_cnpj = dadosMunicipio.rs_cnpj);
    }
    {
      data.rs_telefone ? "" : (data.rs_telefone = dadosMunicipio.rs_telefone);
    }
    {
      data.rs_cep ? "" : (data.rs_cep = dadosMunicipio.rs_cep);
    }
    {
      data.rs_endereco ? "" : (data.rs_endereco = dadosMunicipio.rs_endereco);
    }
    {
      data.rs_numero ? "" : (data.rs_numero = dadosMunicipio.rs_numero);
    }
    {
      data.rs_bairro ? "" : (data.rs_bairro = dadosMunicipio.rs_bairro);
    }
    {
      data.rs_responsavel
        ? ""
        : (data.rs_responsavel = dadosMunicipio.rs_responsavel);
    }
    {
      data.rs_cargo ? "" : (data.rs_cargo = dadosMunicipio.rs_cargo);
    }
    {
      data.rs_email ? "" : (data.rs_email = dadosMunicipio.rs_email);
    }

    {
      data.id_regulador_fiscalizador_ss
        ? ""
        : (data.id_regulador_fiscalizador_ss =
          dadosMunicipio.id_regulador_fiscalizador_ss);
    }
    {
      data.rf_setor_responsavel
        ? ""
        : (data.rf_setor_responsavel = dadosMunicipio.rf_setor_responsavel);
    }
    {
      data.rf_telefone_comercial
        ? ""
        : (data.rf_telefone_comercial = dadosMunicipio.rf_telefone_comercial);
    }
    {
      data.rf_responsavel
        ? ""
        : (data.rf_responsavel = dadosMunicipio.rf_responsavel);
    }
    {
      data.rf_cargo ? "" : (data.rf_cargo = dadosMunicipio.rf_cargo);
    }
    {
      data.rf_telefone ? "" : (data.rf_telefone = dadosMunicipio.rf_telefone);
    }
    {
      data.rf_email ? "" : (data.rf_email = dadosMunicipio.rf_email);
    }
    {
      data.rf_descricao ? "" : (data.rf_descricao = dadosMunicipio.rf_descricao);
    }

    {
      data.id_controle_social_sms
        ? ""
        : (data.id_controle_social_sms = dadosMunicipio.id_controle_social_sms);
    }
    {
      data.cs_setor_responsavel
        ? ""
        : (data.cs_setor_responsavel = dadosMunicipio.cs_setor_responsavel);
    }
    {
      data.cs_telefone ? "" : (data.cs_telefone = dadosMunicipio.cs_telefone);
    }
    {
      data.cs_email ? "" : (data.cs_email = dadosMunicipio.cs_email);
    }

    {
      data.id_responsavel_simisab
        ? ""
        : (data.id_responsavel_simisab = dadosMunicipio.id_responsavel_simisab);
    }
    {
      data.simisab_responsavel
        ? ""
        : (data.simisab_responsavel = dadosMunicipio.simisab_responsavel);
    }
    {
      data.simisab_telefone
        ? ""
        : (data.simisab_telefone = dadosMunicipio.simisab_telefone);
    }
    {
      data.simisab_email
        ? ""
        : (data.simisab_email = dadosMunicipio.simisab_email);
    }

    {
      data.id_dados_demograficos
        ? ""
        : (data.id_dados_demograficos = dadosMunicipio.id_dados_demograficos);
    }
    {
      data.dd_populacao_urbana
        ? ""
        : (data.dd_populacao_urbana = dadosMunicipio.dd_populacao_urbana);
    }
    {
      data.dd_populacao_rural
        ? ""
        : (data.dd_populacao_rural = dadosMunicipio.dd_populacao_rural);
    }
    {
      data.dd_populacao_total
        ? ""
        : (data.dd_populacao_total = dadosMunicipio.dd_populacao_total);
    }
    {
      data.dd_total_moradias
        ? ""
        : (data.dd_total_moradias = dadosMunicipio.dd_total_moradias);
    }
    
    const res = await api
      .post("addMunicipio", data)
      .then((response) => {
        toast.notify('Dados gravados com sucesso!',{
          title: "Sucesso!",
          duration: 7,
          type: "success",
        })       
      })
      .catch((error) => {
        console.log(error);
      });
  }

  
  function handleOnChange(content) {
    setContent(content);
  }

  async function handleSignOut(){
   signOut()
  }
  function handleHome() {
    Router.push("/indicadores/home_indicadores");
  }
  function handleGestao(){
    Router.push("/indicadores/gestao");
   }
   function handleIndicadores(){
    Router.push("/indicadores/gestao");
   }
   function handleReporte(){
    Router.push("/indicadores/gestao");
   }

  return (
    <Container>
      <ToastContainer></ToastContainer>
      <HeadIndicadores usuarios={[]}></HeadIndicadores>
      <MenuHorizontal municipio={municipio[0].municipio_nome}></MenuHorizontal>
      <MenuIndicadores></MenuIndicadores>
      <DivCenter>
        <Form onSubmit={handleSubmit(handleCadastro)} autoComplete="off">
          <DivForm>
            <DivTituloForm>Dados do Município</DivTituloForm>
            <input
              {...register("id_municipio")}
              defaultValue={usuario?.id_municipio}
              onChange={handleOnChange}
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
                      defaultValue={dadosMunicipio.municipio_codigo_ibge}
                      onChange={handleOnChange}
                      type="text"
                    ></input>
                  </InputP>
                  </td>
                  <td>
                  <InputM>
                    <label>Municipio</label>
                    <input
                      {...register("municipio_nome")}
                      defaultValue={dadosMunicipio.municipio_nome}
                      onChange={handleOnChange}
                    ></input>
                  </InputM>
                  </td>
                  <td>
                  <InputM>
                    <label>CNPJ</label>
                    <input
                      {...register("municipio_cnpj")}
                      defaultValue={dadosMunicipio.municipio_cnpj}
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
                      Nome da Prefeitura<span> *</span>
                    </label>
                    <input
                      aria-invalid={errors.value ? "true" : "false"}
                      {...register("municipio_nome_prefeitura", { required: false })}
                      defaultValue={dadosMunicipio.municipio_nome_prefeitura}
                      onChange={handleOnChange}
                      type="text"
                    />
                    {errors.municipio_nome_prefeitura && errors.municipio_nome_prefeitura.type && (
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
                        defaultValue={dadosMunicipio.municipio_cep}
                        onChange={handleOnChange}
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
                      {...register("municipio_endereco", { required: false })}
                      defaultValue={dadosMunicipio.municipio_endereco}
                      onChange={handleOnChange}
                      type="text"
                    />
                    {errors.municipio_endereco && errors.municipio_endereco.type && (
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
                      defaultValue={dadosMunicipio.municipio_numero}
                      onChange={handleOnChange}
                      type="text"
                    />
                    {errors.municipio_numero && errors.municipio_numero.type && (
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
                      defaultValue={dadosMunicipio.municipio_bairro}
                      onChange={handleOnChange}
                      type="text"
                    />
                    {errors.municipio_bairro && errors.municipio_bairro.type && (
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
                      {...register("municipio_telefone", { required: false })}
                      defaultValue={dadosMunicipio.municipio_telefone}
                      onChange={handleOnChange}
                      type="text"
                    />
                    {errors.municipio_telefone && errors.municipio_telefone.type && (
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
                        defaultValue={dadosMunicipio.municipio_email}
                        onChange={handleOnChange}
                        type="text"
                      />
                      {errors.municipio_email && errors.municipio_email.type && (
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
                      {...register("municipio_prefeito", { required: false })}
                      defaultValue={dadosMunicipio.municipio_prefeito}
                      onChange={handleOnChange}
                      type="text"
                    />
                    {errors.municipio_prefeito && errors.municipio_prefeito.type && (
                      <span>O campo é obrigatório!</span>
                    )}
                  </InputG>
                  </td>
                </tr>

              </tbody>
            </table>
       
            
          
           
           
          </DivForm>

          <DivForm>
            <DivTituloForm>
              Titular dos Serviços Municipais de Saneamento
            </DivTituloForm>
            <input
              {...register("id_titular_servicos_ms")}
              defaultValue={dadosMunicipio.id_titular_servicos_ms}
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
                      {...register("ts_setor_responsavel")}
                      defaultValue={dadosMunicipio.ts_setor_reponsavel}
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
                      {...register("ts_telefone_comercial")}
                      defaultValue={dadosMunicipio.ts_telefone_comercial}
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
                      {...register("ts_responsavel")}
                      defaultValue={dadosMunicipio.ts_responsavel}
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
                        {...register("ts_cargo")}
                        defaultValue={dadosMunicipio.ts_cargo}
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
                        {...register("ts_telefone")}
                        defaultValue={dadosMunicipio.ts_telefone}
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
                      defaultValue={dadosMunicipio.ts_email}
                      onChange={handleOnChange}
                      type="text"
                    ></input>
                  </InputG>
                  </td>
                </tr>
              </tbody>
            </table>
         
          </DivForm>

          <DivForm>
            <DivTituloForm>
              Prestadores do Serviço de Saneamento Básico
            </DivTituloForm>
            <DivEixo>Abastecimento de Água</DivEixo>
            <input
              {...register("id_ps_abastecimento_agua")}
              defaultValue={dadosMunicipio.id_ps_abastecimento_agua}
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
                        defaultValue={dadosMunicipio.aa_secretaria_setor_responsavel}
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
                      defaultValue={dadosMunicipio.aa_abrangencia}
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
                      <option value={dadosMunicipio.aa_natureza_juridica}>
                        {dadosMunicipio.aa_natureza_juridica}
                      </option>
                      <option value="Administração Pública Direta">Administração Pública Direta</option>
                      <option value="Autarquia">Autarquia</option>
                      <option value="Empresa pública">Empresa pública</option>
                      <option value="Sociedade de economia mista com administração privada">Sociedade de economia mista com administração privada</option>
                      <option value="Sociedade de economia mista com administração pública">Sociedade de economia mista com administração pública</option>
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
                        defaultValue={dadosMunicipio.aa_cnpj}
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
                        defaultValue={dadosMunicipio.aa_telefone}
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
                        defaultValue={dadosMunicipio.aa_cep}
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
                        defaultValue={dadosMunicipio.aa_endereco}
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
                        defaultValue={dadosMunicipio.aa_numero}
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
                        defaultValue={dadosMunicipio.aa_bairro}
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
                      defaultValue={dadosMunicipio.aa_responsavel}
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
                        defaultValue={dadosMunicipio.aa_cargo}
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
                        defaultValue={dadosMunicipio.aa_email}
                        onChange={handleOnChange}
                        type="text"
                      ></input>
                    </InputM>
                  </td>
                </tr>
              </tbody>
            </table>
        
           

            <DivEixo>Esgotamento Sanitário</DivEixo>
            <input
              {...register("id_ps_esgotamento_sanitario")}
              defaultValue={dadosMunicipio.id_ps_esgotamento_sanitario}
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
                      {...register("es_secretaria_setor_responsavel")}
                      defaultValue={dadosMunicipio.es_secretaria_setor_responsavel}
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
                        {...register("es_abrangencia")}
                        defaultValue={dadosMunicipio.es_abrangencia}
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
                        <option value={dadosMunicipio.es_natureza_juridica}>
                          {dadosMunicipio.es_natureza_juridica}
                        </option>
                              <option value="Administração Pública Direta">Administração Pública Direta</option>
                              <option value="Autarquia">Autarquia</option>
                              <option value="Empresa pública">Empresa pública</option>
                              <option value="Sociedade de economia mista com administração privada">Sociedade de economia mista com administração privada</option>
                              <option value="Sociedade de economia mista com administração pública">Sociedade de economia mista com administração pública</option>
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
                        defaultValue={dadosMunicipio.es_cnpj}
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
                        defaultValue={dadosMunicipio.es_telefone}
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
                        defaultValue={dadosMunicipio.es_cep}
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
                          defaultValue={dadosMunicipio.es_endereco}
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
                        defaultValue={dadosMunicipio.es_numero}
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
                        defaultValue={dadosMunicipio.es_bairro}
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
                        defaultValue={dadosMunicipio.es_responsavel}
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
                        defaultValue={dadosMunicipio.es_cargo}
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
                        defaultValue={dadosMunicipio.es_email}
                        onChange={handleOnChange}
                        type="text"
                      ></input>
                    </InputM>
                  </td>
                </tr>
              </tbody>
            </table>
      
        
          

            <DivEixo>Drenagem e Àguas pluviais</DivEixo>
            <input
              {...register("id_ps_drenagem_aguas_pluviais")}
              defaultValue={dadosMunicipio.id_ps_drenagem_aguas_pluviais}
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
                        {...register("da_secretaria_setor_responsavel")}
                        defaultValue={dadosMunicipio.da_secretaria_setor_responsavel}
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
                        {...register("da_abrangencia")}
                        defaultValue={dadosMunicipio.da_abrangencia}
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
                        <option value={dadosMunicipio.da_natureza_juridica}>
                          {dadosMunicipio.da_natureza_juridica}
                        </option>
                        <option value="PESSOA FISICA">PESSOA FISICA</option>
                        <option value="PESSOA JURIDICA">PESSOA JURIDICA</option>
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
                        defaultValue={dadosMunicipio.da_cnpj}
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
                        defaultValue={dadosMunicipio.da_telefone}
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
                        defaultValue={dadosMunicipio.da_cep}
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
                        defaultValue={dadosMunicipio.da_endereco}
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
                        defaultValue={dadosMunicipio.da_numero}
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
                        defaultValue={dadosMunicipio.da_bairro}
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
                        defaultValue={dadosMunicipio.da_responsavel}
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
                        defaultValue={dadosMunicipio.da_cargo}
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
                        defaultValue={dadosMunicipio.da_email}
                        onChange={handleOnChange}
                        type="text"
                      ></input>
                    </InputM>
                  </td>
                </tr>
              </tbody>
            </table>
       
         
        

            <DivEixo>Resíduos Sólidos</DivEixo>
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
                      defaultValue={dadosMunicipio.rs_secretaria_setor_responsavel}
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
                      defaultValue={dadosMunicipio.rs_abrangencia}
                      onChange={handleOnChange}
                      type="text"
                    ></input>
                  </InputP>
                  </td>
                </tr>
              </tbody>
            </table>
            <input
              {...register("id_ps_residuo_solido")}
              defaultValue={dadosMunicipio.id_ps_residuo_solido}
              onChange={handleOnChange}
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
                        <option value={dadosMunicipio.rs_natureza_juridica}>
                          {dadosMunicipio.rs_natureza_juridica}
                        </option>
                        <option value="PESSOA FISICA">PESSOA FISICA</option>
                        <option value="PESSOA JURIDICA">PESSOA JURIDICA</option>
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
                        defaultValue={dadosMunicipio.rs_cnpj}
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
                        {...register("rs_telefone")}
                        defaultValue={dadosMunicipio.rs_telefone}
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
                        defaultValue={dadosMunicipio.rs_cep}
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
                        defaultValue={dadosMunicipio.rs_endereco}
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
                        defaultValue={dadosMunicipio.rs_numero}
                        onChange={handleOnChange}
                        type="text"
                      ></input>
                    </InputP>
                  </td>
                  <td>
                  <InputG>
                      <label>
                        Bairro<span> *</span>
                      </label>
                      <input
                        {...register("rs_bairro")}
                        defaultValue={dadosMunicipio.rs_bairro}
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
                  <InputG>
                      <label>
                        Nome do Responsável<span> *</span>
                      </label>
                      <input
                        {...register("rs_responsavel")}
                        defaultValue={dadosMunicipio.rs_responsavel}
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
                        defaultValue={dadosMunicipio.rs_cargo}
                        onChange={handleOnChange}
                        type="text"
                      ></input>
                    </InputP>
                  </td>
                  <td>
                  <InputG>
                      <label>
                        Email<span> *</span>
                      </label>
                      <input
                        {...register("rs_email")}
                        defaultValue={dadosMunicipio.rs_email}
                        onChange={handleOnChange}
                        type="text"
                      ></input>
                    </InputG>
                  </td>
                </tr>
              </tbody>
            </table>
          
            
         
          </DivForm>

          <DivForm>
            <DivTituloForm>
              Regulador e Fiscalizador dos Serviços de Saneamento
            </DivTituloForm>
            <input
              {...register("id_regulador_fiscalizador_ss")}
              defaultValue={dadosMunicipio.id_regulador_fiscalizador_ss}
              onChange={handleOnChange}
              type="hidden"
            />
            <InputG>
              <label>
                Setor Responsável<span> *</span>
              </label>
              <input
                {...register("rf_setor_responsavel")}
                defaultValue={dadosMunicipio.rf_setor_responsavel}
                onChange={handleOnChange}
                type="text"
              ></input>
            </InputG>
            <InputP>
              <label>
                Telefone Comercial<span> *</span>
              </label>
              <input
                {...register("rf_telefone_comercial")}
                defaultValue={dadosMunicipio.rf_telefone_comercial}
                onChange={handleOnChange}
                type="text"
              ></input>
            </InputP>
            <InputG>
              <label>
                Nome Responsável<span> *</span>
              </label>
              <input
                {...register("rf_responsavel")}
                defaultValue={dadosMunicipio.rf_responsavel}
                onChange={handleOnChange}
                type="text"
              ></input>
            </InputG>
            <InputM>
              <label>
                Cargo<span> *</span>
              </label>
              <input
                {...register("rf_cargo")}
                defaultValue={dadosMunicipio.rf_cargo}
                onChange={handleOnChange}
                type="text"
              ></input>
            </InputM>
            <InputP>
              <label>
                Telefone<span> *</span>
              </label>
              <input
                {...register("rf_telefone")}
                defaultValue={dadosMunicipio.rf_telefone}
                onChange={handleOnChange}
                type="text"
              ></input>
            </InputP>
            <InputG>
              <label>
                Email<span> *</span>
              </label>
              <input
                {...register("rf_email")}
                defaultValue={dadosMunicipio.rf_email}
                onChange={handleOnChange}
                type="text"
              ></input>
            </InputG>
            <DivTextArea>
              <label>Descrição detalhada das funções e responsabilidades<span> *</span></label>
              <TextArea>
                <textarea
                  {...register("rf_descricao")}
                  defaultValue={dadosMunicipio.rf_descricao}
                  onChange={handleOnChange}
                />
              </TextArea>
            </DivTextArea>
          </DivForm>

          <DivForm>
            <DivTituloForm>
              Controle Social dos Serços Municipais de Saneamento
            </DivTituloForm>
            <input
              {...register("id_controle_social_sms")}
              defaultValue={dadosMunicipio.id_controle_social_sms}
              onChange={handleOnChange}
              type="hidden"
            />
            <InputG>
              <label>
                Setor Responsável<span> *</span>
              </label>
              <input
                {...register("cs_setor_responsavel")}
                defaultValue={dadosMunicipio.cs_setor_responsavel}
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
                defaultValue={dadosMunicipio.cs_telefone}
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
                defaultValue={dadosMunicipio.cs_email}
                onChange={handleOnChange}
                type="text"
              ></input>
            </InputG>
          </DivForm>

          <DivForm>
            <DivTituloForm>Responsável pelo SIMISAB</DivTituloForm>
            <input
              {...register("id_responsavel_simisab")}
              defaultValue={dadosMunicipio.id_responsavel_simisab}
              onChange={handleOnChange}
              type="hidden"
            />
            <InputG>
              <label>
                Nome<span> *</span>
              </label>
              <input
                {...register("simisab_responsavel")}
                defaultValue={dadosMunicipio.simisab_responsavel}
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
                defaultValue={dadosMunicipio.simisab_telefone}
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
                defaultValue={dadosMunicipio.simisab_email}
                onChange={handleOnChange}
                type="text"
              ></input>
            </InputG>
          </DivForm>

          <DivForm>
            <DivTituloForm>Dados demográficos</DivTituloForm>
            <input
              {...register("id_dados_demograficos")}
              defaultValue={dadosMunicipio.id_dados_demograficos}
              onChange={handleOnChange}
              type="hidden"
            />
            <InputM>
              <label>
                População urbana<span> *</span>
              </label>
              <input
                {...register("dd_populacao_urbana")}
                defaultValue={dadosMunicipio.dd_populacao_urbana}
                onChange={handleOnChange}
                type="text"
              ></input>
            </InputM>
            <InputM>
              <label>
                População rural<span> *</span>
              </label>
              <input
                {...register("dd_populacao_rural")}
                defaultValue={dadosMunicipio.dd_populacao_rural}
                onChange={handleOnChange}
                type="text"
              ></input>
            </InputM>
            <InputM>
              <label>
                População Total<span> *</span>
              </label>
              <input
                {...register("dd_populacao_total")}
                defaultValue={dadosMunicipio.dd_populacao_total}
                onChange={handleOnChange}
                type="text"
              ></input>
            </InputM>
            <InputM>
              <label>
                Total de Moradias<span> *</span>
              </label>
              <input
                {...register("dd_total_moradias")}
                defaultValue={dadosMunicipio.dd_total_moradias}
                onChange={handleOnChange}
                type="text"
              ></input>
            </InputM>
          </DivForm>
          <SubmitButton type="submit">Gravar</SubmitButton>
        </Form>
      </DivCenter>
    </Container>
  );
}


export const getServerSideProps: GetServerSideProps<MunicipioProps> = async (ctx)=>{

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

  const resUsuario = await apiClient.get("getUsuario", {params: {id_usuario: id_usuario}});
  const usuario = await resUsuario.data;

  const res = await apiClient.get("getMunicipio", {params: {id_municipio: usuario[0].id_municipio}});
  const municipio = await res.data;
  
  
  return {
    props: {
      municipio,
    }
  }
}


