import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  DivMenu,
  DivBotao,
  BotaoMenu,
  DivCenter,
  DivConteudo,
  MenuMunicipio,
  MunicipioDireita,
  Municipio,
  StatusMunicipio,
  MenuMunicipioItem,
} from "../../styles/indicadores";
import HeadIndicadores from "../../components/headIndicadores";
import MenuIndicadores from "../../components/MenuIndicadoresCadastro";
import Router from "next/router";
import { parseCookies } from "nookies";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../services/api";
import { GetServerSideProps } from "next";
import { getAPIClient } from "../../services/axios";
import MenuHorizontal from "../../components/MenuHorizontal";
import { Footer } from "@/styles/dashboard-original";

interface IMunicipio {
  id_municipio: string;
  municipio_codigo_ibge: string;
  municipio_nome: string;
  aa_natureza_juridica?: string;
}



export default function HomeIndicadores() {
  const { usuario, signOut } = useContext(AuthContext)
  const [dadosMunicipio, setDadosMunicipio] = useState<IMunicipio>(null);
  const [estatisticas, setEstatisticas] = useState({
    totalMunicipios: 0,
    municipiosPreenchidos: 0,
    percentualPreenchimento: 0
  })
  const [loading, setLoading] = useState(true)
  
  
  useEffect(()=>{
   getMunicipio()
   getEstatisticas()
  },[usuario])
  
  async function getMunicipio() {
    if (!usuario?.id_municipio) {
      return;
    }

    try {
      const res = await api
        .get("/getMunicipio", {
          params: { id_municipio: usuario.id_municipio },
        })
        .then((response) => {
          setDadosMunicipio(response.data);
        });
    } catch (error) {
      console.error("Erro ao carregar município:", error);
    }
  }

   async function getEstatisticas() {
     try {
       setLoading(true)
       const apiClient = getAPIClient()
       
       // Buscar total de municípios
       const totalResponse = await apiClient.get('/municipios/count')
       const totalMunicipios = totalResponse.data || 0
       
       // Buscar municípios que preencheram formulários (com dados de indicadores)
       const preenchidosResponse = await apiClient.get('/indicadores-municipio/count-municipios-ativos')
       const municipiosPreenchidos = preenchidosResponse.data || 0
       
       // Calcular percentual
       const percentual = totalMunicipios > 0 ? Math.round((municipiosPreenchidos / totalMunicipios) * 100) : 0
       
       setEstatisticas({
         totalMunicipios,
         municipiosPreenchidos,
         percentualPreenchimento: percentual
       })
     } catch (error) {
       console.error('Erro ao buscar estatísticas:', error)
       // Em caso de erro, usar dados mock para demonstração
       setEstatisticas({
         totalMunicipios: 0,
         municipiosPreenchidos: 0,
         percentualPreenchimento: 0
       })
     } finally {
       setLoading(false)
     }
   }
     
  return (
    <>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .stats-cards {
          justify-content: center;
          gap: 30px;
          padding: 20px;
        }
        
        .stats-cards > div {
          width: 300px !important;
          min-width: 280px !important;
          flex: 0 0 auto !important;
        }
        
        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }
          
          .stats-cards {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
            padding: 20px;
          }
          
          .stats-cards > div {
            width: 100% !important;
            min-width: auto !important;
          }
        }
      `}</style>
      <Container>
      <HeadIndicadores usuarios={[]}></HeadIndicadores>
      <MenuHorizontal
        municipio={dadosMunicipio?.municipio_nome}
      ></MenuHorizontal>
      <StatusMunicipio>
        Relatório SIMISAB correspondente ao ano {new Date().getFullYear()} - Estado PENDENTE
      </StatusMunicipio>
      
      {/* <div className="dashboard-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: '20px 0',
        padding: '0 20px'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#2c3e50',
          margin: 0
        }}>
          Dashboard de Indicadores
        </h2>
        
        <button
          onClick={getEstatisticas}
          disabled={loading}
          style={{
            backgroundColor: '#1e88e5',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = '#1565c0'
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = '#1e88e5'
            }
          }}
        >
          {loading ? (
            <>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid #ffffff',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Atualizando...
            </>
          ) : (
            <>
              <span>🔄</span>
              Atualizar Estatísticas
            </>
          )}
        </button>
      </div> */}
      
      <MenuIndicadores></MenuIndicadores>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '30px',
        padding: '20px',
        flexWrap: 'wrap',
        width: 'auto',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          width: '300px',
          minWidth: '280px',
          flex: '0 0 auto'
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e1e5e9',
            textAlign: 'center',
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              height: '4px',
              background: 'linear-gradient(90deg, #1e88e5, #42a5f5)'
            }} />
            <div style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#1e88e5',
              marginBottom: '8px'
            }}>
              {loading ? '...' : estatisticas.totalMunicipios.toLocaleString('pt-BR')}
            </div>
            <div style={{
              fontSize: '18px',
              color: '#495057',
              fontWeight: '500',
              marginBottom: '16px'
            }}>
              Total de Municípios
            </div>
            <div style={{
              fontSize: '14px',
              color: '#6c757d',
              lineHeight: '1.4'
            }}>
              Municípios cadastrados no sistema
            </div>
          </div>
        </div>
        
        <div style={{ width: "300px", minWidth: "280px", flex: "0 0 auto" }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e1e5e9',
            textAlign: 'center',
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              height: '4px',
              background: 'linear-gradient(90deg, #28a745, #34ce57)'
            }} />
            <div style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#28a745',
              marginBottom: '8px'
            }}>
              {loading ? '...' : estatisticas.municipiosPreenchidos.toLocaleString('pt-BR')}
            </div>
            <div style={{
              fontSize: '18px',
              color: '#495057',
              fontWeight: '500',
              marginBottom: '16px'
            }}>
              Municípios Ativos
            </div>
            <div style={{
              fontSize: '14px',
              color: '#6c757d',
              lineHeight: '1.4'
            }}>
              Que preencheram formulários
            </div>
          </div>
        </div>
        
        <div style={{ width: "300px", minWidth: "280px", flex: "0 0 auto" }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e1e5e9',
            textAlign: 'center',
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              height: '4px',
              background: 'linear-gradient(90deg, #ffc107, #ffdb4d)'
            }} />
            <div style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#ffc107',
              marginBottom: '8px'
            }}>
              {loading ? '...' : estatisticas.percentualPreenchimento}%
            </div>
            <div style={{
              fontSize: '18px',
              color: '#495057',
              fontWeight: '500',
              marginBottom: '16px'
            }}>
              Taxa de Preenchimento
            </div>
            <div style={{
              fontSize: '14px',
              color: '#6c757d',
              lineHeight: '1.4'
            }}>
              Percentual de municípios ativos
            </div>
          </div>
                </div>
      </div>
      <Footer>&copy; Todos os direitos reservados</Footer>
      </Container>
    </>
  );
}




