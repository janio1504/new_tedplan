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

export default function Agua({ municipio }: MunicipioProps) {
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
    IN002(data)
  },[])

  async function getMunucipios(){
    await api.get('getMunicipios').then(response=>{
      setMunicipios(response.data)
    }).catch((error)=>{
      console.log(error);
      
    })
  }

  function handleIndicador(data){       
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
     if(data.indicador == 'IN006'){
      IN007(data)
     }
     if(data.indicador == 'IN008'){
      IN008(data)
     }
     if(data.indicador == 'IN012'){
      IN012(data)
     }
     if(data.indicador == 'IN018'){
      IN018(data)
     }
     if(data.indicador == 'IN019'){
      IN019(data)
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
     if(data.indicador == 'IN030'){
      IN030(data)
     }
     if(data.indicador == 'IN031'){
      IN031(data)
     }
     if(data.indicador == 'IN032'){
      IN032(data)
     }
     if(data.indicador == 'IN033'){
      IN033(data)
     }
     if(data.indicador == 'IN034'){
      IN034(data)
     }
     if(data.indicador == 'IN035'){
      IN035(data)
     }
     if(data.indicador == 'IN036'){
      IN036(data)
     }
     if(data.indicador == 'IN037'){
      IN037(data)
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
     if(data.indicador == 'IN041'){
      IN041(data)
     }
     if(data.indicador == 'IN042'){
      IN042(data)
     }
     if(data.indicador == 'IN045'){
      IN045(data)
     }
     if(data.indicador == 'IN048'){
      IN048(data)
     }
     if(data.indicador == 'IN054'){
      IN054(data)
     }
     if(data.indicador == 'IN060'){
      IN060(data)
     }
     if(data.indicador == 'IN101'){
      IN101(data)
     }
     if(data.indicador == 'IN102'){
      IN102(data)
     }
     if(data.indicador == 'IN001'){
      IN001(data)
     }
     if(data.indicador == 'IN009'){
      IN009(data)
     }
     if(data.indicador == 'IN010'){
      IN010(data)
     }
     if(data.indicador == 'IN011'){
      IN011(data)
     }
     if(data.indicador == 'IN013'){
      IN013(data)
     }
     if(data.indicador == 'IN014'){
      IN014(data)
     }
     if(data.indicador == 'IN017'){
      IN017(data)
     }
     if(data.indicador == 'IN020'){
      IN020(data)
     }
     if(data.indicador == 'IN022'){
      IN022(data)
     }
     if(data.indicador == 'IN023'){
      IN023(data)
     }
     if(data.indicador == 'IN025'){
      IN025(data)
     }
     if(data.indicador == 'IN028'){
      IN028(data)
     }
     if(data.indicador == 'IN043'){
      IN043(data)
     }
     if(data.indicador == 'IN044'){
      IN044(data)
     }
     if(data.indicador == 'IN049'){
      IN049(data)
     }
     if(data.indicador == 'IN050'){
      IN050(data)
     }
     if(data.indicador == 'IN051'){
      IN051(data)
     }
     if(data.indicador == 'IN052'){
      IN052(data)
     }
     if(data.indicador == 'IN053'){
      IN053(data)
     }
     if(data.indicador == 'IN055'){
      IN055(data)
     }
     if(data.indicador == 'IN057'){
      IN057(data)
     }
     if(data.indicador == 'IN058'){
      IN058(data)
     }
  }


  async function IN002(data){          
    const rsGe = await api.post('get-geral', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })
    const rsRa = await api.post('get-agua', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    const rsRe = await api.post('get-esgoto', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    
    const AG003 = rsRa?.ag003
    const ES003 = rsRe?.es003
    const FN026 = rsGe?.fn026
    const result = (AG003 + ES003) / FN026
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
    const rsRa = await api.post('get-agua', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    const rsRe = await api.post('get-esgoto', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    
    const FN017 = rsFn?.fn017
    const AG011 = rsRa?.ag011
    const ES007 = rsRe?.es007
    const result = (FN017 / (AG011 + ES007)) * (1 * 1000)
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
    const rsRa = await api.post('get-agua', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    const rsRe = await api.post('get-esgoto', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    
    const FN001 = rsFn?.fn001
    const AG011 = rsRa?.ag011
    const ES007 = rsRe?.es007
    const result = (FN001 / (AG011 + ES007)) * (1 * 1000)
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
    const rsRa = await api.post('get-agua', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })   
    
    const FN002 = rsFn?.fn002
    const AG011 = rsRa?.ag011
    const AG017 = rsRa?.ag017
    const AG019 = rsRa?.ag019
    const result = (FN002 / (AG011 - AG011 - AG017 - AG019)) * (1 * 1000)
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
    const rsRe = await api.post('get-esgoto', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    
    const FN003 = rsFn?.fn003
    const ES007 = rsRe?.es007
    const ES013 = rsRe?.es013    
    const result = (FN003 / (ES007 - ES013)) * (1 / 1000)
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN007(data){          
    const rsFn = await api.post('getPsFinanceiro', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })   
    
    const FN010 = rsFn?.fn010
    const FN014 = rsFn?.fn014
    const FN017 = rsFn?.fn017
    const result = ((FN010 + FN014) / FN017) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN008(data){    
    const rsGe = await api.post('get-geral', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })      
    const rsFn = await api.post('getPsFinanceiro', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })   
    const FN026_ANO_ANTERIOR = 0  
    
    const FN010 = rsFn?.fn010
    const FN026 = rsGe?.fn026
    const MEDIA = (FN026_ANO_ANTERIOR + FN026) / 2
    const result = (FN010 / MEDIA)
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN012(data){          
    const rsFn = await api.post('getPsFinanceiro', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] }) 
    const FN001 = rsFn?.fn001
    const FN017 = rsFn?.fn017
    const result = (FN001 / FN017) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN018(data){  
    const rsGe = await api.post('get-geral', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })         
    const rsFn = await api.post('getPsFinanceiro', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] }) 
    const FN026_ANO_ANTERIOR = 0
    const FN026 = rsGe?.fn026
    const MEDIA = (FN026_ANO_ANTERIOR + FN026) / 2

    const FN010 = rsFn?.fn010
    const FN014 = rsFn?.fn014
    const result = MEDIA + ((FN014 * MEDIA) / FN010)
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
    return result
  }

  async function IN019(data){  
    const rsFn = await api.post('getPsFinanceiro', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })   
    const rsRa = await api.post('get-agua', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    const rsRe = await api.post('get-esgoto', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    const ES003_ANO_ANTERIOR = 0
    const AG003_ANO_ANTERIOR = 0

    const AG003 = rsRa?.ag003
    const ES003 = rsRe?.es003

    const MEDIA_AG003 = (AG003_ANO_ANTERIOR + AG003) / 2
    const MEDIA_ES003 = (ES003_ANO_ANTERIOR + ES003) / 2    

    const in018 = await IN018(rsFn)
    
    const result = ((MEDIA_AG003 + MEDIA_ES003) / in018)
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN026(data){          
    const rsFn = await api.post('getPsFinanceiro', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })
    const rsRa = await api.post('get-agua', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    const rsRe = await api.post('get-esgoto', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    
    const FN015 = rsFn?.fn015
    const AG011 = rsRa?.ag011
    const ES007 = rsRe?.es007
    const result = (FN015 / (AG011 + ES007)) * (1 / 1000)
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN027(data){          
    const rsFn = await api.post('getPsFinanceiro', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })
    const rsRa = await api.post('get-agua', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    const rsRe = await api.post('get-esgoto', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    
    const FN015 = rsFn?.fn015
    const AG003 = rsRa?.ag003
    const ES003 = rsRe?.es003
    const result = (FN015 / (AG003 + ES003))
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN029(data){          
    const rsFn = await api.post('getPsFinanceiro', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })
       
    const FN005 = rsFn?.fn005
    const FN006 = rsFn?.fn006
    const result = ((FN005 - FN006) / FN005) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN030(data){          
    const rsFn = await api.post('getPsFinanceiro', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })
       
    const FN015 = rsFn?.fn015
    const FN001 = rsFn?.fn001
    const result = (FN015 / FN001) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN031(data){          
    const rsFn = await api.post('getPsFinanceiro', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })
       
    const FN010 = rsFn?.fn010
    const FN001 = rsFn?.fn001
    const result = (FN010 / FN001) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN032(data){          
    const rsFn = await api.post('getPsFinanceiro', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })
       
    const FN014 = rsFn?.fn014
    const FN010 = rsFn?.fn010
    const FN001 = rsFn?.fn001
    const result = ((FN010 + FN014) / FN001) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN033(data){          
    const rsFn = await api.post('getPsFinanceiro', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })
       
    const FN016 = rsFn?.fn016
    const FN034 = rsFn?.fn034
    const FN001 = rsFn?.fn001
    const result = ((FN016 + FN034) / FN001) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN034(data){          
    const rsFn = await api.post('getPsFinanceiro', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })

    const FN027 = rsFn?.fn027
    const FN001 = rsFn?.fn001
    const result = (FN027 / FN001) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN035(data){          
    const rsFn = await api.post('getPsFinanceiro', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })

    const FN010 = rsFn?.fn010
    const FN015 = rsFn?.fn015
    const result = (FN010 / FN015) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN036(data){          
    const rsFn = await api.post('getPsFinanceiro', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })

    const FN010 = rsFn?.fn010
    const FN014 = rsFn?.fn014
    const FN015 = rsFn?.fn015
    const result = ((FN010 + FN014) / FN015) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN037(data){          
    const rsFn = await api.post('getPsFinanceiro', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })

    const FN013 = rsFn?.fn013
    const FN015 = rsFn?.fn015
    const result = (FN013 / FN015) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN038(data){          
    const rsFn = await api.post('getPsFinanceiro', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })

    const FN011 = rsFn?.fn011
    const FN015 = rsFn?.fn015
    const result = (FN011 / FN015) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN039(data){          
    const rsFn = await api.post('getPsFinanceiro', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })

    const FN027 = rsFn?.fn027
    const FN015 = rsFn?.fn015
    const result = (FN027 / FN015) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN040(data){          
    const rsFn = await api.post('getPsFinanceiro', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })

    const FN002 = rsFn?.fn002
    const FN005 = rsFn?.fn005
    const FN007 = rsFn?.fn007
    const result = ((FN002 + FN007) / FN005) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN041(data){          
    const rsFn = await api.post('getPsFinanceiro', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })

    const FN003 = rsFn?.fn003
    const FN005 = rsFn?.fn005
    const FN038 = rsFn?.fn038
    const result = ((FN003 + FN038) / FN005) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN042(data){          
    const rsFn = await api.post('getPsFinanceiro', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })

    const FN001 = rsFn?.fn001
    const FN005 = rsFn?.fn005
    const result = ((FN005 - FN001) / FN005) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN045(data){  
   
    const rsRa = await api.post('get-agua', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    const rsGe = await api.post('get-geral', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    const FN026_ANO_ANTERIOR = 0
    const AG002_ANO_ANTERIOR = 0

    const AG002 = rsRa?.ag002
    const FN026 = rsGe?.fn026

    const MEDIA_AG002 = (AG002_ANO_ANTERIOR + AG002) / 2
    const MEDIA_FN026 = (FN026_ANO_ANTERIOR + FN026) / 2   
    
    const result = ((MEDIA_AG002 / MEDIA_FN026) / 1000)
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN048(data){
    const rsRe = await api.post('get-esgoto', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })  
    const rsRa = await api.post('get-agua', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    const rsGe = await api.post('get-geral', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    const FN026_ANO_ANTERIOR = 0
    const AG002_ANO_ANTERIOR = 0
    const ES002_ANO_ANTERIOR = 0

    const AG002 = rsRa?.ag002
    const FN026 = rsGe?.fn026
    const ES002 = rsRe?.es002

    const MEDIA_AG002 = (AG002_ANO_ANTERIOR + AG002) / 2
    const MEDIA_FN026 = (FN026_ANO_ANTERIOR + FN026) / 2
    const MEDIA_ES002 = (ES002_ANO_ANTERIOR + ES002) / 2   
    
    const result = ((MEDIA_FN026 / (MEDIA_AG002 + MEDIA_ES002)) / 1000)
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

    const FN008 = rsFn?.fn008
    const FN005 = rsFn?.fn005
    const result = (FN008 / FN005) * 360
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN060(data){          
    const rsFn = await api.post('getPsFinanceiro', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })
    const rsRa = await api.post('get-agua', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    const rsRe = await api.post('get-esgoto', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    
    const FN013 = rsFn?.fn013
    const AG028 = rsRa?.ag028
    const ES028 = rsRe?.es028
    const result = (FN013 / (AG028 + ES028)) * (1 / 1000)
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN101(data){          
    const rsFn = await api.post('getPsFinanceiro', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })

    const FN006 = rsFn?.fn006
    const FN015 = rsFn?.fn015
    const FN016 = rsFn?.fn016
    const FN022 = rsFn?.fn022
    const FN034 = rsFn?.fn034
    const result = (FN006 / (FN015 + FN034 + FN016 + FN022)) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN102(data){  
    const rsFn = await api.post('getPsFinanceiro', {id_municipio: data.id_municipio, ano: data.ano })
    .then(response=>{ return response.data[0] })   
    const rsRa = await api.post('get-agua', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    const rsRe = await api.post('get-esgoto', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    const ES002_ANO_ANTERIOR = 0
    const AG002_ANO_ANTERIOR = 0

    const AG002 = rsRa?.ag002
    const ES002 = rsRe?.es002

    const MEDIA_AG002 = (AG002_ANO_ANTERIOR + AG002) / 2
    const MEDIA_ES002 = (ES002_ANO_ANTERIOR + ES002) / 2    

    const in018 = await IN018(rsFn)
    
    const result = ((MEDIA_AG002 + MEDIA_ES002) / in018)
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN001(data){  
    
    const rsRa = await api.post('get-agua', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
   
    const AG002_ANO_ANTERIOR = 0
    const AG003_ANO_ANTERIOR = 0

    const AG002 = rsRa?.ag002
    const AG003 = rsRa?.ag003

    const MEDIA_AG002 = (AG002_ANO_ANTERIOR + AG002) / 2
    const MEDIA_AG003 = (AG003_ANO_ANTERIOR + AG003) / 2    
    
    const result = (MEDIA_AG002 + MEDIA_AG003)
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN009(data){  
    const rsRa = await api.post('get-agua', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
   
    const AG002_ANO_ANTERIOR = 0
    const AG004_ANO_ANTERIOR = 0

    const AG002 = rsRa?.ag002
    const AG004 = rsRa?.ag004

    const MEDIA_AG002 = (AG002_ANO_ANTERIOR + AG002) / 2
    const MEDIA_AG004 = (AG004_ANO_ANTERIOR + AG004) / 2    
    
    const result = (MEDIA_AG002 + MEDIA_AG004) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN010(data){  
    const rsRa = await api.post('get-agua', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
   
    const AG006 = rsRa?.ag006
    const AG008 = rsRa?.ag008
    const AG018 = rsRa?.ag018
    const AG019 = rsRa?.ag019
    const AG024 = rsRa?.ag024

    const result = (AG008 / (AG006 + AG018 - AG019 - AG024)) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN011(data){  
    const rsRa = await api.post('get-agua', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
   
    const AG006 = rsRa?.ag006
    const AG018 = rsRa?.ag018
    const AG019 = rsRa?.ag019
    const AG012 = rsRa?.ag012

    const result = (AG012 - AG019 / (AG006 + AG018 - AG019)) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN013(data){  
    const rsRa = await api.post('get-agua', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
   
    const AG006 = rsRa?.ag006
    const AG018 = rsRa?.ag018
    const AG011 = rsRa?.ag011
    const AG024 = rsRa?.ag024

    const result = ((AG006 + AG018 - AG011 - AG024) / (AG006 + AG018 - AG024)) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN014(data){  
    const rsRa = await api.post('get-agua', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    const AG014_ANO_ANTERIOR = 0
    const AG008 = rsRa?.ag008
    const AG014 = rsRa?.ag014

    const MEDIA_AG014 = (AG014_ANO_ANTERIOR + AG014) / 2
    const result = (AG008 / MEDIA_AG014) * (1000 / 12)
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN017(data){  
    const rsRa = await api.post('get-agua', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
    const AG003_ANO_ANTERIOR = 0
    const AG003 = rsRa?.ag003
    const AG011 = rsRa?.ag011
    const AG019 = rsRa?.ag019

    const MEDIA_AG003 = (AG003_ANO_ANTERIOR + AG003) / 2
    const result = ((AG011 - AG019) / MEDIA_AG003) * (1000 / 12)
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN020(data){  
    const rsRa = await api.post('get-agua', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
   
    const AG005_ANO_ANTERIOR = 0
    const AG021_ANO_ANTERIOR = 0

    const AG005 = rsRa?.ag005
    const AG021 = rsRa?.ag021

    const MEDIA_AG005 = (AG005_ANO_ANTERIOR + AG005) / 2
    const MEDIA_AG021 = (AG021_ANO_ANTERIOR + AG021) / 2    
    
    const result = (MEDIA_AG005 / MEDIA_AG021) * 1000
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN022(data){  
    const rsRa = await api.post('get-agua', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
   
    const AG001 = rsRa?.ag001
    const AG010 = rsRa?.ag010
    const AG019 = rsRa?.ag019
    
    const result = ((AG010 - AG019) / AG001) * (1000.000 / 365)
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN023(data){  
    const rsRa = await api.post('get-agua', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
   
    
    const AG026 = rsRa?.ag010
    const GE06a = rsRa?.ge06a
    
    const result = (GE06a/ AG026) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN025(data){  
    const rsRa = await api.post('get-agua', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
   
    const AG003_ANO_ANTERIOR = 0

    const AG003 = rsRa?.ag003
    const AG006 = rsRa?.ag006
    const AG018 = rsRa?.ag018
    const AG019 = rsRa?.ag019
    
    const MEDIA = (AG003_ANO_ANTERIOR + AG003) / 2

    const result = (((AG006 + AG018) - AG019) / MEDIA) * (1000 / 12)
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN028(data){  
    const rsRa = await api.post('get-agua', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
   
    const AG006 = rsRa?.ag006
    const AG011 = rsRa?.ag011
    const AG018 = rsRa?.ag018
    const AG024 = rsRa?.ag024
    
    const result = (AG011 / ((AG006 + AG018) - AG024)) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN043(data){  
    const rsRa = await api.post('get-agua', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
   
    const AG003_ANO_ANTERIOR = 0
    const AG013_ANO_ANTERIOR = 0

    const AG003 = rsRa?.ag003
    const AG013 = rsRa?.ag013

    const MEDIA_AG003 = (AG003_ANO_ANTERIOR + AG003) / 2
    const MEDIA_AG013 = (AG013_ANO_ANTERIOR + AG013) / 2
    
    const result = (MEDIA_AG003 / MEDIA_AG013) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN044(data){  
    const rsRa = await api.post('get-agua', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
   
    const AG008 = rsRa?.ag008
    const AG010 = rsRa?.ag010
    const AG019 = rsRa?.ag019
    
    const result = (AG008 / (AG010 - AG010)) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN049(data){  
    const rsRa = await api.post('get-agua', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
   
    const AG006 = rsRa?.ag006
    const AG010 = rsRa?.ag010
    const AG018 = rsRa?.ag018
    const AG024 = rsRa?.ag024
    
    const result = (((AG006 + AG018) - (AG010 - AG024)) / ((AG006 + AG018) - AG024))* 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN050(data){  
    const rsRa = await api.post('get-agua', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })

    const AG005_ANO_ANTERIOR = 0

    const AG005 = rsRa?.ag005
    const AG006 = rsRa?.ag006
    const AG010 = rsRa?.ag010
    const AG018 = rsRa?.ag018
    const AG024 = rsRa?.ag024

    const MEDIA_AG005 = (AG005_ANO_ANTERIOR + AG005) / 2 
    
    const result = (((AG006 + AG018) - (AG010 - AG024)) / MEDIA_AG005) * (1000 / 365)
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN051(data){  
    const rsRa = await api.post('get-agua', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })

    const AG002_ANO_ANTERIOR = 0

    const AG002 = rsRa?.ag002
    const AG006 = rsRa?.ag006
    const AG010 = rsRa?.ag010
    const AG018 = rsRa?.ag018
    const AG024 = rsRa?.ag024

    const MEDIA_AG002 = (AG002_ANO_ANTERIOR + AG002) / 2 
    
    const result = (((AG006 + AG018) - (AG010 - AG024)) / MEDIA_AG002) * (1000.000 / 365)
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN052(data){  
    const rsRa = await api.post('get-agua', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
   
    const AG006 = rsRa?.ag006
    const AG010 = rsRa?.ag010
    const AG018 = rsRa?.ag018
    const AG024 = rsRa?.ag024
    
    const result = ((AG010 / (AG006 + AG018)) - AG024) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN053(data){  
    const rsRa = await api.post('get-agua', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })

    const AG003_ANO_ANTERIOR = 0

    const AG003 = rsRa?.ag003
    const AG010 = rsRa?.ag010
    const AG019 = rsRa?.ag019

    const MEDIA_AG003 = (AG003_ANO_ANTERIOR + AG003) / 2 
    
    const result = ((AG010 - AG019) / MEDIA_AG003) * (1000 / 12)
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }


  // A FUNÇÃO NÃO TEM ENTRADA DE DADOS NO SISTEMA PARA OS CAMPOS GE12a E POP_TOT

  async function IN055(data){  
    const rsRa = await api.post('get-agua', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })

    const GE12a = 0
    const POP_TOT = 0

    const AG001 = rsRa?.ag001
    
    const result = (AG001 / GE12a) * 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN057(data){  
    const rsRa = await api.post('get-agua', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
   
    const AG006 = rsRa?.ag006
    const AG018 = rsRa?.ag018
    const AG027 = rsRa?.ag027
    
    const result = (AG027 / (AG006 + AG018))* 100
    const ano = data.ano
    const dados = [
      ['Ano', 'Dados'],
      [ano, result],
    ]
    setData(dados)
  }

  async function IN058(data){  
    const rsRa = await api.post('get-agua', {id_municipio: data.id_municipio, ano: data.ano})
    .then(response=>{ return response.data[0] })
   
    const AG006 = rsRa?.ag006
    const AG018 = rsRa?.ag018
    const AG028 = rsRa?.ag028
    
    const result = (AG028 / (AG006 + AG018))
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
            <DivTituloFormResiduo>Água</DivTituloFormResiduo> 
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
                   <option value="IN002">IN002 - Índice de produtividade: economias ativas por pessoal próprio</option>
                   <option value="IN003">IN003 - Despesa total com os serviços por m3 faturado</option>
                   <option value="IN004">IN004 - Tarifa média praticada</option>
                   <option value="IN005">IN005 - Tarifa média de água</option>
                   <option value="IN006">IN006 - Tarifa média de esgoto</option>
                   <option value="IN007">IN007 - Incidência da desp. de pessoal e de serv. de terc. nas despesas totais com os serviços</option>
                   <option value="IN008">IN008 - Despesa média anual por empregado</option>
                   <option value="IN012">IN012 - Indicador de desempenho financeiro</option>
                   <option value="IN018">IN018 - Quantidade equivalente de pessoal total</option>
                   <option value="IN019">IN019 - Índice de produtividade: economias ativas por pessoal total (equivalente)</option>
                   <option value="IN026">IN026 - Despesa de exploração por m3 faturado</option>
                   <option value="IN027">IN027 - Despesa de exploração por economia</option>
                   <option value="IN029">IN029 - Índice de evasão de receitas</option>
                   <option value="IN030">IN030 - Margem da despesa de exploração</option>
                   <option value="IN031">IN031 - Margem da despesa com pessoal próprio</option>
                   <option value="IN032">IN032 - Margem da despesa com pessoal total (equivalente)</option>
                   <option value="IN033">IN033 - Margem do serviço da divida</option>
                   <option value="IN034">IN034 - Margem das outras despesas de exploração</option>
                   <option value="IN035">IN035 - Participação da despesa com pessoal próprio nas despesas de exploração</option>
                   <option value="IN036">IN036 - Participação da despesa com pessoal total (equivalente) nas despesas de exploração</option>
                   <option value="IN037">IN037 - Participação da despesa com energia elétrica nas despesas de exploração</option>
                   <option value="IN038">IN038 - Participação da despesa com produtos químicos nas despesas de exploração (DEX)</option>
                   <option value="IN039">IN039 - Participação das outras despesas nas despesas de exploração</option>
                   <option value="IN040">IN040 - Participação da receita operacional direta de água na receita operacional total</option>
                   <option value="IN041">IN041 - Participação da receita operacional direta de esgoto na receita operacional total</option>
                   <option value="IN042">IN042 - Participação da receita operacional indireta na receita operacional total</option>
                   <option value="IN045">IN045 - Índice de produtividade: empregados próprios por 1000 ligações de água</option>
                   <option value="IN048">IN048 - Índice de produtividade: empregados próprios por 1000 ligações de água + esgoto</option>
                   <option value="IN054">IN054 - Dias de faturamento comprometidos com contas a receber</option>
                   <option value="IN060">IN060 - Índice de despesas por consumo de energia elétrica nos sistemas de água e esgotos</option>
                   <option value="IN101">IN101 - Índice de suficiência de caixa</option>
                   <option value="IN102">IN102 - Índice de produtividade de pessoal total (equivalente)</option>
                   <option value="IN001">IN001 - Densidade de economias de água por ligação</option>
                   <option value="IN009">IN009 - Índice de hidrometração</option>
                   <option value="IN010">IN010 - Índice de micromedição relativo ao volume disponibilizado</option>
                   <option value="IN011">IN011 - Índice de macromedição</option>
                   <option value="IN013">IN013 - Índice de perdas faturamento</option>
                   <option value="IN014">IN014 - Consumo micromedido por economia</option>
                   <option value="IN017">IN017 - Consumo de água faturado por economia</option>
                   <option value="IN020">IN020 - Extensão da rede de água por ligação</option>
                   <option value="IN022">IN022 - Consumo médio percapita de água</option>
                   <option value="IN023">IN023 - Índice de atendimento urbano de água</option>
                   <option value="IN025">IN025 - Volume de água disponibilizado por economia</option>
                   <option value="IN028">IN028 - Índice de faturamento de água</option>
                   <option value="IN043">IN043 - Participação das economias residenciais de água no total das economias de água</option>
                   <option value="IN044">IN044 - Índice de micromedição relativo ao consumo</option>
                   <option value="IN049">IN049 - Índice de perdas na distribuição</option>
                   <option value="IN050">IN050 - Índice bruto de perdas lineares</option>
                   <option value="IN051">IN051 - Índice de perdas por ligação</option>
                   <option value="IN052">IN052 - Índice de consumo de água</option>
                   <option value="IN053">IN053 - Consumo médio de água por economia</option>
                   <option value="IN055">IN055 - Índice de atendimento total de água</option>
                   <option value="IN057">IN057 - Índice de fluoretação de água</option>
                   <option value="IN058">IN058 - Índice de consumo de energia elétrica em sistemas de abastecimento de água</option>
                  
                
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
