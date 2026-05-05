(function() {
  // ─── HUBSTAK EMBED v1.0 ───
  // Drop this script tag on any website:
  // <script 
  //   src="https://your-cdn/hubstak-embed.js"
  //   data-contractor="CONTRACTOR_SLUG"
  //   data-trade="Lawn Mowing"
  // ></script>

  const SUPABASE_URL = 'https://gfxmkouojymwgpvbngzz.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmeG1rb3Vvanltd2dwdmJuZ3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NDg5ODAsImV4cCI6MjA4OTUyNDk4MH0.kGTwFZcoHnkuFJR-FTk__MuK6KaqUp7A5HNIkQy1EMA';

  // Get config from the script tag attributes
  const script = document.currentScript;
  const contractorSlug = script.getAttribute('data-contractor') || 'unknown';
  const defaultTrade   = script.getAttribute('data-trade') || 'General';
  const accentColor    = script.getAttribute('data-color') || '#1a3d1e';
  const containerId    = script.getAttribute('data-target') || 'hubstak-form';

  // ─── STYLES ───
  const styles = `
    .hs-form-wrap * { box-sizing: border-box; margin: 0; padding: 0; }
    .hs-form-wrap {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      max-width: 560px;
      width: 100%;
    }
    .hs-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
    .hs-label {
      font-size: 0.72rem; font-weight: 700;
      letter-spacing: 0.18em; text-transform: uppercase;
      color: #666;
    }
    .hs-input, .hs-select, .hs-textarea {
      width: 100%; padding: 13px 15px;
      border: 1px solid #ddd;
      font-size: 0.95rem;
      font-family: inherit;
      color: #1a1a1a;
      outline: none;
      transition: border-color 0.2s;
      background: #fff;
      border-radius: 0;
      appearance: none;
    }
    .hs-input:focus, .hs-select:focus, .hs-textarea:focus {
      border-color: ${accentColor};
    }
    .hs-textarea { resize: vertical; min-height: 100px; }
    .hs-btn {
      width: 100%; padding: 15px;
      background: ${accentColor};
      color: #fff; border: none;
      font-size: 0.95rem; font-weight: 700;
      letter-spacing: 0.12em; text-transform: uppercase;
      cursor: pointer;
      font-family: inherit;
      transition: opacity 0.2s;
      margin-top: 4px;
    }
    .hs-btn:hover { opacity: 0.88; }
    .hs-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .hs-msg {
      margin-top: 14px; padding: 14px;
      font-size: 0.9rem; font-weight: 600;
      text-align: center; display: none;
    }
    .hs-msg.success { background: #f0faf0; color: #1a5c1a; }
    .hs-msg.error   { background: #fff0f0; color: #c0392b; }
    .hs-powered {
      margin-top: 12px; text-align: center;
      font-size: 0.72rem; color: #aaa;
    }
    .hs-powered a { color: #aaa; text-decoration: none; }
    .hs-powered a:hover { color: #666; }
    .hs-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    @media (max-width: 480px) { .hs-row { grid-template-columns: 1fr; } }
  `;

  // ─── HTML ───
  const html = `
    <style>${styles}</style>
    <div class="hs-form-wrap">
      <form id="hs-form-${contractorSlug}">
        <div class="hs-row">
          <div class="hs-field">
            <label class="hs-label">Your Name *</label>
            <input class="hs-input" type="text" name="name" placeholder="Full name" required>
          </div>
          <div class="hs-field">
            <label class="hs-label">Phone *</label>
            <input class="hs-input" type="tel" name="phone" placeholder="555-000-0000" required>
          </div>
        </div>
        <div class="hs-field">
          <label class="hs-label">Email</label>
          <input class="hs-input" type="email" name="email" placeholder="your@email.com">
        </div>
        <div class="hs-field">
          <label class="hs-label">Service Address</label>
          <input class="hs-input" type="text" name="address" placeholder="Street address">
        </div>
        <div class="hs-field">
          <label class="hs-label">Service Needed</label>
          <select class="hs-select" name="trade">
            <option value="${defaultTrade}">${defaultTrade}</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div class="hs-field">
          <label class="hs-label">Tell Us About the Job</label>
          <textarea class="hs-textarea" name="notes" placeholder="Any details we should know..."></textarea>
        </div>
        <button class="hs-btn" type="submit">Request Free Quote</button>
        <div class="hs-msg" id="hs-msg-${contractorSlug}"></div>
      </form>
      <p class="hs-powered">Powered by <a href="https://hubstak.app" target="_blank">Hubstak</a></p>
    </div>
  `;

  // ─── INJECT ───
  const target = document.getElementById(containerId);
  if (target) {
    target.innerHTML = html;
  } else {
    // If no target div, inject right after the script tag
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    script.parentNode.insertBefore(wrapper, script.nextSibling);
  }

  // ─── SUBMIT ───
  const form = document.getElementById(`hs-form-${contractorSlug}`);
  const msg  = document.getElementById(`hs-msg-${contractorSlug}`);

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = form.querySelector('.hs-btn');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    const data = Object.fromEntries(new FormData(form));

    const payload = {
      name:    data.name?.trim() || null,
      phone:   data.phone?.trim() || null,
      email:   data.email?.trim() || null,
      address: data.address?.trim() || null,
      trade:   data.trade || defaultTrade,
      notes:   data.notes?.trim() || null,
      source:  `Website - ${contractorSlug}`,
      status:  'new'
    };

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok || res.status === 201) {
        msg.className = 'hs-msg success';
        msg.style.display = 'block';
        msg.textContent = "Got it! We'll be in touch with your free quote soon.";
        form.reset();
      } else {
        throw new Error(await res.text());
      }
    } catch(err) {
      msg.className = 'hs-msg error';
      msg.style.display = 'block';
      msg.textContent = 'Something went wrong. Please try calling us directly.';
      console.error('Hubstak error:', err);
    }

    btn.textContent = 'Request Free Quote';
    btn.disabled = false;
  });

})();
