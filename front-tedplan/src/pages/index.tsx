import Image from "next/image";
import Link from "next/link";
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
  ForgotPasswordLink,
} from "../styles/login";
import { destroyCookie } from "nookies";
import { toast } from 'react-toastify'

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
      toast.error("Usuário ou senha inválido!", { position: "top-right", autoClose: 5000 })      
   
    });
  }

  return (
    <Container>
      <DivLogin>
        <Brasao>
          <Image src={logo} alt="Logo Tedplan" priority />
        </Brasao>

        <Form onSubmit={handleSubmit(handleSignIn)}>
          <input
            {...register("login")}
            type="text"
            placeholder="Login"
            name="login"
            autoComplete="username"
          />
          <input
            {...register("senha")}
            type="password"
            placeholder="Senha"
            name="senha"
            autoComplete="current-password"
          />
          <ForgotPasswordLink as={Link} href="/recuperar-senha">
            Esqueceu sua senha?
          </ForgotPasswordLink>
          <input
            {...register("id_sistema")}
            type="hidden"
            name="id_sistema"
            value="1"
          />

          <SubmitButton type="submit">Acessar</SubmitButton>
        </Form>
      </DivLogin>
      <Footer>&copy; Todos os direitos reservados</Footer>
    </Container>
  );
}
