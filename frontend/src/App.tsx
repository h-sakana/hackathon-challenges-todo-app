import "./App.css";
import { LoginPage } from "./pages/LoginPage";
import { TodoListPage } from "./pages/TodoListPage";
import { Navigate, Route, Routes } from "react-router-dom";
import { SignUpPage } from "./pages/SignUpPage";
import { useAtomValue } from "jotai";
import { isLoginAtom } from "./stores/authAtom";

const App = () => {
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

export { App };
