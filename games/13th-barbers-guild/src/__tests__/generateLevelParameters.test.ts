import { it, expect } from "vitest";
import { generateLevelParameters } from "../data";

it("should generate levels", () => {
  const generator = generateLevelParameters();
  expect(generator.next().value).toEqual([1, true]);
  expect(generator.next().value).toEqual([1, false]);
  expect(generator.next().value).toEqual([2, true]);
  expect(generator.next().value).toEqual([2, false]);
  expect(generator.next().value).toEqual([3, true]);
  expect(generator.next().value).toEqual([3, false]);
  expect(generator.next().value).toEqual([4, true]);
  expect(generator.next().value).toEqual([4, false]);
  expect(generator.next().value).toEqual([5, true]);
  expect(generator.next().value).toEqual([5, false]);
  expect(generator.next().value).toEqual([6, true]);
  expect(generator.next().value).toEqual([6, false]);
  expect(generator.next()).toEqual({ value: undefined, done: true });
});
