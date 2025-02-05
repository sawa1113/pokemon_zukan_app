import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function PokemonDetail() {
    const { id } = useParams();
    const [pokemon, setPokemon] = useState(null);
    const [japaneseName, setJapaneseName] = useState(""); // 日本語名を保存するステート
    const [typesInJapanese, setTypesInJapanese] = useState([]); // 日本語のタイプ名を保存するステート
    const [abilitiesInJapanese, setAbilitiesInJapanese] = useState([]); // 日本語の特性名を保存するステート
    const navigate = useNavigate();

    useEffect(() => {
        // ポケモンの基本データを取得
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setPokemon(data); // 取得した基本データ（ポケモンの詳細情報）をステートに保存
            })
            .catch((error) => console.error(error));

    }, [id]);

    useEffect(() => {
        if (!pokemon) return; // pokemon がまだ取得されていない場合は処理しない

        // 日本語の名前、タイプ、特性を取得
        // fetchでAPIからデータを取得する
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
            // JSON形式でデータを取得する
            .then((response) => response.json())
            .then((data) => {
                // データの中から日本語のデータを受け取る。
                const jpName = data.names.find((name) => name.language.name === "ja");
                // 日本語名のデータがあればデータをセットし、なければ「不明」にする
                setJapaneseName(jpName ? jpName.name : "不明");
            })
            .catch((error) => console.error(error));

        // ポケモンのタイプを日本語で取得
        // fetchTypeNamesという関数を作っている。asyncは非同期処理
        const fetchTypeNames = async () => {
            // pokemon?.typesは変数内にデータが含まれているか確認をしている。ない場合はエラーにならないように[](空のリスト)を入れている
            const types = pokemon?.types || [];
            // Promise.allを使い、すべてのタイプを日本語へ変換する
            const translatedTypes = await Promise.all(
                // mapを使って、タイプごとに「英語 → 日本語」の変換をする
                types.map(async (type) => {
                    // fetchを使い、データを取得する。type.type.urlで「タイプ」の詳細情報を取得する
                    const typeData = await fetch(type.type.url)
                        // fetchで取得したデータをJSON形式へ変換する
                        .then((response) => response.json())
                        .then((data) => {
                            // データの中からnames(名前のリスト)を探し、日本語("ja")を見つける
                            const jpType = data.names.find((name) => name.language.name === "ja");
                            // 日本語が見つかればjpType.nameを返す。そうでなければ英語の名前を使う
                            return jpType ? jpType.name : type.type.name;
                        })
                        .catch((error) => console.error(error));
                    // 変換したタイプの名前を返す。
                    return typeData;
                })
            );
            // タイプをすべて変換し、setTypesInJapaneseへセットする。
            setTypesInJapanese(translatedTypes);
        };

        // ポケモンの特性を日本語で取得
        // fetchAbilitiesNamesという関数を作っている。asyncは非同期処理
        const fetchAbilitiesNames = async () => {
            // pokemon?.abilitiesは変数内にデータが含まれているか確認をしている。ない場合はエラーにならないように[](空のリスト)を入れている
            const abilities = pokemon?.abilities || [];
            // Promise.allを使い、すべてのタイプを日本語へ変換する
            const translatedAbilities = await Promise.all(
                // mapを使って、特性ごとに「英語 → 日本語」の変換をする 
                abilities.map(async (ability) => {
                    // fetchを使い、データを取得する。ability.ability.urlで「特性」の詳細情報を取得す
                    const abilityData = await fetch(ability.ability.url)
                        // fetchで取得したデータをJSON形式へ変換する
                        .then((response) => response.json())
                        .then((data) => {
                            // データの中からnames(名前のリスト)を探し、日本語("ja")を見つける
                            const jpAbility = data.names.find((name) => name.language.name === "ja");
                            // 日本語が見つかればjpAbility.nameを返す。そうでなければ英語の名前を使う
                            return jpAbility ? jpAbility.name : ability.ability.name;
                        })
                        .catch((error) => console.error(error));
                    // 変換した特性の名前を返す。
                    return abilityData;
                })
            );
            // 特性をすべて変換し、setAbilitiesInJapaneseへセットする。
            setAbilitiesInJapanese(translatedAbilities);
        };

        fetchTypeNames(); // タイプ名の日本語変換
        fetchAbilitiesNames(); // 特性名の日本語変換

    }, [pokemon, id]);

    if (!pokemon) return <p>Loading...</p>;

    return (
        <div>
            <h1>{japaneseName}</h1>
            <img src={pokemon.sprites.front_default} alt={pokemon.name} />
            <p>高さ: {pokemon.height}m</p>
            <p>重さ: {pokemon.weight}kg</p>
            <p>タイプ: {typesInJapanese.join(", ")}</p> {/* 日本語のタイプ名を表示 */}
            <p>特性: {abilitiesInJapanese.join(", ")}</p> {/* 日本語の特性名を表示 */}

            <button onClick={() => navigate("/")}>戻る</button>
        </div>
    );
}

export default PokemonDetail;
// 他の場所でも使えるようにする