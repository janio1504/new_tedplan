import styled, {keyframes} from "styled-components";

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
  font-family: Arial, sans-serif;
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
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 1200px) {
    width: 95%;
    padding: 20px;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 16px;
  }
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

//Relatorio
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



export const DivFormConteudoModal= styled.div`
 float: left;
  width: 97%;
  max-width: 1320;
  min-width: 1090px;
  padding: 10px 10px 10px 15px;
  border: solid #3D6CA6 2px;
  border-radius: 10px;
  margin-top: 30px;
  color: #667778;
  table{
    float: left;
    margin-bottom: 20px;
  }
  th{
    text-align: left;
    padding: 0 10px 0 0px;
    span{
      text-align: center;
      color: blue;
    }
    p{
      padding: 10px;
      background:  #2dd9d0;
      color: #008080;
      font-weight: bolder;
      border-radius: 5px;
      cursor: pointer;
      width: auto;
      width: 70px;
    }
    button{
      border: none;
      background:  #2dd9d0;
      color: #008080;
      padding: 10px;
      text-align: center;
      font-weight: bolder;
      border-radius: 5px;
      cursor: pointer;
    }
  }
  td{
  
    
    
    
  }
  select{
    font-size: 14px;
    option{
    font-size: 16px;
  }
  }
  input{
     width: 230px;
  margin: 15px 8px; 
  padding: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 25px; 

  select, input {
    width: 100%;
    height: 38px;
    padding: 8px 12px;
    border: 1.5px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    color: #2d3748;
    background-color: white;
    transition: all 0.2s ease-in-out;
    box-sizing: border-box;
    margin-top: 8px;
    
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

  select {
    cursor: pointer;
    appearance: none;

    option {
      padding: 8px;
      font-size: 14px;
      background-color: white;
      color: #2d3748;
    }

    & + &::after {
      content: '';
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 5px solid #2d3748;
      pointer-events: none;
    }
  }
 

  tr {
    margin-bottom: 20px; 
    
    display: block;
  }

  td {
    padding: 12px 0; 
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: 230px;
    margin: 12px 4px;
    
    select, input {
      font-size: 13px;
      height: 36px;
    }
  }

  @media (max-width: 480px) {
    max-width: 100%;
  }
  }
 
  
`;

export const DivFormConteudoCadastro = styled.div`
  width: 100%;
  max-width: 1320px;
  min-width: 1090px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 24px;

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    min-width: 600px;
  }

  th {
    background: #0085bd;
    color: #ffffff;
    padding: 16px 20px;
    text-align: left;
    font-weight: 600;
    font-size: 14px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    position: sticky;
    top: 0;
    z-index: 10;

    &:first-child {
      border-top-left-radius: 8px;
      padding-left: 24px;
    }
    
    &:last-child {
      border-top-right-radius: 8px;
      padding-right: 24px;
    }

    span {
      color: #2563eb;
      text-align: center;
    }

    button {
      background: #2dd9d0;
      color: #008080;
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #26c0b7;
        transform: translateY(-1px);
      }
    }
  }

  td {
    padding: 16px 20px;
    color: #4a5568;
    border-bottom: 1px solid #e2e8f0;
    font-size: 15px;
    line-height: 1.5;

    &:first-child {
      padding-left: 24px;
    }
    
    &:last-child {
      padding-right: 24px;
    }
  }

  tr {
    &:hover {
      background: #f8fafc;
    }

    &:last-child td {
      border-bottom: none;
    }
  }

  select {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    font-size: 14px;
    color: #4a5568;
    background: #ffffff;
    
    &:focus {
      outline: none;
      border-color: #0085bd;
      box-shadow: 0 0 0 2px rgba(0, 133, 189, 0.1);
    }

    option {
      font-size: 14px;
      padding: 8px;
    }
  }
`;



export const DivFormConteudo= styled.div`
 float: left;
  width: 97%;
  max-width: 1320;
  min-width: 1090px;
  border-radius: 10px;
  color: #667778;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

  table{
    width: 100%;
    
    border-collapse: separate;
    border-spacing: 0;
    min-width: 600px;
    
  }
  th{
    background: #0085bd;
      color: #fff;
      padding: 16px 20px;
      text-align: left;
      font-weight: 600;
      font-size: 14px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      position: sticky;
      top: 0;
      z-index: 10;

      &:first-child {
        padding-left: 24px;
      }
      
      &:last-child {
        padding-right: 24px;
      }

    span{
      text-align: center;
      color: blue;
    }
    p{
      padding: 10px;
      background:  #2dd9d0;
      color: #008080;
      font-weight: bolder;
      border-radius: 5px;
      cursor: pointer;
      width: auto;
      width: 70px;
    }
    button{
      border: none;
      background:  #2dd9d0;
      color: #008080;
      padding: 10px;
      text-align: center;
      font-weight: bolder;
      border-radius: 5px;
      cursor: pointer;
    }
  }
  td{
    padding: 16px 20px;
     color: #4a5568;
    border-bottom: 1px solid #e2e8f0;
    font-size: 15px;
    line-height: 1.5;
    transition: all 0.2s ease;
    
    
    
  }
  select{
    font-size: 14px;
    option{
    font-size: 16px;
  }
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


//Reisiduop
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
  background: #0085bd;
  color: #fff;
  padding: 15px 20px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
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

export const DivTituloEixo = styled.div`
  //width: 300px;
  float: right;
  padding: 10px 40px;
  margin: -30px 10px 0 -11px;
  background-color: #3A8191;
  border-radius: 25px;
  font-weight: bolder;
  text-align: center;
  color: #fff;
`;

export const DivTituloEixoDrenagem = styled.div`
  //width: 300px;
  float: right;
  padding: 10px 40px;
  margin: -30px 10px 0 -11px;
  background-color: #0F4C81;
  border-radius: 25px;
  font-weight: bolder;
  text-align: center;
  color: #fff;
`;

export const DivTituloConteudo = styled.div`
  background: #0085bd;
  color: #ffffff;
  padding: 12px 16px;
  font-weight: 600;
  font-size: 14px;
  border-radius: 4px;
  text-align: center;
  width: fit-content;
  margin: 0 auto;
`;

export const DivTitulo = styled.div`
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const SubmitButton = styled.button`
  background: #0085bd;
  color: #fff;
  border: none;
  margin-top: 20px;
  border-radius: 4px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #006a96;
  }
`;

export const DivInput = styled.div`
  float: left;
  flex-direction: column;
  display: flex;
`;
export const LabelCenter = styled.div`
text-align: center;
padding: 8px 0;
color: #666;
`;


//Coleta
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

//Modal?
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
  display: flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  margin: 4px;
  
  input {
    width: 120px;
    padding: 8px 12px;
    border: 1.5px solid #e2e8f0;
    border-radius: 6px;
    text-align: right;
    font-size: 14px;
    transition: all 0.2s ease;

    &:hover {
      border-color: #cbd5e0;
    }

    &:focus {
      border-color: #0085bd;
      box-shadow: 0 0 0 3px rgba(0, 133, 189, 0.1);
      outline: none;
    }
  }

  span {
    color: #64748b;
    font-size: 14px;
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-end;
    
    input {
      width: 100px;
    }
  }

  @media (max-width: 480px) {
    input {
      width: 90px;
    }
  }
`;

export const InputM = styled.div`
  width: 250px;
  margin: 8px;

  select {
    width: 100%;
    height: 45px;
    padding: 8px 12px;
    border: 1.5px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    color: #2d3748;
    background-color: white;
    transition: all 0.2s ease-in-out;
    box-sizing: border-box;
    
    &:hover {
      border-color: #cbd5e0;
      background-color: #f7fafc;
    }
  }
`;

export const InputG = styled.div`
  width: 230px;
  margin: 15px 8px; 
  padding: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 25px; 

  select, input {
    width: 100%;
    height: 38px;
    padding: 8px 12px;
    border: 1.5px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    color: #2d3748;
    background-color: white;
    transition: all 0.2s ease-in-out;
    box-sizing: border-box;
    margin-top: 8px;
    
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

  select {
    cursor: pointer;
    appearance: none;

    option {
      padding: 8px;
      font-size: 14px;
      background-color: white;
      color: #2d3748;
    }

    & + &::after {
      content: '';
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 5px solid #2d3748;
      pointer-events: none;
    }
  }
 

  tr {
    margin-bottom: 20px; 
    
    display: block;
  }

  td {
    padding: 12px 0; 
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: 230px;
    margin: 12px 4px;
    
    select, input {
      font-size: 13px;
      height: 36px;
    }
  }

  @media (max-width: 480px) {
    max-width: 100%;
  }
`;
export const InputGG = styled.div`
  width: 600px;
  margin: 8px;
`;

export const InputXL = styled.div`
  width: 800px;
  margin: 8px;
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



export const TabelaCadastro = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  margin-top: 2rem;
  animation: fadeIn 0.5s ease forwards;

  h2 {
    font-size: 1.25rem;
    color: #212121;
    margin-bottom: 1.5rem;
  }

  .table-container {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    border-radius: 8px;
    overflow: hidden;
  }

  thead th {
    background: #2196F3;
    color: white;
    font-weight: 500;
    padding: 1rem;
    text-align: left;
    font-size: 0.9rem;
  }

  tbody td {
    padding: 1rem;
    border-bottom: 1px solid #ddd;
    color: #4a5568;
  }

  tr:hover {
    background: rgba(33, 150, 243, 0.05);
  }

  .icon-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    color: #2196F3;
    transition: color 0.3s ease;

    &:hover {
      color: #1976D2;
    }

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;


export const ConteudoModalResiduoSolido = styled.form`
  width: 97%;
  max-width: 1320px;
  min-width: 1090px;
  padding: 20px;
  border: solid #3D6CA6 2px;
  border-radius: 10px;
  margin-top: 30px;
  color: #667778;

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 15px;
  }


  tr {
    display: grid;
    grid-template-columns: 150px minmax(200px, 1fr) 250px;
    align-items: center;
    gap: 20px;
    margin-bottom: 15px;
    position: relative; 
  }

  td {
    padding: 8px 0;
    display: flex;
    align-items: center;
    position: relative; 
    white-space: nowrap;
    overflow: hidden; 

    &:nth-child(2) { 
      color: #667778;
      padding-right: 20px; 
    }

    &:last-child {
      justify-content: flex-end;
      text-align: right;
      z-index: 1; 
    }
  }

 
 

  ${InputG} {
    width: 250px;
    margin: 0;

    select, input {
      width: 100%;
      height: 38px;
      padding: 8px 12px;
      border: 1.5px solid #e2e8f0;
      border-radius: 8px;
      font-size: 14px;
      color: #2d3748;
      background-color: white;
      
      &:hover {
        border-color: #cbd5e0;
      }

      &:focus {
        border-color: #0085bd;
        box-shadow: 0 0 0 3px rgba(0, 133, 189, 0.1);
        outline: none;
      }
    }

    select {
      cursor: pointer;
      appearance: none;
      
      option {
        font-size: 14px;
        padding: 8px;
      }
    }
  }

  @media (max-width: 1200px) {
    min-width: auto;
    padding: 15px;

    tr {
      grid-template-columns: 120px 1fr 230px;
      gap: 10px;
    }

    th {
      width: 120px;
    }
  }
`;
export const InputPP = styled.div`
  width: 80px; 
  margin: 4px 8px;
  padding: 0;
  position: relative;

  input {
    width: 100%;
    height: 38px;
    padding: 8px 12px;
    border: 1.5px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    color: #2d3748;
    background-color: white;
    transition: all 0.2s ease-in-out;
    box-sizing: border-box;
    text-align: center; 
    
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

 
  @media (max-width: 768px) {
    width: 70px;
    
    input {
      font-size: 13px;
      height: 36px;
      padding: 8px;
    }
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px 0;

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;

    label {
      font-size: 14px;
      font-weight: 500;
      color: #2c3e50;
    }

    .helper-text {
      font-size: 12px;
      color: #64748b;
      margin-top: 4px;
    }

    .error-message {
      font-size: 12px;
      color: #ef4444;
      margin-top: 4px;
    }
  }

  input, select {
    width: 100%;
    height: 44px;
    padding: 10px 14px;
    border: 1.5px solid #e2e8f0;
    border-radius: 8px;
    font-size: 15px;
    color: #2c3e50;
    transition: all 0.2s ease;
    background: #fff;

    &::placeholder {
      color: #94a3b8;
    }

    &:hover {
      border-color: #cbd5e0;
    }

    &:focus {
      border-color: #0085bd;
      outline: none;
      box-shadow: 0 0 0 3px rgba(0, 133, 189, 0.1);
    }

    &:disabled {
      background: #f1f5f9;
      cursor: not-allowed;
      color: #94a3b8;
    }
  }

  select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg width='14' height='8' viewBox='0 0 14 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L7 7L13 1' stroke='%2364748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 16px center;
    padding-right: 40px;

    &:invalid {
      color: #94a3b8;
    }
  }

  .input-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    align-items: start;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .input-group {
    position: relative;
    
    .prefix, .suffix {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      color: #64748b;
      font-size: 14px;
    }

    .prefix {
      left: 14px;
    }

    .suffix {
      right: 14px;
    }

    input {
      &.has-prefix {
        padding-left: 36px;
      }

      &.has-suffix {
        padding-right: 36px;
      }
    }
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



//Modal

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
    border: 2px solid #2dd9d0;
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

