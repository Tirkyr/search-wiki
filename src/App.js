import React, { useState } from 'react';
import ReactAutocomplete from 'react-autocomplete';
import { useSearch, useDebounce, useSearchForm } from './hooks';
import Input from './components/Input';

function App() {
  const { searchValue, onSearchChange } = useSearchForm();
  const { articles, status, error } = useSearch(useDebounce(searchValue, 300));

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
        value={searchValue}
        onChange={onSearchChange}
      />
    </>
  );
}

export default App;
