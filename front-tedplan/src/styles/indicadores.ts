import styled, { keyframes } from "styled-components";

export const Container = styled.div`
  color: #fff;
  font-family: Arial, Helvetica, sans-serif;
  height: 100%;
  max-width: 100%;
  background-color: #f3f4f6;

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

export const ButtonAdicionarPresidente = styled.button`
  padding: 10px 15px;
  color: #fff;
  border: 0px;
  background: #0085bd;
  border-radius: 5px;
  flex-direction: row;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  width: auto;
  display: flex;
  justify-content: center;
  align-items: center;

  &:disabled{
  background: #ccc;
  cursor: not-allowed;
  color: #666;
  }
`

export const IconeColeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 180px;
  padding: 16px;
  margin: 12px;
  cursor: pointer;

  img {
    width: 100px;
    height: 100px;
    object-fit: contain;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: center;
  }

  @media (max-width: 1200px) {
    width: 160px;

    img {
      width: 90px;
      height: 90px;
    }
  }

  @media (max-width: 768px) {
    width: 140px;
    padding: 12px;
    margin: 8px;

    img {
      width: 80px;
      height: 80px;
    }
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
  width: 100%;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
  padding: 0;
  display: flex;
  flex-direction: column;
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
  img {
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
  img {
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
  img {
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
  img {
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

export const TitlePsOnMouse = styled.div`
  display: block;
  position: absolute;
  background-color: #f9f9f9;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  padding: 12px 16px;
  z-index: 1;
  margin: -140px auto 0 auto;
  border-radius: 5px;
  color: #053d68;
  font-size: 16px;
  text-align: left;
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
  color: #70b8c2;
  text-align: center;
  p {
    font-size: 18px;
  }
`;
export const BaixarRelatorio = styled.div`
  width: 200px;
  text-align: center;
  margin-top: 10px;
  background-color: #3d6ca6;
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
  background-color: #42895b;
  font-size: 16px;
  color: #fff;
  border-radius: 8px;
  padding: 10px 20px;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(66, 137, 91, 0.2);
`;

export const DivForm = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: left;
  background-color: #fff;
  text-align: left;
  padding: 10px 8px 10px 10px;

  border-radius: 12px;
  margin-top: 50px;
  color: #fff;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  table {
  }
`;

export const DivTituloForm = styled.div`
  // width: 95%;
  // padding: 15px 10px;
  // color: #fff;
  // margin: -11px -10px 0 -11px;
  // background-color: #0085bd;
  // border-top-right-radius: 12px;
  // border-top-left-radius: 12px;
  // font-weight: bolder;

  width: calc(100% + 3.8rem);
    padding: 0.95rem 1.9rem;
    background-color: #0085bd;
    color: white;
    font-weight: bold;
    font-size: 1.19rem;
    margin: 0 -1.9rem 1.9rem;
    border-radius: 7.6px 7.6px 0 0;
    box-sizing: border-box;
`;

export const Tooltip = styled.span`
  position: absolute;
  display: flex;

  &:hover span {
    visibility: visible;
    opacity: 1;
  }
    
`;

export const TooltipText = styled.span`
  visibility: hidden;
  width: 300px;
  background-color: #fff;
  color: #333 !important;
  text-align: justify;
  border-radius: 6px;
  font-weight: normal !important;
  padding: 8px 12px; 
  position: absolute;
  z-index: 1;
  top: 130%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 16px;

  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);

  
`;

export const Tabela = styled.div`
  
  display: flex;
  width: 100%;
  overflow: hidden;
  height: 100%;
  margin-bottom: 30px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  table {
    
    flex: 1;
    margin-top: -15px;
    border-collapse: separate;
    border-spacing: 0;
    min-width: 600px;


    th { 
      flex: 1;
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
    }

    td {
      white-space: nowrap;
      padding: 16px 20px;
      color: #4a5568;
      border-bottom: 1px solid #e2e8f0;
      font-size: 15px;
      line-height: 1.5;
      transition: all 0.2s ease;

      &:first-child {
        padding-left: 24px;
        font-weight: 500;
      }

      &:last-child {
        padding-right: 24px;
      }

      &.status {
        font-weight: 500;

        &.active {
          color: #059669;
        }

        &.inactive {
          color: #dc2626;
        }

        &.pending {
          color: #d97706;
        }
      }

      &.numeric {
        font-family: "IBM Plex Mono", monospace;
        text-align: right;
      }
    }

    tr {

      transition: all 0.2s ease;

      &:hover td {
        background: #f8fafc;
      }

      &:last-child td {
        border-bottom: none;

      
      }
    }
  }

  .table-container {
    overflow-x: auto;
    margin: 0 -1px;

    &::-webkit-scrollbar {
      height: 8px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f5f9;
    }

    &::-webkit-scrollbar-thumb {
      background: #cbd5e0;
      border-radius: 4px;

      &:hover {
        background: #94a3b8;
      }
    }
  }
`;

export const Actions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;

  button,
  a {
    padding: 8px 12px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
    }

    svg {
      width: 16px;
      height: 16px;
    }
  }

  .edit {
    background: #008080;
    color: white;

    &:hover {
      background: #006666;
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  }

  .delete {
    background: #fff;
    color: #dc2626;
    border: 1px solid #dc2626;

    &:hover {
      background: #dc2626;
      color: #fff;
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  }

  .view {
    background: #fff;
    color: #3182ce;
    border: 1px solid #3182ce;

    &:hover {
      background: #3182ce;
      color: #fff;
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    gap: 6px;

    button,
    a {
      padding: 6px 10px;
      font-size: 13px;

      svg {
        width: 14px;
        height: 14px;
      }
    }
  }
`;

export const DivBotaoAdicionar = styled.div`
  width: 100%;
  float: left;
  margin-bottom: 10px;

  span {
    padding: 10px;
    background: #2dd9d0;
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
  margin: 30px 10px 50px 10px;
  color: #fff;
  border: 0px;
  background: #0085bd;
  border-radius: 5px;
  flex-direction: row;
  font-size: 16px;
  font-weight: 600;
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
  margin-top: 390px;
  margin-right: -30px;  
  color: #fff;
  position: relative;
  border: 10px;
  background: #008080;
  border-radius: 5px;
  flex-direction: row;
  cursor: pointer;
  width: auto;
  display: flex;
  justify-content: center;
  align-items: flex;
  float: right;
  font-weight: bolder;
  svg {
    margin-right: 10px;
  }
`;

export const DivInput = styled.div`
  float: left;
  flex-direction: column;
  display: flex;
`;

export const InputP = styled.div`
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
  flex-direction: column;
  display: flex;
  width: 350px;
  p {
    margin-left: 20px;
    padding: 22px 0;
  }
`;

export const InputG = styled.div`
  flex-direction: column;
  display: flex;
  width: 500px;
  p {
    margin-left: 20px;
    padding: 22px 0;
  }
`;

export const DivEixo = styled.div`
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
  background-color: #f3f4f6;
  width: 100%;
  font-size: 14px;
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
  flex-direction: row;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const DivTituloUnidadesCadastradas = styled.div`
  font-size: 1.25rem;
  color: #212121;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #2196f3;
  font-weight: 500;
  width: 100%;

  &::after {
    content: "Unidades Cadastradas";
    display: block;
  }
`;

export const ContainerModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow-y: auto;
  padding: 20px;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease;
`;

export const Modal = styled.div`
  position: relative;
  width: 95%;
  max-width: 1320px;
  min-width: 320px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  margin: 40px auto;
  overflow: visible;
`;

export const ModalForm = styled(Modal)`
  margin-top: 40px;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e0;
    border-radius: 4px;

    &:hover {
      background: #a0aec0;
    }
  }
`;

export const ModalFormUnidade = styled(ModalForm)`
  padding: 0;
  

  .modal-header {
    background: #1caecc;
    padding: 24px 32px;
    border-radius: 16px 16px 0 0;
    position: relative;

    h2 {
      color: white;
      margin: 0;
      font-size: 1.5rem;
    }
  }

  .modal-content {
    padding: 32px;
  }
`;

export const ConteudoModal = styled.div`

  width: 100%;
  color: #4a5568;
  font-size: 15px;
  padding: 24px;
  margin-left: -5px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  input,
  select,
  textarea {
    width: 100%;
    padding: 12px 16px;
    margin: 8px 0;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    color: #4a5568;
    transition: all 0.2s ease;
    background: #fff;

    &:focus {
      border-color: #1caecc;
      box-shadow: 0 0 0 3px rgba(28, 174, 204, 0.1);
      outline: none;
    }

    &:hover {
      border-color: #cbd5e0;
    }
  }

  label {
    display: block;
    margin: 16px 0 8px;
    color: #2d3748;
    font-weight: 500;
    font-size: 14px;
  }

  .form-group {
    margin-bottom: 24px;
  }
`;

export const FormModal = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

export const TabelaModal = styled.div`
  width: 100%;
  margin: 20px 0;
  overflow-x: auto;

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;

    th,
    td {
      padding: 12px 16px;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }

    th {
      background: #f8f9fa;
      font-weight: 600;
      color: #2d3748;
    }

    td {
      color: #4a5568;
    }

    tbody tr:hover {
      background: #f8fafc;
    }
  }

  @media (max-width: 768px) {
    th,
    td {
      padding: 10px;
      font-size: 14px;
    }
  }
`;

export const CloseModalButton = styled.button`
  position: absolute;
  top: 10px;
  right: -25px;
  width: 32px;
  height: 32px;
  background: #fff;

  border-radius: 50%;
  // border: 2px solid #e2e8f0;
  border:none;
  color: #4a5568;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1100;
  // box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  padding: 0;

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e0;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  span {
    position: relative;
    width: 16px;
    height: 16px;

    &::before,
    &::after {
      content: "";
      position: absolute;
      width: 16px;
      height: 2px;
      background: #4a5568;
      left: 0;
      top: 50%;
    }

    &::before {
      transform: rotate(45deg);
    }

    &::after {
      transform: rotate(-45deg);
    }
  }
`;

//Antigo CSS DIV MENU

export const DivMenu = styled.div`
  padding: 80px;
  border-radius: 3px;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
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
  //
`;
export const BotaoMenuActive = styled.div`
  min-width: 300px;
  min-height: 20px;
  border-radius: 10px;
  background: #193454;
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

//Novo CSS para o DIV MENU INDICADORES

export const DivMenuCadastro = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: linear-gradient(135deg, #1caecc 0%, #0085bd 100%);
  padding: 12px 0;
  width: 100%;
  margin: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const DivBotaoMenuCadastro = styled.div`
  display: flex;
  align-items: center;
  margin: 0 8px;
`;

export const NumeroMenuCadastro = styled.div`
  border-radius: 50%;
  padding: 6px;
  background: #ffffff;
  color: #0085bd;
  font-weight: 600;
  font-size: 13px;
  width: 22px;
  height: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
`;

export const BotaoMenuCadastro = styled.div`
  min-width: auto;
  min-height: auto;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  color: #ffffff;
  margin: 0;
  text-align: center;
  padding: 12px 18px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;
  font-size: 16px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  letter-spacing: -0.01em;
  border: 2px solid transparent;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const BotaoMenuActiveCadastro = styled(BotaoMenuCadastro)`
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  font-weight: 600;
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
  }
`;

// Novo CSS SIDE BAR
// export const Container = styled.div`
//   display: flex;
//   width: 100%;
// `;

export const Sidebar = styled.div`
   width: 250px;
  background-color: white;
  padding: 1rem;
  bottom: -600px;
  position: absolute;
  left: 0;
  top: 255px;
  overflow-y: auto;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  border-bottom: none;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background-color: #f1f1f1;
  }
`;

export const MainContent = styled.div`
  margin-left: 270px;
  padding: 1.25rem;
  min-height: calc(100vh - 160px);
`;

export const SidebarItem = styled.div<{ active?: boolean }>`
  cursor: pointer;
  padding: 0.75rem 1rem;
  margin-bottom: 0.25rem;
  font-size: 1rem;
  background-color: ${(props) => (props.active ? "#0085bd" : "transparent")};
  color: ${(props) => (props.active ? "white" : "#333")};
  border-radius: 4px;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;

  &:hover {
    background-color: ${(props) => (props.active ? "#0073a3" : "#e0e0e0")};
    border-left-color: #0085bd;
  }

  &:active {
    transform: translateX(2px);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SidebarTitle = styled.h2`
  font-size: 1.25rem;
  color: #333;
  margin: 0.5rem 0;
  padding: 0 0.5rem 0.5rem;
  border-bottom: 2px solid #ffff;
`;

export const SidebarSection = styled.div`
  margin-bottom: 2px;

  &:last-child {
    margin-bottom: 0;
  }
`;

// export const DivFormCadastro = styled.div<{ active?: boolean }>`
//   display: ${props => props.active ? 'block' : 'none'};
//   flex-direction: column;
//   justify-content: space-between;
//   min-height: 300px
//   text-align: left;
//   padding: 10px 8px 10px 10px;
//   border: solid #008080 2px;
//   border-radius: 15px;
//   margin-top: 50px;
//   color: #fff;
//   position: relative;
//   padding-bottom: 70px;
//   table{

//     display: flex;
//     justify-content: left;
//   }
//     label {
//       font-size: 20px;
//     }

//     input, select, textarea {
//       font-size: 20px;
//     }
// `;

export const FormCadastro = styled.form`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  animation: fadeIn 0.5s ease forwards;

  &::before {
    content: "Cadastro de Unidades";
    display: block;
    font-size: 1.25rem;
    color: #212121;
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #2196f3;
    font-weight: 500;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin: 1.5rem 0;
  }

  th {
    padding: 1rem;
    text-align: left;

    label {
      font-size: 0.9rem;
      font-weight: 500;
      color: #212121;
      display: block;
      margin-bottom: 0.5rem;
    }
  }

  td {
    padding: 0.5rem 1rem;
    vertical-align: top;

    input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1.5px solid #e0e0e0;
      border-radius: 6px;
      font-size: 0.9rem;
      transition: all 0.3s ease;
      background: #f8f9fa;

      &:focus {
        border-color: #2196f3;
        box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
        outline: none;
        background: white;
      }

      &:hover {
        border-color: #bdbdbd;
      }

      &[aria-invalid="true"] {
        border-color: #f44336;
        background: #fff5f5;
      }
    }
  }

  ${InputM}, ${InputG} {
    margin: 0;

    span {
      color: #f44336;
      font-size: 0.75rem;
      margin-top: 0.5rem;
      display: block;
      font-weight: 500;
    }
  }

  ${SubmitButtonModal} {
    background: #2196f3;
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    display: block;
    width: 100%;
    max-width: 200px;
    margin: 1.5rem auto 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;

    &:hover {
      background: #1976d2;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }
  }

  @media (max-width: 768px) {
    padding: 1.5rem;

    &::before {
      font-size: 1.1rem;
    }

    td {
      display: block;
      padding: 0.5rem;
    }

    th {
      display: block;
      padding: 0.5rem;
    }
  }
`;

//     input, select, textarea {
//       font-size: 20px;
//     }
// `;

export const SubmitButtonContainer = styled.div`
  position: absolute;


  bottom: 0;
  right: 0;
  padding: 10px;
  width: 100%;
`;

export const DivTextArea = styled.div`
  // float: left;
  flex-direction: column;
  display: flex;
`;

export const TextArea = styled.div`
  flex-direction: column;
  display: flex;
  width: 600px;
  border: #2dd9d0 solid 2px;
  margin: 10px;
  border-radius: 5px;
`;

export const DivFormCadastro = styled.div<{ active?: boolean }>`
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

  ${DivTituloForm} {
    width: calc(100% + 3.8rem);
    padding: 0.95rem 1.9rem;
    background-color: #0085bd;
    color: white;
    font-weight: bold;
    font-size: 1.19rem;
    margin: 0 -1.9rem 1.9rem;
    border-radius: 7.6px 7.6px 0 0;
    box-sizing: border-box;
  }

  .form-header {
    background-color: #008080;
    color: white;
    padding: 0.95rem;
    margin: -1.9rem -1.9rem 0.95rem -1.9rem;
    border-radius: 7.6px 7.6px 0 0;
  }

  .form-title {
    margin: 0;
    font-size: 17.1px;
    text-align: center;
    font-weight: bold;
  }

  table {
    width: 99%;
    border-collapse: separate;
    padding-top: 9.5px;
    border-spacing: 0 9.5px;
  }

  td {
    padding: 0 0.475rem;
    vertical-align: top;
  }

  ${InputG}, ${InputM}, ${InputP} {
    margin-bottom: 1.2rem;
  }

  ${InputG}, ${InputM}, ${InputP} {
    width: 100%;
  }

  label {
    display: block;
    margin-bottom: 0.475rem;
    font-weight: bold;
    font-size: 15.2px;
    color: #333;
  }

  input[type="text"],
  input[type="email"],
  input[type="tel"],
  select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 16px;
    line-height: 1.5;
    transition: all 0.3s ease;
    color: #333;
    background-color: #fff;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;

    &:focus {
      outline: none;
      border-color: #008080;
      box-shadow: 0 0 0 3px rgba(0, 128, 128, 0.1);
    }

    &:hover {
      border-color: #999;
    }

    &::placeholder {
      color: #999;
      opacity: 1;
    }

    &:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }
  }

  select {
    padding-right: 2rem;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23333' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 12px;
  }
  .required::after {
    content: "*";
    color: red;
    margin-left: 0.2375rem;
  }

  ${SubmitButtonContainer} {
    margin-top: 11.4rem;
    display: flex;
    justify-content: flex-end;
  }

  ${SubmitButton} {
    background-color: #0085bd;
    color: white;
    border: none;
    margin: 6.65px 1.9px 0.95px 0;
    padding: 0.7125rem 1.9rem;
    border-radius: 3.8px;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: bold;
    transition: background-color 0.285s ease, transform 0.095s ease;

    &:hover {
      background-color: #006666;
    }

    &:active {
      transform: translateY(0.95px);
    }
  }
`;

export const StepperContainer = styled.div`
  width: 100%;
  margin-bottom: 30px;
`;

export const StepperWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    background: #ddd;
    height: 2px;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    z-index: 1;
  }
`;

export const StepButton = styled.div<{ active?: boolean; completed?: boolean }>`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${(props) =>
    props.completed ? "#008080" : props.active ? "#2dd9d0" : "#fff"};
  border: 2px solid
    ${(props) =>
      props.completed ? "#008080" : props.active ? "#2dd9d0" : "#ddd"};
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => (props.completed || props.active ? "#fff" : "#666")};
  font-weight: bold;
  position: relative;
  z-index: 2;
  cursor: pointer;
  transition: all 0.3s ease;
`;

export const StepLabel = styled.div<{ active?: boolean }>`
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: ${(props) => (props.active ? "#008080" : "#666")};
  font-size: 14px;
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  width: 90px;
`;

export const StepContent = styled.div<{ active?: boolean }>`
  display: ${(props) => (props.active ? "block" : "none")};
  margin-top: 20px;
`;

export const StepperNavigation = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding: 20px 0;
  border-top: 1px solid #ddd;
`;

export const StepperButton = styled.button<{ secondary?: boolean }>`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: ${(props) => (props.secondary ? "#666" : "#008080")};
  color: white;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.secondary ? "#555" : "#006666")};
  }

  &:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
`;

export const ModalStepperWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  max-width: 800px;
  margin: 0 auto;

  &::before {
    content: "";
    position: absolute;
    background: #e2e8f0;
    height: 2px;
    width: calc(100% - 80px);
    top: 50%;
    left: 40px;
    transform: translateY(-50%);
    z-index: 1;
  }
`;

export const ModalStepButton = styled.div<{
  active?: boolean;
  completed?: boolean;
}>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${(props) =>
    props.completed ? "#1CAECC" : props.active ? "#2dd9d0" : "#fff"};
  border: 2px solid
    ${(props) =>
      props.completed ? "#1CAECC" : props.active ? "#2dd9d0" : "#e2e8f0"};
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => (props.completed || props.active ? "#fff" : "#4a5568")};
  font-weight: 600;
  font-size: 16px;
  position: relative;
  z-index: 2;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${(props) =>
    props.active ? "0 0 0 4px rgba(45, 217, 208, 0.2)" : "none"};
`;

export const ModalStepLabel = styled.div<{ active?: boolean }>`
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: ${(props) => (props.active ? "#1CAECC" : "#4a5568")};
  font-size: 14px;
  font-weight: ${(props) => (props.active ? "600" : "500")};
  width: 120px;
  white-space: nowrap;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    font-size: 12px;
    width: 100px;
    bottom: -30px;
  }
`;

export const ModalStepperNavigation = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 30px;
  padding: 20px;
  border-top: 1px solid #e2e8f0;
  width: 100%;
  position: sticky;
  bottom: 0;
  background: #fff;
  z-index: 10;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 16px;
    gap: 12px;
  }
`;

export const ModalStepperButton = styled.button<{ secondary?: boolean }>`
  padding: 12px 24px;
  min-width: 120px;
  border: none;
  border-radius: 8px;
  background-color: ${(props) => (props.secondary ? "#fff" : "#1CAECC")};
  color: ${(props) => (props.secondary ? "#4a5568" : "#fff")};
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;
  border: ${(props) => (props.secondary ? "1px solid #e2e8f0" : "none")};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background-color: ${(props) => (props.secondary ? "#f8fafc" : "#0085bd")};
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    background-color: #e2e8f0;
    color: #a0aec0;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  @media (max-width: 768px) {
    padding: 10px 20px;
    min-width: 100px;
    font-size: 13px;
  }
`;

export const ModalStepperContainer = styled.div`
  background: #fff;
  padding: 24px 32px;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 10;
`;

export const ModalStepContent = styled.div<{ active?: boolean }>`
  display: ${(props) => (props.active ? "block" : "none")};
  padding: 32px;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
