# Nin's Raw Code Site

Render setup:

1. Upload this folder to GitHub.
2. Create a new Render Web Service from that repo.
3. Use:
   - Build Command: blank
   - Start Command: `npm start`
4. After deploy, use:

```lua
loadstring(game:HttpGet("https://YOUR-RENDER-URL.onrender.com/raw.lua"))()
```

Raw endpoints:

- `/raw.lua`
- `/script.lua`
- `/main.lua`

