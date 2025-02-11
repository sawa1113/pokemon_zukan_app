import React, { useEffect, useState } from "react";
import { data, Link } from "react-router-dom";

// PokemonListという関数コンポーネント(画面の部品)を定義しています。
function PokemonList() {
  // データの一覧を管理するpokemonという変数と、その状態を更新するためのsetpokemonを定義しています。
  // []はpokemonの初期値を空の配列(データがない状態)に設定しています。
  const [pokemon, setPokemon] = useState([]);
  // 現在のページ数(useState(1)は1ページから始めるため)
  const [page, setPage] = useState(1);
  // 総ページ数
  const [totalPages, setTotalPages] = useState(1);

  // useEffect は、ページが読み込まれたときに1回だけ実行される。
  useEffect(() => {
    // fetch関数で指定したURLへアクセスし、データを取得する
    fetch(`http://localhost:3000/api/pokemons?page=${page}`)
      // APIから返されたデータをJSON形式に変換
      .then(pokemon_data => pokemon_data.json())
      // APIのレスポンスの内容(data.results)を変数pokemonにセット、データが存在しない場合はから配列にする
      .then(data => {
        setPokemon(data.results || []);
        setTotalPages(data.meta.total_pages);
      })
      // エラーが出た際にはコンソール上に出力する
      .catch(error => console.error(error));
  }, [page]);

  // ページ番号のリストを作成（省略を考慮）
  const getPageNumbers = () => {
    const maxPagesToShow = 5; // 最大表示するページ番号の数
    let pages = [];

    if (totalPages <= maxPagesToShow) {
      // 総ページ数が少ない場合はすべて表示
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      // 現在のページが中央に来るように調整。startPageは1ページ目から始めるように
      let startPage = Math.max(1, page - 2);
      // endPageは総ページを超えないようにする
      let endPage = Math.min(totalPages, page + 2);

      if (startPage > 1) {
        pages.push(1); // 最初のページ
        if (startPage > 2) pages.push("..."); // 省略記号
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push("..."); // 省略記号
        pages.push(totalPages); // 最後のページ
      }
    }
    return pages;
  };
  
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
      {/* ページネーションのボタン */}
      <div className="pagination">
        <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
          Previous
        </button>

        {getPageNumbers().map((pageNum, index) => (
          <button
            key={index}
            onClick={() => typeof pageNum === "number" && setPage(pageNum)}
            disabled={pageNum === "..."}
            className={page === pageNum ? "active" : ""}
          >
            {pageNum}
          </button>
        ))}

        <button onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} disabled={page >= totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

export default PokemonList;
// 他の場所でも使えるようにする