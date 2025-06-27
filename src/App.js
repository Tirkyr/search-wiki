import React, { useState } from 'react';
import ReactAutocomplete from 'react-autocomplete';
import { useSearch, useDebounce } from './hooks';
import Input from './components/Input';

function App() {
  const [value, setValue] = useState('');
  const { articles, status, error } = useSearch(useDebounce(value, 300));

  return (
    <>
      {status === 'ERROR' && <div>
        <p>Status: {status}</p>
        <p>Error: {error.message}</p>
      </div>}
      <ReactAutocomplete
        items={articles}
        renderInput={Input}
        inputProps={{ placeholder: 'Input a search term: ' }}
        getItemValue={item => item.label}
        renderMenu={(children, value, style) =>
          <div style={{ ...style }} className='input-suggestions'>
            {children}
            {children.length !== 0 &&
              <a href={`/search?query=${value}`} className='search-link'>
                See all results
              </a>
            }
          </div>
        }
        renderItem={(item, highlighted) =>
          <div
            key={item.id}
            style={{ backgroundColor: highlighted ? '#eee' : 'transparent' }}
          >
            {item.label}
          </div>
        }
        value={value}
        onChange={e => setValue(e.target.value)}
        onSelect={val => setValue(val)}
      />
    </>
  );
}

export default App;
