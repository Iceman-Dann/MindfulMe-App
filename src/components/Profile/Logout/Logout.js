import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { logout } from "../../../store/features/auth/authSlice.js";
import { logoutUser } from "../../../utils/auth.js";
import { useEffect } from "react";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      dispatch(logout());
      navigate("/");
    }
  };

  useEffect(() => {
    handleLogout();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <h2>Logout</h2>
    </div>
  );
};

export default Logout;
