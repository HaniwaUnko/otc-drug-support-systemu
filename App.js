import React, { useState, useEffect } from 'react';

function App() {
  const [drugs, setDrugs] = useState([]);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [symptom, setSymptom] = useState('');
  const [medication, setMedication] = useState('');
  const [supplement, setSupplement] = useState('');

  const handleSearch = () => {
    if (!age || !gender || !symptom) {
      alert("年齢・性別・症状カテゴリを入力してください。");
      return;
    }

    const params = new URLSearchParams({
      age,
      gender,
      category: symptom
    });

    fetch(`http://localhost:3000/drugs?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        const meds = medication.split(',').map(m => m.trim());
        const sups = supplement.split(',').map(s => s.trim());

        const filtered = data.filter(drug => {
          const incompatibleMeds = drug.incompatible_meds || [];
          const incompatibleSups = drug.incompatible_supplements || [];

          const medConflict = incompatibleMeds.some(med => meds.includes(med));
          const supConflict = incompatibleSups.some(sup => sups.includes(sup));

          return !medConflict && !supConflict;
        });

        setDrugs(filtered);
      });
  };

  return (
    <div className="App">
      <h1>OTC医薬品選択支援システム（プロトタイプ）</h1>

      <div>
        <input type="number" placeholder="年齢" value={age} onChange={e => setAge(e.target.value)} /><br />

        {/* 性別を選択式に変更 */}
        <select value={gender} onChange={e => setGender(e.target.value)}>
          <option value="">性別を選択</option>
          <option value="男性">男性</option>
          <option value="女性">女性</option>
          <option value="その他">その他</option>
        </select><br />

        {/* 症状カテゴリも選択式に変更 */}
        <select value={symptom} onChange={e => setSymptom(e.target.value)}>
          <option value="">症状カテゴリを選択</option>
          <option value="風邪薬">風邪薬</option>
          <option value="解熱鎮痛薬">解熱鎮痛薬</option>
          <option value="目薬">目薬</option>
        </select><br />

        <input type="text" placeholder="服用中の薬（カンマ区切り）" value={medication} onChange={e => setMedication(e.target.value)} /><br />
        <input type="text" placeholder="使用中のサプリ（カンマ区切り）" value={supplement} onChange={e => setSupplement(e.target.value)} /><br />
        <button onClick={handleSearch}>検索</button>
      </div>

      <div>
        {drugs.map((drug) => (
          <div key={drug.id}>
            <h3>{drug.name}</h3>
            <p>カテゴリ: {drug.category}</p>
            <p>説明: {drug.description}</p>
            <p>販売店: {drug.pharmacy}</p>
            <p>在庫: {drug.stock}</p>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
