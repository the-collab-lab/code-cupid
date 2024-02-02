function Header() {
  return (
    <header>
      <h1>Code Cupid</h1>
      <div className="heart-container">
        <div className="heart"></div>
        <div className="arrow">
          <div className="arrow-stick"></div>
          <div className="arrow-stick"></div>
          <div className="arrow-stick"></div>
          <div className="arrow-stick"></div>
        </div>
      </div>
      <p>Meet your coding match!</p>
    </header>
  )
}

export default Header
