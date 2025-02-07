require 'rails_helper'

RSpec.describe "Pokemons API", type: :request do
    # "GET /api/pokemons"のテストすると宣言。
    describe "GET /api/pokemons" do
        # テストを実行する前に事前に実行する処理を書きます。
        before do
            # 「このURLに"GET"のリクエストを送ったときに、モックのデータを返す」という設定
            stub_request(:get, "https://pokeapi.co/api/v2/pokemon?limit=10")
            # このリクエストに対するレスポンスの内容を設定。
            # 今回はstatus:200(成功)で返し、body:　{...}.to_jsonでレスポンスの内容はJSON形式
            # headers: {}でレスポンスのヘッダー情報がJSON形式であることを明示
            .to_return(status: 200, body: {
            results: [
                { name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon/25/" },
                { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" }
            ]
            }.to_json, headers: { 'Content-Type' => 'application/json' })
        end

        # テストの説明
        it "ポケモン一覧を取得できること" do
            # APIにリクエストを送る
            get "/api/pokemons"
            
            # ステータスコードの確認。今回は200(成功)かどうかをチェックする
            # 404（Not Found）や 500（Internal Server Error） なら テストは失敗する。
            expect(response).to have_http_status(:success)
            # レスポンスのJSONを解析する。response.bodyはAPIのレスポンスデータ(文字列)。
            # JSON.parse(response.body)でJSONをRubyのハッシュ(配列)に変換する
            json = JSON.parse(response.body)
            # 取得したデータ(resultsキーの値)が配列かどうかを確認する
            expect(json["results"]).to be_an(Array)
            # 最初に取得したデータを確認する
            expect(json["results"].first["name"]).to eq("ピカチュウ")
        end
    end

    # "GET /api/v1/pokemons/:id"のテストすると宣言。
    describe "GET /api/v1/pokemons/:id" do
        # テスト前に実行する処理。
        before do
            # stub_requestでPokeAPIで/pokemon/25にアクセスした際にbody内のデータを返すと宣言する
            stub_request(:get, "https://pokeapi.co/api/v2/pokemon/25")
                .to_return(status: 200, body: {
                name: "pikachu",
                height: 4,
                weight: 60,
                sprites: { front_default: "https://example.com/pikachu.png" },
                types: [{ type: { name: "electric" } }],
                abilities: [{ ability: { name: "static" } }]
            }.to_json, headers: { 'Content-Type' => 'application/json' })
        end

        # テストの説明
        it "ポケモンの詳細を取得できること" do
            # APIにリクエストを送る
            get "/api/pokemons/25"

            # ステータスコードが200(成功)かのチェック。
            expect(response).to have_http_status(:success)
            # JSON.parse(response.body)でJSONをRubyのハッシュ(配列)に変換する
            json = JSON.parse(response.body)
            # 取得したデータを確認する
            expect(json["name"]).to eq("ピカチュウ")
            expect(json["height"]).to eq(4)
            expect(json["weight"]).to eq(60)
            expect(json["sprites"]["front_default"]).to eq("https://example.com/pikachu.png")
            # typesとabilitiesが英語でのチェックなのは、React側で英語のデータを受け取ってから変換しているため。
            # nameはAPIのコントローラ上で日本語変換をしているため、日本語で一致しているかを確認している。
            expect(json["types"].first["type"]["name"]).to eq("electric")
            expect(json["abilities"].first["ability"]["name"]).to eq("static")
        end
    end
end
