class Api::PokemonsController < ApplicationController
    require 'net/http'
    require 'json'

    # pokemon.jsonファイルを読み込んで辞書を作成
    # JSON.parse(...)でJSONファイルを読み込んでハッシュに変換
    # File.read(...)でファイルを読み込む
    # Rails.root.join(...)でファイルのパスを取得
    POKEMON_NAMES = JSON.parse(File.read(Rails.root.join('config', 'pokemon.json')))
  
    def index
        # APIからデータを取得
        url = URI("https://pokeapi.co/api/v2/pokemon?limit=10")
        response = Net::HTTP.get(url)
        pokemon_data = JSON.parse(response)

        # 名前を日本語に変換。pokemon_data["results"]でAPIから返されたデータを取得。
        pokemon_data["results"].each do |pokemon|
            # 英語で取得したデータを日本語へ変換する
            pokemon["name"] = translate_pokemon_name(pokemon["name"])
        end

        # 変換後のデータをJSON形式で返す。
        render json: { results: pokemon_data["results"] }
    end
  
    def show
        # APIからデータを取得
        url = URI("https://pokeapi.co/api/v2/pokemon/#{params[:id]}")
        response = Net::HTTP.get(url)
        pokemon_data = JSON.parse(response)
        
        # 英語で取得したデータを日本語へ変換する
        pokemon_data["name"] = translate_pokemon_name(pokemon_data["name"])

        # 変換後のデータをJSON形式で返す。
        render json: pokemon_data
    end
  
    private

    def translate_pokemon_name(name)
        POKEMON_NAMES[name] || name # 名前が辞書にない場合は元の名前を返す
    end
end

  