import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

export const useSearch = (query) => {

  const [state, setState] = useState({
    articles: [],
    status: 'IDLE',
    error: ''
  });

  // const cancelToken = useRef(null); // deprecated
  const controller = useRef(null);

  useEffect(() => {
    if (query.lenght < 3) {
      return;
    }

    // if (cancelToken.current) {
    //   cancelToken.current.cancel();
    // } // deprecated
    if (controller.current) {
      controller.current.abort();
    }

    // cancelToken.current = axios.CancelToken.source(); // deprecated
    controller.current = new AbortController();

    axios.get(`https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&search=${query}`, {
      // cancelToken: cancelToken.current.token,
      signal: controller.current.signal,
    })
      .then(function (response) {
        const parsedResponse = [];
        if (query === '') {
          setState({
            articles: [],
            status: 'IDLE',
            error: ''
          });
          return;
        }
        for (let i = 0; i < response.data[1].length; i++) {
          parsedResponse.push({
            id: response.data[3][i],
            label: response.data[1][i]
          })
        }

        setState({
          articles: parsedResponse,
          status: 'SUCCESS',
          error: ''
        });
      })
      .catch(function (error) {
        // if (axios.isCancel(error)) {
        //   return;
        // } // deprecated
        if (controller.current.signal.aborted) {
          return;
        }
        setState({
          articles: [],
          status: 'ERROR',
          error: error
        });

      })
  }, [query]);

  return state;
}

export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const handler = useRef();

  useEffect(() => {
    if (handler.current) {
      clearTimeout(handler.current);
    }

    handler.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler.current);
    };
  }, [value, delay]);

  return debouncedValue;
};
