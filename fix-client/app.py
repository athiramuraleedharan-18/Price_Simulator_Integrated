from flask import Flask, request, jsonify, render_template
from Client import Client
import quickfix as fix

app = Flask(__name__)
client = Client()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/start', methods=['GET'])
def start_client():
    try:
        settings = fix.SessionSettings("client.cfg")
        store_factory = fix.FileStoreFactory(settings)
        log_factory = fix.ScreenLogFactory(settings)
        initiator = fix.SocketInitiator(client, store_factory, settings, log_factory)
        initiator.start()
        return jsonify({"status": "Client started successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/order', methods=['POST'])
def place_order():
    data = request.json
    action = data.get('action')
    symbol = data.get('symbol', 'USD/BRL')
    quantity = data.get('quantity', 100)
    
    if action == "buy":
        client.place_order(fix.Side_BUY, symbol, quantity)
    elif action == "sell":
        client.place_order(fix.Side_SELL, symbol, quantity)
    else:
        return jsonify({"error": "Invalid action"}), 400

    return jsonify({"status": "Order placed successfully"})

@app.route('/subscribe', methods=['POST'])
def subscribe_market_data():
    data = request.json
    symbol = data.get('symbol', 'USD/BRL')
    client.subscribe_market_data(symbol)
    return jsonify({"status": "Subscribed to market data"})

@app.route('/unsubscribe', methods=['POST'])
def unsubscribe_market_data():
    client.cancel_market_data()
    return jsonify({"status": "Unsubscribed from market data"})

@app.route('/order-status', methods=['POST'])
def order_status_request():
    data = request.json
    cl_ord_id = data.get('cl_ord_id')
    symbol = data.get('symbol', 'USD/BRL')
    side = data.get('side', fix.Side_BUY)
    client.order_status_request(cl_ord_id, symbol, side)
    return jsonify({"status": "Order status request sent"})

if __name__ == '__main__':
    app.run(debug=True)
