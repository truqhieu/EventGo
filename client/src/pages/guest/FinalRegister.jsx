import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFinalRegistation } from "../../apis/authen/authentication";
import swal from "sweetalert";

const FinalRegister = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const verifyAccount = async () => {
      try {
        const response = await apiFinalRegistation(token);
        if (response?.success) {
          swal("SUCCESS", "Registered Successfully!!!", "success").then(() => {
            navigate("/");
          });
        }
      } catch (error) {
        swal("Error", error?.response?.data?.mess, "error").then(() => {
          navigate("/");
        });
      }
    };
    verifyAccount();
  }, []);

  return <div>Processing your registration...</div>;
};

export default FinalRegister;
