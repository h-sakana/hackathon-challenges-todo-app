import { Link } from "react-router-dom";
import "./SignUpPage.css";

export const SignUpPage = () => {
  return (
    <>
      <div className="container">
        <div className="guide">
          <h1 className="title">Tasks</h1>
          <p className="subtitle">アカウントを作成</p>
        </div>

        <div className="create-form">
          <div className="input-group">
            <label>ユーザー名</label>
            <input type="text" value="aaaaa" placeholder="3文字以上" />
          </div>

          <div className="input-group">
            <label>パスワード</label>
            <input type="password" value="bbbb" placeholder="8文字以上" />
          </div>

          <div className="input-group">
            <label>パスワード（確認）</label>
            <input type="password" value="bbbb" placeholder="8文字以上" />
          </div>

          <button type="button" className="create-btn">
            アカウント作成
          </button>
        </div>

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
