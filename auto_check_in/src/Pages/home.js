import { Link } from "react-router-dom"
import "./home.css"
export function Home(){
    return(
        <>
        <h1>This is the home page</h1>
        <Link to="/feed">Go to video feed</Link>
        </>
    )
}