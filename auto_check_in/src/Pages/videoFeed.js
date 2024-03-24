import "./feed.css"
import TestIcon from '../RSVPPics/Ian Bohanan.jpg';
import React, { useEffect, useState } from 'react';

function RSVPGuest({image,name, isCheckedIn}) {
    const [arrived, setArrived] = useState(0)

    if(isCheckedIn && arrived==0)
    {
        setArrived(arrived+1)
    }

    return (
      <div className="RSVPGuestContainer">
        <div style={{ margin: '5%', display:'flex', backgroundColor: arrived>0 ? 'green' : 'red'}}>
            <img className="GuestIcon" src={image}/>
            <div>
                <p>{name}</p>
                {arrived>0 ? <p>Checked in 5:00PM</p> : <p>Not checked in</p>}
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
    const [activeName, setActiveName] = useState('');
    const [isChecked, setChecked] = useState(false)

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

    const handleButtonClick = () => {
        setChecked(true)
    };

    return(
        <>
        <h1>This is the video feed</h1>

        <input 
          type="text" 
          placeholder="Enter Name" 
          value={activeName}
          onChange={(e) => setActiveName(e.target.value)}
        />
        <button onClick={handleButtonClick}>Highlight</button>

        <div className="GuestListsContainer">

            <div className="KnownGuests">
                <h2>Known Guests</h2>
                {knownGuests.map((person, index) => (
                    <RSVPGuest key={index} image={person.image} name={person.name} isCheckedIn={activeName==person.name}/>
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