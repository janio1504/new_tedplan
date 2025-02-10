import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Form } from "../styles/dashboard";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-nextjs-toast";
import { useResiduos } from "../contexts/ResiduosContext";
import { InputGG, InputP, InputSNIS } from "../styles/financeiro";
import api from "../services/api";
import { Actions, Tabela } from "../styles/residuo-solido-coleta-in";
import Image from "next/image";
import Excluir from "../img/excluir.png";

export default function RssExportado(id_municipio: any) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { dadosResiduos, createDataUnidadeRss, unidadesRss, removeUnidadeRss } =
    useResiduos();
  const [rsExportado, setRsExportado] = useState(true);
  const [unidadesProcessamento, setUnidadesProcessamento] = useState(null);
  const [unidadeP, setUnidadeP] = useState(null);
  const [municipioUnidade, setMunicipioUnidade] = useState(null);
  const [municipios, setMunicipios] = useState(null);

  async function handleCadastroUnidadeRss(data) {
    alert(id_municipio);
    return;
    try {
      const result = await createDataUnidadeRss(data);

      if (result.success) {
        toast.notify(result.message, {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
      } else {
        toast.notify(result.message, {
          title: "Erro!",
          duration: 7,
          type: "error",
        });
      }
    } catch (error) {
      toast.notify(error.message || "Erro ao cadastrar unidade RSS", {
        title: "Erro!",
        duration: 7,
        type: "error",
      });
    } finally {
    }
  }

  async function getUnidadesProcessamento(tipo) {
    const res = await api
      .post("list-unidades-processamento-por-tipo", {
        id_municipio: municipioUnidade,
        tipo_unidade: tipo,
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    console.log(res);

    setUnidadesProcessamento(res);
  }

  function getUP(id) {
    let up = unidadesProcessamento?.filter(
      (obj) => obj.id_unidade_processamento == id
    );
    setUnidadeP(up[0]);
  }

  const handleRemoveUnidadeRss = async (id: string) => {
    const result = await removeUnidadeRss(id);

    if (result.success) {
      toast.notify(result.message, {
        title: "Sucesso!",
        duration: 7,
        type: "success",
      });
    } else {
      toast.notify(result.message, {
        title: "Erro!",
        duration: 7,
        type: "error",
      });
    }
  };

  function rsExportadoChange(e) {
    e.target.value == "Sim" ? setRsExportado(false) : setRsExportado(true);
  }

  return (
    <>
      <table>
        <tbody>
          <tr>
            <td>
              <InputSNIS>RS030</InputSNIS>
            </td>
            <td>
              <InputGG>
                O município envia RSS coletados para outro município ?
              </InputGG>
            </td>
            <td>
              <InputP>
                <select
                  defaultValue={dadosResiduos?.rs030}
                  onChange={rsExportadoChange}
                >
                  <option value="Selecionar">Selecionar</option>
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                </select>
              </InputP>
            </td>
          </tr>
          <tr>
            <td>RS031</td>
            <td>Município(s) para onde são remitidos os RSS </td>
            <th></th>
          </tr>
        </tbody>
      </table>
      <form onSubmit={handleSubmit(handleCadastroUnidadeRss)}>
        <table>
          <tr>
            <td>Município</td>
            <td>Tipo de unidade</td>
            <td>Nome da unidade</td>
            <td>Operador da unidade</td>
            <td>CNPJ da unidade</td>
            <td>Quant. resíduos exportados</td>
          </tr>
          <tr>
            <td>
              <InputP>
                <select
                  disabled={rsExportado}
                  onChange={(e) => setMunicipioUnidade(e.target.value)}
                >
                  <option value={null}>Selecionar</option>
                  {municipios?.map((municipio, key) => (
                    <option value={municipio?.id_municipio}>
                      {municipio?.nome}
                    </option>
                  ))}
                </select>
              </InputP>
            </td>
            <td>
              <InputP>
                <select
                  disabled={municipioUnidade ? false : true}
                  {...register("tipo_unidade")}
                  onChange={(e) => getUnidadesProcessamento(e.target.value)}
                >
                  <option value="">Selecione</option>
                  <option>Lixão</option>
                  <option>Queima em forno de qualquer tipo</option>
                  <option>Unidade de manejo de galhadas e podas </option>
                  <option>Unidade de transbordo </option>
                  <option>
                    Área de reciclagem de RCC (unidade de reciclagem de entulho){" "}
                  </option>
                  <option>
                    Aterro de resíduos da construção civil (inertes)
                  </option>
                  <option>
                    Área de transbordo e triagem de RCC e volumosos (ATT)
                  </option>
                  <option>Aterro controlado </option>
                  <option>Aterro sanitário </option>
                  <option>Vala específica de RSS</option>
                  <option>Unidade de triagem (galpão ou usina)</option>
                  <option>Unidade de compostagem (pátio ou usina) </option>
                  <option>Unidade de tratamento por incineração</option>
                  <option>
                    Unidade de tratamento por microondas ou autoclave{" "}
                  </option>
                  <option>Outra</option>
                </select>
              </InputP>
            </td>
            <td>
              <InputP>
                <select
                  disabled={unidadesProcessamento ? false : true}
                  onChange={(e) => getUP(e.target.value)}
                >
                  <option>Selecionar</option>
                  {unidadesProcessamento?.map((unidade) => (
                    <option value={unidade.id_unidade_processamento}>
                      {unidade.nome_unidade_processamento}
                    </option>
                  ))}
                </select>
              </InputP>
            </td>
            <td>
              <InputP>
                <input
                  disabled={true}
                  type="text"
                  defaultValue={dadosResiduos?.rs041}
                ></input>
              </InputP>
            </td>
            <td>
              <InputP>
                <input
                  disabled={true}
                  type="text"
                  defaultValue={unidadeP?.cnpj}
                ></input>
              </InputP>
            </td>
            <td>
              <InputP>
                <input
                  disabled={unidadesProcessamento ? false : true}
                  type="text"
                  defaultValue={dadosResiduos?.rs041}
                ></input>
              </InputP>
            </td>
          </tr>
          <tr>
            <td colSpan={6}>
              <button
                style={{
                  marginLeft: "20px",
                  padding: "10px 20px",
                  background: "#2dd9d0",
                  color: "#fff",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bolder",
                  border: "#ccc",
                }}
                type="submit"
              >
                Adicionar
              </button>
            </td>
          </tr>
        </table>
      </form>
      <Tabela>
        <table cellSpacing={0}>
          <thead>
            <tr>
              <th>Município</th>
              <th>Unidade</th>
              <th>Tipo de unidade</th>
              <th>Operador da unidade</th>
              <th>CNPJ da unidade</th>
              <th>Quant. resíduos exportados</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {unidadesRss?.map((unidade, key) => (
              <>
                <tr key={key}>
                  <td>{unidade.municipio}</td>
                  <td>{unidade.nome_unidade}</td>
                  <td>{unidade.tipo_unidade}</td>
                  <td>{unidade.operador_unidade}</td>
                  <td>{unidade.cnpj_unidade}</td>
                  <td>{unidade.quant_residuos_exportados}</td>
                  <td>
                    <Actions>
                      <span>
                        <Image
                          onClick={() =>
                            handleRemoveUnidadeRss(
                              unidade.id_unidade_residuo_solido_rss
                            )
                          }
                          title="Excluir"
                          width={30}
                          height={30}
                          src={Excluir}
                          alt=""
                        />
                      </span>
                    </Actions>
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </Tabela>
    </>
  );
}
