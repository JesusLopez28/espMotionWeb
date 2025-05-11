import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { EmotionChart } from '../components/EmotionChart';

type EmotionResult = {
  bpm: number;
  confidence: number;
  date: string;
  emotion: string;
  sweating: number;
  // Puedes agregar más campos si los tienes
};

function Dashboard() {
  const [results, setResults] = useState<EmotionResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      const q = query(collection(db, 'results'), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      const data: EmotionResult[] = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data() as EmotionResult);
      });
      setResults(data);
      setLoading(false);
    };
    fetchResults();
  }, []);

  // Calcula el conteo de emociones para la gráfica
  const emotionCounts = results.reduce<Record<string, number>>((acc, r) => {
    acc[r.emotion] = (acc[r.emotion] || 0) + 1;
    return acc;
  }, {});
  const chartData = Object.entries(emotionCounts).map(([emotion, count]) => ({
    emotion,
    count,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-700 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-6">Detector de Emociones</h1>
      <div className="bg-white/10 rounded-xl shadow-lg p-8 w-full max-w-2xl mb-8">
        {loading ? (
          <p className="text-white text-center">Cargando resultados...</p>
        ) : results.length === 0 ? (
          <p className="text-white text-center">No hay resultados aún.</p>
        ) : (
          <table className="min-w-full text-white">
            <thead>
              <tr>
                <th className="px-2 py-1">Fecha</th>
                <th className="px-2 py-1">Emoción</th>
                <th className="px-2 py-1">Confianza</th>
                <th className="px-2 py-1">BPM</th>
                <th className="px-2 py-1">Sudor</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, idx) => (
                <tr key={idx} className="odd:bg-white/5 even:bg-white/0">
                  <td className="px-2 py-1">{new Date(r.date).toLocaleString()}</td>
                  <td className="px-2 py-1 capitalize">{r.emotion}</td>
                  <td className="px-2 py-1">{(r.confidence * 100).toFixed(1)}%</td>
                  <td className="px-2 py-1">{r.bpm}</td>
                  <td className="px-2 py-1">{r.sweating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Gráfica de emociones */}
      {!loading && results.length > 0 && (
        <div className="bg-white/10 rounded-xl shadow-lg p-8 w-full max-w-2xl">
          <h2 className="text-2xl font-semibold text-white mb-4 text-center">Resumen de emociones</h2>
          <EmotionChart data={chartData} />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
