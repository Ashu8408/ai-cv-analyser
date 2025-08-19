import { Link } from "react-router";

const Navbar = () => {
  return (
    <nav className="navbar flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3">
      <Link to="/" className="flex-shrink-0">
        <p className="text-2xl font-bold text-gradient">RESUMALIZER</p>
      </Link>

      <div className="flex flex-row items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
        <Link to="/upload" className="green-button w-fit text-center">
          Upload Resume
        </Link>
        <Link to="/wipe" className="red-button w-fit text-center">
          Delete resumes
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
