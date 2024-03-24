import cv2
import os
import threading
import time
import face_recognition as fr

from pathlib import Path

# The URL for the video device.
URL = "rtsp://test:oshtest@192.168.1.36:554"
# The `cv2.VideoCapture` instance.
CAPTURE = cv2.VideoCapture(f"rtspsrc location={URL} ! decodebin ! videoconvert ! video/x-raw,framerate=30/1 ! appsink drop=true sync=false", cv2.CAP_GSTREAMER)
# Our tolerance level.
TOLERANCE = 0.6

# A face returned from `find_faces()`.
class Face:
    # `data`: The face data.
    # `known`: Where the face is a known one.
    # `location`: The location data of the face.
    def __init__(self, data, known, location):
        self.data = data
        self.known = known
        self.location = location

# Get the list of known faces from the `profiles/` directory.
def get_known_faces():
    known_faces = {}

    for file in os.listdir("profiles"):
        path = f"profiles/{file}"
        image = fr.load_image_file(path)
        name = Path(path).stem

        # `face_encodings` return a list of faces, but since these images
        # are captured in advance, we can safely assume they contain a
        # singular face.
        known_faces[name] = fr.face_encodings(image)[0]

        return known_faces

# Find the list of faces in the current frame, based on the passed in known
# faces. The function returns a list of `Face` instances.
def find_faces(known_faces):
    faces = []

    success, frame = CAPTURE.read()

    if not success:
        raise RuntimeError("Failed to get frame! Make sure you can connect to the Camera.")

    face_locations = fr.face_locations(frame)
    faces_data = fr.face_encodings(frame, face_locations)
    
    for index, face_data in enumerate(faces_data):
        known_face = True in fr.compare_faces(known_faces, face_data, tolerance=TOLERANCE)
        location = face_locations[index]
        face = Face(face_data, known_face, location)
        faces += [face]
    
    return faces

# The entrypoint of the program.
if __name__ == "__main__":
    known_faces = get_known_faces()
    known_faces_data = list(known_faces.values())
    unknown_faces = {} # The unknown faces, determined in each loop run.
    checked_in = [] # The checked-in users.

    while True:
        _, frame = CAPTURE.read() # DEBUG: REMOVE LATER !!
        faces = find_faces(known_faces_data)

        known = filter(lambda face: face.known, faces)
        unknown = filter(lambda face: not face.known, faces)

        known = list(map(lambda face: face.data, known))
        unknown = list(map(lambda face: face.data, unknown))
        
        # Check each of our known faces, and if they're:
        # - In the photo, and
        # - Haven't been checked in,
        # then check them in.
        for name, face in known_faces.items():
            if True in fr.compare_faces(known, face, tolerance=TOLERANCE) and name not in checked_in:
                checked_in.append(name)
        
        unknown_faces_data = list(unknown_faces.values())
        for face in unknown:
            if True not in fr.compare_faces(unknown_faces_data, face, tolerance=TOLERANCE):
                guest_number = len(unknown_faces) + 1
                guest_name = f"Guest {guest_number}"
                unknown_faces[guest_name] = face

        for face in faces:
            matches = fr.compare_faces(list(known_faces.values()), face.data, tolerance=TOLERANCE)
            if True in matches:
                index = matches.index(True)
                name = list(known_faces.keys())[index]
            else:
                index = fr.compare_faces(list(unknown_faces.values()), face.data, tolerance=TOLERANCE).index(True)
                name = list(unknown_faces.keys())[index]

            top, right, bottom, left = face.location

            if face.known:
                color = (227, 220, 16)
            else:
                color = (23, 189, 186)

            cv2.rectangle(frame, (left, top), (right, bottom), color, 2)
            cv2.putText(frame, name, (left, bottom + 25), cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2)

        # Print our data.
        print("Checked in guests:")
        for name in checked_in:
            print(f"  - {name}")

        print("Unknown people:")
        for name in unknown_faces:
            print(f"  - {name}")
    
        cv2.imwrite("out.jpg", frame) # !! DEBUG LINE: REMOVE LATER !!
