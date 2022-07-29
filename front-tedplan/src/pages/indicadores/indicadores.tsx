import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  Container,
  DivCenter,
  DivForm,
  DivTituloForm,
  Form,
  MenuMunicipio,
  Municipio,
  MenuMunicipioItem,
  SubmitButton,
} from "../../styles/financeiro";
import HeadIndicadores from "../../components/headIndicadores";
import "suneditor/dist/css/suneditor.min.css";
import { getAPIClient } from "../../services/axios";
import MenuIndicadores from "../../components/MenuIndicadores";
import { GetServerSideProps } from "next";
import Router from "next/router";
import { AuthContext } from "../../contexts/AuthContext";
import { Chart } from "react-google-charts";
import { useForm } from "react-hook-form";
import api from "../../services/api";

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
    setTitle("Taxa de empregados em relação à população urbana")
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
   if(data.indicador == 'txEmpregPopUrb'){
    txEmpregPopUrb(data)
   }
  }


  async function txEmpregPopUrb(data){       
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

  async function handleSignOut() {
    signOut();
  }
  function handleHome() {
    Router.push("/indicadores/home_indicadores");
  }
  function handleGestao() {
    Router.push("/indicadores/gestao");
  }
  function handleIndicadores() {
    Router.push("/indicadores/gestao");
  }
  function handleReporte() {
    Router.push("/indicadores/gestao");
  }

  return (
    <Container>
      <HeadIndicadores usuarios={[]}></HeadIndicadores>
      <MenuMunicipio>
        <Municipio>Municipio: {}</Municipio>
        <MenuMunicipioItem>
          <ul>
            <li onClick={handleHome}>Home</li>
            <li onClick={handleGestao}>Gestão</li>
            <li onClick={handleIndicadores}>Indicadores</li>
            <li onClick={handleReporte}>Reporte</li>
            <li onClick={handleSignOut}>Sair</li>
          </ul>
        </MenuMunicipioItem>
      </MenuMunicipio>
      <MenuIndicadores></MenuIndicadores>
      <DivCenter>
        <Form onSubmit={handleSubmit(handleIndicador)}>
          <DivForm>
            <DivTituloForm>Indicadores</DivTituloForm> 
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
                   <option value="txEmpregPopUrb">Taxa de empregados em relação à população urbana</option>
                          
                </select>
                </td>
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
          <SubmitButton type="submit">Gravar</SubmitButton>
        </Form>
      </DivCenter>
    </Container>
  );
}
/*
export const getServerSideProps: GetServerSideProps<MunicipioProps> = async (
  ctx
) => {
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

  const resUsuario = await apiClient.get("getUsuario", {
    params: { id_usuario: '1' },
  });
  const usuario = await resUsuario.data;

  const res = await apiClient.get("getMunicipio", {
    params: { id_municipio: usuario[0].id_municipio },
  });
  const municipio = await res.data;

  return {
    props: {
      municipio,
    },
  };
};
*/
