import { useLocation, useNavigate } from 'react-router-dom';

export const useRiwayatDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order;

  const handleBack = () => {
    navigate(-1);
  };

  return {
    order,
    handleBack,
  };
};
