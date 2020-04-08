import RedditMemes from '../../connectors/reddit/redditMemes';
import ChuckNorris from '../../connectors/chucknorris/chucknorris';
import Spotify from '../../connectors/spotify/spotify';
import UseCase from '../../interfaces/useCase';
import UseCaseResponse from '../../classes/UseCaseResponse';
import ProcessedTelegramMessage from '../../classes/ProcessedTelegramMessage';
import TextResponse from '../../classes/TextResponse';
import ImageResponse from '../../classes/ImageResponse';
import EndUseCaseResponse from '../../classes/EndUseCaseResponse';

export default class Entertainment implements UseCase {
  name: string;
  triggers: string[] = [
    'meme',
    'joke', 'chuck norris',
    'song', 'track', 'music', 'playlist',
  ];

  // eslint-disable-next-line class-methods-use-this
  async* receiveMessage(message: ProcessedTelegramMessage): AsyncGenerator<UseCaseResponse> {
    if (message.text) {
      const trigger = message.text.toLowerCase();

      if (trigger.includes('meme')) {
        yield new TextResponse('Fresh meme serving you hot...');

        const meme = await RedditMemes.getMeme();
        yield new TextResponse(meme.title);
        yield new ImageResponse(meme.imageUrl);
      } else if (trigger.includes('joke') || trigger.includes('chuck norris')) {
        yield new TextResponse('Asking Chuck Norris for a fact...');

        const joke = await ChuckNorris.getJoke();
        yield new TextResponse(joke.joke);
      } else if (trigger.includes('song') || trigger.includes('track') || trigger.includes('music') || trigger.includes('playlist')) {
        yield new TextResponse('Getting you some beats...');

        const playlist = await Spotify.getPlaylist();
        if (playlist === {}) {
          yield new TextResponse('Could not retrieve a playlist, please log into the dashboard to connect your account.');
        } else {
          yield new TextResponse(`"${playlist.description}"\n"${playlist.name}" by ${playlist.author}\n${playlist.url}`);
        }
      }
    }
    yield new EndUseCaseResponse();
  }

  // eslint-disable-next-line class-methods-use-this
  reset(): void { }
}
