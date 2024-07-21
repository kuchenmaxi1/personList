const firebaseConfig = {
  apiKey: "AIzaSyCFAlpxUK26XJqZ86kBYhofJlapxh6Ajds",
  authDomain: "maxrat-5d14a.firebaseapp.com",
  databaseURL: "https://maxrat-5d14a-default-rtdb.firebaseio.com",
  projectId: "maxrat-5d14a",
  storageBucket: "maxrat-5d14a.appspot.com",
  messagingSenderId: "908892453787",
  appId: "1:908892453787:web:abe94d1faea8b80ef1bf3e",
  measurementId: "G-E9BP785SF5"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

$(document).ready(function () {
  const password = "MNLHLj!";

  $('#loginButton').click(function () {
    if ($('#password').val() === password) {
      $('#login').hide();
      $('#content').show();
      loadPersons();
    } else {
      alert('Falsches Passwort');
    }
  });

  $('#addPersonButton').click(function () {
    clearForm();
    $('#personModalLabel').text('Person hinzufügen');
    $('#personModal').modal('show');
  });

  $('#personForm').submit(function (event) {
    event.preventDefault();
    const personId = $('#personId').val();
    const personData = getFormData();
    if (personId) {
      updatePerson(personId, personData);
    } else {
      addPerson(personData);
    }
    $('#personModal').modal('hide');
  });

  $('#geschlecht').change(function () {
    const geschlecht = $(this).val();
    generateAdditionalFields(geschlecht);
  });

  function getFormData() {
    const formData = {
      vorname: $('#vorname').val(),
      nachname: $('#nachname').val(),
      alter: $('#alter').val(),
      geschlecht: $('#geschlecht').val(),
      pubertät: $('#pubertät').val(),
      aussehen: $('#aussehen').val(),
      allgemeineStatur: $('#allgemeineStatur').val(),
      sixpack: $('#sixpack').val(),
      muskeln: $('#muskeln').val(),
      jungfrau: $('#jungfrau').val(),
      crushBeziehung: $('#crushBeziehung').val(),
      sexuelleVorlieben: $('#sexuelleVorlieben').val(),
    };
    if (formData.geschlecht === 'weiblich') {
      formData.busengroesse = $('#busengroesse').val();
      formData.busenbetont = $('#busenbetont').val();
      formData.vaginaBehaart = $('#vaginaBehaart').val();
      formData.hinterteil = $('#hinterteil').val();
    } else if (formData.geschlecht === 'männlich') {
      formData.penislänge = $('#penislaenge').val();
      formData.penisbehaarung = $('#penisbehaarung').val();
      formData.hinterteil = $('#hinterteil').val();
    }
    return formData;
  }

  function generateAdditionalFields(geschlecht) {
    let fields = '';
    if (geschlecht === 'weiblich') {
      fields += `
        <div class="mb-3">
          <label for="busengroesse" class="form-label">Busengröße</label>
          <input type="text" class="form-control" id="busengroesse">
        </div>
        <div class="mb-3">
          <label for="busenbetont" class="form-label">Busenbetont</label>
          <select class="form-control" id="busenbetont">
            <option value="ja">Ja</option>
            <option value="nein">Nein</option>
          </select>
        </div>
        <div class="mb-3">
          <label for="vaginaBehaart" class="form-label">Vagina Behaart</label>
          <input type="text" class="form-control" id="vaginaBehaart">
        </div>
        <div class="mb-3">
          <label for="hinterteil" class="form-label">Hinterteil</label>
          <input type="text" class="form-control" id="hinterteil">
        </div>`;
    } else if (geschlecht === 'männlich') {
      fields += `
        <div class="mb-3">
          <label for="penislaenge" class="form-label">Penis Länge</label>
          <input type="text" class="form-control" id="penislaenge">
        </div>
        <div class="mb-3">
          <label for="penisbehaarung" class="form-label">Penis Behaarung</label>
          <input type="text" class="form-control" id="penisbehaarung">
        </div>
        <div class="mb-3">
          <label for="hinterteil" class="form-label">Hinterteil</label>
          <input type="text" class="form-control" id="hinterteil">
        </div>`;
    }
    fields += `
      <div class="mb-3">
        <label for="pubertät" class="form-label">Pubertät</label>
        <input type="text" class="form-control" id="pubertät">
      </div>
      <div class="mb-3">
        <label for="aussehen" class="form-label">Aussehen</label>
        <input type="text" class="form-control" id="aussehen">
      </div>
      <div class="mb-3">
        <label for="allgemeineStatur" class="form-label">Allgemeine Statur</label>
        <input type="text" class="form-control" id="allgemeineStatur">
      </div>
      <div class="mb-3">
        <label for="sixpack" class="form-label">Sixpack</label>
        <input type="text" class="form-control" id="sixpack">
      </div>
      <div class="mb-3">
        <label for="muskeln" class="form-label">Muskeln</label>
        <input type="text" class="form-control" id="muskeln">
      </div>
      <div class="mb-3">
        <label for="jungfrau" class="form-label">Jungfrau</label>
        <select class="form-control" id="jungfrau">
          <option value="ja">Ja</option>
          <option value="nein">Nein</option>
        </select>
      </div>
      <div class="mb-3">
        <label for="crushBeziehung" class="form-label">Crush/Beziehung</label>
        <input type="text" class="form-control" id="crushBeziehung">
      </div>
      <div class="mb-3">
        <label for="sexuelleVorlieben" class="form-label">Sexuelle Vorlieben/Präferenzen</label>
        <input type="text" class="form-control" id="sexuelleVorlieben">
      </div>`;
    $('#additionalFields').html(fields);
  }

  function clearForm() {
    $('#personId').val('');
    $('#vorname').val('');
    $('#nachname').val('');
    $('#alter').val('');
    $('#geschlecht').val('');
    $('#additionalFields').html('');
  }

  function loadPersons() {
    firebase.database().ref('persons').on('value', (snapshot) => {
      const persons = snapshot.val();
      let personsList = '';
      for (let id in persons) {
        personsList += `
          <div class="card mb-3">
            <div class="card-body">
              <h5 class="card-title">${persons[id].vorname} ${persons[id].nachname}</h5>
              <p class="card-text">Alter: ${persons[id].alter}</p>
              <p class="card-text">Geschlecht: ${persons[id].geschlecht}</p>
              <button class="btn btn-primary" onclick="editPerson('${id}')">Bearbeiten</button>
              <button class="btn btn-danger" onclick="deletePerson('${id}')">Löschen</button>
            </div>
          </div>`;
      }
      $('#personsList').html(personsList);
    });
  }

  function addPerson(personData) {
    const newPersonKey = firebase.database().ref().child('persons').push().key;
    const updates = {};
    updates['/persons/' + newPersonKey] = personData;
    return firebase.database().ref().update(updates);
  }

  function updatePerson(personId, personData) {
    const updates = {};
    updates['/persons/' + personId] = personData;
    return firebase.database().ref().update(updates);
  }

  window.editPerson = function (personId) {
    firebase.database().ref('persons/' + personId).once('value').then((snapshot) => {
      const person = snapshot.val();
      $('#personId').val(personId);
      $('#vorname').val(person.vorname);
      $('#nachname').val(person.nachname);
      $('#alter').val(person.alter);
      $('#geschlecht').val(person.geschlecht);
      generateAdditionalFields(person.geschlecht);
      if (person.geschlecht === 'weiblich') {
        $('#busengroesse').val(person.busengroesse);
        $('#busenbetont').val(person.busenbetont);
        $('#vaginaBehaart').val(person.vaginaBehaart);
        $('#hinterteil').val(person.hinterteil);
      } else if (person.geschlecht === 'männlich') {
        $('#penislaenge').val(person.penislänge);
        $('#penisbehaarung').val(person.penisbehaarung);
        $('#hinterteil').val(person.hinterteil);
      }
      $('#pubertät').val(person.pubertät);
      $('#aussehen').val(person.aussehen);
      $('#allgemeineStatur').val(person.allgemeineStatur);
      $('#sixpack').val(person.sixpack);
      $('#muskeln').val(person.muskeln);
      $('#jungfrau').val(person.jungfrau);
      $('#crushBeziehung').val(person.crushBeziehung);
      $('#sexuelleVorlieben').val(person.sexuelleVorlieben);
      $('#personModalLabel').text('Person bearbeiten');
      $('#personModal').modal('show');
    });
  }

  window.deletePerson = function (personId) {
    if (confirm('Möchten Sie diese Person wirklich löschen?')) {
      firebase.database().ref('persons/' + personId).remove();
    }
  }
});
