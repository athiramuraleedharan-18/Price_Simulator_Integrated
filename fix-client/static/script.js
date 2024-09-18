document.addEventListener('DOMContentLoaded', () => {
  const connectionStatus = document.getElementById('connection-status');
  const orderForm = document.getElementById('order-form');
  const subscribeButton = document.getElementById('subscribe-market-data');
  const unsubscribeButton = document.getElementById('unsubscribe-market-data');
  const orderStatusForm = document.getElementById('order-status-form');
  const orderConfirmation = document.getElementById('order-confirmation');
  const marketStatus = document.getElementById('market-status');
  const statusResponse = document.getElementById('status-response');

  // Simulate connection (replace with actual connection logic)
  fetch('/start')
      .then(response => response.json())
      .then(data => {
          if (data.status === 'Client started successfully') {
              connectionStatus.textContent = 'Connection Status: Connected';
              connectionStatus.classList.add('connected');
          } else {
              throw new Error(data.error);
          }
      })
      .catch(error => {
          console.error('Error:', error);
          connectionStatus.textContent = 'Connection Status: Failed';
          connectionStatus.classList.add('disconnected');
      });

  // Handle order form submission
  orderForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const action = document.getElementById('action').value;
      const symbol = document.getElementById('symbol').value;
      const quantity = parseInt(document.getElementById('quantity').value);

      if (symbol && quantity > 0) {
          fetch('/order', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ action, symbol, quantity }),
          })
          .then(response => response.json())
          .then(data => {
              if (data.status === 'Order placed successfully') {
                  orderConfirmation.textContent = 'Order placed successfully!';
                  orderConfirmation.classList.remove('hidden');
              } else {
                  throw new Error(data.error);
              }
          })
          .catch(error => {
              console.error('Error:', error);
              orderConfirmation.textContent = `Error: ${error.message}`;
              orderConfirmation.classList.remove('hidden');
          });
      } else {
          alert('Please enter valid order details.');
      }
  });

  // Handle subscribe button click
  subscribeButton.addEventListener('click', () => {
      const symbol = document.getElementById('symbol').value;

      fetch('/subscribe', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ symbol }),
      })
      .then(response => response.json())
      .then(data => {
          if (data.status === 'Subscribed to market data') {
              marketStatus.textContent = 'Market data subscription active';
              subscribeButton.disabled = true;
              unsubscribeButton.disabled = false;
              marketStatus.classList.remove('hidden');
          } else {
              throw new Error(data.error);
          }
      })
      .catch(error => {
          console.error('Error:', error);
          marketStatus.textContent = `Error: ${error.message}`;
          marketStatus.classList.remove('hidden');
      });
  });

  // Handle unsubscribe button click
  unsubscribeButton.addEventListener('click', () => {
      fetch('/unsubscribe', {
          method: 'POST',
      })
      .then(response => response.json())
      .then(data => {
          if (data.status === 'Unsubscribed from market data') {
              marketStatus.textContent = 'Market data subscription canceled';
              subscribeButton.disabled = false;
              unsubscribeButton.disabled = true;
              marketStatus.classList.remove('hidden');
          } else {
              throw new Error(data.error);
          }
      })
      .catch(error => {
          console.error('Error:', error);
          marketStatus.textContent = `Error: ${error.message}`;
          marketStatus.classList.remove('hidden');
      });
  });

  // Handle order status form submission
  orderStatusForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const clOrdID = document.getElementById('cl_ord_id').value;

      if (clOrdID) {
          fetch('/order-status', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ cl_ord_id: clOrdID }),
          })
          .then(response => response.json())
          .then(data => {
              if (data.status === 'Order status request sent') {
                  statusResponse.textContent = `Status for ClOrdID ${clOrdID}: Executed`;
                  statusResponse.classList.remove('hidden');
              } else {
                  throw new Error(data.error);
              }
          })
          .catch(error => {
              console.error('Error:', error);
              statusResponse.textContent = `Error: ${error.message}`;
              statusResponse.classList.remove('hidden');
          });
      } else {
          alert('Please enter a valid ClOrdID.');
      }
  });
});
