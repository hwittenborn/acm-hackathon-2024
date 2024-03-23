import requests
import json
import cv2

def getCurFrame():
    print("getting requests")

    url = "rtsp://test:oshtest@192.168.1.36:554"

    capture = cv2.VideoCapture(url)

    curFrame = capture.read()

    print("Got request")

    ret,frame = capture.read()

    cv2.imwrite(f"firstFrame.jpg", frame)

    while(capture.isOpened()):
        ret,frame = capture.read()
        cv2.imshow('frame',frame)
        if cv2.waitKey(20) & 0xFF == ord('q'):
            break

    capture.release()

    print("Succesfully completed!")