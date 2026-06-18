import { useEffect } from "react";
import "./App.css";
import { AppRouter } from "./router/AppRouter";
import { useSetAtom } from "jotai";
import { isAuthCheckingAtom, loginUserAtom } from "./stores/authAtom";
import { fetcher } from "./utils/fetcher";

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
        const data = await fetcher({
          method: "GET",
          path: "api/login_check/",
        });

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
