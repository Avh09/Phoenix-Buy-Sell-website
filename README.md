# Phoenix-Buy-Sell-website for IIITH community

Welcome to **Buy, Sell @ IIITH** — a full-stack MERN marketplace web app built exclusively for the IIIT community. This app allows users to buy and sell items within the campus ecosystem, avoiding 3rd-party profits or platform taxes.

---

##  Tech Stack

- **MongoDB** – Database
- **Express.js** – Backend REST API framework
- **React.js** – Frontend (Any React-based framework)
- **Node.js** – Server runtime

---

##  User Roles

Each logged-in user can play both **Buyer** and **Seller** roles.


---

##  Authentication & Authorization

-  **Registration Page** with required fields
-  **Login Page** leading to Profile
-  **Persistent Login** (token remains active across sessions)
-  **Logout Option**
-  **Token-Based Route Protection** using JWT
-  **Hashed Passwords** via bcrypt
-  **(Bonus)** Google ReCAPTCHA or LibreCaptcha

---

##  Features & Use Cases

### 1. Dashboard

-  Global Navbar across pages
-  **Profile Page** with editable user details

### 2. Search Items Page

-  Search bar (case-insensitive)
-  Category-based filters (multi-select)
-  View all items if no filters/search are applied
-  Click item to view its dedicated item page

### 3. Item Details Page

-  Item description, name, price, seller
-  **Add to Cart** button updates My Cart accordingly

### 4. Orders History

-  Pending Orders (with OTP for delivery)
-  Previously bought items
-  Previously sold items  
*Tabbed UI for each category*

### 5. Deliver Items Page

-  Sellers can view all incoming orders
-  Verify OTP from buyer to complete a sale
-  Error prompt for incorrect OTP
-  Successful transactions update buyer’s and seller’s order pages

### 6. My Cart

-  All items added by the user
-  Remove item option
-  Total cost summary
-  **Final Order** button to place orders (updates history and seller view)
-  OTP generated (stored as hashed) for delivery validation

### 7. Support Chatbot ( Bonus)

-  Integrated AI chatbot (ChatGPT, Gemini, etc.) using third-party APIs
-  Chat UI simulating Flipkart/Swiggy support
-  Session memory to maintain context

---

##  Routing Rules

All major pages must correspond to **unique URLs**.  
Pages must load independently when URLs are directly accessed (no dependency on previous navigation).

---



##  Developer Notes

- Use `bcrypt` for hashing passwords.
- Use `jsonwebtoken` (JWT) for user session tokens.
- Store OTPs in hashed form.
- Maintain clean, modular code structure (models, routes, controllers, etc.).
- Include `.env` for sensitive keys (JWT_SECRET, DB_URI, etc.).
- Validate IIIT email format strictly (e.g., `@iiit.ac.in` domain).

---

##  Testing

Test workflows for:

- Auth (Login, Logout, Token expiry)
- Search and Filter functionality
- OTP Validation and Transaction Closure
- Role switching between Buyer and Seller
- Chatbot interaction and session continuity

---

##  Setup Instructions

```bash
# Clone the repo
git clone https://github.com/yourusername/iiith-buy-sell.git
cd iiith-buy-sell

# Backend Setup
cd backend
npm install
npm start

# Frontend Setup
cd ../frontend
npm install
npm start
