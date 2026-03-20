GigShield AI – Parametric Insurance for Delivery Workers
Problem Statement

Delivery partners working with platforms like Swiggy and Zomato face income loss due to external disruptions such as extreme weather, pollution, and traffic conditions. These disruptions can reduce their working hours and lead to a 20–30% loss in earnings. Currently, there is no financial protection mechanism for such uncontrollable events.

Objective

To build an AI-powered parametric insurance platform that:

Provides weekly insurance coverage

Automatically detects disruptions

Triggers instant payouts without manual claims

Uses AI for risk prediction and fraud detection

Target Persona

Food delivery partners (Swiggy/Zomato) operating in urban areas such as Chennai.

Solution Overview
How It Works

User registers and selects a weekly insurance plan

The system monitors environmental conditions such as weather and air quality

AI models predict risk levels based on real-time and historical data

If a disruption occurs, the system automatically triggers a payout

Fraud detection mechanisms validate the authenticity of the event

Parametric Triggers
Trigger Type	Condition	Impact on Work
Heavy Rain	Rainfall > 50mm	Deliveries halted
High Pollution	AQI > 250	Unsafe working conditions
Extreme Heat	Temperature > 42°C	Health risk, reduced hours
Traffic Congestion	High traffic index	Fewer deliveries completed
Weekly Pricing Model
Plan	Premium (per week)	Coverage Amount
Basic	₹49	₹300
Standard	₹79	₹600
Premium	₹99	₹1000

Pricing will be dynamically adjusted using AI-based risk scoring.

AI/ML Integration
Risk Prediction

Machine learning models analyze weather forecasts and historical disruption data to predict risk levels (Low, Medium, High).

Dynamic Pricing

Premiums are adjusted based on predicted risk levels and geographic conditions.

Fraud Detection

GPS-based location validation

Detection of duplicate or abnormal claims

Anomaly detection using behavioral patterns

System Workflow

User purchases weekly plan → System monitors external conditions → AI predicts risk → Disruption detected → Fraud validation → Automatic payout → User notification

Tech Stack

Frontend: EJS / HTML / CSS

Backend: Node.js with Express

Database: MongoDB

APIs: OpenWeather API, AQI APIs

AI/ML: Python (Scikit-learn) or rule-based models

Payments: Razorpay (test mode)

Deliverables for Phase 1

Defined persona and problem understanding

Clear workflow and system architecture

Weekly pricing model and parametric triggers

AI/ML integration strategy

GitHub repository with documentation

Future Enhancements

Real-time risk heatmaps

Personalized insurance plans based on user behavior

Integration with delivery platforms

Advanced machine learning models for improved prediction accuracy

Demo Plan

The demonstration will include:

User onboarding and registration

Plan selection process

Simulation of a disruption event (e.g., heavy rainfall)

Automatic payout triggering and notification
