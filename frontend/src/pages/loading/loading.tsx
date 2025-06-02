import * as S from "./loading.style";
import loadingImg from "@/assets/images/loading.png";

const LoadingPage = () => {
  return (
    <S.Overlay>
      <S.Spinner src={loadingImg} alt="로딩 중" />
    </S.Overlay>
  );
};

export default LoadingPage;
