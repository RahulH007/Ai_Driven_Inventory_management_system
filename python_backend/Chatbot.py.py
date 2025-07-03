import firebase_admin
from firebase_admin import credentials, firestore
import google.generativeai as genai
from flask import Flask, request, jsonify
import os

# === Initialize Flask Application ===
app = Flask(__name__)

# === Load Firebase Credentials ===
FIREBASE_CRED_PATH = 'E:\\BackAPP3\\MyApp\\aidriveninventorymanagement-firebase-adminsdk-fbsvc-6b8315b2b0.json'

cred = credentials.Certificate(FIREBASE_CRED_PATH)
firebase_admin.initialize_app(cred)

# === Initialize Gemini LLM ===
GEMINI_API_KEY = '''Add your API key here'''  # Make sure to keep this secret
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

# === Fetch Data from Firestore ===
def get_firestore_data(collection_name):
    db_firestore = firestore.client()
    docs = db_firestore.collection(collection_name).stream()

    data = {}
    for doc in docs:
        data[doc.id] = doc.to_dict()
    return data

# === Generate Response from Gemini with System Prompt and Chat Flow Maintenance ===
def generate_query_from_firebase(user_prompt, firebase_data, conversation_history=""):
    system_prompt = """
You are an Inventory Management Assistant. Your role is to help users manage and retrieve information related strictly to inventory.
You can use other languages as well like Hindi.Only when teh users ask in Hindi you can reply in Hindi.

**🧭 Core Responsibilities:**
- Respond only to questions directly related to inventory management.
- Topics you can address include:
  - Current stock levels
  - Product details (e.g., name, SKU, category)
  - Restocking alerts or thresholds
  - Product categories or groupings
  - Inventory changes or recent updates
- Do **not** answer queries unrelated to inventory (e.g., company policies, pricing strategies, or unrelated business topics).

**📊 Response Format Guidelines:**
- Use clear, structured responses:
  - Bullet points for lists
  - Tables for multiple products or comparisons
  - Headings or categories when grouping information
- Prioritize clarity, accuracy, and ease of reading.

**🔒 Data Integrity & Access Control:**
- Always respect user access permissions.
- Do **not** expose or reference inventory data belonging to other users.
- Display only what the authenticated user is authorized to view.

**📭 When No Data Is Found:**
- If you can’t find data that matches the query, say:
  "I couldn't find any inventory records matching your query."

**🚫 Out-of-Scope Query Handling:**
- For non-inventory-related questions, politely respond:
  "I'm here to assist only with your inventory data. Please ask a question related to your stock or products."

**🔁 Conversational Context:**
- Remember the context of the ongoing conversation to answer follow-up questions smoothly.
- Maintain consistency and relevance throughout the conversation.

**❗ Important Restrictions:**
- Do **not** fabricate, infer, or guess any inventory data.
- Use only the information provided through the inventory retrieval system.
"""



    # Include previous conversation history to maintain continuity
    context = f"{system_prompt}\n\nConversation so far:\n{conversation_history}\n\nHere is the Firebase data:\n{firebase_data}\n\nUser prompt: {user_prompt}"
    
    response = model.generate_content(context)
    
    # Update conversation history with the new exchange
    updated_conversation_history = conversation_history + f"\nUser: {user_prompt}\nBot: {response.text}"

    return response.text, updated_conversation_history

# === Flask Route to Handle User Queries ===
@app.route('/ask', methods=['POST'])
def ask():
    try:
        # Get the user query from the POST request JSON
        user_input = request.json.get("query")
        if not user_input:
            return jsonify({"error": "Query is required"}), 400

        # 🔄 Replace 'your_collection_name' with your actual Firestore collection
        firebase_data = get_firestore_data('products')  # Adjust collection name here

        # Maintain conversation history
        conversation_history = request.json.get("conversation_history", "")

        # Generate response from Gemini
        result, conversation_history = generate_query_from_firebase(user_input, firebase_data, conversation_history)

        # Return the response and updated conversation history
        return jsonify({"response": result, "conversation_history": conversation_history})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# === Run Flask App ===
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

