import "./feed.css"
import appleBowlImage from '../RSVPPics/Ian Bohanan.jpg';

function RSVPGuest() {
    return (
      <div className="RSVPGuestContainer">
        <div style={{ margin: '5%' }}>
            <img className="GuestIcon" src={appleBowlImage}/>
            <p>Ian Bohanan</p>
        </div>
            
      </div>
    );
}

export function VideoFeed(){
    return(
        <>
        <h1>This is the video feed</h1>
        <RSVPGuest/>
        </>
    )
}