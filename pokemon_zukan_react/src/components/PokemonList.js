import React, { useEffect, useState } from "react";
import { data, Link } from "react-router-dom";

// PokemonListという関数コンポーネント(画面の部品)を定義しています。
function PokemonList() {
  // データの一覧を管理するpokemonという変数と、その状態を更新するためのsetpokemonを定義しています。
  // []はpokemonの初期値を空の配列(データがない状態)に設定しています。
  const [pokemon, setPokemon] = useState([]);

  // useEffect は、ページが読み込まれたときに1回だけ実行される。
  useEffect(() => {
    // fetch関数で指定したURLへアクセスし、データを取得する
    fetch('http://localhost:3000/api/pokemons')
      // APIから返されたデータをJSON形式に変換
      .then(pokemon_data => pokemon_data.json())
      // APIのレスポンスの内容(data.results)を変数pokemonにセット、データが存在しない場合はから配列にする
      .then(data => {
        console.log(data)
        setPokemon(data.results || []);
      })
      // エラーが出た際にはコンソール上に出力する
      .catch(error => console.error(error));
  }, []);
  
  return (
    <div className="App">
      <div>
        <h1>ポケモン図鑑 データリスト</h1>
        <ul>
          {pokemon.map((pokemonItem) => {
            // URLをsplit("/")で"/"で区切り、slice(-2, -1)でidを取得。配列でデータが取得されるので、[0]で最初の要素を取得するß
            const id = pokemonItem.url.split("/").slice(-2, -1)[0];
            
            return(
                <li key={id}>
                    <Link to={`/pokemon/${id}`}>{pokemonItem.name}</Link>
                </li>);
            })}
        </ul>
      </div>
    </div>
  );
}

export default PokemonList;
// 他の場所でも使えるようにする