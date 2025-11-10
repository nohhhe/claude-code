const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Mock data
let cart = [];
let orderNumber = 1000000000;

// Reset cart endpoint for testing
app.post('/api/reset', (req, res) => {
  cart = [];
  res.json({ success: true });
});

// Routes
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>E-Commerce Store</title>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .header { background: #333; color: white; padding: 20px; margin: -20px -20px 20px -20px; }
        .search-bar { padding: 20px; background: white; border-radius: 8px; margin-bottom: 20px; }
        .search-bar input { padding: 12px; width: 300px; border: 2px solid #ddd; border-radius: 4px; }
        .cart-link { float: right; background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; }
        .cart-badge { background: red; color: white; border-radius: 50%; padding: 2px 6px; margin-left: 5px; }
        .featured-products { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
        .product-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); cursor: pointer; }
        .product-card:hover { box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
        .product-image { width: 100%; height: 150px; background: #eee; border-radius: 4px; margin-bottom: 10px; display: flex; align-items: center; justify-content: center; color: #666; }
        .price { color: #007bff; font-weight: bold; font-size: 18px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>E-Commerce Store</h1>
        <a href="/cart" class="cart-link">Cart <span data-testid="cart-badge" class="cart-badge">${cart.length}</span></a>
      </div>
      
      <div class="search-bar">
        <input type="text" placeholder="Search products..." id="search">
      </div>
      
      <h2>Featured Products</h2>
      <div class="featured-products">
        <div class="product-card" onclick="location.href='/products/1'">
          <div class="product-image">📱 Laptop Image</div>
          <h3>Gaming Laptop</h3>
          <p>High performance gaming laptop</p>
          <div class="price">$999</div>
        </div>
        <div class="product-card" onclick="location.href='/products/2'">
          <div class="product-image">🖱️ Mouse Image</div>
          <h3>Gaming Mouse</h3>
          <p>Wireless gaming mouse</p>
          <div class="price">$59</div>
        </div>
        <div class="product-card" onclick="location.href='/products/3'">
          <div class="product-image">⌨️ Keyboard Image</div>
          <h3>Mechanical Keyboard</h3>
          <p>RGB mechanical keyboard</p>
          <div class="price">$129</div>
        </div>
      </div>
      
      <script>
        document.getElementById('search').addEventListener('keypress', function(e) {
          if (e.key === 'Enter') {
            window.location.href = '/search?q=' + this.value;
          }
        });
      </script>
    </body>
    </html>
  `);
});
      </script>
    </body>
    </html>
  `);
});

app.get('/search', (req, res) => {
  const query = req.query.q;
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Search Results - E-Commerce Store</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .header { background: #333; color: white; padding: 20px; margin: -20px -20px 20px -20px; }
        .search-results { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
        .product-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); cursor: pointer; }
        .product-card:hover { box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
        .product-image { width: 100%; height: 150px; background: #eee; border-radius: 4px; margin-bottom: 10px; display: flex; align-items: center; justify-content: center; color: #666; }
        .price { color: #007bff; font-weight: bold; font-size: 18px; }
        .back-btn { background: #6c757d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Search Results for "${query}"</h1>
      </div>
      
      <a href="/" class="back-btn">← Back to Home</a>
      
      <div class="search-results">
        <div data-testid="product-card" class="product-card" onclick="location.href='/products/1'">
          <div class="product-image">📱 Laptop Image</div>
          <h3>Gaming Laptop</h3>
          <p>High performance gaming laptop</p>
          <div class="price">$999</div>
        </div>
      </div>
    </body>
    </html>
  `);
});

app.get('/products/:id', (req, res) => {
  const id = req.params.id;
  if (id === 'out-of-stock-item') {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Out of Stock Product - E-Commerce Store</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
          .header { background: #333; color: white; padding: 20px; margin: -20px -20px 20px -20px; }
          .product-detail { background: white; padding: 30px; border-radius: 8px; max-width: 600px; margin: 0 auto; }
          .product-image { width: 100%; height: 300px; background: #eee; border-radius: 4px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; color: #666; font-size: 24px; }
          .price { color: #007bff; font-size: 24px; font-weight: bold; margin: 10px 0; }
          .add-to-cart { background: #ccc; color: #666; padding: 15px 30px; border: none; border-radius: 4px; font-size: 16px; cursor: not-allowed; }
          .stock-status { color: #dc3545; font-weight: bold; margin: 10px 0; }
          .back-btn { background: #6c757d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Product Details</h1>
        </div>
        
        <a href="/" class="back-btn">← Back to Home</a>
        
        <div class="product-detail">
          <div class="product-image">❌ Out of Stock</div>
          <h1>Out of Stock Laptop</h1>
          <div class="price">$1299</div>
          <div data-testid="stock-status" class="stock-status">Out of Stock</div>
          <p>This high-end gaming laptop is currently out of stock. Please check back later.</p>
          <button class="add-to-cart" disabled>Add to Cart</button>
        </div>
      </body>
      </html>
    `);
  } else {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Gaming Laptop - E-Commerce Store</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
          .header { background: #333; color: white; padding: 20px; margin: -20px -20px 20px -20px; }
          .product-detail { background: white; padding: 30px; border-radius: 8px; max-width: 600px; margin: 0 auto; }
          .product-image { width: 100%; height: 300px; background: #eee; border-radius: 4px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; color: #666; font-size: 24px; }
          .price { color: #007bff; font-size: 24px; font-weight: bold; margin: 10px 0; }
          .add-to-cart { background: #28a745; color: white; padding: 15px 30px; border: none; border-radius: 4px; font-size: 16px; cursor: pointer; }
          .add-to-cart:hover { background: #218838; }
          .cart-link { background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 20px; }
          .cart-badge { background: red; color: white; border-radius: 50%; padding: 2px 6px; margin-left: 5px; }
          .back-btn { background: #6c757d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Product Details</h1>
        </div>
        
        <a href="/" class="back-btn">← Back to Home</a>
        
        <div class="product-detail">
          <div class="product-image">📱 Laptop Image</div>
          <h1>Gaming laptop</h1>
          <div class="price">$999</div>
          <p>High performance gaming laptop perfect for gaming and professional work. Features latest processor and graphics card.</p>
          <button class="add-to-cart" onclick="addToCart()">Add to Cart</button>
          <a href="/cart" class="cart-link">Cart <span data-testid="cart-badge" class="cart-badge">${cart.length}</span></a>
        </div>
        
        <script>
          function addToCart() {
            fetch('/api/cart', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({id: ${id}}) })
              .then(() => location.reload());
          }
        </script>
      </body>
      </html>
    `);
  }
});

app.get('/cart', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Cart - E-Commerce Store</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .header { background: #333; color: white; padding: 20px; margin: -20px -20px 20px -20px; }
        .cart-container { background: white; padding: 30px; border-radius: 8px; max-width: 800px; margin: 0 auto; }
        .cart-item { display: flex; justify-content: space-between; padding: 20px; border-bottom: 1px solid #eee; }
        .discount-section { background: #f8f9fa; padding: 20px; border-radius: 4px; margin: 20px 0; }
        .discount-section input { padding: 10px; margin-right: 10px; border: 1px solid #ddd; border-radius: 4px; }
        .apply-btn { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
        .checkout-btn { background: #28a745; color: white; padding: 15px 30px; border: none; border-radius: 4px; font-size: 16px; cursor: pointer; width: 100%; margin-top: 20px; }
        .checkout-btn:hover { background: #218838; }
        .back-btn { background: #6c757d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin-bottom: 20px; }
        .discount-message { color: #28a745; margin-top: 10px; }
        .total-section { border-top: 2px solid #007bff; padding-top: 20px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Shopping Cart</h1>
      </div>
      
      <a href="/" class="back-btn">← Continue Shopping</a>
      
      <div class="cart-container">
        <h2>Your Cart</h2>
        <div class="cart-item">
          <div>
            <h3>Gaming Laptop</h3>
            <p>High performance gaming laptop</p>
          </div>
          <div>$999</div>
        </div>
        
        <div class="discount-section">
          <h3>Discount Code</h3>
          <input name="discountCode" placeholder="Enter discount code">
          <button class="apply-btn" onclick="applyDiscount()">Apply</button>
          <div data-testid="discount-message" class="discount-message" style="display:none">10% discount applied</div>
        </div>
        
        <div class="total-section">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span>Subtotal:</span>
            <span>$999</span>
          </div>
          <div data-testid="discount-amount" style="display:none; color: #28a745; display: flex; justify-content: space-between;">
            <span>Discount:</span>
            <span>-$99</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; border-top: 1px solid #ddd; padding-top: 10px;">
            <span>Total:</span>
            <span id="total">$999</span>
          </div>
        </div>
        
        <p><strong>Items in cart: ${cart.length}</strong></p>
        <button class="checkout-btn" onclick="location.href='/checkout'">Proceed to Checkout</button>
      </div>
      
      <script>
        function applyDiscount() {
          const code = document.querySelector('[name="discountCode"]').value;
          if (code === 'SAVE10') {
            document.querySelector('[data-testid="discount-amount"]').style.display = 'flex';
            document.querySelector('[data-testid="discount-message"]').style.display = 'block';
            document.getElementById('total').textContent = '$900';
          }
        }
      </script>
    </body>
    </html>
  `);
});

app.get('/checkout', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Checkout - E-Commerce Store</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .header { background: #333; color: white; padding: 20px; margin: -20px -20px 20px -20px; }
        .checkout-container { background: white; padding: 30px; border-radius: 8px; max-width: 600px; margin: 0 auto; }
        .form-section { margin-bottom: 30px; padding: 20px; border: 1px solid #eee; border-radius: 4px; }
        .form-section h3 { margin-top: 0; color: #333; }
        .form-row { display: flex; gap: 15px; margin-bottom: 15px; }
        .form-row input, .form-row select { flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 4px; }
        .place-order-btn { background: #28a745; color: white; padding: 15px 30px; border: none; border-radius: 4px; font-size: 16px; cursor: pointer; width: 100%; margin-top: 20px; }
        .place-order-btn:hover { background: #218838; }
        .back-btn { background: #6c757d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin-bottom: 20px; }
        .order-summary { background: #f8f9fa; padding: 20px; border-radius: 4px; margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Checkout</h1>
      </div>
      
      <a href="/cart" class="back-btn">← Back to Cart</a>
      
      <div class="checkout-container">
        <div class="order-summary">
          <h3>Order Summary</h3>
          <div style="display: flex; justify-content: space-between;">
            <span>Gaming Laptop</span>
            <span>$999</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-weight: bold; border-top: 1px solid #ddd; padding-top: 10px; margin-top: 10px;">
            <span>Total:</span>
            <span>$999</span>
          </div>
        </div>
        
        <form onsubmit="placeOrder(event)">
          <div class="form-section">
            <h3>Shipping Information</h3>
            <div class="form-row">
              <input name="fullName" placeholder="Full Name" required>
              <input name="email" type="email" placeholder="Email" required>
            </div>
            <div class="form-row">
              <input name="address" placeholder="Address" required style="flex: 2;">
            </div>
            <div class="form-row">
              <input name="city" placeholder="City" required>
              <input name="zipCode" placeholder="Zip Code" required>
            </div>
            <div class="form-row">
              <select name="country" required>
                <option value="">Select Country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="UK">United Kingdom</option>
              </select>
            </div>
          </div>
          
          <div class="form-section">
            <h3>Payment Information</h3>
            <div class="form-row">
              <input name="cardNumber" placeholder="Card Number" required>
              <input name="cardName" placeholder="Name on Card" required>
            </div>
            <div class="form-row">
              <input name="expiryDate" placeholder="MM/YY" required>
              <input name="cvv" placeholder="CVV" required>
            </div>
          </div>
          
          <button type="submit" class="place-order-btn">Place Order</button>
        </form>
      </div>
      
      <script>
        function placeOrder(e) {
          e.preventDefault();
          window.location.href = '/order-confirmation';
        }
      </script>
    </body>
    </html>
  `);
});

app.get('/order-confirmation', (req, res) => {
  const orderNum = `ORDER-${orderNumber++}`;
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Order Confirmed - E-Commerce Store</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .header { background: #333; color: white; padding: 20px; margin: -20px -20px 20px -20px; }
        .confirmation-container { background: white; padding: 40px; border-radius: 8px; max-width: 600px; margin: 0 auto; text-align: center; }
        .success-icon { font-size: 60px; color: #28a745; margin-bottom: 20px; }
        .order-number { background: #f8f9fa; padding: 15px; border-radius: 4px; font-family: monospace; font-size: 18px; margin: 20px 0; }
        .order-details { text-align: left; background: #f8f9fa; padding: 20px; border-radius: 4px; margin: 20px 0; }
        .home-btn { background: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 20px; }
        .home-btn:hover { background: #0056b3; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Order Confirmation</h1>
      </div>
      
      <div class="confirmation-container">
        <div class="success-icon">✅</div>
        <h1>Order Confirmed</h1>
        <p>Thank you for your order! Your purchase has been processed successfully.</p>
        
        <div class="order-number">
          Order Number: <span data-testid="order-number">${orderNum}</span>
        </div>
        
        <div class="order-details">
          <h3>Order Summary:</h3>
          <div style="display: flex; justify-content: space-between; margin: 10px 0;">
            <span>Gaming Laptop</span>
            <span>$999</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-weight: bold; border-top: 1px solid #ddd; padding-top: 10px; margin-top: 10px;">
            <span>Total:</span>
            <span>$999</span>
          </div>
        </div>
        
        <p>You will receive an email confirmation shortly with your order details and tracking information.</p>
        
        <a href="/" class="home-btn">Continue Shopping</a>
      </div>
    </body>
    </html>
  `);
});

app.post('/api/cart', (req, res) => {
  cart.push(req.body);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Mock e-commerce server running on http://localhost:${PORT}`);
});