import { useEffect } from "react";
import { useParams } from "react-router-dom";

const EmailRedirect = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { id, hash } = useParams();
  useEffect(() => {
    window.location.href = `${API_URL}/email/verify/${id}/${hash}`;
  }, [id, hash]);

  return <p></p>;
};

export default EmailRedirect;
