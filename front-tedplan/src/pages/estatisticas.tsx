import React, { useState } from "react";
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
  const [aguaVisible, setAguaVisible ] = useState(false)
  const [drenagemVisible, setDrenagemVisible ] = useState(false)
  const [esgotoVisible, setEsgotoVisible ] = useState(false)
  const [residuosVisible, setResiduosVisible ] = useState(true)
  
  
  function handleAgua(){
    setAguaVisible(true)
    setDrenagemVisible(false)
    setEsgotoVisible(false)
    setResiduosVisible(false)
  }
  function handleDrenagem(){
    setAguaVisible(false)
    setDrenagemVisible(true)
    setEsgotoVisible(false)
    setResiduosVisible(false)
  }
  function handleEsgoto(){
    setAguaVisible(false)
    setDrenagemVisible(false)
    setEsgotoVisible(true)
    setResiduosVisible(false)
  }
  function handleResiduos(){
    setAguaVisible(false)
    setDrenagemVisible(false)
    setEsgotoVisible(false)
    setResiduosVisible(true)
  }
  
 
    
  return (
    <Container>
      <HeadPublico></HeadPublico>
      <DivCenter>     
      <DivEixosEstatisticas>
          <DivColEstatisticas>
            {aguaVisible ? <Image onClick={handleAgua} src={AguaActive} alt="Agua" /> : <Image onClick={handleAgua} src={Agua} alt="Agua" />}
            {aguaVisible ? <BotaoAgua>Água</BotaoAgua> : <BotaoAguaEscuro>Água</BotaoAguaEscuro>}
          </DivColEstatisticas>

          <DivColEstatisticas>
            {drenagemVisible ? <Image onClick={handleDrenagem} src={DrenagemActive} alt="Drenagem" /> : <Image onClick={handleDrenagem} src={Drenagem} alt="Drenagem" />}
            {drenagemVisible ? <BotaoDrenagem>Drenagem</BotaoDrenagem>: <BotaoDrenagemEscuro>Drenagem</BotaoDrenagemEscuro>}
          </DivColEstatisticas>

          <DivColEstatisticas>
            {esgotoVisible ? <Image onClick={handleEsgoto} src={EsgotoActive} alt="Esgoto" /> : <Image onClick={handleEsgoto} src={Esgoto} alt="Esgoto" />}
            {esgotoVisible ? <BotaoEsgoto>Esgoto</BotaoEsgoto> : <BotaoEsgotoEscuro>Esgoto</BotaoEsgotoEscuro>}
          </DivColEstatisticas>
       
          <DivColEstatisticas>
            {residuosVisible ? <Image onClick={handleResiduos} src={ResiduosActive} alt="Residuos" /> : <Image onClick={handleResiduos} src={Residuos} alt="Residuos" />}
            {residuosVisible ? <BotaoResiduosSolido>Resíduos</BotaoResiduosSolido> : <BotaoResiduosSolidoEscuro>Resíduos</BotaoResiduosSolidoEscuro>}
          </DivColEstatisticas>      
          
        </DivEixosEstatisticas> 
        {aguaVisible &&  <AguaComp municipio={[]}></AguaComp>}
        {drenagemVisible && <DrenagemComp municipio={[]}></DrenagemComp>}
        {esgotoVisible && <EsgotoComp municipio={[]}></EsgotoComp>} 
        {residuosVisible && <ResiduosComp municipio={[]}></ResiduosComp>}
      </DivCenter>
    </Container>
  );
}
