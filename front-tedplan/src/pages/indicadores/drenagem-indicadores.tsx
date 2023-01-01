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
  DivTituloFormDrenagem,
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
import api from "../../services/api";
import MenuHorizontal from "../../components/MenuHorizontal";

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
  const [isMunicipio, setMunicipio] = useState<IMunicipio | any>(municipio);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [dadosDrenagem, setDadosDrenagem] = useState(null);
  const [content, setContent] = useState("");
  

  useEffect(() => {
    getDadosDrenagem()
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
  
  async function handleCadastro(data) {   
    data.id_drenagem_aguas_pluviais = dadosDrenagem?.id_drenagem_aguas_pluviais
    data.id_municipio = municipio[0].id_municipio
    data.ano = new Date().getFullYear()     
    
    const resCad = await api
      .post("create-drenagem", data)
      .then((response) => {
        toast.notify('Dados gravados com sucesso!',{
          title: "Sucesso!",
          duration: 7,
          type: "success",
        })
        return response.data;
      })
      .catch((error) => {
        toast.notify('Erro ao gravar os dados!',{
          title: "Erro!",
          duration: 7,
          type: "error",
        })
        console.log(error);
      });
  }

  async function getDadosDrenagem() {  
    const id_municipio = municipio[0].id_municipio
    const ano = new Date().getFullYear()  
    const res = await api
      .post("get-drenagem", {id_municipio: id_municipio, ano: ano})
      .then((response) => {        
        setDadosDrenagem(response.data[0])
      })
      .catch((error) => {
        console.log(error);
      });
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
      <MenuHorizontal municipio={municipio[0].municipio_nome}></MenuHorizontal>
      <MenuIndicadores></MenuIndicadores>
      <DivCenter>
        <Form onSubmit={handleSubmit(handleCadastro)}>
          <DivForm>
            <DivTituloFormDrenagem>
              Drenagem e Águas Pluviais
            </DivTituloFormDrenagem>

            <DivFormConteudo>
              <DivTitulo>
                <DivTituloConteudo>Vias urbanas</DivTituloConteudo>
              </DivTitulo>
              <InputSNIS>
                <label>Código SNIS</label>
                <p>IE017</p>
                <p>IE018</p>
                <p>IE019</p>
                <p>IE020</p>
                <p>IE021</p>
                <p>IE022</p>
                <p>IE023</p>
                <p>IE024</p>
                <p>IE025</p>
                <p>IE026</p>
                <p>IE027</p>
                <p>IE028</p>
                <p>IE029</p>
              </InputSNIS>
              <InputXL>
                <label>Descrição</label>
                <p>Extensão total das vias públicas urbanas</p>
                <p>Extensão total das vias públicas urbanas implantadas</p>
                <p>
                  Extensão total das vias públicas com pavimento e meio-fio(ou
                  semelhante)
                </p>
                <p>
                  Extensão total das vias públicas com pavimento e meio-fio(ou
                  semelhante) implantadas no ano de referência
                </p>
                <p>Quantidade de bocas de lobo existentes</p>
                <p>
                  Quantidade de bocas de leão ou de bocas de lobo múltiplas(duas
                  ou mais bocas de lobo conjugadas) existentes
                </p>
                <p>Quantidade de poços de visita (PV) existentes</p>
                <p>
                  Extensão total das vias públicas urbanas com redes de águas
                  pluviais subterrâneos
                </p>
                <p>
                  Extensão total das vias públicas urbanas com redes de águas
                  pluviais subterrâneos implantados no ano de referência
                </p>
                <p>
                  Existem vias públicas urbanas com canais artificiais abertos?
                </p>
                <p>
                  Existem vias públicas urbanas com soluções de drenagem
                  natural(faixas ou valas de infiltração)?
                </p>
                <p>
                  Extensão total das vias públicas urbanas com soluções de
                  drenagem natural(faixas ou valas de infiltração)
                </p>
                <p>
                  Existem estenções elevatórias de águas pluviais na rede de
                  drenagem?
                </p>
              </InputXL>
              <InputP>              
                <label>Ano: 2022</label>
                <input {...register("IE017")}
                 defaultValue={dadosDrenagem?.ie017}
                 onChange={handleOnChange}
                type="text"></input>
                <input {...register("IE018")}
                defaultValue={dadosDrenagem?.ie018}
                onChange={handleOnChange}
                type="text"></input>
                <input {...register("IE019")}
                defaultValue={dadosDrenagem?.ie019}
                onChange={handleOnChange}
                type="text"></input>
                <input {...register("IE020")}
                defaultValue={dadosDrenagem?.ie020}
                onChange={handleOnChange}
                type="text"></input>
                <input {...register("IE021")}
                defaultValue={dadosDrenagem?.ie021}
                onChange={handleOnChange}
                type="text"></input>
                <input {...register("IE022")}
                defaultValue={dadosDrenagem?.ie022}
                onChange={handleOnChange}
                type="text"></input>
                <input {...register("IE023")}
                defaultValue={dadosDrenagem?.ie023}
                onChange={handleOnChange}
                type="text"></input>
                <input {...register("IE024")}
                defaultValue={dadosDrenagem?.ie024}
                onChange={handleOnChange}
                type="text"></input>
                <input {...register("IE025")}
                defaultValue={dadosDrenagem?.ie025}
                onChange={handleOnChange}
                type="text"></input>
                <input {...register("IE026")}
                defaultValue={dadosDrenagem?.ie026}
                onChange={handleOnChange}
                type="text"></input>
                <input {...register("IE027")}
                defaultValue={dadosDrenagem?.ie027}
                onChange={handleOnChange}
                type="text"></input>
                <input {...register("IE028")}
                defaultValue={dadosDrenagem?.ie028}
                onChange={handleOnChange}
                type="text"></input>
                <input {...register("IE029")}
                defaultValue={dadosDrenagem?.ie029}
                onChange={handleOnChange}
                type="text"></input>
              </InputP>
              <InputSNIS>
                <label>.</label>
                <p>km</p>
                <p>km</p>
                <p>km</p>
                <p>km</p>
                <p>unidades</p>
                <p>unidades</p>
                <p>unidades</p>
                <p>km</p>
                <p>km</p>
                <p>.</p>
                <p>.</p>
                <p>km</p>
                <p>.</p>
              </InputSNIS>
            </DivFormConteudo>

            <DivFormConteudo>
              <DivTitulo>
                <DivTituloConteudo>
                  Cursos de água-aŕeas urbanas
                </DivTituloConteudo>
              </DivTitulo>
              <InputSNIS>
                <label>Código SNIS</label>
                <p>IE032</p>
                <p>IE040</p>
                <p>IE033</p>
                <p>IE034</p>
                <p>IE035</p>
                <p>IE036</p>
                <p>IE037</p>
                <p>IE041</p>
                <p>IE044</p>
                <p>IE050</p>
                <p>IE050A</p>
              </InputSNIS>
              <InputXL>
                <label>Descrição</label>
                <p>Extensão total dos cursos de águas naturais perenes</p>
                <p>
                  Extensão total dos cursos de águas naturais perenes copm outro
                  tipo de intervenção
                </p>
                <p>
                  Extensão total dos cursos de águas naturais perenes com diques
                </p>
                <p>
                  Extensão total dos cursos de águas naturais perenes
                  canalizados abertos
                </p>
                <p>
                  Extensão total dos cursos de águas naturais perenes
                  canalizados fechados
                </p>
                <p>
                  Extensão total dos cursos de águas naturais perenes com
                  retificação
                </p>
                <p>
                  Extensão total dos cursos de águas naturais perenes com
                  desenrocamento ou rebaixamento do leito
                </p>
                <p>
                  Existe serviço de drenagem ou desassoreamento dos cursos de
                  águas naturais perenes?
                </p>
                <p>
                  Extensão total de parques lineares ao longo de cursos de águas
                  perenes
                </p>
                <p>Existem algum tipo de tratamento das águas pluviais?</p>
                <p>
                  Especifique qual é o outro tipo de tratamento das águas
                  pluviais{" "}
                </p>
              </InputXL>
              <InputP>
                <label>Ano: 2022</label>
                <input {...register("IE032")}
                defaultValue={dadosDrenagem?.ie032}
                onChange={handleOnChange}
                type="text"></input>
                <input {...register("IE040")}
                defaultValue={dadosDrenagem?.ie040}
                onChange={handleOnChange}
                type="text"></input>
                <input {...register("IE033")}
                defaultValue={dadosDrenagem?.ie033}
                onChange={handleOnChange}
                type="text"></input>
                <input {...register("IE034")}
                defaultValue={dadosDrenagem?.ie034}
                onChange={handleOnChange}
                type="text"></input>
                <input {...register("IE035")}
                defaultValue={dadosDrenagem?.ie035}
                onChange={handleOnChange}
                type="text"></input>
                <input {...register("IE036")}
                defaultValue={dadosDrenagem?.ie036}
                onChange={handleOnChange}
                type="text"></input>
                <input {...register("IE037")}
                defaultValue={dadosDrenagem?.ie037}
                onChange={handleOnChange}
                type="text"></input>
                <select {...register("IE041")}
                defaultValue={dadosDrenagem?.ie041}
                onChange={handleOnChange}
                >
                  <option>Sim</option>
                  <option>Não</option>
                </select>
                <input {...register("IE044")}
                defaultValue={dadosDrenagem?.ie044}
                onChange={handleOnChange}
                type="text"></input>
                <select {...register("IE050")}>
                  <option>Não existe tratamento</option>
                  <option>Barragens</option>
                  <option>Reservatórios de qualidade</option>
                  <option>Reservatório de amortecimento</option>
                  <option>Gradeamento e desarenação</option>
                  <option>Decantação e/ou floculação</option>
                  <option>Desinfecção quimica</option>
                  <option>Outros(Especificar)</option>
                </select>
                <input {...register("IE050A")}
                defaultValue={dadosDrenagem?.ie050a}
                onChange={handleOnChange}
                type="text"></input>
              </InputP>
              <InputSNIS>
                <label>.</label>
                <p>km</p>
                <p>km</p>
                <p>km</p>
                <p>km</p>
                <p>km</p>
                <p>km</p>
                <p>km</p>
                <p>km</p>
                <p>km</p>
                <p>.</p>
                <p>km</p>
              </InputSNIS>
            </DivFormConteudo>

            <DivFormConteudo>
              <DivTitulo>
                <DivTituloConteudo>
                  Observações, esclarecimentos ou sugestões
                </DivTituloConteudo>
              </DivTitulo>
              <InputSNIS>
                <label>Código SNIS</label>
                <p>IE999</p>
              </InputSNIS>
              <InputM>
                <label>Descrição</label>
                <p>Observações, esclarecimentos ou sugestões</p>
              </InputM>

              <InputGG>
                <label>Ano: 2022</label>

                <textarea {...register("IE999")}
                defaultValue={dadosDrenagem?.ie999}
                onChange={handleOnChange}
                ></textarea>
              </InputGG>
            </DivFormConteudo>

            <DivFormConteudo>
              <DivTitulo>
                <DivTituloConteudo>
                  Eventos hidrológicos impactantes
                </DivTituloConteudo>
              </DivTitulo>
              <InputSNIS>
                <label>Código SNIS</label>
                <p>RI023</p>
                <p>RI025</p>
                <p>RI027</p>
                <p>RI029</p>
                <p>RI031</p>
                <p>RI032</p>
              </InputSNIS>
              <InputXL>
                <label>Descrição</label>
                <p>Numero de enxuradas na área urbana do município</p>
                <p>Numero de alagementos na área urbana do município</p>
                <p>Numero de inundações na área urbana do município</p>
                <p>
                  Numero de pessoas desabrigadas ou desalojadas, na área urbana
                  do município
                </p>
                <p>Numero de óbtos, na área urbana do município</p>
                <p>Numero de imóveis urbanos atingidos</p>
              </InputXL>

              <InputP>
                <label>Ano: 2022</label>
                <input {...register("RI023")}
                defaultValue={dadosDrenagem?.ri023}
                onChange={handleOnChange}
                type="text"></input>
                <input {...register("RI025")}
                defaultValue={dadosDrenagem?.ri025}
                onChange={handleOnChange}
                type="text"></input>
                <input {...register("RI027")}
                defaultValue={dadosDrenagem?.ri027}
                onChange={handleOnChange}
                type="text"></input>
                <input {...register("RI029")}
                defaultValue={dadosDrenagem?.ri029}
                onChange={handleOnChange}
                type="text"></input>
                <input {...register("RI031")}
                defaultValue={dadosDrenagem?.ri031}
                onChange={handleOnChange}
                type="text"></input>
                <input {...register("RI032")}
                defaultValue={dadosDrenagem?.ri032}
                onChange={handleOnChange}
                type="text"></input>
              </InputP>
              <InputSNIS>
                <label>.</label>
                <p>enxuradas</p>
                <p>alagamentos</p>
                <p>inundações</p>
                <p>pessoas</p>
                <p>óbtos</p>
                <p>imóveis</p>
              </InputSNIS>
              <DivSeparadora></DivSeparadora>
              <InputSNIS>
                <p>RI042</p>
              </InputSNIS>
              <InputXL>
                <p>
                  Houve alojamento ou reassentamento de população residente em
                  área de risco hidrológico, durante ou após eventos
                  hidrológicos impactantes
                </p>
              </InputXL>

              <InputP>
                <select {...register("RI042")}
                defaultValue={dadosDrenagem?.ri042}
                onChange={handleOnChange}
                >
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                  
                </select>
              </InputP>
              <InputSNIS>
                <p>.</p>
              </InputSNIS>

              <DivSeparadora></DivSeparadora>

              <InputSNIS>
                <p>RI043</p>
                <p>RI044</p>
              </InputSNIS>
              <InputXL>
                <p>
                  Quantidade de pessoas tranferidas para habitações provisórias
                  durante ou após os eventos hidrológicos impactantes
                </p>
                <p>
                  Quantidade de pessoas realocadas para habitações permanentes
                  durante ou após os eventos hidrológicos impactantes
                </p>
              </InputXL>

              <InputP>
                <input {...register("RI043")}
                 defaultValue={dadosDrenagem?.ri043}
                 onChange={handleOnChange}
                type="text"></input>
                <input {...register("RI044")}
                 defaultValue={dadosDrenagem?.ri044}
                 onChange={handleOnChange}
                type="text"></input>
              </InputP>
              <InputSNIS>
                <p>pessoas</p>
                <p>pessoas</p>
              </InputSNIS>

              <DivSeparadora></DivSeparadora>
              <InputSNIS>
                <p>RI045</p>
              </InputSNIS>
              <InputXL>
                <p>
                  Houve atuação (federal, estadual ou municipal) para
                  reassentamento da população e/ou para recuperação de imóveis
                  urbanos afetados por eventos hidrológicos impactantes?
                </p>
              </InputXL>

              <InputP>
                <select {...register("RI045")}
                 defaultValue={dadosDrenagem?.ri045}
                 onChange={handleOnChange}
                >
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>                  
                </select>
              </InputP>
              <InputSNIS>
                <p>.</p>
              </InputSNIS>

              <DivSeparadora></DivSeparadora>

              <InputSNIS>
                <p>RI999</p>
              </InputSNIS>

              <InputM>
                <p>Observações, esclarecimentos ou sugestões</p>
              </InputM>

              <InputGG>
                <textarea {...register("RI999")}
                defaultValue={dadosDrenagem?.ri999}
                onChange={handleOnChange}
                ></textarea>
              </InputGG>
            </DivFormConteudo>
          </DivForm>

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

