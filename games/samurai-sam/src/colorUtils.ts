import { ColorToSliceType } from './ColorToSliceType';
import { amber, blue, red, teal } from './colors';

export function getColorFromSliceColor(sliceColor: ColorToSliceType) {
  switch (sliceColor) {
    case 'r':
      return red;
    case 'b':
      return blue;
  }
}

export function getSecondaryColorFromSliceColor(sliceColor: ColorToSliceType) {
  switch (sliceColor) {
    case 'r':
      return amber;
    case 'b':
      return teal;
  }
}
