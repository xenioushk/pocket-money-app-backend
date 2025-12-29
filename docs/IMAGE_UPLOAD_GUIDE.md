# 📸 Image Upload - Quick Reference

## How Images Connect to Jobs

```
Job Creation → Upload Images → Images Saved with job_id
```

### Database Relationship:

```
jobs table:          images table:
+----+-------+       +----+--------+-----------+------------+
| id | title |       | id | job_id | image_url | is_primary |
+----+-------+       +----+--------+-----------+------------+
| 5  | Lawn  |  ←──  | 1  |   5    | https://  |    true    |
+----+-------+       | 2  |   5    | https://  |    false   |
                     +----+--------+-----------+------------+
```

## API Workflow

### 1. Create Job (get job ID)

```bash
POST /api/jobs
{
  "title": "Lawn Mowing",
  "description": "...",
  "category_id": 1,
  "price": 25,
  "city": "Boston",
  "date": "2025-12-30"
}

Response: { "data": { "id": 5, ... } }
```

### 2. Upload Images (using job ID)

```bash
POST /api/jobs/5/images
Content-Type: multipart/form-data
Authorization: Bearer {token}

images: [file1.jpg, file2.jpg, file3.jpg]
```

### 3. View Job with Images

```bash
GET /api/jobs/5

Response:
{
  "data": {
    "id": 5,
    "title": "Lawn Mowing",
    "images": [
      {
        "id": 1,
        "image_url": "https://res.cloudinary.com/...",
        "is_primary": true
      }
    ]
  }
}
```

## React Example

```jsx
// Step 1: Create job and upload images together
const handleJobSubmit = async (formData, imageFiles) => {
  // 1. Create job
  const jobResponse = await fetch('/api/jobs', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  const job = await jobResponse.json();
  const jobId = job.data.id;

  // 2. Upload images
  if (imageFiles.length > 0) {
    const formData = new FormData();
    imageFiles.forEach((file) => {
      formData.append('images', file);
    });

    await fetch(`/api/jobs/${jobId}/images`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  }
};

// Usage:
<form
  onSubmit={(e) => {
    e.preventDefault();
    handleJobSubmit(jobData, selectedImages);
  }}
>
  <input
    type="file"
    multiple
    accept="image/*"
    onChange={(e) => setSelectedImages(Array.from(e.target.files))}
  />
  <button type="submit">Create Job</button>
</form>;
```

## Cloudinary Setup (Required)

### 1. Get Credentials

- Go to [cloudinary.com](https://cloudinary.com)
- Sign up (free)
- Copy: Cloud Name, API Key, API Secret

### 2. Add to .env

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 3. Done!

Images now upload to Cloudinary automatically.

## Key Features

✅ **Auto-linked to jobs** via job_id
✅ **Cloudinary storage** (not local files)
✅ **CDN delivery** (fast loading)
✅ **Auto-optimization** (1000x1000 max)
✅ **Format validation** (JPG, PNG, GIF, WebP)
✅ **Size limit** (5MB per image)
✅ **Max 5 images** per upload
✅ **Primary image** (first = primary)
✅ **Owner-only** upload/delete

## Common Operations

### Display Primary Image

```jsx
<img src={job.images?.[0]?.image_url} alt={job.title} />
```

### Display All Images

```jsx
{
  job.images?.map((img) => <img key={img.id} src={img.image_url} />);
}
```

### Delete Image

```javascript
await fetch(`/api/jobs/${jobId}/images/${imageId}`, {
  method: 'DELETE',
  headers: { Authorization: `Bearer ${token}` },
});
```

### Set Primary Image

```javascript
await fetch(`/api/jobs/${jobId}/images/${imageId}/primary`, {
  method: 'PATCH',
  headers: { Authorization: `Bearer ${token}` },
});
```

---

**Full Documentation:** See [CLOUDINARY_SETUP.md](CLOUDINARY_SETUP.md)
