import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  Container,
  DivCenter, 
} from "../styles/financeiro";
import Image from "next/image";
import HeadPublico from "../components/headPublico";
import { BotaoAguaEscuro, BotaoDrenagemEscuro, BotaoResiduosClaro, DivColEstatisticas, DivEixosEstatisticas } from "../styles";
import AguaPluviais from "../img/drenagem.png"
import Residuos from "../img/residuos_preenchido.png"
import AguaEsgoto from "../img/esgoto.png"
import ResiduosSolidos from "../components/ResiduosSolidos";


export default function Estatistica() {
    
  return (
    <Container>
      <HeadPublico></HeadPublico>
      <DivCenter>     
      <DivEixosEstatisticas>
          <DivColEstatisticas>
            <Image src={AguaPluviais} alt="Drenagem" />
            <BotaoDrenagemEscuro>Águas Pluviais</BotaoDrenagemEscuro>
          </DivColEstatisticas>
       
          <DivColEstatisticas>
            <Image src={Residuos} alt="Drenagem" />
            <BotaoResiduosClaro>Resíduos</BotaoResiduosClaro>
          </DivColEstatisticas>
      
          <DivColEstatisticas>
            <Image src={AguaEsgoto} alt="Drenagem" />
            <BotaoAguaEscuro>Água e Esgoto</BotaoAguaEscuro>
          </DivColEstatisticas>
        </DivEixosEstatisticas>  
        <ResiduosSolidos municipio={[]}></ResiduosSolidos>
      </DivCenter>
    </Container>
  );
}
