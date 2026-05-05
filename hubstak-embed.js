(function() {
  // ─── HUBSTAK EMBED v1.1 ───
  // Usage:
  // <script
  //   src="https://cdn.jsdelivr.net/gh/mcb920-dot/Hubstak-Form@main/hubstak-embed.js"
  //   data-contractor="johnsroofing"
  //   data-user-id="supabase-user-uuid-here"
  //   data-company="John's Roofing"
  //   data-trade="Roofing"
  //   data-color="#8B1A1A"
  //   data-services="Roof Repair,New Roof,Inspection,Gutters"
  //   data-target="my-form-div">  (optional - id of div to inject into)
  // ></script>

  const SUPABASE_URL      = 'https://gfxmkouojymwgpvbngzz.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmeG1rb3Vvanltd2dwdmJuZ3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NDg5ODAsImV4cCI6MjA4OTUyNDk4MH0.kGTwFZcoHnkuFJR-FTk__MuK6KaqUp7A5HNIkQy1EMA';

  const script      = document.currentScript;
  const slug        = script.getAttribute('data-contractor') || 'unknown';
  const userId      = script.getAttribute('data-user-id')    || null;
  const company     = script.getAttribute('data-company')    || 'Us';
  const trade       = script.getAttribute('data-trade')      || 'General';
  const color       = script.getAttribute('data-color')      || '#1a3d1e';
  const servicesRaw = script.getAttribute('data-services')   || trade;
  const containerId = script.getAttribute('data-target')     || null;

  // Build service dropdown options from comma-separated list
  const services = servicesRaw.split(',').map(s => s.trim()).filter(Boolean);
  const serviceOptions = services.map(s =>
    `<option value="${s}">${s}</option>`
  ).join('');

  // ─── STYLES ───
  const uid = `hs_${slug}`.replace(/[^a-z0-9_]/gi, '_');

  const styles = `
    #${uid}_wrap * { box-sizing: border-box; margin: 0; padding: 0; }
    #${uid}_wrap {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      width: 100%;
      max-width: 560px;
    }
    #${uid}_wrap .hs-title {
      font-size: 1.3rem; font-weight: 700;
      color: #1a1a1a; margin-bottom: 4px;
    }
    #${uid}_wrap .hs-subtitle {
      font-size: 0.88rem; color: #777;
      margin-bottom: 24px;
    }
    #${uid}_wrap .hs-row {
      display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
    }
    #${uid}_wrap .hs-field {
      display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px;
    }
    #${uid}_wrap .hs-label {
      font-size: 0.7rem; font-weight: 700;
      letter-spacing: 0.15em; text-transform: uppercase; color: #888;
    }
    #${uid}_wrap .hs-input,
    #${uid}_wrap .hs-select,
    #${uid}_wrap .hs-textarea {
      width: 100%; padding: 12px 14px;
      border: 1px solid #ddd; border-radius: 4px;
      font-size: 0.93rem; font-family: inherit;
      color: #1a1a1a; background: #fff;
      outline: none; transition: border-color 0.2s;
      appearance: none;
    }
    #${uid}_wrap .hs-input:focus,
    #${uid}_wrap .hs-select:focus,
    #${uid}_wrap .hs-textarea:focus {
      border-color: ${color};
    }
    #${uid}_wrap .hs-textarea { resize: vertical; min-height: 96px; }
    #${uid}_wrap .hs-btn {
      width: 100%; padding: 14px;
      background: ${color}; color: #fff;
      border: none; border-radius: 4px;
      font-size: 0.95rem; font-weight: 700;
      letter-spacing: 0.08em; text-transform: uppercase;
      cursor: pointer; font-family: inherit;
      transition: opacity 0.2s; margin-top: 6px;
    }
    #${uid}_wrap .hs-btn:hover { opacity: 0.88; }
    #${uid}_wrap .hs-btn:disabled { opacity: 0.55; cursor: not-allowed; }
    #${uid}_wrap .hs-msg {
      margin-top: 12px; padding: 13px;
      font-size: 0.88rem; font-weight: 600;
      text-align: center; border-radius: 4px;
      display: none;
    }
    #${uid}_wrap .hs-success { background: #f0faf0; color: #1a5c1a; }
    #${uid}_wrap .hs-error   { background: #fff0f0; color: #c0392b; }
    #${uid}_wrap .hs-powered {
      margin-top: 10px; text-align: center;
      font-size: 0.7rem; color: #bbb;
    }
    #${uid}_wrap .hs-powered a {
      color: #bbb; text-decoration: none;
    }
    #${uid}_wrap .hs-powered a:hover { color: #888; }
    @media (max-width: 480px) {
      #${uid}_wrap .hs-row { grid-template-columns: 1fr; }
    }
  `;

  // ─── HTML ───
  const html = `
    <style>${styles}</style>
    <div id="${uid}_wrap">
      <p class="hs-title">Request a Free Quote</p>
      <p class="hs-subtitle">from ${company} — we'll get back to you fast.</p>
      <form id="${uid}_form" novalidate>
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
            ${serviceOptions}
            ${services.length > 1 ? '' : '<option value="Other">Other</option>'}
          </select>
        </div>
        <div class="hs-field">
          <label class="hs-label">Tell Us About the Job</label>
          <textarea class="hs-textarea" name="notes" placeholder="Any details we should know..."></textarea>
        </div>
        <button class="hs-btn" type="submit">Request Free Quote</button>
        <div class="hs-msg" id="${uid}_msg"></div>
      </form>
      <p class="hs-powered">Powered by <a href="https://hubstak.app" target="_blank">Hubstak</a></p>
    </div>
  `;

  // ─── INJECT ───
  const target = containerId ? document.getElementById(containerId) : null;
  if (target) {
    target.innerHTML = html;
  } else {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    script.parentNode.insertBefore(wrapper, script.nextSibling);
  }

  // ─── SUBMIT ───
  const form = document.getElementById(`${uid}_form`);
  const msg  = document.getElementById(`${uid}_msg`);

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const btn = form.querySelector('.hs-btn');

    // Basic validation
    const name  = form.querySelector('[name="name"]').value.trim();
    const phone = form.querySelector('[name="phone"]').value.trim();
    if (!name || !phone) {
      msg.className = 'hs-msg hs-error';
      msg.style.display = 'block';
      msg.textContent = 'Please fill in your name and phone number.';
      return;
    }

    btn.textContent = 'Sending...';
    btn.disabled = true;
    msg.style.display = 'none';

    const payload = {
      name,
      phone,
      email:   form.querySelector('[name="email"]').value.trim()   || null,
      address: form.querySelector('[name="address"]').value.trim() || null,
      trade:   form.querySelector('[name="trade"]').value          || trade,
      notes:   form.querySelector('[name="notes"]').value.trim()   || null,
      source:  `Website - ${company} (${slug})`,
      status:  'new'
    };

    // Attach contractor's user_id if provided
    if (userId) payload.user_id = userId;

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
        msg.className = 'hs-msg hs-success';
        msg.style.display = 'block';
        msg.textContent = "Got it! We'll be in touch with your free quote soon.";
        form.reset();
      } else {
        throw new Error(await res.text());
      }
    } catch(err) {
      msg.className = 'hs-msg hs-error';
      msg.style.display = 'block';
      msg.textContent = 'Something went wrong. Please try again or call us directly.';
      console.error('Hubstak embed error:', err);
    }

    btn.textContent = 'Request Free Quote';
    btn.disabled = false;
  });

})();
