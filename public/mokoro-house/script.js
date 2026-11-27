const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  siteNav?.classList.toggle('is-open', !isOpen);
});
siteNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});
const seasonContent = {
  rains: {range:'NOVEMBER – MARCH',title:'The land turns green.',description:'Summer rains refresh the wider landscape. The air grows heavy, grasses respond and the Delta\'s local water levels shift with the weather.',note:'A season of changing skies and fresh growth.',image:'https://images.pexels.com/photos/7002613/pexels-photo-7002613.jpeg?auto=compress&cs=tinysrgb&w=1200',alt:'An elephant moving through green grassland'},
  rise: {range:'APRIL – JUNE',title:'The river makes its way south.',description:'Floodwater from the upper catchment moves gradually through the Delta system. Its arrival is not a single moment, but a slow change in the waterways.',note:'A season of transition; timing varies with the year’s flow.',image:'https://images.pexels.com/photos/2015591/pexels-photo-2015591.jpeg?auto=compress&cs=tinysrgb&w=1200',alt:'Aerial view over a winding green water channel'},
  flood: {range:'JULY – SEPTEMBER',title:'Water meets the dry season.',description:'In many years, the incoming flood reaches broad parts of the Delta during Botswana\'s cooler, drier months. Channels widen and floodplains become vital water sources.',note:'The famous flood pulse, with access shaped by local conditions.',image:'https://images.pexels.com/photos/7235405/pexels-photo-7235405.jpeg?auto=compress&cs=tinysrgb&w=1200',alt:'Elephants walking along a Botswana riverbank'},
  recede: {range:'OCTOBER – NOVEMBER',title:'The edges begin to change.',description:'As the hot season builds, water can retreat from seasonal edges while permanent channels and pools continue to sustain life. The next rains begin to reshape the landscape.',note:'A quieter interval before the cycle begins again.',image:'https://images.pexels.com/photos/6790680/pexels-photo-6790680.jpeg?auto=compress&cs=tinysrgb&w=1200',alt:'A quiet safari lodge deck looking out over a natural landscape'}
};
const seasonTabs = [...document.querySelectorAll('.season-tab')];
const seasonPanel = document.querySelector('#season-panel');
const seasonImage = document.querySelector('#season-photo img');
seasonTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const data = seasonContent[tab.dataset.season];
    if (!data) return;
    seasonTabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', String(active));
      item.setAttribute('tabindex', active ? '0' : '-1');
    });
    document.querySelector('#season-kicker').textContent = data.range;
    document.querySelector('#season-title').textContent = data.title;
    document.querySelector('#season-description').textContent = data.description;
    document.querySelector('#season-footnote').textContent = data.note;
    seasonPanel.setAttribute('aria-labelledby', tab.id);
    seasonImage.style.opacity = '0.35';
    window.setTimeout(() => {
      seasonImage.src = data.image;
      seasonImage.alt = data.alt;
      seasonImage.onload = () => { seasonImage.style.opacity = '1'; };
    }, 120);
  });
});
const arrival = document.querySelector('#arrival');
const departure = document.querySelector('#departure');
const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
arrival.min = localToday;
departure.min = localToday;
arrival.addEventListener('change', () => {
  departure.min = arrival.value || localToday;
  if (departure.value && departure.value <= arrival.value) departure.value = '';
});
const enquiryForm = document.querySelector('#enquiry-form');
const briefResult = document.querySelector('#brief-result');
const briefText = document.querySelector('#brief-text');
const copyStatus = document.querySelector('#copy-status');
function formatDate(value) {
  if (!value) return 'Not selected';
  return new Intl.DateTimeFormat('en-GB', {day:'numeric',month:'long',year:'numeric'}).format(new Date(value + 'T12:00:00'));
}
enquiryForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!enquiryForm.reportValidity()) return;
  if (departure.value <= arrival.value) {
    departure.setCustomValidity('Choose a departure date after arrival.');
    departure.reportValidity();
    departure.setCustomValidity('');
    return;
  }
  const selectedInterests = [...enquiryForm.querySelectorAll('input[name="interest"]:checked')].map((input) => input.value);
  const note = document.querySelector('#guest-note').value.trim();
  const lines = [
    'MOKORO HOUSE · IMAGINED STAY BRIEF','',
    'Arrival: ' + formatDate(arrival.value),
    'Departure: ' + formatDate(departure.value),
    'Guests: ' + document.querySelector('#guests').value,
    'Stay style: ' + document.querySelector('#stay-choice').value,
    'Interests: ' + (selectedInterests.length ? selectedInterests.join(', ') : 'Open to suggestions'),
    '',
    'Note: ' + (note || 'No additional note.'),
    '',
    'This brief was generated by a website concept demo. It is not a booking or a real reservation request.'
  ];
  briefText.textContent = lines.join('\n');
  enquiryForm.hidden = true;
  briefResult.hidden = false;
  briefResult.scrollIntoView({behavior:'smooth',block:'nearest'});
});
document.querySelector('#copy-brief').addEventListener('click', async () => {
  const text = briefText.textContent;
  try {
    await navigator.clipboard.writeText(text);
    copyStatus.textContent = 'Brief copied.';
  } catch {
    const helper = document.createElement('textarea');
    helper.value = text;
    helper.setAttribute('readonly', '');
    helper.style.position = 'absolute';
    helper.style.left = '-9999px';
    document.body.appendChild(helper);
    helper.select();
    const copied = document.execCommand('copy');
    helper.remove();
    copyStatus.textContent = copied ? 'Brief copied.' : 'Select the brief above and copy it manually.';
  }
});
document.querySelector('#edit-brief').addEventListener('click', () => {
  briefResult.hidden = true;
  enquiryForm.hidden = false;
  copyStatus.textContent = '';
  enquiryForm.scrollIntoView({behavior:'smooth',block:'center'});
});