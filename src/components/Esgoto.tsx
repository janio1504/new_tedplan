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

export default function Esgoto({ municipio }: MunicipioProps) {
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
   
   if(data.indicador == 'IN015'){
    IN015(data)
   }
   if(data.indicador == 'IN016'){
    IN016(data)
   }
   if(data.indicador == 'IN021'){
    IN021(data)
   }
   if(data.indicador == 'IN024'){
    IN024(data)
   }
   if(data.indicador == 'IN046'){
    IN046(data)
   }
   if(data.indicador == 'IN047'){
    IN047(data)
   }
   if(data.indicador == 'IN056'){
    IN056(data)
   }
   if(data.indicador == 'IN059'){
    IN059(data)
   }
   if(data.indicador == 'IN061'){
    IN061(data)
   }
   if(data.indicador == 'IN062'){
    IN062(data)
   }
   if(data.indicador == 'IN063'){
    IN063(data)
   }
   if(data.indicador == 'IN064'){
    IN064(data)
   }
   if(data.indicador == 'IN065'){
    IN065(data)
   }
   if(data.indicador == 'IN066'){
    IN066(data)
   }
   if(data.indicador == 'IN067'){
    IN067(data)
   }
   if(data.indicador == 'IN068'){
    IN068(data)
   }
   if(data.indicador == 'IN069'){
    IN069(data)
   }

  }


  async function IN015(data){  
    setTitle("Índice de coleta de esgoto")   
  
    const rsEs = await api.post('get-esgoto', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })

    const rsAg = await api.post('get-agua', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    
    const AG010 = rsAg?.ag010
    const AG019 = rsAg?.ag019
    const ES005 = rsEs?.es005

    const result = (ES005 / (AG010 - AG019)) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN016(data){          
    const rsEs = await api.post('get-esgoto', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    
    const ES005 = rsEs?.es005
    const ES006 = rsEs?.es006
    const ES013 = rsEs?.es013
    const ES014 = rsEs?.es014
    const ES015 = rsEs?.es015

    const result = ((ES006 + ES014 + ES015) / (ES005 + ES013)) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN021(data){          
    const rsEs = await api.post('get-esgoto', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })

    const ES004_ANO_ANTERIOR = 0
    const ES009_ANO_ANTERIOR = 0

    const ES004 = rsEs?.es004
    const ES009 = rsEs?.es009

    const MEDIA_ES004 = (ES004_ANO_ANTERIOR + ES004) / 2
    const MEDIA_ES009 = (ES009_ANO_ANTERIOR + ES009) / 2

    const result = (MEDIA_ES004 / MEDIA_ES009) * 1000
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  //NÃO HA ENTRADA DE DADOS NO SISTEMA PARA O CAMPO GE06a

  async function IN024(data){          
    const rsEs = await api.post('get-esgoto', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    
    const ES026 = rsEs?.es026
    const GE06a = 0

    const result = (ES026 / GE06a) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN046(data){          
    const rsEs = await api.post('get-esgoto', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    
    const rsAg = await api.post('get-agua', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    
    const AG010 = rsAg?.ag010
    const AG019 = rsAg?.ag019
    const ES006 = rsEs?.es006
    const ES015 = rsEs?.es015

    const result = ((ES006 + ES015) / (AG010 - AG019)) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }


  //NÃO HA ENTRADA DE DADOS NO SISTEMA PARA O CAMPO GE06b

  async function IN047(data){     
    const rsEs = await api.post('get-esgoto', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    
    const ES026 = rsEs?.es026
    const GE06b = 0

    const result = (ES026 / GE06b) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  //NÃO HA ENTRADA DE DADOS NO SISTEMA PARA O CAMPO GE012a

  async function IN056(data){  
    const rsEs = await api.post('get-esgoto', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    
    const ES001 = rsEs?.es001
    const GE012a = 0

    const result = (ES001 / GE012a) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN059(data){ 
    
    const rsEs = await api.post('get-esgoto', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    
    const ES028 = rsEs?.es028
    const ES005 = rsEs?.es005

    const result = (ES028 + ES005)
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN061(data){  
    const rsBl = await api.post('get-balanco', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    
    const BL001 = rsBl?.bl001
    const BL005 = rsBl?.bl005 

    const result = (BL001 / BL005)
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN062(data){     
    const rsBl = await api.post('get-balanco', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    
    const BL001 = rsBl?.bl001
    const BL003 = rsBl?.bl003
    const BL005 = rsBl?.bl005
    const BL010 = rsBl?.bl010

    const result = ((BL001 + BL010) / (BL010 + BL005))
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN063(data){     
    const rsBl = await api.post('get-balanco', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    
    const BL002 = rsBl?.bl002
    const BL003 = rsBl?.bl003
    const BL005 = rsBl?.bl005
    const BL008 = rsBl?.bl008

    const result = ((BL003 + BL005 + BL008) / (BL002))
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN064(data){     
    const rsBl = await api.post('get-balanco', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    
    const BL009 = rsBl?.bl009
    const BL007 = rsBl?.bl007

    const result = (BL009 / BL007) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN065(data){     
    const rsBl = await api.post('get-balanco', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    
    const BL004 = rsBl?.bl004
    const BL007 = rsBl?.bl007

    const result = (BL004 / BL007) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN066(data){     
    const rsBl = await api.post('get-balanco', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    
    const BL004 = rsBl?.bl004
    const BL006 = rsBl?.bl006

    const result = (BL004 / (BL006 - BL004)) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN067(data){     
    const rsBl = await api.post('get-balanco', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    
    const BL003 = rsBl?.bl003
    const BL005 = rsBl?.bl005

    const result = (BL003 / (BL003 + BL005)) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN068(data){     
    const rsBl = await api.post('get-balanco', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    
    const BL007 = rsBl?.bl007
    const BL012 = rsBl?.bl012

    const result = (BL012 / BL007) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN069(data){     
    const rsBl = await api.post('get-balanco', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    
    const BL011 = rsBl?.bl011
    const BL007 = rsBl?.bl007

    const result = (BL011 / BL007) * 100
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
                   <option value="IN015">IN015 - Índice de coleta de esgoto</option>
                   <option value="IN016">IN016 - Índice de tratamento de esgoto</option>
                   <option value="IN021">IN021 - Extensão da rede de esgoto por ligação</option>
                   <option value="IN024">IN024 - Índice de atendimento urbano de esgoto referido aos municípios atendidos com água</option>
                   <option value="IN046">IN046 - Índice de esgoto tratado referido à água consumida</option>
                   <option value="IN047">IN047 - Índice de atendimento urbano de esgoto referido aos municípios atendidos com esgoto</option>
                   <option value="IN056">IN007 - Incidência de empregados próprios no total de empregados no manejo de rsu</option>
                   <option value="IN059">IN059 - Índice de consumo de energia elétrica em sistemas de esgotamento sanitário</option>
                   <option value="IN061">IN061 - Liquidez corrente</option>
                   <option value="IN062">IN062 - Liquidez geral</option>
                   <option value="IN063">IN063 - Grau de endividamento</option>
                   <option value="IN064">IN064 - Margem operacional com depreciação</option>
                   <option value="IN065">IN065 - Margem líquida com depreciação</option>
                   <option value="IN066">IN066 - Retorno sobre o patrimônio líquido</option>
                   <option value="IN067">IN067 - Composição de exigibilidades</option>
                   <option value="IN068">IN068 - Margem operacional sem depreciação</option>
                   <option value="IN069">IN069 - Margem líquida sem depreciação</option>
                   <option value="IN071">IN071 - Economias atingidas por paralisações</option>
                   <option value="IN072">IN072 - Duração média das paralisações</option>
                   <option value="IN073">IN073 - Economias atingidas por intermitências</option>
                   <option value="IN074">IN074 - Duração média das intermitências</option>
                   <option value="IN075">IN075 - Incidência das análises de cloro residual fora do padrão</option>
                   <option value="IN076">IN076 - Incidência das análises de turbidez fora do padrão</option>
                   <option value="IN077">IN077 - Duração média dos reparos de extravasamentos de esgotos</option>
                   <option value="IN079">IN079 - Índice de conformidade da quantidade de amostras - cloro residual</option>
                   <option value="IN080">IN080 - Índice de conformidade da quantidade de amostras - turbidez</option>
                   <option value="IN082">IN082 - Extravasamentos de esgotos por extensão de rede</option>
                   <option value="IN083">IN083 - Duração média dos serviços executados</option>
                   <option value="IN084">IN084 - Incidência das análises de coliformes totais fora do padrão</option>
                   <option value="IN085">IN085 - Índice de conformidade da quantidade de amostras - coliformes totais</option>

                
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
