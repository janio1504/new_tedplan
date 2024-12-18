import Image from "next/image";
import { useForm } from "react-hook-form";
import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { toast, ToastContainer } from 'react-nextjs-toast'
import logo from "../img/user_mun.png";
import {
  Footer,
  Container,
  DivLogin,
  Form,
  SubmitButton,
  Brasao,
} from "../styles/login";
import { destroyCookie } from "nookies";
import  Router  from "next/router";

export default function LoginIndicadores() {
  const { register, handleSubmit, reset } = useForm();
  const { signIn } = useContext(AuthContext);

  useEffect(() => {
    destroyCookie(undefined, "tedplan.token", {});
    destroyCookie(undefined, "tedplan.id_usuario", {}); 
    
  }, []);

  async function handleSignInIndicadores(data) {
    
    const res = await signIn(data)
    .then((response)=>{ 
    })
    .catch((error)=>{ 
      if(error.message == 'Network Error'){
        toast.notify('Sem conexão com a internet.',{
          title: "Aconteceu o seguinte erro",
          duration: 7,
          type: "error",
        })
        return
      }
        
      toast.notify('Usuário ou senha inválido!',{
        title: "Aconteceu o seguinte erro",
        duration: 7,
        type: "error",
      })    
      reset({
        senha: ''
      })
      
     
    });
    
  }

  return (
    <Container>
      
      <DivLogin>
        <Brasao>
          <Image src={logo} alt="Logo Tedplan" />
        </Brasao>
        
        <Form onSubmit={handleSubmit(handleSignInIndicadores)}>
          <input
            {...register("login")}
            type="text"
            placeholder="login"
            name="login"
          />
          <input
            {...register("senha")}
            type="password"
            placeholder="Senha"
            name="senha"
          />
          <input
            {...register("id_sistema")}
            type="hidden"
            name="id_sistema"
            value="2"
          />

          <SubmitButton type="submit">Acessar</SubmitButton>
        </Form>
        <Footer>&copy; Todos os direitos reservados<ToastContainer></ToastContainer></Footer>
      </DivLogin>
     
    </Container>
  );
}
