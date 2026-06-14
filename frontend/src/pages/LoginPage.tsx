import { Link } from "react-router-dom";
import "./LoginPage.css";
import { useSetAtom } from "jotai";
import { isLoginAtom } from "../stores/authAtom";

export const LoginPage = () => {
  const setIsLogin = useSetAtom(isLoginAtom);

  return (
    <>
      <div className="container">
        <div className="guide">
          <h1 className="title">Tasks</h1>
          <p className="subtitle">シンプルなタスク管理</p>
        </div>

        <div className="auth-form">
          <div className="input-group">
            <label>ユーザー名</label>
            <input type="text" value="aaaaa" placeholder="ユーザー名" />
          </div>

          <div className="input-group">
            <label>パスワード</label>
            <input type="password" value="bbbb" placeholder="パスワード" />
          </div>

          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
            }}
            className="login-btn"
          >
            ログイン
          </button>
        </div>

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
