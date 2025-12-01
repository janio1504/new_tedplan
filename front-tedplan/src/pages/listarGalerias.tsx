/* eslint-disable @next/next/no-img-element */
import { GetServerSideProps } from "next";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { parseCookies } from "nookies";
import { AuthContext } from "../contexts/AuthContext";
import { getAPIClient } from "../services/axios";
import api from "../services/api";
import Router from "next/router";
import MenuSuperior from "../components/head";
import headIndicadores from "../components/headIndicadores";
import {
  FaSearch,
  FaDatabase,
  FaHome,
  FaSignOutAlt,
  FaRegTimesCircle,
  FaUpload,
  FaImage,
  FaTimes,
  FaTrash,
  FaEye,
} from "react-icons/fa";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import "suneditor/dist/css/suneditor.min.css";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";


import {
  Container,
  Footer,
  DivCenter,
  BotaoVisualizar,
  BotaoEditar,
  BotaoRemover,
  ModalGaleria,
  ImagemGaleria,
  ImagensGaleria,
  ContainerImagems,
  ModalImgAmpliada,
  ImagenAmpliada,
  DivMenuTitulo,
  MenuMunicipioItem,
  BotaoAdicionar,
} from "../styles/dashboard";

import {
  ContainerModal,
  Modal,
  CloseModalButton,
  ConteudoModal,
  ImagemModal,
  SubmitButton,
  TituloModal,
  ConfirmModal,
  CancelButton,
  ConfirmButton,
  FormModal,
  BodyDashboard,
} from "../styles/dashboard-original";

import { useForm } from "react-hook-form";
import image from "next/image";
import { Form } from "../styles/indicadores";
import HeadIndicadores from "../components/headIndicadores";

interface IGaleria {
  id_galeria: string;
  titulo: string;
  descricao: string;
  mes: string;
  ano: string;
  id_imagem: string;
  imagem: string;
}

interface GaleriaProps {
  galerias: IGaleria[];
}

type Imagem = {
  img: string | ArrayBuffer;
};

export default function Postagens({ galerias }: GaleriaProps) {
  const { register, handleSubmit, reset } = useForm();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalGaleria, setModalGaleria] = useState(false);
  const [isModalConfirm, setModalConfirm] = useState(false);
  const [isModalUpdateVisible, setModalUpdateVisible] = useState(false);
  const [isGaleria, setGaleria] = useState(null);
  const [idGaleria, setIdGaleria] = useState(null);
  const [idImagem, setIdImagen] = useState(null);
  const [imagem, setImagem] = useState(null);
  const [imagensSelecionadas, setImagensSelecionadas] = useState<File[]>([]);
  const [previewImagens, setPreviewImagens] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [imagensGaleria, setImagensGaleria] = useState(null);
  const [galeriaTitulo, setGaleriaTitulo] = useState("");
  const [modalImagemAmpliada, setModalImagemAmpliada] = useState(false);
  const [imagemAmpliada, setImagemAmpliada] = useState(null);
  const [galeriasList, setGaleriasList] = useState<IGaleria[]>(galerias || []);
  const [searchTerm, setSearchTerm] = useState("");
  const {signOut} = useContext(AuthContext);

  const fileInputRef = useRef<HTMLInputElement>();

  async function handleShowModal(galeria) {
    setGaleria(galeria);
    setModalVisible(true);
  }

  function handleImagemAmpliada(imagem) {
    setImagemAmpliada(imagem);
    setModalImagemAmpliada(true);
  }
  function handleCloseModalImgAmpliada() {
    setModalImagemAmpliada(false);
  }

  function handleCloseModal() {
    setModalVisible(false);
    setImagem("");
    setImagensSelecionadas([]);
    setPreviewImagens([]);
  }

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files);
    const totalImagens = imagensSelecionadas.length + filesArray.length;

    // Validar limite de 10 imagens
    if (totalImagens > 10) {
      toast.warning(`Você pode adicionar no máximo 10 imagens. Você já selecionou ${imagensSelecionadas.length} e tentou adicionar ${filesArray.length}.`, { position: "top-right", autoClose: 5000 });
      return;
    }

    // Adicionar novos arquivos
    const novasImagens = [...imagensSelecionadas, ...filesArray];
    setImagensSelecionadas(novasImagens);

    // Criar previews
    const novosPreviews = filesArray.map(file => URL.createObjectURL(file));
    setPreviewImagens([...previewImagens, ...novosPreviews]);
  }

  function handleRemoveImagem(index: number) {
    const novasImagens = imagensSelecionadas.filter((_, i) => i !== index);
    const novosPreviews = previewImagens.filter((_, i) => i !== index);
    
    // Revogar URL do objeto para liberar memória
    URL.revokeObjectURL(previewImagens[index]);
    
    setImagensSelecionadas(novasImagens);
    setPreviewImagens(novosPreviews);
  }

  function handleDropFiles(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const target = e.currentTarget as HTMLDivElement;
    target.style.borderColor = "#d0d0d0";
    target.style.backgroundColor = "#fafafa";
    
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files).filter(file => file.type.startsWith('image/'));
    if (filesArray.length === 0) {
      toast.warning("Por favor, selecione apenas arquivos de imagem!", { position: "top-right", autoClose: 5000 });
      return;
    }

    const totalImagens = imagensSelecionadas.length + filesArray.length;

    if (totalImagens > 10) {
      toast.warning(`Você pode adicionar no máximo 10 imagens. Você já selecionou ${imagensSelecionadas.length} e tentou adicionar ${filesArray.length}.`, { position: "top-right", autoClose: 5000 });
      return;
    }

    const novasImagens = [...imagensSelecionadas, ...filesArray];
    setImagensSelecionadas(novasImagens);

    const novosPreviews = filesArray.map(file => URL.createObjectURL(file));
    setPreviewImagens([...previewImagens, ...novosPreviews]);

    // Atualizar o input file
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) {
      const dataTransfer = new DataTransfer();
      novasImagens.forEach(file => dataTransfer.items.add(file));
      input.files = dataTransfer.files;
    }
  }

  function handleOpenConfirm({ id_galeria, id_imagem }) {
    setIdGaleria(id_galeria);
    setIdImagen(id_imagem);
    setModalConfirm(true);
  }

  function handleCloseConfirm() {
    Router.reload();
    setModalConfirm(false);
  }

  async function handleModalGaleriaOpen({ id_galeria }) {
    try {
      const apiClient = getAPIClient();
      
      // Buscar informações da galeria para obter o título
      const galeriaAtual = galeriasList.find(g => g.id_galeria === id_galeria);
      if (galeriaAtual) {
        setGaleriaTitulo(galeriaAtual.titulo || "Galeria");
      }
      
      const resImagens = await apiClient.get("/getImagens", {
        params: { id_galeria: id_galeria },
      });

      if (!resImagens.data || !Array.isArray(resImagens.data)) {
        toast.warning("Nenhuma imagem encontrada para esta galeria!", { position: "top-right", autoClose: 5000 });
        setImagensGaleria([]);
        setIdGaleria(id_galeria);
        setModalGaleria(true);
        return;
      }

      const imagens = await Promise.all(
        resImagens.data.map(async (imagem) => {
          try {
            const img = await apiClient({
              method: "GET",
              url: "getImagem",
              params: { id: imagem.id },
              responseType: "blob",
            });
            return {
              imagen: URL.createObjectURL(img.data),
              id: imagem.id,
            };
          } catch (error) {
            console.error("Erro ao carregar imagem:", error);
            return null;
          }
        })
      );

      // Filtrar valores null
      const imagensValidas = imagens.filter(img => img !== null);
      
      setIdGaleria(id_galeria);
      setImagensGaleria(imagensValidas);
      setModalGaleria(true);
    } catch (error) {
      console.error("Erro ao abrir modal de galeria:", error);
      toast.error("Erro ao carregar imagens da galeria!", { position: "top-right", autoClose: 5000 });
    }
  }

  function handleModalGaleriaClose() {
    setModalGaleria(false);
  }

  async function handleRemoverGaleria() {
    const resDelete = await api.delete("deleteGaleria", {
      params: { id_galeria: idGaleria, id_imagem: idImagem },
    });
    toast.error("Os dados foram removidos!", { position: "top-right", autoClose: 5000 });
    setModalConfirm(false);
    Router.push("/listarGalerias");
  }

  async function handleAddImagens(data) {
    try {
      // Verificar se há arquivos selecionados
      if (imagensSelecionadas.length === 0) {
        toast.warning("Selecione pelo menos uma imagem!", { position: "top-right", autoClose: 5000 });
        return;
      }

      // Validar ID da galeria
      if (!data.id_galeria) {
        toast.error("ID da galeria não encontrado!", { position: "top-right", autoClose: 5000 });
        return;
      }

      setIsUploading(true);

      // Criar FormData com todas as imagens de uma vez
      const formData = new FormData();
      formData.append("id_galeria", String(data.id_galeria));
      
      // Adicionar todas as imagens ao FormData com o mesmo nome "imagem"
      // Isso permite que o servidor receba múltiplos arquivos
      imagensSelecionadas.forEach((imagem) => {
        if (imagem && imagem instanceof File) {
          formData.append("imagem", imagem);
        }
      });

      const apiClient = getAPIClient();
      const response = await apiClient.post("/addImagensGaleria", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Verificar resposta do servidor
      if (response.data && response.data.success) {
        const mensagem = response.data.message || `${imagensSelecionadas.length} ${imagensSelecionadas.length === 1 ? "imagem adicionada" : "imagens adicionadas"} com sucesso!`;
        toast.success(mensagem, { position: "top-right", autoClose: 5000 });
        
        // Se houver avisos (algumas imagens falharam), mostrar também
        if (response.data.warnings) {
          toast.warning(response.data.warnings, { position: "top-right", autoClose: 7000 });
        }
      } else {
        const errorMsg = response.data?.message || response.data?.error || "Erro ao adicionar imagens";
        throw new Error(errorMsg);
      }

      // Limpar estados e fechar modal
      setImagensSelecionadas([]);
      setPreviewImagens([]);
      setModalVisible(false);
      setIsUploading(false);
      
      // Recarregar a galeria para mostrar as novas imagens
      if (idGaleria) {
        handleModalGaleriaOpen({ id_galeria: idGaleria });
      } else {
        Router.reload();
      }
    } catch (error: any) {
      console.error("Erro ao adicionar imagens:", error);
      const errorMessage = error?.response?.data?.message || 
                          error?.response?.data?.error || 
                          error?.message || 
                          "Erro ao adicionar imagens. Verifique o console para mais detalhes.";
      toast.error(errorMessage, { position: "top-right", autoClose: 7000 });
      setIsUploading(false);
    }
  }

  async function handleRemoverImagem(id_imagem) {
    const resDelete = await api.delete("deleteImagem", {
      params: { id_imagem: id_imagem },
    });
    toast.error("Os dados foram removidos!", { position: "top-right", autoClose: 5000 });
    handleModalGaleriaOpen({ id_galeria: idGaleria });
  }

  async function handleShowUpdateModal({ id_galeria }) {
    if (id_galeria) {
      const p = await api.get("getGaleria", {
        params: { id_galeria: id_galeria },
      });
      const galery = p.data.map((r: IGaleria) => {
        return r;
      });
      setGaleria(galery[0]);
    }

    setModalUpdateVisible(true);
  }

  function handleUpdateGaleria(data: IGaleria) {
    console.log(data);
  }

  function handleOnChange(event) {
    const files = event.target.files;
    const imagem = [];
    imagem[0] = URL.createObjectURL(files[0]);

    setImagem(imagem);
  }

  function handleAddGaleria() {
    Router.push("/addGaleria");
  }

  const setOptions = {
    attributesWhitelist: {
      all: "data-id|data-type",
    },
    defaultTag: "p",
  };

  const { usuario } = useContext(AuthContext);
   async function handleSignOut() {
        signOut();
      }
    
      function handleSimisab() {
            Router.push("/indicadores/home_indicadores");
          }

  // Filtrar galerias baseado no termo de busca
  const galeriasFiltradas = galeriasList.filter(
    (galeria) =>
      galeria.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (galeria.descricao && galeria.descricao.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (galeria.mes && galeria.mes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (galeria.ano && galeria.ano.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Container>
      {/* <MenuSuperior usuarios={[]}></MenuSuperior> */}
       <HeadIndicadores usuarios={[]}></HeadIndicadores>
              <DivMenuTitulo> 
                    <span style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      padding: '15px 20px',
                      float: 'left'
                      }}>
                       Painel de Edição 
                      </span>
                    <ul style={{}}>
                    <MenuMunicipioItem style={{marginRight: '18px'}}  onClick={handleSignOut}>Sair</MenuMunicipioItem>
                    <MenuMunicipioItem onClick={handleSimisab}>SIMISAB</MenuMunicipioItem>
                    </ul>
              </DivMenuTitulo>
      <BodyDashboard>
        <Sidebar />
      <DivCenter>
        <div
          style={{
            marginBottom: "20px",
            borderBottom: "1px solid rgb(162, 160, 160)",
            textAlign: "center",
          }}
        >
          <h2>Lista de Galerias</h2>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div style={{ position: "relative", width: "30%" }}>
            <input
              type="text"
              placeholder="Buscar por título, descrição, mês ou ano..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 40px 10px 10px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "16px",
              }}
            />
            <FaSearch
              style={{
                position: "absolute",
                right: "-35px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#666",
                fontSize: "18px",
                pointerEvents: "none",
              }}
            />
          </div>
          <BotaoAdicionar
            onClick={handleAddGaleria}
            style={{ marginLeft: "10px", display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}
          >
            <FaPlus /> Nova Galeria
          </BotaoAdicionar>
        </div>

        <div style={{ width: "100%" }}>
          {galeriasFiltradas.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <p>Nenhuma galeria encontrada.</p>
            </div>
          ) : (
            galeriasFiltradas.map((galeria) => (
              <div key={galeria.id_galeria} style={{ marginBottom: "15px" }}>
                <div
                  style={{
                    backgroundColor: "#f8f9fa",
                    padding: "20px",
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>
                        {galeria.titulo}
                      </h3>
                      {galeria.descricao && (
                        <p style={{ margin: "0 0 10px 0", color: "#666" }}>
                          {galeria.descricao}
                        </p>
                      )}
                      <div style={{ fontSize: "14px", color: "#888" }}>
                        {galeria.mes && <span>Mês: {galeria.mes}</span>}
                        {galeria.ano && (
                          <span style={{ marginLeft: "15px" }}>Ano: {galeria.ano}</span>
                        )}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginLeft: "20px",
                        flexWrap: "wrap",
                      }}
                    >
                      <BotaoEditar 
                        onClick={() => Router.push(`/addGaleria?id=${galeria.id_galeria}`)}
                        style={{ backgroundColor: "#28a745", display: "flex", alignItems: "center", gap: "6px" }}
                      >
                        <FaEdit /> Editar
                      </BotaoEditar>
                      <BotaoEditar onClick={() => handleShowModal(galeria)} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <FaUpload /> Adicionar imagens
                      </BotaoEditar>
                      <BotaoVisualizar
                        onClick={() =>
                          handleModalGaleriaOpen({
                            id_galeria: galeria.id_galeria,
                          })
                        }
                        style={{ display: "flex", alignItems: "center", gap: "6px" }}
                      >
                        <FaEye /> Visualizar imagens
                      </BotaoVisualizar>
                      <BotaoRemover
                        onClick={() =>
                          handleOpenConfirm({
                            id_galeria: galeria.id_galeria,
                            id_imagem: galeria.id_imagem,
                          })
                        }
                        style={{ display: "flex", alignItems: "center", gap: "6px" }}
                      >
                        <FaTrash /> Remover
                      </BotaoRemover>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DivCenter>
      </BodyDashboard>

      <Footer>&copy; Todos os direitos reservados</Footer>
      {isModalConfirm && (
        <ContainerModal>
          <Modal>
            <ConteudoModal>
              <TituloModal>
                <h3>
                  <b>Você confirma a exclusão!</b>
                </h3>
              </TituloModal>
              <ConfirmModal>
                <CancelButton onClick={handleCloseConfirm}>
                  <b>Cancelar</b>
                </CancelButton>
                <ConfirmButton onClick={() => handleRemoverGaleria()}>
                  <b>Confirmar</b>
                </ConfirmButton>
              </ConfirmModal>
            </ConteudoModal>
          </Modal>
        </ContainerModal>
      )}

      {isModalVisible && (
        <ContainerModal>
          <Modal style={{ maxWidth: "600px", width: "90%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid #e0e0e0" }}>
              <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "600", color: "#333", display: "flex", alignItems: "center", gap: "10px" }}>
                <FaImage style={{ color: "rgb(18, 113, 172)" }} />
                Adicionar Imagens
              </h2>
              <CloseModalButton onClick={handleCloseModal} title="Fechar">
                <FaTimes />
              </CloseModalButton>
            </div>
            <Form onSubmit={handleSubmit(handleAddImagens)}>
              <input
                {...register("id_galeria")}
                type="hidden"
                value={isGaleria.id_galeria}
              />
              <ConteudoModal style={{ marginTop: 0 }}>
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", marginBottom: "12px", fontSize: "16px", fontWeight: "500", color: "#333" }}>
                    Selecione imagens (máximo 10)
                  </label>
                  {imagensSelecionadas.length > 0 && (
                    <div style={{ marginBottom: "12px", fontSize: "14px", color: "#666" }}>
                      {imagensSelecionadas.length} de 10 imagens selecionadas
                    </div>
                  )}
                  <div
                    style={{
                      border: "2px dashed #d0d0d0",
                      borderRadius: "8px",
                      padding: "40px 20px",
                      textAlign: "center",
                      backgroundColor: "#fafafa",
                      transition: "all 0.3s ease",
                      cursor: imagensSelecionadas.length >= 10 ? "not-allowed" : "pointer",
                      position: "relative",
                      opacity: imagensSelecionadas.length >= 10 ? 0.6 : 1,
                    }}
                    onDragOver={(e) => {
                      if (imagensSelecionadas.length >= 10) return;
                      e.preventDefault();
                      e.currentTarget.style.borderColor = "rgb(18, 113, 172)";
                      e.currentTarget.style.backgroundColor = "#f0f7ff";
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.style.borderColor = "#d0d0d0";
                      e.currentTarget.style.backgroundColor = "#fafafa";
                    }}
                    onDrop={handleDropFiles}
                    onClick={() => {
                      if (imagensSelecionadas.length >= 10) {
                        toast.warning("Você já selecionou o máximo de 10 imagens!", { position: "top-right", autoClose: 5000 });
                        return;
                      }
                      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
                      input?.click();
                    }}
                  >
                    <input
                      {...register("imagem")}
                      type="file"
                      accept="image/*"
                      multiple
                      style={{ display: "none" }}
                      onChange={handleFileSelect}
                      disabled={imagensSelecionadas.length >= 10}
                    />
                    {imagensSelecionadas.length === 0 ? (
                      <>
                        <FaUpload style={{ fontSize: "48px", color: "#999", marginBottom: "16px" }} />
                        <p style={{ margin: "8px 0", fontSize: "16px", color: "#666" }}>
                          Clique para selecionar ou arraste imagens aqui
                        </p>
                        <p style={{ margin: "4px 0", fontSize: "14px", color: "#999" }}>
                          Formatos aceitos: JPG, PNG, GIF, WEBP (máximo 10 imagens)
                        </p>
                      </>
                    ) : (
                      <div style={{ textAlign: "left" }}>
                        <div style={{ 
                          display: "grid", 
                          gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", 
                          gap: "12px",
                          marginBottom: "16px"
                        }}>
                          {previewImagens.map((preview, index) => (
                            <div
                              key={index}
                              style={{
                                position: "relative",
                                borderRadius: "8px",
                                overflow: "hidden",
                                border: "1px solid #e0e0e0",
                                aspectRatio: "1",
                                backgroundColor: "#f5f5f5",
                              }}
                            >
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveImagem(index);
                                }}
                                style={{
                                  position: "absolute",
                                  top: "4px",
                                  right: "4px",
                                  background: "rgba(220, 53, 69, 0.9)",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "50%",
                                  width: "24px",
                                  height: "24px",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "14px",
                                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                                  padding: 0,
                                }}
                              >
                                ×
                              </button>
                              <div style={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background: "rgba(0,0,0,0.6)",
                                color: "white",
                                fontSize: "10px",
                                padding: "4px",
                                textAlign: "center",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}>
                                {imagensSelecionadas[index].name}
                              </div>
                            </div>
                          ))}
                        </div>
                        {imagensSelecionadas.length < 10 && (
                          <div style={{ textAlign: "center", marginTop: "16px" }}>
                            <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#666" }}>
                              Você pode adicionar mais {10 - imagensSelecionadas.length} {10 - imagensSelecionadas.length === 1 ? "imagem" : "imagens"}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #e0e0e0" }}>
                  <CancelButton type="button" onClick={handleCloseModal} disabled={isUploading}>
                    Cancelar
                  </CancelButton>
                  <SubmitButton
                    type="submit"
                    disabled={imagensSelecionadas.length === 0 || isUploading}
                    style={{
                      padding: "12px 24px",
                      background: imagensSelecionadas.length === 0 || isUploading ? "#ccc" : "rgb(18, 113, 172)",
                      border: "none",
                      borderRadius: "6px",
                      cursor: imagensSelecionadas.length === 0 || isUploading ? "not-allowed" : "pointer",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#fff",
                      transition: "all 0.2s",
                      opacity: imagensSelecionadas.length === 0 || isUploading ? 0.6 : 1,
                    }}
                    onMouseOver={(e) => {
                      if (imagensSelecionadas.length > 0 && !isUploading) {
                        e.currentTarget.style.background = "rgb(14, 90, 138)";
                      }
                    }}
                    onMouseOut={(e) => {
                      if (imagensSelecionadas.length > 0 && !isUploading) {
                        e.currentTarget.style.background = "rgb(18, 113, 172)";
                      }
                    }}
                  >
                    {isUploading ? (
                      <>Enviando...</>
                    ) : (
                      <>
                        <FaUpload style={{ marginRight: "8px", display: "inline" }} />
                        Adicionar {imagensSelecionadas.length > 0 ? `${imagensSelecionadas.length} ${imagensSelecionadas.length === 1 ? "Imagem" : "Imagens"}` : "Imagens"}
                      </>
                    )}
                  </SubmitButton>
                </div>
              </ConteudoModal>
            </Form>
          </Modal>
        </ContainerModal>
      )}

      {isModalGaleria && (
        <ContainerModal>
          <ModalGaleria>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              marginBottom: "24px", 
              paddingBottom: "16px", 
              borderBottom: "1px solid #e0e0e0" 
            }}>
              <h2 style={{ 
                margin: 0, 
                fontSize: "24px", 
                fontWeight: "600", 
                color: "#333", 
                display: "flex", 
                alignItems: "center", 
                gap: "10px" 
              }}>
                <FaImage style={{ color: "rgb(18, 113, 172)" }} />
                {galeriaTitulo || "Visualizar Imagens"}
              </h2>
              <CloseModalButton onClick={handleModalGaleriaClose} title="Fechar">
                <FaTimes />
              </CloseModalButton>
            </div>

            <ContainerImagems>
              {imagensGaleria && imagensGaleria.length > 0 ? (
                <>
                  <div style={{ 
                    marginBottom: "16px", 
                    fontSize: "14px", 
                    color: "#666" 
                  }}>
                    Total de {imagensGaleria.length} {imagensGaleria.length === 1 ? "imagem" : "imagens"}
                  </div>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: "20px",
                    width: "100%",
                  }}>
                    {imagensGaleria.map((imagem, key) => (
                      <div
                        key={key}
                        style={{
                          position: "relative",
                          backgroundColor: "#fff",
                          borderRadius: "8px",
                          border: "1px solid #e0e0e0",
                          overflow: "hidden",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
                          e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                      >
                        <div style={{ position: "relative", paddingTop: "75%", backgroundColor: "#f5f5f5" }}>
                          <img
                            onClick={() => handleImagemAmpliada(imagem.imagen)}
                            src={imagem.imagen}
                            alt={`Imagem ${key + 1}`}
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              cursor: "pointer",
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              top: "8px",
                              right: "8px",
                              display: "flex",
                              gap: "8px",
                            }}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleImagemAmpliada(imagem.imagen);
                              }}
                              style={{
                                background: "rgba(18, 113, 172, 0.9)",
                                border: "none",
                                borderRadius: "4px",
                                padding: "6px 10px",
                                color: "#fff",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                fontSize: "12px",
                                fontWeight: "500",
                                transition: "all 0.2s",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = "rgba(18, 113, 172, 1)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = "rgba(18, 113, 172, 0.9)";
                              }}
                            >
                              <FaEye />
                              Ver
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoverImagem(imagem.id);
                              }}
                              style={{
                                background: "rgba(220, 53, 69, 0.9)",
                                border: "none",
                                borderRadius: "4px",
                                padding: "6px 10px",
                                color: "#fff",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                fontSize: "12px",
                                fontWeight: "500",
                                transition: "all 0.2s",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = "rgba(220, 53, 69, 1)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = "rgba(220, 53, 69, 0.9)";
                              }}
                            >
                              <FaTrash />
                              Remover
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ 
                  textAlign: "center", 
                  padding: "60px 20px",
                  color: "#999"
                }}>
                  <FaImage style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.5 }} />
                  <p style={{ fontSize: "16px", margin: 0 }}>
                    Nenhuma imagem encontrada nesta galeria.
                  </p>
                </div>
              )}
            </ContainerImagems>
          </ModalGaleria>
        </ContainerModal>
      )}

      {modalImagemAmpliada && (
        <ContainerModal>
          <ModalImgAmpliada>
            <CloseModalButton onClick={handleCloseModalImgAmpliada} title="Fechar">
              <FaTimes />
            </CloseModalButton>
            <ImagenAmpliada>
              <img src={`${imagemAmpliada}`} />
            </ImagenAmpliada>
          </ModalImgAmpliada>
        </ContainerModal>
      )}

      {isModalUpdateVisible && (
        <ContainerModal>
          <Modal>
            <CloseModalButton onClick={handleCloseModal} title="Fechar">
              <FaTimes />
            </CloseModalButton>
            <FormModal onSubmit={handleSubmit(handleUpdateGaleria)}>
              <ConteudoModal>
                <TituloModal>
                  <input
                    type="hidden"
                    {...register("id_galeria")}
                    value={isGaleria.id_galeria}
                    onChange={handleOnChange}
                    name="id_galeria"
                  />

                  <label>Titulo</label>
                  <input
                    {...register("titulo")}
                    defaultValue={isGaleria.titulo}
                    onChange={handleOnChange}
                    name="titulo"
                  />
                </TituloModal>
              </ConteudoModal>
              <SubmitButton type="submit">Gravar</SubmitButton>
            </FormModal>
          </Modal>
        </ContainerModal>
      )}
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps<GaleriaProps> = async (
  ctx
) => {
  const apiClient = getAPIClient(ctx);
  const { ["tedplan.token"]: token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const res = await apiClient.get("/listGalerias");
  const galerias = await res.data;
  //const res = await apiClient.get('/getUsuario', { params: { id_usuario: 1 }})

  return {
    props: {
      galerias,
    },
  };
};
