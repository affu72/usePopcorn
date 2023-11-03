import { useState } from 'react';
import FooterBox from './FooterBox';

function useGeoLocation() {
  const [location, setLocation] = useState({ lat: 0, lon: 0 });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function getLocation() {
    if (!navigator.geolocation) {
      return setError('Your Browser does not support geolocation api');
    }

    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setLocation({
            lat: coords.latitude,
            lon: coords.latitude,
          });
        },
        (error) => {
          setError(error.message);
        },
        {
          enableHighAccuracy: true,
        },
      );
      setIsLoading(false);
    }
  }
  return { isLoading, error, location, getLocation };
}

export default function GeoLocation() {
  const [countClick, setCountClick] = useState(0);

  const { isLoading, error, getLocation, location } = useGeoLocation();

  const { lat, lon } = location;

  function handlerGetlocation() {
    setCountClick((prevCount) => prevCount + 1);
    getLocation();
  }

  return (
    <FooterBox>
      <div>
        <button
          className="flex bg-zinc-600 px-4 py-2 rounded-md hover:bg-zinc-900"
          onClick={handlerGetlocation}
          disabled={isLoading}
        >
          Get my location
        </button>
      </div>
      <div>
        {!error && Boolean(lat) && Boolean(lon) && (
          <a
            href={`http://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}`}
            className="underline text-sky-500 hover:text-white font-semibold"
            target="_blank"
          >
            {`${lat} ${lon}`}
          </a>
        )}
        {error && <p className="text-red-500">{error}</p>}
      </div>
      <div>
        <p>You have requested to get location {countClick} times</p>
      </div>
    </FooterBox>
  );
}
