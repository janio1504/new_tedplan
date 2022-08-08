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

export default function ResiduosSolidos({ municipio }: MunicipioProps) {
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
    txEmpregPopUrb(data)
  },[])

  async function getMunucipios(){
    await api.get('getMunicipios').then(response=>{
      setMunicipios(response.data)
    }).catch((error)=>{
      console.log(error);
      
    })
  }

  function handleIndicador(data){       
   if(data.indicador == 'txEmpregPopUrb'){
    txEmpregPopUrb(data)
   }

   if(data.indicador == 'despMediaEmprAlocadosServManejoRSU'){
    despMediaEmprAlocadosServManejoRSU(data)
   }
   if(data.indicador == 'incidenciaDespManejoRSUDespCorrentePref'){
    incidenciaDespManejoRSUDespCorrentePref(data)
   }
   if(data.indicador == 'incidenciaDespEmprContratadasExecServManejoRsu'){
    incidenciaDespEmprContratadasExecServManejoRsu(data)
   }
   if(data.indicador == 'autoSufienciaFincPrefManejoRSU'){
    autoSufienciaFincPrefManejoRSU(data)
   }
   if(data.indicador == 'despPerCaptaManejoRSURelacaoPopurb'){
    despPerCaptaManejoRSURelacaoPopurb(data)
   }
   if(data.indicador == 'incidenciaEmpregadosPropriosTotalManejoRSU'){
    incidenciaEmpregadosPropriosTotalManejoRSU(data)
   }
   if(data.indicador == 'incidenciaEmpregadosEmpreContradaTotalManejoRSU'){
    incidenciaEmpregadosEmpreContradaTotalManejoRSU(data)
   }
   if(data.indicador == 'incidenciaEmpregadosGerenciasAdmistrativosTotalEmpregadosManejoRSU'){
    incidenciaEmpregadosGerenciasAdmistrativosTotalEmpregadosManejoRSU(data)
   }
   if(data.indicador == 'receitaArrecadadaPercapitaOutrasFormasCobPrestServManejo'){
    receitaArrecadadaPercapitaOutrasFormasCobPrestServManejo(data)
   }
   if(data.indicador == 'taxaCoberturaServColetaDomiciliarPortaPortaPopUrbMun'){
    taxaCoberturaServColetaDomiciliarPortaPortaPopUrbMun(data)
   }
   if(data.indicador == 'taxaCoberturaRegServColetaRDOPopUrbMun'){
    taxaCoberturaRegServColetaRDOPopUrbMun(data)
   }
   if(data.indicador == 'taxaCoberturaRegServColetaRDORelacaoPopUrb'){
    taxaCoberturaRegServColetaRDORelacaoPopUrb(data)
   }
  }


  async function txEmpregPopUrb(data){  
    setTitle("Taxa de empregados em relação à população urbana")   
    const rsDd = await api.get('getMunicipio', {params: {id_municipio: data.id_municipio}})
    .then(response=>{ return response.data[0] })
    const rsRsc = await api.post('getPsResiduosColeta', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    
    const TB013 = rsRsc?.tb013
    const TB014 = rsRsc?.tb014
    const POP_URB = rsDd?.dd_populacao_urbana
    const result = (TB013 + TB014) / POP_URB * 1000
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function despMediaEmprAlocadosServManejoRSU(data){          
    const rsFn = await api.post('getPsFinanceiro', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })
    const rsRsc = await api.post('getPsResiduosColeta', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    
    const TB013 = rsRsc?.tb013
    const TB014 = rsRsc?.tb014
    const FN220 = rsFn?.fn220
    const result = (TB013 + TB014) / FN220
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function incidenciaDespManejoRSUDespCorrentePref(data){          
    const rsFn = await api.post('getPsFinanceiro', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })
    
    const FN220 = rsFn?.fn220
    const FN223 = rsFn?.fn223
    const result = (FN220 / FN223) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function incidenciaDespEmprContratadasExecServManejoRsu(data){          
    const rsFn = await api.post('getPsFinanceiro', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })
    
    const FN219 = rsFn?.fn219
    const FN220 = rsFn?.fn220
    const result = (FN220 / FN219) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function autoSufienciaFincPrefManejoRSU(data){          
    const rsFn = await api.post('getPsFinanceiro', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })
    
    const FN222 = rsFn?.fn222
    const FN220 = rsFn?.fn220
    const result = (FN220 / FN222) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function despPerCaptaManejoRSURelacaoPopurb(data){     
    const rsDd = await api.get('getMunicipio', {params: {id_municipio: data.id_municipio}})
    .then(response=>{ return response.data[0] })
    const rsFn = await api.post('getPsFinanceiro', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })    
    
    const FN220 = rsFn?.fn220
    const POP_URB = rsDd?.dd_populacao_urbana
    const result = FN220 / POP_URB 
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function incidenciaEmpregadosPropriosTotalManejoRSU(data){  
    const rsRsc = await api.post('getPsResiduosColeta', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    
    const TB013 = rsRsc?.tb013
    const TB014 = rsRsc?.tb014
    const result = (TB013 + TB014) / TB013 * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function incidenciaEmpregadosEmpreContradaTotalManejoRSU(data){  
    const rsRsc = await api.post('getPsResiduosColeta', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    
    const TB013 = rsRsc?.tb013
    const TB014 = rsRsc?.tb014
    const result = (TB013 + TB014) / TB014 * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function incidenciaEmpregadosGerenciasAdmistrativosTotalEmpregadosManejoRSU(data){  
    const rsRsc = await api.post('getPsResiduosColeta', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    
    const TB011 = rsRsc?.tb011
    const TB012 = rsRsc?.tb011
    const TB013 = rsRsc?.tb013
    const TB014 = rsRsc?.tb014
    const result = (TB011 + TB012) / (TB013 + TB014) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function receitaArrecadadaPercapitaOutrasFormasCobPrestServManejo(data){     
    const rsDd = await api.get('getMunicipio', {params: {id_municipio: data.id_municipio}})
    .then(response=>{ return response.data[0] })
    const rsFn = await api.post('getPsFinanceiro', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })    
    
    const FN222 = rsFn?.fn222
    const POP_URB = rsDd?.dd_populacao_urbana
    const result = FN222 / POP_URB 
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function taxaCoberturaServColetaDomiciliarPortaPortaPopUrbMun(data){     
    const rsDd = await api.get('getMunicipio', {params: {id_municipio: data.id_municipio}})
    .then(response=>{ return response.data[0] })
    const rsGe = await api.post('get-geral', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })    
    
    const CO165 = rsGe?.co165
    const POP_URB = rsDd?.dd_populacao_urbana
    const result = (CO165 / POP_URB) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function taxaCoberturaRegServColetaRDOPopUrbMun(data){     
    const rsDd = await api.get('getMunicipio', {params: {id_municipio: data.id_municipio}})
    .then(response=>{ return response.data[0] })
    const rsGe = await api.post('get-geral', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })    
    
    const CO164 = rsGe?.co164
    const POP_TOT = rsDd?.dd_populacao_total
    const result = (CO164 / POP_TOT) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function taxaCoberturaRegServColetaRDORelacaoPopUrb(data){     
    const rsDd = await api.get('getMunicipio', {params: {id_municipio: data.id_municipio}})
    .then(response=>{ return response.data[0] })
    const rsGe = await api.post('get-geral', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })    
    
    const CO050 = rsGe?.co050
    const POP_URB = rsDd?.dd_populacao_urbana
    const result = (CO050 / POP_URB) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function taxaTeceirizacaoServColetaRdoRpuQuantidadeColeta(data){     
    const rsDd = await api.get('getMunicipio', {params: {id_municipio: data.id_municipio}})
    .then(response=>{ return response.data[0] })
    const rsGe = await api.post('getPsResiduosColeta', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })    
    
    const CO050 = rsGe?.co050
    const CO051 = rsGe?.co050
    const CO052 = rsGe?.co050
    const CO053 = rsGe?.co050
    const POP_URB = rsDd?.dd_populacao_urbana
    const result = (CO050 / POP_URB) * 100
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
            <DivTituloFormResiduo>Esgoto</DivTituloFormResiduo> 
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
                   <option value="txEmpregPopUrb">IN001 - Taxa de empregados em relação à população urbana</option>
                   <option value="despMediaEmprAlocadosServManejoRSU">N002 - Despesa média por empregado alocado nos serviços do manejo de rsu</option>
                   <option value="incidenciaDespManejoRSUDespCorrentePref">IN003 - Incidência das despesas com o manejo de rsu nas despesas correntes da prefeitura</option>
                   <option value="incidenciaDespEmprContratadasExecServManejoRsu">004 - Incidência das despesas com empresas contratadas para execução de serviços de manejo rsu nas despesas com manejo de rsu</option>
                   <option value="autoSufienciaFincPrefManejoRSU">IN005 - Auto-suficiência financeira da prefeitura com o manejo de rsu</option>
                   <option value="despPerCaptaManejoRSURelacaoPopurb">IN006 - Despesa per capita com manejo de rsu em relação à população urbana</option>
                   <option value="incidenciaEmpregadosPropriosTotalManejoRSU">IN007 - Incidência de empregados próprios no total de empregados no manejo de rsu</option>
                   <option value="incidenciaEmpregadosEmpreContradaTotalManejoRSU">IN008 - Incidência de empregados de empresas contratadas no total de empregados no manejo de rsu</option>
                   <option value="incidenciaEmpregadosGerenciasAdmistrativosTotalEmpregadosManejoRSU">IN010 - Incidência de empregados gerenciais e administrativos no total de empregados no manejo de rsu</option>
                   <option value="receitaArrecadadaPercapitaOutrasFormasCobPrestServManejo">IN011 - Receita arrecadada per capita com taxas ou outras formas de cobrança pela prestação de serviços de manejo rsu</option>
                   <option value="taxaCoberturaServColetaDomiciliarPortaPortaPopUrbMun">IN014 - Taxa de cobertura do serviço de coleta domiciliar direta (porta-a-porta) da população urbana do município.</option>
                   <option value="taxaCoberturaRegServColetaRDOPopUrbMun">IN015 - Taxa de cobertura regular do serviço de coleta de rdo em relação à população total do município</option>
                   <option value="taxaCoberturaRegServColetaRDORelacaoPopUrb">IN016 - Taxa de cobertura regular do serviço de coleta de rdo em relação à população urbana</option>
                   <option value=""></option>
                   <option value=""></option>
                   <option value=""></option>
                   <option value=""></option>
                   <option value=""></option>
                   <option value=""></option>

                
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
