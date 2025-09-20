import { shuffle } from "../utils";
import { i18n } from "../i18n";

export class Ingredient {
  id: string;
  name: string;
  color: string;

  constructor(id: number, name: string, color: string) {
    this.id = import.meta.env.VITE_ID_POTION + id;
    this.name = name;
    this.color = color;
  }
}

export function generateIngredients() {
  const names = i18n.ingredients;
  const colors = [
    "#ff6600",
    "#ff0000",
    "#ccff00",
    "#d4aa00",
    "#ff0066",
    "#5fd38d",
  ];
  shuffle(colors);
  shuffle(names);
  return colors.map(
    (color, index) => new Ingredient(index, names[index], color),
  );
}
