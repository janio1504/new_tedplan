import Link from "next/link";
import Router, { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


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
          <FontAwesomeIcon icon='angle-right' /> Mapas
        </li>
        <li onClick={handleNormas}>
          <FontAwesomeIcon icon='angle-right' /> Normas
        </li>
        <li onClick={handlePublicacoes}>
          <FontAwesomeIcon icon='angle-right' /> Publicações
        </li>
        <li onClick={handleGalerias}>
          <FontAwesomeIcon icon='angle-right' /> Galerias de fotos
        </li>
        <li onClick={handleEstatisticas}>
          <FontAwesomeIcon icon='angle-right' /> Estatísticas
        </li>
      </ul>
    </>
  );
}
