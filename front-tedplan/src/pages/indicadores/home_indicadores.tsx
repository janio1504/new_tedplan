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

interface IMunicipio {
  id_municipio: string;
  municipio_codigo_ibge: string;
  municipio_nome: string;
  municipio_cnpj: string;
  municipio_nome_prefeitura: string;
  municipio_cep: string;
  municipio_endereco: string;
  municipio_numero: string;
  municipio_bairro: string;
  municipio_telefone: string;
  municipio_email: string;
  municipio_nome_prefeito: string;
  //titular dos serviços municipais de saneamento
  id_titular_servicos_ms: string;
  ts_setor_responsavel: string;
  ts_telefone_comercial: string;
  ts_responsavel: string;
  ts_cargo: string;
  ts_telefone: string;
  ts_email: string;

  //prestador do serviço de seneamento basico
  //abastecimento de agua
  id_ps_abastecimento_agua: string;
  aa_abrangencia: string;
  aa_natureza_juridica: string;
  aa_cnpj: string;
  aa_telefone: string;
  aa_cep: string;
  aa_endereco: string;
  aa_numero: string;
  aa_bairro: string;
  aa_responsavel: string;
  aa_cargo: string;
  aa_email: string;
  aa_secretaria_setor_responsavel: string;

  //esgotamento sanitario
  id_ps_esgotamento_sanitario: string;
  es_secretaria_setor_responsavel: string;
  es_abrangencia: string;
  es_natureza_juridica: string;
  es_cnpj: string;
  es_telefone: string;
  es_cep: string;
  es_endereco: string;
  es_numero: string;
  es_bairro: string;
  es_responsavel: string;
  es_cargo: string;
  es_email: string;
  //drenagem e àguas pluvias
  id_ps_drenagem_aguas_pluviais: string;
  da_secretaria_setor_responsavel: string;
  da_abrangencia: string;
  da_natureza_juridica: string;
  da_cnpj: string;
  da_telefone: string;
  da_cep: string;
  da_endereco: string;
  da_numero: string;
  da_bairro: string;
  da_responsavel: string;
  da_cargo: string;
  da_email: string;
  //Resíduos Sólidos
  id_ps_residuo_solido: string;
  rs_secretaria_setor_responsavel: string;
  rs_abrangencia: string;
  rs_natureza_juridica: string;
  rs_cnpj: string;
  rs_telefone: string;
  rs_cep: string;
  rs_endereco: string;
  rs_numero: string;
  rs_bairro: string;
  rs_responsavel: string;
  rs_cargo: string;
  rs_email: string;

  //Regulador e Fiscalizador dos Serviços de Saneamento
  id_regulador_fiscalizador_ss: string;
  rf_setor_responsavel: string;
  rf_telefone_comercial: string;
  rf_responsavel: string;
  rf_cargo: string;
  rf_telefone: string;
  rf_email: string;
  rf_descricao: string;

  //Controle Social dos Serços Municipais de Saneamento
  id_controle_social_sms: string;
  setor_responsavel_cs_sms: string;
  telefone_cs_sms: string;
  email_cs_sms: string;

  //Responsável pelo SIMISAB
  id_responsavel_simisab: string;
  simisab_responsavel: string;
  simisab_telefone: string;
  simisab_email: string;

  //Dados demográficos
  id_dados_demograficos: string;
  dd_populacao_urbana: string;
  dd_populacao_rural: string;
  dd_populacao_total: string;
  dd_total_moradias: string;
}

interface MunicipioProps {
  municipio: IMunicipio[];
}

export default function HomeIndicadores() {
  const { usuario, signOut } = useContext(AuthContext)
  const [ nomeMunicipio, setNomeMunicipio] = useState<IMunicipio | undefined>()
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
  
   async function getMunicipio(){
    if(!usuario.id_municipio){    
      return;
    }
    const res = await api.get("getMunicipio", {params: {id_municipio: usuario?.id_municipio}});
    const municipio = await res.data;
    if(municipio){
      setNomeMunicipio(municipio.municipio_nome)
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
      <MenuHorizontal municipio={nomeMunicipio}></MenuHorizontal>
      <StatusMunicipio>
        Relatório SIMISAB correspondente ao ano {new Date().getFullYear()} - Estado PENDENTE
      </StatusMunicipio>
      
      <div className="dashboard-header" style={{
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
      </div>
      
      <MenuIndicadores></MenuIndicadores>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '30px',
        padding: '20px',
        flexWrap: 'wrap',
        width: '100%',
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
      </Container>
    </>
  );
}




