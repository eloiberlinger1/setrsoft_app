# Editor — Backend API Requirements

All endpoints are prefixed with the value of `VITE_API_BASE`.
Authentication uses a per-user `url_request_key` passed as a URL segment.

---

## Endpoints

### 1. Get Wall Session
```
GET /gym/wallsession/{wallId}
```
**Response:**
```json
{
  "id": "string",
  "wall_id": "string",
  "session_name": "string",
  "related_wall": { "id": "string", "name": "string" },
  "related_holds_collection": false,
  "holds_collection_instances": [],
  "gym": { "id": "string" }
}
```

---

### 2. Save Layout
```
PUT /gym/wallsession/update/{sessionId}
```
**Body:**
```json
{ "layout": "<JSON string of SaveState>" }
```
**Response:** `{ "success": true }`

**SaveState shape:**
```typescript
{
  objects: PlacedObject[];
  wallColors: Record<string, string>;
  holdColors: Record<string, string>;
  coloredTexture: boolean;
}
```

---

### 3. Set Session Name
```
POST /gym/setwallsessionname/{sessionId}
```
**Body:** `{ "session_name": "string" }`
**Response:** `{ "success": true }`

---

### 4. Load Saved Layout
```
GET /gym/getwallsessionlayout/{sessionId}
```
**Response:**
```json
{ "layout": "<Python-style JSON string>" }
```
> Note: The layout string may use Python syntax (single quotes, `True`/`False`/`None`). The frontend converts it to valid JSON before parsing.

---

### 5. Download Wall GLB File
```
GET /gym/getwallfile/{wallId}/{userKey}
```
**Response:** Binary blob (`model/gltf-binary`)

---

### 6. Download Hold GLB File
```
GET /gym/getholdfile/hold/{holdTypeId}/0/{userKey}
```
**Response:** Binary blob (`model/gltf-binary`)

---

### 7. Explore Stock (paginated)
```
GET /gym/stock-explore/{gymId}/?page=1&page_size=20&sorting=name&state=&color=&manufacturer=
```
**Response:**
```json
{
  "results": [],
  "count": 0,
  "next": null,
  "previous": null,
  "stock": [],
  "holds": []
}
```

---

### 8. Add / Remove Hold from Session Collection
```
GET /gym/changeholdtosessioncollection/{sessionId}/{flag}/{holdId}
```
- `flag = 1` → add hold to session
- `flag = 0` → remove hold from session

**Response:** `{ "success": true }`

---

## Domain Types

### HoldInstance
```typescript
{
  id: string;
  hold_instance_id: string;
  name: string;
  file: string;             // CDN path or filename
  hold_type: HoldType;
  usage_type?: "volume" | "hold";
}
```

### HoldType
```typescript
{
  id: string;
  manufacturer_ref: string;
  cdn_ref: string;          // relative path used to build glb_url
  hold_usage_type?: "volume" | string;
  glb_url?: string;         // set by frontend: /gym/getholdfile/hold/{id}/0/{userKey}
}
```

### PlacedObject
```typescript
{
  id: string;
  type: "wall" | "hold";
  url: string;                              // blob URL or CDN URL
  position: [number, number, number];
  rotation: [number, number, number, number]; // quaternion [x, y, z, w]
  orientation?: "y-up" | "z-up";
  customRotation?: number;                  // Y-axis rotation in radians (holds only)
  parentId?: string | null;                 // for hold-on-hold attachment
  name?: string;
  color?: string;
  wall_id?: string;                         // reference when blob URL is removed for persistence
}
```

---

## Implementation Notes

- `url_request_key` is a 5-digit numeric string tied to a user account.
- On layout load, all `url_request_key` values in saved URLs are replaced with the current user's key via regex: `/(\/get(?:wall|holdfile)[^"']*\/)(\d{5})(?=["'])/g`
- GLB files are served as authenticated binary blobs. The frontend creates `Object URL`s and revokes them on component unmount.
- Wall blob URLs are stripped from the saved layout and replaced with a `wall_id` reference. The URL is reconstructed from the API when the session is loaded.
