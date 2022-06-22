var instance = axios.create({
  // baseURL: 'http://localhost:3000/',
  // withCredentials: true,
});

function createErrorMessage(messageText) {
  var element = document.createElement('div');
  element.innerText = messageText;

  element.classList.add('alert', 'alert-danger');
  element.setAttribute('role', 'alert');

  return element;
}

function createSuccessMessage(messageText) {
  var element = document.createElement('div');
  element.innerText = messageText;

  element.classList.add('alert', 'alert-success');
  element.setAttribute('role', 'alert');

  return element;
}

// LOGIN
if (document.getElementById('form-login')) {
  const validation = new JustValidate('#form-login');

  validation
    .addField('#login', [
      {
        rule: 'required',
        errorMessage: 'Обязательное поле',
      },
    ])
    .addField('#password', [
      {
        rule: 'required',
        errorMessage: 'Обязательное поле',
      },
    ])
    .onSuccess((event) => {
      var messageBox = document.getElementById('message-box');
      if (messageBox.firstChild) messageBox.removeChild(messageBox.firstChild);

      var authData = {
        login: document.getElementById('login').value,
        password: document.getElementById('password').value
      };

      instance.post('/api/auth/login', authData)
        .then(() => {
          window.location.replace('/my');
        })
        .catch((err) => {
          messageBox.append(createErrorMessage(err.response.data.message))
        });
    });
}

// REGISTER
if (document.getElementById('form-register')) {
  const validation = new JustValidate('#form-register');
  const selector = document.getElementById("phone");
  const im = new Inputmask("8 (999) 999-99-99");

  im.mask(selector);

  validation
    .addField('#first_name', [
      {
        rule: 'minLength',
        value: 2,
        errorMessage: 'Минимальная длина - 2 символа',
      },
      {
        rule: 'maxLength',
        value: 55,
        errorMessage: 'Максимальная длина - 55 символов',
      },
    ])
    .addField('#email', [
      {
        validator: (value, fields) => {
          var emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

          return value.match(emailRegex) || value.length === 0;
        },
        errorMessage: 'Некорректный адрес электронной почты',
      },
    ])
    .addField('#phone', [
      {
        validator: (value, fields) => {
          return selector.inputmask.unmaskedvalue().length === 0 || selector.inputmask.unmaskedvalue().length === 10;
        },
        errorMessage: 'Некорректный номер телефона',
      },
    ])
    .addField('#password', [
      {
        rule: 'required',
        errorMessage: 'Обязательное поле',
      },
      {
        rule: 'minLength',
        value: 4,
        errorMessage: 'Минимальная длина - 4 символа',
      },
    ])
    .addField('#password2', [
      {
        rule: 'required',
        errorMessage: 'Обязательное поле',
      },
      {
        validator: (value, fields) => {
          if (fields['#password'] && fields['#password'].elem) {
            const repeatPasswordValue = fields['#password'].elem.value;

            return value === repeatPasswordValue;
          }

          return true;
        },
        errorMessage: 'Пароли не совпадают',
      },
    ])
    .onSuccess((event) => {
      var messageBox = document.getElementById('message-box');
      if (messageBox.firstChild) messageBox.removeChild(messageBox.firstChild);

      var formData = new FormData(document.getElementById('form-register'));

      instance.post('/api/users', formData)
        .then(() => {
          window.location.replace('/enter');
        })
        .catch((err) => {
          messageBox.append(createErrorMessage(err.response.data.message))
          messageBox.scrollIntoView();
        });
    });
}

if (document.getElementById('form-ads-contact-edit')) {
  const validation = new JustValidate('#form-ads-contact-edit');
  const selector = document.getElementById("phone");
  const im = new Inputmask("8 (999) 999-99-99");

  im.mask(selector);

  validation
    .addField('#name', [
      {
        rule: 'required',
        errorMessage: 'Обязательное поле',
      },
      {
        rule: 'minLength',
        value: 2,
        errorMessage: 'Минимальная длина - 2 символа',
      },
      {
        rule: 'maxLength',
        value: 55,
        errorMessage: 'Максимальная длина - 55 символов',
      },
    ])
    .addField('#email', [
      {
        validator: (value, fields) => {
          var emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

          return value.match(emailRegex) || value.length === 0;
        },
        errorMessage: 'Некорректный адрес электронной почты',
      },
    ])
    .addField('#phone', [
      {
        rule: 'required',
        errorMessage: 'Обязательное поле',
      },
      {
        validator: (value, fields) => {
          return selector.inputmask.unmaskedvalue().length === 0 || selector.inputmask.unmaskedvalue().length === 10;
        },
        errorMessage: 'Некорректный номер телефона',
      },
    ])
    .onSuccess((event) => {
      var userId = document.getElementById('id').value;
      var messageBox = document.getElementById('message-box');
      if (messageBox.firstChild) messageBox.removeChild(messageBox.firstChild);

      var formData = new FormData(document.getElementById('form-ads-contact-edit'));

      instance.put(`/api/users/${userId}/contact`, formData)
        .then(() => {
          window.location.replace('/my/cabinet/ads/contact');
        })
        .catch((err) => {
          messageBox.append(createErrorMessage(err.response.data.message))
          messageBox.scrollIntoView();
        });
    });
}

if (document.getElementById('form-gallery-album-add')) {
  const validation = new JustValidate('#form-gallery-album-add');

  validation
    .addField('#title', [
      {
        rule: 'required',
        errorMessage: 'Обязательное поле',
      },
      {
        rule: 'minLength',
        value: 4,
        errorMessage: 'Минимальная длина - 4 символа',
      },
      {
        rule: 'maxLength',
        value: 255,
        errorMessage: 'Максимальная длина - 255 символов',
      },
    ])
    .addField('#event-date', [
      {
        rule: 'required',
        errorMessage: 'Обязательное поле',
      },
    ])
    .addField('#description', [
      {
        rule: 'maxLength',
        value: 255,
        errorMessage: 'Максимальная длина - 255 символов',
      },
    ])
    .addField('#category', [
      {
        rule: 'required',
        errorMessage: 'Обязательное поле',
      },
    ])
    .addField('#cover', [
      {
        rule: 'maxFilesCount',
        value: 1,
        errorMessage: 'Максимальное количество файлов - 1',
      },
      {
        rule: 'files',
        value: {
          files: {
            extensions: ['JPG', 'jpg', 'jpeg', 'png', 'webp'],
            maxSize: 5e+6,
            minSize: 1000,
            types: ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'],
          },
        },
      },
    ])
    .onSuccess((event) => {
      var messageBox = document.getElementById('message-box');
      if (messageBox.firstChild) messageBox.removeChild(messageBox.firstChild);

      var formData = new FormData(document.getElementById('form-gallery-album-add'));

      instance.post('/api/gallery', formData)
        .then(() => {
          window.location.replace('/my/cabinet/gallery');
        })
        .catch((err) => {
          messageBox.append(createErrorMessage(err.response.data.message))
          messageBox.scrollIntoView();
        });
    });
}

if (document.getElementById('form-gallery-album-edit')) {
  const validation = new JustValidate('#form-gallery-album-edit');

  validation
    .addField('#title', [
      {
        rule: 'required',
        errorMessage: 'Обязательное поле',
      },
      {
        rule: 'minLength',
        value: 4,
        errorMessage: 'Минимальная длина - 4 символа',
      },
      {
        rule: 'maxLength',
        value: 255,
        errorMessage: 'Максимальная длина - 255 символов',
      },
    ])
    .addField('#event-date', [
      {
        rule: 'required',
        errorMessage: 'Обязательное поле',
      },
    ])
    .addField('#description', [
      {
        rule: 'maxLength',
        value: 255,
        errorMessage: 'Максимальная длина - 255 символов',
      },
    ])
    .addField('#category', [
      {
        rule: 'required',
        errorMessage: 'Обязательное поле',
      },
    ])
    .addField('#cover', [
      {
        rule: 'maxFilesCount',
        value: 1,
        errorMessage: 'Максимальное количество файлов - 1',
      },
      {
        rule: 'files',
        value: {
          files: {
            extensions: ['JPG', 'jpg', 'jpeg', 'png', 'webp'],
            maxSize: 5e+6,
            minSize: 1000,
            types: ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'],
          },
        },
      },
    ])
    .onSuccess((event) => {
      var albumId = document.getElementById('id').value;
      var messageBox = document.getElementById('message-box');
      if (messageBox.firstChild) messageBox.removeChild(messageBox.firstChild);

      var formData = new FormData(document.getElementById('form-gallery-album-edit'));

      instance.put(`/api/gallery/${albumId}`, formData)
        .then(() => {
          window.location.replace('/my/cabinet/gallery');
        })
        .catch((err) => {
          messageBox.append(createErrorMessage(err.response.data.message))
          messageBox.scrollIntoView();
        });
    });
}

if (document.getElementById('form-gallery-album-status')) {
  const validation = new JustValidate('#form-gallery-album-status');

  validation
    .onSuccess((event) => {
      var albumId = document.getElementById('id').value;
      var messageBox = document.getElementById('message-box-status');
      if (messageBox.firstChild) messageBox.removeChild(messageBox.firstChild);

      var formData = new FormData(document.getElementById('form-gallery-album-status'));

      instance.put(`/api/gallery/${albumId}`, formData)
        .then(() => {
          messageBox.append(createSuccessMessage('Статус успешно обновлен'));
        })
        .catch((err) => {
          messageBox.append(createErrorMessage(err.response.data.message));
          messageBox.scrollIntoView();
        });
    });
}

if (document.getElementById('form-gallery-album-delete')) {
  const validation = new JustValidate('#form-gallery-album-delete');

  validation
    .onSuccess((event) => {
      var albumId = document.getElementById('id').value;
      var messageBox = document.getElementById('message-box-delete');
      if (messageBox.firstChild) messageBox.removeChild(messageBox.firstChild);

      var formData = new FormData(document.getElementById('form-gallery-album-delete'));

      instance.delete(`/api/gallery/${albumId}`, formData)
        .then(() => {
          window.location.replace('/my/cabinet/gallery');
        })
        .catch((err) => {
          messageBox.append(createErrorMessage(err.response.data.message));
          messageBox.scrollIntoView();
        });
    });
}

if (document.getElementById('form-gallery-photos-add')) {
  const validation = new JustValidate('#form-gallery-photos-add');

  validation
    .addField('#photos', [
      {
        rule: 'minFilesCount',
        value: 1,
        errorMessage: 'Минимальное количество файлов - 1',
      },
      {
        rule: 'files',
        value: {
          files: {
            extensions: ['JPG', 'jpg', 'jpeg', 'png', 'webp'],
            maxSize: 5e+6,
            minSize: 1000,
            types: ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'],
          },
        },
      },
    ])
    .onSuccess((event) => {
      var albumId = document.getElementById('id').value;
      var messageBox = document.getElementById('message-box');
      if (messageBox.firstChild) messageBox.removeChild(messageBox.firstChild);

      var formData = new FormData(document.getElementById('form-gallery-photos-add'));

      instance.post(`/api/gallery/${albumId}/photos`, formData)
        .then(() => {
          window.location.replace('/my/cabinet/gallery');
        })
        .catch((err) => {
          messageBox.append(createErrorMessage(err.response.data.message))
          messageBox.scrollIntoView();
        });
    });
}

if (document.getElementById('form-ads-add')) {
  const validation = new JustValidate('#form-ads-add');

  document.getElementById('category').addEventListener('change', (evt) => {
    if (evt.target.value == 1) {
      document.querySelector('.ads__subclass').style.display = 'none';
    } else {
      const categoryId = document.getElementById('category').value;

      instance.get(`/api/ads/category/${categoryId}`)
        .then((res) => {
          const subcategorySelect = document.getElementById('subcategory');

          res.data.forEach(element => {
            var option = document.createElement('option');
            option.innerText = element.title;

            option.setAttribute('value', element.id);
            option.setAttribute('template', element.template_name);
            subcategorySelect.appendChild(option);
          });
        })
        .catch((err) => {
          console.log(err);
        });

      document.querySelector('.ads__subclass').style.display = 'block';
    }
  });

  validation
    .addField('#category', [
      {
        rule: 'required',
        errorMessage: 'Обязательное поле',
      },
    ])
    .addField('#subcategory', [
      {
        validator: (value, fields) => {
          const subCategorySelected = fields['#category'].elem.value > 1 && value > 0;

          return fields['#category'].elem.value == 1 || subCategorySelected;
        },
        errorMessage: 'Обязательное поле',
      },
    ])
    .onSuccess((event) => {
      var categoryTemplate = event.target.querySelector('#subcategory').options[event.target.querySelector('#subcategory').selectedIndex].getAttribute("template") || event.target.querySelector('#category').options[event.target.querySelector('#category').selectedIndex].getAttribute("template");

      var messageBox = document.getElementById('message-box');
      if (messageBox.firstChild) messageBox.removeChild(messageBox.firstChild);

      window.location.replace(`/my/cabinet/ads/add/${categoryTemplate}`);
    });
}

if (document.getElementById('form-ads-add-new')) {
  const adType = document.getElementById('type').value;
  const validation = new JustValidate('#form-ads-add-new');
  let hasCities = false;

  document.getElementById('brand').addEventListener('change', (evt) => {
    const brandSelect = document.getElementById('brand');
    const brandName = brandSelect.value;
    const subcategorySelect = document.getElementById('model');
    const disabled = document.createElement('option');
    disabled.setAttribute('disabled', '');
    disabled.setAttribute('selected', '');
    disabled.innerText = 'Модель...';
    subcategorySelect.innerHTML = '';
    subcategorySelect.appendChild(disabled);

    instance.get(`/api/car/${brandName}`)
      .then((res) => {
        res.data.forEach(element => {
          var option = document.createElement('option');
          option.innerText = element.model;

          option.setAttribute('value', element.id);
          subcategorySelect.appendChild(option);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });

  document.getElementById('model').addEventListener('change', (evt) => {
    var brand = document.getElementById('brand').value;
    var newBlock = document.createElement('div');
    newBlock.classList.add('col-lg-3');
    newBlock.classList.add('checkbox');
    newBlock.innerHTML = `
        <input type="checkbox" id="carId-${evt.target.value}" name="cars" checked>
        <label for="carId-${evt.target.value}">${brand} ${document.getElementById('model').options[document.getElementById('model').selectedIndex].text}</label>
    `;

    document.getElementById('cars').appendChild(newBlock);
  });

  document.getElementById('region').addEventListener('change', (evt) => {
    const region = document.getElementById('region').value;

    instance.get(`/api/location/${region}/cities`)
      .then((res) => {
        if (res.data.length !== 0) {
          hasCities = true;
          const citySelect = document.getElementById('city');

          res.data.forEach(element => {
            var option = document.createElement('option');
            option.innerText = element.city;

            option.setAttribute('value', element.id);
            citySelect.appendChild(option);
          });

          document.querySelector('.city').style.display = 'block';
        } else {
          document.querySelector('.city').style.display = 'none';
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

  if (adType === 'autos') {
    validation
      .addField('#brand', [
        {
          rule: 'required',
          errorMessage: 'Обязательное поле',
        },
      ])
      .addField('#model', [
        {
          rule: 'required',
          errorMessage: 'Обязательное поле',
        },
      ])
      .addField('#isOwner', [
        {
          rule: 'required',
          errorMessage: 'Обязательное поле',
        },
      ])
      .addField('#engineType', [
        {
          rule: 'required',
          errorMessage: 'Обязательное поле',
        },
      ])
      .addField('#transmission', [
        {
          rule: 'required',
          errorMessage: 'Обязательное поле',
        },
      ])
      .addField('#year', [
        {
          rule: 'required',
          errorMessage: 'Обязательное поле',
        },
      ])
      .addField('#state', [
        {
          rule: 'required',
          errorMessage: 'Обязательное поле',
        },
      ])
      .addField('#price', [
        {
          rule: 'required',
          errorMessage: 'Обязательное поле',
        },
      ])
      .addField('#region', [
        {
          rule: 'required',
          errorMessage: 'Обязательное поле',
        },
      ])
      .addField('#city', [
        {
          validator: (value, fields) => {
            return value > 0 && hasCities || !hasCities;
          },
          errorMessage: 'Обязательное поле',
        },
      ])
      .onSuccess((event) => {
        var formData = new FormData(document.getElementById('form-ads-add-new'));

        var messageBox = document.getElementById('message-box');
        if (messageBox.firstChild) messageBox.removeChild(messageBox.firstChild);

        instance.post('/api/ads', formData)
          .then(() => {
            window.location.replace('/my/cabinet/ads');
          })
          .catch((err) => {
            messageBox.append(createErrorMessage(err.response.data.message))
            messageBox.scrollIntoView();
          });
      });
  } else {
    validation
      .addField('#title', [
        {
          rule: 'required',
          errorMessage: 'Обязательное поле',
        },
      ])
      .addField('#price', [
        {
          rule: 'required',
          errorMessage: 'Обязательное поле',
        },
      ])
      .addField('#region', [
        {
          rule: 'required',
          errorMessage: 'Обязательное поле',
        },
      ])
      .addField('#city', [
        {
          validator: (value, fields) => {
            return value > 0 && hasCities || !hasCities;
          },
          errorMessage: 'Обязательное поле',
        },
      ])
      .onSuccess((event) => {
        var formData = new FormData(document.getElementById('form-ads-add-new'));

        var messageBox = document.getElementById('message-box');
        if (messageBox.firstChild) messageBox.removeChild(messageBox.firstChild);

        instance.post('/api/ads', formData)
          .then(() => {
            window.location.replace('/my/cabinet/ads');
          })
          .catch((err) => {
            messageBox.append(createErrorMessage(err.response.data.message))
            messageBox.scrollIntoView();
          });
      });
  }
}

if (document.getElementById('form-ads-auto-edit')) {
  const validation = new JustValidate('#form-ads-auto-edit');
  let hasCities = false;
  const id = document.getElementById('id').value;
  const car = document.getElementById('car').value;
  const brandSelect = document.getElementById('brand');
  const brandName = brandSelect.value;
  const subcategorySelect = document.getElementById('model');
  const disabled = document.createElement('option');
  disabled.setAttribute('disabled', '');
  disabled.setAttribute('selected', '');
  disabled.innerText = 'Модель...';
  subcategorySelect.innerHTML = '';
  subcategorySelect.appendChild(disabled);

  instance.get(`/api/car/${brandName}`)
    .then((res) => {
      res.data.forEach(element => {
        var option = document.createElement('option');
        option.innerText = element.model;

        option.setAttribute('value', element.id);
        subcategorySelect.appendChild(option);
      });
    })
    .catch((err) => {
      console.log(err);
    });


  document.getElementById('model').addEventListener('change', (evt) => {
    var brand = document.getElementById('brand').value;
    var newBlock = document.createElement('div');
    newBlock.classList.add('col-lg-3');
    newBlock.classList.add('checkbox');
    newBlock.innerHTML = `
        <input type="checkbox" id="carId-${evt.target.value}" name="cars" value=${evt.target.value} checked>
        <label for="carId-${evt.target.value}">${brand} ${document.getElementById('model').options[document.getElementById('model').selectedIndex].text}</label>
    `;

    document.getElementById('cars').appendChild(newBlock);
  });


  if (document.getElementById('closeBtn')) {
    document.getElementById('closeBtn').addEventListener('click', (evt) => {
      instance.put(`/api/ads/${id}-${car}`, { is_active: false })
        .then((res) => {
          window.location.replace('/my/cabinet/ads');
        })
        .catch((err) => {
          console.log(err);
        });
    });
  } else {

    document.getElementById('openBtn').addEventListener('click', (evt) => {
      instance.put(`/api/ads/${id}-${car}`, { is_active: true })
        .then((res) => {
          window.location.replace('/my/cabinet/ads');
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  document.getElementById('brand').addEventListener('change', (evt) => {
    const brandName = document.getElementById('brand').value;

    instance.get(`/api/car/${brandName}`)
      .then((res) => {
        const subcategorySelect = document.getElementById('model');

        res.data.forEach(element => {
          var option = document.createElement('option');
          option.innerText = element.model;

          option.setAttribute('value', element.id);
          subcategorySelect.appendChild(option);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });

  document.getElementById('region').addEventListener('change', (evt) => {
    const region = document.getElementById('region').value;

    instance.get(`/api/location/${region}/cities`)
      .then((res) => {
        if (res.data.length !== 0) {
          hasCities = true;
          const citySelect = document.getElementById('city');

          res.data.forEach(element => {
            var option = document.createElement('option');
            option.innerText = element.city;

            option.setAttribute('value', element.id);
            citySelect.appendChild(option);
          });

          document.querySelector('.city').style.display = 'block';
        } else {
          document.querySelector('.city').style.display = 'none';
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
  if (car) {
    validation
      .addField('#brand', [
        {
          rule: 'required',
          errorMessage: 'Обязательное поле',
        },
      ])
      .addField('#model', [
        {
          rule: 'required',
          errorMessage: 'Обязательное поле',
        },
      ])
      .addField('#isOwner', [
        {
          rule: 'required',
          errorMessage: 'Обязательное поле',
        },
      ])
      .addField('#engineType', [
        {
          rule: 'required',
          errorMessage: 'Обязательное поле',
        },
      ])
      .addField('#transmission', [
        {
          rule: 'required',
          errorMessage: 'Обязательное поле',
        },
      ])
      .addField('#year', [
        {
          rule: 'required',
          errorMessage: 'Обязательное поле',
        },
      ])
      .addField('#state', [
        {
          rule: 'required',
          errorMessage: 'Обязательное поле',
        },
      ])
      .addField('#price', [
        {
          rule: 'required',
          errorMessage: 'Обязательное поле',
        },
      ])
      .addField('#region', [
        {
          rule: 'required',
          errorMessage: 'Обязательное поле',
        },
      ])
      .addField('#city', [
        {
          validator: (value, fields) => {
            return value > 0 && hasCities || !hasCities;
          },
          errorMessage: 'Обязательное поле',
        },
      ])
      .onSuccess((event) => {
        var formData = new FormData(document.getElementById('form-ads-auto-edit'));

        var messageBox = document.getElementById('message-box');
        if (messageBox.firstChild) messageBox.removeChild(messageBox.firstChild);

        instance.put(`/api/ads/${id}-${car}`, formData)
          .then(() => {
            window.location.replace('/my/cabinet/ads');
          })
          .catch((err) => {
            console.log(err);
            messageBox.append(createErrorMessage(err.response.data.message))
            messageBox.scrollIntoView();
          });
      });
  } else {
    validation
      .addField('#title', [
        {
          rule: 'required',
          errorMessage: 'Обязательное поле',
        },
      ])
      .addField('#price', [
        {
          rule: 'required',
          errorMessage: 'Обязательное поле',
        },
      ])
      .addField('#region', [
        {
          rule: 'required',
          errorMessage: 'Обязательное поле',
        },
      ])
      .addField('#city', [
        {
          validator: (value, fields) => {
            return value > 0 && hasCities || !hasCities;
          },
          errorMessage: 'Обязательное поле',
        },
      ])
      .onSuccess((event) => {
        var formData = new FormData(document.getElementById('form-ads-auto-edit'));

        var messageBox = document.getElementById('message-box');
        if (messageBox.firstChild) messageBox.removeChild(messageBox.firstChild);

        instance.put(`/api/ads/${id}`, formData)
          .then(() => {
            window.location.replace('/my/cabinet/ads');
          })
          .catch((err) => {
            console.log(err);
            messageBox.append(createErrorMessage(err.response.data.message))
            messageBox.scrollIntoView();
          });
      });
  }
}

if (document.getElementById('filter-ads-autos')) {
  document.getElementById('brand').addEventListener('change', (evt) => {
    const brandName = document.getElementById('brand').value;

    instance.get(`/api/car/${brandName}`)
      .then((res) => {
        const subcategorySelect = document.getElementById('model');

        res.data.forEach(element => {
          var option = document.createElement('option');
          option.innerText = element.model;

          option.setAttribute('value', element.model);
          subcategorySelect.appendChild(option);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

if (document.getElementById('filter-ads-parts')) {
  document.getElementById('brand').addEventListener('change', (evt) => {
    const brandName = document.getElementById('brand').value;
    const subcategorySelect = document.getElementById('model');
    const disabled = document.createElement('option');
    disabled.setAttribute('disabled', '');
    disabled.setAttribute('selected', '');
    disabled.innerText = 'Модель...';
    subcategorySelect.innerHTML = '';
    subcategorySelect.appendChild(disabled);

    instance.get(`/api/car/${brandName}`)
      .then((res) => {
        const subcategorySelect = document.getElementById('model');

        res.data.forEach(element => {
          var option = document.createElement('option');
          option.innerText = element.model;

          option.setAttribute('value', element.id);
          subcategorySelect.appendChild(option);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

if (document.getElementById('form-blog-add')) {
  const validation = new JustValidate('#form-blog-add');

  validation
    .addField('#title', [
      {
        rule: 'required',
        errorMessage: 'Обязательное поле',
      },
    ])
    .addField('#content', [
      {
        rule: 'required',
        errorMessage: 'Обязательное поле',
      },
    ])
    .addField('#category', [
      {
        rule: 'required',
        errorMessage: 'Обязательное поле',
      },
    ])
    .onSuccess((event) => {
      var formData = new FormData(document.getElementById('form-blog-add'));

      var messageBox = document.getElementById('message-box');
      if (messageBox.firstChild) messageBox.removeChild(messageBox.firstChild);

      instance.post('/api/blog', formData)
        .then(() => {
          window.location.replace('/my/cabinet/blog');
        })
        .catch((err) => {
          messageBox.append(createErrorMessage(err.response.data.message))
          messageBox.scrollIntoView();
        });
    });
}

if (document.getElementById('form-blog-update')) {
  const validation = new JustValidate('#form-blog-update');

  validation
      .addField('#title', [
        {
          rule: 'required',
          errorMessage: 'Обязательное поле',
        },
      ])
      .addField('#content', [
        {
          rule: 'required',
          errorMessage: 'Обязательное поле',
        },
      ])
      .addField('#category', [
        {
          rule: 'required',
          errorMessage: 'Обязательное поле',
        },
      ])
      .onSuccess((event) => {
        var postId = document.getElementById('id').value;
        var formData = new FormData(document.getElementById('form-blog-update'));

        var messageBox = document.getElementById('message-box');
        if (messageBox.firstChild) messageBox.removeChild(messageBox.firstChild);

        instance.put(`/api/blog/${postId}`, formData)
            .then(() => {
              window.location.replace('/my/cabinet/blog');
            })
            .catch((err) => {
              messageBox.append(createErrorMessage(err.response.data.message))
              messageBox.scrollIntoView();
            });
      });
}

if (document.getElementById('filter-blogs')) {
  document.getElementById('category').addEventListener('change', (evt) => {
    var filters = new URLSearchParams(window.location.search);
    filters.set('cat', evt.target.value);
    window.location.search = filters.toString();
  });
}

if (document.getElementById('form-blog-comment')) {
  const validation = new JustValidate('#form-blog-comment');

  validation
      .addField('#content', [
        {
          rule: 'required',
          errorMessage: 'Обязательное поле',
        },
      ])
      .onSuccess((event) => {
        var postId = document.getElementById('id').value;
        var formData = new FormData(document.getElementById('form-blog-comment'));

        var messageBox = document.getElementById('message-box');
        if (messageBox.firstChild) messageBox.removeChild(messageBox.firstChild);

        instance.post(`/api/blog/${postId}/comment`, formData)
            .then(() => {
              window.location.replace(`/blogs/${postId}`);
            })
            .catch((err) => {
              messageBox.append(createErrorMessage(err.response.data.message))
              messageBox.scrollIntoView();
            });
      });
}

if (document.getElementById('form-user-update')) {
  const validation = new JustValidate('#form-user-update');

  validation
    .addField('#phone', [
      {
        rule: 'required',
        errorMessage: 'Обязательное поле',
      },
    ])
    .onSuccess((event) => {
      var id = document.getElementById('id').value;
      var formData = new FormData(document.getElementById('form-user-update'));

      var messageBox = document.getElementById('message-box');
      if (messageBox.firstChild) messageBox.removeChild(messageBox.firstChild);

      instance.put(`/api/users/${id}`, formData)
        .then((res) => {
          window.location.replace('/my/cabinet/profile');
        })
        .catch((err) => {
          messageBox.append(createErrorMessage(err.response.data.message))
          messageBox.scrollIntoView();
        });
    });
}
