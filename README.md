# Capital IT Solution - E-commerce Platform

A comprehensive e-commerce platform built with React, Node.js, and MySQL for Capital IT Solution, featuring both product sales and IT services.

## Features

### User Features
- 🛒 Product browsing with advanced filters (price, brand, rating, category)
- 🔍 Product search functionality
- 📦 Shopping cart and wishlist
- 💳 Multiple payment methods (Cash on Delivery, eSewa, Khalti, Bank Transfer)
- 📋 Order tracking and history
- 👤 User registration and authentication
- ⭐ Product reviews and ratings
- 🌙 Dark mode support
- 🌐 Multi-language support (English/Nepali)

### IT Services
- 🛠️ Service booking for computer repair, CCTV installation, network setup, etc.
- 📝 Inquiry form for custom requests
- 📞 Live chat/WhatsApp support integration

### Admin Panel
- 📊 Dashboard with sales analytics
- 📦 Product and category management
- 📋 Order management
- 👥 Customer management
- 🔧 Service request management
- 📧 Inquiry management

## Tech Stack

- **Frontend**: React 19, Material-UI, React Router, Axios, i18next
- **Backend**: Node.js, Express.js, JWT Authentication
- **Database**: MySQL
- **Styling**: Material-UI with dark mode support

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MySQL Workbench or MySQL Server
- Git

### 1. Database Setup

1. Open MySQL Workbench
2. Create a new connection or use existing one
3. Run the SQL script from `server/database.sql` to create the database and tables
4. Update the database credentials in `server/.env` if needed

### 2. Backend Setup

```bash
cd server
npm install
# Update .env file with your database credentials
npm run dev  # For development
# or
npm start    # For production
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

### 4. Environment Configuration

Update `server/.env` with your configuration:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=capitalitsolution
JWT_SECRET=your_jwt_secret_key
PORT=5000
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

## Project Structure

```
capitalitsolution/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable components
│   │   ├── Navbar.jsx      # Navigation bar
│   │   └── Footer.jsx      # Footer component
│   ├── context/            # React contexts
│   │   ├── AuthContext.jsx # Authentication context
│   │   └── CartContext.jsx # Shopping cart context
│   ├── pages/              # Page components
│   │   ├── Home.jsx        # Home page
│   │   ├── Products.jsx    # Product listing
│   │   ├── ProductDetails.jsx # Product details
│   │   ├── Cart.jsx        # Shopping cart
│   │   ├── Checkout.jsx    # Checkout process
│   │   ├── Login.jsx       # User login
│   │   ├── Register.jsx    # User registration
│   │   ├── Profile.jsx     # User profile
│   │   ├── Orders.jsx      # Order history
│   │   ├── Services.jsx    # IT services
│   │   ├── ServiceBooking.jsx # Service booking
│   │   ├── Wishlist.jsx    # User wishlist
│   │   └── admin/          # Admin pages
│   │       ├── Dashboard.jsx
│   │       ├── Products.jsx
│   │       ├── Orders.jsx
│   │       └── Users.jsx
│   ├── i18n.js             # Internationalization config
│   ├── App.jsx             # Main app component
│   └── main.jsx            # App entry point
├── server/                 # Backend server
│   ├── routes/             # API routes
│   │   ├── auth.js         # Authentication routes
│   │   ├── products.js     # Product routes
│   │   ├── orders.js       # Order/Cart routes
│   │   ├── services.js     # Service routes
│   │   ├── users.js        # User routes
│   │   └── admin.js        # Admin routes
│   ├── database.sql        # Database schema
│   ├── .env                # Environment variables
│   ├── server.js           # Main server file
│   └── package.json
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get products with filters
- `GET /api/products/:id` - Get product details
- `GET /api/products/featured` - Get featured products
- `GET /api/products/best-selling` - Get best selling products
- `POST /api/products/:id/reviews` - Add product review

### Orders & Cart
- `GET /api/orders/cart` - Get cart items
- `POST /api/orders/cart` - Add to cart
- `PUT /api/orders/cart/:product_id` - Update cart item
- `DELETE /api/orders/cart/:product_id` - Remove from cart
- `GET /api/orders/wishlist` - Get wishlist
- `POST /api/orders/wishlist` - Add to wishlist
- `DELETE /api/orders/wishlist/:product_id` - Remove from wishlist
- `POST /api/orders/checkout` - Place order
- `GET /api/orders/orders` - Get user orders

### Services
- `GET /api/services` - Get all services
- `POST /api/services/request` - Submit service request
- `POST /api/services/inquiry` - Submit inquiry

### Admin (Requires admin authentication)
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/products` - Manage products
- `GET /api/admin/orders` - Manage orders
- `GET /api/admin/users` - Manage users
- `GET /api/admin/service-requests` - Manage service requests

## Default Admin Account

- Email: admin@capitalit.com
- Password: password

## Features in Development

- [ ] Payment gateway integration (eSewa, Khalti)
- [ ] Live chat system
- [ ] WhatsApp integration
- [ ] Email notifications
- [ ] Order tracking with real-time updates
- [ ] Advanced analytics dashboard
- [ ] Inventory management system
- [ ] Multi-vendor support
- [ ] Mobile app

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email info@capitalitsolution.com or contact us through the website.
