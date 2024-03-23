import request
import subprocess
import sys

print("Booting up openCamera")

def checkRequirements():
    required_libraries = [
        "opencv-python",
        "requests"
    ]
    for lib in required_libraries:
        try:
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', lib])
        except subprocess.CalledProcessError: 
            print("ERROR installing libraries")
   

print("Checking requirements")
checkRequirements()
request.getCurFrame()