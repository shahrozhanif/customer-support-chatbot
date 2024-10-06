from flask import Flask, render_template, request, jsonify
import pandas as pd
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
from docx import Document
from utils import Change_Request, Change_Request_Items, generate_delivery_time

doc = Document('database/SOPs.docx')
full_text = []
for paragraph in doc.paragraphs:
    full_text.append(paragraph.text)
SOPs = '\n'.join(full_text)

history = []
history.append({"role": "user", "parts": SOPs})

# Import API key
from api_key import api_key
genai.configure(api_key=api_key)

app = Flask(__name__)

# Load the CSV file
global orders_df
orders_df = pd.read_excel(r'database/orders.xlsx')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/order')
def order():
    return render_template('order.html')

@app.route('/cart', methods=['POST', 'GET'])
def cart():
    if request.method == 'POST':
        global orders_df
        data = request.json
        time = generate_delivery_time()
        new_row = pd.DataFrame({'order-id': [data['orderID']], 'name': [data['name']], 'order': [str(data['orderObject'])], 'estimated delivery time': [time], 'bill': [data['totalBill']], 'delivery address': [data['address']], 'cooking instructions': [data['specialInstructions']], 'phone number': [data['phone']]})
        orders_df = pd.concat([orders_df, new_row], ignore_index=True)
        orders_df.to_excel(r'database/orders.xlsx', index=False)
        return jsonify({"message": "Order received successfully", "time": time}), 200
    else:
        return render_template('cart.html')

@app.route('/customer_service')
def customer_service():
    return render_template('customer_service.html')

@app.route('/submit_order_id', methods=['GET', 'POST'])
def submit_order_id():
    data = request.get_json()
    order_id = data.get('order_id')

    # Check if order ID exists in the CSV file
    global order
    order = orders_df[orders_df['order-id'] == order_id]
    
    if order.empty:
        return jsonify({'status': 'error', 'message': 'There is no record for the given order-id. Please enter a correct order-id.'})
    
    # Save order details in session or global variable for later use
    global order_details
    order_details = order.iloc[0].to_dict()
    history.append({"role": "user", "parts": f"The details of the order are {order_details}"})
    return jsonify({'status': 'success', 'message': None})

@app.route('/submit_query', methods=['GET', 'POST'])
def submit_query():
    data = request.get_json()
    customer_query = data.get('query')
    
    model = genai.GenerativeModel("gemini-1.5-flash", system_instruction = "You are a customer service chatbot for a restaurant named 'Eater's Delight'. ", safety_settings={
        HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE
    })
    chat = model.start_chat(history=history)

    response = chat.send_message(customer_query, generation_config=genai.types.GenerationConfig(max_output_tokens=200, temperature=0.5)).text
    if "Change address request::" in response:
        change_request = Change_Request(orders_df, order, response, 'delivery address')
        response = change_request.get_response()

    elif "Change order request::" in response:
        change_request = Change_Request_Items(orders_df, order, response, 'order')
        response = change_request.get_response()
        
    elif "Change cooking instructions request::" in response:
        change_request = Change_Request(orders_df, order, response, 'cooking instructions')
        response = change_request.get_response()

    history.append({"role": "user", "parts": customer_query})
    history.append({"role": "model", "parts": response})
    print(response)
    return jsonify({'response': response})



if __name__ == '__main__':
    app.run(debug = True)