import { useState } from "react";
import "./TodoListPage.css";
import { Header } from "../components/Header";

export const TodoListPage = () => {
  const [selectTab, setSelectTab] = useState<"all" | "deleted">("all");
  const [todoList, setTodoList] = useState([
    { todoName: "タスク1", isChecked: false },
    { todoName: "タスク2", isChecked: false },
    { todoName: "タスク3", isChecked: false },
    { todoName: "タスク4", isChecked: false },
  ]);
  const [deletedTodoList, setDeletedTodoList] = useState([
    { todoName: "タスク5", isChecked: false },
    { todoName: "タスク6", isChecked: false },
    { todoName: "タスク7", isChecked: false },
    { todoName: "タスク8", isChecked: false },
  ]);

  return (
    <>
      <Header />

      <main>
        <h2>タスク一覧</h2>

        <div className="todo-create-form">
          <input
            type="text"
            placeholder="タスクを入力"
            className="todo-create-input"
          />
          <button className="todo-create-btn">追加</button>
        </div>

        <div className="todo-tab">
          <ul>
            <li
              onClick={() => setSelectTab(() => "all")}
              className={`tab ${selectTab === "all" ? "select-tab" : "not-select-tab"}`}
            >
              すべて（4）
            </li>
            <li
              onClick={() => setSelectTab(() => "deleted")}
              className={`tab ${selectTab === "deleted" ? "select-tab" : "not-select-tab"}`}
            >
              削除済み（2）
            </li>
          </ul>
        </div>

        <div className="todo-list">
          <ul>
            {(selectTab === "all" ? todoList : deletedTodoList).map(
              (todo, index) => (
                <li className="todo-item-row" key={index}>
                  <div className="todo">
                    <button
                      type="button"
                      className={`checkbox ${todo.isChecked ? "checked" : ""}`}
                      onClick={() => {
                        (selectTab === "all"
                          ? setTodoList
                          : setDeletedTodoList)((prev) => {
                          const newChecked = !prev[index].isChecked;
                          const newTodo = {
                            ...prev[index],
                            isChecked: newChecked,
                          };
                          const newTodoList = [...prev];
                          newTodoList[index] = newTodo;

                          return newTodoList;
                        });
                      }}
                    >
                      {todo.isChecked && "✔︎"}
                    </button>
                    <p className={todo.isChecked ? "checked-todo-name" : ""}>
                      {todo.todoName}
                    </p>
                  </div>
                  <div className="todo-btns">
                    <button>編集</button>
                    <button>削除</button>
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
