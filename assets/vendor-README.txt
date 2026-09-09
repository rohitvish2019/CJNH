Place the following vendor files in the matching folders under /assets.

Required JS files (place under /assets/js/vendor):
- jquery.min.js            (e.g. jQuery 3.7.1)
- popper.min.js           (Popper.js)
- bootstrap-4.5.2.min.js  (Bootstrap 4.5.2 JS)
- bootstrap.bundle.min.js (Bootstrap 5 bundle; used as bootstrap-5.x bundle)
- bootstrap-5.3.3.bundle.min.js (optional explicit file if you prefer versioned name)
- noty-3.1.4.min.js       (Noty notifications)
- admin.js (existing app scripts remain under /js)

Required CSS files (place under /assets/css/vendor):
- bootstrap-4.5.2.min.css
- bootstrap-5.2.3.min.css
- bootstrap-5.3.3.min.css
- fontawesome-5.15.4.min.css
- noty-3.1.4.min.css

Fonts (place under /assets/fonts/vendor or /assets/fonts):
- Font Awesome webfonts (fa-solid-900.woff2, fa-regular-400.woff2, etc.)

Suggested curl commands (run from project root) to download the canonical files:

# jQuery
curl -L -o assets/js/vendor/jquery.min.js https://code.jquery.com/jquery-3.7.1.min.js

# Popper
curl -L -o assets/js/vendor/popper.min.js https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js

# Bootstrap 4 CSS/JS
curl -L -o assets/css/vendor/bootstrap-4.5.2.min.css https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css
curl -L -o assets/js/vendor/bootstrap-4.5.2.min.js https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js

# Bootstrap 5 (bundle)
curl -L -o assets/css/vendor/bootstrap-5.3.3.min.css https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/css/bootstrap.min.css
curl -L -o assets/js/vendor/bootstrap.bundle.min.js https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/js/bootstrap.bundle.min.js

# Noty
curl -L -o assets/js/vendor/noty-3.1.4.min.js https://cdnjs.cloudflare.com/ajax/libs/noty/3.1.4/noty.min.js
curl -L -o assets/css/vendor/noty-3.1.4.min.css https://cdnjs.cloudflare.com/ajax/libs/noty/3.1.4/noty.min.css

# Font Awesome CSS and fonts (example)
curl -L -o assets/css/vendor/fontawesome-5.15.4.min.css https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css

# After downloading fontawesome CSS, download referenced webfonts into assets/fonts/vendor and adjust the paths inside the CSS if necessary.

Notes:
- I updated all view templates to reference these local paths under /css/vendor and /js/vendor.
- You must download the vendor files listed above into the specified paths for the app to work offline.
- If you want me to download these files into the workspace directly, I can add them if you permit internet access; currently I cannot fetch external resources automatically.
