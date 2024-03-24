import { Link } from "react-router-dom"
import "./global.css"
import "./home.css"
export function Home(){
    return(
        <div className="homeContainer">
            <h1>This is the home page</h1>
            <Link to="/feed">Go to video feed</Link>
        </div>
    )
}