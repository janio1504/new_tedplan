import Image from "next/image";
import { useForm } from "react-hook-form";
import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import logo from "../img/logo_tedplan_login.png";
import {
  Footer,
  Container,
  DivLogin,
  Form,
  SubmitButton,
  Brasao,
} from "../styles/login";
import { destroyCookie } from "nookies";
import { toast, ToastContainer } from 'react-nextjs-toast'

export default function Login() {
  const { register, handleSubmit } = useForm();
  const { signIn } = useContext(AuthContext);

  useEffect(() => {
    destroyCookie(undefined, "tedplan.token", {});
    destroyCookie(undefined, "tedplan.id_usuario", {});
    
  }, []);

  async function handleSignIn(data) {
    const res = await signIn(data)
    .then((response)=>{     
    })
    .catch((error)=>{   
      toast.notify('Usuário ou senha inválido!',{
        title: "Aconteceu o seguinte erro",
        duration: 7,
        type: "error",
      })      
   
    });
  }

  return (
    <Container>
       <ToastContainer align={"center"} position={"button"}  />
      <DivLogin>
        <Brasao>
          <Image src={logo} alt="Logo Tedplan" />
        </Brasao>

        <Form onSubmit={handleSubmit(handleSignIn)}>
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
            value="1"
          />

          <SubmitButton type="submit">Acessar</SubmitButton>
        </Form>
        <Footer>&copy; Todos os direitos reservados</Footer>
      </DivLogin>
    </Container>
  );
}
