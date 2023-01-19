import React, { useContext, useEffect, useState } from "react";
import api from "../../services/api";
import { Iframe } from "../../styles/index";
import Router, { useRouter } from 'next/router'
import { isNumber } from "util";

export default function Pdf(){
    const [pdf, setPdf] = useState('')
    const router = useRouter()
    const { pid } = router.query

    useEffect(()=>{
        if(pid){
            getPdf(pid)
        }else{
            Router.push('/indicadores/monitoramento-avaliacao')
        }     
    },[pid])
    
    async function getPdf(id){        
        
                await api.get('getFile',{params: {id: id}, responseType: "blob"})
                .then((response) => {
                   setPdf(URL.createObjectURL(response.data))
                }).catch((error)=>{
                  console.log(error);              
                });
      }

      return (
       <>
       <Iframe src={pdf}></Iframe>
       
       </>
      )
   
}