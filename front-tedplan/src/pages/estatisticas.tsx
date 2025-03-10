import React, { useEffect, useState } from "react";
import {
  Container,
  DivCenter, 
} from "../styles/financeiro";
import Image from "next/image";
import HeadPublico from "../components/headPublico";
import { BotaoAgua, BotaoAguaEscuro, BotaoDrenagem, BotaoDrenagemEscuro, BotaoEsgoto, BotaoEsgotoEscuro, BotaoResiduosSolido, BotaoResiduosSolidoEscuro, DivColEstatisticas, DivEixosEstatisticas } from "../styles";
import Drenagem from "../img/drenagem.png"
import DrenagemActive from "../img/drenagem_preenchido.png"
import Residuos from "../img/residuos.png"
import ResiduosActive from "../img/residuos_preenchido.png"
import Esgoto from "../img/esgoto.png"
import EsgotoActive from "../img/esgoto_preenchido.png"
import Agua from "../img/agua.png"
import AguaActive from "../img/agua_preenchido.png"
import AguaComp from "../components/Agua";
import DrenagemComp from "../components/Drenagem";
import EsgotoComp from "../components/Esgoto";
import ResiduosComp from "../components/ResiduosSolidos";



export default function Estatistica() {
  

  const [active, setActive ] = useState("agua")

  function handleActive(e: string){
    setActive(e)
  } 
    
  return (
    <Container>
      <HeadPublico></HeadPublico>
      <DivCenter>     
      <DivEixosEstatisticas>
          <DivColEstatisticas>
            {active === 'agua' ? <Image onClick={()=>handleActive('agua')} src={AguaActive} alt="Agua" /> : <Image onClick={()=>handleActive('agua')} src={Agua} alt="Agua" />}
            {active === 'agua' ? <BotaoAgua>Água</BotaoAgua> : <BotaoAguaEscuro>Água</BotaoAguaEscuro>}
          </DivColEstatisticas>

          <DivColEstatisticas>
            {active === 'drenagen' ? <Image onClick={()=>handleActive('drenagen')} src={DrenagemActive} alt="Drenagem" /> : <Image onClick={()=>handleActive('drenagen')} src={Drenagem} alt="Drenagem" />}
            {active === 'grenagen' ? <BotaoDrenagem>Drenagem</BotaoDrenagem>: <BotaoDrenagemEscuro>Drenagem</BotaoDrenagemEscuro>}
          </DivColEstatisticas>

          <DivColEstatisticas>
            {active === 'esgoto' ? <Image onClick={()=>handleActive('esgoto')} src={EsgotoActive} alt="Esgoto" /> : <Image onClick={()=>handleActive('esgoto')} src={Esgoto} alt="Esgoto" />}
            {active === 'esgoto' ? <BotaoEsgoto>Esgoto</BotaoEsgoto> : <BotaoEsgotoEscuro>Esgoto</BotaoEsgotoEscuro>}
          </DivColEstatisticas>
       
          <DivColEstatisticas>
            {active === 'residuos' ? <Image onClick={()=>handleActive('residuos')} src={ResiduosActive} alt="Residuos" /> : <Image onClick={()=>handleActive('residuos')} src={Residuos} alt="Residuos" />}
            {active === 'residuos' ? <BotaoResiduosSolido>Resíduos</BotaoResiduosSolido> : <BotaoResiduosSolidoEscuro>Resíduos</BotaoResiduosSolidoEscuro>}
          </DivColEstatisticas>      
          
        </DivEixosEstatisticas> 
        {active === 'agua' &&  <AguaComp municipio={[]}></AguaComp>}
        {active === 'drenagen' && <DrenagemComp municipio={[]}></DrenagemComp>}
        {active === 'esgoto' && <EsgotoComp municipio={[]}></EsgotoComp>} 
        {active === 'residuos' && <ResiduosComp municipio={[]}></ResiduosComp>}
      </DivCenter>
    </Container>
  );
}
