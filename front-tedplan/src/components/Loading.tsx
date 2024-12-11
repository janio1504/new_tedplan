import { LoadingContainer, LoadingDots, LoadingSpinner, LoadingText } from "../styles/loading";


export function Loading() {
  return (
    <LoadingContainer>
      <LoadingSpinner />
      <LoadingText>Carregando</LoadingText>
      <LoadingDots>
        <span></span>
        <span></span>
        <span></span>
      </LoadingDots>
    </LoadingContainer>
  );
}