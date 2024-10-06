# Know Your Heart

An interactive web application designed to assess heart health and provide personalized insights using AI-driven analysis.

<p align="center">
  <img src="static/logo.jpeg" alt="Know Your Heart Logo" width="200" height="200">
</p>

**Visit the application: [Know Your Heart](https://know-your-heart.onrender.com/)**

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Model & AI Bot Development](#model-&-ai-bot-development)
- [Installation](#installation)
- [Usage](#usage)
- [AI Integration](#ai-integration)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Overview

Know Your Heart is a web-based application that empowers users to take proactive steps towards better heart health. By answering a series of questions, users receive an assessment of their heart disease risk, along with personalized advice and the ability to interact with an AI assistant for further information.

## Features

- **Heart Health Assessment**: Users answer questions about their health and lifestyle to receive a personalized risk assessment.
- **Predictive Model**: Utilizes a machine learning model to evaluate the risk of heart disease based on user inputs.
- **AI-powered Chat Assistant**: Engage in conversations about heart health, get clarifications, and receive additional information.
- **User-friendly Interface**: Clean and intuitive design for seamless navigation and interaction.
- **Responsive Design**: Accessible on various devices, including desktops, tablets, and smartphones.

## Technologies Used

- Frontend: HTML, CSS (Tailwind CSS), JavaScript
- Backend: Python with Flask
- ML Model: XGBoost
- AI Chat: LangChai with Google Gemini

## Model & AI Bot Development

### Exploratory Data Analysis (EDA)

The `EDA` directory contains Jupyter notebooks and scripts used for our exploratory data analysis. This process helped us understand the dataset, identify patterns, and prepare the data for model training.

Key EDA steps included:
- Data cleaning and preprocessing
- Feature analysis and correlation studies
- Visualization of key health indicators
- Statistical analysis of heart disease risk factors

### Model Development

Our predictive model for heart disease risk assessment was developed using XGBoost (eXtreme Gradient Boosting), a powerful and efficient implementation of gradient-boosted decision trees. The process involved:

1. Data preprocessing and feature engineering
2. XGBoost model implementation and hyperparameter tuning
3. Cross-validation and performance evaluation
4. Model interpretation and feature importance analysis

XGBoost was chosen for its high performance, ability to handle complex relationships in data, and built-in regularization to prevent overfitting.

### AI Bot Creation

The AI bot integrated into Know Your Heart was developed using LangChain and Google Gemini, providing users with additional information and answering heart health-related questions. The development process included:

1. Implementing LangChain to create a flexible and powerful conversational AI pipeline
2. Integrating Google Gemini as the large language model backend for natural language understanding and generation
3. Integrating the XGBoost predictive model results to provide personalized responses

This combination of LangChain and Google Gemini allows for sophisticated, context-aware conversations about heart health, while maintaining efficiency and accuracy.

### Artifacts

The `model_&_AIBot_artifacts` directory contains essential files related to our model and AI bot:

- Trained XGBoost model files
- Model evaluation reports and performance metrics
- Feature importance analyses
- LangChain configuration files
- Google Gemini integration settings
- Sample conversation logs for AI bot testing

These artifacts are crucial for understanding the model's performance, reproducing results, and maintaining the AI bot's functionality.

## Installation

1. Clone the repository: git clone https://github.com/jhasantanu9/Know-Your-Heart.git
2. Navigate to the project directory:
3. Install dependencies: pip install -r requirements.txt

## Usage
1. Start the application: python app.py
2. Open a web browser and go to `http://localhost:[your_port]`
3. Follow the on-screen instructions to begin your heart health assessment.

## AI Integration

Know Your Heart leverages advanced AI technologies to provide accurate risk assessments and engage in meaningful conversations about heart health. Our AI assistant is designed to offer information, answer questions, and provide general guidance related to heart health.

**Note**: While our AI provides valuable insights, it should not be considered a substitute for professional medical advice. Always consult with a healthcare professional for personalized medical guidance.

## Contributing

We welcome contributions to improve Know Your Heart! Please follow these steps:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a pull request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Santanu Jha
Portfolio: [https://santanujha.netlify.app/](https://santanujha.netlify.app/)
LinkedIn: [https://www.linkedin.com/in/santanu-jha-845510292/](https://www.linkedin.com/in/santanu-jha-845510292/)
