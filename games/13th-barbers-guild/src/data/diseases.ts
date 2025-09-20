import { i18n } from "../i18n";

export enum DiseaseType {
  Flu,
  Measles,
  Plague,
}

export const diseases: Disease[] = [
  {
    type: DiseaseType.Flu,
    ...i18n.diseases.flu,
  },
  {
    type: DiseaseType.Measles,
    ...i18n.diseases.measles,
  },
  {
    type: DiseaseType.Plague,
    ...i18n.diseases.plague,
  },
];

export interface Disease {
  type: DiseaseType;
  name: string;
  symptoms: string;
  symptomsShort: string;
}
