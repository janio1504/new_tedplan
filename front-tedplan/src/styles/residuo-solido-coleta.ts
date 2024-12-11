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
  max-width: 85%;
  min-width: 1280px;
  width: 100%;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50px;
  text-align: left;
  justify-content: left;
  align-items: left;
  padding: 0px ;
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


export const DivColRelatorios = styled.div`
  float: left;
  width: 30%;
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

export const DivFormEixo = styled.div`
  float: left;
  width: 97%;
  min-width: 1000px;
  padding: 10px 8px 10px 15px;
  border: solid #3A8191 2px;
  border-radius: 10px;
  margin-top: 30px;
  color: #667778;

  margin-left: 5px;
`;

export const DivFormConteudo = styled.div`
  float: left;
  width: 97%;
  max-width: 1320px;
  min-width: 320px;
  padding: 10px 10px 10px 15px;
  
  border-radius: 10px;
  margin-top: 30px;
  color: #667778;
  overflow-x: auto;

  table {
    float: left;
    margin-bottom: 20px;
    min-width: 100%;
    
    @media (max-width: 1090px) {
      display: block;
      overflow-x: auto;
      white-space: nowrap;
    }
  }

  th {
    text-align: left;
    padding: 0 10px 0 0px;
    min-width: 120px;

    span {
      text-align: center;
      color: blue;
    }

    p {
      padding: 10px;
      background: #2dd9d0;
      color: #008080;
      font-weight: bolder;
      border-radius: 5px;
      cursor: pointer;
      width: auto;
      width: 70px;
    }

    button {
      border: none;
      background: #2dd9d0;
      color: #008080;
      padding: 10px;
      text-align: center;
      font-weight: bolder;
      border-radius: 5px;
      cursor: pointer;
    }
  }

  td {
    min-width: 120px;
    padding: 5px;
  }

  select {
    font-size: 14px;
    width: 100%;
    
    option {
      font-size: 16px;
    }
  }

  @media (max-width: 1090px) {
    min-width: unset;
    width: 95%;
  }
`;

export const DivForm = styled.div`
  float: left;
  width: 97%;
  min-width: 1280px;
  padding: 10px 12px 10px 10px;
  border: solid #1BB6D3 2px;
  border-radius: 5px;
  margin-top: 20px;
  color: #667778;
`;

export const DivFormRe = styled.div`

  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.08);
  padding: 24px;
  margin-bottom: 24px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 768px) {
    padding: 16px;
    margin-bottom: 16px;
    gap: 16px;
  }
  input {
    border-radius: 5px;
    padding: 10px 15px;
    margin: 10px;
    color: #666;
    float: left;
  }
 

  textarea {
    border: 1px solid #eee;
    border-radius: 5px;
    padding: 10px 15px;
    margin: 10px;
    min-width: 500px;
    height: 200px;
  }
  label {
    color: #666;
    margin: 10px 0 0 15px;
  }

  select {
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
    color: #666;
    //font-weight: bold;
  }
`

export const DivFormResiduo = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.08);
  padding: 24px;
  margin-bottom: 24px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 768px) {
    padding: 16px;
    margin-bottom: 16px;
    gap: 16px;
  }
`;

export const DivSeparadora = styled.div`
   width: 100%;
   display: flex;
`;

export const DivTituloFormResiduo = styled.div`
  width: auto;
  padding: 15px;
  margin: -11px -13px 0 -11px;
  background-color: #0085bd;
  border-radius: 7px;
  font-weight: bolder;
  color: #fff;
`;

export const DivTituloForm = styled.div`
  width: auto;
  padding: 10px;
  margin: -11px -13px 0 -11px;
  background-color: #008080;
  border-radius: 2px;
  font-weight: bolder;
  color: #fff;
`;

export const DivTituloFormDrenagem = styled.div`
  width: auto;
  padding: 10px;
  margin: -11px -13px 0 -11px;
  background-color: #3D6CA6;
  border-radius: 2px;
  font-weight: bolder;
  color: #fff;
`;



export const DivTituloConteudo = styled.div`
 
 display: block;
    font-size: 1.25rem;
    color: #212121;
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #2196F3;
    font-weight: 500;
`;
export const DivTitulo = styled.div`
  min-width: 60%;
  margin-bottom: 20px;
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

export const DivInput = styled.div`
  float: left;
  flex-direction: column;
  display: flex;
`;
export const LabelCenter = styled.div`
text-align: center;
`;

export const InputSNIS = styled.div`
  float: left;
  flex-direction: column;
  display: flex;
  width: 100px;
  p {
  margin-left: 20px;
  padding: 10px;
  padding: 21.5px 0;
  }
`;
export const DivChekbox = styled.div`
  float: left;
  flex-direction: column;
  display: flex;
  width: auto;
  font-size: 14px;
  border: #2dd9d0 solid 2px;
  border-radius: 5px;
  margin-left: 10px;
  padding-right: 10px;
`;
export const CheckBox = styled.div`
  float: left;
  flex-direction: row;
  display: flex;
  color: #999;
  span{
    font-size: 14px;
    margin-top: 9px;
    color: #999;
  }
`;

export const InputP = styled.div`
  float: left;
  flex-direction: column;
  display: flex;
  width: 140px;
  
  p {
  margin-left: 20px;
  padding: 10px;
  padding: 21.5px 0;
  }
  input{
    text-align: right;
    border: 2px solid #e2e8f0;
    border-color: 2px solid #cbd5e0;

    &:hover {
      border-color: #cbd5e0;
      background-color: #f7fafc;
    }

    &:focus {
      border-color: #0085bd;
      box-shadow: 0 0 0 3px rgba(0, 133, 189, 0.1);
      outline: none;
    }
  }
 
`;

// width: 100%;
//     height: 38px;
//     padding: 8px 12px;
//     border: 1.5px solid #e2e8f0;
//     border-radius: 8px;
//     font-size: 14px;
//     color: #2d3748;
//     background-color: white;
//     transition: all 0.2s ease-in-out;
//     box-sizing: border-box;
//     margin-top: 8px;
    
//     &:hover {
//       border-color: #cbd5e0;
//       background-color: #f7fafc;
//     }

//     &:focus {
//       border-color: #0085bd;
//       box-shadow: 0 0 0 3px rgba(0, 133, 189, 0.1);
//       outline: none;
//     }


export const InputM = styled.div`
  float: left;
  flex-direction: column;
  display: flex;
  width: 350px;
  p {
  margin-left: 20px;
  padding: 22px 0;
  }
  span{
    margin-left: 20px;
    color: red;
  }
`;

export const InputG = styled.div`
  float: left;
  flex-direction: column;
  display: flex;
  width: 500px;
  p {
  margin-left: 20px;
  padding: 21.5px 0;
  }
`;
export const InputGG = styled.div`
  float: left;
  flex-direction: column;
  display: flex;
  width: 650px;
  p {
  margin-left: 20px;
  padding: 21.5px 0;
  }
  text-align: left;
`;

export const InputAno = styled.div`
  float: left;
  flex-direction: column;
  display: flex;
  width: 650px;
  text-align: right;
  font-size: 16px;
  p {
  margin-left: 20px;
  padding: 21.5px 0;
  }
`;
export const InputXL = styled.div`
  float: left;
  flex-direction: column;
  display: flex;
  width: 850px;
  p {
  margin-left: 20px;
  padding: 21.5px 0;
  }
`;

export const DivBorder = styled.div`
  float: left;
  flex-direction: column;
  display: flex;
  border-left: solid 2px #3d6ca6;
  height: 530px;
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
  flex-direction: column;
  margin: 10px;
  display: flex;
  width: 95%;
  border-bottom: #2dd9d0 solid 2px;
  padding: 5px;
  color: #666;
  font-weight: bold;
`;



export const Form = styled.form`
  font-size: 14px;
  input {
    border-radius: 5px;
    padding: 10px 15px;
    margin: 10px;
    color: #666;
    float: left;
  }
  input:focus-within {
    border-color: 2px solid #fff;
  }

  textarea {
    border: 1px solid #000;
    border-radius: 5px;
    padding: 10px 15px;
    margin: 10px;
    min-width: 500px;
    height: 200px;
  }
  label {
    color: #666;
    margin: 10px 0 0 15px;
  }

  select {
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
    color: #666;
    //font-weight: bold;
  }
`;

export const DivBotao = styled.div`
  float: left;
  flex-direction: column;
  display: flex;
  border: solid 1px #000;
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

export const ContainerModal = styled.div`
  position: absolute;
  z-index: 9;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Modal = styled.div`
  min-width: 520px;
  max-width: 700px;
  min-height: 100px;
  background-color: #ffffff;
  border: 1px solid #bebebe;
  border-radius: 5px;
  padding: 12px 16px 32px 16px;
  
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
    border-radius: 5px;
    padding: 10px 15px;
    margin: 10px;
    width: 580px;
    color: #666;
    float: left;
  }
  label {
    color: #666;
    margin: 10px 0 0 15px;
    float: left;
  }

  select {
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

export const CloseModalButton = styled.button`
  width: 80px;
  cursor: pointer;
  padding: 10px 15px;
  margin: 10px;
  color: #000;
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



export const FormContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const FormSection = styled.div`
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  h3 {
    color: #1a202c;
    font-size: 18px;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 2px solid #e2e8f0;
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 16px;

  label {
    display: block;
    margin-bottom: 8px;
    color: #4a5568;
    font-size: 14px;
    font-weight: 500;
  }

  input, select {
    width: 100%;
    padding: 8px 12px;
    border: 1.5px solid #e2e8f0;
    border-radius: 6px;
    font-size: 14px;
    color: #1a202c;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(0, 133, 189, 0.1);
    }

    &:disabled {
      background: #f8fafc;
      cursor: not-allowed;
    }
  }

  .error {
    color: #e53e3e;
    font-size: 12px;
    margin-top: 4px;
  }
`;