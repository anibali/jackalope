import { assert } from 'chai';
import GameState from '../src/state/GameState';


const parseBoardChips = rows => rows.flatMap(row => row.split('').map(c => (c === '.' ? '' : c)));


describe('GameState', () => {
  describe('#discardCard()', () => {
    it('should mark card as discarded', () => {
      const state = new GameState();
      const card = state.cards[0];
      assert.isFalse(card.discarded);
      state.discardCard(card);
      assert.isTrue(card.discarded);
    });

    it('should add card to discardPile', () => {
      const state = new GameState();
      const card = state.cards[0];
      assert.isEmpty(state.discardPile);
      state.discardCard(card);
      assert.deepEqual([...state.discardPile], [card.number]);
    });
  });

  describe('#countSequences()', () => {
    context('when the board is empty', () => {
      const state = new GameState();
      state.addPlayer('a');
      state.addPlayer('b');

      it('should return 0', () => {
        assert.equal(state.countSequences('a'), 0);
      });
    });

    context('when there is a 5-chip horizontal sequence', () => {
      const state = new GameState();
      state.addPlayer('a');
      state.addPlayer('b');
      state.boardChips = parseBoardChips([
        '......b...',
        '..........',
        '...aaaaa..',
        '......b...',
        '..........',
        '..b.......',
        '..........',
        '...b......',
        '.......b..',
        '..........',
      ]);

      it('should return 1', () => {
        assert.equal(state.countSequences('a'), 1);
      });
    });

    context('when there is a 6-chip horizontal sequence', () => {
      const state = new GameState();
      state.addPlayer('a');
      state.addPlayer('b');
      state.boardChips = parseBoardChips([
        '......b...',
        '..........',
        '...aaaaaa.',
        '......b...',
        '..........',
        '..b.......',
        '..........',
        '...b......',
        '.......b..',
        '..........',
      ]);

      it('should return 1', () => {
        assert.equal(state.countSequences('a'), 1);
      });
    });

    context('when there is a 5-chip vertical sequence', () => {
      const state = new GameState();
      state.addPlayer('a');
      state.addPlayer('b');
      state.boardChips = parseBoardChips([
        '...a..b...',
        '...a......',
        '...a......',
        '...a..b...',
        '...a......',
        '..b.......',
        '..........',
        '...b......',
        '.......b..',
        '..........',
      ]);

      it('should return 1', () => {
        assert.equal(state.countSequences('a'), 1);
      });
    });

    context('when there is a 6-chip vertical sequence', () => {
      const state = new GameState();
      state.addPlayer('a');
      state.addPlayer('b');
      state.boardChips = parseBoardChips([
        '...a..b...',
        '...a......',
        '...a......',
        '...a..b...',
        '...a......',
        '..ba......',
        '..........',
        '...b......',
        '.......b..',
        '..........',
      ]);

      it('should return 1', () => {
        assert.equal(state.countSequences('a'), 1);
      });
    });

    context('when there is a 5-chip diagonal sequence', () => {
      const state = new GameState();
      state.addPlayer('a');
      state.addPlayer('b');
      state.boardChips = parseBoardChips([
        '......b...',
        '..........',
        '...a......',
        '....a.b...',
        '.....a....',
        '..b...a...',
        '.......a..',
        '...b......',
        '.......b..',
        '..........',
      ]);

      it('should return 1', () => {
        assert.equal(state.countSequences('a'), 1);
      });
    });

    context('when there is a 9-chip horizontal sequence', () => {
      const state = new GameState();
      state.addPlayer('a');
      state.addPlayer('b');
      state.boardChips = parseBoardChips([
        '......b...',
        '..........',
        '.aaaaaaaaa',
        '......b...',
        '..........',
        '..b.......',
        '..........',
        '...b......',
        '.......b..',
        '..........',
      ]);

      it('should return 2', () => {
        assert.equal(state.countSequences('a'), 2);
      });
    });

    context('when there is a 4-chip horizontal sequence next to a corner', () => {
      const state = new GameState();
      state.addPlayer('a');
      state.addPlayer('b');
      state.boardChips = parseBoardChips([
        '.aaaa.b...',
        '..........',
        '..........',
        '......b...',
        '..........',
        '..b.......',
        '..........',
        '...b......',
        '.......b..',
        '..........',
      ]);

      it('should return 2', () => {
        assert.equal(state.countSequences('a'), 1);
      });
    });

    context('when there are two 5-chip sequences sharing the top-left chip', () => {
      const state = new GameState();
      state.addPlayer('a');
      state.addPlayer('b');
      state.boardChips = parseBoardChips([
        '......b...',
        '...aaaaa..',
        '...a......',
        '...a..b...',
        '...a......',
        '..ba......',
        '...a......',
        '...b......',
        '.......b..',
        '..........',
      ]);

      it('should return 2', () => {
        assert.equal(state.countSequences('a'), 2);
      });
    });

    context('when there are two 5-chip sequences sharing the bottom-right chip', () => {
      const state = new GameState();
      state.addPlayer('a');
      state.addPlayer('b');
      state.boardChips = parseBoardChips([
        '......b...',
        '..........',
        '...a......',
        '....a.b...',
        '.....a....',
        '..b...a...',
        '...aaaaa..',
        '...b......',
        '.......b..',
        '..........',
      ]);

      it('should return 2', () => {
        assert.equal(state.countSequences('a'), 2);
      });
    });
  });
});
