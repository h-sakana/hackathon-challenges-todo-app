import { useSetAtom } from "jotai";
import "./Header.css";
import { isLoginAtom } from "../stores/authAtom";

export const Header = () => {
  const setIsLogin = useSetAtom(isLoginAtom);

  return (
    <header>
      <h1>Tasks</h1>
      <div className="user-info">
        <p className="user-name-icon">S</p>
        <button
          onClick={() => {
            setIsLogin(false);
          }}
          className="logout-btn"
        >
          ログアウト
        </button>
      </div>
    </header>
  );
};
