import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  DivForm,
  DivTituloForm,
  DivTituloFormResiduo,
  Form,
  SubmitButton,
} from "../styles/financeiro";
import { AuthContext } from "../contexts/AuthContext";
import { Chart } from "react-google-charts";
import { useForm } from "react-hook-form";
import api from "../services/api";


interface IMunicipio {
  id_municipio: string;
  municipio_codigo_ibge: string;
  municipio_nome: string;
}

interface MunicipioProps {
  municipio: IMunicipio[];
}

export default function Drenagem({ municipio }: MunicipioProps) {
  const { usuario, signOut } = useContext(AuthContext);
  const [title, setTitle] = useState<IMunicipio | any>(municipio);
  const [ municipios, setMunicipios ] = useState(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [data, setData] = useState(null);
  var options = {
    title: title,
    curveType: 'default',
    legend: { position: 'rigth' }
  };

  useEffect(()=>{
    let data = {
      ano: new Date().getFullYear(),
      id_municipio: 1,
    }
    data.ano = new Date().getFullYear() 
    getMunucipios()

  },[])

  async function getMunucipios(){
    await api.get('getMunicipios').then(response=>{
      setMunicipios(response.data)
    }).catch((error)=>{
      console.log(error);
      
    })
  }

  function handleIndicador(data){       
   if(data.indicador == 'IN042'){
    IN042(data)
   }
   if(data.indicador == 'IN043'){
    IN043(data)
   }
   if(data.indicador == 'IN044'){
    IN044(data)
   }
   if(data.indicador == 'IN001'){
    IN001(data)
   }
   if(data.indicador == 'IN006'){
    IN006(data)
   }
   if(data.indicador == 'IN010'){
    IN010(data)
   }
   if(data.indicador == 'IN050'){
    IN050(data)
   }
   if(data.indicador == 'IN054'){
    IN054(data)
   }
   if(data.indicador == 'IN005'){
    IN005(data)
   }
   if(data.indicador == 'IN009'){
    IN009(data)
   }
   if(data.indicador == 'IN048'){
    IN048(data)
   }
   if(data.indicador == 'IN049'){
    IN049(data)
   }
   if(data.indicador == 'IN053'){
    IN053(data)
   }
   if(data.indicador == 'IN020'){
    IN020(data)
   }
   if(data.indicador == 'IN021'){
    IN021(data)
   }
   if(data.indicador == 'IN025'){
    IN025(data)
   }
   if(data.indicador == 'IN026'){
    IN026(data)
   }
   if(data.indicador == 'IN027'){
    IN027(data)
   }
   if(data.indicador == 'IN029'){
    IN029(data)
   }
   if(data.indicador == 'IN035'){
    IN035(data)
   }
   if(data.indicador == 'IN051'){
    IN051(data)
   }
   if(data.indicador == 'IN040'){
    IN040(data)
   }
   if(data.indicador == 'IN046'){
    IN046(data)
   }
   if(data.indicador == 'IN047'){
    IN047(data)
   }   
  }


  async function IN042(data){
       
    const rsGe = await api.post('get-geral', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    
    const GE002 = rsGe?.ge002
    const GE001 = rsGe?.ge001

    const result = (GE002 / GE001) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN043(data){          
    const rsGe = await api.post('get-geral', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    
    const GE002 = rsGe?.ge002
    const GE006 = rsGe?.ge006

    const result = (GE006 / (GE002 * 100)) 
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN044(data){          
    const rsGe = await api.post('get-geral', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    
    const GE002 = rsGe?.ge002
    const GE008 = rsGe?.ge008

    const result = (GE008 / (GE002 * 100)) 
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN001(data){          
    const rsGe = await api.post('get-geral', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    
    const AD001 = rsGe?.ag001
    const AD003 = rsGe?.ag003
    const result = (AD001 / AD003) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN006(data){          
    const rsFn = await api.post('getPsFinanceiro', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })
    
    const FN005 = rsFn?.fn005
    const CB003 = rsFn?.cb003
    const result = (FN005 / CB003)
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN010(data){     
   
    const rsFn = await api.post('getPsFinanceiro', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })    
    
    const FN012 = rsFn?.fn012
    const FN016 = rsFn?.fn016

    const result = (FN016 / FN012) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN050(data){  
    const rsFn = await api.post('getPsFinanceiro', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })  
    
    const FN009 = rsFn?.fn009
    const FN016 = rsFn?.fn016
    const result = ((FN009 - FN016) / FN009) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN054(data){  
    const rsFn = await api.post('getPsFinanceiro', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })  
    
    const FN023 = rsFn?.fn023
    const FN022 = rsFn?.fn022
    const result = (FN023 / FN022)
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN005(data){  
    const rsFn = await api.post('getPsFinanceiro', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })  
    
    const FN005 = rsFn?.fn005
    const GE007 = rsFn?.ge007
    const result = (FN005 / GE007)
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN009(data){     
    const rsFn = await api.post('getPsFinanceiro', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })  
    
    const FN016 = rsFn?.fn016
    const GE007 = rsFn?.ge007
    const result = (FN016 / GE007)
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN048(data){     
    const rsFn = await api.post('getPsFinanceiro', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })  
    
    const FN016 = rsFn?.fn016
    const GE006 = rsFn?.ge006
    const result = (FN016 / GE006)
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN049(data){     
    const rsFn = await api.post('getPsFinanceiro', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })  
    
    const FN022 = rsFn?.fn022
    const GE006 = rsFn?.ge006
    const result = (FN022 / GE006)
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN053(data){     
    const rsFn = await api.post('getPsFinanceiro', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })  
    
    const FN023 = rsFn?.fn023
    const GE006 = rsFn?.ge006
    const result = (FN023 / GE006)
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN020(data){     
    const rsDr = await api.get('get-drenagem', {params: {id_municipio: data.id_municipio}})
    .then(response=>{ return response.data[0]})  
    
    const IE019 = rsDr?.ie019
    const IE017 = rsDr?.ie017
   
    const result = (IE019 / IE017) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN021(data){     
    const rsDr = await api.get('get-drenagem', {params: {id_municipio: data.id_municipio}})
    .then(response=>{ return response.data[0]})  
    
    const IE024 = rsDr?.ie024
    const IE017 = rsDr?.ie017
   
    const result = (IE024 / IE017) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN025(data){     
    const rsDr = await api.get('get-drenagem', {params: {id_municipio: data.id_municipio}})
    .then(response=>{ return response.data[0]})  
    
    const IE044 = rsDr?.ie044
    const IE032 = rsDr?.ie032
   
    const result = (IE044 / IE032) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN026(data){     
    const rsDr = await api.get('get-drenagem', {params: {id_municipio: data.id_municipio}})
    .then(response=>{ return response.data[0]})  
    
    const IE034 = rsDr?.ie034
    const IE032 = rsDr?.ie032
   
    const result = (IE034 / IE032) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN027(data){     
    const rsDr = await api.get('get-drenagem', {params: {id_municipio: data.id_municipio}})
    .then(response=>{ return response.data[0]})  
    
    const IE035 = rsDr?.ie035
    const IE032 = rsDr?.ie032
   
    const result = (IE035 / IE032) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN029(data){     
    const rsDr = await api.get('get-drenagem', {params: {id_municipio: data.id_municipio}})
    .then(response=>{ return response.data[0]})  
    
    const IE033 = rsDr?.ie033
    const IE032 = rsDr?.ie032
   
    const result = (IE033 / IE032) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN035(data){     
    const rsDr = await api.get('get-drenagem', {params: {id_municipio: data.id_municipio}})
    .then(response=>{ return response.data[0]})  
    
    const IE058 = rsDr?.ie058
    const GE002 = rsDr?.ge002
   
    const result = (IE058 / GE002)
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN051(data){     
    const rsDr = await api.get('get-drenagem', {params: {id_municipio: data.id_municipio}})
    .then(response=>{ return response.data[0]})  
    
    const IE021 = rsDr?.ie021
    const IE022 = rsDr?.ie022
    const GE002 = rsDr?.ge002
   
    const result = (IE021 + IE022) / GE002
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN040(data){     
    const rsDr = await api.get('get-drenagem', {params: {id_municipio: data.id_municipio}})
    .then(response=>{ return response.data[0]})  
    
    
    const RI013 = rsDr?.ri013
    const GE008 = rsDr?.ge008
   
    const result = (RI013 / GE008) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN041(data){     
    const rsDr = await api.get('get-drenagem', {params: {id_municipio: data.id_municipio}})
    .then(response=>{ return response.data[0]})  
    
    
    const RI029 = rsDr?.ri029
    const RI067 = rsDr?.ri067
    const GE006 = rsDr?.ge006
   
    const result = ((RI029 + RI067) / GE006) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }
  async function IN046(data){     
    const rsDr = await api.get('get-drenagem', {params: {id_municipio: data.id_municipio}})
    .then(response=>{ return response.data[0]})  
    
    
    const RI031 = rsDr?.ri031
    const RI068 = rsDr?.ri068
    const GE006 = rsDr?.ge006
   
    const result = (((RI031 + RI068)  * 10^5) / GE006)
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN047(data){     
    const rsDr = await api.get('get-drenagem', {params: {id_municipio: data.id_municipio}})
    .then(response=>{ return response.data[0]})  
    
    
    const RI043 = rsDr?.ri043
    const RI044 = rsDr?.ri044
    const GE005 = rsDr?.ge005
   
    const result = ((RI043 + RI044) / GE005) * 10^5
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }



  return (
    
        <Form onSubmit={handleSubmit(handleIndicador)}>
          <DivForm>
            <DivTituloFormResiduo>Drenagem de Águas Pluviais</DivTituloFormResiduo> 
            <table>
             <thead>
              <tr>
                <th></th>
              </tr>
             </thead>
             <tbody>
              <tr>
              <td>
                  <select {...register("id_municipio")}>
                  <option>Município</option>
                    {municipios?.map((municipio, key)=>(
                      <option key={key} value={municipio.id_municipio}>{municipio.nome}</option>
                    ))}
                    
                  </select>
                </td>
                <td>
                  <select {...register("ano")} >
                  <option>Ano</option>
                    <option value="2022">2022</option>                   
                  </select>
                </td>
                <td>
                <select {...register("indicador")}>
                   <option>Indicardor</option>
                   <option value="IN042">IN042 - Parcela de área urbana em relação à área total</option>
                   <option value="IN043">IN043 - Densidade Demográfica na Área Urbana</option>
                   <option value="IN044">IN044 - Densidade de Domicílios na Área Urbana</option>
                   <option value="IN001">IN001 - Participação do Pessoal Próprio Sobre o Total de Pessoal Alocado nos Serviços de Drenagem e Manejo das Águas Pluviais Urbanas</option>
                   <option value="IN006">IN006 - Receita Operacional Média do Serviço por Unidades Tributadas</option>
                   <option value="IN010">IN006 - Despesa per capita com manejo de rsu em relação à população urbana</option>
                   <option value="IN050">IN050 - Diferença relativa entre despesas e receitas de Drenagem e Manejo de Águas Pluviais urbanas</option>
                   <option value="IN054">IN054 - Investimentos totais desembolsados em relação aos investimentos totais contratados</option>
                   <option value="IN005">IN005 - Taxa Média Praticada para os Serviços de Drenagem e Manejo das Águas Pluviais Urbanas</option>
                   <option value="IN009">IN009 - Despesa Média Praticada para os Serviços de Drenagem e Manejo das Águas Pluviais Urbanas</option>
                   <option value="IN048">IN048 - Despesa per capita com serviços de Drenagem e Manejo das Águas Pluviais Urbanas</option>
                   <option value="IN053">IN053 - Desembolso de investimentos per capta</option>
                   <option value="IN020">IN020 - Taxa de Cobertura de Pavimentação e Meio-Fio na Área Urbana do Município</option>
                   <option value="IN021">IN021 - Taxa de cobertura de vias públicas com redes ou canais pluviais subterrâneos na área urbana</option>
                   <option value="IN025">IN025 - Parcela de Cursos d’Água Naturais Perenes em Área Urbana com Parques Lineares</option>
                   <option value="IN026">IN026 - Parcela de Cursos d’Água Naturais Perenes com Canalização Aberta</option>
                   <option value="IN027">IN027 - Parcela de Cursos d’Água Naturais Perenes com Canalização Fechada</option>
                   <option value="IN029">IN029 - Parcela de Cursos d’Água Naturais Perenes com Diques</option>
                   <option value="IN035">IN035 - Volume de reservação de águas pluviais por unidade de área urbana</option>
                   <option value="IN051">IN051 - Densidade de captações de águas pluviais na área urbana</option>
                   <option value="IN040">IN040 - Parcela de Domicílios em Situação de Risco de Inundação</option>
                   <option value="IN041">IN041 - Parcela da População Impactada por Eventos Hidrológicos</option>
                   <option value="IN046">IN046 - Índice de Óbitos</option>
                   <option value="IN047">IN047 - Habitantes Realocados em Decorrência de Eventos Hidrológicos</option>
                                
                </select>
                </td>
                <td> <SubmitButton type="submit">Buscar</SubmitButton></td>
              </tr>
             </tbody>
            </table> 

            <Chart
              chartType="LineChart"
              data={data}
              options={options}
              width={"100%"}
              height={"500px"}
            />        
            
            
          </DivForm>
         
        </Form>
     
  );
}
