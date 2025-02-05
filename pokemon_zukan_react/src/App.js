import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; //react-router-domを使って、ページを切り替えられるようにする
import PokemonList from "./components/PokemonList"; // PokemonListという画面を使うために読み込む
import PokemonDetail from "./components/PokemonDetail"; //PokemonDetailという画面を使うために読み込む

function App() {
  return (
    <Router>
      <Routes>
        {/* path="/"にきたら、PokemonListコンポーネントを表示する(一覧画面を表示する) */}
        <Route path="/" element={<PokemonList />} />
        {/* path="/pokemon/:id"にきたら、PokemonDetailコンポーネントを表示する(詳細画面を表示する) */}
        <Route path="/pokemon/:id" element={<PokemonDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
// 他の場所でも使えるようにする