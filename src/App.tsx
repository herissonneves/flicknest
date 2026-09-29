import { Route, Routes } from 'react-router'
import AppShell from './app/AppShell.tsx'
import HomePage from './features/home/HomePage.tsx'
import SearchPage from './features/search/SearchPage.tsx'
import LibraryPage from './features/library/LibraryPage.tsx'
import NotFoundPage from './NotFoundPage.tsx'

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppShell>
  )
}

export default App
