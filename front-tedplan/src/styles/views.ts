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

export const BotaoGaleria = styled.button`
  float: left;
  padding: 5px 10px;
  background: #0088ff;
  border: none;
  color: #fff;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
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
  background: #eee;
  border-bottom: solid 1px #ccc;
  color: #666;
  float: left;
`;

export const DivListPost = styled.table`
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
      background: #008080;
    }
  }
  tbody {
    tr:nth-child(even) {
      background: #eee;
    }
    td {
      padding: 10px 10px;
      background: #2dd9d0;
      border: solid 1px #fff;
      color: #666;
    }
  }
`;
export const Logo = styled.div`
  width: 200px;
  padding: 10px;
  float: left;
`;

export const Logo_si = styled.div`
  width: 100px;
  padding: 10px 10px 0 10px;
  float: left;
`;

export const ItensMenu = styled.div`
  float: right;
  margin: 80px 0 0 0;
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
`;

export const UsuarioAvatar = styled.div`
  width: 70px;
  padding: 5px;
  margin: 20px 0 10px 0;
  float: right;
  border-radius: 10px;
  border: 2px solid #008080;
  font-size: 12px;
  img {
    width: 100px;
  }
`;

export const UsuarioLogado = styled.div`
  width: 100px;
  padding: 5px;
  margin-top: 30px;
  float: right;
  border-radius: 10px;
  font-size: 10px;
  text-align: center;
`;

export const DivCenter = styled.div`
  max-width: 90%;
  width: 100%;
  height: 100%;
  background: #fff;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50px;
  text-align: left;
  justify-content: left;
  align-items: left;
  padding: 20px;
  display: flex;
`;

export const MenuLateral = styled.div`
  width: 200px;
  height: 600px;
  margin: 0;
  padding: 0;
  color: #666;
  float: left;

  ul {
    margin-top: 20px;
    list-style-type: none;
    text-align: left;
  }
  li {
    border-radius: 5px;
    width: 150px;
    cursor: pointer;
    margin-left: 20px;
    padding: 10px;
    color: #666;

    &:hover {
      color: #000;
      background: #2dd9d0;
    }
  }
`;
export const DivFormConteudo = styled.div`
  width: 100%;
  height: 100%;
  margin-left: 10px;
  padding: 10px 0px 10px 0px;
  color: #666;
  float: left;
`;

export const Lista = styled.div`
  color: #666;
  width: 100%;
  float: left;
  margin-top: 20px;
  display: flex;
  border-top: solid 3px #2dd9d0; 
  text-align: left;
  justify-content: left;
  align-items: left;
`;
export const HeaderLista = styled.div`
  color: #000;
  width: 100%;
  float: left;
  display: flex;
  border-top: solid 3px #2dd9d0;
  margin-top: 20px;  
  text-align: left;
  justify-content: left;
  align-items: left;
`;

export const FooterLista = styled.div`
  color: #000;
  width: 100%;
  float: left;
  display: flex;
  border-top: solid 3px #2dd9d0;
  text-align: left;
  justify-content: left;
  align-items: left;
`;

export const ColunaLista = styled.div`
  
`;

export const ColTitulo = styled.div`
  width: 450px;
  float: left;
  flex-direction: column;
  display: flex;
  padding: 10px 0;  
  margin: 10px;
  
`;
export const Collink = styled.div`
  width: 200px;
  float: left;
  flex-direction: column;
  display: flex;
  padding: 10px 0;  
  margin: 10px;
  
`;
export const ColEixo = styled.div`
  width: 150px;
  float: left;
  flex-direction: column;
  display: flex;
  padding: 10px 0;  
  margin: 10px;
  
`;
export const ColTipo = styled.div`
  width: 100px;
  float: left;
  flex-direction: column;
  display: flex;
  padding: 10px 0;  
  margin: 10px;
  
`;
export const ColStatus = styled.div`
  width: 100px;
  float: left;
  flex-direction: column;
  display: flex;
  padding: 10px 0;  
  margin: 10px;
  
`;
export const ColData = styled.div`
  width: 100px;
  float: left;
  flex-direction: column;
  display: flex;
  padding: 10px 0;  
  margin: 10px;
  
`;
export const ColAcoes = styled.div`
  width: 40px;
  float: left;
  flex-direction: column;
  display: flex;
  padding: 10px 0;  
  margin: 10px;
  size: 14px;
  align-items: center;
  
`;
export const ColAcoesButton = styled.button`
   background: none;
    border: none;
    padding: 0 10px;
    float: left; 
    cursor: pointer;
`;

export const ImagemLista = styled.div`
  width: 170px;

  padding: 15px;
  float: left;
  border-radius: 5px;
  border: solid 2px #2dd9d0;
  margin-top: 30px;
  img {
    border: solid 1px #2dd9d0;
    width: 100%;
    border-radius: 5px;
  }
`;

export const TextoLista = styled.div`
  width: auto;
  padding: 10px;
  float: left;
  margin-top: 30px;
  p {
    margin-top: 20px;
  }
  a {
    text-decoration: none;
    background: #2271b3;
    border: none;
    border-radius: 4px;
    padding: 7px 10px;
    color: #fff;
    cursor: pointer;
  }
`;

export const DivCenterHead = styled.div`
  max-width: 80%;
  width: 100%;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
  justify-content: left;
  align-items: left;
  flex-direction: column;
`;
export const TextoHead = styled.div`
  color: #008080;
  padding-top: 40px;
  float: left;
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

export const Form = styled.form`
  margin: 10px 10px 10px 0px;
  border-radius: 3px;
  font-size: 14px;
  input {
    border: 2px solid #2dd9d0;
    border-radius: 5px;
    padding: 10px 15px;
    margin: 10px;
    width: 180px;
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
    width: 500px;
    height: 200px;
    border: 2px solid #2dd9d0;
  }
  label {
    color: #666;
    margin: 10px 0 0 15px;
  }

  select {
    border: 2px solid #2dd9d0;
    border-radius: 5px;
    padding: 10px 15px;
    margin: 10px;
    width: 200px;
    background: #fff;
  }
  option {
    border: 1px solid #2dd9d0;
    border-radius: 5px;
    padding: 10px 15px;
    margin: 10px;
    width: 500px;
    background: #fff;
  }
  span {
  }
`;

export const DivInput = styled.div`
  float: left;
  flex-direction: column;
  display: flex;
`;
export const SubmitButton = styled.button`
 padding: 10px 15px;
  margin-top: 38px;
  color: #fff;
  border: 0px;
  background: #008080;
  border-radius: 3px;
  flex-direction: row;
  cursor: pointer;
  width: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  float: left;
  svg {
    margin-right: 8px;
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
   width: 520px;
  min-height: 200px;
  background-color: #fff;
  border: 1px solid #bebebe;
  border-radius: 5px;
  padding: 12px 16px;
`;

export const ImagensGaleria = styled.div`
  float: left;
  text-align: left;
  min-width: 180px;
  min-height: 240px;
  margin: 10px;
  border-radius: 5px;
  border: solid 1px #2dd9d0;
  align-items: center;
  text-align: center;
  img {
    text-align: center;
    float: left;
    width: 160px;
    margin: 10px 10px 10px -10px;
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

export const CloseModalButton = styled.button`
  
  cursor: pointer;
  padding: 10px 15px;
  margin: 10px;
  color: #fff;
  border: 0px;
  background: red;
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

export const ModalGaleria = styled.div`
  width: 1200px;
  min-height: 700px;
  background-color: #ffffff;
  border: 1px solid #bebebe;
  border-radius: 5px;
  padding: 12px 16px;
`;

export const ConteudoModal = styled.div`
  width: 100%;
  float: left;
  text-align: left;
  font-size: 14px;
  input {
    border: 2px solid #2dd9d0;
    border-radius: 5px;
    padding: 10px 15px;
    margin: 10px;
    width: 500px;
    color: #666;
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
    border: 1px solid #2dd9d0;
    border-radius: 5px;
    padding: 10px 15px;
    margin: 10px;
    width: 500px;
    background: #fff;
  }
  p {
    color: #000;
    font-size: 16px;
    padding: 5px 0;
    margin-left: 20px;
  }
`;

export const ImagemModal = styled.div`
  text-align: left;
  float: left;
  width: 150px;

  padding: 10px;
  img {
    width: 150px;
  }
`;

export const TituloModal = styled.div`
  text-align: left;
  float: left;
  width: 100%;
  font-size: 18px;
  input {
    border: 2px solid #2dd9d0;
    border-radius: 5px;
    padding: 10px 15px;
    margin-top: 70px;
    width: 385px;
    color: #000;
  }
`;
export const TextoModal = styled.div`
  text-align: left;
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
export const FormModal = styled.form`
  span {
    color: red;
    font-size: 12px;
    margin-left: 20px;
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
  cursor: pointer;
  padding: 10px 15px;
  margin: 10px;
  color: #fff;
  border: 0px;
  background: red;
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
