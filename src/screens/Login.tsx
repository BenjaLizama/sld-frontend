import React from "react";
import { AuthCard } from "../components/AuthCard/AuthCard";

export default function Login() {
  return (
    <div
      style={{
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        height: "100vh",
      }}
    >
      <AuthCard />
    </div>
  );
}
