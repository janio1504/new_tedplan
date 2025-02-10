import { GetServerSideProps } from "next";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { parseCookies } from "nookies";
import { AuthContext } from "../contexts/AuthContext";
import { useToasts } from "react-toast-notifications";

import {
  Container,
     Form,
     Footer, DivCenter, DivInstrucoes,
  } from '../styles/dashboard';


  import {
  SubmitButton,
       
    } from '../styles/dashboard-original';

import { getAPIClient } from "../services/axios";
import { useForm } from "react-hook-form";
import MenuSuperior from "../components/head";



interface IPost {
  id_posts: string;
  titulo: string;
  texto: string;
  id_categoria: string;
  id_municipio: string;
  arquivo: File;
}
interface IMunicipios {
  id_municipio: string;
  nome: string;
}

interface IContent {
  content: "";
}

interface PostProps {
  contentInitial: IContent;
  posts: IPost[];
  municipios: IMunicipios[];
}

interface MunicipiosProps {
  municipios: IMunicipios[];
}

export default function AddPostagem({ municipios, posts }: PostProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { signOut } = useContext(AuthContext);

  const [contentForEditor, setContentForEditor] = useState(null);
  const [content, setContent] = useState("");
  const editor = useRef(null);
  let txtArea = useRef();
  const firstRender = useRef(true);
  const editorContent = useMemo(() => contentForEditor, [contentForEditor]);

  const getSunEditorInstance = (sunEditor) => {
    editor.current = sunEditor;
  };

  function handleOnChange(content) {
    setContent(content);
  }

  useEffect(() => {
    /*
    editor.current = suneditor.create(txtArea.current, {
      height: "300px",
      width: "800px",

      buttonList: [
        // Default
        ["undo", "redo"],
        ["font", "fontSize", "formatBlock"],
        ["paragraphStyle", "blockquote"],
        ["bold", "underline", "italic", "strike", "subscript", "superscript"],
        ["fontColor", "hiliteColor", "textStyle"],
        ["removeFormat"],
        ["outdent", "indent"],
        ["align", "horizontalRule", "list", "lineHeight"],
        ["table", "link", "image", "video", "audio"],
        ["imageGallery"],
        ["fullScreen", "showBlocks", "codeView"],
        ["preview", "print"],
        ["save", "template"],
      ],
      attributesWhitelist: {
        all: "data-id|data-type",
      },
    });
    */
  }, []);

  async function handleAddPost({
    titulo,
    id_categoria,
    id_municipio,
    arquivo,
  }) {
    const texto = content.toString();
    console.log(texto);
    return
    const formData = new FormData();

    formData.append("imagem", arquivo[0]);
    formData.append("titulo", titulo);
    formData.append("texto", texto);
    formData.append("id_categoria", id_categoria);
    formData.append("id_municipio", id_municipio);
    const apiClient = getAPIClient();
    const res = await apiClient.post("addPost", formData, {
      headers: {
        "Content-Type": `multipart/form-data=${formData}`,
      },
    });

    reset({
      arquivo: "",
      titulo: "",
      texto: "",
      id_categoria: "",
      id_municipio: "",
    });
    setContentForEditor("");

    if (res.data.error) {
    
    } else {
   
    }
  }
  return (
    <Container>
      <MenuSuperior usuarios={[]}></MenuSuperior>

      <DivCenter>
        <DivInstrucoes>
          <b>Cadastro de Postagens:</b>
        </DivInstrucoes>
       
        <Form onSubmit={handleSubmit(handleAddPost)}>
          <label>Titulo</label>
          <input
            aria-invalid={errors.value ? "true" : "false"}
            {...register("titulo", { required: true })}
            type="text"
            placeholder="Titulo do post"
            name="titulo"
          />
          {errors.titulo && errors.titulo.type && (
            <span>O campo Titulo é obrigatório!</span>
          )}
          <select
            {...register("id_municipio", { required: true })}
            name="id_municipio"
          >
            aria-invalid={errors.value ? "true" : "false"}
            <option value="">Selecione um Municipio</option>
            {municipios.map((municipio) => (
              <option
                key={municipio.id_municipio}
                value={municipio.id_municipio}
              >
                {municipio.nome}
              </option>
            ))}
          </select>
          {errors.id_municipio && errors.id_municipio.type && (
            <span>Selecionar um Municipio é obrigatório!</span>
          )}

          <input
            aria-invalid={errors.value ? "true" : "false"}
            {...register("id_categoria", { required: true })}
            type="hidden"
            name="id_categoria"
            value="1"
          />
          {errors.id_categoria && errors.id_categoria.type && (
            <span>Selecionar uma categoria é obrigatória!</span>
          )}
          <label>Imagem</label>
          <input
            aria-invalid={errors.value ? "true" : "false"}
            {...register("arquivo", { required: true })}
            type="file"
            name="arquivo"
            accept="image/*"
          />
          {errors.arquivo && errors.arquivo.type && (
            <span>Selecionar uma imagem é obrigatório!</span>
          )}
          <label>Texto</label>
          <textarea
          onChange={handleOnChange}          
          />          
          
          <SubmitButton type="submit">Gravar</SubmitButton>
        </Form>
       
      </DivCenter>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps<MunicipiosProps> = async (
  ctx
) => {
  const { ["tedplan.token"]: token } = parseCookies(ctx);
  const apiClient = getAPIClient(ctx);

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const res = await apiClient.get("/getMunicipios");
  const municipios = await res.data;

  return {
    props: {
      municipios,
    },
  };
};
