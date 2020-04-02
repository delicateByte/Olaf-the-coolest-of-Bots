import Preferences from './core/preferences';
import Olaf from './core/olaf';
import preferencesDashboard from './dashboard/preferences-dashboard';

Preferences.initialize();

const app = new Olaf();
app.start();

preferencesDashboard.listen(process.env.PORT, () => {
  console.log(`Dashboard is running in http://localhost:${process.env.PORT}`);
});
