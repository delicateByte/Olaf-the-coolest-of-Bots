import UnsplashConnector from '../../connectors/unsplash/unsplashConnector';

(async () => {
  const connector = new UnsplashConnector(process.env.UNSPLASH_TOKEN);
  console.log(await connector.getRandomImage('nature'));
})();
