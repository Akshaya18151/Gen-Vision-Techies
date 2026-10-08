AI Scam Shield
An AI tool that checks suspicious messages, explains the risks, and tells you what to do next.
Team  
Team Name: Gen-Vision-Techies
 Member                          	Contribution
AKILESH SJ      	AI integration and Qwen3 scam analysis
AKSHAYA S       	Frontend development and UI/UX            
KARTHIKEYAN P   	Backend development and API integration   
PAVITHRA T      	Testing, documentation, and deployment    

Problem Statement
The Problem 
People keep getting random messages every day — SMS, WhatsApp, emails, fake job offers, “you won money” texts, delivery updates, payment requests and phishing links. A lot of these messages look genuine. Scammers use urgency, fear, fake rewards or pretend to be someone you trust so people act without thinking. Most regular users just don’t know how to tell if a message is safe or not.
Why We Chose This Problem
Scams can hit anyone, no matter how technical they are. We wanted to build something useful that actually helps people understand “why” a message looks suspicious instead of just labelling it as a scam.
Solution  
AI Scam Shield is a simple web app. You paste any message you’re unsure about and it runs it through an open-weight AI model (Qwen3). It gives you a risk score, risk level, the red flags it found, a plain-English explanation, and clear safety advice.
Key Features 
•	AI analysis of suspicious messages  
•	Risk score from 0–100  
•	Risk level: Low / Medium / High  
•	Detects common scam signs  
•	Explains the issues in simple language  
•	Gives practical safety recommendations  
•	Clean and easy-to-use interface  

Innovation and Differentiation
Most tools just say “scam” or “not a scam”. We made ours go further: detect the problem → explain it → score the risk → recommend what to do.  
For example, if a message says you’ve won money and need to act immediately, the system points out the unexpected reward and the urgency, then explains why that’s a classic scam pattern. This helps people understand the danger instead of just trusting a label. We also treated the open-weight AI model as a core part of the product, not just a development tool.

Technical Implementation
Architecture
 
Technology Stack
Category  	Technologies
Frontend        	Next.js, TypeScript, Tailwind CSS
Backend         	Python, FastAPI               
AI / ML        	Qwen3 open-weight model       
APIs / Services	Qwen3 inference service       

How It Works 
User pastes a message → frontend sends it to the FastAPI backend → backend prepares the text → sends it to Qwen3 → model analyses it and returns structured output → backend organises the response → frontend shows the risk score, level, signals, explanation and safety advice.

Technical Decisions  
We chose Next.js and Tailwind so we could build a clean frontend quickly. FastAPI made the backend simple since we were already working in Python. We forced the AI to return fixed fields (score, level, signals, explanation, advice) so the frontend could display results reliably. We skipped authentication and a database on purpose to focus on getting a working end-to-end demo ready during the hackathon.

Implementation During the Hackathon
We built a complete working version. Users can paste a message, get it analysed by the AI, and see a full risk breakdown with score, signals, explanation and recommendations. We tested it with reward scams, phishing-style messages and fake delivery texts. Extra features like OCR or URL checking were left for later if time allowed.

Team Contributions
•	AKILESH SJ: AI layer, Qwen3 integration and scam analysis logic  
•	AKSHAYA S: Frontend interface and overall UI/UX  
•	KARTHIKEYAN P: FastAPI backend and connection between frontend and AI  
•	PAVITHRA T: Testing, documentation, integration support and deployment prep  

Working Application  
Live Application: https://github.com/Akshaya18151/Gen-Vision-Techies
Anyone can open the link, paste a suspicious message and get an AI-generated risk assessment. Good messages to test include fake reward claims, phishing attempts or delivery notifications.

Demo Video
Demo Video: https://drive.google.com/file/d/1eqj-LC5hLAvUE0gnN5DD-a3f8Uee5Iq6/view?usp=sharing
The video shows the full flow: opening the app, pasting a message, clicking Analyse, and viewing the score, signals, explanation and safety advice.

Open Source and AI Usage
AI / Models  
Qwen3: Used to analyse messages, detect scam signals, calculate risk score and generate explanations + safety recommendations.

Open Source Components  
•	Next.js: Frontend framework  
•	TypeScript: Type-safe frontend development  
•	Tailwind CSS: Styling  
•	FastAPI: Backend API  
We will follow all licensing and attribution requirements for the tools and model used.
Setup and Usage
Prerequisites  
•	Node.js 18 or later  
•	Python 3.10 or later  
•	Git  
•	Access to the Qwen3 inference setup  
Installation 
git clone https://github.com/Akshaya18151/Gen-Vision-Techies
cd dev
Frontend:  
cd frontend
npm install
Backend:  
cd ../backend
pip install -r requirements.txt
Environment Variables
QWEN_MODEL=Qwen 2.5 7b
Running the Project
# Terminal 1 - Backend
cd backend
uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd frontend
npm run dev

Usage  
1. Open http://localhost:3000  
2. Paste a suspicious message  
3. Click Analyse  
4. Review the risk score, signals, explanation and safety advice  
Note: This is a helper tool, not a perfect fraud detector.

Devpost Submission
Devpost Project: https://dev.to/akilesh_sj_37f42a2135345/scam-shield-5deb
Credits and License
Credits
Thanks to the developers of Next.js, Tailwind CSS, FastAPI and the Qwen3 model.
License  
[npm]: https://npmjs.com/
[yarn]: https://yarnpkg.com/
MIT License

Submission Checklist 
•	Project title and description added  
•	All team members listed  
•	Problem clearly explained  
•	Reason for choosing the problem explained  
•	Solution and key features documented  
•	Innovation and differentiation explained  
•	Architecture included  
•	Technical implementation documented  
•	Work completed during the hackathon documented  
•	Team contributions documented  
•	Working application is functional  
•	Live application link added where applicable  
•	Demo video added  
•	AI and open-source components documented  
•	Setup and usage instructions tested  
•	Challenges and learnings documented  
•	Devpost submission completed  
•	Devpost link added  
•	Credits added  
•	License added  
•	Repository is organized and complete  

