// eslint-disable-next-line import/no-unresolved, import/extensions
import Entertainment from './entertainment';

// eslint-disable-next-line import/no-unresolved, import/extensions
// const Entertainment = require('./entertainment');

test('get Meme', () => Entertainment.getMeme().then((memeJson) => expect(memeJson).toHaveProperty('title', 'imageUrl')));
