export type Emotion = 'happy' | 'sad' | 'fear' | 'neutral' | 'angry' | 'disgust' | 'surprise';

export interface EmotionRecord {
  id: string;
  bpm: number;
  confidence: number;
  date: string;
  emotion: Emotion;
  sweating: number;
}

export interface EmotionStats {
  emotion: Emotion;
  count: number;
  avgBpm: number;
  avgSweating: number;
  avgConfidence: number;
}

export interface EmotionTrend {
  date: string;
  emotions: Record<Emotion, number>;
  avgBpm: number;
  avgSweating: number;
}
