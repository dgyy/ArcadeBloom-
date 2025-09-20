import { TraitType } from './TraitType';
// a collection is actually an array of INftCollection, fo the cards in the collection is the actual card
// TODO (johnedvard) rename to something else
export interface INftCollection {
  token_series_id: string;
  metadata: { attributes: { trait_type: TraitType; value: string }[] };
}
