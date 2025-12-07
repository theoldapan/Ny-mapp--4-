export type TrainingProgram = {
  headlineImg: string;
  title: string;
  description: string;
  duration: number;
  intensity: TrainingIntensity;
};

export enum TrainingIntensity {
  Low = "Low",
  Moderate = "Moderate",
  High = "High",
}
