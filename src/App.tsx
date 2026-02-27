import './App.css'

import { SearchForm } from './components/SearchForm/SearchForm'

import type { GeoEntity } from './types/api'


function App() {
  const handleSearchSubmit = (payload: { direction: GeoEntity | null }) => {
    console.log('Search submitted:', payload)
  }

  return (
    <div className="app">
      <SearchForm onSubmit={handleSearchSubmit} />
    </div>
  )
}

export default App
