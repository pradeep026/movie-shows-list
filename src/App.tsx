import { useState, useCallback, useEffect } from 'react';
import viteLogo from '/electron-vite.animate.svg';
import './App.css';

function App() {
  const [state, setState] = useState([]);

  const queryMovieShows = useCallback(async () => {
    fetch(
      `https://service.carnivalcinemas.sg/api/QuickSearch/GetShowTimeByMoviesAndCinema?location=Singapore&movieCode=Leo(NC16)&cinemaCode=BCSG&date=2023-10-19T00:00:00`
    )
      .then((response) => response.json())
      .then((response) => {
        const responseShowTimes = response?.responseShowTimes;
        console.table(responseShowTimes);

        setState(responseShowTimes);

        const messageOptions: NotificationOptions = {
          body: `Shows ${responseShowTimes?.length} | ${responseShowTimes
            .map(({ time }) => time)
            .join(` | `)}`,
          silent: false,
        };

        try {
          new Notification(`Movie Ticket Status`, messageOptions);
        } finally {
          console.log(`Done`);
        }
      });
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    let timerId: NodeJS.Timeout | undefined;
    try {
      Notification.requestPermission();
    } catch (error) {
      console.log(error?.message);
    } finally {
      queryMovieShows();
      timerId = setInterval(() => {
        queryMovieShows();
      }, 5 * 60 * 1000);
    }
    return () => {
      clearInterval(timerId);
    };
  }, [queryMovieShows]);

  return (
    <>
      <div className="header">
        <a href="https://electron-vite.github.io" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <button onClick={queryMovieShows}>Check Now</button>
      </div>

      <div className="container">
        <div className="card">
          <h1>Movie Shows Lists Leo(NC16)</h1>
          <h4>
            Shows:{' '}
            <div className="shows">
              {state?.map(({ time }) => (
                <div className="show__badge">{time}</div>
              ))}
            </div>
          </h4>
        </div>
        <div className="card">
          <pre>{JSON.stringify(state, null, 4)}</pre>
        </div>
      </div>
    </>
  );
}

export default App;
