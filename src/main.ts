import Preferences from './core/preferences';
import Olaf from './core/olaf';
import preferencesDashboard from './dashboard/preferences-dashboard';

Preferences.initialize();

const app = new Olaf();
app.start();

preferencesDashboard.listen(3000, () => {
  console.log('Dashboard is running in http://localhost:3000');
});
