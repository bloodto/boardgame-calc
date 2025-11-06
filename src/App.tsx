import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Hotel =
  | "콘티넨탈"
  | "임페리얼"
  | "아메리칸"
  | "페스티발"
  | "월드와이드"
  | "섹슨"
  | "타워";

interface Player {
  id: number;
  name: string;
  money: number;
  stocks: Record<Hotel, number>;
  color: string;
}

// ===== 주가 테이블 계산 (절대 수정 금지) =====
const stockTableSacksonTower: Record<number, number> = {};
const stockTableAmericanFestivalWorldwide: Record<number, number> = {};
const stockTableContinentalImperial: Record<number, number> = {};

for (let i = 2; i <= 45; i++) {
  if (i <= 2) stockTableSacksonTower[i] = 200;
  else if (i <= 3) stockTableSacksonTower[i] = 300;
  else if (i <= 4) stockTableSacksonTower[i] = 400;
  else if (i <= 5) stockTableSacksonTower[i] = 500;
  else if (i <= 6) stockTableSacksonTower[i] = 600;
  else if (i <= 10) stockTableSacksonTower[i] = 600;
  else if (i <= 20) stockTableSacksonTower[i] = 700;
  else if (i <= 30) stockTableSacksonTower[i] = 800;
  else if (i <= 40) stockTableSacksonTower[i] = 900;
  else stockTableSacksonTower[i] = 1000;

  if (i <= 2) stockTableAmericanFestivalWorldwide[i] = 300;
  else if (i <= 3) stockTableAmericanFestivalWorldwide[i] = 400;
  else if (i <= 4) stockTableAmericanFestivalWorldwide[i] = 500;
  else if (i <= 5) stockTableAmericanFestivalWorldwide[i] = 600;
  else if (i <= 6) stockTableAmericanFestivalWorldwide[i] = 700;
  else if (i <= 10) stockTableAmericanFestivalWorldwide[i] = 700;
  else if (i <= 20) stockTableAmericanFestivalWorldwide[i] = 800;
  else if (i <= 30) stockTableAmericanFestivalWorldwide[i] = 900;
  else if (i <= 40) stockTableAmericanFestivalWorldwide[i] = 1000;
  else stockTableAmericanFestivalWorldwide[i] = 1100;

  if (i <= 2) stockTableContinentalImperial[i] = 400;
  else if (i <= 3) stockTableContinentalImperial[i] = 500;
  else if (i <= 4) stockTableContinentalImperial[i] = 600;
  else if (i <= 5) stockTableContinentalImperial[i] = 700;
  else if (i <= 6) stockTableContinentalImperial[i] = 800;
  else if (i <= 10) stockTableContinentalImperial[i] = 800;
  else if (i <= 20) stockTableContinentalImperial[i] = 900;
  else if (i <= 30) stockTableContinentalImperial[i] = 1000;
  else if (i <= 40) stockTableContinentalImperial[i] = 1100;
  else stockTableContinentalImperial[i] = 1200;
}

const App: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [blockCounts, setBlockCounts] = useState<Record<Hotel, number>>({
    콘티넨탈: 0,
    임페리얼: 0,
    아메리칸: 0,
    페스티발: 0,
    월드와이드: 0,
    섹슨: 0,
    타워: 0,
  });

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [tempPlayer, setTempPlayer] = useState<Player>({
    id: Date.now(),
    name: "",
    money: 0,
    color: "#" + Math.floor(Math.random() * 16777215).toString(16),
    stocks: {
      콘티넨탈: 0,
      임페리얼: 0,
      아메리칸: 0,
      페스티발: 0,
      월드와이드: 0,
      섹슨: 0,
      타워: 0,
    },
  });

  const getHotelPrice = (hotel: Hotel) => {
    const blocks = blockCounts[hotel];
    if (["섹슨", "타워"].includes(hotel))
      return stockTableSacksonTower[blocks] || 0;
    if (["아메리칸", "페스티발", "월드와이드"].includes(hotel))
      return stockTableAmericanFestivalWorldwide[blocks] || 0;
    return stockTableContinentalImperial[blocks] || 0;
  };

  const totalAsset = (player: Player) => {
    let total = player.money;
    for (const h of Object.keys(player.stocks) as Hotel[]) {
      total += player.stocks[h] * getHotelPrice(h);
    }
    return total;
  };

  const handleAddPlayer = () => {
    setEditMode(false);
    setTempPlayer({
      id: Date.now(),
      name: "",
      money: 0,
      color: "#" + Math.floor(Math.random() * 16777215).toString(16),
      stocks: {
        콘티넨탈: 0,
        임페리얼: 0,
        아메리칸: 0,
        페스티발: 0,
        월드와이드: 0,
        섹슨: 0,
        타워: 0,
      },
    });
    setShowModal(true);
  };

  const handleEditPlayer = (player: Player) => {
    setEditMode(true);
    setTempPlayer(player);
    setShowModal(true);
  };

  const handleDeletePlayer = (id: number) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      setPlayers(players.filter((p) => p.id !== id));
    }
  };

  const handleSavePlayer = () => {
    if (editMode) {
      setPlayers(players.map((p) => (p.id === tempPlayer.id ? tempPlayer : p)));
    } else {
      setPlayers([...players, tempPlayer]);
    }
    setShowModal(false);
  };

  const leaderId =
    players.length > 0
      ? players.reduce((a, b) => (totalAsset(a) > totalAsset(b) ? a : b)).id
      : null;

  return (
    <div className="p-4 max-w-full mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">어콰이어 계산기 테스트 v0.4 🚀</h1>

      {/* 블럭 입력 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {Object.keys(blockCounts).map((hotel) => (
          <div
            key={hotel}
            className="bg-white p-2 rounded shadow flex flex-col items-center"
          >
            <span className="text-sm font-semibold mb-1">{hotel}</span>
            <input
              type="number"
              className="border rounded w-16 text-center"
              min="0"
              value={blockCounts[hotel as Hotel] || ""}
              onChange={(e) =>
                setBlockCounts({
                  ...blockCounts,
                  [hotel]: e.target.value === "" ? 0 : Number(e.target.value),
                })
              }
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleAddPlayer}
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
      >
        유저 추가
      </button>

      {/* 유저 카드 */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {players.map((p) => (
          <div
            key={p.id}
            className={`p-4 rounded-xl shadow-md transition-transform relative ${
              leaderId === p.id ? "animate-glow-border" : ""
            }`}
            style={{
              backgroundColor: p.color + "20",
              border: leaderId === p.id ? "2px solid gold" : "1px solid #ccc",
              transform: leaderId === p.id ? "scale(1.05)" : "scale(1)",
            }}
          >
            <h2 className={`font-bold ${leaderId === p.id ? "text-lg" : "text-base"}`}>
              {p.name}
            </h2>
            <p>보유금액: {p.money.toLocaleString()}원</p>
            <p className="font-bold">총자산: {totalAsset(p).toLocaleString()}원</p>

            <div className="flex justify-center gap-2 mt-2">
              <button
                onClick={() => handleEditPlayer(p)}
                className="text-sm bg-green-400 text-white px-2 py-1 rounded"
              >
                수정
              </button>
              <button
                onClick={() => handleDeletePlayer(p.id)}
                className="text-sm bg-red-400 text-white px-2 py-1 rounded"
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 모달 팝업 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded shadow-lg w-80">
            <h2 className="text-lg font-bold mb-2">
              {editMode ? "유저 수정" : "유저 추가"}
            </h2>
            <input
              type="text"
              placeholder="유저 이름"
              className="border w-full p-1 mb-2 rounded"
              value={tempPlayer.name}
              onChange={(e) =>
                setTempPlayer({ ...tempPlayer, name: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="보유 금액"
              className="border w-full p-1 mb-2 rounded"
              value={tempPlayer.money || ""}
              onChange={(e) =>
                setTempPlayer({
                  ...tempPlayer,
                  money: e.target.value === "" ? 0 : Number(e.target.value),
                })
              }
            />
            <div className="grid grid-cols-2 gap-1 mb-2">
              {Object.keys(tempPlayer.stocks).map((hotel) => (
                <input
                  key={hotel}
                  type="number"
                  placeholder={`${hotel} 주식`}
                  className="border p-1 rounded"
                  value={tempPlayer.stocks[hotel as Hotel] || ""}
                  onChange={(e) =>
                    setTempPlayer({
                      ...tempPlayer,
                      stocks: {
                        ...tempPlayer.stocks,
                        [hotel]:
                          e.target.value === ""
                            ? 0
                            : Number(e.target.value),
                      },
                    })
                  }
                />
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                취소
              </button>
              <button
                onClick={handleSavePlayer}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 그래프 */}
      {players.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">유저별 자산 비율</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={players.map((p) => ({
                  name: p.name,
                  value: totalAsset(p),
                  color: p.color,
                }))}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
              >
                {players.map((p, i) => (
                  <Cell key={i} fill={p.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <footer className="mt-8 text-gray-500 text-sm">
        <p>바이브 코딩으로 개발됨</p>
        <p>React + TypeScript + Vite + Tailwind 기반</p>
        <p className="mt-1 font-semibold text-gray-400">v0.4</p>
      </footer>

      {/* 오로라 효과 */}
      <style>
        {`
          @keyframes glow-border {
            0% { box-shadow: 0 0 10px #ffd700, 0 0 20px #ff69b4; }
            25% { box-shadow: 0 0 15px #00ffff, 0 0 30px #9370db; }
            50% { box-shadow: 0 0 20px #ffb6c1, 0 0 35px #00ffcc; }
            75% { box-shadow: 0 0 15px #ffa500, 0 0 30px #ff69b4; }
            100% { box-shadow: 0 0 10px #ffd700, 0 0 20px #ffb6c1; }
          }
          .animate-glow-border {
            animation: glow-border 2.5s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
};

export default App;
