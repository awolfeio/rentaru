# Document Viewer Modal Implementation Plan

## Goal

Create a reusable `DocumentViewerModal` component that can be opened
from any `View Document` action in the app.

------------------------------------------------------------------------

## Core UX Behavior

Any `View` button triggers:

``` tsx
setSelectedDocument(doc);
setDocumentViewerOpen(true);
```

------------------------------------------------------------------------

## Component API

``` tsx
<DocumentViewerModal
  open={documentViewerOpen}
  onOpenChange={setDocumentViewerOpen}
  document={selectedDocument}
  onDownload={handleDownload}
  onArchive={handleArchive}
/>
```

------------------------------------------------------------------------

## Document Shape

``` ts
interface DocRecord {
  id: string;
  name: string;
  type: DocumentType;
  status: DocumentStatus;
  relatedEntityName: string;
  size: string;
  uploadedAt: string;
  signedAt?: string;
  uploadedBy: string;
  fileUrl: string;
  mimeType: string;
}
```

------------------------------------------------------------------------

## Rendering

### PDF

``` tsx
<iframe src={document.fileUrl} className="h-full w-full" />
```

### Image

``` tsx
<img src={document.fileUrl} className="max-h-full max-w-full object-contain" />
```

### Fallback

Display download-only state.

------------------------------------------------------------------------

## Layout

-   Desktop: centered modal (90vw / 90vh)
-   Mobile: full-screen modal
-   Header: name + metadata
-   Actions: Download, Archive

------------------------------------------------------------------------

## Structure

    components/documents/
      DocumentViewerModal.tsx
      DocumentPreviewRenderer.tsx

------------------------------------------------------------------------

## States

-   Loading
-   Loaded
-   Error
-   Unsupported

------------------------------------------------------------------------

## Integration

``` tsx
const [viewerOpen, setViewerOpen] = useState(false);
const [selectedDocument, setSelectedDocument] = useState(null);
```

------------------------------------------------------------------------

## Phase 1

-   Modal
-   PDF + image preview
-   Download
-   Error states

------------------------------------------------------------------------

## Phase 2

-   Zoom / rotate
-   PDF.js
-   Permissions
-   Version history

------------------------------------------------------------------------

## Acceptance Criteria

-   View opens modal
-   PDFs + images render
-   Download works
-   Reusable component
