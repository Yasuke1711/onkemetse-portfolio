
(() => {
  const header = document.querySelector("[data-header]");
  const nav = document.querySelector("[data-main-nav]");
  const toggle = document.querySelector("[data-menu-toggle]");
  const notice = document.querySelector("[data-notice]");
  const today = new Date();
  const localISO = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth()+1).padStart(2,"0");
    const d = String(date.getDate()).padStart(2,"0");
    return y + "-" + m + "-" + d;
  };
  const addDays = (value, count) => {
    const d = new Date(value + "T12:00:00");
    d.setDate(d.getDate()+count);
    return localISO(d);
  };
  const formatDate = (value) => {
    if (!value) return "Not selected";
    const d = new Date(value + "T12:00:00");
    return d.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});
  };
  const nightCount = (a,b) => {
    if (!a || !b) return 0;
    return Math.round((new Date(b+"T12:00:00")-new Date(a+"T12:00:00"))/86400000);
  };
  const showNotice = (message) => {
    if (!notice) return;
    notice.textContent = message;
    notice.classList.add("is-visible");
    window.clearTimeout(showNotice.timer);
    showNotice.timer = window.setTimeout(() => notice.classList.remove("is-visible"),4200);
  };
  const syncHeader = () => {
    if (header) header.classList.toggle("is-scrolled",window.scrollY>50);
  };
  syncHeader();
  window.addEventListener("scroll",syncHeader,{passive:true});
  if (toggle && nav) {
    toggle.addEventListener("click",() => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded",String(open));
      toggle.setAttribute("aria-label",open?"Close navigation":"Open navigation");
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click",() => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded","false");
      toggle.setAttribute("aria-label","Open navigation");
    }));
  }
  document.querySelectorAll("[data-arrival]").forEach(input => {
    input.min = localISO(today);
  });
  document.querySelectorAll("[data-arrival]").forEach(arrival => {
    const scope = arrival.closest("form");
    const departure = scope ? scope.querySelector("[data-departure]") : null;
    if (!departure) return;
    departure.min = addDays(localISO(today),1);
    arrival.addEventListener("change",() => {
      departure.min = addDays(arrival.value || localISO(today),1);
      if (departure.value && departure.value <= arrival.value) departure.value = "";
    });
  });

  const homeBooker = document.querySelector("[data-home-booker]");
  if (homeBooker) {
    const arrival = homeBooker.querySelector("[name=arrival]");
    const departure = homeBooker.querySelector("[name=departure]");
    homeBooker.addEventListener("submit",(event) => {
      event.preventDefault();
      if (!arrival.value || !departure.value || nightCount(arrival.value,departure.value)<1) {
        showNotice("Choose an arrival and a departure at least one night later.");
        return;
      }
      const guests = homeBooker.querySelector("[name=guests]").value;
      const query = new URLSearchParams({arrival:arrival.value,departure:departure.value,guests:guests});
      window.location.href = "availability.html?" + query.toString();
    });
  }

  const availabilityForm = document.querySelector("[data-availability-form]");
  const resultCards = Array.from(document.querySelectorAll("[data-room-card]"));
  const summary = document.querySelector("[data-availability-summary]");
  if (availabilityForm) {
    const params = new URLSearchParams(window.location.search);
    const arrival = availabilityForm.querySelector("[name=arrival]");
    const departure = availabilityForm.querySelector("[name=departure]");
    const guests = availabilityForm.querySelector("[name=guests]");
    const room = availabilityForm.querySelector("[name=room]");
    if (params.get("arrival")) arrival.value = params.get("arrival");
    if (params.get("departure")) departure.value = params.get("departure");
    if (params.get("guests")) guests.value = params.get("guests");
    if (params.get("room")) room.value = params.get("room");
    const interest = params.get("interest");
    const updateResults = () => {
      const nights = nightCount(arrival.value,departure.value);
      const guestCount = Number(guests.value || 2);
      const preferred = room.value;
      resultCards.forEach(card => {
        const fits = Number(card.dataset.capacity) >= guestCount;
        const matches = preferred === "Any room" || preferred === card.dataset.room;
        card.classList.toggle("is-muted",!fits || !matches);
        const button = card.querySelector("[data-select-room]");
        button.disabled = !fits || !matches;
      });
      if (summary) {
        if (nights > 0) {
          summary.querySelector("strong").textContent = formatDate(arrival.value) + " to " + formatDate(departure.value);
          summary.querySelector("p").textContent = guestCount + (guestCount===1?" guest":" guests") + " · " + nights + (nights===1?" night":" nights") + (interest ? " · Interest: "+interest.replace(/-/g," ") : "") + ". These details will be included in your enquiry.";
        } else {
          summary.querySelector("strong").textContent = "Select your dates to begin.";
          summary.querySelector("p").textContent = "Choose arrival, departure and guests above. We will show the spaces that fit your enquiry.";
        }
      }
    };
    updateResults();
    availabilityForm.addEventListener("submit",(event) => {
      event.preventDefault();
      if (!arrival.value || !departure.value || nightCount(arrival.value,departure.value)<1) {
        showNotice("Choose valid dates for at least one night.");
        return;
      }
      updateResults();
      showNotice("Room options updated for your selected stay.");
    });
    resultCards.forEach(card => {
      const button = card.querySelector("[data-select-room]");
      button.addEventListener("click",() => {
        if (!arrival.value || !departure.value || nightCount(arrival.value,departure.value)<1) {
          showNotice("Choose your dates first, then select a room.");
          arrival.focus();
          return;
        }
        const query = new URLSearchParams({
          arrival:arrival.value,
          departure:departure.value,
          guests:guests.value,
          room:button.dataset.selectRoom
        });
        if (interest) query.set("interest",interest);
        window.location.href = "reserve.html?" + query.toString();
      });
    });
    guests.addEventListener("change",updateResults);
    room.addEventListener("change",updateResults);
  }

  const reserveForm = document.querySelector("[data-reserve-form]");
  if (reserveForm) {
    const params = new URLSearchParams(window.location.search);
    const arrival = params.get("arrival") || "";
    const departure = params.get("departure") || "";
    const guests = params.get("guests") || "2";
    const room = params.get("room") || (params.get("interest")==="private-dining" ? "Private dining at The House Table" : "Room to be discussed");
    const interest = params.get("interest") || "";
    const values = {
      room:room,
      arrival:formatDate(arrival),
      departure:formatDate(departure),
      guests:guests + (guests==="1"?" guest":" guests"),
      nights:nightCount(arrival,departure)>0 ? nightCount(arrival,departure) + (nightCount(arrival,departure)===1?" night":" nights") : "To be confirmed"
    };
    const setText = (selector,value) => {
      const node = document.querySelector(selector);
      if (node) node.textContent = value;
    };
    setText("[data-reserve-room]",values.room);
    setText("[data-reserve-arrival]",values.arrival);
    setText("[data-reserve-departure]",values.departure);
    setText("[data-reserve-guests]",values.guests);
    setText("[data-reserve-nights]",values.nights);
    if (interest) {
      const msg = reserveForm.querySelector("[name=message]");
      if (msg && !msg.value) msg.value = "I would also like to ask about " + interest.replace(/-/g," ") + ".";
    }
    reserveForm.addEventListener("submit",(event) => {
      event.preventDefault();
      const data = new FormData(reserveForm);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      if (!name || !email) {
        setText("[data-form-feedback]","Please add your name and email address.");
        return;
      }
      const lines = [
        "LITTLE ACACIA GUEST HOUSE",
        "Stay enquiry",
        "",
        "Name: " + name,
        "Email: " + email,
        "Phone: " + (String(data.get("phone") || "").trim() || "Not provided"),
        "Room or interest: " + values.room,
        "Arrival: " + values.arrival,
        "Departure: " + values.departure,
        "Guests: " + values.guests,
        "Length of stay: " + values.nights,
        "Occasion: " + String(data.get("occasion") || "Not specified"),
        "Additional notes: " + (String(data.get("message") || "").trim() || "None"),
        "",
        "Please confirm rates, availability and any arrangements."
      ];
      const text = lines.join("\n");
      const output = document.querySelector("[data-enquiry-output]");
      const pre = document.querySelector("[data-enquiry-text]");
      if (pre) pre.textContent = text;
      if (output) {
        output.hidden = false;
        output.scrollIntoView({behavior:"smooth",block:"start"});
      }
      setText("[data-form-feedback]","Your enquiry has been prepared on this device.");
    });
  }

  const copyButton = document.querySelector("[data-copy-enquiry]");
  if (copyButton) {
    copyButton.addEventListener("click",async () => {
      const text = document.querySelector("[data-enquiry-text]")?.textContent || "";
      try {
        await navigator.clipboard.writeText(text);
        const feedback = document.querySelector("[data-copy-feedback]");
        if (feedback) feedback.textContent = "Copied. Your enquiry is ready to share.";
      } catch {
        const selection = document.createElement("textarea");
        selection.value = text;
        selection.setAttribute("readonly","");
        selection.style.position = "absolute";
        selection.style.left = "-9999px";
        document.body.appendChild(selection);
        selection.select();
        document.execCommand("copy");
        selection.remove();
        const feedback = document.querySelector("[data-copy-feedback]");
        if (feedback) feedback.textContent = "Copied. Your enquiry is ready to share.";
      }
    });
  }

  document.querySelectorAll("[data-accordion-toggle]").forEach(button => {
    button.addEventListener("click",() => {
      const panel = document.getElementById(button.getAttribute("aria-controls"));
      const open = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded",String(!open));
      if (panel) panel.hidden = open;
    });
  });

  const revealTargets = document.querySelectorAll(".stay-card,.room-detail,.experience-row,.house-space,.dining-moments article");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },{threshold:.08});
    revealTargets.forEach(target => {
      target.classList.add("will-reveal");
      observer.observe(target);
    });
  }
})();
