import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";
import { SignUpPage } from "../pages/SignUpPage";
import { TodoListPage } from "../pages/TodoListPage";
import { ScrollToTop } from "../components/ScrollToTop";
import { useAtomValue } from "jotai";
import { isAuthCheckingAtom, loginUserAtom } from "../stores/authAtom";

export const AppRouter = () => {
  const loginUser = useAtomValue(loginUserAtom);
  const isAuthChecking = useAtomValue(isAuthCheckingAtom);

  if (isAuthChecking) {
    return <p>ログイン確認中...</p>;
  }

  const isLogin = loginUser !== null;

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            isLogin ? <Navigate to="/todos" /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/login"
          element={isLogin ? <Navigate to="/todos" /> : <LoginPage />}
        />
        <Route
          path="/signup"
          element={isLogin ? <Navigate to="/todos" /> : <SignUpPage />}
        />
        <Route
          path="/todos"
          element={isLogin ? <TodoListPage /> : <Navigate to="/login" />}
        />
      </Routes>
    </>
  );
};
