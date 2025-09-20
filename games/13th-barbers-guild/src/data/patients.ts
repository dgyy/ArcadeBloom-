import { type Ingredient } from "./ingredients";
import { type Disease } from "./diseases";
import { type Level } from "./levels";
import { Health } from "../types";
import { shuffle, coloredIngredientNames } from "../utils";
import { i18n } from "../i18n";

export class Patient {
  level: Level;
  disease: Disease;
  ingredients: Ingredient[];
  givenIngredients: Ingredient[];
  attempts: number;
  health: Health;

  constructor(
    level: Level,
    disease: Disease,
    ingredients: Ingredient[],
    enableMiss: boolean,
  ) {
    this.level = level;
    this.health = Health.Good;
    this.disease = disease;
    this.ingredients = ingredients;
    this.attempts = this.ingredients.length;
    if (enableMiss) {
      this.attempts++;
    }
    this.givenIngredients = [];
  }

  giveIngredient(ingredient: Ingredient) {
    this.givenIngredients.push(ingredient);
    this.health = this.getHealth();
  }

  private getHealth() {
    if (this.givenIngredients.length === 0) {
      return Health.Good;
    }
    const isCured = this.ingredients.every((item) =>
      this.givenIngredients.includes(item),
    );
    if (isCured) {
      return Health.Cured;
    }
    const isGettingBetter = this.givenIngredients.every((item) =>
      this.ingredients.includes(item),
    );
    if (isGettingBetter) {
      return Health.GettingBetter;
    }
    const isDead = this.givenIngredients.length === this.attempts;
    if (isDead) {
      return Health.Dead;
    }
    return Health.Bad;
  }

  hasLeft() {
    return this.health === Health.Cured || this.health === Health.Dead;
  }

  getSymptoms() {
    let health = this.health;
    if (health === Health.GettingBetter || health === Health.Bad) {
      const latestIngredient = this.givenIngredients.slice(-1)[0];
      health = this.ingredients.includes(latestIngredient)
        ? Health.GettingBetter
        : Health.Bad;
    }
    const messages = messagesByHealth[health](this.disease, this.ingredients);
    const message = shuffle([...messages]).slice(0, 1)[0];
    return message;
  }
}

type HealthMessageGetter = (
  disease: Disease,
  ingredients: Ingredient[],
) => string[];

const goodMessages: HealthMessageGetter = (disease) => [
  `${disease.symptoms} ${i18n.health.good[0]}`,
  `${disease.symptoms} ${i18n.health.good[1]}`,
  `${disease.symptoms} ${i18n.health.good[2]}`,
];

const gettingBetterMessages: HealthMessageGetter = () =>
  i18n.health.gettingBetter;

const badMessages: HealthMessageGetter = (disease) => [
  `${i18n.health.bad[0]} ${disease.symptoms}`,
  `${i18n.health.bad[1]} ${disease.symptoms}`,
];

const deadMessages: HealthMessageGetter = (disease, ingredients) => [
  i18n.health.dead[0](
    disease.name,
    disease.symptomsShort,
    coloredIngredientNames(ingredients),
  ),
  i18n.health.dead[1](
    disease.name,
    disease.symptomsShort,
    coloredIngredientNames(ingredients),
  ),
];

const curedMessages = () => i18n.health.cured;

const messagesByHealth = {
  [Health.Good]: goodMessages,
  [Health.GettingBetter]: gettingBetterMessages,
  [Health.Bad]: badMessages,
  [Health.Dead]: deadMessages,
  [Health.Cured]: curedMessages,
};
