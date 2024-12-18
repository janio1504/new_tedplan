import styled from 'styled-components';

// Definição de cores e variáveis
const colors = {
  primary: '#3182ce',
  primaryHover: '#2c5282',
  background: '#f5f5f5',
  white: '#ffffff',
  border: '#ddd',
  text: '#333',
  textLight: '#666',
  shadow: 'rgba(0, 0, 0, 0.1)'
};

// Container principal
export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: ${colors.background};
  font-family: 'Inter', Arial, sans-serif;
`;

export const DivCenter = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const DivForm = styled.div`
  width: 95%;
  background: ${colors.white};
  border-radius: 12px;
  padding: 24px;
  margin: 24px 0;
  box-shadow: 0 4px 12px ${colors.shadow};
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 6px 16px ${colors.shadow};
  }
`;

export const DivTituloForm = styled.div`
  width: 100%;
  font-size: 28px;
  font-weight: 600;
  color: ${colors.text};
  margin-bottom: 24px;
  text-align: center;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: ${colors.primary};
    border-radius: 2px;
  }
`;

export const DivInput = styled.div`
  width: 100%;
  margin: 16px 0;
`;

export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

// Base para inputs
const InputBase = styled.div`
  input, select {
    width: 100%;
    padding: 12px;
    border: 2px solid ${colors.border};
    border-radius: 8px;
    font-size: 15px;
    transition: all 0.3s ease;
    
    &:focus {
      border-color: ${colors.primary};
      box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
      outline: none;
    }
    
    &:hover {
      border-color: ${colors.primary}40;
    }
  }
`;

export const InputP = styled(InputBase)`
  width: 120px;
`;

export const InputM = styled(InputBase)`
  width: 220px;
`;

export const InputG = styled(InputBase)`
  width: 320px;
`;

export const InputGG = styled(InputBase)`
  width: 420px;
`;

export const InputXL = styled(InputBase)`
  width: 520px;
`;

export const SubmitButton = styled.button`
  width: auto;
  min-width: 200px;
  padding: 14px 28px;
  background: ${colors.primary};
  color: ${colors.white};
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  margin: 24px auto;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${colors.primaryHover};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(49, 130, 206, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 2px solid ${colors.border};
  border-radius: 8px;
  font-size: 15px;
  resize: vertical;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
    outline: none;
  }
`;

export const DivTextArea = styled.div`
  width: 100%;
  margin: 16px 0;
`;

export const Tabela = styled.div`
  width: 100%;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 12px ${colors.shadow};
  margin: 24px 0;
  
  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    background: ${colors.white};
  }
  
  th, td {
    padding: 16px;
    text-align: left;
    border-bottom: 1px solid ${colors.border};
  }
  
  th {
    background: #f8f9fa;
    font-weight: 600;
    color: ${colors.text};
  }
  
  td {
    color: ${colors.textLight};
  }
  
  tbody tr {
    transition: background-color 0.2s ease;
    
    &:hover {
      background: #f8fafc;
    }
  }
  
  tbody tr:last-child td {
    border-bottom: none;
  }
`;

// Continuação dos outros componentes mantendo o mesmo padrão de estilização...
export const MenuMunicipio = styled.div`
  width: 100%;
  background: ${colors.white};
  border-radius: 12px;
  margin: 16px 0;
  box-shadow: 0 4px 12px ${colors.shadow};
  overflow: hidden;
`;

export const Municipio = styled.div`
  padding: 16px;
  font-weight: 600;
  color: ${colors.text};
  border-bottom: 1px solid ${colors.border};
`;

export const MenuMunicipioItem = styled.div`
  padding: 14px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 4px solid transparent;
  
  &:hover {
    background: #f8fafc;
    border-left-color: ${colors.primary};
  }
`;

