import styled from "styled-components";

export const Container = styled.div`
  color: #fff;
  font-family: Arial, Helvetica, sans-serif;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  padding: 0;
  margin: 0;
  justify-content: center;
  align-items: center;
  h1 {
    font-size: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  img {
    width: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  small {
    font-size: 14px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

export const Lista = styled.div`
  color: #666;

  width: 100%;
  ul {
    list-style-type: none;
  }
  li {
    background: #eee;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px 10px 10px 10px;
    margin: 10px;
  }
  label {
    color: blue;
  }
`;

export const DivLogout = styled.aside`
  width: 80px;
  height: 30px;
  display: flex;
  float: right;
  margin: 30px;
`;

export const Logout = styled.button`
  width: 80px;
  height: 30px;
  border-radius: 3px;
  border: 1px solid #999;
  background: #444;
  color: #fff;
  font-weight: bold;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    border-color: red;
    color: red;
  }
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    margin-left: 8px;
  }
`;

export const BotaoVisualizar = styled.button`
  float: right;
  padding: 5px;
  background: #0088ff;
  margin-top: -4px;
  border: none;
  color: #fff;
  border-radius: 3px;
  cursor: pointer;
  margin-right: 5px;
`;
export const BotaoEditar = styled.button`
  float: right;
  padding: 5px;
  background: green;
  margin-top: -4px;
  border: none;
  color: #fff;
  border-radius: 3px;
  cursor: pointer;
  margin-right: 5px;
`;

export const BotaoAdicionar = styled.div`
  float: left;
  padding: 10px;
  background: #008080;
  margin-top: 5px;
  border: none;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
`;
export const BotaoRemover = styled.button`
  float: right;
  padding: 5px;
  background: red;
  margin-top: -4px;
  border: none;
  color: #fff;
  border-radius: 3px;
  cursor: pointer;
`;

export const Menu = styled.div`
  width: 100%;
  margin: 0;
  padding: 0;
  background: #fff;
  // border-bottom: solid 1px #ccc;
  color: #666;
  float: left;
  position: fixed;
  box-shadow: 1px 5px 5px rgba(0, 0, 0, 0.3);
`;

export const ListPost = styled.table`
  width: 100%;
  margin: 5px 0px 5px 00px;
  text-align: center;
  border-radius: 3px;
  float: left;
  color: #fff;
  text-align: center;
  border-collapse: collapse;
  thead {
    th {
      padding: 10px;
    }
    tr {
      background: #134a55;
    }
  }
  tbody {
    tr:nth-child(even) {
      background: #eee;
    }
    td {
      padding: 10px 10px;
      background: #70b8c2;
      border: solid 1px #fff;
      color: #134a55;
    }
  }
`;
export const Logo = styled.div`
  width: 100px;
  padding: 10px;
  float: left;
`;

export const UsuarioAvatar = styled.div`
  width: 50px;
  padding: 5px;
  margin: 10px 0 10px 0;
  float: right;
  border-radius: 10px;
  border: 1px solid #008080;
  font-size: 12px;
  img {
    width: 100px;
  }
`;

export const UsuarioLogado = styled.div`
  width: 100px;
  padding: 5px;
  margin-top: 10px;
  float: right;
  border-radius: 10px;
  font-size: 10px;
  text-align: center;
`;

export const ItensMenu = styled.div`
  float: right;
  margin: 50px 0 0 0;
  ul {
    text-align: right;
  }
  li {
    cursor: pointer;
    display: inline;
    margin-right: 20px;
    color: #666;
    padding: 15px;
    &:hover {
      color: #000;
    }
  }

  button {
    cursor: pointer;
    border: none;
    color: #666;
  }

  Link {
    text-decoration: none;
  }
`;

export const DivCenter = styled.div`
  max-width: 85%;
  width: 100%;
  min-height: calc(100vh - 100px);
  overflow-y: auto;
  overflow-x: hidden;
  /* background: #fff; */
  margin-left: auto;
  margin-right: auto; 
  display: flex;
  flex-direction: column;
  padding: 10px 20px 20px 20px;
  box-sizing: border-box;

  /* Estilizar a barra de rolagem */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  // &::-webkit-scrollbar-thumb {
  //   background: #0085bd;
  //   border-radius: 4px;
  // }

  &::-webkit-scrollbar-thumb:hover {
    background: #006a9e;
  }

  @media (max-width: 1000px) {
    min-height: calc(100vh - 100px);
    padding: 10px;
  }
`;

export const BodyDashboard = styled.div`  
  width: 100%;
  min-height: 100vh;
  background: #f3f4f6;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
  display: flex;
  position: relative;
  overflow-x: hidden;
  box-sizing: border-box;
`;
export const DivInstrucoes = styled.div`
  justify-content: left;
  padding: 10px;
  align-items: left;
  border: 2px solid #2dd9d0;
  border-radius: 5px;
  width: 100%;
  height: 100px;
  color: #666;
`;

export const DivInput = styled.div`
  float: left;
  flex-direction: column;
  display: flex;
`;

export const Form = styled.form`
  margin: 30px 10px 30px 10px;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  input {
    border: 2px solid #2dd9d0;
    border-radius: 5px;
    padding: 10px 15px;
    margin: 10px;
    width: 400px;
    color: #666;
  }

  input #data {
    border: 2px solid #2dd9d0;
    border-radius: 5px;
    padding: 10px 15px;
    margin: 10px;
    width: 100px;
    color: #666;
  }
  input:focus-within {
    border-color: 2px solid #008080;
  }

  textarea {
    border: 1px solid #eee;
    border-radius: 5px;
    padding: 10px 15px;
    margin: 10px;
    width: 100%;
    height: 200px;
    border: 2px solid #2dd9d0;
  }
  label {
    color: #666;
    margin: 10px 0 0 15px;
    float: left;
  }

  select {
    border: 2px solid #2dd9d0;
    border-radius: 5px;
    padding: 10px 15px;
    margin: 10px;
    width: 432px;
    background: #fff;
  }
  option {
   
    padding: 10px 15px;
   
  }
  span {
    color: #666;
    font-size: 12px;
    margin-left: 20px;
  }
`;

export const InputData = styled.div`
  input {
    border: 2px solid #2dd9d0;
    border-radius: 5px;
    padding: 10px 15px;
    margin: 10px;
    width: 100px;
    color: #666;
  }
`;
export const SubmitButton = styled.button`
  padding: 10px 15px;
  margin: 10px;
  font-weight: bold;
  color: #fff;
  border: 0px;
  background: #0085bd;
  border-radius: 7px;
  flex-direction: row;
  cursor: pointer;
  width: auto;
  height: 37px;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    margin-right: 8px;
  }

  &:hover{
  background: #006666;
  }
`;

export const NewButton = styled.button`
  padding: 10px 15px;
  margin: 10px;
  color: #fff;
  border: 0px;
  background: #0088ff;
  border-radius: 3px;
  flex-direction: row;
  cursor: pointer;
  display: flex;
  justify-content: left;
  align-items: left;
  float: left;
  svg {
    margin-right: 8px;
  }
`;

export const Footer = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  border-top: solid 1px silver;
  color: silver;
  background: #444;
  text-align: center;
  padding: 5px;
  font-size: 11px;
`;

export const ContainerModal = styled.div`
 position: fixed;
  z-index: 9;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
`;

export const Modal = styled.div`
  min-width: 520px;
  max-width: 1200px;
  min-height: 100px;  
  background-color: #ffffff;
  border: 1px solid #bebebe;
  border-radius: 5px;
  padding: 12px 16px 32px 16px;
  marginBottom: 20px;
  
`;

export const ModalGaleria = styled.div`
  width: 1200px;
  min-height: 700px;
  margin-top: 180px;
  background-color: #ffffff;
  border: 1px solid #bebebe;
  border-radius: 5px;
  padding: 12px 16px;
`;

export const ConteudoModal = styled.div`
  width: 100%;
  
  font-size: 14px;
  display: flex;
  flex-direction: column;
  input {
    border: 2px solid #2dd9d0;
    border-radius: 5px;
    padding: 10px 15px;
    margin: 10px;
    width: 100%;
    color: #666;
    float: left;
  }
  label {
    color: #666;
    margin: 10px 0 0 15px;
    float: left;
  }

  select {
    border: 2px solid #2dd9d0;
    border-radius: 5px;
    padding: 10px 15px;
    margin: 10px;
    width: 500px;
    background: #fff;
  }
  option {
   
    padding: 10px 15px;
    margin: 10px;
   
  }
  p {
    color: #000;
    font-size: 16px;
    padding: 5px 0;
    margin-left: 20px;
  }
  img {
    text-align: left;
    float: left;
    width: 50px;
    margin: 10px;
  }
`;

export const ContainerImagems = styled.div`
  width: 100%;
  
  font-size: 14px;
  display: flex;
  flex-direction: row;
  
`;

export const ImagemModal = styled.div`
  flex-direction: column;
  display: flex;
  text-align: left;
  width: 100px;
  padding: 10px;
  img {
    width: 150px;
  }
`;

export const ImagemGaleria = styled.div`
  float: left;
  text-align: left;
  min-width: 200px;
  min-height: 250px;
  margin: 10px;
  border-radius: 5px;
  border: solid 1px #2dd9d0;
  align-items: center;
  text-align: center;
  img {
    text-align: center;
    float: left;
    width: 50px;
    margin: 10px 10px 10px 5px;
  }
`;

export const ImagensGaleria = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  min-width: 120px;
  min-height: 180px;
  margin: 10px;
  border-radius: 5px;
  border: solid 1px #2dd9d0;
 
  img {
    text-align: center;
    display: flex;
    align-items: center;
    width: 100px;
    margin: 10px 10px 10px 10px;
  }
  button {
    border: none;
    color: #fff;
    background-color: red;
    padding: 5px;
    border-radius: 3px;
    margin-top: 5px;
    cursor: pointer;
    
  }
`;

export const ModalImgAmpliada = styled.div`
  width: 600px;
  min-height: 700px;
  margin-top: 180px;
  background-color: #ffffff;
  border: 1px solid #bebebe;
  border-radius: 5px;
  padding: 12px 16px;
  
`;

export const ImagenAmpliada = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  
  margin: 10px;
  img{
    display: flex;
    width: 90%;
  }
 
`;


export const TituloModal = styled.div`
  flex-direction: column;
  display: flex;
  text-align: center;
  padding: 10px 0PX;
  float: left;
  width: 100%;
  font-size: 18px;
  input {
    border: 2px solid #2dd9d0;
    border-radius: 5px;
    padding: 10px 15px;
    margin-top: 10px;
    width: 500px;
    color: #000;
    float: left;
  }
  label {
    margin-left: 15px;
    float: left;
    text-align: left;
    font-size: 14px;
  }
  a {
    text-decoration: none;
    color: #fff;
    text-align: left;
  }
  button {
    border-radius: 5px;
    border:  none;
    margin: 10px 0px 0px 10px;
    width: 300px;
    padding: 10px;
    float: left;
    
    background-color: blue;
  }
`;
export const TextoModal = styled.div`
  text-align: left;
  min-width: 520px;
  min-height: 200px;
  border: 2px solid #2dd9d0;
  float: left;
  width: 100%;
  font-size: 14px;
  textarea {
    border: 1px solid #eee;
    border-radius: 5px;
    padding: 10px 15px;
    margin: 10px;
    width: 550px;
    height: 200px;
    border: 2px solid #2dd9d0;
  }
`;

export const ConfirmModal = styled.div`
  text-align: left;
  min-width: 300px;
  float: left;
  width: 100%;
  font-size: 14px;
`;
export const FormModal = styled.form`
  display: flex;

  table{
    width: 80%;
    float: left;
    th{
      text-align: center;
      color: #999;
    }
  }
`;

export const CloseModalButton = styled.button`
  padding: 8px 12px;
  color: #666;
  border: 1px solid #e0e0e0;
  background: #fff;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  font-weight: 500;
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #f5f5f5;
    border-color: #ccc;
    color: #333;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }

  &:active {
    background: #ebebeb;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  svg {
    margin: 0;
  }
`;

export const ConfirmButton = styled.button`
  cursor: pointer;
  padding: 10px 15px;
  margin: 10px;
  color: #fff;
  border: 0px;
  background: #008080;
  border-radius: 3px;
  flex-direction: row;
  float: right;
  text-align: right;
  justify-content: right;
  align-items: right;
  svg {
    margin-right: 8px;
  }
`;
export const CancelButton = styled.button`
  padding: 10px 15px;
  margin: 10px;
  font-weight: bold;
  color: #fff;
  border: 0px;
  background: #dc3545;
  border-radius: 7px;
  flex-direction: row;
  cursor: pointer;
  width: auto;
  height: 37px;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    margin-right: 8px;
  }

  &:hover{
  background:rgb(161, 9, 24);
  }
`;