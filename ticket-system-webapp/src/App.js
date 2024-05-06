import './App.css';
import { Button } from 'carbon-components-react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Header from './assets/Header';




function App() {
  return (
    <div className="App">
          <BrowserRouter>
      <Header/> 
        <Routes>
          <Route index element={<div/>} />
        </Routes>
    </BrowserRouter>
      <MyComponent></MyComponent>

    </div>
  );
}

export default App;

function MyComponent() {
  return <Button>Example usage</Button>;
}