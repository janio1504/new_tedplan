import { PulseLoader } from "react-spinners";
import styled from "styled-components";

const LoadingWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  z-index: 1000;
`;

export const Loading = () => (
  <LoadingWrapper>
    <PulseLoader color="#1CAECC" size={15} />
  </LoadingWrapper>
);
