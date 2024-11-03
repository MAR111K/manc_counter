import { useState, useEffect } from "react";
import "./App.css";
import "../public/fonts/fonts.scss";
import "primeicons/primeicons.css";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { hapticFeedback } from "@telegram-apps/sdk";

type User = {
  name: string;
  value: number;
};

function App() {
  const [game, setGame] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");

  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    const storedGame = localStorage.getItem("game");
    if (storedUsers) {
      try {
        setUsers(JSON.parse(storedUsers));
      } catch (e) {
        console.error("Error parsing users from localStorage:", e);
        localStorage.removeItem("users"); // Очистка поврежденных данных
      }
    }

    if (storedGame) {
      setGame(true);
    }
  }, []);

  useEffect(() => {
    console.log(23, users);
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const addUser = () => {
    if (name) {
      hapticFeedback.impactOccurred("medium");
      setUsers((prev) => [...prev, { name, value: 0 }]);
      setName("");
    }
  };

  const incrementScore = (index: number) => {
    hapticFeedback.impactOccurred("medium");
    setUsers((prev) =>
      prev.map((user, i) => (i === index ? { ...user, value: user.value + 1 } : user))
    );
  };

  const incrementScoreMinus = (index: number) => {
    hapticFeedback.impactOccurred("medium");
    setUsers((prev) =>
      prev.map((user, i) =>
        i === index
          ? { ...user, value: user.value === 0 ? user.value : user.value - 1 }
          : user
      )
    );
  };

  const resetScore = (index: number) => {
    hapticFeedback.impactOccurred("medium");

    setUsers((prev) =>
      prev.map((user, i) => (i === index ? { ...user, value: 0 } : user))
    );
  };

  const removeUser = (index: number) => {
    hapticFeedback.impactOccurred("medium");

    setUsers((prev) => prev.filter((_, i) => i !== index));
  };

  const addNewGame = () => {
    setGame(true);
    localStorage.setItem("game", "true");
  };
  return (
    <>
      {game ? (
        <center className="mainInGame">
          <p className="title">{`Счетчик\nманчкинов`}</p>
          <div className="inputWrap">
            <p className="inputTitle">Добавьте участников</p>
            <div className="inputInner">
              <InputText
                style={{ width: "100%" }}
                value={name}
                placeholder="Имя участника"
                onChange={(e) => setName(e.target.value)}
              />
              <Button icon="pi pi-plus" onClick={() => addUser()}></Button>
            </div>
          </div>

          <div className="list">
            {users.map((user, index) => (
              <div key={index} className="cardWrap">
                <div className="cardHeader">
                  <div className="cardHeaderInner" style={{ alignItems: "flex-start" }}>
                    <span className="greyText">Имя участника</span>
                    <span className="cardText">{user.name}</span>
                  </div>
                  <div className="cardHeaderInner">
                    <span className="greyText">Cчет</span>
                    <span className="cardText">{user.value}</span>
                  </div>
                </div>
                <div className="cardHeaderInner" style={{ alignItems: "flex-start" }}>
                  <span className="greyText">Управление счетом</span>
                  <div className="flexWrap">
                    <Button
                      style={{ width: "100%" }}
                      size="small"
                      icon="pi pi-minus"
                      severity="warning"
                      onClick={() => incrementScoreMinus(index)}
                    />
                    <Button
                      style={{ width: "100%" }}
                      size="small"
                      icon="pi pi-plus"
                      severity="success"
                      onClick={() => incrementScore(index)}
                    />
                  </div>
                  <Button
                    style={{ width: "100%" }}
                    label="Сбросить"
                    size="small"
                    onClick={() => resetScore(index)}
                  />
                </div>
                <Button
                  style={{ width: "100%" }}
                  label="Удалить"
                  severity="danger"
                  icon="pi pi-trash"
                  size="small"
                  onClick={() => removeUser(index)}
                />
              </div>
            ))}
          </div>
        </center>
      ) : (
        <center className="main">
          <p className="title">{`Счетчик\nманчкинов`}</p>
          <div>
            <Button
              style={{ width: "260px", height: "36px" }}
              label="Создать игру"
              severity="info"
              onClick={addNewGame}
            />
          </div>
        </center>
      )}
    </>
  );
}

export default App;
