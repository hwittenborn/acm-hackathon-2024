import "./feed.css"
import TestIcon from '../RSVPPics/Ian Bohanan.jpg';
import React, { useEffect, useState } from 'react';

function RSVPGuest({image,name}) {
    const isCheckedIn = false;
    return (
      <div className="RSVPGuestContainer">
        <div style={{ margin: '5%', display:'flex', }}>
            <img className="GuestIcon" src={image}/>
            <div>
                <p>{name}</p>
                {isCheckedIn ? <p>Checked in 5:00PM</p> : <p>Not checked in</p>}
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

    const [images, setImages] = useState([]);

    useEffect(() => {
        // Dynamically require images
        const context = require.context('../RSVPPics/', false, /\.(jpg|jpeg|png)$/);
        const imagePaths = context.keys().map(context);
    
        setImages(imagePaths);
      }, []);

      const knownGuests = images.map(image => {
        // Extract filename from image path
        const filename = image.split('/').pop().split('.')[0];
        
        return {
          image: image,
          name: filename
        };
      });

    return(
        <>
        <h1>This is the video feed</h1>

        <div className="GuestListsContainer">

            <div className="KnownGuests">
                <h2>Known Guests</h2>
                {knownGuests.map((person, index) => (
                    <RSVPGuest key={index} image={person.image} name={person.name} />
                ))}
            </div>

            <div className="UnknownGuests">
                <h2>Unknown Guests</h2>
                <UnknownGuest/>
            </div>

        </div>


        </>
    )
}