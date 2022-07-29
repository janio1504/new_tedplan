import { Menu, Logo, Logo_si, TextoHead } from '../styles/views'
import Image from 'next/image'
import logo from '../img/logo_tedplan_login.png';
import logo_si from '../img/logo_si.png';
import { DivCenterHead } from '../styles/views';

export default function HeadPublico(){    
    
    return (
        <Menu>
           <DivCenterHead>
           <Logo>
                <Image         
                src={logo}
                alt="TedPlan"          
                />                      
           </Logo>
           <Logo_si>
                <Image         
                src={logo_si}
                alt="TedPlan"          
                />                      
           </Logo_si>
            <TextoHead>
            <h3>Sistema Municipal<br/>
                de Informações de Saneamento Básico</h3>
            </TextoHead>

              
           </DivCenterHead>
          
        </Menu>
    )
}