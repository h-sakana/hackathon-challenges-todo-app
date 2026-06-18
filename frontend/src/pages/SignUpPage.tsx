import { Link, useNavigate } from "react-router-dom";
import "./SignUpPage.css";
import { useState } from "react";
import { fetcher } from "../utils/fetcher";

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
  /** エラーメッセージ表示（ユーザー名の入力桁数） */
  const [isUserNameError, setIsUserNameError] = useState(false);
  /** エラーメッセージ表示（パスワードの入力桁数） */
  const [isPasswordError, setIsPasswordError] = useState(false);

  /** アカウントを作成 */
  const handleCreateAccount = async () => {
    try {
      const request: CreateAccountRequest = {
        name: inputUserName,
        password: inputPassword,
      };

      await fetcher({
        method: "POST",
        path: "api/users/",
        body: request,
      });

      alert("アカウントを作成しました。\nログインしてください。");

      // ログイン画面へ遷移（入力補完のためユーザー名を渡す）
      navigate("/login", { state: { userName: inputUserName } });
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "アカウント作成に失敗しました。"
      );
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
              onChange={(e) => {
                setInputUserName(e.target.value);
                setIsUserNameError(false);
              }}
              onBlur={() => {
                if (inputUserName.length < 3) {
                  setIsUserNameError(true);
                } else {
                  setIsUserNameError(false);
                }
              }}
              placeholder="3文字以上"
              autoComplete="username"
            />
            {isUserNameError && (
              <p className="input-error-msg">
                ユーザー名は3文字以上で入力してください。
              </p>
            )}
          </div>

          <div className="input-group">
            <label>パスワード</label>
            <input
              type="password"
              value={inputPassword}
              onChange={(e) => {
                setInputPassword(e.target.value);
                setIsPasswordError(false);
              }}
              onBlur={() => {
                if (inputPassword.length < 8) {
                  setIsPasswordError(true);
                } else {
                  setIsPasswordError(false);
                }
              }}
              placeholder="8文字以上"
              autoComplete="new-password"
            />
            {isPasswordError && (
              <p className="input-error-msg">
                パスワードは8文字以上で入力してください。
              </p>
            )}
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
