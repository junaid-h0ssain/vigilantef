# Media Upload Feature Design

## Overview

This design implements a media upload system that replaces URL-based image and video attachments with direct file uploads to Firebase Storage. The system provides file validation, upload progress tracking, media previews, and seamless integration with the existing Firestore post structure. Users will be able to select files from their devices, see real-time upload progress, preview their uploads, and view media in existing posts.

## Architecture

The media upload feature follows a modular architecture with clear separation of concerns:

1. **UI Layer** (postView.svelte): Handles file input, displays upload progress, shows previews, and manages user interactions
2. **Storage Service** (storage.js): Encapsulates all Firebase Storage operations including upload, delete, and URL retrieval
3. **Validation Layer**: Validates file types and sizes before upload attempts
4. **Firebase Storage**: Cloud storage backend for persisting uploaded files
5. **Firestore**: Stores download URLs as part of post documents

The flow is unidirectional: User selects file → Validation → Upload to Storage → Store URL in Firestore → Display in UI

## Components and Interfaces

### Storage Service Module (storage.js)

```javascript
// Core upload function
async function uploadMedia(file, userId, mediaType) {
  // Returns: { success: boolean, url?: string, error?: string }
}

// Delete function for removing uploaded files
async function deleteMedia(fileUrl) {
  // Returns: { success: boolean, error?: string }
}

// Progress callback type
type ProgressCallback = (progress: number) => void;
```

### PostView Component Updates

The component will be enhanced with:
- File input elements for images and videos
- Upload progress state management
- Media preview components
- File validation logic
- Integration with storage service

### Post Display Component

Updates to display uploaded media:
- Image rendering with responsive sizing
- Video player integration
- Error handling for failed media loads
- Fallback placeholders

## Data Models

### Post Document Structure (Updated)

```javascript
{
  title: string,
  description: string,
  imageUrl: string | null,        // Now stores Firebase Storage URL
  videoUrl: string | null,        // Now stores Firebase Storage URL
  division: string,
  district: string,
  postedAt: string (ISO 8601),
  crimeTime: string (ISO 8601),
  reporterId: string,
  upvotes: number,
  downvotes: number,
  verificationScore: number,
  comments: Array<Comment>
}
```

### Upload State Model

```javascript
{
  uploading: boolean,
  progress: number,              // 0-100
  error: string | null,
  previewUrl: string | null,
  file: File | null
}
```

### File Validation Rules

```javascript
{
  images: {
    maxSize: 5 * 1024 * 1024,    // 5 MB
    acceptedFormats: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  },
  videos: {
    maxSize: 50 * 1024 * 1024,   // 50 MB
    acceptedFormats: ['video/mp4', 'video/webm', 'video/quicktime']
  }
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Valid image format acceptance
*For any* file with a MIME type in ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] and size below 5MB, the validation function should return true
**Validates: Requirements 1.2, 1.3**

### Property 2: Valid video format acceptance
*For any* file with a MIME type in ['video/mp4', 'video/webm', 'video/quicktime'] and size below 50MB, the validation function should return true
**Validates: Requirements 2.2, 2.3**

### Property 3: Invalid format rejection
*For any* file with a MIME type not in the accepted lists or size exceeding the limits, the validation function should return false
**Validates: Requirements 1.2, 1.3, 2.2, 2.3**

### Property 4: Storage path structure correctness
*For any* uploaded file, the generated storage path should match the format "posts/{mediaType}/{userId}/{timestamp}_{filename}"
**Validates: Requirements 1.4, 2.4, 6.1**

### Property 5: Path uniqueness
*For any* set of files uploaded by the same user, all generated storage paths should be unique
**Validates: Requiremen7.2**
7.1, nts quireme: ReesidatValre
**n failuidatioecific valspthe xplaining message en an error uld returshothe system alidation, ils vle that fa any* fiailure
*Fordation flion vage presence Error messay 10: pert Pro6.4**

###irements qulidates: Re
**Vaation errorn authentic return ald fail and shouationhe opericated, tot authentis nn the user  whe attemptloadr any* upement
*Forcement enfoion requirAuthenticat 9: ty# Proper

## 4.4**equirementslidates: Rail
**Vaould fL she file URaccess thttempts to bsequent asunction, fumove d via the reat is deletee thoaded filr any* uplleanup
*Foeletion cy 8: File drt# Prope 2.5**

##.5,uirements 1tes: Req**Validal field
l or videoUrageUrocument's im post d the instoredshould be oad URL wnlresulting doloads, the ly upcessfulucat s thle fior any*
*Fad uploessfulon succage : URL stor# Property 7##

ents 3.2**equiremValidates: R100
**and  0 tweenbend bounded easing ally non-decrmonotonica should be uess valogresnce of pr, the seque operation* uploadanyicity
*For tonrogress monoty 6: P# Proper##ts 6.2**

