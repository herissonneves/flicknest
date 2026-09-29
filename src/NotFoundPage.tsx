import { Link } from 'react-router'

function NotFoundPage() {
  return (
    <>
      <h1>Página não encontrada</h1>
      <p>O endereço que você acessou não existe no FlickNest.</p>
      <Link to="/">Voltar para o início</Link>
    </>
  )
}

export default NotFoundPage
