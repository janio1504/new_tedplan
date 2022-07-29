import styled from 'styled-components';

export const ContainerModal = styled.div`
    position: absolute;
    z-index: 9;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;

`;

export const Modal = styled.div`
    width: 600px;
    height: ;
    background-color: #ffffff;
    border: 1px solid #bebebe;
    border-radius: 2px;
    padding: 12px 16px;
    font-size: 60px;
`;

export const ConteudoModal = styled.div`
    width: 100%;
    float: left;
    
    
    
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