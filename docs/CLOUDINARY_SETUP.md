# ☁️ Cloudinary Image Upload Setup Guide

## Overview

Images are now uploaded to **Cloudinary** instead of local storage. This provides:

- ✅ Automatic CDN delivery
- ✅ Image optimization & transformation
- ✅ Secure cloud storage
- ✅ No server disk space usage

---

## 🔗 How Images Connect to Jobs

Images are linked to jobs through the database:

### Workflow:

```
1. User creates a job → POST /api/jobs
   Response: { "id": 5, "title": "Lawn Mowing", ... }

2. User uploads images → POST /api/jobs/5/images
   (uploads to Cloudinary, saves URLs in database)

3. Images are stored with job_id = 5

4. When viewing job → GET /api/jobs/5
   Response includes images array with Cloudinary URLs
```

### Database Relationship:

```sql
images table:
- id (primary key)
- job_id (foreign key → jobs.id)
- image_url (Cloudinary URL)
- is_primary (boolean)
- created_at (timestamp)
```

---

## 🚀 Setup Cloudinary Account

### 1. Create Free Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for free account
3. Get your credentials from Dashboard

### 2. Get Credentials

After logging in, you'll see:

- **Cloud Name**: `your-cloud-name`
- **API Key**: `123456789012345`
- **API Secret**: `abcdefghijklmnopqrstuvwxyz123`

---

## ⚙️ Configuration

### 1. Update .env File

Add these variables to your `.env` file:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123
```

Replace with your actual credentials from Cloudinary dashboard.

### 2. Environment Variables Explained

| Variable                | Description                | Example           |
| ----------------------- | -------------------------- | ----------------- |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | `my-app-cloud`    |
| `CLOUDINARY_API_KEY`    | API key from dashboard     | `123456789012345` |
| `CLOUDINARY_API_SECRET` | API secret (keep private!) | `abc123xyz456`    |

---

## 📸 Image Upload Features

### Automatic Features:

- ✅ **Folder Organization**: All images stored in `pocket-money-jobs/` folder
- ✅ **Format Validation**: Only JPG, JPEG, PNG, GIF, WebP allowed
- ✅ **Size Limit**: 5MB per image (configurable)
- ✅ **Image Optimization**: Auto-resized to max 1000x1000px
- ✅ **Unique Names**: Timestamped filenames prevent conflicts
- ✅ **Primary Image**: First uploaded image set as primary

### Storage Configuration:

```typescript
folder: 'pocket-money-jobs'           // Cloudinary folder
allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp']
transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
max_file_size: 5MB (5242880 bytes)
max_files_per_upload: 5
```

---

## 🔌 API Endpoints

### Upload Images for a Job

```http
POST /api/jobs/:jobId/images
Authorization: Bearer {your_jwt_token}
Content-Type: multipart/form-data

Form Data:
  images: [file1.jpg, file2.png, file3.jpg]
```

**cURL Example:**

```bash
curl -X POST http://localhost:5000/api/jobs/5/images \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "images=@photo1.jpg" \
  -F "images=@photo2.jpg" \
  -F "images=@photo3.jpg"
```

**JavaScript/Fetch Example:**

```javascript
const formData = new FormData();
formData.append('images', file1);
formData.append('images', file2);
formData.append('images', file3);

fetch('http://localhost:5000/api/jobs/5/images', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
})
  .then((res) => res.json())
  .then((data) => console.log(data));
```

**React Example:**

```jsx
const handleImageUpload = async (jobId, files) => {
  const formData = new FormData();

  // Add multiple files
  Array.from(files).forEach((file) => {
    formData.append('images', file);
  });

  const response = await fetch(`/api/jobs/${jobId}/images`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: formData,
  });

  const data = await response.json();
  console.log('Uploaded images:', data.data);
};

// Usage in component:
<input
  type="file"
  multiple
  accept="image/*"
  onChange={(e) => handleImageUpload(jobId, e.target.files)}
/>;
```

### Get Job Images

```http
GET /api/jobs/:jobId/images
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "job_id": 5,
      "image_url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567/pocket-money-jobs/job-1234567890.jpg",
      "is_primary": true,
      "created_at": "2025-12-29T10:00:00Z"
    },
    {
      "id": 2,
      "job_id": 5,
      "image_url": "https://res.cloudinary.com/your-cloud/image/upload/v1234568/pocket-money-jobs/job-1234567891.jpg",
      "is_primary": false,
      "created_at": "2025-12-29T10:00:05Z"
    }
  ]
}
```

### Delete Image

```http
DELETE /api/jobs/:jobId/images/:imageId
Authorization: Bearer {your_jwt_token}
```

**Note:** Deletes from both database AND Cloudinary.

### Set Primary Image

```http
PATCH /api/jobs/:jobId/images/:imageId/primary
Authorization: Bearer {your_jwt_token}
```

---

## 🎨 Using Images in React Frontend

### Display Job Image:

```jsx
const JobCard = ({ job }) => (
  <div className="job-card">
    <img
      src={job.images?.[0]?.image_url}
      alt={job.title}
      onError={(e) => (e.target.src = '/placeholder.jpg')}
    />
    <h3>{job.title}</h3>
    <p>${job.price}</p>
  </div>
);
```

### Display All Images (Gallery):

```jsx
const JobImages = ({ images }) => (
  <div className="image-gallery">
    {images?.map((image) => (
      <img
        key={image.id}
        src={image.image_url}
        alt="Job image"
        className={image.is_primary ? 'primary' : ''}
      />
    ))}
  </div>
);
```

### Cloudinary Transformations (Optional):

You can apply transformations directly in the URL:

```jsx
// Original
const url =
  'https://res.cloudinary.com/demo/image/upload/v1234/pocket-money-jobs/job-123.jpg';

// Thumbnail (200x200)
const thumb = url.replace('/upload/', '/upload/w_200,h_200,c_fill/');

// Grayscale
const gray = url.replace('/upload/', '/upload/e_grayscale/');

// Quality 80%
const optimized = url.replace('/upload/', '/upload/q_80/');
```

---

## 🔒 Security

### Access Control:

- ✅ Only job owner can upload images
- ✅ Only job owner can delete images
- ✅ Anyone can view images (public URLs)
- ✅ JWT authentication required for upload/delete

### Image Validation:

- ✅ File type validation (images only)
- ✅ File size limit (5MB default)
- ✅ Max 5 images per upload
- ✅ Malicious file detection

---

## 📊 Complete Job Creation Workflow

### Frontend Flow:

```javascript
// Step 1: Create job
const createJob = async (jobData) => {
  const response = await fetch('/api/jobs', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(jobData),
  });

  const result = await response.json();
  return result.data; // { id: 5, title: "...", ... }
};

// Step 2: Upload images
const uploadImages = async (jobId, files) => {
  const formData = new FormData();
  Array.from(files).forEach((file) => {
    formData.append('images', file);
  });

  const response = await fetch(`/api/jobs/${jobId}/images`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return await response.json();
};

// Step 3: Use together
const handleJobSubmit = async (jobData, imageFiles) => {
  try {
    // Create job
    const job = await createJob(jobData);

    // Upload images if any
    if (imageFiles.length > 0) {
      await uploadImages(job.id, imageFiles);
    }

    console.log('Job created successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## 🧪 Testing

### Test Image Upload with Postman:

1. Create a job (POST /api/jobs)
2. Copy the job ID from response
3. Create new request: POST /api/jobs/{jobId}/images
4. Set Authorization header: Bearer {token}
5. Body → form-data
6. Add key "images" (type: File)
7. Select multiple image files
8. Send request

### Test with cURL:

```bash
# Upload single image
curl -X POST http://localhost:5000/api/jobs/5/images \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "images=@./photo.jpg"

# Upload multiple images
curl -X POST http://localhost:5000/api/jobs/5/images \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "images=@./photo1.jpg" \
  -F "images=@./photo2.jpg" \
  -F "images=@./photo3.jpg"
```

---

## ❓ Troubleshooting

### "Invalid credentials" error:

- Check your Cloudinary credentials in .env
- Make sure there are no extra spaces
- Verify credentials match your Cloudinary dashboard

### "File too large" error:

- Max size is 5MB per image
- Reduce image size or increase MAX_FILE_SIZE in .env

### Images not appearing:

- Check if image_url is a valid Cloudinary URL
- Verify CORS settings if loading from different domain
- Check browser console for errors

### TypeScript build errors:

- Run `npm run build` to check for errors
- Type declaration file should be at `src/types/multer-storage-cloudinary.d.ts`

---

## 📝 Summary

**What Changed:**

- ❌ Before: Images saved to `./uploads/` folder locally
- ✅ Now: Images uploaded to Cloudinary cloud storage

**Benefits:**

- Images accessible from anywhere via CDN
- Automatic image optimization
- No server storage needed
- Better performance with CDN delivery

**Required Setup:**

1. Create Cloudinary account (free)
2. Add credentials to .env file
3. That's it! Upload endpoints work automatically

**Image-Job Relationship:**

- Images linked via `job_id` in database
- Upload: `POST /api/jobs/{jobId}/images`
- View: Included in job details response
- First image automatically set as primary
