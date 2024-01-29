import cv2
import numpy as np 
from collections import OrderedDict

class FaceDetector():
    def __init__(self):
        self.face_classifier = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

    def detect_face(video):
        vidObj = cv2.VideoCapture(video)
        count = 0
        map = {}
        while True:
            success, video_frame = vidObj.read()
            if success is False:
                break
            boxes = detect_bounding_box(video_frame)
            map[count] = boxes
            count += 1
        
        return map
    
    def detect_bounding_box(frame):
        gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = self.face_classifier.detectMultiScale(gray_frame, scaleFactor = 1.1, minNeighbors = 4, minSize=(40, 40))
        return faces

obj = FaceDetector()
print("created obj")