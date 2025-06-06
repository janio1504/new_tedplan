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
  padding: 10px 16px;
  background: #28a745;
  border: none;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
  margin-right: 8px;

  &:hover {
    background: #218838;
  }
`;
export const BotaoPermissao = styled.button`
  padding: 10px 16px;
  background:rgb(21, 155, 217);
  border: none;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
  margin-right: 8px;

  &:hover {
    background:rgb(18, 113, 172);
  }
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
  padding: 10px 16px;
  background: #dc3545;
  border: none;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
  margin-right: 8px;

  &:hover {
    background: #c82333;
  }
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
  margin: 20px 0;
  border-spacing: 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  thead {
    th {
      padding: 16px;
      font-weight: 500;
      font-size: 14px;
      text-transform: uppercase;

      &:last-child {
        text-align: right;
        padding-right: 24px;
      }
    }
    tr {
      background: #1a73e8;
    }
  }
  tbody {
    tr:nth-child(even) {
      background: #f8f9fa;
    }
    td {
      padding: 16px;
      background: #fff;
      border-bottom: 1px solid #e0e0e0;
      color: #333;
      font-size: 14px;
      transition: background 0.2s;

      &:last-child {
        text-align: right;
        padding-right: 24px;
        width: 300px;

        .button-group {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }
      }
    }
    tr:hover td {
      background: #f5f5f5;
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
  max-width: 80%;
  width: 100%;
  height: 100%;
  background: #fff;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
  justify-content: center;
  align-items: center;
  padding: 120px 20px 20px 20px;
  display: flex;
  flex-direction: column;
`;

export const BodyDashboard = styled.div`
  width: 100%;
  height: 100%;
  background: #fff;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
  display: flex;
  flex-direction: row;
`;
export const DivInstrucoes = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 15px 25px;
  margin: 12px auto;
  width: 80%;
  max-width: 800px;
  min-height: 70px;
  color: #4a4a4a;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  line-height: 1.4;
  font-size: 14px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    background-color: #ffffff;
  }
`;

export const DivInput = styled.div`
  float: left;
  flex-direction: column;
  display: flex;
`;

export const Form = styled.form`
  margin: 40px auto;
  max-width: 500px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 30px;
  background: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  box-sizing: border-box;

  input {
    width: 100%;
    max-width: 100%;
    padding: 12px 16px;
    border: 1px solid #e1e1e1;
    border-radius: 6px;
    font-size: 15px;
    color: #2c3e50;
    transition: all 0.3s ease;
    background: #f8f9fa;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: #2dd9d0;
      box-shadow: 0 0 0 2px rgba(45, 217, 208, 0.2);
      background: #ffffff;
    }

    &::placeholder {
      color: #95a5a6;
    }
  }

  textarea {
    width: 100%;
    max-width: 100%;
    min-height: 150px;
    padding: 12px 16px;
    border: 1px solid #e1e1e1;
    border-radius: 6px;
    font-size: 15px;
    color: #2c3e50;
    transition: all 0.3s ease;
    background: #f8f9fa;
    resize: vertical;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: #2dd9d0;
      box-shadow: 0 0 0 2px rgba(45, 217, 208, 0.2);
      background: #ffffff;
    }
  }

  label {
    color: #34495e;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 6px;
    display: block;
  }

  select {
    width: 100%;
    max-width: 100%;
    padding: 12px 16px;
    border: 1px solid #e1e1e1;
    border-radius: 6px;
    font-size: 15px;
    color: #2c3e50;
    background: #f8f9fa;
    cursor: pointer;
    transition: all 0.3s ease;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a0aec0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 16px;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: #2dd9d0;
      box-shadow: 0 0 0 2px rgba(45, 217, 208, 0.2);
      background-color: #ffffff;
    }
  }

  option {
    padding: 12px;
    font-size: 15px;
  }

  span {
    color: #7f8c8d;
    font-size: 13px;
    margin-top: 4px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
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
  padding: 8px 16px;
  color: #fff;
  border: 0;
  background: #1a73e8;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
  position: absolute;
  right: 0;

  &:hover {
    background: #1557b0;
  }
`;

export const NewButton = styled.button`
  padding: 12px 24px;
  color: #fff;
  border: 0;
  background: #1a73e8;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #1557b0;
  }

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
  z-index: 1000;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Modal = styled.div`
  min-width: 520px;
  max-width: 1200px;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
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
  gap: 16px;
  margin-top: 50px;

  .button-group {
    display: flex;
    gap: 8px;
    margin-top: 8px;
  }

  .image-upload-container {
    margin-top: 20px;
    padding: 16px;
    border: 1px dashed #e0e0e0;
    border-radius: 8px;
    text-align: center;
  }

  input[type="file"] {
    display: none;
  }

  .file-label {
    cursor: pointer;
    padding: 8px 16px;
    background: #f5f5f5;
    border-radius: 4px;
    border: 1px solid #e0e0e0;
    display: inline-block;
    transition: all 0.2s;

    &:hover {
      background: #e0e0e0;
    }
  }

  input {
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    padding: 12px;
    width: 100%;
    color: #333;
    transition: all 0.2s;

    &:focus {
      border-color: #1a73e8;
      box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
    }
  }

  select {
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    padding: 12px;
    width: 100%;
    background: #fff;
    transition: all 0.2s;

    &:focus {
      border-color: #1a73e8;
      box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
    }
  }

  label {
    color: #666;
    margin: 10px 0 0 15px;
    float: left;
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
  img {
    display: flex;
    width: 90%;
  }
`;

export const TituloModal = styled.div`
  text-align: center;
  margin-bottom: 24px;

  h3 {
    font-size: 20px;
    color: #333;
    font-weight: 500;
  }
`;

export const TextoModal = styled.div`
  text-align: left;
  width: 100%;
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  position: relative;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
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
  flex-direction: column;
  gap: 20px;
`;

export const CloseModalButton = styled.button`
  padding: 8px 16px;
  color: #fff;
  border: 0;
  background: #dc3545;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 13px;
  position: absolute;
  left: 0;

  &:hover {
    background: #c82333;
  }
`;

export const ConfirmButton = styled.button`
  padding: 8px 16px;
  color: #fff;
  border: 0;
  background: #28a745;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 13px;

  &:hover {
    background: #218838;
  }
`;
export const CancelButton = styled.button`
  padding: 8px 16px;
  color: #fff;
  border: 0;
  background: #dc3545;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 13px;

  &:hover {
    background: #c82333;
  }
`;

export const BotaoEditarImagem = styled.button`
  padding: 8px 16px;
  background: #1a73e8;
  border: none;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
  margin-right: 8px;

  &:hover {
    background: #1557b0;
  }
`;

export const ImageUploadArea = styled.div`
  margin-top: 20px;
  padding: 20px;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  text-align: center;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #1a73e8;
    background: #f0f7ff;
  }

  p {
    color: #666;
    margin: 8px 0;
  }
`;
