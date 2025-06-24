import React, { useState } from 'react';
import ReactAutocomplete from 'react-autocomplete';
import { useSearch, useDebounce } from './hooks'; // Assuming hooks.js is in the same directory

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
        shouldItemRender={(item, value) => item.label.toLowerCase().indexOf(value.toLowerCase()) > -1}
        getItemValue={item => item.label}
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
