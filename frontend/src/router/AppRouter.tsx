import { useAtomValue } from "jotai";
import { Navigate, Route, Routes } from "react-router-dom";
import { isLoginAtom } from "../stores/authAtom";
import { LoginPage } from "../pages/LoginPage";
import { SignUpPage } from "../pages/SignUpPage";
import { TodoListPage } from "../pages/TodoListPage";

export const AppRouter = () => {
  const isLogin = useAtomValue(isLoginAtom);

  return (
    <Routes>
      <Route
        path="/"
        element={isLogin ? <Navigate to="/todos" /> : <Navigate to="/login" />}
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
  );
};
