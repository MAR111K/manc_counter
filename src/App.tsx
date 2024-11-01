import { useState, useEffect } from "react";
import "./App.css";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { hapticFeedback } from "@telegram-apps/sdk";
import { biometry } from "@telegram-apps/sdk";

type User = {
  name: string;
  value: number;
};

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");

  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
    if (biometry.isSupported()) {
      handlerFaceid();
    }
  }, []);

  const handlerFaceid = async () => {
    try {
      const promise = biometry.mount();
      biometry.isMounting();
      await promise;
      biometry.isMounting();
      biometry.isMounted();
      const { status, token } = await biometry.authenticate({
        reason: "Please!",
      });

      if (status === "authorized") {
        console.log(`Authorized. Token: ${token}`);
      } else {
        console.log("Not authorized");
      }
    } catch {
      biometry.mountError();
      biometry.isMounting();
      biometry.isMounted();
    }
  };

  useEffect(() => {
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

  return (
    <>
      <center>
        <Message text="Счетчик манчкинов" style={{ marginBottom: "20px" }}></Message>
        <center style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <InputText value={name} onChange={(e) => setName(e.target.value)} />
          <Button
            label="Добавить манчкина"
            icon="pi pi-check"
            onClick={() => addUser()}
          ></Button>
        </center>

        <div className="list">
          {users.map((user, index) => (
            <div key={index} className="cardWrap">
              <span className="cardText">
                {user.name}: {user.value}
              </span>
              <Button
                label="+"
                severity="success"
                onClick={() => incrementScore(index)}
              />
              <Button label="Сбросить" onClick={() => resetScore(index)} />
              <Button
                label="Удалить"
                severity="danger"
                onClick={() => removeUser(index)}
              />
            </div>
          ))}
        </div>
      </center>
    </>
  );
}

export default App;
