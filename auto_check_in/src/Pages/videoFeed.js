import "./feed.css"
import TestIcon from '../RSVPPics/Ian Bohanan.jpg';

function RSVPGuest() {
    return (
      <div className="RSVPGuestContainer">
        <div style={{ margin: '5%', display:'flex', }}>
            <img className="GuestIcon" src={TestIcon}/>
            <div>
                <p>Ian Bohanan</p>
                <p>Checked in: 5:00PM</p>
            </div>
        </div>
      </div>
    );
}

function UnknownGuest(){
    return (
        <div className="UnknownGuestContainer">
            <img className="GuestIcon" src={TestIcon}/>
            <div>
                <label>
                    <input name="myInput" defaultValue="Unknown Guest 1"/>
                </label>
                <button>
                    <span className="material-icons">check</span>
                </button>
            </div>
        </div>
      );
}

export function VideoFeed(){
    return(
        <>
        <h1>This is the video feed</h1>

        <div className="GuestListsContainer">

            <div className="KnownGuests">
                <h2>Known Guests</h2>
                <RSVPGuest/>
                <RSVPGuest/>
            </div>

            <div className="UnknownGuests">
                <h2>Unknown Guests</h2>
                <UnknownGuest/>
            </div>

        </div>


        </>
    )
}