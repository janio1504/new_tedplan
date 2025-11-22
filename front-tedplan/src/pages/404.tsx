import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { Container, Footer } from "../styles/dashboard";
import HeadPublico from "../components/headPublico";
import styled from "styled-components";

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
  padding: 40px 20px;
  text-align: center;
`;

const ErrorContent = styled.div`
  max-width: 600px;
  width: 100%;
`;

const ErrorCode = styled.h1`
  font-size: 120px;
  font-weight: bold;
  color: #0085bd;
  margin: 0;
  line-height: 1;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    font-size: 80px;
  }
`;

const ErrorTitle = styled.h2`
  font-size: 32px;
  color: #333;
  margin: 20px 0 10px 0;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const ErrorMessage = styled.p`
  font-size: 18px;
  color: #666;
  margin: 10px 0 30px 0;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 30px;
`;

const Button = styled.a<{ $primary?: boolean }>`
  display: inline-block;
  padding: 14px 28px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid ${props => props.$primary ? '#0085bd' : '#666'};
  background-color: ${props => props.$primary ? '#0085bd' : 'transparent'};
  color: ${props => props.$primary ? '#fff' : '#666'};

  &:hover {
    background-color: ${props => props.$primary ? '#006ba1' : '#f3f4f6'};
    border-color: ${props => props.$primary ? '#006ba1' : '#333'};
    color: ${props => props.$primary ? '#fff' : '#333'};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    padding: 12px 24px;
    font-size: 14px;
  }
`;

const BackButton = styled.button`
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #0085bd;
  background: transparent;
  border: 1px solid #0085bd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 15px;

  &:hover {
    background-color: #0085bd;
    color: #fff;
  }
`;

export default function Custom404() {
  const router = useRouter();

  return (
    <Container>
      <HeadPublico />
      <ErrorContainer>
        <ErrorContent>
          <ErrorCode>404</ErrorCode>
          <ErrorTitle>Página não encontrada</ErrorTitle>
          <ErrorMessage>
            A página que você está procurando não existe ou foi movida.
            <br />
            Verifique o endereço e tente novamente.
          </ErrorMessage>
          
          <ButtonContainer>
            <Link href="/" passHref legacyBehavior>
              <Button $primary>
                Ir para a página inicial
              </Button>
            </Link>
            <Link href="/estatisticas" passHref legacyBehavior>
              <Button>
                Ver Estatísticas
              </Button>
            </Link>
          </ButtonContainer>

          <BackButton onClick={() => router.back()}>
            ← Voltar para página anterior
          </BackButton>
        </ErrorContent>
      </ErrorContainer>
      <Footer>&copy; Todos os direitos reservados</Footer>
    </Container>
  );
}

