import { useEffect, useState } from "react";
import "./TodoListPage.css";
import { Header } from "../components/Header";
import { API_BASE_URL } from "../constants/constant";
import { fetcher } from "../utils/fetcher";

type Todo = {
  id: number;
  name: string;
  is_checked: boolean;

  message?: string;
};

type CreateTodoRequest = {
  name: string;
};

export const TodoListPage = () => {
  const [selectTab, setSelectTab] = useState<"not_del" | "del">("not_del");
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [deletedTodoList, setDeletedTodoList] = useState<Todo[]>([]);
  const [inputTodoName, setInputTodoName] = useState("");

  const handleCreateTodo = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputTodoName.trim() === "") {
      alert("タスク名を入力してください。");
      return;
    }

    try {
      const request: CreateTodoRequest = {
        name: inputTodoName,
      };

      const data = await fetcher({
        method: "POST",
        path: "api/todos/",
        body: request,
      });

      setTodoList((prev) => [data, ...prev]);
      (selectTab === "not_del" ? setInputTodoName : setInputTodoName)("");
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error ? error.message : "タスクの作成に失敗しました。"
      );
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await fetcher({
        method: "DELETE",
        path: `api/todos/${id}/`,
        params: { ...(selectTab === "del" && { status: "del" }) },
      });

      if (selectTab === "not_del") {
        const targetTodo = todoList.find((todo) => todo.id === id);
        if (!targetTodo) {
          return;
        }

        setTodoList((prev) => prev.filter((todo) => todo.id !== id));
        setDeletedTodoList((prev) => [targetTodo, ...prev]);
      } else {
        const targetTodo = deletedTodoList.find((todo) => todo.id === id);
        if (!targetTodo) {
          return;
        }

        setDeletedTodoList((prev) => prev.filter((todo) => todo.id !== id));
      }
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error ? error.message : "タスクの削除に失敗しました。"
      );
    }
  };

  const handleEditTodo = async (id: number, editedName: string | null) => {
    if (editedName === null) return;

    try {
      const data = await fetcher({
        method: "PATCH",
        path: `api/todos/${id}/`,
        body: { name: editedName },
      });

      (selectTab === "not_del" ? setTodoList : setDeletedTodoList)((prev) =>
        prev.map((todo) => (todo.id === id ? data : todo))
      );
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error ? error.message : "タスクの編集に失敗しました。"
      );
    }
  };

  const handleCheckTodo = async (id: number, isChecked: boolean) => {
    try {
      const data = await fetcher({
        method: "PATCH",
        path: `api/todos/${id}/`,
        body: { is_checked: isChecked },
      });

      (selectTab === "not_del" ? setTodoList : setDeletedTodoList)((prev) =>
        prev.map((todo) => (todo.id === id ? data : todo))
      );
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "チェックの切り替えに失敗しました。"
      );
    }
  };

  useEffect(() => {
    const handleGetTodos = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await fetch(
          `${API_BASE_URL}/api/todos/?status=${selectTab}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const data: Todo[] = await response.json();

        if (!response.ok) {
          throw new Error("タスクの取得に失敗しました。");
        }

        (selectTab === "not_del" ? setTodoList : setDeletedTodoList)(data);
      } catch (error) {
        console.error(error);
        alert(
          error instanceof Error
            ? error.message
            : "タスクの取得に失敗しました。"
        );
      }
    };
    handleGetTodos();
  }, [selectTab]);

  return (
    <>
      <Header />

      <main>
        <h2>タスク一覧</h2>

        <form className="todo-create-form" onSubmit={handleCreateTodo}>
          <input
            type="text"
            placeholder="タスクを入力"
            value={inputTodoName}
            onChange={(e) => setInputTodoName(e.target.value)}
            className="todo-create-input"
          />
          <button type="submit" className="todo-create-btn">
            追加
          </button>
        </form>

        <div className="todo-tab">
          <ul>
            <li
              onClick={() => setSelectTab(() => "not_del")}
              className={`tab ${selectTab === "not_del" ? "select-tab" : "not-select-tab"}`}
            >
              すべて（{todoList.length}）
            </li>
            <li
              onClick={() => setSelectTab(() => "del")}
              className={`tab ${selectTab === "del" ? "select-tab" : "not-select-tab"}`}
            >
              削除済み（{deletedTodoList.length}）
            </li>
          </ul>
        </div>

        <div className="todo-list">
          <ul>
            {(selectTab === "not_del" ? todoList : deletedTodoList).map(
              (todo, index) => (
                <li className="todo-item-row" key={todo.id}>
                  <div className="todo">
                    <button
                      type="button"
                      className={`checkbox ${todo.is_checked ? "checked" : ""}`}
                      onClick={() => {
                        if (selectTab === "not_del") {
                          (selectTab === "not_del"
                            ? setTodoList
                            : setDeletedTodoList)((prev) => {
                            const newChecked = !prev[index].is_checked;
                            const newTodo = {
                              ...prev[index],
                              is_checked: newChecked,
                            };
                            const newTodoList = [...prev];
                            newTodoList[index] = newTodo;

                            return newTodoList;
                          });
                          handleCheckTodo(todo.id, !todo.is_checked);
                        }
                      }}
                    >
                      {todo.is_checked && "✔︎"}
                    </button>
                    <p className={todo.is_checked ? "checked-todo-name" : ""}>
                      {todo.name}
                    </p>
                  </div>
                  <div className="todo-btns">
                    {selectTab === "not_del" && (
                      <>
                        <button
                          onClick={() => {
                            const editedName = prompt(
                              "タスクを編集",
                              todo.name
                            );

                            handleEditTodo(todo.id, editedName);
                          }}
                        >
                          編集
                        </button>
                      </>
                    )}
                    <button onClick={() => handleDeleteTodo(todo.id)}>
                      削除
                    </button>
                  </div>
                </li>
              )
            )}
          </ul>
        </div>
      </main>
    </>
  );
};
