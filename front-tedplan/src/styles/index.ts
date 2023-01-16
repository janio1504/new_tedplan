import styled from 'styled-components';

export const Container = styled.div`
  color: #666;
  font-family: Arial, Helvetica, sans-serif;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  background: #fff;
  padding: 0px;
  margin: 0px;

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
export const Menu = styled.div`
    max-width: 20%;
    width: 20%;
    height: 100%;
    background: #444;
    align-items: left;
    float: left;
    margin: 0px;
    overflow: auto;
`;
export const ItensMenu = styled.div`
    margin: 40px 10px; 
    cursor: pointer;   
`;

export const Logo = styled.div`
    width: 250px;
    margin: 0px auto;
    padding-top: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 3px;
    img {
      width: 250px;
      margin-right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 3px;
    }
`;

export const Brasao = styled.div`
    width: 70px;
    margin: 20px auto;
    display: flex;
    justify-content: center;
    align-items: center;
`;
export const Texto = styled.div`
    margin: 30px;
    text-align: justify;
    display: flex;
    justify-content: center;
    align-items: center;
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
    z-index: 9;
  `;

export const DivMenu = styled.div`
  padding-top: 3%;
  border-radius: 3px;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  input {
    border: 1px solid #eee;
    border-radius: 5px;
    padding: 10px 15px;
    margin-left: 30px;
  }
  label {
    margin-left: 10px;
  }

`;

export const BotaoMenu = styled.div`
  width: 250px;
  height: 150px;
  border-radius: 10px;
  border: 1px solid #1caecc;
  background: #fff;
  cursor: pointer;
  color: #666;
  margin: 20px;
  display: flex;
  font-size: 14px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  transition: all 0.2s;

    &:hover {
      background: #1caecc;
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

export const SubmitButton = styled.button`
  cursor: pointer;
  padding: 10px 15px;
  margin: 10px;
  color: #fff;
  border: 0px;
  background: #01ba74;
  border-radius: 3px;
  flex-direction: row;

  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    margin-right: 8px;
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

export const DivBotao = styled.div`
  float: left;
  flex-direction: column;
  display:flex;
`;
export const BotaoMenuTexto = styled.button`
  padding: 10px 15px;
  margin: 10px 20px;
  color: #fff;
  border: 0px;
  background: #42895b;
  border-radius: 5px;
  flex-direction: row;
  cursor: pointer;
  
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background: #134a55;
  }
  svg {
    margin-right: 8px;
  }
`;

export const DivEixosEstatisticas= styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const DivColEstatisticas = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 10%;
  height: 100%;
  color: #666;
  padding: 20px;
  margin-right: 40px;
  cursor: pointer;
`;

export const BotaoResiduosSolidoEscuro = styled.div`
width: 100px;
text-align: center;
margin-top: 10px;
background-color: #667778;
font-size: 14px;
color: #fff;
border-radius: 5px;
padding: 7px 20px;
cursor: pointer;
`;

export const BotaoResiduosSolido = styled.div`
width: 100px;
text-align: center;
margin-top: 10px;
background-color: #42895B;
font-size: 14px;
color: #fff;
border-radius: 5px;
padding: 7px 20px;
cursor: pointer;
`;

export const BotaoAguaEscuro = styled.div`
width: 100px;
text-align: center;
margin-top: 10px;
background-color: #667778;
font-size: 14px;
color: #fff;
border-radius: 5px;
padding: 7px 20px;
cursor: pointer;
`;

export const BotaoAgua = styled.div`
width: 100px;
text-align: center;
margin-top: 10px;
background-color: #12b2d5;
font-size: 14px;
color: #fff;
border-radius: 5px;
padding: 7px 20px;
cursor: pointer;
`;

export const BotaoEsgotoEscuro = styled.div`
width: 100px;
text-align: center;
margin-top: 10px;
background-color: #667778;
font-size: 14px;
color: #fff;
border-radius: 5px;
padding: 7px 20px;
cursor: pointer;
`;

export const BotaoEsgoto = styled.div`
width: 100px;
text-align: center;
margin-top: 10px;
background-color: #235460;
font-size: 14px;
color: #fff;
border-radius: 5px;
padding: 7px 20px;
cursor: pointer;
`;

export const BotaoDrenagemEscuro = styled.div`
width: 100px;
text-align: center;
margin-top: 10px;
background-color: #667778;
font-size: 14px;
color: #fff;
border-radius: 5px;
padding: 7px 20px;
cursor: pointer;
`;

export const BotaoDrenagem = styled.div`
width: 100px;
text-align: center;
margin-top: 10px;
background-color: #0f4c81;
font-size: 14px;
color: #fff;
border-radius: 5px;
padding: 7px 20px;
cursor: pointer;
`;

export const BotaoResiduosEscuro = styled.div`
width: 150px;
text-align: center;
margin-top: 10px;
background-color: #667778;
font-size: 18px;
color: #fff;
border-radius: 5px;
padding: 5px 20px;
cursor: pointer;
font-weight: bolder;
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

