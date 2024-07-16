import "./missingPage.css"
import { IoReturnDownBackSharp } from "react-icons/io5";
import { Link } from "react-router-dom";

const MissingPage = () => {
  return (
    <section className='missing'>
        <h1 className='missing_text'>sorry no page found!</h1>
        <Link className='missing_back' to="/"><IoReturnDownBackSharp className="missing_icon"/> back to home page </Link>
    </section>
  )
}

export default MissingPage