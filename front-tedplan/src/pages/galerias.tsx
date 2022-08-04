/* eslint-disable @next/next/no-img-element */
import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import {
  Container,
  Form,
  SubmitButton,
  Lista,
  Footer,
  DivCenter,
  MenuLateral,
  DivFormConteudo,
  DivInput,
  ImagemLista,
  Logo_si,
  TextoLista,
  BotaoVisualizar,
  BotaoGaleria,
  ContainerModal,
  ModalGaleria,
  CloseModalButton,
  ConteudoModal,
  ImagensGaleria,
} from "../styles/views";
import { getAPIClient } from "../services/axios";
import { useForm } from "react-hook-form";
import HeadPublico from "../components/headPublico";
import { toast, ToastContainer } from 'react-nextjs-toast'
import MenuPublicoLateral from "../components/MenuPublicoLateral";
import Image from "next/image";

type IGaleria = {
  id_galeria: string;
  titulo: string;
  id_eixo: string;
  id_municipio: string;
  eixo: string;
  municipio: string;
  id_arquivo: string;
  id_imagem: string;
  imagem: string;
};

interface IMunicipios {
  id_municipio: string;
  nome: string;
}

interface IEixos {
  id_eixo: string;
  nome: string;
}

interface GaleriaProps {
  galerias: IGaleria[];
  eixos: IEixos[];
  municipios: IMunicipios[];
}

export default function Galerias({
  municipios,
  eixos,
  galerias,
}: GaleriaProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [isGaleria, setGaleria] = useState<IGaleria | any>(galerias);
  const [imagensGaleria, setImagensGaleria] = useState(null);
  const [isModalGaleria, setModalGaleria] = useState(false);
  

  useEffect(() => {
    if (galerias) {
      getGalerias(galerias);
    }
  }, [galerias]);

  async function handlebuscaFiltrada({
    titulo,
    id_eixo,
    id_municipio,
  }: IGaleria) {
    const apiClient = getAPIClient();

    const resBusca = await apiClient.get("/getPorFiltroGaleria", {
      params: { titulo, id_eixo, id_municipio },
    });
    const galerias = resBusca.data;
    if (!galerias[0])
      return (
        reset({
          titulo: "",
          id_municipio: "",
          id_eixo: "",
        }),
        toast.notify('Nenhum resutado foi encontrado!',{
          title: "Atenção!",
          duration: 7,
          type: "warning",
        })
      );

    getGalerias(galerias);

    reset({
      titulo: "",
      id_municipio: "",
      id_tipo_publicacao: "",
      id_eixo: "",
    });
  }

  async function getGalerias(galerias?: any) {
    const apiClient = getAPIClient();
    if (galerias) {
      const galeria = await Promise.all(
        galerias.map(async (g) => {
          const imagem = await apiClient({
            method: "GET",
            url: "getImagem",
            params: { id: g.id_imagem },
            responseType: "blob",
          }).then((response) => {
            return URL.createObjectURL(response.data);
          });

          const galerias = {
            ...g,
            imagem: imagem,
          };

          return galerias;
        })
      );

      setGaleria(galeria);
    }
  }

  async function handleModalGaleriaOpen({ id_galeria }) {
    const apiClient = getAPIClient();
    const resImagens = await apiClient.get("/getImagens", {
      params: { id_galeria: id_galeria },
    });

    const imagens = await Promise.all(
      resImagens.data.map(async (imagem) => {
        const img = await apiClient({
          method: "GET",
          url: "getImagem",
          params: { id: imagem.id },
          responseType: "blob",
        }).then((response) => {
          return { imagen: URL.createObjectURL(response.data), id: imagem.id };
        }).catch(error=>{
          console.log(error);
          
        });
        return img;
      })
    );

    setImagensGaleria(imagens);
    setModalGaleria(true)
  }

  function handleCloseModal(){
    setModalGaleria(false)
  }

  return (
    <Container>
      <HeadPublico></HeadPublico>
      <DivCenter>
        <MenuLateral>
          <MenuPublicoLateral></MenuPublicoLateral>
        </MenuLateral>

        <DivFormConteudo>
          <h3>Galerias</h3>

          <Form onSubmit={handleSubmit(handlebuscaFiltrada)}>
            <DivInput>
              <label>Municipios:</label>
              <select {...register("id_municipio")}>
                <option value="">Todos</option>
                {municipios.map((municipio, key) => (
                  <option key={key} value={municipio.id_municipio}>
                    {municipio.nome}
                  </option>
                ))}
              </select>
            </DivInput>

            <DivInput>
              <label>Eixos:</label>
              <select {...register("id_eixo")}>
                <option value="">Todos</option>
                {eixos.map((eixo, key) => (
                  <option key={key} value={eixo.id_eixo}>
                    {eixo.nome}
                  </option>
                ))}
              </select>
            </DivInput>

            <DivInput>
              <label>Titulo:</label>
              <input
                {...register("titulo")}
                placeholder="Titulo da publicação"
                name="titulo"
              ></input>
            </DivInput>
            <DivInput>
              <SubmitButton>Filtrar</SubmitButton>
            </DivInput>
          </Form>

          {isGaleria.map((galeria) => (
            <Lista key={galeria.id_galeria}>
              <ImagemLista>
                <img src={galeria.imagem} alt="TedPlan" />
              </ImagemLista>
              <TextoLista>
                <p>
                  <b>{galeria.titulo}</b>
                </p>
                <p>TedPlan/UNIFAP</p>
                <p>{galeria.eixo}</p>
                <p>
                  <BotaoGaleria
                    onClick={() =>
                      handleModalGaleriaOpen({ id_galeria: galeria.id_galeria })
                    }
                  >
                    Clique aqui para ver a galeria!
                  </BotaoGaleria>
                </p>
              </TextoLista>
            </Lista>
          ))}
        </DivFormConteudo>
        {isModalGaleria && (
          <ContainerModal>
            <ModalGaleria>
              <CloseModalButton onClick={handleCloseModal}>
                Fechar
              </CloseModalButton>

              <ConteudoModal>
                {imagensGaleria.map((imagem, key) => (
                  <ImagensGaleria key={key}>
                    <p>
                      <img src={imagem.imagen} alt="TedPlan" />
                    </p>
                  </ImagensGaleria>
                ))}
              </ConteudoModal>
            </ModalGaleria>
          </ContainerModal>
        )}
      </DivCenter>
      <Footer>&copy; Todos os direitos reservados</Footer>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps<GaleriaProps> = async (
  ctx
) => {
  const apiClient = getAPIClient(ctx);

  const resMunicipio = await apiClient.get("/getMunicipios");
  const municipios = await resMunicipio.data;

  const resEixo = await apiClient.get("/getEixos");
  const eixos = await resEixo.data;

  const resGalerias = await apiClient.get("/getGalerias");
  const galerias = await resGalerias.data;

  return {
    props: {
      municipios,
      eixos,
      galerias,
    },
  };
};
