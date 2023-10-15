import './App.css';
import WeekSlider from './WeekSelector';

function App() {
  return (
    <>
    <WeekSlider week={1} initialValues={[0, 6]} />
    <WeekSlider week={2} initialValues={[1, 5]} />
    <WeekSlider week={3} initialValues={[1, 5]} />
    <WeekSlider week={4} initialValues={[1, 5]} />
    <WeekSlider week={5} initialValues={[1, 5]} />
    <WeekSlider week={6} initialValues={[1, 5]} />
    <WeekSlider week={7} initialValues={[1, 5]} />
    </>
  );
}

export default App;
