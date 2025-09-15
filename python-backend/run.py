from face_tracker import app
from flask_cors import CORS

# Enable CORS for React Native app
CORS(app, origins=["*"])

if __name__ == '__main__':
    print("Starting Face Tracking Backend...")
    print("Backend URL: http://localhost:5000")
    print("Health Check: http://localhost:5000/health")
    app.run(host='0.0.0.0', port=5000, debug=True)