import {Link} from "react-router";

const Navbar = () => {
    return (
        <nav className="navbar">
            <Link to="/">
                <p className="text-2xl font-bold text-gradient">RESUMALIZER</p>
            </Link>
            <div>
                <Link to="/upload" className="green-button w-fit">
                    Upload Resume
                </Link>
                <Link to="/wipe" className="red-button w-fit ml-2">
                    Delete resumes
                </Link>
            </div>
        </nav>
    )
}
export default Navbar