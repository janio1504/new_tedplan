import React, { useContext, useEffect, useState } from "react";
import api from "../services/api";
import { Iframe } from "../styles/index";


export default function Pdf(id: any){
    const [pdf, setPdf] = useState('')
    useEffect(()=>{
        getPdf()
    },[])

    async function getPdf(){       
        
                const file = await api.get('getFile',{params: {id: 101}, responseType: "blob"})
                .then((response) => {
                    console.log(response.data);
                    
                   setPdf(URL.createObjectURL(response.data))
                }).catch((error)=>{
                  console.log(error);              
                });     
            return file  
      }

      return (
       <>
       
       <label><Iframe src={pdf}></Iframe></label>
       </>
      )
   
}