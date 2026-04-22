import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      // Navigation
      home: 'Home',
      products: 'Products',
      services: 'Services',
      about: 'About',
      contact: 'Contact',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      profile: 'Profile',
      cart: 'Cart',
      wishlist: 'Wishlist',

      // Home page
      welcome: 'Welcome to Capital IT Solution',
      featured_products: 'Featured Products',
      best_selling: 'Best Selling',
      categories: 'Categories',
      mobile: 'Mobile',
      laptop: 'Laptop',
      cctv: 'CCTV',
      accessories: 'Accessories',

      // Product related
      search_products: 'Search Products',
      price: 'Price',
      brand: 'Brand',
      rating: 'Rating',
      add_to_cart: 'Add to Cart',
      add_to_wishlist: 'Add to Wishlist',
      specifications: 'Specifications',
      reviews: 'Reviews',
      stock_available: 'In Stock',
      out_of_stock: 'Out of Stock',
      write_review: 'Write a Review',

      // Cart & Checkout
      shopping_cart: 'Shopping Cart',
      checkout: 'Checkout',
      total: 'Total',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      payment_method: 'Payment Method',
      cash_on_delivery: 'Cash on Delivery',
      esewa: 'eSewa',
      khalti: 'Khalti',
      bank_transfer: 'Bank Transfer',
      place_order: 'Place Order',

      // Services
      it_services: 'IT Services',
      service_booking: 'Service Booking',
      computer_repair: 'Computer Repair',
      cctv_installation: 'CCTV Installation',
      network_setup: 'Network Setup',
      website_development: 'Website Development',
      software_development: 'Software Development',
      printer_repair: 'Printer Repair',
      submit_request: 'Submit Request',
      inquiry_form: 'Inquiry Form',
      send_inquiry: 'Send Inquiry',
      need_help: 'Need Help?',

      // User account
      my_orders: 'My Orders',
      order_history: 'Order History',
      account_settings: 'Account Settings',
      change_password: 'Change Password',

      // Admin
      admin_panel: 'Admin Panel',
      dashboard: 'Dashboard',
      manage_products: 'Manage Products',
      manage_categories: 'Manage Categories',
      manage_orders: 'Manage Orders',
      manage_users: 'Manage Users',
      service_requests: 'Service Requests',
      inquiries: 'Inquiries',

      // Common
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      message: 'Message',
      submit: 'Submit',
      close: 'Close',

      // Wishlist
      wishlist_empty: 'Your wishlist is empty',
      wishlist_empty_message: 'Add some products to your wishlist to see them here',
      start_shopping: 'Start Shopping',

      // Services
      book_now: 'Book Now',
      view_services: 'View Services',

      // Checkout
      shipping_information: 'Shipping Information'
    }
  },
  np: {
    translation: {
      // Navigation
      home: 'गृहपृष्ठ',
      products: 'उत्पादनहरू',
      services: 'सेवाहरू',
      about: 'हाम्रो बारेमा',
      contact: 'सम्पर्क',
      login: 'लगइन',
      register: 'दर्ता',
      logout: 'लगआउट',
      profile: 'प्रोफाइल',
      cart: 'कार्ट',
      wishlist: 'इच्छासूची',

      // Home page
      welcome: 'क्यापिटल आईटी सोलुसनमा स्वागत छ',
      featured_products: 'विशेष उत्पादनहरू',
      best_selling: 'सर्वाधिक बिक्री हुने',
      categories: 'कोटिहरू',
      mobile: 'मोबाइल',
      laptop: 'ल्यापटप',
      cctv: 'सीसीटीभी',
      accessories: 'एक्सेसorizहरू',

      // Product related
      search_products: 'उत्पादनहरू खोज्नुहोस्',
      price: 'मूल्य',
      brand: 'ब्रान्ड',
      rating: 'रेटिङ',
      add_to_cart: 'कार्टमा राख्नुहोस्',
      add_to_wishlist: 'इच्छासूचीमा राख्नुहोस्',
      specifications: 'विवरणहरू',
      reviews: 'समीक्षाहरू',
      stock_available: 'स्टक उपलब्ध',
      out_of_stock: 'स्टक सकियो',
      write_review: 'समीक्षा लेख्नुहोस्',

      // Cart & Checkout
      shopping_cart: 'किनमेल कार्ट',
      checkout: 'चेकआउट',
      total: 'कुल',
      subtotal: 'उप-कुल',
      shipping: 'ढुवानी',
      payment_method: 'भुक्तानी विधि',
      cash_on_delivery: 'डेलिभरीमा नगद',
      esewa: 'ईसेवा',
      khalti: 'खल्ती',
      bank_transfer: 'बैंक ट्रान्सफर',
      place_order: 'अर्डर गर्नुहोस्',

      // Services
      it_services: 'आईटी सेवाहरू',
      service_booking: 'सेवा बुकिङ',
      computer_repair: 'कम्प्युटर मर्मत',
      cctv_installation: 'सीसीटीभी स्थापना',
      network_setup: 'नेटवर्क सेटअप',
      website_development: 'वेबसाइट विकास',
      software_development: 'सफ्टवेयर विकास',
      printer_repair: 'प्रिन्टर मर्मत',
      submit_request: 'अनुरोध पेस गर्नुहोस्',
      inquiry_form: 'जिज्ञासा फारम',
      send_inquiry: 'जिज्ञासा पठाउनुहोस्',
      need_help: 'सहयोग चाहियो?',

      // User account
      my_orders: 'मेरो अर्डरहरू',
      order_history: 'अर्डर इतिहास',
      account_settings: 'खाता सेटिङहरू',
      change_password: 'पासवर्ड परिवर्तन गर्नुहोस्',

      // Admin
      admin_panel: 'एडमिन प्यानल',
      dashboard: 'ड्यासबोर्ड',
      manage_products: 'उत्पादनहरू व्यवस्थापन गर्नुहोस्',
      manage_categories: 'कोटिहरू व्यवस्थापन गर्नुहोस्',
      manage_orders: 'अर्डरहरू व्यवस्थापन गर्नुहोस्',
      manage_users: 'प्रयोगकर्ताहरू व्यवस्थापन गर्नुहोस्',
      service_requests: 'सेवा अनुरोधहरू',
      inquiries: 'जिज्ञासाहरू',

      // Common
      loading: 'लोड हुँदैछ...',
      error: 'त्रुटि',
      success: 'सफलता',
      save: 'सुरक्षित गर्नुहोस्',
      cancel: 'रद्द गर्नुहोस्',
      delete: 'मेटाउनुहोस्',
      edit: 'सम्पादन गर्नुहोस्',
      view: 'हेर्नुहोस्',
      search: 'खोज्नुहोस्',
      filter: 'फिल्टर',
      sort: 'क्रमबद्ध गर्नुहोस्',
      name: 'नाम',
      email: 'इमेल',
      phone: 'फोन',
      address: 'ठेगाना',
      message: 'सन्देश',
      submit: 'पेस गर्नुहोस्',
      close: 'बन्द गर्नुहोस्',

      // Wishlist
      wishlist_empty: 'तपाईको इच्छासूची खाली छ',
      wishlist_empty_message: 'यहाँ देखाउनका लागि आफ्नो इच्छासूचीमा केही उत्पादनहरू थप्नुहोस्',
      start_shopping: 'किनमेल सुरु गर्नुहोस्',

      // Services
      book_now: 'अहिले बुक गर्नुहोस्',
      view_services: 'सेवाहरू हेर्नुहोस्',

      // Checkout
      shipping_information: 'ढुवानी जानकारी'
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n