from flask import Flask, render_template, request, jsonify, session
import pickle
import numpy as np
from langchain_google_genai import ChatGoogleGenerativeAI
from google.oauth2 import service_account
from langchain.prompts import PromptTemplate
import logging
import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)

app.secret_key = os.environ.get('FLASK_SECRET_KEY')
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=30)


# Load your service account key
SERVICE_ACCOUNT_FILE = './gen-lang-client-0957798475-dcd618b1dff3.json'
credentials = service_account.Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE)

# Initialize logging for error handling
logging.basicConfig(level=logging.INFO)

# Initialize the ChatGoogleGenerativeAI model
llm = ChatGoogleGenerativeAI(
    credentials=credentials,
    model="gemini-1.5-flash",
    temperature=0.7,
    max_tokens=150,
    timeout=10,
    max_retries=3,
)

# Define a Prompt Template for heart disease-related queries
template = """You are a healthcare assistant specialized in heart diseases. 
You will have a conversation with a user based on the following input: 
User Input: {user_input} 
Respond with heart disease information or advice tailored to their input."""

# Define a new template for continuing the chat after assessment
post_assessment_template = """You are a healthcare assistant specialized in heart diseases. 
The user has just completed a heart health assessment. Their risk level is: {risk_level}
Based on this information, provide tailored advice and answer their questions about heart health.
User Input: {user_input}
Respond with heart disease information or advice tailored to their input and risk level."""

# Create the PromptTemplate instances
prompt = PromptTemplate(input_variables=["user_input"], template=template)
post_assessment_prompt = PromptTemplate(input_variables=["risk_level", "user_input"], template=post_assessment_template)

# Function to interact with the chatbot
def chat_with_bot(user_input, risk_level=None):
    try:
        if risk_level:
            structured_prompt = post_assessment_prompt.format(risk_level=risk_level, user_input=user_input)
        else:
            structured_prompt = prompt.format(user_input=user_input)
        
        logging.info(f"Formatted prompt: {structured_prompt}")
        
        ai_msg = llm.invoke([{"role": "user", "content": structured_prompt}])
        
        assistant_reply = ai_msg.content
        logging.info(f"Assistant response: {assistant_reply}")
        
        if assistant_reply:
            return assistant_reply
        else:
            raise ValueError("The assistant returned an empty response.")
        
    except Exception as e:
        logging.error(f"Error during chatbot interaction: {e}")
        return f"Error: {e}"
    
# Load the saved model and scaler
model_folder = 'saved_models'  # Update this to your folder path

model_path = os.path.join(model_folder, 'xgb_model1.pkl')
with open(model_path, 'rb') as file:
    model = pickle.load(file)

scaler_path = os.path.join(model_folder, 'scaler.pkl')
with open(scaler_path, 'rb') as file:
    scaler = pickle.load(file)

@app.before_request
def make_session_permanent():
    session.permanent = True

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json  
    input_data = [float(data[key]) for key in data]
    input_data = np.array(input_data).reshape(1, -1) 
    input_data_scaled = scaler.transform(input_data)

    # Get the model prediction
    prediction = model.predict(input_data_scaled)
    probability = model.predict_proba(input_data_scaled)[0][1]

    # Prepare the response
    result = {
        'prediction': int(prediction[0]),  
        'probability': float(probability * 100) 
    }

    if result['prediction'] == 1:
        risk_level = f"high (probability: {result['probability']:.2f}%)"
    else:
        risk_level = f"low (probability: {100 - result['probability']:.2f}% of not having heart disease)"
    session['risk_level'] = risk_level

    return jsonify(result)

@app.route('/ai_chat', methods=['POST'])
def ai_chat():
    data = request.json
    user_input = data['user_input']
    risk_level = session.get('risk_level')
    response = chat_with_bot(user_input, risk_level)
    return jsonify({'response': response})

@app.route('/clear_session')
def clear_session():
    session.clear()
    return '', 204

if __name__ == "__main__":
    app.run(debug=True)
