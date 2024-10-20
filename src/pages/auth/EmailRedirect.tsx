import { useEffect } from "react";
import { useParams } from "react-router-dom";

const EmailRedirect = () => {
  const { id, hash } = useParams();
  useEffect(() => {
    window.location.href = `http://localhost:8000/api/email/verify/${id}/${hash}`;
  }, [id, hash]);

  return <p></p>;
};

export default EmailRedirect;
