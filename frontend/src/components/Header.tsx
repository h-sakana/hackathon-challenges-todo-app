import "./Header.css";
import { useNavigate } from "react-router-dom";
import { useSetAtom } from "jotai";
import { loginUserAtom } from "../stores/authAtom";

export const Header = () => {
  const navigate = useNavigate();
  const setLoginUser = useSetAtom(loginUserAtom);

  /** ログアウト処理 */
  const handleLogout = async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setLoginUser(null);

    navigate("/login");
  };

  return (
    <header>
      <h1>Tasks</h1>
      <div className="user-info">
        <p className="user-name-icon">S</p>
        <button
          onClick={() => {
            handleLogout();
          }}
          className="logout-btn"
        >
          ログアウト
        </button>
      </div>
    </header>
  );
};
