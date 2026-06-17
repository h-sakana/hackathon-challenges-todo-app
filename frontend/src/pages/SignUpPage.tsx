import { Link, useNavigate } from "react-router-dom";
import "./SignUpPage.css";
import { useState } from "react";

export const SignUpPage = () => {
  const navigate = useNavigate();

  type CreateAccountRequest = {
    name: string;
    password: string;
  };

  /** 入力されたユーザー名 */
  const [inputUserName, setInputUserName] = useState("");
  /** 入力されたパスワード */
  const [inputPassword, setInputPassword] = useState("");
  /** 入力されたパスワード（確認用） */
  const [inputPasswordConfirm, setInputPasswordConfirm] = useState("");

  /** アカウントを作成 */
  const handleCreateAccount = async () => {
    try {
      const request: CreateAccountRequest = {
        name: inputUserName,
        password: inputPassword,
      };

      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

      const response = await fetch(`${API_BASE_URL}/api/users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error("アカウント作成失敗");
      }

      alert("アカウントを作成しました。ログインしてください。");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("アカウント作成に失敗しました。");
    }
  };

  return (
    <>
      <div className="container">
        <div className="guide">
          <h1 className="title">Tasks</h1>
          <p className="subtitle">アカウントを作成</p>
        </div>

        <form className="create-form" onSubmit={(e) => e.preventDefault()}>
          <div className="input-group">
            <label>ユーザー名</label>
            <input
              type="text"
              value={inputUserName}
              onChange={(e) => setInputUserName(e.target.value)}
              placeholder="3文字以上"
              autoComplete="username"
            />
          </div>

          <div className="input-group">
            <label>パスワード</label>
            <input
              type="password"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              placeholder="8文字以上"
              autoComplete="new-password"
            />
          </div>

          <div className="input-group">
            <label>パスワード（確認）</label>
            <input
              type="password"
              value={inputPasswordConfirm}
              onChange={(e) => setInputPasswordConfirm(e.target.value)}
              placeholder="8文字以上"
              autoComplete="new-password"
            />
            {inputPassword !== inputPasswordConfirm && (
              <p className="input-error-msg">パスワードが一致していません。</p>
            )}
          </div>

          <button
            type="button"
            disabled={
              inputUserName.length < 3 ||
              inputPassword.length < 8 ||
              inputPasswordConfirm.length < 8 ||
              inputPassword !== inputPasswordConfirm
            }
            onClick={() => handleCreateAccount()}
            className="create-btn"
          >
            アカウント作成
          </button>
        </form>

        <div className="login">
          <p>すでに登録済みの方は</p>
          <Link to="/login" className="login-link">
            ログイン
          </Link>
        </div>
      </div>
    </>
  );
};
