import Link from "next/link";
import Router, { useRouter } from "next/router";
import { FaAngleRight } from "react-icons/fa";


export default function MenuPublicoLateral() {
  const router = useRouter();

  function handleNormas() {
    Router.push("/normas");
  }
  function handlePublicacoes() {
    Router.push("/publicacoes");
  }

  function handleGalerias() {
    Router.push("/galerias");
  }
  function handleEstatisticas() {
    Router.push("/estatisticas");
  }

  return (
    <>
      <ul>
        <li>
          <FaAngleRight /> Mapas
        </li>
        <li onClick={handleNormas}>
          <FaAngleRight /> Normas
        </li>
        <li onClick={handlePublicacoes}>
          <FaAngleRight /> Publicações
        </li>
        <li onClick={handleGalerias}>
          <FaAngleRight /> Galerias de fotos
        </li>
        <li onClick={handleEstatisticas}>
          <FaAngleRight /> Estatísticas
        </li>
      </ul>
    </>
  );
}
