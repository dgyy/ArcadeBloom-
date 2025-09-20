import { type Ingredient } from "./ingredients";
import { type Disease, diseases } from "./diseases";
import { Patient } from "./patients";
import { shuffle } from "../utils";

type DiseasesIngredients = Array<Readonly<[Disease, Ingredient[]]>>;

export class Level {
  requiredIngredientsCount: number;
  diseasesIngredients: DiseasesIngredients;
  enableMisses: boolean;

  constructor(
    requiredIngredientsCount: number,
    diseasesIngredients: DiseasesIngredients,
    enableMisses: boolean,
  ) {
    this.requiredIngredientsCount = requiredIngredientsCount;
    this.diseasesIngredients = diseasesIngredients;
    this.enableMisses = enableMisses;
  }

  getRandomPatient() {
    const randomDiseases = shuffle([...this.diseasesIngredients]);
    const [disease, ingredients] = randomDiseases[0];
    return new Patient(this, disease, ingredients, this.enableMisses);
  }
}

export function* generateLevels(ingredients: Ingredient[]) {
  const latestDiseasesIngredients: Record<Disease["name"], Ingredient[]> = {};
  for (const params of generateLevelParameters()) {
    const [requiredIngredientsCount, enableMisses] = params;
    const usedCombinations = new UsedCombinations();
    const diseasesIngredients = diseases.map((disease) => {
      let selectedIngredients: Ingredient[] | null = null;
      for (let index = 0; index < 200; index++) {
        const randomIngredients = getRandomIngredients(
          requiredIngredientsCount,
          ingredients,
          latestDiseasesIngredients?.[disease.name] ?? [],
        );
        if (usedCombinations.add(randomIngredients)) {
          selectedIngredients = randomIngredients;
          break;
        }
      }
      if (!selectedIngredients) {
        throw new Error(); // Could not generate distinct ingredients
      }
      latestDiseasesIngredients[disease.name] = selectedIngredients;
      return [disease, selectedIngredients] as const;
    });
    yield new Level(
      requiredIngredientsCount,
      diseasesIngredients,
      enableMisses,
    );
  }
}

class UsedCombinations {
  usedCombinations: string[];

  constructor() {
    this.usedCombinations = [];
  }

  add(ingredients: Ingredient[]) {
    const key = ingredients
      .map(({ id }) => id)
      .sort()
      .join("");
    const hasKey = this.usedCombinations.includes(key);
    if (!hasKey) {
      this.usedCombinations.push(key);
      return true;
    }
    return false;
  }
}

function getRandomIngredients(
  count: number,
  ingredients: Ingredient[],
  existingIngredients: Ingredient[],
) {
  const availableIngredients = ingredients.filter(
    (ingredient) => !existingIngredients.includes(ingredient),
  );
  return [
    ...existingIngredients,
    ...shuffle(availableIngredients).slice(
      0,
      count - existingIngredients.length,
    ),
  ];
}

export function* generateLevelParameters() {
  let requiredIngredients = Number(import.meta.env.VITE_FIRST_LEVEL);
  const enableMisses = true;
  while (requiredIngredients <= Number(import.meta.env.VITE_LAST_LEVEL)) {
    yield [requiredIngredients, enableMisses] as const;
    if (enableMisses) {
      requiredIngredients++;
    }
  }
}
