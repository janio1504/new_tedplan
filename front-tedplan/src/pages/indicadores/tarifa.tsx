/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
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
  DivTitulo,
  DivFormEixo,
  DivTituloEixo,
  DivFormConteudo,
  DivTituloConteudo,
  InputGG,
  DivSeparadora,
  InputSNIS,
  InputXL,
  DivTituloFormResiduo,
  DivFormResiduo,
  DivBorder,
  LabelCenter,
} from "../../styles/financeiro";
import HeadIndicadores from "../../components/headIndicadores";
import { toast, ToastContainer } from 'react-nextjs-toast';
import "suneditor/dist/css/suneditor.min.css";
import { getAPIClient } from "../../services/axios";
import MenuIndicadores from "../../components/MenuIndicadores";
import { parseCookies } from "nookies";
import { GetServerSideProps } from "next";
import Router from "next/router";
import { AuthContext } from "../../contexts/AuthContext";
import CurrencyInput from "react-currency-masked-input";
import {
  Tabela,
  ContainerModal,
  Modal,
  CloseModalButton,
  ConteudoModal,
  FormModal,
  SubmitButtonModal,
  DivBotaoAdicionar,
} from "../../styles/indicadores";
import api from "../../services/api";

interface IMunicipio {
  id_municipio: string;
  municipio_codigo_ibge: string;
  municipio_nome: string;
}

interface MunicipioProps {
  municipio: IMunicipio[];
}

export default function Tarifa({ municipio }: MunicipioProps) {
  const { usuario, signOut } = useContext(AuthContext);
  const [dadosMunicipio, setDadosMunicipio] = useState<IMunicipio | any>(municipio);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [dadosTarifa, setDadosTarifa] = useState(null);
  const [content, setContent] = useState("");
  
  
  useEffect(() => {
    getDadosTarifa()
  }, [municipio]);

  const setOptions = {
    attributesWhitelist: {
      all: "data-id|data-type",
    },
    defaultTag: "p",
  };

  function handleOnChange(content) {
    setContent(content);
  }

  function handleCloseModalCO020(){}
  

  async function handleCadastro(data) {  
    
    data.id_tarifa = dadosTarifa?.id_tarifa
    data.id_municipio = municipio[0].id_municipio
    data.ano = new Date().getFullYear()  
    const resCad = await api
      .post("create-tarifa", data)
      .then((response) => {     
        toast.notify('Dados gravados com sucesso!',{
          title: "Sucesso!",
          duration: 7,
          type: "success",
        })   
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
      getDadosTarifa()
  }

  async function getDadosTarifa() {  
    
    
    const id_municipio = municipio[0].id_municipio
    const ano = new Date().getFullYear()  
    const res = await api
      .post("get-tarifa", {id_municipio: id_municipio, ano: ano})
      .then((response) => { 
        console.log(response.data);      
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });

      setDadosTarifa(res[0])
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
      <ToastContainer></ToastContainer>
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
        <Form onSubmit={handleSubmit(handleCadastro)}>
          <DivFormResiduo>
            <DivTituloFormResiduo>Tarifa Social</DivTituloFormResiduo>    
            <DivFormEixo>
              <DivTituloEixo>Água e Esgoto Sanitário</DivTituloEixo>
            
            <DivFormConteudo>
              <DivTitulo>
                <DivTituloConteudo>Tarifa minima</DivTituloConteudo>
              </DivTitulo>
              <table>
                <thead>
                  <tr>
                    <th>Código SNIS</th>
                    <th>Descrição</th>
                    <th>Ano 2022</th>
                  </tr>
                </thead>
                <tbody>                 
                  <tr>
                    <td><InputSNIS>TR001</InputSNIS></td>
                    <td>O prestador de serviços tem em sua estrutura sanitária cobrança de tarifa mínima? </td>
                    <td><InputP><select {...register('TR001')}>
                      <option
                      defaultValue={dadosTarifa?.tr001}
                      onChange={handleOnChange}
                      >{dadosTarifa?.tr001}</option>
                      <option value="Sim">Sim</option>
                      <option value="Não">Não</option>
                      </select></InputP></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td><InputSNIS>TR002</InputSNIS></td>
                    <td>Há cobrança diferenciada de tarifa mínima para economias residencias micromedidas e não micromedidas? </td>
                    <td><InputP><select {...register('TR002')}>
                       <option 
                        defaultValue={dadosTarifa?.tr002}
                        onChange={handleOnChange}
                       >{dadosTarifa?.tr002}</option>
                      <option value="Sim">Sim</option>
                      <option value="Não">Não</option>
                      </select></InputP></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td><InputSNIS>TR005</InputSNIS></td>
                    <td>Quantas economias residencias MICROMEDIDAS são comtempladas com a tarifa mínima? </td>
                    <td><InputP><input {...register('TR005')}
                    defaultValue={dadosTarifa?.tr005}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Economias</td>
                  </tr> 
                  <tr>
                    <td><InputSNIS>TR003</InputSNIS></td>
                    <td>Qual o volume máximo adotado para fins de tarifação e enquadramento na tarifa mínima,
                      para as economias residenciais MICROMEDIDAS?  </td>
                    <td><InputP><input {...register('TR003')}
                    defaultValue={dadosTarifa?.tr003}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>R$/mês</td>
                  </tr>
                  <tr>
                    <td><InputSNIS>TR006</InputSNIS></td>
                    <td>Qual o valor da tarifa mínima praticada para as economias residencias MICROMEDIDAS? </td>
                    <td><InputP><input {...register('TR006')}
                    defaultValue={dadosTarifa?.tr006}
                    onChange={handleOnChange} type="text"></input></InputP></td>
                    <td>R$/mês</td>
                  </tr>
                  <tr>
                    <td><InputSNIS>TR009</InputSNIS></td>
                    <td>Qual a quantidade de economias residencias NÃO MICROMEDIDAS contempladas com a tarifa mínima? </td>
                    <td><InputP><input {...register('TR009')}
                    defaultValue={dadosTarifa?.tr009}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Economias</td>
                  </tr> 
                  <tr>
                    <td><InputSNIS>TR007</InputSNIS></td>
                    <td>Qual o volume máximo adotado para fins de tarifação e enquadramento na tarifa mínima,
                      para as economias residenciais NÃO MICROMEDIDAS? </td>
                    <td><InputP><input {...register('TR007')}
                    defaultValue={dadosTarifa?.tr007}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>R$/mês</td>
                  </tr>
                  <tr>
                    <td><InputSNIS>TR010</InputSNIS></td>
                    <td>Qual o valor da tarifa mínima praticada para as economias residencias NÃO MICROMEDIDAS?  </td>
                    <td><InputP><input {...register('TR010')}
                    defaultValue={dadosTarifa?.tr010}
                    onChange={handleOnChange} type="text"></input></InputP></td>
                    <td>R$/mês</td>
                  </tr>
                  <tr>
                    <td><InputSNIS>TR013</InputSNIS></td>
                    <td>Quantas economias residencias são contempladas coma tarifa mínima? </td>
                    <td><InputP><input {...register('TR013')}
                    defaultValue={dadosTarifa?.tr013}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Economias</td>
                  </tr> 
                  <tr>
                    <td><InputSNIS>TR011</InputSNIS></td>
                    <td>Qual o volume máximo adotado para fins de tarifação e enquadramento na tarifa mínima,
                      para as economias residenciais? </td>
                    <td><InputP><input {...register('TR011')}
                    defaultValue={dadosTarifa?.tr011}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>R$/mês</td>
                  </tr>
                  <tr>
                    <td><InputSNIS>TR014</InputSNIS></td>
                    <td>Qual o valor da tarifa mínima praticada para as economias residencias? </td>
                    <td><InputP><input {...register('TR014')}
                    defaultValue={dadosTarifa?.tr014}
                    onChange={handleOnChange} type="text"></input></InputP></td>
                    <td>R$/mês</td>
                  </tr>                             
                </tbody>                
              </table>            
            </DivFormConteudo>

            <DivFormConteudo>
              <DivTitulo>
                <DivTituloConteudo>Tarifa Social</DivTituloConteudo>
              </DivTitulo>
              <table>
                <thead>
                  <tr>
                    <th>Código SNIS</th>
                    <th>Descrição</th>
                    <th>Ano 2022</th>
                  </tr>
                </thead>
                <tbody>                 
                <tr>
                    <td><InputSNIS>TR015</InputSNIS></td>
                    <td>O prestador de serviços tem em sua estrutura sanitária cobrança de tarifa social?  </td>
                    <td><InputP><select {...register('TR015')}>
                      <option
                      defaultValue={dadosTarifa?.tr015}
                      onChange={handleOnChange}
                      >{dadosTarifa?.tr015}</option>
                      <option value="Sim">Sim</option>
                      <option value="Não">Não</option>
                      </select></InputP></td>
                    <td></td>
                  </tr>
                  <tr>
                  <td><InputSNIS>TR016</InputSNIS></td>
                    <td>A tarifa social é regulamentada por lei, decreto, resolução ou outro instrumento formal? </td>
                    <td><InputP><select {...register('TR016')}>
                      <option
                       defaultValue={dadosTarifa?.tr016}
                       onChange={handleOnChange}
                      >{dadosTarifa?.tr016}</option>
                      <option value="Sim">Sim</option>
                      <option value="Não">Não</option>
                      </select></InputP></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td><InputSNIS>TR017</InputSNIS></td>
                    <td>Qual o tipo, numero e ano da tarifa social adotada? </td>
                    <td><InputP><input {...register('TR017')}
                    defaultValue={dadosTarifa?.tr017}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td></td>
                  </tr> 
                  <tr>
                    <td><InputSNIS>TR018</InputSNIS></td>
                    <td>Cosumo de volume máximo pré-determinado pelo prestador?</td>
                    <td><InputP><input {...register('TR018')}
                    defaultValue={dadosTarifa?.tr018}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td><InputSNIS>TR019</InputSNIS></td>
                    <td>Os descontos oferecidos via tarifa social variam em função da faixa de consumo? </td>
                    <td><InputP><input {...register('TR019')}
                    defaultValue={dadosTarifa?.tr019}
                    onChange={handleOnChange} type="text"></input></InputP></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td><InputSNIS>TR020</InputSNIS></td>
                    <td>Qual o volume mensal MÍNIMO de água consumida para o qual se oferece desconto em relação à tarifa normal?</td>
                    <td><InputP><input {...register('TR020')}
                    defaultValue={dadosTarifa?.tr020}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>m³/mês</td>
                  </tr> 
                  <tr>
                  <td><InputSNIS>TR021</InputSNIS></td>
                    <td>Qual o volume mensal MÁXIMO de água consumida para o qual se oferece desconto em relação à tarifa normal?</td>
                    <td><InputP><input {...register('TR021')}
                    defaultValue={dadosTarifa?.tr021}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>m³/mês</td>
                  </tr>
                  <tr>
                  <td><InputSNIS>TR022</InputSNIS></td>
                    <td>O domicílio deve apresentar característas construtivas determinadas (material, número de cômodos
                      ou metragem, por exemplo)
                    </td>
                    <td><InputP><input {...register('TR022')}
                    defaultValue={dadosTarifa?.tr022}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td></td>
                  </tr>
                  <tr>
                  <td><InputSNIS>TR023</InputSNIS></td>
                    <td>Os descontos oferecidos via tarifa social variam em função das características construtivas?
                    </td>
                    <td><InputP><select {...register('TR023')}>
                      <option
                      defaultValue={dadosTarifa?.tr023}
                      onChange={handleOnChange}
                      >{dadosTarifa?.tr023}</option>
                      <option value="Sim">Sim</option>
                      <option value="Não">Não</option>
                      </select></InputP></td>
                    <td></td>
                  </tr> 
                  <tr>
                  <td><InputSNIS>TR024</InputSNIS></td>
                    <td>O domicílio deve estar localizado em determinados locais caracteriticos como de baixa renda?
                    </td>
                    <td><InputP><select {...register('TR024')}>
                       <option
                       defaultValue={dadosTarifa?.tr024}
                       onChange={handleOnChange}
                       >{dadosTarifa?.tr024}</option>
                      <option value="Sim">Sim</option>
                      <option value="Não">Não</option>
                      </select></InputP></td>
                    <td></td>
                  </tr>
                  <tr>
                  <td><InputSNIS>TR025</InputSNIS></td>
                  <td>Os descontos oferecidos via tarifa social variam em função da localização da residência?
                    </td>
                    <td><InputP><select {...register('TR025')}>
                       <option
                       defaultValue={dadosTarifa?.tr025}
                       onChange={handleOnChange}
                       >{dadosTarifa?.tr025}</option>
                      <option value="Sim">Sim</option>
                      <option value="Não">Não</option>
                      </select></InputP></td>
                    <td></td>
                  </tr> 
                  <tr>
                    <td><InputSNIS>TR026</InputSNIS></td>
                    <td>O consumidor deve estar inscrito no cadastro único para programas sociais - cadúnico?
                      (opção válida para os não beneficiários do bolsa família)
                     </td>
                    <td><InputP><select {...register('TR026')}>
                         <option
                         defaultValue={dadosTarifa?.tr026}
                         onChange={handleOnChange}
                         ></option>
                      <option value="Sim">Sim</option>
                      <option value="Não">Não</option>
                      </select></InputP></td>
                    <td></td>
                  </tr>
                  <tr>
                  <td><InputSNIS>TR027</InputSNIS></td>
                    <td>O consumidor deve ser beneficíario do bolsa família? </td>
                    <td><InputP><select {...register('TR027')}>
                         <option
                         defaultValue={dadosTarifa?.tr027}
                         onChange={handleOnChange}
                         >{dadosTarifa?.tr027}</option>
                      <option value="Sim">Sim</option>
                      <option value="Não">Não</option>
                      </select></InputP></td>
                    <td></td>
                  </tr>
                  <tr>
                  <td><InputSNIS>TR028</InputSNIS></td>
                    <td>O consumidor deve estar inscrito em programas sociais estaduais ou municipais ou em outros
                      registros administrativos estaduais ou municipais? </td>
                    <td><InputP><select {...register('TR028')}>
                         <option
                         defaultValue={dadosTarifa?.tr028}
                         onChange={handleOnChange}
                         >{dadosTarifa?.tr028}</option>
                      <option value="Sim">Sim</option>
                      <option value="Não">Não</option>
                      </select></InputP></td>
                    <td></td>
                  </tr> 
                  <tr>
                  <td><InputSNIS>TR029</InputSNIS></td>
                    <td>O consumidor deve comprovar rendimento junto ao prestador de serviços?</td>
                    <td><InputP><select {...register('TR029')}>
                         <option
                         defaultValue={dadosTarifa?.tr029}
                         onChange={handleOnChange}
                         >{dadosTarifa?.tr029}</option>
                      <option value="Sim">Sim</option>
                      <option value="Não">Não</option>
                      </select></InputP></td>
                    <td></td>
                  </tr>
                  <tr>
                  <td><InputSNIS>TR030</InputSNIS></td>
                    <td>O consumidor deve possuir ligação de energia elétrica monofásica, com consumo mensal 
                      (média anual) dentro de limite instituído pelo prestador?</td>
                    <td><InputP><select {...register('TR030')}>
                         <option
                         defaultValue={dadosTarifa?.tr030}
                         onChange={handleOnChange}
                         >{dadosTarifa?.tr030}</option>
                      <option value="Sim">Sim</option>
                      <option value="Não">Não</option>
                      </select></InputP></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td><InputSNIS>TR031</InputSNIS></td>
                    <td>Outros </td>
                    <td><InputP><input {...register('TR031')}
                    defaultValue={dadosTarifa?.tr031}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td></td>
                  </tr> 
                  <tr>
                  <td><InputSNIS>TR032</InputSNIS></td>
                    <td>Especifique outra forma de conceder o benefício </td>
                    <td><InputP><input {...register('TR032')}
                    defaultValue={dadosTarifa?.tr032}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td><InputSNIS>TR033</InputSNIS></td>
                    <td>Especifique outra forma de conceder o benefício </td>
                    <td><InputP><input {...register('TR033')}
                    defaultValue={dadosTarifa?.tr033}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Economias</td>
                  </tr>
                  <tr>
                  <td><InputSNIS>TR034</InputSNIS></td>
                    <td>Qual o valor médio da tarifa social praticada para as economias residenciais? </td>
                    <td><InputP><input {...register('TR034')}
                    defaultValue={dadosTarifa?.tr034}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>R$/mês</td>
                  </tr> 
                       
                </tbody>                
              </table>            
            </DivFormConteudo> 

          
            <DivFormConteudo>
              <DivTitulo>
                <DivTituloConteudo>Observações</DivTituloConteudo>
              </DivTitulo>
           
              <InputSNIS>
                <p>TR099</p>
              </InputSNIS>
              <InputM>
                <p>Observações, esclarecimentos ou sugestões</p>
              </InputM>

              <InputGG>
                <textarea {...register("TR099")}
                defaultValue={dadosTarifa?.tr099}
                onChange={handleOnChange}
                />
              </InputGG>
            </DivFormConteudo>       
            </DivFormEixo>
          </DivFormResiduo>

          <SubmitButton type="submit">Gravar</SubmitButton>
        </Form>
      </DivCenter>

     
    </Container>
  );
}

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
    params: { id_usuario: id_usuario },
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

