import React from "react";
import s from "./App.module.css";
import Content from "./Components/Content/Content";
import Header from "./Components/Header/Header";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className={s.App}>
        <Header />
        <Content />
      </div>
    </BrowserRouter>
  );
}

export default App;
