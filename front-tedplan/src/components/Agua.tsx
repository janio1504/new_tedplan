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
