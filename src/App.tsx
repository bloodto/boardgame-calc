// src/App.tsx
import React, { useMemo, useState } from "react";
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

/* ====== 주가 테이블 (절대 수정 금지) ====== */
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

const HOTEL_LIST: Hotel[] = [
  "콘티넨탈",
  "임페리얼",
  "아메리칸",
  "페스티발",
  "월드와이드",
  "섹슨",
  "타워",
];

const hotelColors: Record<Hotel, string> = {
  콘티넨탈: "#87CEEB",
  임페리얼: "#FFA500",
  아메리칸: "#4169E1",
  페스티발: "#98FB98",
  월드와이드: "#9370DB",
  섹슨: "#FF6347",
  타워: "#FFD700",
};

function getHotelPrice(hotel: Hotel, blocks: Record<Hotel, number>) {
  const b = blocks[hotel] ?? 0;
  if (hotel === "섹슨" || hotel === "타워") return stockTableSacksonTower[b] || 0;
  if (hotel === "아메리칸" || hotel === "페스티발" || hotel === "월드와이드")
    return stockTableAmericanFestivalWorldwide[b] || 0;
  return stockTableContinentalImperial[b] || 0;
}

function calcTotalAsset(p: Player, blocks: Record<Hotel, number>) {
  let total = p.money;
  for (const h of HOTEL_LIST) {
    total += (p.stocks[h] || 0) * getHotelPrice(h, blocks);
  }
  return total;
}

const makeEmptyPlayer = (id = Date.now()): Player => ({
  id,
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

export default function App() {
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
  const [tempPlayer, setTempPlayer] = useState<Player>(makeEmptyPlayer());

  // 화면용: 항상 최신 계산으로 정렬해서 보여줌 (원본 players 상태는 그대로 둠)
  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => calcTotalAsset(b, blockCounts) - calcTotalAsset(a, blockCounts));
  }, [players, blockCounts]);

  const leaderId = sortedPlayers.length ? sortedPlayers[0].id : null;

  // 모달 열기 (추가)
  const handleAddPlayer = () => {
    setEditMode(false);
    setTempPlayer(
      makeEmptyPlayer(Math.floor(Math.random() * 1_000_000) + Date.now())
    );
    setShowModal(true);
  };

  const handleEditPlayer = (p: Player) => {
    setEditMode(true);
    setTempPlayer(p);
    setShowModal(true);
  };

  const handleSavePlayer = () => {
    // 정상 입력 방어: 이름 빈칸이면 막음
    if (!tempPlayer.name.trim()) {
      alert("유저 이름을 입력하세요.");
      return;
    }
    setPlayers((prev) => {
      if (editMode) {
        return prev.map((x) => (x.id === tempPlayer.id ? { ...tempPlayer } : x));
      } else {
        return [...prev, { ...tempPlayer }];
      }
    });
    setShowModal(false);
  };

  const handleDeletePlayer = (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  const handleReset = () => {
    if (!confirm("모든 데이터를 초기화합니다. 계속하시겠습니까?")) return;
    setPlayers([]);
    setBlockCounts({
      콘티넨탈: 0,
      임페리얼: 0,
      아메리칸: 0,
      페스티발: 0,
      월드와이드: 0,
      섹슨: 0,
      타워: 0,
    });
  };

  const handleTest = () => {
    const blocks = {
      콘티넨탈: 10,
      임페리얼: 20,
      아메리칸: 20,
      페스티발: 30,
      월드와이드: 20,
      섹슨: 3,
      타워: 4,
    } as Record<Hotel, number>;
    setBlockCounts(blocks);

    const testPlayers: Player[] = [
      {
        id: 1,
        name: "테스트유저1",
        money: 1000,
        color: "#ff6b6b",
        stocks: {
          콘티넨탈: 10,
          임페리얼: 5,
          아메리칸: 20,
          페스티발: 5,
          월드와이드: 6,
          섹슨: 8,
          타워: 7,
        },
      },
      {
        id: 2,
        name: "테스트유저2",
        money: 1000,
        color: "#6bcB77",
        stocks: {
          콘티넨탈: 5,
          임페리얼: 7,
          아메리칸: 8,
          페스티발: 1,
          월드와이드: 0,
          섹슨: 2,
          타워: 1,
        },
      },
      {
        id: 3,
        name: "테스트유저3",
        money: 1000,
        color: "#4d96ff",
        stocks: {
          콘티넨탈: 5,
          임페리얼: 10,
          아메리칸: 1,
          페스티발: 2,
          월드와이드: 2,
          섹슨: 2,
          타워: 3,
        },
      },
      {
        id: 4,
        name: "테스트유저4",
        money: 1000,
        color: "#f6c90e",
        stocks: {
          콘티넨탈: 2,
          임페리얼: 2,
          아메리칸: 50,
          페스티발: 10,
          월드와이드: 20,
          섹슨: 15,
          타워: 5,
        },
      },
    ];
    setPlayers(testPlayers);
    // 화면 맨위로 스크롤 (UX)
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // helpers for inputs to allow blank (so backspace works nicely)
  const numberInputValue = (v: number) => (v === 0 ? "" : String(v));
  const parseNum = (s: string) => (s === "" ? 0 : Number(s));

  return (
    <div style={{ padding: 18, maxWidth: 1100, margin: "0 auto", fontFamily: "Inter, Arial, sans-serif" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>어콰이어 계산기 v0.6</h1>

      {/* 호텔 블록 입력 */}
      <section style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, marginBottom: 8 }}>호텔별 최종 블럭수</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8 }}>
          {HOTEL_LIST.map((hotel) => (
            <div key={hotel} style={{ background: "#fff", padding: 8, borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{hotel}</div>
              <input
                inputMode="numeric"
                pattern="[0-9]*"
                value={numberInputValue(blockCounts[hotel])}
                onChange={(e) =>
                  setBlockCounts({
                    ...blockCounts,
                    [hotel]: parseNum(e.target.value),
                  })
                }
                style={{ width: "100%", padding: "6px 8px", textAlign: "center", borderRadius: 6, border: "1px solid #ddd" }}
                placeholder=""
              />
            </div>
          ))}
        </div>
      </section>

      {/* 버튼들 */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button onClick={handleAddPlayer} style={{ background: "#2563eb", color: "#fff", padding: "8px 12px", borderRadius: 8 }}>유저 추가</button>
        <button onClick={handleReset} style={{ background: "#9ca3af", color: "#fff", padding: "8px 12px", borderRadius: 8 }}>리셋</button>
        <button onClick={handleTest} style={{ background: "#16a34a", color: "#fff", padding: "8px 12px", borderRadius: 8 }}>테스트</button>
      </div>

      {/* 유저 카드 (정렬된 표시) */}
      <section style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 16, marginBottom: 8 }}>유저 목록 (총자산 기준 자동 정렬)</h2>

        {sortedPlayers.length === 0 ? (
          <div style={{ color: "#6b7280" }}>유저가 없습니다. '유저 추가' 또는 '테스트'를 눌러주세요.</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
            {sortedPlayers.map((p) => {
              const total = calcTotalAsset(p, blockCounts);
              return (
                <div key={p.id} style={{
                  padding: 12,
                  borderRadius: 10,
                  background: "#fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  border: leaderId === p.id ? "2px solid gold" : "1px solid #e5e7eb",
                  position: "relative"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: leaderId === p.id ? 18 : 15 }}>{p.name || "무명"}</div>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>보유금액: {p.money.toLocaleString()}원</div>
                    </div>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: p.color }} />
                  </div>

                  <div style={{ marginTop: 10, fontWeight: 700 }}>총자산: {total.toLocaleString()}원</div>

                  {/* 주식 목록 요약 (간단) */}
                  <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {HOTEL_LIST.map(h => (
                      <div key={h} style={{ fontSize: 12, padding: "4px 6px", background: "#f3f4f6", borderRadius: 6 }}>
                        {h}: {p.stocks[h] ?? 0}
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: 8, marginTop: 10, justifyContent: "center" }}>
                    <button onClick={() => handleEditPlayer(p)} style={{ padding: "6px 8px", borderRadius: 6, background: "#10b981", color: "#fff" }}>수정</button>
                    <button onClick={() => handleDeletePlayer(p.id)} style={{ padding: "6px 8px", borderRadius: 6, background: "#f97316", color: "#fff" }}>삭제</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 파이 차트 (유저 자산 비율) */}
      {sortedPlayers.length > 0 && (
        <section style={{ height: 320, marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, marginBottom: 8 }}>유저별 자산 비율</h2>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sortedPlayers.map(p => ({ name: p.name, value: calcTotalAsset(p, blockCounts), color: p.color }))}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {sortedPlayers.map((p, i) => <Cell key={i} fill={p.color} />)}
              </Pie>
              <Tooltip formatter={(value: any) => `${Number(value).toLocaleString()}원`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </section>
      )}

      {/* 모달: 유저 추가/수정 (주식 입력 포함) */}
      {showModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60
        }}>
          <div style={{ width: 420, background: "#fff", borderRadius: 10, padding: 16 }}>
            <h3 style={{ marginBottom: 8 }}>{editMode ? "유저 수정" : "유저 추가"}</h3>
            <div style={{ display: "grid", gap: 8 }}>
              <input
                placeholder="이름"
                value={tempPlayer.name}
                onChange={e => setTempPlayer({ ...tempPlayer, name: e.target.value })}
                style={{ padding: 8, borderRadius: 8, border: "1px solid #e5e7eb" }}
              />
              <input
                placeholder="보유금액"
                value={tempPlayer.money === 0 ? "" : String(tempPlayer.money)}
                onChange={e => setTempPlayer({ ...tempPlayer, money: parseNum(e.target.value) })}
                style={{ padding: 8, borderRadius: 8, border: "1px solid #e5e7eb" }}
              />

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
                {HOTEL_LIST.map(h => (
                  <div key={h}>
                    <div style={{ fontSize: 12, marginBottom: 4 }}>{h}</div>
                    <input
                      value={tempPlayer.stocks[h] === 0 ? "" : String(tempPlayer.stocks[h])}
                      onChange={e => setTempPlayer({
                        ...tempPlayer,
                        stocks: { ...tempPlayer.stocks, [h]: parseNum(e.target.value) }
                      })}
                      style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #e5e7eb" }}
                    />
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
                <button onClick={() => setShowModal(false)} style={{ padding: "8px 12px", borderRadius: 8, background: "#e5e7eb" }}>취소</button>
                <button onClick={handleSavePlayer} style={{ padding: "8px 12px", borderRadius: 8, background: "#2563eb", color: "#fff" }}>저장</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer style={{ marginTop: 20, color: "#6b7280", fontSize: 13 }}>
        <div>바이브 코딩으로 개발됨</div>
        <div>React + TypeScript + Vite 기반</div>
        <div style={{ marginTop: 6, fontWeight: 600 }}>v0.6</div>
      </footer>
    </div>
  );
}
