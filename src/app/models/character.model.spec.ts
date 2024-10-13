import { DnDCharacter } from './character.model';

describe('Character', () => {
  it('should create an instance', () => {
    // @ts-ignore
    expect(new DnDCharacter()).toBeTruthy();
  });
});
