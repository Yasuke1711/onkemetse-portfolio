(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const money = value => new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(value);
  const parseDate = value => {
    if (!value) return null;
    const parts = value.split("-").map(Number);
    if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) return null;
    return new Date(parts[0], parts[1] - 1, parts[2]);
  };
  const dateText = value => {
    const date = parseDate(value);
    return date ? new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date) : "DD/MM/YYYY";
  };
  const addDays = (date, days) => {
    const next = new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
    return next.getFullYear() + "-" + String(next.getMonth() + 1).padStart(2, "0") + "-" + String(next.getDate()).padStart(2, "0");
  };
  const nightsBetween = (arrival, departure) => {
    const start = parseDate(arrival);
    const end = parseDate(departure);
    if (!start || !end) return 0;
    return Math.round((end - start) / 86400000);
  };
  const params = new URLSearchParams(window.location.search);
  const defaultArrival = addDays(new Date(), 1);
  const defaultDeparture = addDays(new Date(), 3);

  // Mobile navigation
  const toggle = $(".nav-toggle");
  const nav = $(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    });
    $$(".main-nav a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }));
  }

  // Search forms
  $$("[data-search-form]").forEach(form => {
    const arrival = $('[data-date-role="arrival"]', form);
    const departure = $('[data-date-role="departure"]', form);
    const adults = $('select[name="adults"]', form);
    const rooms = $('select[name="rooms"]', form);
    const today = new Date();
    const todayString = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0");
    if (arrival) arrival.min = todayString;
    if (departure) departure.min = addDays(today, 1);
    if (arrival && !arrival.value) arrival.value = params.get("arrival") || defaultArrival;
    if (departure && !departure.value) departure.value = params.get("departure") || defaultDeparture;
    if (adults && params.has("adults")) adults.value = params.get("adults");
    if (rooms && params.has("rooms")) rooms.value = params.get("rooms");
    form.addEventListener("submit", event => {
      event.preventDefault();
      const start = arrival ? arrival.value : "";
      const end = departure ? departure.value : "";
      if (!start || !end || nightsBetween(start, end) < 1) {
        if (departure) departure.setCustomValidity("Choose a check-out date after check-in.");
        if (departure) departure.reportValidity();
        return;
      }
      if (departure) departure.setCustomValidity("");
      const query = new URLSearchParams({
        arrival: start,
        departure: end,
        adults: adults ? adults.value : "2",
        rooms: rooms ? rooms.value : "1"
      });
      window.location.href = "availability.html?" + query.toString();
    });
    if (arrival && departure) arrival.addEventListener("change", () => {
      departure.min = addDays(parseDate(arrival.value) || new Date(), 1);
      if (departure.value && nightsBetween(arrival.value, departure.value) < 1) departure.value = departure.min;
    });
  });

  // Availability results
  const resultCards = $$(".room-result");
  if (resultCards.length) {
    const arrival = params.get("arrival") || defaultArrival;
    const departure = params.get("departure") || defaultDeparture;
    const nights = Math.max(1, nightsBetween(arrival, departure));
    const adults = Math.max(1, Number(params.get("adults") || 2));
    const rooms = Math.max(1, Number(params.get("rooms") || 1));
    const children = Math.max(0, Number(params.get("children") || 0));
    const summary = $(".results-summary");
    if (summary) summary.textContent = dateText(arrival) + " to " + dateText(departure) + " · " + nights + (nights === 1 ? " night" : " nights") + " · " + adults + (adults === 1 ? " adult" : " adults") + (children ? ", " + children + (children === 1 ? " child" : " children") : "") + " · " + rooms + (rooms === 1 ? " room" : " rooms");
    const filter = $("#rate-filter");
    const sort = $("#sort-rates");
    const rateData = [
      { key: "flexible", name: "Flexible stay", note: "Free cancellation up to 7 days before arrival. Pay on arrival.", factor: 1, policy: "Flexible sample rate. Cancellation terms are illustrative." },
      { key: "breakfast", name: "Stay with breakfast", note: "Breakfast for two included each morning. Flexible sample terms.", factor: 1.12, policy: "Breakfast sample rate. Cancellation terms are illustrative." },
      { key: "advance", name: "Advance purchase", note: "A lower sample rate. Prepaid and non-refundable.", factor: .9, policy: "Advance purchase sample rate. Non-refundable." }
    ];
    const renderRateCards = () => {
      resultCards.forEach(card => {
        const base = Number(card.dataset.price || 0);
        const capacity = Number(card.dataset.capacity || 2);
        const container = $("[data-rate-options]", card);
        if (!container) return;
        container.innerHTML = "";
        const eligible = rateData.filter(rate => !filter || filter.value === "all" || filter.value === rate.key);
        eligible.forEach(rate => {
          const nightly = Math.round(base * rate.factor);
          const total = nightly * nights * rooms;
          const rateCard = document.createElement("div");
          rateCard.className = "rate-card" + (rate.key === "flexible" ? " featured-rate" : "");
          rateCard.innerHTML = '<h4>' + rate.name + '</h4><p>' + rate.note + '</p><strong class="rate-price">' + money(nightly) + '</strong><span class="rate-sub">per room / night · estimated total ' + money(total) + '</span><button class="button button-dark" type="button" data-choose-rate>Choose rate</button>';
          const choose = $("[data-choose-rate]", rateCard);
          choose.addEventListener("click", () => {
            if (adults > capacity * rooms) {
              window.alert("This room type may not accommodate your full party. Please choose a larger room or adjust the room count.");
              return;
            }
            const query = new URLSearchParams({
              arrival: arrival, departure: departure, adults: String(adults), children: String(children), rooms: String(rooms),
              room: card.dataset.room, roomName: card.dataset.name, rate: rate.key, rateName: rate.name,
              nightly: String(nightly), total: String(total), policy: rate.policy
            });
            window.location.href = "reserve.html?" + query.toString();
          });
          container.appendChild(rateCard);
        });
        if (!eligible.length) container.innerHTML = '<p class="no-rate-message">No rate plans match these filters. Try another rate type.</p>';
      });
    };
    const applySort = () => {
      const parent = $(".results-list");
      if (!parent) return;
      const direction = sort ? sort.value : "recommended";
      const cards = resultCards.slice().sort((a,b) => {
        const aPrice = Number(a.dataset.price);
        const bPrice = Number(b.dataset.price);
        if (direction === "lowest") return aPrice - bPrice;
        if (direction === "highest") return bPrice - aPrice;
        return ["classic","garden","terrace"].indexOf(a.dataset.room) - ["classic","garden","terrace"].indexOf(b.dataset.room);
      });
      cards.forEach(card => parent.appendChild(card));
    };
    if (filter) filter.addEventListener("change", renderRateCards);
    if (sort) sort.addEventListener("change", applySort);
    renderRateCards();
  }

  // Reservation review and enquiry summary
  const reservationForm = $("#reservation-form");
  if (reservationForm) {
    const roomName = params.get("roomName") || "Classic King";
    const rateName = params.get("rateName") || "Flexible stay";
    const arrival = params.get("arrival") || defaultArrival;
    const departure = params.get("departure") || defaultDeparture;
    const nights = Math.max(1, nightsBetween(arrival, departure));
    const adults = Math.max(1, Number(params.get("adults") || 2));
    const children = Math.max(0, Number(params.get("children") || 0));
    const rooms = Math.max(1, Number(params.get("rooms") || 1));
    const nightly = Math.max(0, Number(params.get("nightly") || 2850));
    const baseTotal = Math.max(0, Number(params.get("total") || nightly * nights * rooms));
    const policy = params.get("policy") || "Sample flexible rate terms.";
    const setText = (selector, value) => { const node = $(selector); if (node) node.textContent = value; };
    setText("[data-res-room]", roomName);
    setText("[data-res-arrival]", dateText(arrival));
    setText("[data-res-departure]", dateText(departure));
    setText("[data-res-guests]", adults + (adults === 1 ? " adult" : " adults") + (children ? " · " + children + (children === 1 ? " child" : " children") : ""));
    setText("[data-res-nights]", nights + (nights === 1 ? " night" : " nights"));
    setText("[data-res-rate]", rateName);
    setText("[data-res-policy]", policy);
    setText("[data-res-room-total]", money(baseTotal));

    const extras = $$('input[name="extra"]');
    const extrasTotal = () => extras.reduce((total, input) => {
      if (!input.checked) return total;
      const unit = Number(input.dataset.price || 0);
      if (input.value === "breakfast") return total + unit * adults * nights;
      if (input.value === "parking") return total + unit * rooms * nights;
      return total + unit;
    }, 0);
    const updatePrice = () => {
      const extraTotal = extrasTotal();
      setText("[data-price-night-label]", "Room rate × " + nights + " nights" + (rooms > 1 ? " × " + rooms + " rooms" : ""));
      setText("[data-price-rooms]", money(baseTotal));
      setText("[data-price-extras]", money(extraTotal));
      setText("[data-price-total]", money(baseTotal + extraTotal));
    };
    extras.forEach(input => input.addEventListener("change", updatePrice));
    updatePrice();

    reservationForm.addEventListener("submit", event => {
      event.preventDefault();
      if (!reservationForm.reportValidity()) return;
      const data = new FormData(reservationForm);
      const extraNames = extras.filter(input => input.checked).map(input => {
        if (input.value === "breakfast") return "Breakfast each morning";
        if (input.value === "parking") return "Secure parking";
        return "Private airport transfer";
      });
      const firstName = data.get("firstName");
      const lastName = data.get("lastName");
      const message = [
        "THE GRAND HOUSE — SAMPLE STAY ENQUIRY",
        "Guest: " + firstName + " " + lastName,
        "Email: " + data.get("email"),
        "Phone: " + (data.get("phone") || "Not provided"),
        "Room: " + roomName,
        "Rate: " + rateName,
        "Arrival: " + dateText(arrival),
        "Departure: " + dateText(departure),
        "Guests: " + adults + " adults" + (children ? ", " + children + " children" : ""),
        "Rooms: " + rooms,
        "Length: " + nights + " nights",
        "Room estimate: " + money(baseTotal),
        "Extras: " + (extraNames.length ? extraNames.join(", ") : "None"),
        "Extras estimate: " + money(extrasTotal()),
        "Total estimate: " + money(baseTotal + extrasTotal()),
        "Special requests: " + (data.get("requests") || "None"),
        "",
        "DEMO ONLY: No reservation or payment has been made. All property, pricing and availability details are illustrative."
      ].join("\n");
      const result = $("#enquiry-result");
      const output = $("#enquiry-copy");
      if (result && output) {
        output.value = message;
        result.hidden = false;
        result.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest" });
      }
    });
    const copyButton = $("#copy-enquiry");
    if (copyButton) copyButton.addEventListener("click", async () => {
      const output = $("#enquiry-copy");
      const status = $("#copy-status");
      try {
        await navigator.clipboard.writeText(output.value);
        if (status) status.textContent = "Enquiry copied to your clipboard.";
      } catch {
        output.focus();
        output.select();
        const copied = document.execCommand("copy");
        if (status) status.textContent = copied ? "Enquiry copied to your clipboard." : "Select and copy the text above.";
      }
    });
  }
})();