import cv2
import mediapipe as mp
import numpy as np
from flask import Flask, request, jsonify
import base64
from io import BytesIO
from PIL import Image

app = Flask(__name__)

# Initialize MediaPipe Face Mesh
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

# Eye landmark indices
LEFT_EYE = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398]
RIGHT_EYE = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246]

def calculate_ear(eye_landmarks):
    """Calculate Eye Aspect Ratio"""
    A = np.linalg.norm(eye_landmarks[1] - eye_landmarks[5])
    B = np.linalg.norm(eye_landmarks[2] - eye_landmarks[4])
    C = np.linalg.norm(eye_landmarks[0] - eye_landmarks[3])
    
    ear = (A + B) / (2.0 * C)
    return ear

def get_gaze_direction(landmarks):
    """Estimate gaze direction"""
    left_eye_center = np.mean([landmarks[i] for i in LEFT_EYE[:6]], axis=0)
    right_eye_center = np.mean([landmarks[i] for i in RIGHT_EYE[:6]], axis=0)
    nose_tip = landmarks[1]
    
    eye_center = (left_eye_center + right_eye_center) / 2
    gaze_vector = eye_center - nose_tip
    
    return {
        'x': float(gaze_vector[0]),
        'y': float(gaze_vector[1]),
        'looking_away': abs(gaze_vector[0]) > 0.02 or abs(gaze_vector[1]) > 0.02
    }

def analyze_head_pose(landmarks):
    """Analyze head pose angles"""
    nose_tip = landmarks[1]
    chin = landmarks[18]
    left_eye_corner = landmarks[33]
    right_eye_corner = landmarks[362]
    
    face_width = np.linalg.norm(left_eye_corner - right_eye_corner)
    face_height = np.linalg.norm(nose_tip - chin)
    
    yaw = (left_eye_corner[0] - right_eye_corner[0]) / face_width
    pitch = (nose_tip[1] - chin[1]) / face_height
    
    return {
        'yaw': float(yaw * 90),
        'pitch': float(pitch * 90),
        'looking_away': abs(yaw) > 0.3 or abs(pitch) > 0.3
    }

@app.route('/analyze_face', methods=['POST'])
def analyze_face():
    try:
        data = request.json
        image_data = data['image']
        
        # Decode base64 image
        image_data = image_data.split(',')[1]
        image_bytes = base64.b64decode(image_data)
        image = Image.open(BytesIO(image_bytes))
        image_np = np.array(image)
        
        # Process with MediaPipe
        results = face_mesh.process(image_np)
        
        if not results.multi_face_landmarks:
            return jsonify({
                'face_detected': False,
                'focus_score': 30,
                'alerts': ['No face detected']
            })
        
        face_landmarks = results.multi_face_landmarks[0]
        landmarks = np.array([[lm.x, lm.y, lm.z] for lm in face_landmarks.landmark])
        
        # Extract eye landmarks
        left_eye_landmarks = landmarks[LEFT_EYE[:6]]
        right_eye_landmarks = landmarks[RIGHT_EYE[:6]]
        
        # Calculate Eye Aspect Ratios
        left_ear = calculate_ear(left_eye_landmarks)
        right_ear = calculate_ear(right_eye_landmarks)
        avg_ear = (left_ear + right_ear) / 2
        
        # Analyze gaze and head pose
        gaze_data = get_gaze_direction(landmarks)
        head_pose = analyze_head_pose(landmarks)
        
        # Calculate focus score
        focus_score = 100
        alerts = []
        
        if avg_ear < 0.2:
            focus_score -= 40
            alerts.append('Eyes closed detected')
        elif avg_ear < 0.25:
            focus_score -= 20
            alerts.append('Drowsiness detected')
        
        if gaze_data['looking_away']:
            focus_score -= 25
            alerts.append('Looking away from screen')
        
        if head_pose['looking_away']:
            focus_score -= 30
            alerts.append('Head turned away')
        
        focus_score = max(0, min(100, focus_score))
        
        return jsonify({
            'face_detected': True,
            'focus_score': focus_score,
            'alerts': alerts,
            'eye_data': {
                'left_ear': float(left_ear),
                'right_ear': float(right_ear),
                'avg_ear': float(avg_ear),
                'eyes_open': avg_ear > 0.25
            },
            'gaze_data': gaze_data,
            'head_pose': head_pose,
            'emotion': 'focused' if focus_score > 70 else 'distracted'
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'face_detected': False,
            'focus_score': 0,
            'alerts': ['Analysis failed']
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'face_tracker'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)