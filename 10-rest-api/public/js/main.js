var serverAPI = 'http://localhost:3000/api';

if (document.getElementById('signup-form')) {
  var signupForm = document.getElementById('signup-form');


  signupForm.addEventListener('submit', function (evt) {
    evt.preventDefault();

    var obj = {};
    var formData = new FormData(signupForm);
    formData.forEach(function (value, key) {
      obj[key] = value;
    });

    axios.post(`${serverAPI}/auth/signup`, obj)
      .then((res) => {
        console.log(res.data)
        if (res.data.redirect == '/') {
          window.location = "/index"
        } else if (res.data.redirect == '/login') {
          window.location = "/login"
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

if (document.getElementById('login-form')) {
  var loginForm = document.getElementById('login-form');
  var messageBox = document.getElementById('msg-box')

  loginForm.addEventListener('submit', function (evt) {
    evt.preventDefault();

    var obj = {};
    var formData = new FormData(loginForm);
    formData.forEach(function (value, key) {
      obj[key] = value;
    });

    axios.post(`${serverAPI}/auth/login`, obj)
      .then((res) => {
        window.location = '/';
      })
      .catch((err) => {
        console.log(err);

        if (err.response.status === 500) {
          messageBox.innerHTML = 'Неверный E-mail или пароль';
        }

        messageBox.className = '';
        messageBox.classList.add('message', 'message-error');
        messageBox.style.display = 'block';
      });
  });
}

if (document.getElementById('create-course-form')) {
  var createCourseForm = document.getElementById('create-course-form');
  var lessonsList = document.getElementById('lessons-list');
  var addLessonButton = document.getElementById('add-lesson');
  var addFileButtons;

  var lessonsCounter = 0;

  addLessonButton.addEventListener('click', function (evt) {
    evt.preventDefault();

    var lesson = document.createElement('div');
    lesson.innerHTML = `
      <input type="hidden" class="lesson-counter" value=${lessonsCounter}>
      <label for="lessons[${lessonsCounter}][title]">
        <span>${lessonsCounter + 1}.</span> <input type="text" name="lessons[${lessonsCounter}][title]", placeholder="Название урока">
      </label>
      `;

    lessonsList.append(lesson);

    lessonsCounter += 1;
  });

  createCourseForm.addEventListener('submit', function (evt) {
    evt.preventDefault();

    var formData = new FormData(createCourseForm);

    axios.post(`${serverAPI}/courses`, formData)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

if (document.getElementById('edit-course-form')) {
  var editCourseForm = document.getElementById('edit-course-form');
  var courseId = document.getElementById('id').value;
  var lessonsList = document.getElementById('lessons-list');
  var lessonDeleteButtons = document.querySelectorAll('.lesson-delete');
  var addLessonButton = document.getElementById('add-lesson');
  var accessList = document.getElementById('access-list');
  var accessListButton = document.getElementById('access-list-btn');
  var messageBox = document.getElementById('msg-box');

  lessonDeleteButtons.forEach(btn => {
    btn.addEventListener('click', (evt) => {
      evt.preventDefault();

      evt.target.parentNode.remove();
    })
  })

  addLessonButton.addEventListener('click', function (evt) {
    evt.preventDefault();


    var lessonsCounter = document.getElementsByClassName('lesson-counter').length;
    var lesson = document.createElement('div');
    lesson.innerHTML = `
      <input type="hidden" class="lesson-counter" value=${lessonsCounter}>
      <label for="lessons[${lessonsCounter}][title]">
        <span>${lessonsCounter + 1}.</span> <input type="text" name="lessons[${lessonsCounter}][title]", placeholder="Название урока">
      </label>
      `;

    lessonsList.append(lesson);

    lessonsCounter += 1;
  });

  accessListButton.addEventListener('click', function (evt) {
    evt.preventDefault();

    var emailSearch = document.getElementById('access-list-input').value;

    axios.get(`${serverAPI}/users/search?email=${emailSearch}`)
      .then(function (response) {
        var row = document.createElement('div');
        row.innerHTML = `
          <input type="checkbox" type="checkbox" name="access" value=${response.data.id} checked> ${response.data.firstName} ${response.data.lastName} (${response.data.email})
        `;

        accessList.append(row);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  });

  editCourseForm.addEventListener('submit', function (evt) {
    evt.preventDefault();

    var formData = new FormData(editCourseForm);

    axios.put(`${serverAPI}/courses/${courseId}`, formData)
      .then((res) => {
        messageBox.innerHTML = 'Изменения успешно сохранены';
        messageBox.className = '';
        messageBox.classList.add('message', 'message-success');
        messageBox.style.display = 'block';

        setTimeout(() => {
          messageBox.style.display = 'none';
        }, 5000);
      })
      .catch((err) => {
        console.log(err);

        if (err.response.status === 401) {
          messageBox.innerHTML = 'Недостаточно прав для сохранения';
        }

        messageBox.className = '';
        messageBox.classList.add('message', 'message-error');
        messageBox.style.display = 'block';

        setTimeout(() => {
          messageBox.style.display = 'none';
        }, 5000);
      });
  });

  document.getElementById('delete').addEventListener('click', function (evt) {
    evt.preventDefault();

    document.getElementById('delete-form').style.display = 'block';
  });

  document.getElementById('delete-confirm').addEventListener('click', function (evt) {
    evt.preventDefault();

    axios.delete(`${serverAPI}/courses/${courseId}`)
      .then((res) => {
        messageBox.innerHTML = 'Курс успешно удалён';
        messageBox.className = '';
        messageBox.classList.add('message', 'message-success');
        messageBox.style.display = 'block';

        setTimeout(() => {
          window.location = '/';
        }, 5000);
      })
      .catch((err) => {
        console.log(err);

        if (err.response.status === 401) {
          messageBox.innerHTML = 'Недостаточно прав для удаления';
        }

        messageBox.className = '';
        messageBox.classList.add('message', 'message-error');
        messageBox.style.display = 'block';

        setTimeout(() => {
          messageBox.style.display = 'none';
        }, 5000);
      });
  });
}

if (document.getElementById('edit-lesson-form')) {
  var editLessonForm = document.getElementById('edit-lesson-form');
  var courseId = document.getElementById('id').value;
  var lessonId = document.getElementById('lid').value;
  var addFileButton = document.getElementById('add-file');
  var addLinkButton = document.getElementById('add-link');

  addFileButton.addEventListener('click', function (evt) {
    evt.preventDefault();

    var newInput = document.createElement('label');
    newInput.innerHTML = `<input type="file" name="attachments">`;

    evt.target.parentNode.querySelector('#attachments').append(newInput);
  });

  addLinkButton.addEventListener('click', function (evt) {
    evt.preventDefault();

    var newInput = document.createElement('label');
    newInput.innerHTML = `<input type="text" name="links", placeholder="Адрес ссылки">`;

    evt.target.parentNode.querySelector('#attachments').append(newInput);
  });

  editLessonForm.addEventListener('submit', function (evt) {
    evt.preventDefault();

    var formData = new FormData(editLessonForm);

    axios.put(`${serverAPI}/courses/${courseId}/lessons/${lessonId}`, formData)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  });
}
