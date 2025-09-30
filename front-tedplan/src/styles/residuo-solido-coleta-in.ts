import styled, { keyframes } from "styled-components";

export const Container = styled.div`
  color: #fff;
  font-family: Arial, Helvetica, sans-serif;
  height: 100%;
  max-width: 100%;
  background-color: none;

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
  max-width: 75%;
  width: 100%;
  height: 100%;

  margin-left: auto;
  margin-right: auto;
  text-align: left;
  justify-content: center;
  padding: 0px;
  display: flex;
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

export const DivFormConteudo = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin: 20px 0;
  width: 100%;
  max-width: 1200px;
  color: #333;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const DivTitulo = styled.div`
  width: 100%;
  margin-bottom: 24px;
  border-bottom: 2px solid #0085bd;
  padding-bottom: 12px;
`;

export const DivTituloConteudo = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #0085bd;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;

  label {
    font-weight: 500;
    color: #4a5568;
    margin-bottom: 4px;
  }

  select,
  input,
  textarea {
    padding: 8px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 14px;
    transition: all 0.2s ease;
    background: #fff;
    width: 100%;

    &:focus {
      outline: none;
      border-color: #0085bd;
      box-shadow: 0 0 0 3px rgba(0, 133, 189, 0.1);
    }

    &:disabled {
      background: #f7fafc;
      cursor: not-allowed;
    }
  }

  textarea {
    min-height: 100px;
    resize: vertical;
  }
`;

export const DivSeparadora = styled.div`
  width: 100%;
  height: 1px;
  background: #e2e8f0;
  margin: 24px 0;
`;

export const DivFormResiduo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin: 20px 0;
`;

export const DivFormRe = styled.div`
  background: #f8fafc;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

export const DivTituloFormResiduo = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #0085bd;
`;

export const SelectAnoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;

  label {
    font-weight: 500;
    color: #4a5568;
  }

  select {
    padding: 8px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 14px;
    min-width: 120px;
    background: #fff;
    cursor: pointer;

    &:focus {
      outline: none;
      border-color: #0085bd;
      box-shadow: 0 0 0 3px rgba(0, 133, 189, 0.1);
    }
  }
`;

export const DivForm = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: left;

  text-align: left;
  padding: 10px 8px 10px 10px;
  border: solid #008080 2px;
  border-radius: 5px;
  margin-top: 50px;
  color: #fff;
  table {
    display: flex;
    justify-content: left;
  }
`;

export const DivTituloForm = styled.div`
  width: 100%;
  padding: 10px;
  color: #fff;
  margin: -11px -10px 0 -11px;
  background-color: none;
  border-radius: 2px;
  font-weight: bolder;
`;

export const Tabela = styled.div`
  width: 100%;
  margin-bottom: 30px;
  overflow: hidden;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);

  table {
    width: 100%;

    border-collapse: separate;
    border-spacing: 0;
    min-width: 600px;

    th {
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
  justify-content: center;

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
  margin: 30px 10px 8px 10px;
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
  width: auto;
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
  color: #ffff;
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
  padding: 28px 36px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: -28px -36px 28px -36px;
    padding: 20px 36px;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
    border-radius: 16px 16px 0 0;

    .close-button {
      position: absolute;
      top: 20px;
      right: 28px;
      background: none;
      border: none;
      font-size: 16px;
      color: #64748b;
      cursor: pointer;
      padding: 8px;
      border-radius: 8px;
      transition: all 0.2s ease;

      &:hover {
        background: #e2e8f0;
        color: #1e293b;
      }
    }
  }

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 16px; // Aumenta espaço vertical entre as linhas

    th {
      color: #2d3748;
      padding: 0px 20px; // Aumenta padding horizontal
      text-align: left;
      font-weight: 600;
      font-size: 14px;
      white-space: nowrap;
    }

    td {
      padding: 8px 20px; // Aumenta padding horizontal

      input {
        width: 90%; // Reduz largura para não ficar colado
        padding: 8px 12px;
        border: 1.5px solid #e2e8f0;
        border-radius: 6px;
        font-size: 14px;
        color: #4a5568;
        transition: all 0.2s ease;
        background: #fff;
        height: 36px; // Reduz altura do input

        &:focus {
          border-color: #0085bd;
          box-shadow: 0 0 0 3px rgba(0, 133, 189, 0.1);
          outline: none;
        }

        &:hover:not(:focus) {
          border-color: #cbd5e0;
        }

        &::placeholder {
          color: #a0aec0;
        }
      }
    }
  }

  .gravar-button {
    position: absolute;
    top: 20px;
    left: 36px;
    background: #0085bd;
    color: white;
    padding: 8px 20px;
    border-radius: 6px;
    border: none;
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: #006d9a;
    }
  }

  @media (max-width: 768px) {
    padding: 20px 24px;
    border-radius: 12px;

    .modal-header {
      margin: -20px -24px 24px -24px;
      padding: 16px 24px;
      border-radius: 12px 12px 0 0;
    }

    table {
      display: block;
      overflow-x: auto;
      white-space: nowrap;

      &::-webkit-scrollbar {
        height: 8px;
      }

      &::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 4px;
      }

      &::-webkit-scrollbar-thumb {
        background: #cbd5e0;
        border-radius: 4px;

        &:hover {
          background: #94a3b8;
        }
      }
    }
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
  margin-bottom: 30px;
  overflow: hidden;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);

  table {
    width: 100%;

    border-collapse: separate;
    border-spacing: 0;
    min-width: 600px;

    th {
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

export const CloseModalButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #e2e8f0;
  color: #4a5568;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

export const StepperButton = styled.button<{ secondary?: boolean }>`
  padding: 10px;
  width: 70px;
  border: none;
  border-radius: 5px;
  background: ${(props) => (props.secondary ? "#fff" : "#2dd9d0")};
  color: ${(props) => (props.secondary ? "#667778" : "#008080")};
  cursor: pointer;
  font-weight: bolder;
  font-size: 14px;
  text-align: center;
  margin: 0 10px;
  border: ${(props) => (props.secondary ? "1px solid #e2e8f0" : "none")};

  &:disabled {
    background: #e2e8f0;
    color: #667778;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 60px;
    padding: 8px;
    margin: 0 5px;
  }
`;

export const ModalStepButton = styled.div<{
  active?: boolean;
  completed?: boolean;
}>`
  width: 35px;
  height: 35px;
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
  margin: 0 15px;
  cursor: pointer;
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
  box-shadow: ${(props) =>
    props.active ? "0 0 0 4px rgba(45, 217, 208, 0.2)" : "none"};

  &::before {
    content: "";
    position: absolute;
    width: 30px;
    height: 2px;
    background: ${(props) => (props.completed ? "#1CAECC" : "#e2e8f0")};
    left: -30px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
  }

  &:first-child::before {
    display: none;
  }

  @media (max-width: 768px) {
    width: 30px;
    height: 30px;
    margin: 0 10px;
    font-size: 14px;

    &::before {
      width: 20px;
      left: -20px;
    }
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
  gap: 20px;
  margin-top: 50px;
  padding: 20px;
  width: 100%;
  background-color: white;
  border-top: 1px solid #eee;

  button {
    padding: 10px 30px;
    border: none;
    border-radius: 4px;
    background-color: #42895b;
    color: white;
    cursor: pointer;
    transition: background-color 0.2s;
    font-weight: bold;
    min-width: 120px;

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    &:hover:not(:disabled) {
      background-color: #357048;
    }

    &[type="submit"] {
      background-color: #2196f3;
      &:hover {
        background-color: #1976d2;
      }
    }
  }
`;

export const ModalStepperButton = styled.button<{ secondary?: boolean }>`
  padding: 10px 20px;
  min-width: 100px;
  border: none;
  border-radius: 6px;
  background: ${(props) => (props.secondary ? "#fff" : "#2dd9d0")};
  color: ${(props) => (props.secondary ? "#4a5568" : "#008080")};
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  text-align: center;
  transition: all 0.2s ease;
  border: ${(props) => (props.secondary ? "1.5px solid #e2e8f0" : "none")};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${(props) => (props.secondary ? "#f7fafc" : "#20c9c0")};
    border-color: ${(props) => (props.secondary ? "#cbd5e0" : "none")};
  }

  &:disabled {
    background: #f1f5f9;
    color: #94a3b8;
    border-color: #e2e8f0;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    min-width: 90px;
    padding: 8px 16px;
    font-size: 13px;
  }
`;

export const ModalStepperContainer = styled.div`
  width: 100%;
  background-color: none;
  padding: 24px 32px;
  border-bottom: 1px solid #e2e8f0;
  margin-left: -50px;

  @media (min-width: 1600px) {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px 48px;
  }

  @media (min-width: 1920px) {
    max-width: 1400px;
  }
`;

export const ModalStepContent = styled.div<{ active?: boolean }>`
  display: ${(props) => (props.active ? "block" : "none")};
  width: 100%;
  margin-bottom: 60px;

  @media (min-width: 1600px) {
    max-width: 1200px;
    margin: 0 auto;
  }

  @media (min-width: 1920px) {
    max-width: 1400px;
  }
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

export const Sidebar = styled.div<{ isCollapsed: boolean }>`
  width: ${(props) => (props.isCollapsed ? "0": "270px")};
  background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
  padding: ${(props) => (props.isCollapsed ? "0" : "32px 24px")};
  position: absolute;
  overflow-y: 1000px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease-in-out;

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

  @media (max-width: 768px) {
    position: relative;
    width: auto;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-radius: 0;
    z-index: 1000;
    margin-bottom: 16px;
  }
`;

export const MainContent = styled.div`
  margin-left: 270px; // Para dar espaço para a sidebar
  padding: 20px;
  width: calc(100% - 270px);
`;

export const StepperContainer = styled.div`
  width: 100%;
  margin-bottom: 30px;
`;

export const StepperWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 120px;
  margin: 20px auto;
  width: 50%;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    background: #ddd;
    height: 2px;
    width: 70%;
    top: 50%;
    transform: translateY(-50%);
    left: 15%;
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
  margin-bottom: 60px;
`;
