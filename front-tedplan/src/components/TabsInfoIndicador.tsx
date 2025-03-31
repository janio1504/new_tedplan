import { TabsInfoOnClick } from "@/styles/financeiro";



export function TabsInfoIndicador(descricaoIndicador: any) {  
  return (
  
   <TabsInfoOnClick visibleInfo={true}>
                 <div style={{width: '100%', marginTop: '10px', borderBottom: 'solid 2px  #0085bd', fontSize: '18px', textAlign: 'center', color: '#0085bd'}}>
                   Informações do Indicador </div>
               <table style={{ borderSpacing: "0", padding: '20px', width: "100%" }} >
                 <tbody>
                   <tr style={{width: "100%"}}>
                     <td style={{textAlign: "left", color: '#053d68', fontSize: '16px', padding: '5px 0px'}}>Nome:</td>
                   </tr>
                   <tr>                                   
                     <td style={{padding: '5px 10px'}} >{descricaoIndicador.data?.nome_indicador}</td>                  
                   </tr>
                   <tr style={{width: "100%"}}>
                     <td style={{textAlign: "left", color: '#053d68', fontSize: '16px', padding: '5px 0px'}}>Código:</td>
                   </tr>
                   <tr>                                   
                     <td style={{padding: '5px 10px'}} >{descricaoIndicador.data?.codigo}</td>                  
                   </tr> 
                   <tr >
                     <td style={{textAlign: "left",color: '#053d68', fontSize: '16px', padding: '5px 0px'}}>Método de Cálculo:</td>
                   </tr>               
                   <tr>
                   <td style={{padding: '5px 10px'}}>                  
                     <img src={descricaoIndicador.data?.imagem} style={{width: "200px", borderRadius: "10px" }} /></td>
                   </tr>
                   <tr >
                     <td style={{textAlign: "left", color: '#053d68', fontSize: '16px', padding: '5px 0px'}}>Descrição:</td>
                   </tr>
                   <tr>                 
                     <td style={{textAlign: "justify", padding: '5px 10px'}}>{descricaoIndicador.data?.descricao}</td>                  
                   </tr>
                   <tr >
                     <td style={{textAlign: "left", color: '#053d68', fontSize: '16px', padding: '5px 0px'}}>Finalidade:</td>
                   </tr>
                   <tr>
                   <td style={{textAlign: "justify", padding: '5px 10px'}}>{descricaoIndicador.data?.finalidade}</td>
                   </tr>
                   <tr >
                     <td style={{textAlign: "left",color: '#053d68', fontSize: '16px', padding: '5px 0px'}}>Limitações:</td>
                   </tr>
                   <tr>               
                     <td style={{textAlign: "justify", padding: '5px 10px'}}>{descricaoIndicador.data?.limitacoes}</td>
                   </tr>   
                 </tbody>
               </table>
               </TabsInfoOnClick>
  );
}