import { useEffect } from "react";
import "./App.css";
import { AppRouter } from "./router/AppRouter";
import { API_BASE_URL } from "./constants/constant";
import { useSetAtom } from "jotai";
import { isAuthCheckingAtom, loginUserAtom } from "./stores/authAtom";

const App = () => {
  /** ログイン中のユーザー情報 */
  const setLoginUser = useSetAtom(loginUserAtom);
  /** ログイン状況チェック中フラグ  */
  const setIsAuthChecking = useSetAtom(isAuthCheckingAtom);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        // アクセストークンがなければ無条件で未ログインとする
        if (!accessToken) {
          setLoginUser(null);
          return;
        }

        // ログイン状況チェック
        const response = await fetch(`${API_BASE_URL}/api/login_check/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          setLoginUser(null);
          return;
        }

        const data = await response.json();

        setLoginUser({
          id: data.id,
          name: data.name,
        });
      } catch (error) {
        console.error(error);
        setLoginUser(null);
      } finally {
        setIsAuthChecking(false);
      }
    };

    checkLogin();
  }, [setIsAuthChecking, setLoginUser]);

  return (
    <>
      <AppRouter />
    </>
  );
};

export { App };
