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
  display: flex;
  max-width: 80%;
  width: 100%;
  height: 100%;
  min-height: 1000px;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
  justify-content: left;
  align-items: left;
  padding: 0px;
  flex-direction: column;

   @media (max-width: 1000px) {
   margin: 10px;
   justify-content: center;
   align-items: center;
   max-width: 100%;
   margin: 2%;
   width: 90%;
   min-heigth: 0;
   min-width: 0;
   
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
  width: 98%;
  padding: 10px 8px 10px 0;
  margin: 0px 0 20px 0;
  color: #667778;
  margin-left: 5px;
`;

export const DivFormConteudo = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>` 
  display: ${(props) => (props.active ? "block" : "none")};
  background-color: white;
  padding: 0 1.9rem 1.9rem;
  border-radius: 7.6px;
  box-shadow: 0 3.8px 5.7px rgba(0, 0, 0, 0.1);
  width: 90%;
  z-index: 1;
  margin: 0px auto;
  position: relative;
  color: #333;
  overflow: hidden;
  table {
    width: 100%;
    margin-bottom: 20px;
    
  }
  th {
    padding: 0 10px 0 0px;
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
  }
  select {
    font-size: 14px;
    option {
      font-size: 16px;
    }
  }
`;


// Mesma DIV de cima porém sem o atributo hidden

export const DivFormContent = styled.div` 
  float: left;
  width: 97%;
  max-width: 1320;
  min-width: 1090px;
  padding: 10px 10px 10px 15px;

  color: #667778;
  table {
    width: 100%;
    margin-bottom: 20px;
    
  }
  th {
    padding: 0 10px 0 0px;
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
  }
  select {
    font-size: 14px;
    option {
      font-size: 16px;
    }
  }

  @media (max-width: 1500px) {
  max-width: 90%;
  float: none;
  min-width: 90%;
  width: 90%;
  margin: 0 auto;

  table{
  flex-direction: column;
  }
  }
`;
export const DivForm = styled.div`
  display: flex;
  flex-direction: column;
  width: 97%;
  min-width: auto;
  padding: 10px 12px 10px 10px;
  border-radius: 5px;
  margin-top: 20px;
  background-color: #ffff;

  @media (max-width: 1000px) {
    width: 95%;
    box-sizing: border-box;
    min-width: 0;
    margin: 0 0 0 7% ;
  }
 
`;

export const TabsList = styled.div`
  display: "flex";
  width: 100%;
  margin-top: 10px;
  padding-left: 20px;
  justify-content: space-between;
`;

export const TabsInstructons = styled.div`
  display: "flex";
  width: 100%;
  font-size: 16px;
  padding-left: 20px; 
  color: #053d68;
`;

export const TabsMenuReports = styled.div`
  display: flex;
  width: 100%;
  font-size: 16px;
  text-align: end;
  justify-content: end;
  flex-direction: row;
  color: #053d68;
  svg {
    font-size: 24px;
    margin-right: 10px;
    cursor: pointer;
    &:hover {
       color: #000;
    }
  }
`;

export const TabsMenuChartsOnClick = styled.div<{ visibleMenuChart: boolean }>`
   opacity: ${({ visibleMenuChart }) => (visibleMenuChart ? "1" : "0")};
   visibility: ${({ visibleMenuChart }) => (visibleMenuChart ? "visible" : "hidden")};
  position: absolute;
  background-color: #f9f9f9;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  padding: 10px 20px;
  z-index: 1;
  right: 120px;
  border-radius: 5px;
  color: #053d68;
  font-size: 16px;
  ul{
    list-style-type: none;
    text-align: left;
  }
  li{
    padding: 10px 10px 10px 5px;
    cursor: pointer;
  }
  svg {
    margin-bottom: -7px;
    }  
`;

export const TabsMenuReportsOnClick = styled.div<{ visibleMenuReports: boolean }>`
   opacity: ${({ visibleMenuReports }) => (visibleMenuReports ? "1" : "0")};
   visibility: ${({ visibleMenuReports }) => (visibleMenuReports ? "visible" : "hidden")};
  position: absolute;
  background-color: #f9f9f9;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  padding: 10px 20px;
  z-index: 1;
  right: 120px;
  border-radius: 5px;
  color: #053d68;
  font-size: 16px;
  ul{
    list-style-type: none;
    text-align: left;
  }
  li{
    padding: 10px 10px 10px 5px;
    cursor: pointer;
  }
  svg {
    margin-bottom: -7px;
    }  
`;

export const TabsInfoOnClick = styled.div<{ visibleInfo: boolean }>`
   opacity: ${({ visibleInfo }) => (visibleInfo ? "1" : "0")};
   visibility: ${({ visibleInfo }) => (visibleInfo ? "visible" : "hidden")};
    max-width: 600px;
    position: absolute;
    background-color: #f9f9f9;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    padding: 10px 20px;
    z-index: 1;
    right: 120px;
    border-radius: 5px;
    color:rgb(65, 62, 62);
    font-size: 14px;
    text-align: left;
  `;

export const TabButtonGrafico = styled.button<{activeButtonGrafico: boolean}>`
  padding: 10px 20px;
  font-size: 18px;
  border-right: 2px solid #eeeeee;
  border-left: 2px solid #eeeeee;
  border-top: 2px solid #eeeeee;
  border-bottom: none;
  color:${({ activeButtonGrafico }) => (activeButtonGrafico ? "#fff" : "#053d68")};
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  cursor: pointer;
  background-color: ${({ activeButtonGrafico }) => (activeButtonGrafico ? "#0085bd" : "#fff")};
  svg {
    margin-bottom: -3px;
    } 
`;

export const TabButtonDados = styled.button<{activeButtonDados: boolean}>`
  padding: 10px 20px;
  font-size: 18px;
  border-right: 2px solid #eeeeee;
  border-left: 2px solid #eeeeee;
  border-top: 2px solid #eeeeee;
  border-bottom: none;
  color: ${({ activeButtonDados }) => (activeButtonDados ? "#fff" : "#053d68")};
  border-top-left-radius: 10px;
  border-top-right-radius:10px;
  cursor: pointer;
  background-color: ${({ activeButtonDados }) => (activeButtonDados ? "#0085bd" : "#fff")};
  svg {
    margin-bottom: -3px;
    } 
`;

export const TabButtonIndicador = styled.button<{activeButtonIndicador: boolean}>`
  padding: 10px 20px;
  font-size: 16px;
  border-right: 2px solid #eeeeee;
  border-left: 2px solid #eeeeee;
  border-top: 2px solid #eeeeee;
  border-bottom: none;
  color:${({ activeButtonIndicador }) => (activeButtonIndicador ? "#fff" : "#053d68")};
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  cursor: pointer;
  background-color: ${({ activeButtonIndicador }) => (activeButtonIndicador ? "#0085bd" : "#fff")};
  /* &:hover {
    background: #0085bd;
    color: #fff;
  } */
`;

export const Tabs = styled.div`
  display: "flex";
  justify-content: "center";
  width: "100%";
  //border-top: 1px solid #eeeeee;
  color: #999;
`;

export const TabsForm = styled.div`
  display: "flex";
  width: "100%";
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  padding: 10px 10px 10px 10px;
  margin: 0px 10px 10px 10px;
  border-radius: 10px;
  form{
    margin: 10px 0 10px 15px;
    padding: 0;
  }
  select {
    border-radius: 5px;
    border: 1px solid #eeeeee;
    color: #666;
    margin-right: 10px;
    padding: 10px 15px;
    font-size: 14px;
    option {
      font-size: 16px;
    }
  }
  span {
      padding-top: 10px;
      color: red;
    }
`;

export const TabFormSubmit = styled.button`
  padding: 10px 15px;
  margin: 0px 10px;
  color: #fff;
  border: 0px;
  background: #0085bd;
  border-radius: 5px;
  flex-direction: row;
  font-weight: 600;
  font-size: 16px;
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

export const TabsContent = styled.div`
  display: "flex";
  justify-content: "center";
  width: "100%";
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-height: 500px;
  padding: 10px;
  margin: 10px;
  border-radius: 10px;
  background-color: #fff;
`;

export const TabsTitleIndicador = styled.div`
  display: "flex";
  text-align: center;
  justify-content: "center";
  width: "100%"; 
  padding: 10px;
  margin: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #053d68;
`;

export const TabsError = styled.div`
  display: "flex";
  justify-content: "center";
  width: "100%";
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color:rgb(237, 175, 175);
  border: 2px solid red;
  color: red;
  padding: 10px;
  margin: 10px;
  border-radius: 10px;
`;

export const TabsTable = styled.table`
  width: 100%;
  border-spacing: 0;
  text-align: center;
  th:first-child {
    border-left-style: solid;
    border-top-left-radius: 10px;
  }
  th:last-child {
    border-right-style: solid;
    border-top-right-radius: 10px;
  }

  th {
    background-color: #0085bd;
    color: #fff;
    padding: 10px;
    border: #0085bd solid 1px;
  }
 
  td {
    border-spacing: 0;
    padding: 10px 15px;
    border: #cccccc solid 1px;    
  }
  
`;

export const DivFormResiduo = styled.div`
  float: left;
  width: 97%;
  min-width: 1280px;
  padding: 10px 12px 10px 10px;
  border-radius: 5px;
  margin-top: 20px;
  margin-bottom: 0px;
  color: #667778;
  background-color: #ffff;
`;

export const DivSeparadora = styled.div`
  width: 100%;
  display: flex;
`;

export const DivTituloFormResiduo = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 20px;
  margin: -25px 0 10px -25px;
  background-color: #0085bd;  
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  font-weight: bolder;
  color: #fff;
`;

export const DivTituloForm = styled.div`
  width: auto;
  padding: 16px;
  font-size: 16px;
  margin: -11px -13px 0 -11px;
  background-color: #0085bd;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  font-weight: bolder;
  color: #fff;

`;

export const DivTituloFormDrenagem = styled.div`
  width: auto;
  padding: 15px;
  margin: -11px -13px 0 -11px;
  background-color: #0085bd;
  border-top-left-radius: 6px;
  font-size: 16px;
  border-top-right-radius: 6px;
  font-weight: bolder;
  color: #fff;
`;

export const DivTituloEixo = styled.div`
  //width: 300px;
  float: right;
  padding: 10px 40px;
  margin: -30px 10px 0 -11px;
  background-color: #3a8191;
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
  background-color: #0f4c81;
  border-radius: 25px;
  font-weight: bolder;
  text-align: center;
  color: #fff;
`;

export const DivTituloConteudo = styled.div`
  padding: 10px 40px;
  width: auto;
  max-width: 100%;
  margin: -30px 10px 0 0px;
  border-bottom: 2px solid #0085bd;
  font-weight: bolder;
  text-align: start;
  color: #4a5568;
`;

export const DivTitulo = styled.div`
  min-width: 60%;
  margin-bottom: 18px;
`;

export const SubmitButton = styled.button`
  padding: 10px 15px;
  margin: 30px 10px;
  color: #fff;
  border: 0;
  background: #0085bd;
  border-radius: 5px;
  flex-direction: row;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  width: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  float: right;
    margin-right: 8px;
  
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
  p {
    margin-left: 20px;
    padding: 10px;
    padding: 18.5px 0;
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
  span {
    font-size: 14px;
    margin-top: 9px;
    color: #999;
  }
`;

export const InputP = styled.div`
  float: left;
  flex-direction: column;
  display: flex;
  width: 150px;
  p {
    margin-left: 20px;
    padding: 10px;
    padding: 21.5px 0;
  }
  input {
    text-align: right;
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
  span {
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
    padding: 18.5px 0;
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
  border: #000000 solid 2px;
  margin: 10px;
  border-radius: 5px;
`;

export const DivEixo = styled.div`
  float: left;
  flex-direction: column;
  margin: 10px;
  display: flex;
  width: 95%;
  border-bottom: #000000 solid 2px;
  padding: 5px;
  color: #666;
  font-weight: bold;
`;

export const Form = styled.form`
  // font-size: 14px;
  // background-color: #f3f4f6;
  // width: 100%;
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  // input {
  //   border: 2px solid #666666;
  //   border-radius: 5px;
  //   padding: 10px 15px;
  //   margin: 10px;
  //   color: #666;
  //   float: left;
  // }
  // input:focus-within {
  //   border-color: 2px solid #666666;
  // }

  // textarea {
  //   border: 1px solid #eee;
  //   border-radius: 5px;
  //   padding: 10px 15px;
  //   margin: 10px;
  //   min-width: 400px;
  //   height: 200px;
  // }
  // label {
  //   color: #666;
  //   margin: 10px 0 0 15px;
  // }

  // select {
  //   border: 2px solid #666666;
  //   border-radius: 5px;
  //   padding: 10px 15px;
  //   margin: 10px;
  //   background: #fff;
  // }
  // option {
  //   border: 1px solid #666666;
  //   border-radius: 5px;
  //   padding: 10px 15px;
  //   margin: 10px;
  //   width: 500px;
  //   background: #fff;
  // }
  // span {
  //   color: #666;
  //   //font-weight: bold;
  // }

   display: flex;  
  background-color: #f3f4f6;
  width: 100%;
  font-size: 14px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  input {
    border: 2px solid #ccc;
    border-radius: 5px;
    padding: 15px 15px;
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
    border: 2px solid #ccc;
  }
  label {
    color: #666;
    margin: 10px 0 0 15px;
    font-size: 14px;
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

export const TableContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const TableColumn = styled.div`
  flex: 1;
  padding: 10px;
`;
