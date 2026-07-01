import React from "react";
import { UserList } from "../components/UserList/UserList";
import { RegisterForm } from "../components/RegisterForm/RegisterForm";

export default function AdminDashboard() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "start",
        flexDirection: "row",
        marginTop: 20,
        gap: 10,
      }}
    >
      <UserList />
      <aside>
        <RegisterForm />
      </aside>
    </div>
  );
}
