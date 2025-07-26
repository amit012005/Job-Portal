# app.py

import os
import io
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import PyPDF2
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# ==============================================================================
# CONFIGURATION
# ==============================================================================
app = Flask(__name__)

# CORRECT SYNTAX for flask-cors:
# The `origins` parameter expects a list of strings.
# For a wildcard, you can use `resources={r"/api/*": {"origins": "*"}}`
# but it's better practice to be specific.
trusted_origins = [
    "http://localhost:5173",  # Your Vite React dev server
    "http://localhost:3000",
    "https://quiet-puppy-298507.netlify.app"  # In case you use Create React App
]
CORS(app, resources={r"/api/*": {"origins": trusted_origins}})


# ==============================================================================
# API KEY CONFIGURATION (Please use .env for this)
# ==============================================================================
GOOGLE_API_KEY = "AIzaSyC03-ChgnduTikDSrl7yFbAWuG-A1XKmQw"
if not GOOGLE_API_KEY:
    # Fallback for testing if .env is missing, but not recommended
    GOOGLE_API_KEY = "YOUR_API_KEY_HERE" 
    if GOOGLE_API_KEY == "YOUR_API_KEY_HERE":
      raise ValueError("GOOGLE_API_KEY not found. Please set it in the .env file.")

genai.configure(api_key=GOOGLE_API_KEY)
MODEL_NAME = 'gemini-1.5-flash'


# ==============================================================================
# HELPER FUNCTIONS (No changes needed)
# ==============================================================================
def extract_text_from_pdf_stream(pdf_stream):
    """Extracts text from a PDF file stream using PyPDF2."""
    try:
        reader = PyPDF2.PdfReader(pdf_stream)
        text = [page.extract_text() for page in reader.pages if page.extract_text()]
        return "\n".join(text)
    except Exception as e:
        print(f"Error reading PDF stream: {e}")
        return None

def create_analysis_prompt(job_desc_text, resume_text):
    """Creates a detailed prompt for the Gemini model."""
    return f"""
    You are an expert AI hiring assistant. Your task is to analyze a resume against a job description.
    Provide your analysis in a structured JSON format with these specific keys: "overall_score" (a float from 0.0 to 1.0), "summary" (a string), "strengths" (a list of strings), "weaknesses" (a list of strings), "matched_skills" (a list of strings), and "missing_skills" (a list of strings).
    Output only the raw JSON object and nothing else.

    [JOB DESCRIPTION]
    ---
    {job_desc_text}
    ---

    [RESUME TEXT]
    ---
    {resume_text}
    ---
    """

# ==============================================================================
# FLASK API ENDPOINT (No changes needed)
# ==============================================================================
@app.route('/api/analyze', methods=['POST'])
def analyze_resume_endpoint():
    """API endpoint to receive resume and job description for analysis."""
    try:
        if 'resume' not in request.files:
            return jsonify({"success": False, "message": "No resume file part"}), 400
        if 'job_desc' not in request.form:
            return jsonify({"success": False, "message": "No job description part"}), 400

        resume_file = request.files['resume']
        job_desc_text = request.form['job_desc']

        if resume_file.filename == '':
            return jsonify({"success": False, "message": "No selected file"}), 400

        resume_text = extract_text_from_pdf_stream(io.BytesIO(resume_file.read()))
        if not resume_text:
            return jsonify({"success": False, "message": "Could not extract text from PDF."}), 500

        model = genai.GenerativeModel(MODEL_NAME)
        prompt = create_analysis_prompt(job_desc_text, resume_text)
        response = model.generate_content(prompt)
        
        cleaned_response_text = response.text.strip().replace("```json", "").replace("```", "")
        analysis_results = json.loads(cleaned_response_text)
        
        return jsonify({
            "success": True,
            "message": "Analysis successful",
            "analysis": analysis_results
        })

    except json.JSONDecodeError:
        raw_text = response.text if 'response' in locals() else "AI response was not captured."
        print(f"--- Raw API Response Text ---\n{raw_text}")
        return jsonify({"success": False, "message": "AI returned an invalid format. Please try again."}), 500
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"success": False, "message": str(e)}), 500


if __name__ == '__main__':
    # Running on port 8001 to avoid conflicts
    app.run(debug=True, port=8001)
    