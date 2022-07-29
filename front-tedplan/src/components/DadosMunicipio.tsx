import React from "react";
import { useForm } from "react-hook-form";
import { DivForm, InputG, InputM, InputP, DivTituloForm } from "../styles/indicadores";

export default function DadosMunicipio() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm()
  return (

    <DivForm>
    <DivTituloForm>Dados do Municipio</DivTituloForm>
    <InputP>
      <label>Código do IBGE</label>
      <input 
      {...register("codigo_ibge")}
      type="text"></input>
    </InputP>
    <InputM>
      <label>Municipio</label>
      <input
      {...register("nome_municipio")}
      type="text"></input>
    </InputM>
    <InputP>
      <label>CNPJ</label>
      <input 
      {...register("cnpj")}
      type="text"></input>
    </InputP>
    <InputG>
      <label>Nome da Prefeitura</label>
      <input
      {...register("prefeitura")}
      type="text"></input>
    </InputG>
    <InputP>
      <label>CEP</label>
      <input 
      {...register("cep")}
      type="text"></input>
    </InputP>
    <InputG>
      <label>Endereço</label>
      <input 
      {...register("endereco")}
      type="text"></input>
    </InputG>
    <InputP>
      <label>Numero</label>
      <input
      {...register("numero")}
      type="text"></input>
    </InputP>
    <InputM>
      <label>Bairro</label>
      <input 
      {...register("bairro")}
      type="text"></input>
    </InputM>
    <InputP>
      <label>Telefone</label>
      <input
      {...register("telefone")}
      type="text"></input>
    </InputP>
    <InputM>
      <label>E-mail</label>
      <input 
      {...register("email")}
      type="text"></input>
    </InputM>      
    <InputG>
      <label>Nome do Prefeito</label>
      <input 
      {...register("prefeito")}
      type="text"></input>
    </InputG>
  </DivForm>

  )
}
