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
    IN001(data)
  },[])

  async function getMunucipios(){
    await api.get('getMunicipios').then(response=>{
      setMunicipios(response.data)
    }).catch((error)=>{
      console.log(error);
      
    })
  }

  function handleIndicador(data){       
   if(data.indicador == 'IN001'){
    IN001(data)
   }

   if(data.indicador == 'IN002'){
    IN002(data)
   }
   if(data.indicador == 'IN003'){
    IN003(data)
   }
   if(data.indicador == 'IN004'){
    IN004(data)
   }
   if(data.indicador == 'IN005'){
    IN005(data)
   }
   if(data.indicador == 'IN006'){
    IN006(data)
   }
   if(data.indicador == 'IN007'){
    IN007(data)
   }
   if(data.indicador == 'IN008'){
    IN008(data)
   }
   if(data.indicador == 'IN010'){
    IN010(data)
   }
   if(data.indicador == 'IN011'){
    IN011(data)
   }
   if(data.indicador == 'IN014'){
    IN014(data)
   }
   if(data.indicador == 'IN015'){
    IN015(data)
   }
   if(data.indicador == 'IN016'){
    IN016(data)
   }
   if(data.indicador == 'IN017'){
    IN017(data)
   }
   if(data.indicador == 'IN018'){
    IN018(data)
   }
   if(data.indicador == 'IN019'){
    IN019(data)
   }
   if(data.indicador == 'IN021'){
    IN021(data)
   }
   if(data.indicador == 'IN022'){
    IN022(data)
   }
   if(data.indicador == 'IN023'){
    IN023(data)
   }
   if(data.indicador == 'IN024'){
    IN024(data)
   }
   if(data.indicador == 'IN025'){
    IN025(data)
   }
   if(data.indicador == 'IN027'){
    IN027(data)
   }
   if(data.indicador == 'IN028'){
    IN028(data)
   }
   if(data.indicador == 'IN030'){
    IN030(data)
   }
   if(data.indicador == 'IN031'){
    IN031(data)
   }
   if(data.indicador == 'IN032'){
    IN032(data)
   }
   if(data.indicador == 'IN034'){
    IN034(data)
   }
   if(data.indicador == 'IN035'){
    IN035(data)
   }
   if(data.indicador == 'IN038'){
    IN038(data)
   }
   if(data.indicador == 'IN039'){
    IN039(data)
   }
   if(data.indicador == 'IN040'){
    IN040(data)
   }
   if(data.indicador == 'IN053'){
    IN053(data)
   }
   if(data.indicador == 'IN022'){
    IN054(data)
   }
   if(data.indicador == 'IN023'){
    IN036(data)
   }
   if(data.indicador == 'IN024'){
    IN037(data)
   }
   if(data.indicador == 'IN025'){
    IN041(data)
   }
   if(data.indicador == 'IN027'){
    IN042(data)
   }
   if(data.indicador == 'IN028'){
    IN043(data)
   }
   if(data.indicador == 'IN030'){
    IN044(data)
   }
   if(data.indicador == 'IN031'){
    IN045(data)
   }
   if(data.indicador == 'IN032'){
    IN046(data)
   }
   if(data.indicador == 'IN034'){
    IN047(data)
   }
   if(data.indicador == 'IN035'){
    IN048(data)
   }
   if(data.indicador == 'IN038'){
    IN051(data)
   }
   if(data.indicador == 'IN039'){
    IN052(data)
   }
   if(data.indicador == 'IN040'){
    IN026(data)
   }
   if(data.indicador == 'IN053'){
    IN029(data)
   }
  }


  async function IN001(data){  
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

  async function IN002(data){          
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

  async function IN003(data){          
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

  async function IN004(data){          
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

  async function IN005(data){          
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

  async function IN006(data){     
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

  async function IN007(data){  
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

  async function IN008(data){  
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

  async function IN010(data){  
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

  async function IN011(data){     
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

  async function IN014(data){     
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

  async function IN015(data){     
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

  async function IN016(data){     
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

  async function IN017(data){     
    
    const rsRc = await api.post('getPsResiduosColeta', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })    
    
    const CO117 = rsRc?.co117
    const CS048 = rsRc?.cs048
    const CO142 = rsRc?.co142
    const CO116 = rsRc?.co116
    const result = (CO117 + CS048 + CO142) / (CO116 + CO117 + CS048 + CO142) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN018(data){     
    
    const rsRc = await api.post('getPsResiduosColeta', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })    
    
    const CO117 = rsRc?.co117    
    const CO116 = rsRc?.co116
    const TB001 = rsRc?.tb001
    const TB002 = rsRc?.tb002
    const result = (CO117 + CO116) / (TB001 + TB002) * (1000 / 313)
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN019(data){     
    const rsDd = await api.get('getMunicipio', {params: {id_municipio: data.id_municipio}})
    .then(response=>{ return response.data[0] })
    const rsRc = await api.post('getPsResiduosColeta', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })    
    
    
    const TB001 = rsRc?.tb001
    const TB002 = rsRc?.tb002
    const POP_URB = rsDd?.dd_populacao_urbana
    const result = (TB001 + TB002) / POP_URB * 1000
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN021(data){     
    const rsDd = await api.get('getMunicipio', {params: {id_municipio: data.id_municipio}})
    .then(response=>{ return response.data[0] })
    const rsRc = await api.post('getPsResiduosColeta', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] }) 
    
    const CO117 = rsRc?.co117    
    const CO116 = rsRc?.co116
    const CS048 = rsRc?.cs048
    const CO142 = rsRc?.co142
    const POP_URB = rsDd?.dd_populacao_urbana
    const result = (CO116 + CO117 + CS048 + CO142) / POP_URB * 1000 / 365
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN022(data){     
    const rsDd = await api.get('getMunicipio', {params: {id_municipio: data.id_municipio}})
    .then(response=>{ return response.data[0] })
    const rsRc = await api.post('getPsResiduosColeta', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] }) 
    
    const CO117 = rsRc?.co117    
    const CO116 = rsRc?.co116
    const CS048 = rsRc?.cs048
    const CO142 = rsRc?.co142
    const POP_URB = rsDd?.dd_populacao_urbana
    const result = ((CO116 + CO117 + CS048 + CO142) / POP_URB) * (1000 / 365)
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN023(data){     
    const rsRc = await api.post('getPsResiduosColeta', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })
    const rsFn = await api.post('getPsFinanceiro', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })    
    
    const CO117 = rsRc?.co117    
    const CO116 = rsRc?.co116
    const CS048 = rsRc?.cso48
    const FN206 = rsFn?.fn206
    const FN207 = rsFn?.fn207
    const result = (FN206 + FN207) / (CO116 + CO117 + CS048) 
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }
  async function IN024(data){     
   
    const rsFn = await api.post('getPsFinanceiro', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })    
    
    const FN206 = rsFn?.fn222
    const FN207 = rsFn?.fn207
    const FN218 = rsFn?.fn218
    const FN219 = rsFn?.fn219
    const result = (FN206 + FN207) / (FN218 + FN219) 
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN025(data){  
    const rsRsc = await api.post('getPsResiduosColeta', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    
    const TB001 = rsRsc?.tb001
    const TB002 = rsRsc?.tb002
    const TB013 = rsRsc?.tb013
    const TB014 = rsRsc?.tb014
    const result = (TB001 + TB002) / (TB013 + TB014) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN027(data){   
    const rsRc = await api.post('getPsResiduosColeta', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] }) 
    
    const CO108 = rsRc?.co108
    const CO109 = rsRc?.co109
    const CO112 = rsRc?.co112   
    const CO113 = rsRc?.co113
    const CS048 = rsRc?.cs048
    const CO140 = rsRc?.co140
    const CO141 = rsRc?.co141
    const result = (CO112 + CO113 + CO141) / (CO108 + CO109 + CS048 + CO140) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN028(data){   
    const rsRc = await api.post('getPsResiduosColeta', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] }) 
    
    const CO108 = rsRc?.co108
    const CO109 = rsRc?.co109
    const CO112 = rsRc?.co112   
    const CO113 = rsRc?.co113
    const CS048 = rsRc?.cs048
    const CO140 = rsRc?.co140
    const CO141 = rsRc?.co141
    const result = (CO112 + CO113 + CO141) / (CO108 + CO109 + CS048 + CO140) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN030(data){     
    const rsDd = await api.get('getMunicipio', {params: {id_municipio: data.id_municipio}})
    .then(response=>{ return response.data[0] })
    const rsGe = await api.post('get-geral', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })    
    
    const CS050 = rsGe?.cs050
    const POP_URB = rsDd?.dd_populacao_urbana
    const result = (CS050 / POP_URB) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN031(data){   
    const rsRc = await api.post('getPsResiduosColeta', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] }) 
    
    
    const CS009 = rsRc?.cs009
    const CO116 = rsRc?.co116   
    const CO117 = rsRc?.co117
    const CS048 = rsRc?.cs048
    const CO142 = rsRc?.co142
    
    const result = (CS009) / (CO116 + CO117 + CS048 + CO142) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN032(data){   
    const rsDd = await api.get('getMunicipio', {params: {id_municipio: data.id_municipio}})
    .then(response=>{ return response.data[0] })
    const rsRc = await api.post('getPsResiduosColeta', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] }) 
    const CS009 = rsRc?.cs009
    const POP_URB = rsDd?.dd_populacao_urbana    
    const result = (CS009 / POP_URB) * 1000
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN034(data){   
    const rsRc = await api.post('getPsResiduosColeta', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] }) 
    const CS009 = rsRc?.cs009
    const CS010 = rsRc?.cs010
   
    const result = (CS010 / CS009) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN035(data){   
    const rsRc = await api.post('getPsResiduosColeta', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] }) 
    const CS009 = rsRc?.cs009
    const CS011 = rsRc?.cs011
   
    const result = (CS011 / CS009) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN038(data){   
    const rsRc = await api.post('getPsResiduosColeta', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] }) 
    const CS009 = rsRc?.cs009
    const CS012 = rsRc?.cs012
   
    const result = (CS012 / CS009) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN039(data){   
    const rsRc = await api.post('getPsResiduosColeta', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] }) 
    const CS009 = rsRc?.cs009
    const CS012 = rsRc?.cs012
   
    const result = (CS012 / CS009) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN040(data){   
    const rsRc = await api.post('getPsResiduosColeta', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] }) 
    const CS009 = rsRc?.cs009
    const CS014 = rsRc?.cs014
   
    const result = (CS014 / CS009) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN053(data){   
    const rsRc = await api.post('getPsResiduosColeta', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] }) 
    
    const CO108 = rsRc?.co108
    const CO109 = rsRc?.co109
    const CS026 = rsRc?.cs026
    const CS048 = rsRc?.cs048
    const CO140 = rsRc?.co140
    const result = (CS026 / CO108 + CO109 + CS048 + CO140) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN054(data){   
    const rsDd = await api.get('getMunicipio', {params: {id_municipio: data.id_municipio}})
    .then(response=>{ return response.data[0] })
    const rsRc = await api.post('getPsResiduosColeta', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] }) 
    const CS026 = rsRc?.cs026
    const POP_URB = rsDd?.dd_populacao_urbana    
    const result = (CS026 / POP_URB) * 1000
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN036(data){   
    const rsDd = await api.get('getMunicipio', {params: {id_municipio: data.id_municipio}})
    .then(response=>{ return response.data[0] })
    const rsRc = await api.post('getPsResiduosColeta', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] }) 
    const RS044 = rsRc?.rs044
    const POP_URB = rsDd?.dd_populacao_urbana    
    const result = (RS044 / POP_URB) * (1000000 / 365)
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN037(data){  
    const rsRc = await api.post('getPsResiduosColeta', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] }) 
    const RS044 = rsRc?.rs044
    const CO116 = rsRc?.co116
    const CO117 = rsRc?.co117    
    const CS048 = rsRc?.cs048
    const CO142 = rsRc?.co142   
    const result = (RS044 / CO116 + CO117 + CS048 + CO142) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN041(data){  
    const rsRsc = await api.post('getPsResiduosColeta', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    
    const TB003 = rsRsc?.tb003
    const TB004 = rsRsc?.tb004   
    const result = (TB004 / (TB003 + TB004)) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN042(data){  
    const rsRsc = await api.post('getPsResiduosColeta', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    
    const VA011 = rsRsc?.va011
    const VA039 = rsRsc?.va039   
    const result = (VA011 / VA039) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN043(data){ 
    const rsRsc = await api.post('getPsResiduosColeta', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] }) 
    const rsFin = await api.post('getPsFinanceiro', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    
    const FN212 = rsFin?.fn212
    const FN213 = rsFin?.fn213  
    const VA039 = rsRsc?.va039   
    const result = ((FN212 + FN213) / VA039)
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN044(data){  
    const rsRsc = await api.post('getPsResiduosColeta', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })

    const VA039 = rsRsc?.va039 
    const TB003 = rsRsc?.tb003
    const TB004 = rsRsc?.tb004     
    const result = (VA039 / (TB003 + TB004)) * (1 / 313)
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN045(data){  
    const rsDd = await api.get('getMunicipio', {params: {id_municipio: data.id_municipio}})
    .then(response=>{ return response.data[0] })
    const rsRsc = await api.post('getPsResiduosColeta', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })

    const TB003 = rsRsc?.tb003
    const TB004 = rsRsc?.tb004 
    const POP_URB = rsDd?.dd_populacao_urbana      
    const result = ((TB003 + TB004) / POP_URB) * 1000
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN046(data){ 
   
    const rsFin = await api.post('getPsFinanceiro', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    
    const FN212 = rsFin?.fn212
    const FN213 = rsFin?.fn213  
    const FN218 = rsFin?.fn218
    const FN219 = rsFin?.fn219  
    const result = ((FN212 + FN213) / (FN218 + FN219)) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN047(data){  
  
    const rsRsc = await api.post('getPsResiduosColeta', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })

    const TB003 = rsRsc?.tb003
    const TB004 = rsRsc?.tb004
    const TB013 = rsRsc?.tb013
    const TB014 = rsRsc?.tb014     
    const result = ((TB003 + TB004) / (TB013 + TB014)) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN048(data){  
    const rsDd = await api.get('getMunicipio', {params: {id_municipio: data.id_municipio}})
    .then(response=>{ return response.data[0] })
    const rsRsc = await api.post('getPsResiduosColeta', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })

    const VA039 = rsRsc?.va039 
    const POP_URB = rsDd?.dd_populacao_urbana 
    const result = (VA039 / POP_URB)
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN051(data){  
    const rsDd = await api.get('getMunicipio', {params: {id_municipio: data.id_municipio}})
    .then(response=>{ return response.data[0] })
    const rsRsc = await api.post('getPsResiduosColeta', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })

    const TB005 = rsRsc?.tb005
    const TB006 = rsRsc?.tb006
    const POP_URB = rsDd?.dd_populacao_urbana 
    const result = ((TB005 + TB006) / POP_URB)
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN052(data){  
  
    const rsRsc = await api.post('getPsResiduosColeta', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })

    const TB005 = rsRsc?.tb005
    const TB006 = rsRsc?.tb006
    const TB013 = rsRsc?.tb013
    const TB014 = rsRsc?.tb014     
    const result = ((TB005 + TB006) / (TB013 + TB014)) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN026(data){   
    const rsRc = await api.post('getPsResiduosColeta', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] }) 
    
    const CO116 = rsRc?.co116
    const CO117 = rsRc?.co117
    const CC013 = rsRc?.cc013
    const CS048 = rsRc?.cs048
    const CO142 = rsRc?.co142
    const result = (CC013 / (CO116 + CO117 + CS048 + CO142)) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN029(data){   
    const rsDd = await api.get('getMunicipio', {params: {id_municipio: data.id_municipio}})
    .then(response=>{ return response.data[0] })
    const rsRsc = await api.post('getPsResiduosColeta', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    
    const CC013 = rsRsc?.cc013
    const CC014 = rsRsc?.cc014
    const CC015 = rsRsc?.cc014
    const POP_URB = rsDd?.dd_populacao_urbana
    const result = ((CC013 + CC014 + CC015) / POP_URB) * 1000
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
            <DivTituloFormResiduo>Resíduos Sólidos</DivTituloFormResiduo> 
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
                   <option value="IN001">IN001 - Taxa de empregados em relação à população urbana</option>
                   <option value="IN002">IN002 - Despesa média por empregado alocado nos serviços do manejo de rsu</option>
                   <option value="IN003">IN003 - Incidência das despesas com o manejo de rsu nas despesas correntes da prefeitura</option>
                   <option value="IN004">IN004 - Incidência das despesas com empresas contratadas para execução de serviços de manejo rsu nas despesas com manejo de rsu</option>
                   <option value="IN005">IN005 - Auto-suficiência financeira da prefeitura com o manejo de rsu</option>
                   <option value="IN006">IN006 - Despesa per capita com manejo de rsu em relação à população urbana</option>
                   <option value="IN007">IN007 - Incidência de empregados próprios no total de empregados no manejo de rsu</option>
                   <option value="IN008">IN008 - Incidência de empregados de empresas contratadas no total de empregados no manejo de rsu</option>
                   <option value="IN010">IN010 - Incidência de empregados gerenciais e administrativos no total de empregados no manejo de rsu</option>
                   <option value="IN011">IN011 - Receita arrecadada per capita com taxas ou outras formas de cobrança pela prestação de serviços de manejo rsu</option>
                   <option value="IN014">IN014 - Taxa de cobertura do serviço de coleta domiciliar direta (porta-a-porta) da população urbana do município.</option>
                   <option value="IN015">IN015 - Taxa de cobertura regular do serviço de coleta de rdo em relação à população total do município</option>
                   <option value="IN016">IN016 - Taxa de cobertura regular do serviço de coleta de rdo em relação à população urbana</option>
                   <option value="IN017">IN017 - Taxa de terceirização do serviço de coleta de (rdo + rpu) em relação à quantidade coletada</option>
                   <option value="IN018">IN018 - Produtividade média dos empregados na coleta (coletadores + motoristas) na coleta (rdo + rpu) em relação à massa coletada</option>
                   <option value="IN019">IN019 - Taxa de empregados (coletadores + motoristas) na coleta (rdo + rpu) em relação à população urbana</option>
                   <option value="IN021">IN021 - Massa coletada (rdo + rpu) per capita em relação à população urbana</option>
                   <option value="IN022">IN022 - Massa (rdo) coletada per capita em relação à população atendida com serviço de coleta</option>
                   <option value="IN023">IN023 - Custo unitário médio do serviço de coleta (rdo + rpu)</option>
                   <option value="IN024">IN024 - Incidência do custo do serviço de coleta (rdo + rpu) no custo total do manejo de rsu</option>
                   <option value="IN025">IN025 - Incidência de (coletadores + motoristas) na quantidade total de empregados no manejo de rsu</option>
                   <option value="IN027">IN027 - Taxa da quantidade total coletada de resíduos públicos (rpu) em relação à quantidade total coletada de resíduos sólidos domésticos (rdo)</option>
                   <option value="IN028">IN028 - Massa de resíduos domiciliares e públicos (rdo+rpu) coletada per capita em relação à população total atendida pelo serviço de coleta</option>
                   <option value="IN030">IN030 - Taxa de cobertura do serviço de coleta seletiva porta-a-porta em relação à população urbana do município.</option>
                   <option value="IN031">IN031 - Taxa de recuperação de materiais recicláveis (exceto matéria orgânica e rejeitos) em relação à quantidade total (rdo + rpu) coletada</option>
                   <option value="IN032">IN032 - Massa recuperada per capita de materiais recicláveis (exceto matéria orgânica e rejeitos) em relação à população urbana</option>
                   <option value="IN034">IN034 - Incidência de papel e papelão no total de material recuperado</option>
                   <option value="IN035">IN035 - Incidência de plásticos no total de material recuperado</option>
                   <option value="IN038">IN038 - Incidência de metais no total de material recuperado</option>
                   <option value="IN039">IN039 - Incidência de vidros no total de material recuperado</option>
                   <option value="IN040">IN040 - Incidência de outros materiais (exceto papel, plástico, metais e vidros) no total de material recuperado</option>
                   <option value="IN053">IN053 - Taxa de material recolhido pela coleta seletiva (exceto mat. orgânica) em relação à quantidade total coletada de resíduos sól. domésticos</option>
                   <option value="IN054">IN054 - Massa per capita de materiais recicláveis recolhidos via coleta seletiva</option>
                   <option value="IN036">IN036 - Massa de rss coletada per capita em relação à população urbana</option>
                   <option value="IN037">IN037 - Taxa de rss coletada em relação à quantidade total coletada</option>
                   <option value="IN041">IN041 - Taxa de terceirização dos varredores</option>
                   <option value="IN042">IN042 - Taxa de terceirização da extensão varrida</option>
                   <option value="IN044">IN044 - Produtividade média dos varredores (prefeitura + empresas contratadas)</option>
                   <option value="IN045">IN045 - Taxa de varredores em relação à população urbana</option>
                   <option value="IN046">IN046 - Incidência do custo do serviço de varrição no custo total com manejo de rsu</option>
                   <option value="IN047">IN047 - Incidência de varredores no total de empregados no manejo de rsu</option>
                   <option value="IN048">IN048 - Extensão total anual varrida per capita</option>
                   <option value="IN051">IN051 - Taxa de capinadores em relação à população urbana</option>
                   <option value="IN052">IN052 - Incidência de capinadores no total empregados no manejo de rsu</option>
                   <option value="IN026">IN026 - Taxa de resíduos sólidos da construção civil (rcc) coletada pela prefeitura em relação à quantidade total coletada</option>
                   <option value="IN029">IN029 - Massa de rcc per capita em relação à população urbana</option>
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
