import React from "react";
import { useForm } from "react-hook-form";
import { DivForm, InputG, InputM, InputP, DivTituloForm, Form, SubmitButton } from "../styles/indicadores";

export default function RepresentanteGestaoAssociada() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm()

    function handleAddRepresentante(e){
      e.preventDefault()
      console.log('teste');
      
    }
  return (
  <>
   <Form onSubmit={handleSubmit(handleAddRepresentante)}>
    <InputG>
    <label>
      Nome<span> *</span>
    </label>
    <input {...register("ga_nome_representante")} type="text"></input>
  </InputG>
  <InputP>
    <label>
      Cargo<span> *</span>
    </label>
    <input {...register("ga_cargo")} type="text"></input>
  </InputP>
  <InputP>
    <label>
      Telefone<span> *</span>
    </label>
    <input {...register("ga_telefone")} type="text"></input>
  </InputP>
  <InputM>
    <label>
      Email<span> *</span>
    </label>
    <input {...register("ga_email")} type="text"></input>
  </InputM>
  <InputP>
    <SubmitButton>Enviar</SubmitButton>
  </InputP>
  </Form>
  </>
  )
}
