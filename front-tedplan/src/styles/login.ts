import styled from 'styled-components';

export const Container = styled.div`
    color: #666;
    font-family: Arial, Helvetica, sans-serif;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    padding-top: 100px;
    margin: 0px;
    background: #fff;
`;
export const DivLogin = styled.div`
    color: #666;
    font-family: Arial, Helvetica, sans-serif;
    max-width: 350px;
    border-radius: 5px;
    background: #fff;
    padding: 30px;
    margin: 0px auto 0px auto;
    h1 {
      font-size: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 10px;
    }
    img {
      width: 250px;
    }
    small {
      font-size: 14px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
`;
export const Brasao = styled.div`
    width: 250px;
    margin: 20px auto;
    display: flex;
    justify-content: center;
    align-items: center;
`;
export const Form = styled.form`
  margin-top: 30px;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  input {
    border: 1px solid #eee;
    border-radius: 5px;
    padding: 10px 15px;
    margin: 10px;
  }
`;
export const SubmitButton = styled.button`
  padding: 10px 15px;
  margin: 10px;
  color: #fff;
  border: 0px;
  background: #42895b;
  border-radius: 3px;
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
  }
`;
