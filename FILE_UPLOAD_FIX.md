# File Upload Fix for Large Files

## Problem

When sending video files larger than 2MB through the socket connection, the socket would disconnect due to payload size limits.

## Solution Implemented

### Frontend Changes

1. **Modified `socketService.ts`**:

   - Added file size check (1MB threshold)
   - Large files are now uploaded via HTTP API first
   - Only file metadata is sent through socket after successful upload
   - Added proper error handling for upload failures

2. **Updated `ChatTextArea.tsx`**:

   - Improved upload progress indicators
   - Added handlers for upload completion and errors
   - Better user feedback during file uploads

3. **Enhanced `api/index.ts`**:
   - Added `uploadFile` method for handling file uploads
   - Includes progress tracking and proper error handling

### Backend Requirements

The backend needs to implement the following endpoint:

```
POST /api/v1/chat/upload-file
```

**Request:**

- Content-Type: `multipart/form-data`
- Body:
  - `file`: The uploaded file
  - `chatId`: The chat ID where the file will be sent

**Response:**

```json
{
  "success": true,
  "data": {
    "fileUrl": "https://your-storage-url.com/path/to/file",
    "fileName": "original-filename.mp4",
    "fileSize": 2097152,
    "mimeType": "video/mp4"
  }
}
```

**Headers:**

- `Authorization: Bearer <token>` (required)

### How It Works

1. **Small files (< 1MB)**: Still sent directly through socket (for backward compatibility)
2. **Large files (≥ 1MB)**:
   - File is uploaded to server via HTTP POST
   - Server stores file and returns URL
   - Only file metadata (including URL) is sent through socket
   - Other users receive the file metadata and can download/view the file

### Benefits

- ✅ No more socket disconnections for large files
- ✅ Better user experience with progress indicators
- ✅ Proper error handling and user feedback
- ✅ Scalable solution for any file size
- ✅ Maintains real-time messaging for file metadata

### Testing

To test the fix:

1. Try uploading a video file larger than 2MB
2. Check that the socket connection remains stable
3. Verify that the file appears in the chat for all participants
4. Confirm that the file can be downloaded/viewed properly

### Notes

- The 1MB threshold can be adjusted based on your server's socket payload limits
- Consider implementing file type validation on the backend
- Monitor server storage usage for uploaded files
- Consider implementing file cleanup for old/unused files
