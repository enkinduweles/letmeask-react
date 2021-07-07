import { Switch, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { NewRoom } from './pages/NewRoom';
import { Room } from './pages/Room';
import { AdminRoom } from './pages/AdminRoom';

function App() {
  return (
    <Switch>
      <Route path="/" exact>
        <Home />
      </Route>

      <Route path="/rooms/new">
        <NewRoom />
      </Route>

      <Route path="/rooms/:id">
        <Room />
      </Route>
      <Route path="/admin/rooms/:id">
        <AdminRoom />
      </Route>
    </Switch>
  );
}

export default App;
