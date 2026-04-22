# Cloudinary Integration Setup Guide

## Step 1: Create Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Go to your Dashboard and copy:
   - Cloud Name
   - API Key
   - API Secret

## Step 2: Update Environment Variables

### Backend (.env file in `/server`)
Create or update `.env` file in the server folder with:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Step 3: Create Upload Preset in Cloudinary Dashboard

1. Go to Settings → Upload
2. Create a new Upload Preset with these settings:
   - **Preset Name:** `capitalit_preset`
   - **Unsigned:** Toggle ON (for frontend widget to work)
   - **Allowed Formats:** jpg, png, gif, webp
   - **Max File Size:** 5242880 bytes (5MB)
   - **Folder:** capitalit
   - **Auto Tagging:** Enable if needed
   - Save

## Step 4: Install Dependencies

### Backend
```bash
cd server
npm install cloudinary
npm install
```

### Frontend
```bash
npm install cloudinary-react
npm install
```

## Step 5: Usage Examples

### In React Components (Frontend)

**Example 1: Basic Product Upload**
```jsx
import CloudinaryUpload from './components/CloudinaryUpload';

function ProductForm() {
  const [images, setImages] = useState([]);

  const handleImageUpload = (result) => {
    setImages([...images, {
      url: result.secure_url,
      publicId: result.public_id
    }]);
  };

  return (
    <div>
      <CloudinaryUpload 
        onUpload={handleImageUpload}
        multiple={true}
      />
      <div>
        {images.map((img, idx) => (
          <img key={idx} src={img.url} alt="preview" />
        ))}
      </div>
    </div>
  );
}
```

**Example 2: Using Cloudinary React Components**
```jsx
import { CloudinaryContext, Image } from 'cloudinary-react';

function ProductImage({ publicId }) {
  return (
    <CloudinaryContext cloudName="your_cloud_name">
      <Image 
        publicId={publicId}
        width="300"
        crop="fill"
        quality="auto"
        fetch_format="auto"
      />
    </CloudinaryContext>
  );
}
```

### In Backend (Server)

**Example: Store image URL in database**
```javascript
const { uploadToCloudinary } = require('../utils/cloudinaryUpload');

const createProduct = async (req, res) => {
  try {
    const { name, price, images } = req.body;
    
    // images should be array of { url, publicId } from Cloudinary
    
    const [result] = await db.execute(
      'INSERT INTO products (name, price, images) VALUES (?, ?, ?)',
      [name, price, JSON.stringify(images)]
    );

    res.status(201).json({ 
      message: 'Product created successfully',
      product_id: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
```

**Example: Delete image from Cloudinary**
```javascript
const { deleteFromCloudinary } = require('../utils/cloudinaryUpload');

const deleteProduct = async (req, res) => {
  try {
    // Get product and its images
    const [products] = await db.execute(
      'SELECT images FROM products WHERE id = ?',
      [req.params.id]
    );

    if (products.length > 0) {
      const images = JSON.parse(products[0].images || '[]');
      
      // Delete all images from Cloudinary
      for (const img of images) {
        await deleteFromCloudinary(img.publicId);
      }
    }

    // Delete product from database
    await db.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
```

## Step 6: Database Update

Update your products table to store images as JSON:
```sql
ALTER TABLE products MODIFY images JSON DEFAULT NULL;
ALTER TABLE services MODIFY images JSON DEFAULT NULL;
```

## Image Response Format

When an image is uploaded through Cloudinary, you'll receive:
```javascript
{
  secure_url: "https://res.cloudinary.com/your_cloud/image/upload/v1234567890/capitalit/xyz.jpg",
  public_id: "capitalit/xyz",
  width: 1024,
  height: 768,
  format: "jpg"
}
```

Store it as:
```javascript
{
  url: "https://res.cloudinary.com/your_cloud/image/upload/v1234567890/capitalit/xyz.jpg",
  publicId: "capitalit/xyz"
}
```

## Features Available

✅ Automatic image optimization
✅ Responsive image delivery
✅ Automatic format conversion (webp, jpg, etc.)
✅ Image cropping and transformation
✅ Folder organization
✅ CDN delivery globally
✅ Free tier: 25 GB storage, 25 GB bandwidth

## Troubleshooting

1. **Widget not opening:** Check if Cloudinary script is loaded in index.html
2. **Upload fails:** Verify upload preset is set to "Unsigned"
3. **Images not loading:** Check Cloud Name and public_id format
4. **Slow uploads:** Ensure quality optimization is enabled in preset

## API Endpoints

- `POST /api/cloudinary/signature` - Get upload signature for widget

## Files Created

- `/server/config/cloudinary.js` - Cloudinary configuration
- `/server/utils/cloudinaryUpload.js` - Upload utility functions
- `/server/routes/cloudinary.js` - Cloudinary API routes
- `/src/components/CloudinaryUpload.jsx` - React component for file picker
- `/server/.env.example` - Environment variables template
