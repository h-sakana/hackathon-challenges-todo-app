import { Link, useLocation, useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { useState } from "react";
import { useSetAtom } from "jotai";
import { loginUserAtom } from "../stores/authAtom";
import { fetcher } from "../utils/fetcher";

type LocationState = {
  state?: {
    userName: string;
  };
};

type AuthLoginRequest = {
  name: string;
  password: string;
};

export const LoginPage = () => {
  const location: LocationState = useLocation();
  const navigate = useNavigate();

  const setLoginUser = useSetAtom(loginUserAtom);

  /** 入力されたユーザー名 */
  const [inputUserName, setInputUserName] = useState(
    location.state?.userName ?? ""
  );
  /** 入力されたパスワード */
  const [inputPassword, setInputPassword] = useState("");

  /** ログイン認証 */
  const handleAuthLogin = async () => {
    try {
      const request: AuthLoginRequest = {
        name: inputUserName,
        password: inputPassword,
      };

      const data = await fetcher({
        method: "POST",
        path: "api/login/",
        requiresAuth: false,
        body: request,
      });

      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);

      setLoginUser({
        id: data.user.id,
        name: data.user.name,
      });

      navigate("/todos");
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "ログインできませんでした。\nユーザー名とパスワードを確認してください。"
      );
    }
  };

  return (
    <>
      <div className="container">
        <div className="guide">
          <h1 className="title">Tasks</h1>
          <p className="subtitle">シンプルなタスク管理</p>
        </div>

        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          <div className="input-group">
            <label>ユーザー名</label>
            <input
              type="text"
              value={inputUserName}
              onChange={(e) => setInputUserName(e.target.value)}
              placeholder="ユーザー名"
            />
          </div>

          <div className="input-group">
            <label>パスワード</label>
            <input
              type="password"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              placeholder="パスワード"
            />
          </div>

          <button
            type="button"
            onClick={() => handleAuthLogin()}
            className="login-btn"
          >
            ログイン
          </button>
        </form>

        <div className="user-create">
          <p>アカウントがない方は</p>
          <Link to="/signup" className="user-create-link">
            新規登録
          </Link>
        </div>
      </div>
    </>
  );
};
