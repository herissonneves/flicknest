import type { ReactNode } from 'react'
import styles from './AppShell.module.css'
import { Link, NavLink } from 'react-router'

type AppShellProps = {
  children: ReactNode
}

function AppShell({ children }: AppShellProps) {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <Link className={styles.brand} to="/">
          FlickNest
        </Link>

        <nav className={styles.mainNav} aria-label="Navegação principal">
          <NavLink to="/">Início</NavLink>
          <NavLink to="/search">Buscar</NavLink>
          <NavLink to="/library">Minha biblioteca</NavLink>
        </nav>
      </header>

      <main>{children}</main>
    </div>
  )
}

export default AppShell
