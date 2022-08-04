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

export const IconeColeta = styled.div`
  width: 180px;
  margin: 20px;
  cursor: pointer;
  float: left;
    img {
      width: 100px;     
    }
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

export const Menu = styled.div`
  width: 100%;
  margin: 0;
  padding: 0;
  background: #eee;
  border-bottom: solid 1px #ccc;
  color: #666;
  float: left;
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
  max-width: 75%;
  width: 100%;
  height: 100%;
  background: #fff;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
  justify-content: left;
  align-items: left;
  padding: 0px;
  display: flex;
  flex-direction: column;
`;

export const DivMenu = styled.div`
  padding: 10px;
  border-radius: 3px;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
`;

export const MenuMunicipio = styled.div`
  justify-content: center;
  float: left;
  width: 100%;
  background: #0085bd;
`;

export const StatusMunicipio = styled.div`
  padding: 40px 0;
  justify-content: center;
  width: 100%;
  display: flex;
  background: #1caecc;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  font-size: 25px;
  font-weight: bold;
  color: #000;
`;

export const MenuMunicipioItem = styled.div`
  padding: 20px;
  float: right;
  font-size: 15px;
  font-weight: bold;

  ul {
    text-align: right;
  }
  li {
    cursor: pointer;
    display: inline;
    color: #fff;
    padding: 15px;
    &:hover {
      color: #000;
    }
  }
`;
export const Municipio = styled.div`
  padding: 15px 20px;
  float: left;
  font-size: 20px;
  font-weight: bold;
`;

export const MunicipioDireita = styled.div`
  padding: 15px 20px;
  float: right;
  font-size: 20px;
  font-weight: bold;
`;
export const ContainerPs = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;  
    margin: 50px 0; 
`;
export const Ps1 = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;  
    margin: 0 0 0px 0;    
    width: 30px;
    height: 100px;
    background-color: #2dd9d0;
    
`;
export const Ps2 = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;  
    margin: 0 0 0px 0;    
    width: 800px;
    height: 300px;
    border: solid 30px #2dd9d0;
    border-radius: 20px;
    img{
      margin-top: -30px;
      width: 80px;
    }
`;

export const Ps3 = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;  
    margin: 0 0 -30px 0;    
    width: 400px;
    height: 150px;
    border: solid 30px #2dd9d0;
    border-radius: 20px;
    img{
      margin-top: -30px;
      width: 80px;
    }
`;
export const Ps4 = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;  
    margin: 0 0 0px 0;    
    width: 600px;
    height: 150px;
    border: solid 30px #2dd9d0;
    border-radius: 20px;
    img{
      margin-top: -30px;
      width: 80px;
    }
`;
export const Ps5 = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;  
    margin: -5px 0 0px 0;    
    width: 30px;
    height: 180px;
    background-color: #2dd9d0;
    img{
      margin-top: -30px;
      width: 80px;
    }
`;
export const PsImage = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;  
    margin: -150px 0 0px 0;    
    width: 100px;
    cursor: pointer;
`;
export const PsImageEsquerda = styled.div`
    float: left;
    margin: -110px 0 0px -830px;    
    width: 100px;
    left: -30px;
    cursor: pointer;    
`;
export const Ps3ImageDireita = styled.div`
    float: right;
    margin: -140px -60px 0px 0;    
    width: 100px;
    left: -30px;  
    cursor: pointer;  
`;
export const Ps3ImageEsquerda = styled.div`
    float: left;
    margin: -140px 0 0px -60px;    
    width: 100px;
    right: -30px; 
    cursor: pointer;   
`;
export const PsImageDireita = styled.div`
    float: right;
    margin: -110px -830px 0px 0;    
    width: 100px;
    left: -30px; 
    cursor: pointer;   
`;
export const DivConteudo = styled.div`

  max-width: 65%;
  width: 100%;
  height: 100%;
  background: #fff;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
  justify-content: left;
  align-items: left;
  padding: 0px;
  display: flex;
  flex-direction: row;
`;

export const DivRelatorios = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

export const DivColRelatorios = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 25%;
  height: 100%;
  color: #666;
  padding: 20px;
  li {
    color: blue;
    cursor: pointer;
    font-size: 16px;
    padding: 5px;
  }
`;

export const TituloRelatorios = styled.div`
  font-size: 24px;
  font-weight: bolder;
  color: #70B8C2;
  text-align: center;
  p{
    font-size: 18px;
  }
`;
export const BaixarRelatorio = styled.div`
width: 200px;
text-align: center;
margin-top: 10px;
background-color: #3D6CA6;
font-size: 22px;
color: #fff;
border-radius: 5px;
padding: 5px 20px;
cursor: pointer;
`;
export const BotaoResiduos = styled.div`
width: 150px;
text-align: center;
margin-top: 10px;
background-color: #42895B;
font-size: 18px;
color: #fff;
border-radius: 5px;
padding: 5px 20px;
cursor: pointer;
font-weight: bolder;
`;

export const DivForm = styled.div`
  float: left;
  width: 100%;
  padding: 10px 8px 10px 10px;
  border: solid #008080 2px;
  border-radius: 5px;
  margin-top: 20px;
  color: #fff;
`;

export const DivTituloForm = styled.div`
  width: 100%;
  padding: 10px;
  margin: -11px -10px 0 -11px;
  background-color: #008080;
  border-radius: 2px;
  font-weight: bolder;
`;
export const Tabela = styled.div`
  width: 100%;
  float: left;
  display: flex;
  margin-top: 20px;
  table {
    margin-left: auto;
    margin-right: auto;
    border: -1px;
   width: 90%;
   th{
    background: #008080;
    padding: 10px;
    color: #fff;
    border: solid 1px #008080;
  }
  td {
    padding: 10px;
    border: solid 1px #008080;
    color: #667778;
  }
  }
  
  span{
    cursor: pointer;
  }
  td span {
    margin-left: 10px;
    text-align: center;
  }
`;

export const DivBotaoAdicionar= styled.div`
   width: 100%;
   float: left;
   margin-bottom: 10px;
  
   span{
      padding: 10px;
      background:  #2dd9d0;
      color: #008080;
      font-weight: bolder;
      border-radius: 5px;
      cursor: pointer;
      width: 70px;
      float: right;
      margin-right: 30px;
    }
`;

export const SubmitButton = styled.button`
  padding: 10px 15px;
  margin: 30px 10px;
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
  float: right;
  svg {
    margin-right: 8px;
  }
`;

export const SubmitButtonModal = styled.button`
  padding: 10px 15px;
  margin: 10px 10px;
  color: #fff;
  border: 0px;
  background: #008080;
  border-radius: 5px;
  flex-direction: row;
  cursor: pointer;
  width: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  float: left;
  font-weight: bolder;
  svg {
    margin-right: 0px;
  }
`;

export const DivInput = styled.div`
  float: left;
  flex-direction: column;
  display: flex;
`;

export const InputP = styled.div`
  float: left;
  flex-direction: column;
  display: flex;
  width: 150px;
  p {
    margin-left: 20px;
    padding: 10px;
    padding: 22px 0;
  }
`;

export const InputM = styled.div`
  float: left;
  flex-direction: column;
  display: flex;
  width: 350px;
  p {
    margin-left: 20px;
    padding: 22px 0;
  }
`;

export const InputG = styled.div`
  float: left;
  flex-direction: column;
  display: flex;
  width: 500px;
  p {
    margin-left: 20px;
    padding: 22px 0;
  }
`;

export const DivTextArea = styled.div`
  float: left;
  flex-direction: column;
  display: flex;
`;
export const TextArea = styled.div`
  float: left;
  flex-direction: column;
  display: flex;
  width: 990px;
  border: #2dd9d0 solid 2px;
  margin: 10px;
  border-radius: 5px;
`;

export const DivEixo = styled.div`
  float: left;
  flex-direction: row;
  margin: 10px;
  display: flex;
  width: 95%;
  border-bottom: #2dd9d0 solid 2px;
  padding: 5px;
  color: #666;
  font-weight: bold;
  span {
    float: left;
    width: 20px;
    margin-left: 10px;
    border: none;
    background: none;
    cursor: pointer;
  }
`;

export const Form = styled.form`
  font-size: 14px;
  input {
    border: 2px solid #2dd9d0;
    border-radius: 5px;
    padding: 10px 15px;
    margin: 10px;
    color: #666;
    float: left;
  }
  input:focus-within {
    border-color: 2px solid #008080;
  }

  textarea {
    border: 1px solid #eee;
    border-radius: 5px;
    padding: 10px 15px;
    margin: 10px;
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
    color: red;
    font-weight: bold;
  }
`;

export const DivBotao = styled.div`
 float: left;
  flex-direction: row;
  display:flex;
  align-items: center;
  justify-content: center;
`;

export const DivBotaoMenu = styled.div`
  margin-top: 20px;
  flex-direction: column;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const NumeroMenu = styled.div`
  border-radius: 50px;
  padding: 20px;
  background: #0085bd;
  font-weight: bold;
  font-size: 20px;
  width: 25px;
  text-align: center;
`;

export const BotaoMenu = styled.div`
  min-width: 300px;
  min-height: 20px;
  border-radius: 10px;
  background: #0085bd;
  cursor: pointer;
  color: #fff;
  margin: 20px;
  text-align: center;
  padding: 20px 0;
  transition: all 0.2s;
  font-weight: bold;
  font-size: 20px;
  &:hover {
    background: #193454;
  }
  img {
    width: 50px;
    margin-right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 3px;
  }
`;
export const BotaoMenuActive = styled.div`
  min-width: 300px;
  min-height: 20px;
  border-radius: 10px;
  background:  #193454;
  cursor: pointer;
  color: #fff;
  margin: 20px;
  text-align: center;
  padding: 20px 0;
  transition: all 0.2s;
  font-weight: bold;
  font-size: 20px;
  &:hover {
    background: #193454;
  }
  img {
    width: 50px;
    margin-right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 3px;
  }
`;

export const ContainerModal = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 9;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
`;

export const Modal = styled.div`
  min-width: 520px;
  max-width: 1320px;
  min-height: 100px;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 12px 16px 32px 16px;
`;

export const ModalForm = styled.div`
  
  max-width: 1320px;
  min-height: 100px;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 12px 16px 32px 16px;
  margin-top: 600px;
  margin-bottom: 30px;
`;

export const ModalFormUnidade = styled.div`
  min-width: 520px;
  max-width: 1320px;
  min-height: 100px;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 12px 16px 32px 16px;
  margin-top: 3200px;
  margin-bottom: 30px;
`;

export const ConteudoModal = styled.div`
  width: 100%;
  float: left;
  text-align: left;
  font-size: 14px;
  color: #666;
  input {
    border: 2px solid #2dd9d0;
    border-radius: 5px;
    padding: 10px 15px;
    margin: 10px;

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
    width: auto;
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
export const FormModal = styled.form`
  display: flex;
  width: auto;
  
`;
export const TabelaModal = styled.div`
width: 100%;
text-align: center;
align-items: center;
display: flex;
margin-top: 20px;
display: flex;

`;

export const CloseModalButton = styled.button`
  width: 80px;
  cursor: pointer;
  padding: 10px 15px;
  margin: 10px;
  color: #fff;
  border: 0px;
  background: red;
  border-radius: 5px;
  flex-direction: row;
  float: right;
  text-align: center;
  justify-content: right;
  align-items: right;
  font-weight: bolder;
  svg {
    margin-right: 0px;
  }
`;
