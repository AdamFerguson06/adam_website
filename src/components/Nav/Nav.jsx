import './Nav.css';

const Nav = () => {
  return (
    <nav className="nav">
      <div className="nav-logo">
        <span className="nav-logo-text">ADAM</span>
        <span className="nav-logo-dot">.</span>
      </div>
      
      <div className="nav-links">
        <a href="#projects" className="nav-link">Projects</a>
        <a href="#about" className="nav-link">About</a>
        <a href="#contact" className="nav-link nav-link-accent">Contact</a>
      </div>
    </nav>
  );
};

export default Nav;

